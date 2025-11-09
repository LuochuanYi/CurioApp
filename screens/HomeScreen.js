import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { STORY_CATEGORIES, STORY_LIBRARY, getStoriesByCategory } from '../data/stories';
import { SONGS_LIBRARY, getSongsByCategory, SONG_CATEGORIES } from '../data/songs';
import { useUserProgress } from '../hooks/useUserProgress';
import { CurioHeader, CurioCard, CurioButton, CurioMascot, CURIO_THEME, TEXT_STYLES } from '../components';

// Custom hook for air quality data (simulated)
const useAirQualityData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData({
        status: Math.random() > 0.5 ? 'low' : 'moderate',
        alertDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        chartData: Array.from({length: 7}, () => Math.floor(Math.random() * 100))
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
};

// Helper function to get featured content
const getFeaturedContent = (userProgressHook) => {
  try {
    console.log('getFeaturedContent: Starting...');
    
    if (!userProgressHook) {
      console.log('getFeaturedContent: No userProgressHook, using fallback');
      return {
        stories: STORY_LIBRARY.slice(0, 2).map(story => ({ storyId: story.id, isNew: true })),
        songs: SONGS_LIBRARY.slice(0, 2).map(song => ({ songId: song.id, isNew: true })),
        inProgress: [],
        hasRecentActivity: false
      };
    }
    
    const recentStories = userProgressHook.getRecentStories ? userProgressHook.getRecentStories(2) : [];
    const recentSongs = userProgressHook.getRecentSongs ? userProgressHook.getRecentSongs(2) : [];
    const inProgressStories = userProgressHook.getInProgressStories ? userProgressHook.getInProgressStories() : [];
    
    console.log('getFeaturedContent: Recent data:', { recentStories, recentSongs, inProgressStories });
    
    const fallbackStories = recentStories.length === 0 
      ? STORY_LIBRARY.slice(0, 2).map(story => ({ storyId: story.id, isNew: true }))
      : recentStories;
      
    const fallbackSongs = recentSongs.length === 0
      ? SONGS_LIBRARY.slice(0, 2).map(song => ({ songId: song.id, isNew: true }))
      : recentSongs;
      
    return {
      stories: fallbackStories,
      songs: fallbackSongs,
      inProgress: inProgressStories,
      hasRecentActivity: recentStories.length > 0 || recentSongs.length > 0
    };
  } catch (error) {
    console.error('getFeaturedContent error:', error);
    return {
      stories: STORY_LIBRARY.slice(0, 2).map(story => ({ storyId: story.id, isNew: true })),
      songs: SONGS_LIBRARY.slice(0, 2).map(song => ({ songId: song.id, isNew: true })),
      inProgress: [],
      hasRecentActivity: false
    };
  }
};

const HomeScreen = ({ navigation }) => {
  console.log('HomeScreen: Component rendering...');
  
  const { data: airQualityData, loading: airQualityLoading } = useAirQualityData();
  
  console.log('HomeScreen: About to call useUserProgress...');
  const userProgressHook = useUserProgress();
  const { userProgress, loading: progressLoading, updateDailyStreak, isBedtime } = userProgressHook;
  
  console.log('HomeScreen: Got user progress data:', { progressLoading, userProgress });
  
  const featuredContent = getFeaturedContent(userProgressHook);
  
  console.log('HomeScreen: Got featured content:', featuredContent);
  
  useEffect(() => {
    if (!progressLoading) {
      updateDailyStreak();
    }
  }, [progressLoading]);
  
  const handleNavigation = (screen) => {
    if (navigation && screen !== 'Home') {
      navigation.navigate(screen);
    }
  };

  const handleStoryPress = (storyId) => {
    const story = STORY_LIBRARY.find(s => s.id === storyId);
    if (story) {
      navigation?.navigate('StoryDetail', { story });
      console.log(`Open story: ${story.title}`);
    }
  };

  const handleSongPress = (songId) => {
    const song = SONGS_LIBRARY.find(s => s.id === songId);
    if (song) {
      navigation?.navigate('SongPlayer', { song });
      console.log(`Play song: ${song.title}`);
    }
  };

  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'bedtime_song':
        const bedtimeSongs = getSongsByCategory('bedtime');
        if (bedtimeSongs.length > 0) {
          const randomBedtimeSong = bedtimeSongs[Math.floor(Math.random() * bedtimeSongs.length)];
          handleSongPress(randomBedtimeSong.id);
        }
        break;
      case 'continue_story':
        const inProgress = userProgressHook.getInProgressStories();
        if (inProgress.length > 0) {
          handleStoryPress(inProgress[0].storyId);
        } else {
          navigation?.navigate('Engage');
        }
        break;
      case 'surprise_me':
        const allContent = [...STORY_LIBRARY, ...SONGS_LIBRARY];
        const randomContent = allContent[Math.floor(Math.random() * allContent.length)];
        if (randomContent.category) {
          if (randomContent.audioFile !== undefined) {
            handleSongPress(randomContent.id);
          } else {
            handleStoryPress(randomContent.id);
          }
        }
        break;
      default:
        console.log(`Quick action: ${actionType}`);
    }
  };

  const handleAirQualityPress = () => {
    console.log('Open air quality details');
  };

  return (
    <ScrollView style={{ 
      flex: 1, 
      backgroundColor: CURIO_THEME.colors.surface 
    }}>
      {/* Curio Branding Header - Mobile Style */}
      <View style={styles.brandingHeader}>
        <Image
          source={require('../assets/images/curio-branding.png')}
          style={styles.brandingImage}
          accessible={true}
          accessibilityLabel="Curio branding - Nurture imagination, together!"
        />
      </View>

      {/* Welcome hint */}
      {(!featuredContent.hasRecentActivity && userProgress.stats.storiesCompleted === 0) && (
        <View style={styles.welcomeHint}>
          <Text style={styles.welcomeIcon}>👋</Text>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome to Curio!</Text>
            <Text style={styles.welcomeText}>
              Start by exploring our Quick Actions below, or tap "Explore Content" to browse all stories and songs.
            </Text>
          </View>
        </View>
      )}

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>⚡</Text>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Jump right into activities tailored for this time of day
        </Text>
        <View style={styles.sectionContent}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction(isBedtime() ? 'bedtime_song' : 'surprise_me')}
            accessible={true}
            accessibilityLabel={`${isBedtime() ? 'Bedtime' : 'Surprise Me'} quick action`}
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>{isBedtime() ? '😴' : '🎲'}</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>{isBedtime() ? 'Bedtime Stories' : 'Surprise Me'}</Text>
              <Text style={styles.actionSubtitle}>
                {isBedtime() ? 'Calming content for sleepy time' : 'Random story or song just for you'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction('continue_story')}
            accessible={true}
            accessibilityLabel="Continue story quick action"
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>📖</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>Continue Reading</Text>
              <Text style={styles.actionSubtitle}>
                {featuredContent.inProgress.length > 0 ? 
                  `Pick up where you left off` : 
                  'Start a new adventure together'
                }
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation?.navigate('Engage')}
            accessible={true}
            accessibilityLabel="Explore content quick action"
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>🚀</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>Explore Content</Text>
              <Text style={styles.actionSubtitle}>
                Browse all stories, songs & activities
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📚</Text>
          <Text style={styles.sectionTitle}>
            {featuredContent.hasRecentActivity ? 'Recent Stories' : 'Featured Stories'}
          </Text>
          {userProgress.stats.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {userProgress.stats.currentStreak}</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionDescription}>
          {featuredContent.hasRecentActivity ? 
            'Continue where you left off or discover what\'s new' :
            'Handpicked stories perfect for you and your child'
          }
        </Text>
        
        {featuredContent.stories.length > 0 ? (
          <View style={styles.gridContainer}>
            {featuredContent.stories.map((item, index) => {
              const story = STORY_LIBRARY.find(s => s.id === item.storyId);
              if (!story) return null;
              
              const categoryInfo = STORY_CATEGORIES[story.category.toUpperCase()] || {};
              const isInProgress = featuredContent.inProgress.some(p => p.storyId === story.id);
              const progressData = isInProgress ? featuredContent.inProgress.find(p => p.storyId === story.id) : null;
              
              return (
                <TouchableOpacity
                  key={`story-${story.id}`}
                  onPress={() => handleStoryPress(story.id)}
                  style={styles.gridItem}
                  accessible={true}
                  accessibilityLabel={`${story.title} story, ${story.duration}, ${story.category}${isInProgress ? ', in progress' : ''}`}
                  accessibilityRole="button"
                >
                  <View style={[styles.iconContainer, { backgroundColor: categoryInfo.color || CURIO_THEME.colors.skyBlue }]}>
                    <Text style={styles.gridIcon}>
                      {categoryInfo.icon || '📚'}
                    </Text>
                    {isInProgress && (
                      <View style={styles.progressBadge}>
                        <Text style={styles.progressText}>📍</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.gridTitle} numberOfLines={2}>
                    {story.title}
                  </Text>
                  <Text style={styles.gridSubtitle}>
                    {isInProgress ? `Continue • ${progressData?.progress || 50}% complete` : story.duration}
                  </Text>
                  {isInProgress && (
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progressData?.progress || 50}%` }]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateTitle}>No stories yet!</Text>
            <Text style={styles.emptyStateText}>
              Tap "Explore Content" above to discover amazing stories waiting for you
            </Text>
          </View>
        )}
      </View>

      {/* Songs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🎵</Text>
          <Text style={styles.sectionTitle}>Featured Songs</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Sing-along favorites and musical adventures for every mood
        </Text>
        {featuredContent.songs.length > 0 ? (
          <View style={styles.gridContainer}>
            {featuredContent.songs.map((item, index) => {
              const song = SONGS_LIBRARY.find(s => s.id === item.songId);
              if (!song) return null;
              
              const songColors = [
                CURIO_THEME.colors.goldenYellow,
                CURIO_THEME.colors.softMint,
                CURIO_THEME.colors.accentOrange,
                CURIO_THEME.colors.skyBlue
              ];
              
              return (
                <TouchableOpacity
                  key={`song-${song.id}`}
                  onPress={() => handleSongPress(song.id)}
                  style={styles.gridItem}
                  accessible={true}
                  accessibilityLabel={`${song.title} song, ${song.duration}, ${song.category}`}
                  accessibilityRole="button"
                >
                  <View style={[styles.iconContainer, { backgroundColor: songColors[index % songColors.length] }]}>
                    <Text style={styles.gridIcon}>🎵</Text>
                    {item.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.gridTitle} numberOfLines={2}>
                    {song.title}
                  </Text>
                  <Text style={styles.gridSubtitle}>
                    {song.duration} • {song.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎵</Text>
            <Text style={styles.emptyStateTitle}>No songs yet!</Text>
            <Text style={styles.emptyStateText}>
              Tap "Explore Content" to find songs perfect for singing along
            </Text>
          </View>
        )}
      </View>

      {/* Air Quality Section - Enhanced with better hierarchy */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🌱</Text>
          <Text style={styles.sectionTitle}>Today's Air Quality</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Monitor air quality to plan outdoor activities safely
        </Text>
        
        <TouchableOpacity
          style={styles.airQualityCard}
          onPress={handleAirQualityPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View detailed air quality information"
        >
          <View style={styles.airQualityHeader}>
            <View style={styles.airQualityStatus}>
              <Text style={styles.airQualityLevel}>
                {airQualityLoading ? 'Loading...' : (airQualityData?.status || 'moderate').toUpperCase()}
              </Text>
              <Text style={styles.airQualityDate}>
                {airQualityData?.alertDate || new Date().toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.statusIndicator, {
              backgroundColor: airQualityData?.status === 'low' ? CURIO_THEME.colors.success :
                             airQualityData?.status === 'moderate' ? CURIO_THEME.colors.warning :
                             CURIO_THEME.colors.error
            }]}>
              <Text style={styles.statusEmoji}>
                {airQualityData?.status === 'low' ? '✅' : 
                 airQualityData?.status === 'moderate' ? '⚠️' : '🚫'}
              </Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>24-Hour Trend</Text>
            <View style={styles.chartBars}>
              {(airQualityData?.chartData || [30, 45, 28, 38, 52, 41, 35]).map((value, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View
                    style={[styles.chartBar, {
                      height: `${(value / 100) * 80}%`,
                      backgroundColor: value < 40 ? CURIO_THEME.colors.success : 
                                     value < 70 ? CURIO_THEME.colors.warning : 
                                     CURIO_THEME.colors.error,
                    }]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>12am</Text>
              <Text style={styles.chartLabel}>6am</Text>
              <Text style={styles.chartLabel}>12pm</Text>
              <Text style={styles.chartLabel}>6pm</Text>
            </View>
          </View>

          <View style={styles.airQualityFooter}>
            <Text style={styles.tapToViewText}>Tap to view detailed recommendations</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Hint for first-time users */}
      {(!featuredContent.hasRecentActivity && userProgress.stats.storiesCompleted === 0) && (
        <View style={styles.navigationHint}>
          <Text style={styles.navigationHintText}>
            💡 Try tapping "Engage" below to discover all our stories and songs!
          </Text>
        </View>
      )}

      {/* Bottom Navigation - Curio Style */}
      <View style={{
        backgroundColor: CURIO_THEME.colors.background,
        flexDirection: 'row',
        paddingVertical: CURIO_THEME.spacing.md,
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        borderTopWidth: 1,
        borderTopColor: CURIO_THEME.colors.lightGray,
        ...CURIO_THEME.shadows.nav,
      }}>
        {[
          { key: 'Home', icon: '🏠', label: 'Home', active: true, color: CURIO_THEME.colors.skyBlue },
          { key: 'Monitor', icon: '📊', label: 'Monitor', active: false, color: CURIO_THEME.colors.deepNavy },
          { key: 'Engage', icon: '💡', label: 'Engage', active: false, color: CURIO_THEME.colors.goldenYellow },
          { key: 'Personalize', icon: '👤', label: 'Personalize', active: false, color: CURIO_THEME.colors.deepNavy }
        ].map((navItem) => (
          <TouchableOpacity
            key={navItem.key}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: CURIO_THEME.spacing.xs,
            }}
            onPress={() => handleNavigation(navItem.key)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${navItem.label} tab${navItem.active ? ', currently selected' : ''}`}
            accessibilityState={{ selected: navItem.active }}
          >
            <Text style={{ 
              fontSize: 24, 
              marginBottom: CURIO_THEME.spacing.xs,
              opacity: navItem.active ? 1 : 0.6,
            }}>
              {navItem.icon}
            </Text>
            <Text style={[
              TEXT_STYLES.caption,
              { 
                color: navItem.active ? navItem.color : CURIO_THEME.colors.textSecondary,
                fontWeight: navItem.active ? '600' : '400',
              }
            ]}>
              {navItem.label}
            </Text>
            {navItem.active && (
              <View style={{
                width: 30,
                height: 3,
                backgroundColor: navItem.color,
                borderRadius: 2,
                marginTop: 5,
              }} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Branding Header
  brandingHeader: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  brandingImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },

  // Welcome hint
  welcomeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CURIO_THEME.colors.surface,
    marginHorizontal: CURIO_THEME.spacing.screenPadding,
    padding: CURIO_THEME.spacing.md,
    borderRadius: CURIO_THEME.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: CURIO_THEME.colors.primary,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  welcomeIcon: {
    fontSize: 28,
    marginRight: CURIO_THEME.spacing.md,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 18,
  },

  // Section Styles
  section: {
    paddingHorizontal: CURIO_THEME.spacing.screenPadding,
    marginBottom: CURIO_THEME.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CURIO_THEME.spacing.md,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: CURIO_THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CURIO_THEME.colors.textPrimary,
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: CURIO_THEME.spacing.md,
    lineHeight: 20,
  },
  sectionContent: {
    gap: CURIO_THEME.spacing.sm,
  },
  
  // Action Items (keep as horizontal for quick actions)
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CURIO_THEME.colors.surface,
    padding: CURIO_THEME.spacing.md,
    borderRadius: CURIO_THEME.radius.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: CURIO_THEME.spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 16,
  },
  
  // Grid Layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CURIO_THEME.spacing.md,
  },
  gridItem: {
    width: '47%',
    backgroundColor: CURIO_THEME.colors.surface,
    padding: CURIO_THEME.spacing.md,
    borderRadius: CURIO_THEME.radius.md,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: CURIO_THEME.spacing.sm,
  },
  gridIcon: {
    fontSize: 24,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Streak badge
  streakBadge: {
    backgroundColor: '#ff6b9d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  // Progress indicators
  progressBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CURIO_THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 8,
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: CURIO_THEME.colors.lightGray,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: CURIO_THEME.colors.primary,
    borderRadius: 2,
  },

  // New badge
  newBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: CURIO_THEME.colors.success,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fff',
  },

  // Empty states
  emptyState: {
    alignItems: 'center',
    paddingVertical: CURIO_THEME.spacing.xl,
    paddingHorizontal: CURIO_THEME.spacing.md,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: CURIO_THEME.spacing.md,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: CURIO_THEME.spacing.xs,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 240,
  },

  // Enhanced Air Quality Section
  airQualityCard: {
    backgroundColor: CURIO_THEME.colors.surface,
    borderRadius: CURIO_THEME.radius.lg,
    padding: CURIO_THEME.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  airQualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CURIO_THEME.spacing.lg,
  },
  airQualityStatus: {
    flex: 1,
  },
  airQualityLevel: {
    fontSize: 20,
    fontWeight: '700',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  airQualityDate: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
  },
  statusIndicator: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 24,
  },
  chartContainer: {
    backgroundColor: CURIO_THEME.colors.background,
    borderRadius: CURIO_THEME.radius.md,
    padding: CURIO_THEME.spacing.md,
    marginBottom: CURIO_THEME.spacing.md,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: CURIO_THEME.spacing.sm,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
    marginBottom: CURIO_THEME.spacing.sm,
  },
  chartBarContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '70%',
    borderRadius: 2,
    minHeight: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 11,
    color: CURIO_THEME.colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  airQualityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CURIO_THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: CURIO_THEME.colors.lightGray,
  },
  tapToViewText: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    flex: 1,
  },
  arrowIcon: {
    fontSize: 16,
    color: CURIO_THEME.colors.textSecondary,
  },

  // Navigation hint
  navigationHint: {
    marginHorizontal: CURIO_THEME.spacing.screenPadding,
    marginBottom: CURIO_THEME.spacing.md,
    padding: CURIO_THEME.spacing.sm,
    backgroundColor: CURIO_THEME.colors.primary,
    borderRadius: CURIO_THEME.radius.sm,
  },
  navigationHintText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;