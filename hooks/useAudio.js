import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';

export const useAudio = (audioUrl) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const soundRef = useRef(null);

  // Configure audio session on mount (Native only)
  useEffect(() => {
    const configureAudio = async () => {
      try {
        // Only set audio mode on native platforms
        if (Platform.OS !== 'web' && Audio.setAudioModeAsync) {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
          });
        }
      } catch (error) {
        console.warn('Failed to configure audio:', error);
      }
    };

    configureAudio();

    // Cleanup function
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Update position periodically when playing
  useEffect(() => {
    let interval;
    if (isPlaying && sound) {
      interval = setInterval(async () => {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
          }
        } catch (error) {
          console.warn('Error getting audio status:', error);
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sound]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const loadAudio = async (url = audioUrl) => {
    try {
      setIsLoading(true);
      
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Use a web-compatible audio source
      const audioSource = url || 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3';

      const soundConfig = {
        shouldPlay: false,
        isLooping: false,
        rate: playbackSpeed,
      };

      // Add pitch correction only on mobile platforms
      if (Platform.OS !== 'web') {
        soundConfig.pitchCorrectionQuality = Audio.PitchCorrectionQuality.High;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioSource },
        soundConfig,
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setSound(newSound);
      
      // Get initial status
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
      
      setIsLoading(false);
      return newSound;
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      
      // More specific error messages for different platforms
      const errorMessage = Platform.OS === 'web'
        ? 'Audio playback may require user interaction. Please try clicking the button again.'
        : 'Unable to load story audio. Please check your internet connection and try again.';
        
      Alert.alert('Audio Notice', errorMessage);
      return null;
    }
  };

  const playPause = async () => {
    try {
      if (!sound) {
        const newSound = await loadAudio();
        if (newSound) {
          await newSound.playAsync();
          setIsPlaying(true);
        }
      } else {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
      
      if (Platform.OS === 'web') {
        // On web, audio often requires user interaction
        console.log('Web audio playback - this is normal behavior');
      } else {
        Alert.alert('Playback Error', 'Unable to control audio playback.');
      }
    }
  };

  const stop = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setIsPlaying(false);
        setPosition(0);
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const seek = async (newPosition) => {
    try {
      if (sound && duration > 0) {
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const changeSpeed = async () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    try {
      setPlaybackSpeed(nextSpeed);
      if (sound) {
        await sound.setRateAsync(nextSpeed, Platform.OS !== 'web');
      }
    } catch (error) {
      console.error('Error changing playback speed:', error);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const unload = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
      }
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  };

  return {
    // State
    sound,
    isPlaying,
    isLoading,
    position,
    duration,
    playbackSpeed,
    
    // Actions
    loadAudio,
    playPause,
    stop,
    seek,
    changeSpeed,
    unload,
    
    // Utilities
    formatTime,
  };
};