import { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// Web Speech API fallback for better browser compatibility
const speakWithWebAPI = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'web' || !('speechSynthesis' in window)) {
      reject(new Error('Web Speech API not available'));
      return;
    }

    console.log('Creating utterance for text:', text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.language || 'en-US';

    let hasCompleted = false;

    utterance.onend = () => {
      console.log('Web speech completed for:', text.substring(0, 30) + '...');
      if (!hasCompleted) {
        hasCompleted = true;
        if (options.onDone) options.onDone();
        resolve();
      }
    };

    utterance.onerror = (event) => {
      console.error('Web speech error:', event.error, 'for text:', text.substring(0, 30));
      if (!hasCompleted) {
        hasCompleted = true;
        if (options.onError) options.onError(event.error);
        // Don't reject, just resolve to continue with next sentence
        resolve();
      }
    };

    utterance.onstart = () => {
      console.log('Web speech started for:', text.substring(0, 30) + '...');
    };

    // Add a timeout as backup
    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        console.log('Speech timeout for:', text.substring(0, 30) + '...');
        hasCompleted = true;
        window.speechSynthesis.cancel();
        resolve();
      }
    }, Math.max(text.length * 100, 3000)); // Timeout based on text length

    utterance.onend = () => {
      clearTimeout(timeout);
      if (!hasCompleted) {
        hasCompleted = true;
        console.log('Web speech completed for:', text.substring(0, 30) + '...');
        if (options.onDone) options.onDone();
        resolve();
      }
    };

    // Start speaking
    console.log('Starting speech synthesis for:', text.substring(0, 50) + '...');
    window.speechSynthesis.speak(utterance);
  });
};

