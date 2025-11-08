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
      {/* Curio Branding Header */}
      <View style={{
        marginTop: CURIO_THEME.spacing.md,
        borderRadius: 20,
        overflow: 'hidden',
        ...CURIO_THEME.shadows.card,
        backgroundColor: CURIO_THEME.colors.surface,
        height: 140,
      }}>
        <Image
          source={require('../assets/images/curio-branding.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
          accessible={true}
          accessibilityLabel="Curio branding - Nurture imagination, together!"
        />
      </View>

      {/* Quick Actions Bar - Curio Style */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingVertical: CURIO_THEME.spacing.md,
      }}>
        <Text style={[TEXT_STYLES.cardTitle, { marginBottom: CURIO_THEME.spacing.md }]}>
          Quick Actions
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: CURIO_THEME.spacing.sm,
        }}>
          <CurioButton
            title={isBedtime() ? 'Bedtime' : 'Surprise Me'}
            variant="primary"
            size="small"
            onPress={() => handleQuickAction(isBedtime() ? 'bedtime_song' : 'surprise_me')}
            style={{ flex: 1 }}
          />
          
          <CurioButton
            title="Continue"
            variant="secondary"
            size="small"
            onPress={() => handleQuickAction('continue_story')}
            style={{ flex: 1 }}
          />
          
          <CurioButton
            title="Explore"
            variant="primary"
            size="small"
            onPress={() => navigation?.navigate('Engage')}
            style={{ 
              flex: 1, 
              backgroundColor: CURIO_THEME.colors.goldenYellow,
            }}
          />
        </View>
      </View>

      {/* Featured Content Section - Curio Style */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingVertical: CURIO_THEME.spacing.md,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: CURIO_THEME.spacing.md,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginRight: CURIO_THEME.spacing.xs }}>
              {featuredContent.hasRecentActivity ? '⭐' : '🎉'}
            </Text>
            <Text style={TEXT_STYLES.cardTitle}>
              {featuredContent.hasRecentActivity ? 'Recent Activity' : 'Featured Content'}
            </Text>
          </View>
          {userProgress.stats.currentStreak > 0 && (
            <View style={{
              backgroundColor: CURIO_THEME.colors.accentOrange,
              paddingHorizontal: CURIO_THEME.spacing.md,
              paddingVertical: CURIO_THEME.spacing.xs,
              borderRadius: CURIO_THEME.radius.badge,
            }}>
              <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse }]}>
                🔥 {userProgress.stats.currentStreak} day streak
              </Text>
            </View>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
        >
          {/* Featured Stories - Opened Book Shape */}
          {featuredContent.stories.map((item, index) => {
            const story = STORY_LIBRARY.find(s => s.id === item.storyId);
            if (!story) return null;
            
            const categoryColor = STORY_CATEGORIES[story.category.toUpperCase()]?.color || CURIO_THEME.colors.softMint;
            
            return (
              <View key={`story-${story.id}`} style={{ marginRight: CURIO_THEME.spacing.md, alignItems: 'center' }}>
                {/* Opened Book Shape */}
                <TouchableOpacity
                  onPress={() => handleStoryPress(story.id)}
                  style={{
                    width: 100,
                    height: 75,
                    backgroundColor: `${categoryColor}25`, // 25% opacity for transparency
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: CURIO_THEME.spacing.xs,
                    ...CURIO_THEME.shadows.card,
                    // Book shape with spine in the middle
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: `${categoryColor}60`, // 60% opacity border
                    position: 'relative',
                    // Slight tilt like an open book
                    transform: [{ rotate: '-2deg' }],
                  }}
                  accessible={true}
                  accessibilityLabel={`${story.title} story, ${story.duration}, ${story.category}`}
                  accessibilityRole="button"
                >
                  {/* Book Spine (Center Line) */}
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 2,
                    backgroundColor: `${categoryColor}80`, // Darker line for spine
                    marginLeft: -1, // Center the line
                  }} />
                  
                  {/* Left Page Content */}
                  <View style={{
                    position: 'absolute',
                    left: 4,
                    top: 8,
                    width: 40,
                    alignItems: 'center',
                  }}>
                    <Text style={{ fontSize: 16, marginBottom: 1 }}>
                      {STORY_CATEGORIES[story.category.toUpperCase()]?.icon || '📚'}
                    </Text>
                  </View>
                  
                  {/* Right Page Content */}
                  <View style={{
                    position: 'absolute',
                    right: 4,
                    top: 6,
                    width: 40,
                    alignItems: 'center',
                  }}>
                    <Text style={[TEXT_STYLES.bodySmall, { 
                      textAlign: 'center', 
                      fontSize: 8, 
                      fontWeight: 'bold',
                      color: CURIO_THEME.colors.textPrimary,
                      lineHeight: 10,
                    }]} numberOfLines={3}>
                      {story.title}
                    </Text>
                    <Text style={[TEXT_STYLES.caption, { 
                      textAlign: 'center', 
                      fontSize: 6, 
                      color: CURIO_THEME.colors.textSecondary,
                      marginTop: 2
                    }]}>
                      {story.duration}
                    </Text>
                  </View>
                  
                  {/* Book Pages Lines (Decoration) */}
                  <View style={{
                    position: 'absolute',
                    left: 8,
                    bottom: 15,
                    width: 35,
                    height: 1,
                    backgroundColor: `${categoryColor}40`,
                  }} />
                  <View style={{
                    position: 'absolute',
                    left: 8,
                    bottom: 12,
                    width: 30,
                    height: 1,
                    backgroundColor: `${categoryColor}30`,
                  }} />
                  <View style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 15,
                    width: 35,
                    height: 1,
                    backgroundColor: `${categoryColor}40`,
                  }} />
                  <View style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 12,
                    width: 30,
                    height: 1,
                    backgroundColor: `${categoryColor}30`,
                  }} />
                </TouchableOpacity>
                
                {/* Badges */}
                {item.isNew && (
                  <View style={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    backgroundColor: CURIO_THEME.colors.accentOrange,
                    paddingHorizontal: 3,
                    paddingVertical: 1,
                    borderRadius: CURIO_THEME.radius.sm,
                  }}>
                    <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse, fontSize: 7 }]}>NEW</Text>
                  </View>
                )}
                {item.completionPercentage > 0 && item.completionPercentage < 100 && (
                  <View style={{
                    position: 'absolute',
                    bottom: 3,
                    left: 8,
                    right: 8,
                    height: 2,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 1,
                  }}>
                    <View style={{
                      height: 2,
                      backgroundColor: CURIO_THEME.colors.primary,
                      borderRadius: 1,
                      width: `${item.completionPercentage}%`,
                    }} />
                  </View>
                )}
              </View>
            );
          })}
          
          {/* Featured Songs - Simple List Style */}
          {featuredContent.songs.map((item, index) => {
            const song = SONGS_LIBRARY.find(s => s.id === item.songId);
            if (!song) return null;
            
            return (
              <TouchableOpacity
                key={`song-${song.id}`}
                onPress={() => handleSongPress(song.id)}
                style={{
                  width: 140,
                  marginRight: CURIO_THEME.spacing.md,
                  backgroundColor: `${song.color || CURIO_THEME.colors.goldenYellow}25`, // 25% opacity for transparency
                  paddingHorizontal: CURIO_THEME.spacing.sm,
                  paddingVertical: CURIO_THEME.spacing.xs,
                  borderRadius: CURIO_THEME.radius.md,
                  borderWidth: 1,
                  borderColor: `${song.color || CURIO_THEME.colors.goldenYellow}40`,
                  ...CURIO_THEME.shadows.card,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                accessible={true}
                accessibilityLabel={`${song.title} song, ${song.duration}, ${song.category}`}
                accessibilityRole="button"
              >
                {/* Music Symbol Icon */}
                <Text style={{ 
                  fontSize: 20, 
                  marginRight: CURIO_THEME.spacing.xs,
                  color: song.color || CURIO_THEME.colors.goldenYellow 
                }}>
                  🎵
                </Text>
                
                {/* Song Details */}
                <View style={{ flex: 1 }}>
                  <Text style={[TEXT_STYLES.bodySmall, { 
                    fontSize: 12, 
                    fontWeight: 'bold',
                    color: CURIO_THEME.colors.textPrimary,
                  }]} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={[TEXT_STYLES.caption, { 
                    fontSize: 9, 
                    color: CURIO_THEME.colors.textSecondary,
                  }]}>
                    {song.duration}
                  </Text>
                </View>
                
                {/* Badges */}
                {item.isNew && (
                  <View style={{
                    backgroundColor: CURIO_THEME.colors.accentOrange,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: CURIO_THEME.radius.sm,
                    marginLeft: CURIO_THEME.spacing.xs,
                  }}>
                    <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse, fontSize: 7 }]}>NEW</Text>
                  </View>
                )}
                {item.playCount > 0 && (
                  <View style={{
                    backgroundColor: CURIO_THEME.colors.primary,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: CURIO_THEME.radius.sm,
                    marginLeft: CURIO_THEME.spacing.xs,
                  }}>
                    <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse, fontSize: 7 }]}>♪ {item.playCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Air Quality Section - Curio Style */}
      <View style={{ paddingHorizontal: CURIO_THEME.spacing.screenPadding }}>
        <CurioCard
          title="Air Quality"
          subtitle={airQualityLoading ? 'Loading...' : `Alert ${airQualityData?.status || 'moderate'}`}
          onPress={handleAirQualityPress}
          variant="alert"
          style={{ backgroundColor: CURIO_THEME.colors.background }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: CURIO_THEME.spacing.md }}>
            <Text style={{ fontSize: 24, marginRight: CURIO_THEME.spacing.sm }}>🌳</Text>
            <Text style={{ fontSize: 24, marginRight: CURIO_THEME.spacing.sm }}>🌳</Text>
            <Text style={{ fontSize: 24 }}>🌱</Text>
          </View>

          <View style={{
            backgroundColor: CURIO_THEME.colors.surface,
            borderRadius: CURIO_THEME.radius.sm,
            padding: CURIO_THEME.spacing.md,
            marginBottom: CURIO_THEME.spacing.sm,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              height: 60,
              marginBottom: CURIO_THEME.spacing.sm,
            }}>
              {(airQualityData?.chartData || [30, 45, 28, 38, 52, 41, 35]).map((value, index) => (
                <View
                  key={index}
                  style={{
                    width: 20,
                    height: `${(value / 100) * 80}%`,
                    backgroundColor: value < 40 ? CURIO_THEME.colors.success : 
                                   value < 70 ? CURIO_THEME.colors.warning : 
                                   CURIO_THEME.colors.error,
                    borderRadius: 2,
                  }}
                />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={TEXT_STYLES.caption}>12am</Text>
              <Text style={TEXT_STYLES.caption}>6am</Text>
              <Text style={TEXT_STYLES.caption}>12pm</Text>
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: CURIO_THEME.colors.lightGray,
            padding: CURIO_THEME.spacing.sm,
            borderRadius: CURIO_THEME.radius.sm,
          }}>
            <Text style={{ fontSize: 20, marginRight: CURIO_THEME.spacing.sm }}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={TEXT_STYLES.bodyMedium}>
                Air quality {airQualityData?.status || 'moderate'}!
              </Text>
              <Text style={TEXT_STYLES.caption}>
                {airQualityData?.alertDate || new Date().toLocaleDateString()}
              </Text>
            </View>
            <Text style={[TEXT_STYLES.h3, { color: CURIO_THEME.colors.textSecondary }]}>›</Text>
          </View>
        </CurioCard>
      </View>

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

export default HomeScreen;