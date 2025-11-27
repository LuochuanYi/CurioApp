import { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { logSpeech, logError, logWarn } from '../utils/logger';

// Ensure voices are loaded
const ensureVoicesLoaded = () => {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        resolve(voices);
      }
    };
    
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    // Fallback timeout
    setTimeout(() => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      resolve(speechSynthesis.getVoices());
    }, 2000);
  });
};

// Web Speech API fallback for better browser compatibility
const speakWithWebAPI = async (text, options = {}, cancellationRef = null) => {
  console.log('🎤 speakWithWebAPI called with text:', text.substring(0, 100) + '...');
  console.log('🎤 speakWithWebAPI options:', options);
  
  return new Promise(async (resolve, reject) => {
    if (Platform.OS !== 'web' || !('speechSynthesis' in window)) {
      console.error('❌ Web Speech API not available');
      reject(new Error('Web Speech API not available'));
      return;
    }

    try {
      // Ensure voices are loaded
      console.log('🎤 Loading voices...');
      const voices = await ensureVoicesLoaded();
      console.log('🎤 Available voices:', voices.length);
      
      // Cancel any existing speech
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        // Wait a bit for cancellation to complete
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      logSpeech('Creating utterance for text:', text.substring(0, 50) + '...');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      // Detect language and set appropriate voice
      const isChineseText = /[\u4e00-\u9fff]/.test(text);
      utterance.lang = isChineseText ? 'zh-CN' : (options.language || 'en-US');
      
      // Try to find a suitable voice
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(isChineseText ? 'zh' : 'en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('🎤 Using voice:', preferredVoice.name, preferredVoice.lang);
      } else {
        console.warn('🎤 No suitable voice found, using default');
      }
      
      logSpeech(isChineseText ? 'Detected Chinese text' : 'Using English voice');

      let hasCompleted = false;

      const cleanup = (timeout) => {
        if (timeout) clearTimeout(timeout);
        hasCompleted = true;
      };

      utterance.onstart = () => {
        console.log('🎵 Speech started:', text.substring(0, 30) + '...');
        logSpeech('Web speech started for:', text.substring(0, 30) + '...');
      };

      utterance.onend = () => {
        console.log('🎵 Speech completed:', text.substring(0, 30) + '...');
        logSpeech('Web speech completed for:', text.substring(0, 30) + '...');
        if (!hasCompleted) {
          hasCompleted = true;
          clearInterval(cancellationCheck);
          clearTimeout(timeout);
          if (options.onDone) options.onDone();
          resolve();
        }
      };

      utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error, 'for text:', text.substring(0, 30));
        logError('Web speech error:', event.error, 'for text:', text.substring(0, 30));
        
        if (!hasCompleted) {
          hasCompleted = true;
          clearInterval(cancellationCheck);
          clearTimeout(timeout);
          if (options.onError) options.onError(event.error);
          // Don't reject, just resolve to continue with next sentence
          resolve();
        }
      };

      // Add a timeout as backup and periodic cancellation check
      const timeout = setTimeout(() => {
        if (!hasCompleted) {
          console.warn('🎤 Speech timeout for:', text.substring(0, 30) + '...');
          logSpeech('Speech timeout for:', text.substring(0, 30) + '...');
          cleanup();
          speechSynthesis.cancel();
          resolve();
        }
      }, Math.max(text.length * 100, 5000)); // Longer timeout
      
      // Check for cancellation every 100ms
      const cancellationCheck = setInterval(() => {
        if (cancellationRef && cancellationRef.current && !hasCompleted) {
          console.log('🎤 Periodic cancellation check - stopping speech');
          clearInterval(cancellationCheck);
          clearTimeout(timeout);
          hasCompleted = true;
          speechSynthesis.cancel();
          resolve();
        }
      }, 100);

      // Check if cancelled before starting
      if (cancellationRef && cancellationRef.current) {
        console.log('🎤 Speech cancelled before starting');
        resolve();
        return;
      }
      
      // Start speaking
      console.log('🎤 Starting speech synthesis for:', text.substring(0, 50) + '...');
      logSpeech('Starting speech synthesis for:', text.substring(0, 50) + '...');
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('❌ Speech synthesis error:', error);
      reject(error);
    }
  });
};