export const useTextToSpeech = (storyContent) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentSentence, setCurrentSentence] = useState(0);
  
  const sentences = useRef([]);
  const totalSentences = useRef(0);
  const isCancelled = useRef(false); // Add cancellation flag

  // Break story content into sentences for better progress tracking
  useEffect(() => {
    if (storyContent) {
      console.log('Processing story content:', storyContent.substring(0, 100) + '...');
      
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
      
      console.log('Processed into', sentenceArray.length, 'sentences');
      console.log('First sentence:', sentenceArray[0]);
    }
  }, [storyContent]);

  // Speech configuration options
  const getSpeechOptions = () => {
    const baseOptions = {
      rate: playbackSpeed,
      pitch: 1.0,
      volume: 1.0, // Ensure full volume
    };

    // Platform-specific voice options
    if (Platform.OS === 'ios') {
      baseOptions.language = 'en-US';
      // Remove the specific voice to use iOS default (more reliable)
      delete baseOptions.voice;
      // Use 'default' quality instead of 'enhanced' for better compatibility
      baseOptions.quality = 'default';
      // Remove custom audio session options that might be causing issues
      // baseOptions.iosCategory = 'playback';
      // baseOptions.iosMode = 'spokenAudio';
      // baseOptions.iosOptions = ['defaultToSpeaker', 'allowBluetooth'];
    } else if (Platform.OS === 'android') {
      baseOptions.language = 'en-US';
      baseOptions.quality = 'enhanced';
    } else {
      // Web platform - use browser's speech synthesis
      baseOptions.language = 'en-US';
      // Web doesn't support quality option
    }

    console.log('Speech options:', baseOptions); // Debug log
    return baseOptions;
  };

  const playStory = async () => {
    if (!storyContent || sentences.current.length === 0) {
      console.warn('No story content available');
      console.log('Story content:', storyContent);
      console.log('Sentences:', sentences.current);
      return;
    }

    try {
      setIsLoading(true);
      
      // Reset cancellation flag when starting
      isCancelled.current = false;
      
      // iOS-specific logging
      if (Platform.OS === 'ios') {
        console.log('iOS detected - using simplified speech configuration for better compatibility');
      }
      
      // For web platforms, check if speech synthesis is available
      if (Platform.OS === 'web') {
        if (!('speechSynthesis' in window)) {
          console.error('Speech synthesis not supported in this browser');
          alert('Text-to-speech is not supported in this browser. Please try Chrome, Firefox, Safari, or Edge.');
          setIsLoading(false);
          return;
        }
        
        // Clear any existing speech
        window.speechSynthesis.cancel();
        
        console.log('Starting story narration with', sentences.current.length, 'sentences');
      }
      
      setIsPlaying(true);
      
      // Start from current sentence or beginning
      await speakSentences(currentSentence);
      
    } catch (error) {
      console.error('Error starting text-to-speech:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const speakSentences = async (startIndex = 0) => {
    for (let i = startIndex; i < sentences.current.length; i++) {
      // Check cancellation flag first
      if (isCancelled.current) {
        console.log('Speech cancelled, stopping at sentence', i);
        break;
      }
      
      if (!isPlaying) break; // Stop if paused
      
      setCurrentSentence(i);
      setProgress((i / totalSentences.current) * 100);
      
      const sentence = sentences.current[i];
      const options = getSpeechOptions();
      
      console.log('Speaking sentence', i + 1, 'of', sentences.current.length + ':', sentence);
      
      try {
        // Use different speech methods based on platform
        if (Platform.OS === 'web') {
          // Use Web Speech API directly for better web compatibility
          console.log('Using Web Speech API for:', sentence.substring(0, 50) + '...');
          await speakWithWebAPI(sentence, {
            ...options,
            onDone: () => {
              console.log('Web speech completed for sentence', i + 1);
            },
            onError: (error) => {
              console.error('Web speech error for sentence', i + 1, ':', error);
            }
          });
        } else {
          // Use Expo Speech for native platforms
          console.log('Using Expo Speech for', Platform.OS + ':', sentence.substring(0, 50) + '...');
          console.log('Speech options:', JSON.stringify(options, null, 2));
          
          await new Promise((resolve, reject) => {
            // Longer timeout for iOS speech synthesis
            const timeoutDuration = Platform.OS === 'ios' 
              ? Math.max(sentence.length * 200, 5000) // iOS: longer timeout
              : Math.max(sentence.length * 100, 2000); // Android: standard timeout
              
            const timeoutId = setTimeout(() => {
              console.log('Speech timeout for', Platform.OS + ', continuing to next sentence');
              resolve();
            }, timeoutDuration);
            
            Speech.speak(sentence, {
              ...options,
              onDone: () => {
                clearTimeout(timeoutId);
                console.log('Speech completed for:', sentence.substring(0, 30) + '...');
                resolve();
              },
              onError: (error) => {
                clearTimeout(timeoutId);
                console.error('Speech error for', Platform.OS + ':', error);
                if (Platform.OS === 'ios') {
                  console.log('iOS speech error - this might be due to audio session or permissions');
                }
                resolve();
              },
              onStopped: () => {
                clearTimeout(timeoutId);
                console.log('Speech stopped');
                resolve();
              },
              onStart: () => {
                console.log('Speech started for', Platform.OS + ':', sentence.substring(0, 30) + '...');
              }
            });
          });
        }
      } catch (error) {
        console.error('Error in speakSentences:', error);
        // Continue to next sentence even if this one fails
      }

      // Check if cancelled after sentence completes
      if (isCancelled.current) {
        console.log('Speech cancelled after sentence completion, stopping...');
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
      // Set cancellation flag to stop the sentence loop
      isCancelled.current = true;
      
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        await Speech.stop();
      }
      setIsPlaying(false);
      console.log('Speech paused and cancelled');
    } catch (error) {
      console.error('Error pausing speech:', error);
    }
  };

  const stopStory = async () => {
    try {
      // Set cancellation flag to stop the sentence loop
      isCancelled.current = true;
      
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        await Speech.stop();
      }
      setIsPlaying(false);
      setCurrentSentence(0);
      setProgress(0);
      console.log('Speech stopped and cancelled');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const playPause = async () => {
    if (isPlaying) {
      await pauseStory();
    } else {
      await playStory();
    }
  };

  const skipForward = async () => {
    const newSentence = Math.min(currentSentence + 3, sentences.current.length - 1);
    await Speech.stop();
    setCurrentSentence(newSentence);
    setProgress((newSentence / totalSentences.current) * 100);
    
    if (isPlaying) {
      await speakSentences(newSentence);
    }
  };

  const skipBackward = async () => {
    const newSentence = Math.max(currentSentence - 3, 0);
    await Speech.stop();
    setCurrentSentence(newSentence);
    setProgress((newSentence / totalSentences.current) * 100);
    
    if (isPlaying) {
      await speakSentences(newSentence);
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
        speakSentences(currentSentence);
      }, 100);
    }
  };

  const seekToSentence = async (sentenceIndex) => {
    const newSentence = Math.max(0, Math.min(sentenceIndex, sentences.current.length - 1));
    await Speech.stop();
    setCurrentSentence(newSentence);
    setProgress((newSentence / totalSentences.current) * 100);
    
    if (isPlaying) {
      await speakSentences(newSentence);
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