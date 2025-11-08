// Audio Loading Test Utility
// This file helps debug MP3 loading issues

import { Audio } from 'expo-av';

// Test function to verify audio file loading
export const testAudioLoading = async () => {
  console.log('🔍 Testing MP3 audio file loading...');
  
  const testFiles = [
    { name: 'Twinkle Twinkle', file: require('../assets/audio/songs/twinkle-twinkle.mp3') },
    { name: 'ABC Song', file: require('../assets/audio/songs/abc-song.mp3') },
    { name: 'If You\'re Happy', file: require('../assets/audio/songs/if-your-happy.mp3') },
    { name: 'Wheels on Bus', file: require('../assets/audio/songs/wheels-on-bus.mp3') },
    { name: 'Rain Rain Go Away', file: require('../assets/audio/songs/rain-rain-go-away.mp3') },
    { name: 'Five Little Ducks', file: require('../assets/audio/songs/five-little-ducks.mp3') }
  ];
  
  const results = [];
  
  for (const { name, file } of testFiles) {
    try {
      console.log(`Testing ${name}...`);
      console.log('File object:', file);
      
      const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: false });
      await sound.unloadAsync();
      
      results.push({ name, status: 'SUCCESS', file });
      console.log(`✅ ${name}: SUCCESS`);
      
    } catch (error) {
      results.push({ name, status: 'FAILED', error: error.message, file });
      console.error(`❌ ${name}: FAILED -`, error.message);
    }
  }
  
  console.log('\n📊 Audio Loading Test Results:');
  results.forEach(({ name, status, error }) => {
    console.log(`${status === 'SUCCESS' ? '✅' : '❌'} ${name}: ${status}${error ? ` (${error})` : ''}`);
  });
  
  return results;
};

// Export individual file objects for debugging
export const audioFiles = {
  twinkleTwinkle: require('../assets/audio/songs/twinkle-twinkle.mp3'),
  abcSong: require('../assets/audio/songs/abc-song.mp3'),
  ifYourHappy: require('../assets/audio/songs/if-your-happy.mp3'),
  wheelsOnBus: require('../assets/audio/songs/wheels-on-bus.mp3'),
  rainRainGoAway: require('../assets/audio/songs/rain-rain-go-away.mp3'),
  fiveLittleDucks: require('../assets/audio/songs/five-little-ducks.mp3')
};

console.log('🔧 Audio test utility loaded. Call testAudioLoading() to run tests.');