import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { logAudio, logError } from '../utils/logger';

// Simple audio test component to debug audio loading issues
export const AudioTestButton = ({ audioFile, title = 'Test Audio' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const testAudio = async () => {
    setIsLoading(true);
    
    try {
      logAudio('Testing audio file:', title, audioFile);
      
      // Configure audio mode for better compatibility
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and load the sound
      const { sound: audioSound } = await Audio.Sound.createAsync(
        audioFile,
        {
          shouldPlay: false,
          isLooping: false,
          volume: 0.5,
          progressUpdateIntervalMillis: 1000,
        },
        // Status callback for debugging
        (status) => {
          logAudio('Audio status update:', {
            isLoaded: status.isLoaded,
            isPlaying: status.isPlaying,
            positionMillis: status.positionMillis,
            durationMillis: status.durationMillis,
            error: status.error
          });
          
          if (status.error) {
            logError('Audio error in status callback:', status.error);
            Alert.alert('Audio Error', status.error);
          }
        }
      );

      setSound(audioSound);
      
      // Get the audio status
      const status = await audioSound.getStatusAsync();
      logAudio('Initial audio status:', status);
      
      if (status.isLoaded) {
        // Play the audio
        await audioSound.playAsync();
        setIsPlaying(true);
        
        Alert.alert(
          'Audio Test Success!', 
          `${title} loaded and playing successfully!\nDuration: ${Math.round((status.durationMillis || 0) / 1000)}s`
        );
        
        // Stop after 3 seconds for testing
        setTimeout(async () => {
          if (audioSound) {
            await audioSound.stopAsync();
            await audioSound.unloadAsync();
            setIsPlaying(false);
            setSound(null);
          }
        }, 3000);
        
      } else {
        throw new Error('Audio failed to load: ' + (status.error || 'Unknown error'));
      }
      
    } catch (error) {
      logError('Audio test failed:', error);
      Alert.alert(
        'Audio Test Failed',
        `Error: ${error.message}\n\nThis helps identify the specific audio loading issue.`,
        [
          { text: 'OK' },
          { 
            text: 'Retry', 
            onPress: () => testAudio() 
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      } catch (error) {
        logError('Error stopping audio:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={isPlaying ? stopAudio : testAudio}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : isPlaying ? `Stop ${title}` : `Test ${title}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AudioTestButton;