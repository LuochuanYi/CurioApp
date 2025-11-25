// Enhanced Text-to-Speech with Multilingual Voice Support
import { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { logSpeech, logError } from '../utils/logger';

// Comprehensive voice configuration for natural pronunciation
const MULTILINGUAL_VOICES = {
  'en': {
    ios: { language: 'en-US', voice: 'com.apple.ttsbundle.Samantha-compact', rate: 1.0, pitch: 1.0 },
    android: { language: 'en-US', engine: 'com.google.android.tts', rate: 1.0, pitch: 1.0 },
    web: { lang: 'en-US', voiceName: 'Google US English', rate: 1.0, pitch: 1.0 }
  },
  'zh': {
    ios: { language: 'zh-CN', voice: 'com.apple.ttsbundle.Ting-Ting-compact', rate: 0.8, pitch: 1.1 },
    android: { language: 'zh-CN', engine: 'com.google.android.tts', rate: 0.8, pitch: 1.1 },
    web: { lang: 'zh-CN', voiceName: 'Google 普通话（中国大陆）', rate: 0.8, pitch: 1.1 }
  },
  'fr': {
    ios: { language: 'fr-FR', voice: 'com.apple.ttsbundle.Thomas-compact', rate: 0.9, pitch: 0.95 },
    android: { language: 'fr-FR', engine: 'com.google.android.tts', rate: 0.9, pitch: 0.95 },
    web: { lang: 'fr-FR', voiceName: 'Google français', rate: 0.9, pitch: 0.95 }
  },
  'es': {
    ios: { language: 'es-ES', voice: 'com.apple.ttsbundle.Monica-compact', rate: 0.95, pitch: 1.05 },
    android: { language: 'es-ES', engine: 'com.google.android.tts', rate: 0.95, pitch: 1.05 },
    web: { lang: 'es-ES', voiceName: 'Google español', rate: 0.95, pitch: 1.05 }
  },
  'uk': {
    ios: { language: 'uk-UA', voice: 'com.apple.ttsbundle.Lesya-compact', rate: 0.85, pitch: 0.9 },
    android: { language: 'uk-UA', engine: 'com.google.android.tts', rate: 0.85, pitch: 0.9 },
    web: { lang: 'uk-UA', voiceName: 'Ukrainian', rate: 0.85, pitch: 0.9 }
  },
  'nl': {
    ios: { language: 'nl-NL', voice: 'com.apple.ttsbundle.Xander-compact', rate: 0.9, pitch: 1.0 },
    android: { language: 'nl-NL', engine: 'com.google.android.tts', rate: 0.9, pitch: 1.0 },
    web: { lang: 'nl-NL', voiceName: 'Google Nederlands', rate: 0.9, pitch: 1.0 }
  }
};

// Voice accent preferences
const ACCENT_MODES = {
  NATIVE: 'native',           // Use native language voice
  ENGLISH_ACCENT: 'english',  // Use English voice for all languages
  ADAPTIVE: 'adaptive'        // Smart selection based on content
};

export const useMultilingualTTS = (content, options = {}) => {
  const { getCurrentLanguageInfo } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [progress, setProgress] = useState(0);
  const [accentMode, setAccentMode] = useState(options.accentMode || ACCENT_MODES.NATIVE);
  const [playbackSpeed, setPlaybackSpeed] = useState(options.speed || 1.0);
  
  const sentences = useRef([]);
  const isCancelled = useRef(false);

  // Get current language context
  const getLanguageContext = () => {
    const current = getCurrentLanguageInfo();
    const langCode = getLanguageCode(current?.name);
    return {
      displayName: current?.name || 'English',
      code: langCode,
      needsTranslation: langCode !== 'en'
    };
  };

  // Get optimal voice configuration
  const getVoiceConfig = (languageCode = null) => {
    const context = getLanguageContext();
    const targetLang = languageCode || context.code;
    
    // Handle accent preferences
    let voiceLang = targetLang;
    if (accentMode === ACCENT_MODES.ENGLISH_ACCENT) {
      voiceLang = 'en';
    } else if (accentMode === ACCENT_MODES.ADAPTIVE) {
      // Use English for mixed content, native for pure language content
      voiceLang = hasEnglishWords(content) ? 'en' : targetLang;
    }
    
    const platform = Platform.OS;
    const voiceConfig = MULTILINGUAL_VOICES[voiceLang]?.[platform] || MULTILINGUAL_VOICES['en'][platform];
    
    return {
      ...voiceConfig,
      rate: voiceConfig.rate * playbackSpeed,
      volume: 1.0,
      // Platform-specific enhancements
      ...(platform === 'ios' && {
        quality: 'enhanced',
        iosCategory: 'playback',
        iosOptions: ['defaultToSpeaker', 'allowBluetooth']
      })
    };
  };

  // Enhanced sentence processing with language detection
  const processSentences = (text) => {
    if (!text) return [];
    
    // Smart sentence splitting that preserves meaning
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 2)
      .map(s => {
        // Ensure proper punctuation
        if (!/[.!?]$/.test(s)) return s + '.';
        return s;
      });
    
    // Detect mixed-language content for adaptive voice selection
    return sentences.map(sentence => ({
      text: sentence,
      language: detectLanguage(sentence),
      hasNumbers: /\d+/.test(sentence),
      hasProperNouns: /[A-Z][a-z]+/.test(sentence)
    }));
  };

  // Platform-optimized speech synthesis
  const speakSentence = async (sentenceObj, config) => {
    const { text } = sentenceObj;
    
    if (Platform.OS === 'web') {
      return speakWithWebAPI(text, config);
    } else {
      return speakWithExpo(text, config);
    }
  };

  // Web Speech API with voice selection
  const speakWithWebAPI = (text, config) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        logError('Web Speech API not available');
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced web voice configuration
      utterance.lang = config.lang || config.language;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;
      
      // Try to select specific voice if available
      if (config.voiceName) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => 
          v.name.includes(config.voiceName) || v.lang === config.lang
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          logSpeech(`Selected voice: ${selectedVoice.name} (${selectedVoice.lang})`);
        }
      }

      let completed = false;
      const timeout = setTimeout(() => {
        if (!completed) {
          completed = true;
          window.speechSynthesis.cancel();
          resolve();
        }
      }, Math.max(text.length * 100, 3000));

      utterance.onend = () => {
        if (!completed) {
          completed = true;
          clearTimeout(timeout);
          resolve();
        }
      };

      utterance.onerror = () => {
        if (!completed) {
          completed = true;
          clearTimeout(timeout);
          resolve();
        }
      };

      logSpeech(`Web TTS: "${text.substring(0, 30)}..." in ${config.lang}`);
      window.speechSynthesis.speak(utterance);
    });
  };

  // Expo Speech API with enhanced configuration
  const speakWithExpo = (text, config) => {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        logSpeech('Speech timeout, continuing...');
        resolve();
      }, Math.max(text.length * 150, 4000));

      logSpeech(`Expo TTS: "${text.substring(0, 30)}..." in ${config.language}`);
      
      Speech.speak(text, {
        ...config,
        onDone: () => {
          clearTimeout(timeout);
          logSpeech('Speech completed');
          resolve();
        },
        onError: (error) => {
          clearTimeout(timeout);
          logError('Speech error:', error);
          resolve();
        },
        onStopped: () => {
          clearTimeout(timeout);
          logSpeech('Speech stopped');
          resolve();
        }
      });
    });
  };

  // Main playback function with multilingual support
  const playContent = async (startIndex = 0) => {
    if (!content || sentences.current.length === 0) return;

    isCancelled.current = false;
    setIsPlaying(true);

    for (let i = startIndex; i < sentences.current.length; i++) {
      if (isCancelled.current) break;

      setCurrentSentence(i);
      setProgress((i / sentences.current.length) * 100);

      const sentenceObj = sentences.current[i];
      
      // Get voice config for this sentence (may vary for mixed content)
      const voiceConfig = getVoiceConfig(sentenceObj.language);
      
      // Speak the sentence
      await speakSentence(sentenceObj, voiceConfig);

      if (isCancelled.current) break;

      // Natural pause between sentences
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (!isCancelled.current) {
      setProgress(100);
      setCurrentSentence(0);
    }
    setIsPlaying(false);
  };

  // Control functions
  const playPause = async () => {
    if (isPlaying) {
      isCancelled.current = true;
      if (Platform.OS === 'web') {
        window.speechSynthesis?.cancel();
      } else {
        await Speech.stop();
      }
      setIsPlaying(false);
    } else {
      await playContent(currentSentence);
    }
  };

  const stop = async () => {
    isCancelled.current = true;
    if (Platform.OS === 'web') {
      window.speechSynthesis?.cancel();
    } else {
      await Speech.stop();
    }
    setIsPlaying(false);
    setCurrentSentence(0);
    setProgress(0);
  };

  const changeAccent = () => {
    const modes = Object.values(ACCENT_MODES);
    const currentIndex = modes.indexOf(accentMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setAccentMode(nextMode);
    
    if (isPlaying) {
      stop().then(() => {
        setTimeout(() => playContent(currentSentence), 200);
      });
    }
  };

  const changeSpeed = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    
    if (isPlaying) {
      stop().then(() => {
        setTimeout(() => playContent(currentSentence), 200);
      });
    }
  };

  // Initialize sentences when content changes
  useEffect(() => {
    if (content) {
      sentences.current = processSentences(content);
      setCurrentSentence(0);
      setProgress(0);
    }
  }, [content]);

  return {
    // State
    isPlaying,
    progress,
    currentSentence,
    accentMode,
    playbackSpeed,
    
    // Controls
    playPause,
    stop,
    changeAccent,
    changeSpeed,
    
    // Configuration
    getVoiceConfig,
    getLanguageContext,
    
    // Utilities
    availableAccents: Object.values(ACCENT_MODES),
    currentLanguage: getLanguageContext().displayName,
    totalSentences: sentences.current.length
  };
};

// Helper functions
const getLanguageCode = (displayName) => {
  const mapping = {
    'English': 'en', 'Chinese': 'zh', 'French': 'fr',
    'Spanish': 'es', 'Ukrainian': 'uk', 'Flemish': 'nl'
  };
  return mapping[displayName] || 'en';
};

const detectLanguage = (text) => {
  // Simple language detection based on character patterns
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[àâäçéèêëïîôöùûüÿ]/.test(text)) return 'fr';
  if (/[áéíóúñü]/.test(text)) return 'es';
  if (/[абвгдеєжзийклмнопрстуфхцчшщьюя]/.test(text)) return 'uk';
  if (/[äëïöü]/.test(text)) return 'nl';
  return 'en';
};

const hasEnglishWords = (text) => {
  // Check if text contains significant English content
  const englishWords = /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/i;
  return englishWords.test(text);
};

export { ACCENT_MODES, MULTILINGUAL_VOICES };
export default useMultilingualTTS;