import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// Simple melody generation as fallback when real audio files aren't available
const createSimpleMelody = (songId, duration) => {
  if (Platform.OS !== 'web' || !window.AudioContext) {
    return null;
  }

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let isPlaying = false;
  let oscillators = [];
  
  // Enhanced melodies for each song - more complete and musical
  const melodies = {
    'twinkle-star': [
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, // Twinkle twinkle little star
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63  // How I wonder what you are
    ],
    'abc-song': [
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, // A B C D E F G H
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25  // I J K L M N O P
    ],
    'if-youre-happy': [
      349.23, 349.23, 392.00, 440.00, 392.00, 349.23, // If you're happy and you know it
      349.23, 349.23, 392.00, 440.00, 392.00, 349.23  // clap your hands
    ],
    'wheels-on-bus': [
      293.66, 329.63, 349.23, 329.63, 293.66, 329.63, 349.23, // The wheels on the bus go
      392.00, 440.00, 392.00, 349.23, 293.66, 329.63, 293.66  // round and round
    ],
    'rain-rain-go-away': [
      329.63, 293.66, 261.63, 293.66, // Rain rain go away
      329.63, 293.66, 261.63, 293.66  // Come again another day
    ],
    'five-little-ducks': [
      261.63, 293.66, 329.63, 349.23, 392.00, // Five little ducks went
      329.63, 293.66, 261.63, 293.66, 329.63  // swimming one day
    ]
  };

  const melody = melodies[songId] || melodies['twinkle-star'];
  
  return {
    // Mimic Expo AV Sound API
    playAsync: async () => {
      if (isPlaying || audioContext.state === 'closed') return;
      
      // Resume audio context if suspended (required by modern browsers)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      isPlaying = true;
      console.log('Starting simple melody for:', songId);
      
      const masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.setValueAtTime(0.12, audioContext.currentTime); // Gentle volume

      const noteDuration = 0.8; // Slightly shorter notes for better rhythm
      const pauseDuration = 0.1; // Shorter pause
      const totalNoteDuration = noteDuration + pauseDuration;
      const melodyDuration = melody.length * totalNoteDuration;
      const totalLoops = Math.ceil(Math.max(duration, 30) / melodyDuration); // At least 30 seconds
      
      console.log(`Playing enhanced melody: ${melody.length} notes, ${totalLoops} loops, ${duration}s total`);
      
      // Create looping melody with harmony
      for (let loop = 0; loop < totalLoops && isPlaying; loop++) {
        melody.forEach((frequency, noteIndex) => {
          if (!isPlaying) return;
          
          const startTime = audioContext.currentTime + (loop * melodyDuration) + (noteIndex * totalNoteDuration);
          
          // Main melody
          const mainOscillator = audioContext.createOscillator();
          const mainGain = audioContext.createGain();
          
          mainOscillator.connect(mainGain);
          mainGain.connect(masterGain);
          
          mainOscillator.frequency.setValueAtTime(frequency, startTime);
          mainOscillator.type = 'triangle'; // Warmer sound than sine
          
          // Smooth envelope
          mainGain.gain.setValueAtTime(0, startTime);
          mainGain.gain.linearRampToValueAtTime(0.4, startTime + 0.1);
          mainGain.gain.linearRampToValueAtTime(0.3, startTime + noteDuration - 0.1);
          mainGain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
          
          mainOscillator.start(startTime);
          mainOscillator.stop(startTime + noteDuration);
          oscillators.push(mainOscillator);
          
          // Add gentle harmony (fifth above)
          if (noteIndex % 2 === 0) { // Every other note
            const harmonyOscillator = audioContext.createOscillator();
            const harmonyGain = audioContext.createGain();
            
            harmonyOscillator.connect(harmonyGain);
            harmonyGain.connect(masterGain);
            
            harmonyOscillator.frequency.setValueAtTime(frequency * 1.5, startTime); // Perfect fifth
            harmonyOscillator.type = 'sine';
            
            // Quieter harmony
            harmonyGain.gain.setValueAtTime(0, startTime);
            harmonyGain.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
            harmonyGain.gain.linearRampToValueAtTime(0.1, startTime + noteDuration - 0.1);
            harmonyGain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
            
            harmonyOscillator.start(startTime);
            harmonyOscillator.stop(startTime + noteDuration);
            oscillators.push(harmonyOscillator);
          }
          
          // Add subtle bass notes on strong beats
          if (noteIndex % 4 === 0) { // Every fourth note
            const bassOscillator = audioContext.createOscillator();
            const bassGain = audioContext.createGain();
            
            bassOscillator.connect(bassGain);
            bassGain.connect(masterGain);
            
            bassOscillator.frequency.setValueAtTime(frequency * 0.5, startTime); // Octave below
            bassOscillator.type = 'sawtooth';
            
            // Gentle bass
            bassGain.gain.setValueAtTime(0, startTime);
            bassGain.gain.linearRampToValueAtTime(0.08, startTime + 0.1);
            bassGain.gain.linearRampToValueAtTime(0.05, startTime + noteDuration - 0.1);
            bassGain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
            
            bassOscillator.start(startTime);
            bassOscillator.stop(startTime + noteDuration);
            oscillators.push(bassOscillator);
          }
        });
      }
    },
    
    pauseAsync: async () => {
      console.log('Pausing simple melody');
      isPlaying = false;
      oscillators.forEach(osc => {
        try { 
          if (osc.stop) osc.stop(); 
        } catch (e) {
          console.warn('Error stopping oscillator:', e);
        }
      });
      oscillators = [];
    },
    
    stopAsync: async () => {
      console.log('Stopping simple melody');
      isPlaying = false;
      oscillators.forEach(osc => {
        try { 
          if (osc.stop) osc.stop(); 
        } catch (e) {
          console.warn('Error stopping oscillator:', e);
        }
      });
      oscillators = [];
    },
    
    setVolumeAsync: async (volume) => {
      console.log('Volume change requested:', volume);
      // Volume is controlled by the gain node during playback
    },
    
    setRateAsync: async (rate, shouldCorrectPitch) => {
      console.log('Rate change requested:', rate);
      // Rate changes would require recreating the melody
    },
    
    setPositionAsync: async (position) => {
      console.log('Position change requested:', position);
      // Position seeking would require recreating from that point
    },
    
    unloadAsync: async () => {
      console.log('Unloading simple melody');
      isPlaying = false;
      oscillators.forEach(osc => {
        try { 
          if (osc.stop) osc.stop(); 
        } catch (e) {}
      });
      oscillators = [];
      
      if (audioContext && audioContext.state !== 'closed') {
        try {
          await audioContext.close();
        } catch (e) {
          console.warn('Error closing audio context:', e);
        }
      }
    }
  };
};

