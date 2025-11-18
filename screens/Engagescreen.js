import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LanguageContext, useLanguage } from '../contexts/LanguageContext';
import { STORY_CATEGORIES, STORY_LIBRARY, getStoriesByCategory, searchStories } from '../data/stories';
import { SONGS_LIBRARY, getSongsByCategory, SONG_CATEGORIES, SONG_DIFFICULTIES } from '../data/songs';
import { CurioHeader, CurioCard, CurioMascot, CURIO_THEME, TEXT_STYLES } from '../components';
import { useDynamicTranslation, useTranslatedStories } from '../hooks/useDynamicTranslation';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced hook for content data with category filtering and dynamic translation
const useContentData = (selectedCategory = 'bedtime') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { translateStories, translateCategory, currentLanguage } = useDynamicTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Get stories for the selected category
        const originalStories = getStoriesByCategory(selectedCategory);
        
        // Translate stories if not in English
        const stories = currentLanguage === 'en' 
          ? originalStories 
          : await translateStories(originalStories);
        
        // Get and translate categories
        const originalCategories = Object.values(STORY_CATEGORIES);
        const categories = currentLanguage === 'en'
          ? originalCategories
          : await Promise.all(originalCategories.map(cat => translateCategory(cat, currentLanguage)));
        
        const featuredStory = stories.length > 0 
          ? stories[Math.floor(Math.random() * stories.length)]
          : null;
        
        setData({
          stories: stories,
          featuredStory: featuredStory ? {
            title: featuredStory.title,
            icon: STORY_CATEGORIES[featuredStory.category?.toUpperCase()]?.icon || '📚',
            duration: featuredStory.duration,
            category: featuredStory.category
          } : null,
          recommendedActivity: {
            title: Math.random() > 0.5 ? t('engage.activities.drawTell') : t('engage.activities.singAlong'),
            icon: Math.random() > 0.5 ? '🎨' : '🎵',
            participants: Math.floor(Math.random() * 3 + 1)
          },
          categories: categories,
          lastUpdated: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.warn('Content translation failed:', error);
        // Fallback to original English content
        const stories = getStoriesByCategory(selectedCategory);
        const categories = Object.values(STORY_CATEGORIES);
        
        setData({
          stories: stories,
          featuredStory: stories.length > 0 ? stories[0] : null,
          recommendedActivity: {
            title: Math.random() > 0.5 ? t('engage.activities.drawTell') : t('engage.activities.singAlong'),
            icon: Math.random() > 0.5 ? '🎨' : '🎵',
            participants: Math.floor(Math.random() * 3 + 1)
          },
          categories: categories,
          lastUpdated: new Date().toLocaleTimeString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, currentLanguage, t]);

  return { data, loading };
};

import { getCategoriesList } from '../data/learningCategories';

// Get learning categories from data
const learningCategories = getCategoriesList();

// Component for dynamically translated song categories
const TranslatedSongCategories = ({ selectedCategory, onCategorySelect }) => {
  const [translatedCategories, setTranslatedCategories] = useState([]);
  const { translateContent, currentLanguage } = useDynamicTranslation();

  useEffect(() => {
    const translateCategories = async () => {
      const categories = Object.values(SONG_CATEGORIES);
      
      if (currentLanguage === 'en') {
        setTranslatedCategories(categories);
        return;
      }

      const translated = await Promise.all(
        categories.map(async (category) => {
          const translatedName = await translateContent(category.name);
          return {
            ...category,
            name: translatedName,
            originalName: category.name
          };
        })
      );
      setTranslatedCategories(translated);
    };

    translateCategories();
  }, [currentLanguage]);

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
      style={{ marginBottom: CURIO_THEME.spacing.md }}
    >
      {translatedCategories.map((category) => {
        const categorySongCount = getSongsByCategory(category.id).length;
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategorySelect(category.id)}
            style={{
              paddingVertical: CURIO_THEME.spacing.sm,
              paddingHorizontal: CURIO_THEME.spacing.md,
              backgroundColor: selectedCategory === category.id ? category.color : CURIO_THEME.colors.background,
              borderRadius: CURIO_THEME.radius.button,
              marginRight: CURIO_THEME.spacing.sm,
              borderWidth: 1,
              borderColor: selectedCategory === category.id ? category.color : CURIO_THEME.colors.lightGray,
            }}
            accessible={true}
            accessibilityLabel={`Filter by ${category.name} songs`}
            accessibilityRole="button"
          >
            <Text style={[
              TEXT_STYLES.buttonSecondary,
              { color: selectedCategory === category.id ? CURIO_THEME.colors.textInverse : CURIO_THEME.colors.textPrimary }
            ]}>
              {category.icon} {category.name} ({categorySongCount})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// Component for dynamically translated songs list
const TranslatedSongsList = ({ songs, onSongPress }) => {
  const [translatedSongs, setTranslatedSongs] = useState(songs);
  const { translateContent, currentLanguage } = useDynamicTranslation();

  useEffect(() => {
    const translateSongs = async () => {
      if (currentLanguage === 'en') {
        setTranslatedSongs(songs);
        return;
      }

      const translated = await Promise.all(
        songs.map(async (song) => {
          const translatedTitle = await translateContent(song.title);
          return {
            ...song,
            title: translatedTitle,
            originalTitle: song.title
          };
        })
      );
      setTranslatedSongs(translated);
    };

    translateSongs();
  }, [songs, currentLanguage]);

  return (
    <>
      {translatedSongs.map((song, index) => {
        const difficulty = SONG_DIFFICULTIES[song.difficulty.toUpperCase()];
        const songColors = [
          CURIO_THEME.colors.goldenYellow,
          CURIO_THEME.colors.softMint,
          CURIO_THEME.colors.accentOrange,
          CURIO_THEME.colors.skyBlue
        ];
        
        return (
          <TouchableOpacity
            key={song.id}
            onPress={() => onSongPress(song)}
            style={styles.listItem}
            accessible={true}
            accessibilityLabel={`${song.title} song, ${difficulty?.name} difficulty, ${song.duration} long`}
            accessibilityRole="button"
          >
            <View style={[styles.listIconContainer, { backgroundColor: songColors[index % songColors.length] }]}>
              <Text style={styles.listIcon}>🎵</Text>
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle} numberOfLines={2}>
                {song.title}
              </Text>
              <Text style={styles.listSubtitle}>
                {song.duration} • {difficulty?.name}
              </Text>
              {song.originalTitle && song.originalTitle !== song.title && (
                <Text style={styles.originalTitle} numberOfLines={1}>
                  {song.originalTitle}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

// Component for dynamically translated learning categories
const TranslatedLearningCategories = ({ categories, onCategoryPress }) => {
  const [translatedCategories, setTranslatedCategories] = useState(categories);
  const { translateContent, currentLanguage } = useDynamicTranslation();

  useEffect(() => {
    const translateCategories = async () => {
      if (currentLanguage === 'en') {
        setTranslatedCategories(categories);
        return;
      }

      const translated = await Promise.all(
        categories.map(async (category) => {
          const translatedName = await translateContent(category.name);
          return {
            ...category,
            name: translatedName,
            originalName: category.name
          };
        })
      );
      setTranslatedCategories(translated);
    };

    translateCategories();
  }, [categories, currentLanguage]);

  return (
    <>
      {translatedCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategoryPress(category)}
          style={styles.gridItem}
          accessible={true}
          accessibilityLabel={`${category.name} category with ${category.totalActivities} activities`}
          accessibilityRole="button"
        >
          <View style={[styles.iconContainer, { backgroundColor: category.color || CURIO_THEME.colors.primary }]}>
            <Text style={styles.gridIcon}>{category.icon}</Text>
          </View>
          <Text style={styles.gridTitle} numberOfLines={2}>
            {category.name}
          </Text>
          <Text style={styles.gridSubtitle}>
            {category.totalActivities} activities
          </Text>
          {category.originalName && category.originalName !== category.name && (
            <Text style={styles.gridOriginal} numberOfLines={1}>
              {category.originalName}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};

// Component for dynamically translated recommendations
const TranslatedRecommendations = ({ onActivityPress }) => {
  const [translatedRecommendations, setTranslatedRecommendations] = useState([]);
  const { translateContent, currentLanguage } = useDynamicTranslation();
  const { t } = useTranslation();

  useEffect(() => {
    const translateRecommendations = async () => {
      const recommendations = [
        { 
          id: 'lullaby',
          title: 'Submit a lullaby',
          subtitle: 'Music Sing Together Play',
          icon: '🎵'
        },
        {
          id: 'guiro', 
          title: 'Guiro',
          subtitle: 'History Multilingual Story',
          icon: '🪘'
        }
      ];

      if (currentLanguage === 'en') {
        setTranslatedRecommendations(recommendations);
        return;
      }

      const translated = await Promise.all(
        recommendations.map(async (rec) => {
          const translatedTitle = await translateContent(rec.title);
          const translatedSubtitle = await translateContent(rec.subtitle);
          return {
            ...rec,
            title: translatedTitle,
            subtitle: translatedSubtitle,
            originalTitle: rec.title,
            originalSubtitle: rec.subtitle
          };
        })
      );
      setTranslatedRecommendations(translated);
    };

    translateRecommendations();
  }, [currentLanguage]);

  return (
    <>
      {translatedRecommendations.map((rec) => (
        <TouchableOpacity 
          key={rec.id}
          style={styles.contentItem}
          onPress={() => onActivityPress(rec.id)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${rec.title} activity - ${rec.subtitle}`}
        >
          <Text style={styles.contentIcon}>{rec.icon}</Text>
          <View style={styles.contentText}>
            <Text style={styles.contentTitle}>{rec.title}</Text>
            <Text style={styles.contentSubtitle}>{rec.subtitle}</Text>
            {rec.originalTitle && rec.originalTitle !== rec.title && (
              <Text style={styles.contentOriginal} numberOfLines={1}>
                {rec.originalTitle} - {rec.originalSubtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const { width } = Dimensions.get('window');

const EngageScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('bedtime');
  const [selectedSongCategory, setSelectedSongCategory] = useState('classic');
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
            height: 200,
            resizeMode: 'cover',
            backgroundColor: CURIO_THEME.colors.surface,
          }}
          accessible={true}
          accessibilityLabel="Engage Screen - Create together!"
        />
      </View>



      {/* Stories Section */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, styles.centeredSectionHeader]}>
          <Text style={styles.sectionIcon}>📚</Text>
          <Text style={styles.sectionTitle}>{t('engage.sections.stories.title')}</Text>
        </View>

        {/* Story Categories Filter - Curio Style */}
        <Text style={[TEXT_STYLES.bodyMedium, { marginBottom: CURIO_THEME.spacing.sm }]}>
          {t('engage.sections.stories.browseCategories')}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
          style={{ marginBottom: CURIO_THEME.spacing.md }}
        >
          {contentData?.categories && contentData.categories.map((category) => {
            const categoryStoryCount = getStoriesByCategory(category.id).length;
            return (
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
                  {category.icon} {category.name} ({categoryStoryCount})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stories List */}
        <View style={styles.listContainer}>
          {contentLoading ? (
            // Loading indicator for translation
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : (
            contentData?.stories?.slice(0, 6).map((story) => {
              const categoryInfo = STORY_CATEGORIES[story.category?.toUpperCase()] || {};
              
              return (
                <TouchableOpacity
                  key={story.id}
                  onPress={() => handleStoryPress(story)}
                  style={styles.listItem}
                  accessible={true}
                  accessibilityLabel={`${story.title} story, ${story.duration}, rating ${story.rating} stars`}
                  accessibilityRole="button"
                >
                  <View style={[styles.listIconContainer, { backgroundColor: categoryInfo.color || CURIO_THEME.colors.skyBlue }]}>
                    <Text style={styles.listIcon}>
                      {categoryInfo.icon || '📚'}
                    </Text>
                  </View>
                  <View style={styles.listContent}>
                    <Text style={styles.listTitle} numberOfLines={2}>
                      {story.title}
                    </Text>
                    <Text style={styles.listSubtitle}>
                      {story.duration} • ⭐ {story.rating}
                    </Text>
                    {story.originalTitle && story.originalTitle !== story.title && (
                      <Text style={styles.originalTitle} numberOfLines={1}>
                        {story.originalTitle}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      {/* Songs Section */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, styles.centeredSectionHeader]}>
          <Text style={styles.sectionIcon}>🎵</Text>
          <Text style={styles.sectionTitle}>{t('engage.sections.songs.title')}</Text>
        </View>

        {/* Song Categories Filter - Curio Style */}
        <Text style={[TEXT_STYLES.bodyMedium, { marginBottom: CURIO_THEME.spacing.sm }]}>
          {t('engage.sections.stories.browseCategories')}
        </Text>
        <TranslatedSongCategories 
          selectedCategory={selectedSongCategory}
          onCategorySelect={setSelectedSongCategory}
        />

        {/* Songs List */}
        <View style={styles.listContainer}>
          {contentLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : (
            <TranslatedSongsList 
              songs={getSongsByCategory(selectedSongCategory)}
              onSongPress={handleSongPress}
            />
          )}
        </View>
      </View>

      {/* Learning Categories Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🎨</Text>
          <Text style={styles.sectionTitle}>{t('engage.sections.learning.title')}</Text>
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
        
        <View style={styles.gridContainer}>
          {contentLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : (
            <TranslatedLearningCategories 
              categories={learningCategories}
              onCategoryPress={handleLearningCategoryPress}
            />
          )}
        </View>
      </View>

      {/* Recommendations Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🔔</Text>
          <Text style={styles.sectionTitle}>{t('engage.sections.recommendations.title')}</Text>
        </View>
        
        <View style={styles.sectionContent}>
          {contentLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : (
            <TranslatedRecommendations onActivityPress={handleActivityPress} />
          )}
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
          { key: 'Home', icon: '🏠', label: t('common.home'), active: false, color: CURIO_THEME.colors.skyBlue },
          { key: 'Monitor', icon: '📊', label: t('common.monitor'), active: false, color: CURIO_THEME.colors.deepNavy },
          { key: 'Engage', icon: '💡', label: t('common.engage'), active: true, color: CURIO_THEME.colors.goldenYellow },
          { key: 'Personalize', icon: '👤', label: t('common.personalize'), active: false, color: CURIO_THEME.colors.deepNavy }
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
  centeredSectionHeader: {
    justifyContent: 'center',
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
  sectionContent: {
    gap: CURIO_THEME.spacing.sm,
  },
  
  // Grid Layout (keeping for Learning Categories)
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
  gridOriginal: {
    fontSize: 10,
    color: CURIO_THEME.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
  
  // List Layout (for Stories and Songs)
  listContainer: {
    gap: CURIO_THEME.spacing.sm,
  },
  listItem: {
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
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CURIO_THEME.spacing.md,
  },
  listIcon: {
    fontSize: 24,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
  },
  originalTitle: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  loadingContainer: {
    padding: CURIO_THEME.spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
  },
  
  // Content Items (keep for recommendations section)
  contentItem: {
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
  contentIcon: {
    fontSize: 32,
    marginRight: CURIO_THEME.spacing.md,
  },
  contentText: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 2,
  },
  contentSubtitle: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
  },
  contentOriginal: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
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
