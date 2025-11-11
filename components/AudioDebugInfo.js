import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logAudio } from '../utils/logger.js';

export const AudioDebugInfo = ({ audioSound, song }) => {
  const testAudio = async () => {
    logAudio('🎵 Testing audio playback for:', song?.title);
    
    if (audioSound?.current) {
      try {
        await audioSound.current.playAsync();
        logAudio('✅ Audio play successful');
      } catch (error) {
        logAudio('❌ Audio play failed:', error.message);
      }
    } else {
      logAudio('❌ No audio sound object available');
    }
  };

  const stopAudio = async () => {
    if (audioSound?.current) {
      try {
        await audioSound.current.stopAsync();
        logAudio('✅ Audio stopped');
      } catch (error) {
        logAudio('❌ Audio stop failed:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Debug Info</Text>
      <Text style={styles.info}>Song: {song?.title || 'No song'}</Text>
      <Text style={styles.info}>Audio File: {song?.audioFile ? 'Available' : 'None'}</Text>
      <Text style={styles.info}>Audio Sound: {audioSound?.current ? 'Loaded' : 'Not loaded'}</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={testAudio}>
          <Text style={styles.buttonText}>Test Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopAudio}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    marginBottom: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});