// Enhanced music player hook for sign-along songs with real audio playback
export const useMusicPlayer = (song) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.3); // Lower volume for background
  const [speechVolume, setSpeechVolume] = useState(1.0);

  // Refs for controlling playback
  const timeUpdateInterval = useRef(null);
  const audioSound = useRef(null);
  const isCancelled = useRef(false);

  // Initialize audio and calculate duration
  useEffect(() => {
    const setupAudio = async () => {
      // Clear any previous errors
      setError(null);
      setIsLoading(false);
      
      if (song?.lyrics?.length > 0) {
        const lastLyric = song.lyrics[song.lyrics.length - 1];
        setDuration(lastLyric.endTime || 30);
      }

      // Initialize audio if song exists and background music is enabled
      if (song && backgroundMusicEnabled) {
        try {
          // Set up audio mode for mobile platforms
          if (Platform.OS !== 'web') {
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: false,
              staysActiveInBackground: true,
              playsInSilentModeIOS: true,
              shouldDuckAndroid: true,
              playThroughEarpieceAndroid: false,
            });
          }

          // Check if we have a real audio file to load
          if (song.audioFile) {
            console.log('Attempting to load audio file for:', song.title);
            console.log('Audio file type:', typeof song.audioFile);
            console.log('Audio file value:', song.audioFile);
            
            try {
              // For Expo, when using require(), the audioFile is already the correct format
              // We can pass it directly to Audio.Sound.createAsync
              console.log('Creating Expo Audio.Sound with required asset');
              
              const { sound } = await Audio.Sound.createAsync(
                song.audioFile, // Direct use of require()'d asset
                { 
                  shouldPlay: false, 
                  isLooping: true,
                  volume: musicVolume 
                }
              );
              
              audioSound.current = sound;
              console.log('✅ Real MP3 audio loaded successfully for:', song.title);
              
            } catch (audioError) {
              console.error('❌ Failed to load real audio file:', audioError);
              console.log('🎵 Falling back to synthetic melody');
              
              // Use fallback melody generation
              if (Platform.OS === 'web' && window.AudioContext) {
                audioSound.current = createSimpleMelody(song.id, duration);
                console.log('✅ Fallback melody created for:', song.title);
              }
            }
          } else {
            console.log('No audio file available, using fallback melody for:', song.title);
            
            // Use fallback melody generation
            if (Platform.OS === 'web' && window.AudioContext) {
              audioSound.current = createSimpleMelody(song.id, duration);
            }
          }
          
        } catch (error) {
          console.error('❌ Audio setup failed:', error.message);
          console.error('Full error:', error);
          console.log('🎵 Using fallback melody generation');
          
          // Fallback to simple Web Audio melody for immediate testing
          if (Platform.OS === 'web' && window.AudioContext) {
            audioSound.current = createSimpleMelody(song.id, duration);
            console.log('✅ Fallback melody system active');
          }
        }
      }
    };

    setupAudio();

    // Cleanup function
    return () => {
      if (audioSound.current) {
        audioSound.current.unloadAsync();
        audioSound.current = null;
      }
    };
  }, [song, backgroundMusicEnabled]);

  // Update current lyric based on playback time
  useEffect(() => {
    if (song?.lyrics && currentTime > 0) {
      const currentLyric = song.lyrics.find(lyric => 
        currentTime >= lyric.startTime && currentTime < lyric.endTime
      );
      
      if (currentLyric) {
        const newIndex = song.lyrics.indexOf(currentLyric);
        if (newIndex !== currentLyricIndex) {
          setCurrentLyricIndex(newIndex);
        }
      }
    }
  }, [currentTime, song, currentLyricIndex]);

  // Time update loop for playback
  useEffect(() => {
    if (isPlaying && !isPaused) {
      timeUpdateInterval.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + (0.1 * playbackRate); // Update every 100ms
          
          // Auto-stop at end
          if (newTime >= duration) {
            handleStop();
            return 0;
          }
          
          return newTime;
        });
      }, 100);
    } else {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
        timeUpdateInterval.current = null;
      }
    }

    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, [isPlaying, isPaused, playbackRate, duration]);

  // Play the song with optional text-to-speech narration
  const handlePlay = async (withNarration = false) => {
    if (!song) {
      setError('No song loaded');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      isCancelled.current = false;

      if (withNarration) {
        await playWithNarration();
      } else {
        setIsPlaying(true);
        setIsPaused(false);
        
        // Start background music for music-only mode
        if (backgroundMusicEnabled && audioSound.current) {
          console.log('Starting music-only playback for:', song.title);
          try {
            if (audioSound.current.setVolumeAsync) {
              await audioSound.current.setVolumeAsync(musicVolume);
            }
            if (audioSound.current.setRateAsync) {
              await audioSound.current.setRateAsync(playbackRate, true);
            }
            await audioSound.current.playAsync();
            console.log('Music-only playback started successfully');
          } catch (error) {
            console.warn('Error starting music-only playback:', error);
          }
        }
        
        // Show helpful message about audio type
        if (!song.audioFile && !audioSound.current) {
          console.log('🔇 Playing in text-to-speech mode - no background music available');
        } else if (audioSound.current) {
          if (song.audioFile) {
            console.log('🎵 Playing with REAL MP3 audio:', song.title);
          } else {
            console.log('🎼 Playing with synthetic fallback melody:', song.title);
          }
        }
      }
    } catch (err) {
      console.error('Error playing song:', err);
      const errorMessage = err.message.includes('require') 
        ? 'Audio files not found - using text-to-speech mode' 
        : err.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Play with text-to-speech narration and background music
  const playWithNarration = async () => {
    if (!song?.lyrics) return;

    setIsPlaying(true);
    setIsPaused(false);

    try {
      // Start background music if available
      if (backgroundMusicEnabled && audioSound.current) {
        console.log('Starting background music for:', song.title);
        console.log('Audio sound object:', audioSound.current);
        try {
          if (audioSound.current.setVolumeAsync) {
            await audioSound.current.setVolumeAsync(musicVolume);
            console.log('Volume set to:', musicVolume);
          }
          if (audioSound.current.setRateAsync) {
            await audioSound.current.setRateAsync(playbackRate, true);
            console.log('Playback rate set to:', playbackRate);
          }
          await audioSound.current.playAsync();
          console.log('Background music started successfully');
        } catch (error) {
          console.warn('Error starting background music:', error);
        }
      } else {
        console.log('Background music not available. Enabled:', backgroundMusicEnabled, 'Audio object:', !!audioSound.current);
      }

      // Calculate total narration time
      const totalNarrationTime = song.lyrics.reduce((total, lyric) => {
        return total + (lyric.endTime - lyric.startTime);
      }, 0);

      console.log('Total narration time:', totalNarrationTime, 'seconds');

      for (let i = 0; i < song.lyrics.length; i++) {
        if (isCancelled.current) break;

        const lyric = song.lyrics[i];
        setCurrentLyricIndex(i);
        setCurrentTime(lyric.startTime);

        // Speak the lyric with timing
        await speakLyric(lyric.line, {
          rate: playbackRate * 0.8, // Slightly slower for sing-along
          pitch: 1.0,
          language: 'en-US',
          volume: speechVolume
        });

        // Wait for the lyric timing to complete (with some overlap for natural flow)
        if (!isCancelled.current) {
          const waitTime = (lyric.endTime - lyric.startTime) * 1000 / playbackRate; // Adjust for playback rate
          await new Promise(resolve => setTimeout(resolve, Math.max(500, waitTime * 0.4))); // Minimum 500ms, overlap timing
        }
      }

      // Song completed
      if (!isCancelled.current) {
        handleStop();
      }
    } catch (error) {
      console.error('Error during narrated playback:', error);
      setError('Narration failed');
      handleStop();
    }
  };

  // Speak a single lyric line
  const speakLyric = (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'web') {
        // Use Web Speech API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = options.rate || playbackRate;
          utterance.pitch = options.pitch || 1.0;
          utterance.volume = options.volume || speechVolume;

          utterance.onend = () => resolve();
          utterance.onerror = (error) => reject(error);

          window.speechSynthesis.speak(utterance);
        } else {
          resolve(); // Skip if not supported
        }
      } else {
        // Use Expo Speech for native platforms
        Speech.speak(text, {
          rate: options.rate || playbackRate,
          pitch: options.pitch || 1.0,
          language: options.language || 'en-US',
          volume: options.volume || speechVolume,
          onDone: () => resolve(),
          onError: (error) => reject(error)
        });
      }
    });
  };

  // Pause playback
  const handlePause = async () => {
    try {
      isCancelled.current = true;
      setIsPaused(true);
      setIsPlaying(false);

      // Stop any speech synthesis
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        await Speech.stop();
      }

      // Pause background music if available
      if (audioSound.current) {
        await audioSound.current.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing:', error);
    }
  };

  // Resume playback
  const handleResume = async () => {
    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
      isCancelled.current = false;

      // Resume background music if available and enabled
      if (backgroundMusicEnabled && audioSound.current) {
        try {
          await audioSound.current.playAsync();
        } catch (error) {
          console.warn('Could not resume background music:', error);
        }
      }
    }
  };

  // Stop playback completely
  const handleStop = async () => {
    try {
      isCancelled.current = true;
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
      setCurrentLyricIndex(0);

      // Stop any speech synthesis
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        await Speech.stop();
      }

      // Stop background music
      if (audioSound.current) {
        await audioSound.current.stopAsync();
        await audioSound.current.setPositionAsync(0); // Reset to beginning
      }

      // Clear any intervals
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
        timeUpdateInterval.current = null;
      }
    } catch (error) {
      console.error('Error stopping:', error);
    }
  };

  // Seek to specific time
  const seekTo = (timeInSeconds) => {
    const clampedTime = Math.max(0, Math.min(timeInSeconds, duration));
    setCurrentTime(clampedTime);
    
    // Find the appropriate lyric index for this time
    const lyricIndex = song?.lyrics?.findIndex(lyric => 
      clampedTime >= lyric.startTime && clampedTime < lyric.endTime
    ) || 0;
    
    setCurrentLyricIndex(Math.max(0, lyricIndex));
  };

  // Jump to specific lyric
  const jumpToLyric = (lyricIndex) => {
    if (!song?.lyrics || lyricIndex < 0 || lyricIndex >= song.lyrics.length) {
      return;
    }

    const lyric = song.lyrics[lyricIndex];
    setCurrentLyricIndex(lyricIndex);
    setCurrentTime(lyric.startTime);
  };

  // Change playback rate
  const changePlaybackRate = async (rate) => {
    const clampedRate = Math.max(0.5, Math.min(2.0, rate));
    setPlaybackRate(clampedRate);

    // Update background music playback rate if playing
    if (audioSound.current && isPlaying) {
      try {
        await audioSound.current.setRateAsync(clampedRate, true);
      } catch (error) {
        console.warn('Could not change music playback rate:', error);
      }
    }
  };

  // Change speech volume
  const changeSpeechVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setSpeechVolume(clampedVolume);
  };

  // Change music volume
  const changeMusicVolume = async (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setMusicVolume(clampedVolume);

    // Update background music volume if available
    if (audioSound.current) {
      try {
        await audioSound.current.setVolumeAsync(clampedVolume);
      } catch (error) {
        console.warn('Could not change music volume:', error);
      }
    }
  };

  // Toggle background music
  const toggleBackgroundMusic = async () => {
    const newState = !backgroundMusicEnabled;
    setBackgroundMusicEnabled(newState);

    if (audioSound.current) {
      if (newState && isPlaying) {
        // Enable and play
        try {
          await audioSound.current.playAsync();
        } catch (error) {
          console.warn('Could not start background music:', error);
        }
      } else {
        // Disable and pause
        try {
          await audioSound.current.pauseAsync();
        } catch (error) {
          console.warn('Could not stop background music:', error);
        }
      }
    }
  };

  // Skip forward/backward
  const skipForward = (seconds = 5) => {
    seekTo(currentTime + seconds);
  };

  const skipBackward = (seconds = 5) => {
    seekTo(currentTime - seconds);
  };

  // Get current lyric data
  const getCurrentLyric = () => {
    return song?.lyrics?.[currentLyricIndex] || null;
  };

  // Get progress as percentage
  const getProgress = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  // Format time display
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get lyrics with timing information
  const getLyricsWithTiming = () => {
    if (!song?.lyrics) return [];
    
    return song.lyrics.map((lyric, index) => ({
      ...lyric,
      index,
      isActive: index === currentLyricIndex,
      isPast: index < currentLyricIndex,
      isFuture: index > currentLyricIndex
    }));
  };

  // Practice mode - slow playback for learning
  const enablePracticeMode = () => {
    changePlaybackRate(0.7);
  };

  const disablePracticeMode = () => {
    changePlaybackRate(1.0);
  };

  return {
    // State
    isPlaying,
    isPaused,
    currentTime,
    duration,
    currentLyricIndex,
    volume: speechVolume,
    playbackRate,
    isLoading,
    error,
    backgroundMusicEnabled,
    musicVolume,
    speechVolume,

    // Actions
    play: handlePlay,
    pause: handlePause,
    resume: handleResume,
    stop: handleStop,
    seekTo,
    jumpToLyric,
    skipForward,
    skipBackward,

    // Settings
    changePlaybackRate,
    changeSpeechVolume,
    changeMusicVolume,
    toggleBackgroundMusic,
    enablePracticeMode,
    disablePracticeMode,

    // Utilities
    getCurrentLyric,
    getProgress,
    formatTime,
    getLyricsWithTiming,
  };
};