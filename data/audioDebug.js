// Audio Debug Test
// This file helps debug audio loading issues
// Logs disabled to improve performance

// console.log('=== AUDIO DEBUG TEST ==='); // Disabled to reduce log noise

// Debug logging disabled to improve performance and reduce memory usage
let twinkleTwinkleAudio, abcSongAudio, ifYourHappyAudio, wheelsOnBusAudio, rainRainGoAwayAudio, fiveLittleDucksAudio;

try {
  // Load audio files without verbose logging
  twinkleTwinkleAudio = require('../assets/audio/songs/twinkle-twinkle.mp3');
  abcSongAudio = require('../assets/audio/songs/abc-song.mp3');
  ifYourHappyAudio = require('../assets/audio/songs/if-your-happy.mp3');
  wheelsOnBusAudio = require('../assets/audio/songs/wheels-on-bus.mp3');
  rainRainGoAwayAudio = require('../assets/audio/songs/rain-rain-go-away.mp3');
  fiveLittleDucksAudio = require('../assets/audio/songs/five-little-ducks.mp3');
  
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