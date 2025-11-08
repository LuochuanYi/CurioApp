import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { getStoryById, STORY_CATEGORIES } from '../data/stories';

const { width: screenWidth } = Dimensions.get('window');

// Custom hook for story detail data using real story library
const useStoryDetail = (storyId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryDetail = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const story = getStoryById(storyId);
      if (story) {
        const categoryInfo = STORY_CATEGORIES[story.category.toUpperCase()];
        setData({
          ...story,
          categoryName: categoryInfo?.name || story.category,
          categoryIcon: categoryInfo?.icon || '📚',
          // Add navigation helpers for next/previous stories
          nextStory: getStoryById(story.nextStory),
          previousStory: getStoryById(story.previousStory)
        });
      } else {
        // Fallback for unknown stories
        setData({
          id: storyId,
          title: "Story Not Found",
          category: "unknown",
          categoryName: "Unknown",
          categoryIcon: "❓",
          rating: 0,
          duration: "0 min",
          language: "English",
          content: "Sorry, this story could not be found.",
          moral: "",
          nextStory: null,
          previousStory: null
        });
      }
      setLoading(false);
    };

    if (storyId) {
      fetchStoryDetail();
    }
  }, [storyId]);

  return { data, loading };
};

const StoryDetailScreen = ({ navigation, route }) => {
  const { story } = route.params || {};
  const { data, loading } = useStoryDetail(story?.id);
  
  // Text-to-speech functionality using custom hook
  const {
    isPlaying,
    isLoading,
    progress,
    playbackSpeed,
    currentSentence,
    totalSentences,
    playPause,
    stopStory,
    skipForward,
    skipBackward,
    changeSpeed,
    formatProgress,
    getCurrentText,
  } = useTextToSpeech(data?.content);

  // Cleanup speech when component unmounts or navigating away
  useEffect(() => {
    return () => {
      stopStory();
    };
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNextStory = () => {
    if (data?.nextStory) {
      // Stop current speech before navigating
      stopStory();
      navigation.push('StoryDetail', { story: data.nextStory });
    }
  };

  const handlePreviousStory = () => {
    if (data?.previousStory) {
      // Stop current speech before navigating
      stopStory();
      navigation.push('StoryDetail', { story: data.previousStory });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back to stories"
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Stories</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading story...</Text>
        </View>
      ) : (
        <>
          {/* Story Header */}
          <View style={styles.storyHeader}>
            <View style={styles.storyMeta}>
              <Text style={styles.category}>
                {data?.categoryIcon} {data?.categoryName}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.rating}>⭐ {data?.rating}</Text>
                <Text style={styles.duration}>📖 {data?.duration}</Text>
                <Text style={styles.ageGroup}>👶 {data?.ageGroup}</Text>
                <Text style={styles.language}>🌍 {data?.language}</Text>
              </View>
            </View>
            <Text style={styles.title}>{data?.title}</Text>
          </View>

          {/* Audio Controls */}
          <View style={styles.audioSection}>
            {/* Main Play/Pause Button */}
            <TouchableOpacity
              style={[styles.playButton, isLoading && styles.playButtonDisabled]}
              onPress={playPause}
              disabled={isLoading}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? "Pause story" : "Play story"}
            >
              {isLoading ? (
                <>
                  <Text style={styles.playIcon}>⏳</Text>
                  <Text style={styles.playText}>Loading...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '🔊'}</Text>
                  <Text style={styles.playText}>
                    {isPlaying ? 'Pause Narration' : 'Read Story Aloud'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Speech Progress Bar */}
            {(isPlaying || progress > 0) && (
              <View style={styles.progressContainer}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>{formatProgress()}</Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${progress}%` }
                      ]} 
                    />
                  </View>
                </View>
                
                {/* Current sentence being read */}
                {getCurrentText() && (
                  <View style={styles.currentTextContainer}>
                    <Text style={styles.currentTextLabel}>Currently reading:</Text>
                    <Text style={styles.currentText}>{getCurrentText()}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Speech Control Buttons */}
            {totalSentences > 0 && (
              <View style={styles.audioControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={stopStory}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Stop story narration"
                >
                  <Text style={styles.controlIcon}>⏹️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={skipBackward}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Skip back 3 sentences"
                >
                  <Text style={styles.controlIcon}>⏪</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={skipForward}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Skip forward 3 sentences"
                >
                  <Text style={styles.controlIcon}>⏩</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.speedButton}
                  onPress={changeSpeed}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Speech speed: ${playbackSpeed}x`}
                >
                  <Text style={styles.speedText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Story Content */}
          <View style={styles.contentSection}>
            <Text 
              style={styles.storyContent}
              accessible={true}
              accessibilityRole="text"
            >
              {data?.content}
            </Text>
          </View>

          {/* Story Moral */}
          {data?.moral && (
            <View style={styles.moralSection}>
              <Text style={styles.moralTitle}>What We Learn:</Text>
              <Text style={styles.moralText}>{data.moral}</Text>
            </View>
          )}

          {/* Navigation Controls */}
          <View style={styles.navigationSection}>
            <Text style={styles.navigationTitle}>More Stories</Text>
            <View style={styles.navigationButtons}>
              {data?.previousStory && (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handlePreviousStory}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Previous story: ${data.previousStory.title}`}
                >
                  <Text style={styles.navIcon}>⬅️</Text>
                  <Text style={styles.navTitle}>Previous</Text>
                  <Text style={styles.navSubtitle}>{data.previousStory.title}</Text>
                </TouchableOpacity>
              )}
              
              {data?.nextStory && (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handleNextStory}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Next story: ${data.nextStory.title}`}
                >
                  <Text style={styles.navIcon}>➡️</Text>
                  <Text style={styles.navTitle}>Next</Text>
                  <Text style={styles.navSubtitle}>{data.nextStory.title}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backIcon: {
    fontSize: 20,
    color: '#3498db',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },

  // Story Header
  storyHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  storyMeta: {
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '500',
  },
  duration: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
  },
  ageGroup: {
    fontSize: 14,
    color: '#e67e22',
    fontWeight: '500',
  },
  language: {
    fontSize: 14,
    color: '#9b59b6',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 36,
  },

  // Audio Section
  audioSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  playButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  playIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  playText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  
  // Progress Bar
  progressContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  progressInfo: {
    marginBottom: 8,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 3,
  },
  currentTextContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#27ae60',
  },
  currentTextLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 4,
  },
  currentText: {
    fontSize: 14,
    color: '#2c3e50',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  
  // Audio Controls
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  controlIcon: {
    fontSize: 18,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e8f5e8',
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },

  // Content Section
  contentSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  storyContent: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2c3e50',
    fontWeight: '400',
  },

  // Moral Section
  moralSection: {
    backgroundColor: '#e8f5e8',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  moralTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  moralText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    fontStyle: 'italic',
  },

  // Navigation Section
  navigationSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  navigationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 4,
  },
  navSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default StoryDetailScreen;