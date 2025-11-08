import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  Alert
} from 'react-native';
import { getSongById, SONG_DIFFICULTIES, SONG_CATEGORIES } from '../data/songs';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const { width: screenWidth } = Dimensions.get('window');

const SongPlayerScreen = ({ route, navigation }) => {
  const { song: songData } = route.params || {};
  const [song, setSong] = useState(null);
  const [showSignInstructions, setShowSignInstructions] = useState(true);
  const [selectedSign, setSelectedSign] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);

  // Use the music player hook for all audio functionality
  const musicPlayer = useMusicPlayer(song);

  useEffect(() => {
    if (songData) {
      // If song object is passed directly
      setSong(songData);
    } else if (route.params?.songId) {
      // If song ID is passed, get from data
      const foundSong = getSongById(route.params.songId);
      if (foundSong) {
        setSong(foundSong);
      } else {
        Alert.alert('Song not found', 'The requested song could not be loaded.');
        navigation.goBack();
      }
    } else {
      Alert.alert('No song data', 'No song information was provided.');
      navigation.goBack();
    }
  }, [songData, route.params]);

  // Handle practice mode changes
  useEffect(() => {
    if (practiceMode) {
      musicPlayer.enablePracticeMode();
    } else {
      musicPlayer.disablePracticeMode();
    }
  }, [practiceMode]);

  const handlePlayPause = () => {
    if (musicPlayer.isPlaying) {
      musicPlayer.pause();
    } else if (musicPlayer.isPaused) {
      musicPlayer.resume();
    } else {
      // Start playback - this app uses text-to-speech narration for sign-along learning
      musicPlayer.play(true); // true = with text-to-speech narration
      console.log('Starting song with text-to-speech narration...');
    }
  };

  const handleStop = () => {
    musicPlayer.stop();
  };

  const handleLyricPress = (lyricIndex) => {
    musicPlayer.jumpToLyric(lyricIndex);
  };

  const handleSignPress = (sign) => {
    setSelectedSign(selectedSign?.word === sign.word ? null : sign);
  };

  const togglePracticeMode = () => {
    setPracticeMode(!practiceMode);
    if (!practiceMode) {
      handleStop(); // Stop playback when entering practice mode
    }
  };

  if (!song) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading song...</Text>
      </View>
    );
  }

  const currentLyric = musicPlayer.getCurrentLyric();
  const difficulty = SONG_DIFFICULTIES[song.difficulty.toUpperCase()];
  const category = SONG_CATEGORIES[song.category.toUpperCase()];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <View style={styles.songMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficulty?.color }]}>
              <Text style={styles.badgeText}>{difficulty?.icon} {difficulty?.name}</Text>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: category?.color }]}>
              <Text style={styles.badgeText}>{category?.icon} {category?.name}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          onPress={togglePracticeMode}
          style={[styles.modeButton, practiceMode && styles.activeModeButton]}
          accessibilityLabel="Toggle practice mode"
        >
          <Text style={styles.modeIcon}>{practiceMode ? '📚' : '🎵'}</Text>
        </TouchableOpacity>
      </View>

      {/* Song Info Card */}
      <View style={styles.songInfoCard}>
        <View style={styles.songIconContainer}>
          <Text style={styles.songIcon}>{song.icon}</Text>
        </View>
        <View style={styles.songDetails}>
          <Text style={styles.duration}>{song.duration}</Text>
          <Text style={styles.ageGroup}>{song.ageGroup}</Text>
          <Text style={styles.description}>{song.description}</Text>
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{musicPlayer.formatTime(musicPlayer.currentTime)}</Text>
          <TouchableOpacity 
            style={styles.progressBar}
            onPress={(event) => {
              const { locationX } = event.nativeEvent;
              const progressBarWidth = event.currentTarget.offsetWidth || 200;
              const percentage = locationX / progressBarWidth;
              const newTime = percentage * musicPlayer.duration;
              musicPlayer.seekTo(newTime);
            }}
          >
            <View 
              style={[
                styles.progressFill, 
                { width: `${musicPlayer.getProgress()}%` }
              ]} 
            />
          </TouchableOpacity>
          <Text style={styles.timeText}>{musicPlayer.formatTime(musicPlayer.duration)}</Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            onPress={() => musicPlayer.skipBackward(5)}
            style={styles.controlButton}
            accessibilityLabel="Skip backward 5 seconds"
          >
            <Text style={styles.controlIcon}>⏪</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleStop}
            style={styles.controlButton}
            accessibilityLabel="Stop"
          >
            <Text style={styles.controlIcon}>⏹️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handlePlayPause}
            style={[styles.controlButton, styles.playButton]}
            accessibilityLabel={musicPlayer.isPlaying ? "Pause" : "Play"}
            disabled={musicPlayer.isLoading}
          >
            <Text style={styles.playIcon}>
              {musicPlayer.isLoading ? '⏳' : musicPlayer.isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => musicPlayer.skipForward(5)}
            style={styles.controlButton}
            accessibilityLabel="Skip forward 5 seconds"
          >
            <Text style={styles.controlIcon}>⏩</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setShowSignInstructions(!showSignInstructions)}
            style={[styles.controlButton, showSignInstructions && styles.activeControlButton]}
            accessibilityLabel="Toggle sign instructions"
          >
            <Text style={styles.controlIcon}>👋</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Error Display */}
        {musicPlayer.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {musicPlayer.error}</Text>
            <TouchableOpacity 
              onPress={() => musicPlayer.stop()}
              style={styles.errorButton}
            >
              <Text style={styles.errorButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Playback Info */}
        <View style={styles.playbackInfoSection}>
          <Text style={styles.sectionTitle}>🎵 Playback Settings</Text>
          <View style={styles.playbackInfoCard}>
            <View style={styles.infoNote}>
              <Text style={styles.infoNoteIcon}>🎤</Text>
              <Text style={styles.infoNoteText}>
                This app uses text-to-speech narration to help you learn the lyrics and practice sign language gestures. Background music support is configured but requires actual audio files to be loaded.
              </Text>
            </View>
            
            <View style={styles.audioFileInfo}>
              <Text style={styles.audioFileLabel}>🎵 Background Music:</Text>
              <Text style={styles.audioFileName}>
                {song.audioFile ? `${song.title}.mp3` : 'No audio file'}
              </Text>
              <Text style={styles.audioFileNote}>
                {song.audioFile 
                  ? 'Real audio file configured. Toggle background music ON to hear it.'
                  : '🎶 No background music file available. Using text-to-speech narration only.'}
              </Text>
              <Text style={styles.audioFileNote}>
                💡 Tip: Click the ▶️ Play button first, then toggle Background Music ON.
              </Text>
            </View>
            
            {/* Speed Control */}
            <View style={styles.playbackInfoItem}>
              <Text style={styles.playbackInfoLabel}>Speed:</Text>
              <TouchableOpacity 
                onPress={() => musicPlayer.changePlaybackRate(
                  musicPlayer.playbackRate === 1.0 ? 0.7 : 1.0
                )}
                style={styles.speedButton}
              >
                <Text style={styles.speedButtonText}>
                  {musicPlayer.playbackRate}x {musicPlayer.playbackRate < 1.0 ? '(Practice)' : '(Normal)'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Background Music Toggle */}
            <View style={styles.playbackInfoItem}>
              <Text style={styles.playbackInfoLabel}>Background Music:</Text>
              <TouchableOpacity 
                onPress={musicPlayer.toggleBackgroundMusic}
                style={[
                  styles.toggleButton,
                  { backgroundColor: musicPlayer.backgroundMusicEnabled ? '#4ecdc4' : '#95a5a6' }
                ]}
              >
                <Text style={styles.toggleButtonText}>
                  {musicPlayer.backgroundMusicEnabled ? '🎵 ON' : '🔇 OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Volume Controls */}
            <View style={styles.volumeSection}>
              <Text style={styles.volumeSectionTitle}>Volume Controls</Text>
              
              <View style={styles.volumeControl}>
                <Text style={styles.volumeLabel}>🎤 Voice: {Math.round(musicPlayer.speechVolume * 100)}%</Text>
                <View style={styles.volumeSliderContainer}>
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => musicPlayer.changeSpeechVolume(level)}
                      style={[
                        styles.volumeButton,
                        { backgroundColor: musicPlayer.speechVolume >= level ? '#4ecdc4' : '#e9ecef' }
                      ]}
                    />
                  ))}
                </View>
              </View>

              {musicPlayer.backgroundMusicEnabled && (
                <View style={styles.volumeControl}>
                  <Text style={styles.volumeLabel}>🎵 Music: {Math.round(musicPlayer.musicVolume * 100)}%</Text>
                  <View style={styles.volumeSliderContainer}>
                    {[0.1, 0.2, 0.3, 0.4, 0.5].map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => musicPlayer.changeMusicVolume(level)}
                        style={[
                          styles.volumeButton,
                          { backgroundColor: musicPlayer.musicVolume >= level ? '#f39c12' : '#e9ecef' }
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Mode Display */}
            <View style={styles.playbackInfoItem}>
              <Text style={styles.playbackInfoLabel}>Mode:</Text>
              <Text style={styles.playbackInfoValue}>
                {practiceMode ? '📚 Practice Mode' : '🎵 Sign-Along Mode'}
              </Text>
            </View>
          </View>
        </View>

        {/* Learning Goals */}
        <View style={styles.learningGoalsSection}>
          <Text style={styles.sectionTitle}>🎯 Learning Goals</Text>
          <View style={styles.goalsContainer}>
            {song.learningGoals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <Text style={styles.goalDot}>•</Text>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Current Lyric Display */}
        {currentLyric && (
          <View style={styles.currentLyricSection}>
            <Text style={styles.sectionTitle}>🎤 Current Lyric</Text>
            <View style={styles.currentLyricCard}>
              <Text style={styles.currentLyricText}>{currentLyric.line}</Text>
              {showSignInstructions && currentLyric.signs && (
                <View style={styles.currentSignsContainer}>
                  <Text style={styles.signsTitle}>Signs for this line:</Text>
                  {currentLyric.signs.map((sign, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.signInstructionCard,
                        selectedSign?.word === sign.word && styles.selectedSignCard
                      ]}
                      onPress={() => handleSignPress(sign)}
                    >
                      <Text style={styles.signWord}>{sign.word}</Text>
                      <Text style={styles.signDescription}>{sign.description}</Text>
                      {sign.gestureType && (
                        <Text style={styles.signType}>
                          {sign.gestureType === 'hand' ? '✋' : 
                           sign.gestureType === 'body' ? '🤸' :
                           sign.gestureType === 'facial' ? '😊' : '👆'} {sign.gestureType}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* All Lyrics with Navigation */}
        <View style={styles.lyricsSection}>
          <Text style={styles.sectionTitle}>📝 Complete Lyrics</Text>
          {musicPlayer.getLyricsWithTiming().map((lyric, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.lyricCard,
                lyric.isActive && styles.activeLyricCard,
                lyric.isPast && styles.pastLyricCard
              ]}
              onPress={() => handleLyricPress(index)}
              accessibilityLabel={`Jump to lyric: ${lyric.line}`}
            >
              <View style={styles.lyricHeader}>
                <Text style={[
                  styles.lyricLine,
                  lyric.isActive && styles.activeLyricText
                ]}>
                  {lyric.line}
                </Text>
                <Text style={styles.lyricTiming}>
                  {musicPlayer.formatTime(lyric.startTime)} - {musicPlayer.formatTime(lyric.endTime)}
                </Text>
              </View>
              
              {showSignInstructions && lyric.signs && (
                <View style={styles.lyricSignsContainer}>
                  <Text style={styles.signsSubtitle}>Signs:</Text>
                  <View style={styles.signsList}>
                    {lyric.signs.map((sign, signIndex) => (
                      <View key={signIndex} style={styles.signItem}>
                        <Text style={styles.signItemWord}>{sign.word}</Text>
                        <Text style={styles.signItemDesc}>{sign.description}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        {song.tips && (
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>💡 Teaching Tips</Text>
            {song.tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Extensions Section */}
        {song.extensions && (
          <View style={styles.extensionsSection}>
            <Text style={styles.sectionTitle}>🌟 Extension Activities</Text>
            {song.extensions.map((extension, index) => (
              <View key={index} style={styles.extensionCard}>
                <Text style={styles.extensionIcon}>🌟</Text>
                <Text style={styles.extensionText}>{extension}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom spacing for scrolling */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#495057',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  songMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  modeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#4ecdc4',
  },
  modeIcon: {
    fontSize: 20,
  },

  // Song info card
  songInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  songIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  songIcon: {
    fontSize: 28,
  },
  songDetails: {
    flex: 1,
  },
  duration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  ageGroup: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#495057',
    lineHeight: 18,
  },

  // Controls
  controlsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#7f8c8d',
    minWidth: 35,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ecdc4',
  },
  controlIcon: {
    fontSize: 20,
  },
  playIcon: {
    fontSize: 24,
    color: '#fff',
  },
  activeControlButton: {
    backgroundColor: '#4ecdc4',
  },

  // Content sections
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Error handling
  errorContainer: {
    backgroundColor: '#ffe6e6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    fontSize: 14,
    color: '#c0392b',
    marginBottom: 8,
  },
  errorButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  errorButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  
  // Playback info
  playbackInfoSection: {
    marginBottom: 24,
  },
  playbackInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  infoNoteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 18,
  },
  playbackInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playbackInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  playbackInfoValue: {
    fontSize: 14,
    color: '#6c757d',
  },
  speedButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  speedButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },

  // Learning goals
  learningGoalsSection: {
    marginBottom: 24,
  },
  goalsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalDot: {
    fontSize: 16,
    color: '#4ecdc4',
    marginRight: 8,
    marginTop: 2,
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },

  // Current lyric
  currentLyricSection: {
    marginBottom: 24,
  },
  currentLyricCard: {
    backgroundColor: '#4ecdc4',
    borderRadius: 16,
    padding: 20,
  },
  currentLyricText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 28,
  },
  currentSignsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
  },
  signsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  signInstructionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSignCard: {
    borderColor: '#4ecdc4',
    backgroundColor: '#e8f8f6',
  },
  signWord: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  signDescription: {
    fontSize: 12,
    color: '#495057',
    lineHeight: 16,
  },
  signType: {
    fontSize: 10,
    color: '#7f8c8d',
    marginTop: 4,
  },

  // All lyrics
  lyricsSection: {
    marginBottom: 24,
  },
  lyricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e9ecef',
  },
  activeLyricCard: {
    borderLeftColor: '#4ecdc4',
    backgroundColor: '#e8f8f6',
  },
  pastLyricCard: {
    borderLeftColor: '#95a5a6',
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
  },
  activeLyricText: {
    color: '#2c3e50',
    fontWeight: '700',
  },
  lyricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lyricLine: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginRight: 12,
  },
  lyricTiming: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  lyricSignsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  signsSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  signsList: {
    gap: 6,
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  signItemWord: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ecdc4',
    minWidth: 80,
  },
  signItemDesc: {
    flex: 1,
    fontSize: 12,
    color: '#6c757d',
  },

  // Tips section
  tipsSection: {
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },

  // Extensions section
  extensionsSection: {
    marginBottom: 24,
  },
  extensionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  extensionIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  extensionText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },

  bottomSpacing: {
    height: 60,
  },

  // Music controls
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  volumeSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  volumeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  volumeControl: {
    marginBottom: 12,
  },
  volumeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
    marginBottom: 8,
  },
  volumeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  volumeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },

  // Audio file info
  audioFileInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#17a2b8',
  },
  audioFileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  audioFileName: {
    fontSize: 13,
    color: '#17a2b8',
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  audioFileNote: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
});

export default SongPlayerScreen;