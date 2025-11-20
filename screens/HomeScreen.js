import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { STORY_CATEGORIES, STORY_LIBRARY, getStoriesByCategory } from '../data/stories';
import { SONGS_LIBRARY, getSongsByCategory, SONG_CATEGORIES } from '../data/songs';
import { useUserProgress } from '../hooks/useUserProgress';
import { CurioHeader, CurioCard, CurioButton, CurioMascot, CURIO_THEME, TEXT_STYLES } from '../components';
import { useTranslation } from 'react-i18next';

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
  
  const { t } = useTranslation();
  const { data: airQualityData, loading: airQualityLoading } = useAirQualityData();
  
  console.log('HomeScreen: About to call useUserProgress...');
  const userProgressHook = useUserProgress();
  const { userProgress, loading: progressLoading, updateDailyStreak, isBedtime } = userProgressHook;
  
  console.log('HomeScreen: Got user progress data:', { progressLoading, userProgress });
  
  const featuredContent = getFeaturedContent(userProgressHook) || {
    stories: [],
    songs: [],
    inProgress: [],
    hasRecentActivity: false
  };
  
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
          accessibilityLabel={t('accessibility.curioBranding')}
        />
      </View>

      {/* Welcome hint */}
      {(!featuredContent?.hasRecentActivity && userProgress?.stats?.storiesCompleted === 0) && (
        <View style={styles.welcomeHint}>
          <Text style={styles.welcomeIcon}>👋</Text>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>{t('home.welcome.title')}</Text>
            <Text style={styles.welcomeText}>
              {t('home.welcome.description')}
            </Text>
          </View>
        </View>
      )}

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>⚡</Text>
          <Text style={styles.sectionTitle}>{t('home.sections.quickActions.title')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t('home.sections.quickActions.description')}
        </Text>
        <View style={styles.sectionContent}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction(isBedtime() ? 'bedtime_song' : 'surprise_me')}
            accessible={true}
            accessibilityLabel={t('accessibility.quickActionButton', { 
              action: isBedtime() ? t('home.sections.quickActions.bedtimeStories') : t('home.sections.quickActions.surpriseMe')
            })}
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>{isBedtime() ? '😴' : '🎲'}</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>
                {isBedtime() ? t('home.sections.quickActions.bedtimeStories') : t('home.sections.quickActions.surpriseMe')}
              </Text>
              <Text style={styles.actionSubtitle}>
                {isBedtime() ? t('home.sections.quickActions.bedtimeDescription') : t('home.sections.quickActions.surpriseDescription')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleQuickAction('continue_story')}
            accessible={true}
            accessibilityLabel={t('accessibility.quickActionButton', { 
              action: t('home.sections.quickActions.continueReading')
            })}
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>📖</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>{t('home.sections.quickActions.continueReading')}</Text>
              <Text style={styles.actionSubtitle}>
                {featuredContent.inProgress.length > 0 ? 
                  t('home.sections.quickActions.continuePickUp') : 
                  t('home.sections.quickActions.startNew')
                }
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation?.navigate('Engage')}
            accessible={true}
            accessibilityLabel={t('accessibility.quickActionButton', { 
              action: t('home.sections.quickActions.exploreContent')
            })}
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>🚀</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>{t('home.sections.quickActions.exploreContent')}</Text>
              <Text style={styles.actionSubtitle}>
                {t('home.sections.quickActions.exploreDescription')}
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
            {featuredContent?.hasRecentActivity ? t('home.sections.stories.recent') : t('home.sections.stories.featured')}
          </Text>
          {userProgress.stats.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {userProgress.stats.currentStreak}</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionDescription}>
          {featuredContent?.hasRecentActivity ? 
            t('home.sections.stories.recentDescription') :
            t('home.sections.stories.featuredDescription')
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
                  accessibilityLabel={t('accessibility.storyButton', {
                    title: story.title,
                    duration: story.duration,
                    category: story.category,
                    progress: isInProgress ? `, ${t('home.sections.stories.inProgress')}` : ''
                  })}
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
                    {isInProgress ? t('home.sections.stories.continueProgress', { progress: progressData?.progress || 50 }) : story.duration}
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
            <Text style={styles.emptyStateTitle}>{t('home.empty.stories.title')}</Text>
            <Text style={styles.emptyStateText}>
              {t('home.empty.stories.description')}
            </Text>
          </View>
        )}
      </View>

      {/* Songs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🎵</Text>
          <Text style={styles.sectionTitle}>{t('home.sections.songs.featured')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t('home.sections.songs.description')}
        </Text>
        {featuredContent.songs.length > 0 ? (
          <View style={styles.gridContainer}>
            {featuredContent.songs.map((item, index) => {
              const song = SONGS_LIBRARY.find(s => s.id === item.songId);
              if (!song) return null;
              
              const songColors = [
                '#FF6B6B', // Coral Red
                '#4ECDC4', // Turquoise
                '#45B7D1', // Sky Blue
                '#96CEB4', // Mint Green
                '#FFEAA7', // Sunny Yellow
                '#DDA0DD', // Plum Purple
                '#98D8C8', // Seafoam
                '#F7DC6F'  // Golden Yellow
              ];
              
              return (
                <TouchableOpacity
                  key={`song-${song.id}`}
                  onPress={() => handleSongPress(song.id)}
                  style={styles.gridItem}
                  accessible={true}
                  accessibilityLabel={t('accessibility.songButton', {
                    title: song.title,
                    duration: song.duration,
                    category: song.category
                  })}
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
            <Text style={styles.emptyStateTitle}>{t('home.empty.songs.title')}</Text>
            <Text style={styles.emptyStateText}>
              {t('home.empty.songs.description')}
            </Text>
          </View>
        )}
      </View>

      {/* Air Quality Section - Enhanced with better hierarchy */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🌱</Text>
          <Text style={styles.sectionTitle}>{t('home.sections.airQuality.title')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t('home.sections.airQuality.description')}
        </Text>
        
        <TouchableOpacity
          style={styles.airQualityCard}
          onPress={handleAirQualityPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.airQualityButton')}
        >
          <View style={styles.airQualityHeader}>
            <View style={styles.airQualityStatus}>
              <Text style={styles.airQualityLevel}>
                            <Text style={styles.airQualityLevel}>
              {airQualityLoading ? t('home.sections.airQuality.loading') : (airQualityData?.status || 'moderate').toUpperCase()}
            </Text>
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
            <Text style={styles.chartTitle}>{t('home.sections.airQuality.chartTitle')}</Text>
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
            <Text style={styles.tapToViewText}>{t('home.sections.airQuality.tapToView')}</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Hint for first-time users */}
      {(!featuredContent?.hasRecentActivity && userProgress?.stats?.storiesCompleted === 0) && (
        <View style={styles.navigationHint}>
          <Text style={styles.navigationHintText}>
            {t('home.navigation.hint')}
          </Text>
        </View>
      )}

      {/* Bottom Navigation - Kid-Friendly Rainbow Style */}
      <View style={{
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        paddingVertical: CURIO_THEME.spacing.md,
        paddingHorizontal: CURIO_THEME.spacing.sm,
        borderTopWidth: 4,
        borderTopColor: '#FFE0B2',
        elevation: 8,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      }}>
        {[
          { key: 'Home', icon: '🏠', label: t('common.home'), active: true, color: '#FF6B6B', bgColor: '#FFEBEE' },
          { key: 'Monitor', icon: '📊', label: t('common.monitor'), active: false, color: '#FFEAA7', bgColor: '#FFFDE7' },
          { key: 'Engage', icon: '💡', label: t('common.engage'), active: false, color: '#DDA0DD', bgColor: '#F3E5F5' },
          { key: 'Personalize', icon: '👤', label: t('common.personalize'), active: false, color: '#9C27B0', bgColor: '#F8BBD9' }
        ].map((navItem) => (
          <TouchableOpacity
            key={navItem.key}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 4,
              borderRadius: 12,
              backgroundColor: navItem.active ? navItem.bgColor : 'transparent',
              elevation: navItem.active ? 3 : 0,
              shadowColor: navItem.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: navItem.active ? 0.2 : 0,
              shadowRadius: 4,
            }}
            onPress={() => handleNavigation(navItem.key)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.tabNavigation', { 
              label: navItem.label,
              active: navItem.active ? t('accessibility.currentlySelected') : ''
            })}
            accessibilityState={{ selected: navItem.active }}
          >
            <Text style={{ 
              fontSize: 20, 
              marginBottom: 4,
              opacity: navItem.active ? 1 : 0.7,
              textShadowColor: navItem.active ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
              {navItem.icon}
            </Text>
            <Text style={[
              TEXT_STYLES.caption,
              { 
                color: navItem.active ? navItem.color : '#757575',
                fontWeight: navItem.active ? '800' : '600',
                fontSize: 9,
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
                marginTop: 2,
              }} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Branding Header - Kid-Friendly Rainbow Design
  brandingHeader: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)',
    elevation: 6,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  brandingImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },

  // Welcome hint - Playful Kid Design
  welcomeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5F1',
    marginHorizontal: CURIO_THEME.spacing.screenPadding,
    padding: CURIO_THEME.spacing.lg,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FF6B9D',
    elevation: 4,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    transform: [{ rotate: '-1deg' }],
  },
  welcomeIcon: {
    fontSize: 36,
    marginRight: CURIO_THEME.spacing.md,
    transform: [{ rotate: '15deg' }],
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF1744',
    marginBottom: 6,
    textShadowColor: 'rgba(255, 23, 68, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeText: {
    fontSize: 15,
    color: '#8E24AA',
    lineHeight: 20,
    fontWeight: '600',
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
    fontSize: 32,
    marginRight: CURIO_THEME.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    flex: 1,
    textShadowColor: 'rgba(46, 125, 50, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  sectionDescription: {
    fontSize: 15,
    color: '#5E35B1',
    marginBottom: CURIO_THEME.spacing.md,
    lineHeight: 22,
    fontWeight: '600',
  },
  sectionContent: {
    gap: CURIO_THEME.spacing.sm,
  },
  
  // Action Items - Colorful and Kid-Friendly
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: CURIO_THEME.spacing.lg,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#FFE0B2',
    marginVertical: 4,
    transform: [{ scale: 1 }],
  },
  actionIcon: {
    fontSize: 40,
    marginRight: CURIO_THEME.spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#D32F2F',
    marginBottom: 4,
    textShadowColor: 'rgba(211, 47, 47, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#7B1FA2',
    lineHeight: 18,
    fontWeight: '600',
  },
  
  // Grid Layout - Kid-Friendly Cards
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CURIO_THEME.spacing.md,
  },
  gridItem: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: CURIO_THEME.spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: '#FFE0E6',
    transform: [{ rotate: Math.random() > 0.5 ? '1deg' : '-1deg' }],
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: CURIO_THEME.spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  gridIcon: {
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(21, 101, 192, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  gridSubtitle: {
    fontSize: 12,
    color: '#8E24AA',
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Streak badge - Rainbow celebration
  streakBadge: {
    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-5deg' }, { scale: 1.1 }],
  },
  streakText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Progress indicators - Colorful and animated
  progressBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 10,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#FFE0B2',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFCC02',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
    borderRadius: 10,
  },

  // New badge - Sparkly and exciting
  newBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF1744',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '15deg' }],
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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