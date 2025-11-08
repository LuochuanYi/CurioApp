import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { STORY_CATEGORIES, STORY_LIBRARY, getStoriesByCategory, searchStories } from '../data/stories';
import { SONGS_LIBRARY, getSongsByCategory, SONG_CATEGORIES, SONG_DIFFICULTIES } from '../data/songs';
import { CurioHeader, CurioCard, CurioMascot, CURIO_THEME, TEXT_STYLES } from '../components';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced hook for content data with category filtering
const useContentData = (selectedCategory = 'all') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const stories = getStoriesByCategory(selectedCategory === 'all' ? null : selectedCategory);
      const featuredStory = stories[Math.floor(Math.random() * stories.length)];
      
      setData({
        stories: stories,
        featuredStory: {
          title: featuredStory.title,
          icon: STORY_CATEGORIES[featuredStory.category.toUpperCase()]?.icon || '�',
          duration: featuredStory.duration,
          category: featuredStory.category
        },
        recommendedActivity: {
          title: Math.random() > 0.5 ? 'Draw & Tell' : 'Sing Along',
          icon: Math.random() > 0.5 ? '🎨' : '🎵',
          participants: Math.floor(Math.random() * 3 + 1)
        },
        categories: Object.values(STORY_CATEGORIES),
        lastUpdated: new Date().toLocaleTimeString()
      });
      setLoading(false);
    };

    fetchData();
  }, [selectedCategory]);

  return { data, loading };
};

import { getCategoriesList } from '../data/learningCategories';

// Get learning categories from data
const learningCategories = getCategoriesList();

const { width } = Dimensions.get('window');

const EngageScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSongCategory, setSelectedSongCategory] = useState('all');
  const { data: contentData, loading: contentLoading } = useContentData(selectedCategory);

  const handleNavigation = (screen) => {
    if (navigation && screen !== 'Engage') {
      navigation.navigate(screen);
    }
  };

  const handleStoryPress = (story) => {
    console.log(`Open story: ${story.title}`);
    navigation?.navigate('StoryDetail', { story });
  };

  const handleSongPress = (song) => {
    console.log(`Play song: ${song.title}`);
    navigation?.navigate('SongPlayer', { song });
  };

  const handleCategoryPress = (category) => {
    console.log(`Filter by category: ${category.name}`);
    setSelectedCategory(category.id);
  };

  const handleLearningCategoryPress = (category) => {
    console.log(`Navigate to learning category: ${category.name}`);
    navigation?.navigate('CategoryDetail', { categoryId: category.id });
  };

  const handleActivityPress = (activityType) => {
    console.log(`Starting activity: ${activityType}`);
    // In real app: navigation?.navigate('ActivityDetail', { activityType })
  };

  const handleRecommendedPress = () => {
    console.log('Open recommended activity');
    // In real app: navigation?.navigate('ActivityDetail', { activity: contentData?.recommendedActivity })
  };

  return (
    <ScrollView style={{ 
      flex: 1, 
      backgroundColor: CURIO_THEME.colors.surface 
    }}>
      {/* Engage Screen Header */}
      <View style={{
        marginHorizontal: CURIO_THEME.spacing.md,
        marginTop: CURIO_THEME.spacing.md,
        borderRadius: CURIO_THEME.radius.card,
        overflow: 'hidden',
        ...CURIO_THEME.shadows.card
      }}>
        <Image
          source={require('../assets/images/engagescreen-head.png')}
          style={{
            width: '100%',
            height: 100,
            resizeMode: 'contain',
            backgroundColor: CURIO_THEME.colors.surface,
          }}
          accessible={true}
          accessibilityLabel="Engage Screen - Create together!"
        />
      </View>



      {/* Story Categories - Curio Style */}
      {contentData?.categories && (
        <View style={{
          paddingHorizontal: CURIO_THEME.spacing.screenPadding,
          paddingVertical: CURIO_THEME.spacing.md,
        }}>
          <Text style={[TEXT_STYLES.cardTitle, { marginBottom: CURIO_THEME.spacing.md }]}>
            Story Categories
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory('all')}
              style={{
                paddingVertical: CURIO_THEME.spacing.sm,
                paddingHorizontal: CURIO_THEME.spacing.md,
                backgroundColor: selectedCategory === 'all' ? CURIO_THEME.colors.skyBlue : CURIO_THEME.colors.background,
                borderRadius: CURIO_THEME.radius.button,
                marginRight: CURIO_THEME.spacing.sm,
                borderWidth: 1,
                borderColor: selectedCategory === 'all' ? CURIO_THEME.colors.skyBlue : CURIO_THEME.colors.lightGray,
              }}
              accessible={true}
              accessibilityLabel="Show all stories"
              accessibilityRole="button"
            >
              <Text style={[
                TEXT_STYLES.buttonSecondary,
                { color: selectedCategory === 'all' ? CURIO_THEME.colors.textInverse : CURIO_THEME.colors.textPrimary }
              ]}>
                All Stories
              </Text>
            </TouchableOpacity>
            {contentData.categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                style={{
                  paddingVertical: CURIO_THEME.spacing.sm,
                  paddingHorizontal: CURIO_THEME.spacing.md,
                  backgroundColor: selectedCategory === category.id ? (category.color || CURIO_THEME.colors.goldenYellow) : CURIO_THEME.colors.background,
                  borderRadius: CURIO_THEME.radius.button,
                  marginRight: CURIO_THEME.spacing.sm,
                  borderWidth: 1,
                  borderColor: selectedCategory === category.id ? (category.color || CURIO_THEME.colors.goldenYellow) : CURIO_THEME.colors.lightGray,
                }}
                accessible={true}
                accessibilityLabel={`Filter by ${category.name} stories`}
                accessibilityRole="button"
              >
                <Text style={[
                  TEXT_STYLES.buttonSecondary,
                  { color: selectedCategory === category.id ? CURIO_THEME.colors.textInverse : CURIO_THEME.colors.textPrimary }
                ]}>
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Stories Library - Curio Style */}
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
          <Text style={TEXT_STYLES.cardTitle}>
            {selectedCategory === 'all' ? 'All Stories' : 
             contentData?.categories.find(c => c.id === selectedCategory)?.name || 'Stories'}
          </Text>
          <View style={{
            backgroundColor: CURIO_THEME.colors.accentOrange,
            paddingHorizontal: CURIO_THEME.spacing.md,
            paddingVertical: CURIO_THEME.spacing.xs,
            borderRadius: CURIO_THEME.radius.badge,
          }}>
            <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse }]}>
              {contentData?.stories?.length || 0} stories
            </Text>
          </View>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
        >
          {contentData?.stories?.map((story) => {
            const categoryColor = STORY_CATEGORIES[story.category.toUpperCase()]?.color || CURIO_THEME.colors.softMint;
            return (
              <View key={story.id} style={{ marginRight: CURIO_THEME.spacing.md, alignItems: 'center' }}>
                {/* Opened Book Shape */}
                <TouchableOpacity
                  onPress={() => handleStoryPress(story)}
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
                  accessibilityLabel={`${story.title} story, ${story.duration}, rating ${story.rating} stars`}
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
                    <Text style={{ fontSize: 20, marginBottom: 1 }}>
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
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Sing-Along Songs - Curio Style */}
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
          <Text style={TEXT_STYLES.cardTitle}>
            🎵 Sing-Along Songs
          </Text>
          <View style={{
            backgroundColor: CURIO_THEME.colors.goldenYellow,
            paddingHorizontal: CURIO_THEME.spacing.md,
            paddingVertical: CURIO_THEME.spacing.xs,
            borderRadius: CURIO_THEME.radius.badge,
          }}>
            <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse }]}>
              {getSongsByCategory(selectedSongCategory === 'all' ? null : selectedSongCategory).length} songs
            </Text>
          </View>
        </View>

        {/* Song Categories Filter - Curio Style */}
        <Text style={[TEXT_STYLES.bodyMedium, { marginBottom: CURIO_THEME.spacing.sm }]}>
          Browse by Category:
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
          style={{ marginBottom: CURIO_THEME.spacing.md }}
        >
          <TouchableOpacity
            onPress={() => setSelectedSongCategory('all')}
            style={{
              paddingVertical: CURIO_THEME.spacing.sm,
              paddingHorizontal: CURIO_THEME.spacing.md,
              backgroundColor: selectedSongCategory === 'all' ? CURIO_THEME.colors.goldenYellow : CURIO_THEME.colors.background,
              borderRadius: CURIO_THEME.radius.button,
              marginRight: CURIO_THEME.spacing.sm,
              borderWidth: 1,
              borderColor: selectedSongCategory === 'all' ? CURIO_THEME.colors.goldenYellow : CURIO_THEME.colors.lightGray,
            }}
            accessible={true}
            accessibilityLabel="Show all songs"
            accessibilityRole="button"
          >
            <Text style={[
              TEXT_STYLES.buttonSecondary,
              { color: selectedSongCategory === 'all' ? CURIO_THEME.colors.textInverse : CURIO_THEME.colors.textPrimary }
            ]}>
              All Songs
            </Text>
          </TouchableOpacity>
          {Object.values(SONG_CATEGORIES).map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedSongCategory(category.id)}
              style={{
                paddingVertical: CURIO_THEME.spacing.sm,
                paddingHorizontal: CURIO_THEME.spacing.md,
                backgroundColor: selectedSongCategory === category.id ? category.color : CURIO_THEME.colors.background,
                borderRadius: CURIO_THEME.radius.button,
                marginRight: CURIO_THEME.spacing.sm,
                borderWidth: 1,
                borderColor: selectedSongCategory === category.id ? category.color : CURIO_THEME.colors.lightGray,
              }}
              accessible={true}
              accessibilityLabel={`Filter by ${category.name} songs`}
              accessibilityRole="button"
            >
              <Text style={[
                TEXT_STYLES.buttonSecondary,
                { color: selectedSongCategory === category.id ? CURIO_THEME.colors.textInverse : CURIO_THEME.colors.textPrimary }
              ]}>
                {category.icon} {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Songs List - Circular Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
        >
          {getSongsByCategory(selectedSongCategory === 'all' ? null : selectedSongCategory).map((song, index) => {
            const difficulty = SONG_DIFFICULTIES[song.difficulty.toUpperCase()];
            const category = SONG_CATEGORIES[song.category.toUpperCase()];
            const songColor = song.color || category?.color || CURIO_THEME.colors.goldenYellow;
            
            return (
              <TouchableOpacity
                key={song.id}
                onPress={() => handleSongPress(song)}
                style={{
                  width: 140,
                  marginRight: CURIO_THEME.spacing.md,
                  backgroundColor: `${songColor}25`, // 25% opacity for transparency
                  paddingHorizontal: CURIO_THEME.spacing.sm,
                  paddingVertical: CURIO_THEME.spacing.xs,
                  borderRadius: CURIO_THEME.radius.md,
                  borderWidth: 1,
                  borderColor: `${songColor}40`,
                  ...CURIO_THEME.shadows.card,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                accessible={true}
                accessibilityLabel={`${song.title} song, ${difficulty?.name} difficulty, ${song.duration} long`}
                accessibilityRole="button"
              >
                {/* Music Symbol Icon */}
                <Text style={{ 
                  fontSize: 20, 
                  marginRight: CURIO_THEME.spacing.xs,
                  color: songColor 
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Text style={[TEXT_STYLES.caption, { 
                      fontSize: 9, 
                      color: CURIO_THEME.colors.textSecondary,
                      marginRight: CURIO_THEME.spacing.xs,
                    }]}>
                      {song.duration}
                    </Text>
                    <View style={{
                      backgroundColor: difficulty?.color || CURIO_THEME.colors.success,
                      paddingHorizontal: 4,
                      paddingVertical: 1,
                      borderRadius: CURIO_THEME.radius.sm,
                    }}>
                      <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse, fontSize: 7 }]}>
                        {difficulty?.icon || '⭐'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Learning Categories - Curio Style */}
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
          <Text style={TEXT_STYLES.cardTitle}>
            Learning Categories
          </Text>
          <View style={{
            backgroundColor: CURIO_THEME.colors.primary,
            paddingHorizontal: CURIO_THEME.spacing.md,
            paddingVertical: CURIO_THEME.spacing.xs,
            borderRadius: CURIO_THEME.radius.badge,
          }}>
            <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse }]}>
              {learningCategories.length} topics
            </Text>
          </View>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
        >
          {learningCategories.map((category) => {
            return (
              <View
                key={category.id}
                style={{
                  marginRight: CURIO_THEME.spacing.md,
                  alignItems: 'center',
                }}
              >
                {/* Paint Palette Shape - Main Oval with Thumb Hole */}
                <TouchableOpacity
                  onPress={() => handleLearningCategoryPress(category)}
                  style={{
                    width: 90,
                    height: 65,
                    backgroundColor: `${category.color}25`, // 25% opacity for transparency
                    borderRadius: 32, // Large oval shape for palette
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: CURIO_THEME.spacing.xs,
                    ...CURIO_THEME.shadows.card,
                    borderWidth: 2,
                    borderColor: `${category.color}60`, // 60% opacity border
                    position: 'relative',
                    // Slight rotation for artistic feel
                    transform: [{ rotate: '-8deg' }],
                  }}
                  accessible={true}
                  accessibilityLabel={`${category.name} category with ${category.totalActivities} activities`}
                  accessibilityRole="button"
                >
                  {/* Thumb Hole in Palette */}
                  <View style={{
                    position: 'absolute',
                    right: 8,
                    top: 15,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: CURIO_THEME.colors.surface,
                    borderWidth: 1,
                    borderColor: `${category.color}40`,
                  }} />
                  
                  {/* Paint Dots on Palette */}
                  <View style={{
                    position: 'absolute',
                    top: 8,
                    left: 12,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${category.color}80`,
                  }} />
                  <View style={{
                    position: 'absolute',
                    top: 12,
                    left: 25,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: `${CURIO_THEME.colors.accentOrange}70`,
                  }} />
                  <View style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 15,
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: `${CURIO_THEME.colors.skyBlue}70`,
                  }} />
                  
                  {/* Category Content */}
                  <View style={{ alignItems: 'center', transform: [{ rotate: '8deg' }] }}>
                    <Text style={{ fontSize: 18, marginBottom: 2 }}>
                      {category.icon}
                    </Text>
                    <Text style={[TEXT_STYLES.bodySmall, { 
                      textAlign: 'center', 
                      fontSize: 9, 
                      fontWeight: 'bold',
                      color: CURIO_THEME.colors.textPrimary,
                    }]} numberOfLines={2}>
                      {category.name}
                    </Text>
                    <Text style={[TEXT_STYLES.caption, { 
                      textAlign: 'center', 
                      fontSize: 7, 
                      color: CURIO_THEME.colors.textSecondary,
                      marginTop: 1
                    }]}>
                      {category.totalActivities}
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {/* Paint Brush Handle */}
                <View style={{
                  width: 3,
                  height: 20,
                  backgroundColor: '#8B4513', // Brown for brush handle
                  borderRadius: 1.5,
                  marginTop: -8,
                  transform: [{ rotate: '15deg' }],
                }} />
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Recommendations Card */}
      <View style={styles.recommendationsSection}>
        <View style={styles.recommendationHeader}>
          <View style={styles.notificationIcon}>
            <Text style={styles.bellIcon}>🔔</Text>
          </View>
          <Text style={styles.recommendationTitle}>Recommendations</Text>
        </View>
        
        <View style={styles.recommendationsContainer}>
          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => handleActivityPress('lullaby')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Submit a lullaby activity - Music Sing Together Play"
          >
            <Text style={styles.activityTitle}>Submit a lullaby</Text>
            <Text style={styles.activitySubtitle}>Music Sing Together Play</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerLine} />
          
          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => handleActivityPress('guiro')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Guiro activity - History Multilingual Story"
          >
            <Text style={styles.activityTitle}>Guiro</Text>
            <Text style={styles.activitySubtitle}>History Multilingual Story</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Recommendation */}
      {contentData && (
        <TouchableOpacity 
          style={styles.recommendedSection}
          onPress={handleRecommendedPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Today's recommended activity: ${contentData.recommendedActivity.title}`}
        >
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedBadge}>Today's Pick</Text>
            <Text style={styles.recommendedIcon}>🎯</Text>
          </View>
          <Text style={styles.recommendedTitle}>{contentData.recommendedActivity.title}</Text>
          <Text style={styles.recommendedSubtext}>
            Perfect for {contentData.recommendedActivity.participants} participant{contentData.recommendedActivity.participants > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
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
          { key: 'Home', icon: '🏠', label: 'Home', active: false, color: CURIO_THEME.colors.skyBlue },
          { key: 'Monitor', icon: '📊', label: 'Monitor', active: false, color: CURIO_THEME.colors.deepNavy },
          { key: 'Engage', icon: '💡', label: 'Engage', active: true, color: CURIO_THEME.colors.goldenYellow },
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
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    paddingHorizontal: 20 
  },

  // Header - Create Together
  headerCard: {
    backgroundColor: '#a8dadc',
    borderRadius: 24,
    padding: 24,
    marginVertical: 20,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 140,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTextSection: {
    flex: 1,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1d3557',
    marginBottom: 8,
  },
  mascotSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  learningCharacter: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: '#f1c0e8', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  characterIcon: { 
    fontSize: 28,
  },
  ideaBulb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffd60a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bulbIcon: {
    fontSize: 24,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 14,
    opacity: 0.8,
  },

  // Recommendations Section
  recommendationsSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bellIcon: {
    fontSize: 16,
    color: '#fff',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  recommendationsContainer: {
    gap: 0,
  },
  recommendationCard: {
    paddingVertical: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 4,
  },

  // Daily Recommendation (Today's Pick)
  recommendedSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  recommendedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recommendedBadge: {
    backgroundColor: '#f39c12',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
  },
  recommendedIcon: {
    fontSize: 20,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  recommendedSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#2c3e50' 
  },
  sectionCount: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  // Stories section
  storiesSection: { 
    marginBottom: 32 
  },
  storiesScrollView: {
    paddingHorizontal: 4,
  },
  storyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    width: screenWidth * 0.35,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  storyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  storyIcon: { 
    fontSize: 24 
  },
  storyTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  storyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    fontSize: 12,
    color: '#f39c12',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  storyDuration: {
    fontSize: 11,
    color: '#95a5a6',
  },

  // Songs section
  songsSection: { 
    marginBottom: 32 
  },
  
  // Horizontal scroll for songs
  horizontalScroll: {
    marginTop: 16,
  },
  
  // Horizontal song cards
  songCardHorizontal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 8,
    width: screenWidth * 0.7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    minHeight: 180,
    position: 'relative',
  },
  songIconContainerHorizontal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  songIconHorizontal: { 
    fontSize: 32,
    color: '#fff'
  },
  songTitleHorizontal: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  songMetaHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  songDifficultyBadgeHorizontal: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  songBadgeTextHorizontal: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  songDetailsHorizontal: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  songDescriptionHorizontal: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  playButtonHorizontal: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playIconHorizontal: {
    fontSize: 20,
    marginLeft: 2, // Slight offset to center the play icon
  },
  // Song categories
  songCategoriesContainer: {
    marginTop: 8,
  },
  categoriesSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  songCategoriesScroll: {
    marginTop: 4,
  },
  songCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  songCategoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  songCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
  },
  selectedSongCategoryChip: {
    backgroundColor: '#4ecdc4',
    borderColor: '#4ecdc4',
  },
  selectedSongCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Categories section
  categoriesSection: { 
    marginBottom: 32 
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: (screenWidth - 64) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: { 
    fontSize: 28 
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },

  // Category filtering tabs
  categoriesScroll: {
    marginTop: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategoryTab: {
    backgroundColor: '#4ecdc4',
    borderColor: '#4ecdc4',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginLeft: 4,
  },
  selectedCategoryTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Bottom navigation
  bottomNav: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    backgroundColor: '#fff', 
    paddingVertical: 15, 
    borderTopWidth: 1,
    borderTopColor: '#e9ecef', 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0
  },
  navItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  navIcon: { 
    fontSize: 20, 
    marginBottom: 5, 
    color: '#6c757d' 
  },
  navIconActive: { 
    fontSize: 20, 
    marginBottom: 5, 
    color: '#f39c12' 
  },
  navLabel: { 
    fontSize: 12, 
    color: '#6c757d', 
    fontWeight: '500' 
  },
  activeLabel: { 
    color: '#f39c12' 
  },
  activeIndicator: {
    width: 30, 
    height: 3, 
    backgroundColor: '#f39c12',
    borderRadius: 2, 
    marginTop: 5
  },
});

export default EngageScreen;
