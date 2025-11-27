// Simple Web Speech API test
// Run this in browser console to test basic functionality

const testWebSpeechAPI = () => {
  console.log('🎤 Testing Web Speech API...');
  
  // Check if Web Speech API is available
  if (!('speechSynthesis' in window)) {
    console.error('❌ Web Speech API not available');
    return false;
  }
  
  console.log('✅ Web Speech API is available');
  
  // Check available voices
  const voices = speechSynthesis.getVoices();
  console.log('📢 Available voices:', voices.length);
  voices.forEach((voice, index) => {
    console.log(`Voice ${index}: ${voice.name} (${voice.lang})`);
  });
  
  // Test simple speech
  const utterance = new SpeechSynthesisUtterance('Hello, this is a test');
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  utterance.onstart = () => {
    console.log('🎵 Speech started');
  };
  
  utterance.onend = () => {
    console.log('🎵 Speech ended');
  };
  
  utterance.onerror = (event) => {
    console.error('❌ Speech error:', event.error);
  };
  
  console.log('🎤 Starting speech...');
  speechSynthesis.speak(utterance);
  
  return true;
};

// Test Chinese speech
const testChineseSpeech = () => {
  console.log('🎤 Testing Chinese speech...');
  
  if (!('speechSynthesis' in window)) {
    console.error('❌ Web Speech API not available');
    return false;
  }
  
  const utterance = new SpeechSynthesisUtterance('你好，这是一个测试');
  utterance.lang = 'zh-CN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  utterance.onstart = () => {
    console.log('🎵 Chinese speech started');
  };
  
  utterance.onend = () => {
    console.log('🎵 Chinese speech ended');
  };
  
  utterance.onerror = (event) => {
    console.error('❌ Chinese speech error:', event.error);
  };
  
  console.log('🎤 Starting Chinese speech...');
  speechSynthesis.speak(utterance);
  
  return true;
};

// Auto-run tests
console.log('🎤 Running Web Speech API tests...');
setTimeout(() => {
  testWebSpeechAPI();
}, 1000);

setTimeout(() => {
  testChineseSpeech();
}, 3000);

// Make functions available globally for manual testing
window.testWebSpeechAPI = testWebSpeechAPI;
window.testChineseSpeech = testChineseSpeech;