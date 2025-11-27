import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';
import { useLanguage } from '../contexts/LanguageContext';

const TranslationDebugComponent = () => {
  const { translateContent } = useDynamicTranslation();
  const { currentLanguage, setLanguage, getCurrentLanguageInfo } = useLanguage();
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testTranslation = async () => {
    console.log('🧪 Starting translation test...');
    setIsLoading(true);
    setTestResult('Testing...');

    try {
      // Test the exact story title
      const result = await translateContent('The Three Little Pigs');
      console.log('🧪 Test result:', result);
      console.log('🧪 Is Chinese?:', /[\u4e00-\u9fff]/.test(result));
      setTestResult(result);
    } catch (error) {
      console.log('🧪 Test error:', error);
      setTestResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToChinese = () => {
    console.log('🧪 Switching to Chinese...');
    setLanguage('Chinese');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translation Debug Test</Text>
      
      <Text style={styles.info}>Current Language: {currentLanguage}</Text>
      <Text style={styles.info}>
        Language Info: {JSON.stringify(getCurrentLanguageInfo())}
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={switchToChinese}>
        <Text style={styles.buttonText}>Switch to Chinese</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testTranslation} 
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Translation'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.result}>
        Result: {testResult}
      </Text>
      
      <Text style={styles.hint}>
        Expected: "三只小猪" (The Three Little Pigs in Chinese)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  result: {
    fontSize: 16,
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    minHeight: 40,
  },
  hint: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default TranslationDebugComponent;