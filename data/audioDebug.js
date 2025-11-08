// Audio Debug Test
// This file helps debug audio loading issues

console.log('=== AUDIO DEBUG TEST ===');

try {
  console.log('Testing audio file imports...');
  
  const twinkleTwinkleAudio = require('../assets/audio/songs/twinkle-twinkle.mp3');
  console.log('✅ Twinkle Twinkle audio loaded:', twinkleTwinkleAudio);
  
  const abcSongAudio = require('../assets/audio/songs/abc-song.mp3');
  console.log('✅ ABC Song audio loaded:', abcSongAudio);
  
  const ifYourHappyAudio = require('../assets/audio/songs/if-your-happy.mp3');
  console.log('✅ If Your Happy audio loaded:', ifYourHappyAudio);
  
  const wheelsOnBusAudio = require('../assets/audio/songs/wheels-on-bus.mp3');
  console.log('✅ Wheels on Bus audio loaded:', wheelsOnBusAudio);
  
  const rainRainGoAwayAudio = require('../assets/audio/songs/rain-rain-go-away.mp3');
  console.log('✅ Rain Rain Go Away audio loaded:', rainRainGoAwayAudio);
  
  const fiveLittleDucksAudio = require('../assets/audio/songs/five-little-ducks.mp3');
  console.log('✅ Five Little Ducks audio loaded:', fiveLittleDucksAudio);
  
  console.log('✅ All audio files imported successfully!');
  
} catch (error) {
  console.error('❌ Error importing audio files:', error);
}

export {
  twinkleTwinkleAudio,
  abcSongAudio, 
  ifYourHappyAudio,
  wheelsOnBusAudio,
  rainRainGoAwayAudio,
  fiveLittleDucksAudio
};