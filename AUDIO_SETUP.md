# Background Music Setup for Sign-Along Songs

## Overview
The app now supports real audio file playback as background music for the sign-along songs. Each song has an `audioFile` property that points to the corresponding audio file.

## Current Song Audio Files
All songs now have `audioFile` properties configured:

1. **Twinkle, Twinkle, Little Star** - `twinkle-twinkle.mp3`
2. **ABC Song** - `abc-song.mp3` 
3. **If You're Happy and You Know It** - `if-youre-happy.mp3`
4. **The Wheels on the Bus** - `wheels-on-bus.mp3`
5. **Rain, Rain, Go Away** - `rain-rain-go-away.mp3`
6. **Five Little Ducks** - `five-little-ducks.mp3`

## How to Add Real Audio Files

### Option 1: Local Audio Files (Recommended for Development)
1. Create the `assets/audio/songs/` folder in your project root
2. Add your audio files with the exact names listed above
3. Update the `audioFile` paths in `data/songs.js` to use local files:
   ```javascript
   audioFile: require('../../assets/audio/songs/twinkle-twinkle.mp3')
   ```

### Option 2: Online Audio Files (Current Setup)
- The app currently uses placeholder URLs
- Replace these with actual royalty-free music URLs
- Ensure CORS headers allow cross-origin access for web playbook

### Option 3: Generate Simple Audio (Fallback)
If no audio files are available, the app will:
- Display a note about missing audio files
- Continue with text-to-speech narration only
- Show music controls but they won't produce sound

## Royalty-Free Music Sources
- **Freesound.org** - Creative Commons licensed sounds
- **YouTube Audio Library** - Free background music
- **Pixabay Music** - Royalty-free tracks
- **Zapsplat** - Sound effects and music (requires account)

## Testing Audio
1. Start the app: `npm start`
2. Navigate to Engage → Select any song
3. Tap "Play with Narration"
4. Toggle "Background Music ON"
5. Adjust volume levels as needed

## Technical Notes
- Audio files are loaded using Expo AV
- Supports MP3, WAV, and other common formats
- Files are set to loop during narration
- Volume and playback rate can be controlled independently
- Cross-platform support (iOS, Android, Web)

## Troubleshooting
- **No sound**: Check audio file paths and CORS settings
- **Loading errors**: Verify file format and accessibility
- **Performance issues**: Consider compressing audio files
- **Web issues**: Ensure HTTPS for external audio URLs