export const useTextToSpeech = (storyContent) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentSentence, setCurrentSentence] = useState(0);
  
  // Debug logging for state changes
  useEffect(() => {
    console.log('🎤 TTS State Update:', { isPlaying, isLoading, progress, currentSentence });
  }, [isPlaying, isLoading, progress, currentSentence]);
  
  const sentences = useRef([]);
  const totalSentences = useRef(0);
  const isCancelled = useRef(false); // Add cancellation flag

  // Break story content into sentences for better progress tracking
  useEffect(() => {
    console.log('🎤 TTS useEffect triggered with content:', storyContent ? `${storyContent.length} chars` : 'null/undefined');
    
    if (storyContent) {
      logSpeech('Processing story content:', storyContent.substring(0, 100) + '...');
      
      // Split by periods, exclamation marks, and question marks, but keep the punctuation
      const sentenceArray = storyContent
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 3) // Filter out very short fragments
        .map(s => {
          // Add period if sentence doesn't end with punctuation
          if (!/[.!?]$/.test(s)) {
            return s + '.';
          }
          return s;
        });
      
      sentences.current = sentenceArray;
      totalSentences.current = sentenceArray.length;
      setProgress(0);
      setCurrentSentence(0);
      
      logSpeech('Processed into', sentenceArray.length, 'sentences');
      logSpeech('First sentence:', sentenceArray[0]);
      console.log('🎤 TTS Content processed:', {
        totalSentences: sentenceArray.length,
        firstSentence: sentenceArray[0],
        lastSentence: sentenceArray[sentenceArray.length - 1]
      });
    } else {
      console.log('🎤 TTS No content available, clearing sentences');
      sentences.current = [];
      totalSentences.current = 0;
      setProgress(0);
      setCurrentSentence(0);
    }
  }, [storyContent]);

  // Speech configuration options with bilingual support
  const getSpeechOptions = (text = '') => {
    const baseOptions = {
      rate: playbackSpeed,
      pitch: 1.0,
      volume: 1.0, // Ensure full volume
    };

    // Detect if text contains Chinese characters
    const isChineseText = /[\u4e00-\u9fff]/.test(text);
    
    // Platform-specific voice options
    if (Platform.OS === 'ios') {
      baseOptions.language = isChineseText ? 'zh-CN' : 'en-US';
      // Use 'default' quality instead of 'enhanced' for better compatibility
      baseOptions.quality = 'default';
      if (isChineseText) {
        logSpeech('iOS: Using Chinese voice for text');
      }
    } else if (Platform.OS === 'android') {
      baseOptions.language = isChineseText ? 'zh-CN' : 'en-US';
      baseOptions.quality = 'enhanced';
      if (isChineseText) {
        logSpeech('Android: Using Chinese voice for text');
      }
    } else {
      // Web platform - language detection handled in speakWithWebAPI
      baseOptions.language = isChineseText ? 'zh-CN' : 'en-US';
      if (isChineseText) {
        logSpeech('Web: Using Chinese voice for text');
      }
    }

    logSpeech('Speech options for', isChineseText ? 'Chinese' : 'English', 'text:', baseOptions);
    return baseOptions;
  };

  const playStory = async () => {
    if (!storyContent || sentences.current.length === 0) {
      logWarn('No story content available');
      logSpeech('Story content:', storyContent);
      logSpeech('Sentences:', sentences.current);
      
      // Try to alert user about the issue
      if (Platform.OS === 'web') {
        console.error('Text-to-Speech: No content available');
        console.error('Debug info:', {
          storyContent: storyContent ? `${storyContent.length} chars` : 'null/undefined',
          sentencesLength: sentences.current.length,
          firstSentence: sentences.current[0],
          totalSentences: totalSentences.current
        });
        alert('No story content available for reading. Please try reloading the story.');
      }
      return;
    }

    try {
      setIsLoading(true);
      
      // Reset cancellation flag when starting
      isCancelled.current = false;
      
      // iOS-specific logging
      if (Platform.OS === 'ios') {
        logSpeech('iOS detected - using simplified speech configuration for better compatibility');
      }
      
      // For web platforms, check if speech synthesis is available
      if (Platform.OS === 'web') {
        if (!('speechSynthesis' in window)) {
          logError('Speech synthesis not supported in this browser');
          alert('Text-to-speech is not supported in this browser. Please try Chrome, Firefox, Safari, or Edge.');
          setIsLoading(false);
          return;
        }
        
        // Check if speech synthesis is ready
        if (window.speechSynthesis.speaking) {
          logSpeech('Stopping existing speech before starting new one');
          window.speechSynthesis.cancel();
          // Wait a bit for it to stop
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        logSpeech('Starting story narration with', sentences.current.length, 'sentences');
        logSpeech('First sentence preview:', sentences.current[0]?.substring(0, 50) + '...');
      }
      
      console.log('🎤 About to setIsPlaying(true)');
      setIsPlaying(prev => {
        console.log('🎤 setIsPlaying: changing from', prev, 'to true');
        return true;
      });
      
      console.log('🎤 About to setIsLoading(false) - should show stop button now');
      setIsLoading(false);
      
      console.log('🎤 About to call speakSentences with currentSentence:', currentSentence);
      console.log('🎤 Passing shouldPlay=true to avoid state timing issues');
      
      // Start from current sentence or beginning
      // Pass true explicitly to avoid React state timing issues
      await speakSentences(currentSentence, true);
      
    } catch (error) {
      logError('Error starting text-to-speech:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const speakSentences = async (startIndex = 0, shouldPlay = true) => {
    console.log('🎤 speakSentences called with startIndex:', startIndex, 'shouldPlay:', shouldPlay);
    console.log('🎤 sentences.current.length:', sentences.current.length);
    
    for (let i = startIndex; i < sentences.current.length; i++) {
      console.log('🎤 Loop iteration:', i, 'shouldPlay:', shouldPlay, 'isCancelled:', isCancelled.current);
      
      // Check cancellation flag first
      if (isCancelled.current) {
        logSpeech('Speech cancelled, stopping at sentence', i);
        break;
      }
      
      // Use the passed shouldPlay parameter instead of isPlaying state
      if (!shouldPlay) {
        console.log('🎤 Breaking loop because shouldPlay is false');
        break; // Stop if paused
      }
      
      setCurrentSentence(i);
      setProgress((i / totalSentences.current) * 100);
      
      const sentence = sentences.current[i];
      const options = getSpeechOptions(sentence);
      
      logSpeech('Speaking sentence', i + 1, 'of', sentences.current.length + ':', sentence);
      
      try {
        // Use different speech methods based on platform
        if (Platform.OS === 'web') {
          // Check cancellation before starting each sentence
          if (isCancelled.current) {
            console.log('🎤 Cancellation detected before speaking sentence', i + 1);
            break;
          }
          
          // Use Web Speech API directly for better web compatibility
          console.log('🎤 About to call speakWithWebAPI for sentence:', i + 1, sentence.substring(0, 50) + '...');
          logSpeech('Using Web Speech API for:', sentence.substring(0, 50) + '...');
          
          try {
            await speakWithWebAPI(sentence, {
              ...options,
              onDone: () => {
                console.log('🎵 Web speech callback - onDone for sentence', i + 1);
                logSpeech('Web speech completed for sentence', i + 1);
              },
              onError: (error) => {
                console.error('❌ Web speech callback - onError for sentence', i + 1, ':', error);
                logError('Web speech error for sentence', i + 1, ':', error);
              }
            }, isCancelled);
            console.log('🎤 speakWithWebAPI completed for sentence:', i + 1);
            
            // Check cancellation after each sentence
            if (isCancelled.current) {
              console.log('🎤 Cancellation detected after sentence', i + 1);
              break;
            }
          } catch (error) {
            console.error('❌ speakWithWebAPI threw error for sentence', i + 1, ':', error);
            // Continue to next sentence even if this one fails
          }
        } else {
          // Use Expo Speech for native platforms
          logSpeech('Using Expo Speech for', Platform.OS + ':', sentence.substring(0, 50) + '...');
          logSpeech('Speech options:', JSON.stringify(options, null, 2));
          
          await new Promise((resolve, reject) => {
            // Longer timeout for iOS speech synthesis
            const timeoutDuration = Platform.OS === 'ios' 
              ? Math.max(sentence.length * 200, 5000) // iOS: longer timeout
              : Math.max(sentence.length * 100, 2000); // Android: standard timeout
              
            const timeoutId = setTimeout(() => {
              logSpeech('Speech timeout for', Platform.OS + ', continuing to next sentence');
              resolve();
            }, timeoutDuration);
            
            Speech.speak(sentence, {
              ...options,
              onDone: () => {
                clearTimeout(timeoutId);
                logSpeech('Speech completed for:', sentence.substring(0, 30) + '...');
                resolve();
              },
              onError: (error) => {
                clearTimeout(timeoutId);
                logError('Speech error for', Platform.OS + ':', error);
                if (Platform.OS === 'ios') {
                  logSpeech('iOS speech error - this might be due to audio session or permissions');
                }
                resolve();
              },
              onStopped: () => {
                clearTimeout(timeoutId);
                logSpeech('Speech stopped');
                resolve();
              },
              onStart: () => {
                logSpeech('Speech started for', Platform.OS + ':', sentence.substring(0, 30) + '...');
              }
            });
          });
        }
      } catch (error) {
        logError('Error in speakSentences:', error);
        // Continue to next sentence even if this one fails
      }

      // Check if cancelled after sentence completes
      if (isCancelled.current) {
        logSpeech('Speech cancelled after sentence completion, stopping...');
        break;
      }

      // Small pause between sentences for natural flow
      if (isPlaying && !isCancelled.current) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Story completed
    if (isPlaying && !isCancelled.current) {
      setProgress(100);
      setCurrentSentence(0);
      setIsPlaying(false);
    }
  };

  const pauseStory = async () => {
    try {
      console.log('🎤 Pausing speech - setting cancellation flag');
      // Set cancellation flag to stop the sentence loop
      isCancelled.current = true;
      setIsPlaying(prev => {
        console.log('🎤 pauseStory: changing isPlaying from', prev, 'to false');
        return false;
      });
      
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        console.log('🎤 Cancelling web speech synthesis');
        window.speechSynthesis.cancel();
      } else {
        console.log('🎤 Stopping native speech');
        await Speech.stop();
      }
      
      logSpeech('Speech paused and cancelled');
    } catch (error) {
      logError('Error pausing speech:', error);
    }
  };

  const stopStory = async () => {
    try {
      console.log('🎤 Stopping speech - setting cancellation flag and resetting position');
      // Set cancellation flag to stop the sentence loop
      isCancelled.current = true;
      setIsPlaying(false);
      setCurrentSentence(0);
      setProgress(0);
      
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        console.log('🎤 Cancelling web speech synthesis');
        window.speechSynthesis.cancel();
      } else {
        console.log('🎤 Stopping native speech');
        await Speech.stop();
      }
      
      logSpeech('Speech stopped and cancelled');
    } catch (error) {
      logError('Error stopping speech:', error);
    }
  };

  const playPause = async () => {
    console.log('🎤 playPause called - current isPlaying:', isPlaying);
    if (isPlaying) {
      console.log('🎤 Calling pauseStory');
      await pauseStory();
    } else {
      console.log('🎤 Calling playStory');
      await playStory();
    }
  };

  const skipForward = async () => {
    const newSentence = Math.min(currentSentence + 3, sentences.current.length - 1);
    await Speech.stop();
    setCurrentSentence(newSentence);
    setProgress((newSentence / totalSentences.current) * 100);
    
    if (isPlaying) {
      await speakSentences(newSentence, isPlaying);
    }
  };

  const skipBackward = async () => {
    const newSentence = Math.max(currentSentence - 3, 0);
    await Speech.stop();
    setCurrentSentence(newSentence);
    setProgress((newSentence / totalSentences.current) * 100);
    
    if (isPlaying) {
      await speakSentences(newSentence, isPlaying);
    }
  };

  const changeSpeed = async () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    setPlaybackSpeed(nextSpeed);
    
    // If currently playing, restart with new speed
    if (isPlaying) {
      await Speech.stop();
      setTimeout(() => {
        speakSentences(currentSentence, true);
      }, 100);
    }
  };

  const seekToSentence = async (sentenceIndex) => {
    const newSentence = Math.max(0, Math.min(sentenceIndex, sentences.current.length - 1));
    await Speech.stop();
    setCurrentSentence(newSentence);
    setProgress((newSentence / totalSentences.current) * 100);
    
    if (isPlaying) {
      await speakSentences(newSentence, isPlaying);
    }
  };

  const formatProgress = () => {
    const current = Math.floor(progress);
    return `${current}% - Sentence ${currentSentence + 1} of ${totalSentences.current}`;
  };

  const getCurrentText = () => {
    return sentences.current[currentSentence] || '';
  };

  return {
    // State
    isPlaying,
    isLoading,
    progress,
    playbackSpeed,
    currentSentence,
    totalSentences: totalSentences.current,
    
    // Actions
    playPause,
    stopStory,
    skipForward,
    skipBackward,
    changeSpeed,
    seekToSentence,
    
    // Utilities
    formatProgress,
    getCurrentText,
  };
};
