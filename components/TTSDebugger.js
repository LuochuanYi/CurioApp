import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const TTSDebugger = ({ content, title = "TTS Debug" }) => {
  const {
    playPause,
    stopStory,
    isPlaying,
    isLoading,
    progress,
    formatProgress,
    totalSentences,
    currentSentence
  } = useTextToSpeech(content);

  useEffect(() => {
    console.log('🎤 TTS Debugger:', {
      title,
      content: content ? content.substring(0, 100) + '...' : 'NO CONTENT',
      contentLength: content?.length || 0,
      totalSentences,
      isPlaying,
      isLoading
    });
  }, [content, totalSentences, isPlaying, isLoading, title]);

  const testSpeech = () => {
    console.log('🎤 Testing speech with content:', content ? 'AVAILABLE' : 'MISSING');
    console.log('🎤 Content preview:', content?.substring(0, 200));
    playPause();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>Content: {content ? `${content.length} chars` : 'None'}</Text>
      <Text style={styles.info}>Sentences: {totalSentences}</Text>
      <Text style={styles.info}>Status: {isLoading ? 'Loading' : isPlaying ? 'Playing' : 'Stopped'}</Text>
      <Text style={styles.info}>Progress: {formatProgress()}</Text>
      
      <TouchableOpacity 
        style={[styles.button, isPlaying && styles.activeButton]} 
        onPress={testSpeech}
      >
        <Text style={styles.buttonText}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'} Test
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={stopStory}>
        <Text style={styles.buttonText}>⏹️ Stop</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          console.log('🎤 Testing basic Web Speech API...');
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Testing speech synthesis');
            utterance.onstart = () => console.log('🎵 Test speech started');
            utterance.onend = () => console.log('🎵 Test speech ended');
            utterance.onerror = (e) => console.error('❌ Test speech error:', e.error);
            speechSynthesis.speak(utterance);
          } else {
            console.error('❌ Web Speech API not available');
          }
        }}
      >
        <Text style={styles.buttonText}>🧪 Test Web API</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TTSDebugger;