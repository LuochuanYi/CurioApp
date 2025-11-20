import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  LEARNING_CATEGORIES,
  getActivitiesByCategory,
  DIFFICULTY_LEVELS,
  getActivitiesByDifficulty,
  searchActivities
} from '../data/learningCategories';
import { SONG_CATEGORIES, getSongsByCategory } from '../data/songs';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';
import { logTranslation, logError } from '../utils/logger';
import { GameActivityManager } from '../components';

const { width: screenWidth } = Dimensions.get('window');

const CategoryDetailScreen = ({ route, navigation }) => {
  const { categoryId, categoryType = 'learning' } = route.params;
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGames, setShowGames] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { t, i18n } = useTranslation();
  
  // Translation toggle state
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState({});
  
  // Get current language for caching
  const currentLanguage = i18n.language || 'en';
  
  // Import translation service directly for on-demand use
  const { translateContent: translateService } = useDynamicTranslation();
  
  // Translation function for UI elements
  const translateText = (text) => {
    if (!text) return text;
    return t(text, { defaultValue: text });
  };
  
  const category = categoryType === 'songs' 
    ? Object.values(SONG_CATEGORIES).find(cat => cat.id === categoryId)
    : Object.values(LEARNING_CATEGORIES).find(cat => cat.id === categoryId);

  const filteredActivities = useMemo(() => {
    if (categoryType === 'songs') {
      // For songs, get songs by category and filter by search query
      let songs = getSongsByCategory(categoryId) || [];
      
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        songs = songs.filter(song => 
          song.title?.toLowerCase().includes(lowerQuery) ||
          song.description?.toLowerCase().includes(lowerQuery) ||
          (song.learningGoals && song.learningGoals.some(goal => goal?.toLowerCase().includes(lowerQuery)))
        );
      }
      
      return songs;
    } else {
      // For learning activities
      let activities = getActivitiesByCategory(categoryId) || [];
      
      // Filter by difficulty
      if (selectedDifficulty !== 'all') {
        activities = getActivitiesByDifficulty(categoryId, selectedDifficulty) || [];
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        activities = activities.filter(activity => 
          activity.title?.toLowerCase().includes(lowerQuery) ||
          activity.description?.toLowerCase().includes(lowerQuery) ||
          (activity.learningGoals && activity.learningGoals.some(goal => goal?.toLowerCase().includes(lowerQuery)))
        );
      }
      
      return activities;
    }
  }, [categoryId, categoryType, selectedDifficulty, searchQuery]);

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{translateText("Category not found")}</Text>
      </SafeAreaView>
    );
  }

  const handleActivityPress = (activity) => {
    if (categoryType === 'songs') {
      navigation.navigate('SongPlayer', { song: activity });
    } else {
      navigation.navigate('ActivityDetail', { 
        activity,
        categoryId,
        categoryName: category.name 
      });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePlayGames = (activity) => {
    setSelectedActivity(activity);
    setShowGames(true);
  };

  const handleGamesComplete = (gameResults) => {
    setShowGames(false);
    setSelectedActivity(null);
    // Could show a completion message or navigate somewhere
  };

  const handleExitGames = () => {
    setShowGames(false);
    setSelectedActivity(null);
  };

  // Handle translation toggle
  const handleTranslationToggle = async () => {
    if (!isTranslationEnabled) {
      // Enabling translation - check cache first
      const cacheKey = `category_${categoryId}_${currentLanguage}`;
      if (translationCache[cacheKey]) {
        // Use cached translation
        setIsTranslationEnabled(true);
        return;
      }
      
      // Perform fresh translation
      setIsTranslating(true);
      try {
        logTranslation('Starting translation for category:', category?.name);
        
        // Skip translation if target is English
        if (currentLanguage === 'en' || currentLanguage === 'English') {
          const translations = {
            categoryName: category?.name || '',
            categoryDescription: category?.description || '',
            activities: filteredActivities || [],
          };
          
          setTranslationCache(prev => ({
            ...prev,
            [cacheKey]: translations
          }));
          
          setIsTranslationEnabled(true);
          return;
        }
        
        // Translate category info and activities
        const translations = {};
        
        if (category?.name) {
          translations.categoryName = await translateService(category.name);
        }
        
        if (category?.description) {
          translations.categoryDescription = await translateService(category.description);
        }
        
        // Translate all activities
        if (filteredActivities.length > 0) {
          translations.activities = await Promise.all(
            filteredActivities.map(async (activity) => ({
              ...activity,
              title: await translateService(activity.title),
              description: await translateService(activity.description),
              learningGoals: await Promise.all(
                activity.learningGoals.map(goal => translateService(goal))
              ),
              materials: activity.materials ? await Promise.all(
                activity.materials.map(material => translateService(material))
              ) : []
            }))
          );
        }
        
        // Cache the translations
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: translations
        }));
        
        setIsTranslationEnabled(true);
        logTranslation('Category translation completed successfully');
      } catch (error) {
        logError('Category translation error:', error);
        alert(`Translation failed: ${error.message}. Please try again.`);
      } finally {
        setIsTranslating(false);
      }
    } else {
      // Disabling translation - show original content
      setIsTranslationEnabled(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    return DIFFICULTY_LEVELS[difficulty.id.toUpperCase()]?.color || '#6c757d';
  };

  // Get display content based on translation state
  const getDisplayContent = () => {
    if (!isTranslationEnabled) {
      return {
        categoryName: category?.name || '',
        categoryDescription: category?.description || '',
        activities: filteredActivities || [],
      };
    }
    
    const cacheKey = `category_${categoryId}_${currentLanguage}`;
    const cachedTranslations = translationCache[cacheKey];
    
    if (cachedTranslations) {
      return cachedTranslations;
    }
    
    // Fallback to original content if translation not available
    return {
      categoryName: category?.name || '',
      categoryDescription: category?.description || '',
      activities: filteredActivities || [],
    };
  };

  const displayContent = getDisplayContent();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.categoryTitle}>{displayContent.categoryName}</Text>
            <Text style={styles.categorySubtitle}>
              {categoryType === 'songs' 
                ? `${filteredActivities.length} ${translateText("songs")}` 
                : `${category?.totalActivities || filteredActivities.length} ${translateText("activities")}${category?.ageGroup ? ` • ${translateText(category.ageGroup)}` : ''}`
              }
            </Text>
            <Text style={styles.categoryDescription}>{displayContent.categoryDescription}</Text>
          </View>
        </View>
      </View>

      {/* Translation Toggle */}
      <View style={styles.translationToggleContainer}>
        <TouchableOpacity
          style={[
            styles.translationToggle,
            isTranslationEnabled && styles.translationToggleActive
          ]}
          onPress={handleTranslationToggle}
          disabled={isTranslating}
        >
          <Text style={styles.toggleIcon}>
            {isTranslating ? "⏳" : "🌍"}
          </Text>
          <Text style={[
            styles.translationToggleText,
            isTranslationEnabled && styles.translationToggleTextActive
          ]}>
            {isTranslating 
              ? "Translating..." 
              : isTranslationEnabled 
                ? "Show Original" 
                : "Translate Category"
            }
          </Text>
        </TouchableOpacity>
        
        {/* Language indicator */}
        {isTranslationEnabled && (
          <View style={styles.languageIndicator}>
            <Text style={styles.languageText}>
              Translated to {currentLanguage.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={translateText("Search activities...")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Difficulty Filter - Only show for learning activities */}
        {categoryType !== 'songs' && (
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>{translateText("Difficulty Level:")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyScroll}>
              <TouchableOpacity
                style={[
                  styles.difficultyChip,
                  selectedDifficulty === 'all' && styles.selectedDifficultyChip
                ]}
                onPress={() => setSelectedDifficulty('all')}
              >
                <Text style={[
                  styles.difficultyText,
                  selectedDifficulty === 'all' && styles.selectedDifficultyText
                ]}>
                  {translateText("All Levels")}
                </Text>
              </TouchableOpacity>
              
              {Object.values(DIFFICULTY_LEVELS).map(difficulty => (
                <TouchableOpacity
                  key={difficulty.id}
                  style={[
                    styles.difficultyChip,
                    { borderColor: difficulty.color },
                    selectedDifficulty === difficulty.id && [
                      styles.selectedDifficultyChip,
                      { backgroundColor: difficulty.color }
                    ]
                  ]}
                  onPress={() => setSelectedDifficulty(difficulty.id)}
                >
                  <Text style={styles.difficultyIcon}>{difficulty.icon}</Text>
                  <Text style={[
                    styles.difficultyText,
                    selectedDifficulty === difficulty.id && styles.selectedDifficultyText
                  ]}>
                    {translateText(difficulty.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery ? translateText(`Search Results`) : 
             categoryType === 'songs' ? translateText('Songs') :
             selectedDifficulty === 'all' ? translateText('All Activities') : 
             `${translateText(DIFFICULTY_LEVELS[selectedDifficulty.toUpperCase()]?.name)} ${translateText('Activities')}`}
          </Text>
          <Text style={styles.resultsCount}>
            {filteredActivities.length} {categoryType === 'songs' ? translateText("songs") : translateText("activities")}
          </Text>
        </View>

        {/* Activities/Songs List */}
        <View style={styles.activitiesContainer}>
          {filteredActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>
                {translateText(categoryType === 'songs' ? "No songs found" : "No activities found")}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? translateText('Try a different search term') : 
                 categoryType === 'songs' ? translateText('No songs in this category') :
                 translateText('Try changing the difficulty filter')}
              </Text>
            </View>
          ) : (
            filteredActivities.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.activityCard,
                  { borderLeftColor: categoryType === 'songs' ? (category?.color || '#6c5ce7') : getDifficultyColor(activity.difficulty) }
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={categoryType === 'songs' 
                  ? `${activity.title}, ${activity.duration}` 
                  : `${activity.title}, ${activity.difficulty.name} difficulty, ${activity.duration}`
                }
              >
                <View style={styles.activityHeader}>
                  <View style={styles.activityTitleContainer}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    {categoryType !== 'songs' && (
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(activity.difficulty) }
                      ]}>
                        <Text style={styles.difficultyBadgeText}>{activity.difficulty.icon}</Text>
                      </View>
                    )}
                    {categoryType === 'songs' && (
                      <View style={[styles.difficultyBadge, { backgroundColor: category?.color || '#6c5ce7' }]}>
                        <Text style={styles.difficultyBadgeText}>{activity.icon || '🎵'}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.activityMeta}>
                    <Text style={styles.activityDuration}>⏱️ {activity.duration}</Text>
                    <Text style={styles.activityAgeGroup}>👶 {translateText(activity.ageGroup)}</Text>
                    {categoryType === 'songs' && (
                      <Text style={styles.activityCategory}>🎵 {translateText(activity.category)}</Text>
                    )}
                  </View>
                </View>
                
                <Text style={styles.activityDescription} numberOfLines={2}>
                  {activity.description}
                </Text>
                
                <View style={styles.activityFooter}>
                  <View style={styles.learningGoals}>
                    {activity.learningGoals && activity.learningGoals.slice(0, 3).map((goal, goalIndex) => (
                      <View key={goalIndex} style={styles.goalTag}>
                        <Text style={styles.goalText}>{translateText(goal)}</Text>
                      </View>
                    ))}
                    {activity.learningGoals && activity.learningGoals.length > 3 && (
                      <View style={styles.goalTag}>
                        <Text style={styles.goalText}>+{activity.learningGoals.length - 3}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.activityButtons}>
                    {categoryType !== 'songs' && (
                      <TouchableOpacity 
                        style={styles.gamesButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handlePlayGames(activity);
                        }}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={`Play games for ${activity.title}`}
                      >
                        <Text style={styles.gamesIcon}>🎮</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={[styles.startButton, categoryType === 'songs' && { backgroundColor: '#6c5ce7' }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleActivityPress(activity);
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={categoryType === 'songs' ? `Play ${activity.title}` : `Start ${activity.title}`}
                    >
                      <Text style={styles.startIcon}>{categoryType === 'songs' ? '🎵' : '▶️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Interactive Learning Games Modal */}
      {showGames && selectedActivity && (
        <GameActivityManager
          activity={selectedActivity}
          onGameComplete={handleGamesComplete}
          onExitGame={handleExitGames}
          language={currentLanguage}
        />
      )}
    </SafeAreaView>
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
    paddingVertical: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 48,
    marginRight: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    fontWeight: '500',
  },
  categoryDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Search
  searchSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#6c757d',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: '#6c757d',
  },

  // Filters
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  difficultyScroll: {
    marginTop: 4,
  },
  difficultyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedDifficultyChip: {
    backgroundColor: '#4ecdc4',
    borderColor: '#4ecdc4',
  },
  difficultyIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#495057',
  },
  selectedDifficultyText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Results
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },

  // Activities
  activitiesContainer: {
    gap: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f1f2f6',
    borderLeftWidth: 4,
  },
  activityHeader: {
    marginBottom: 12,
  },
  activityTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  activityMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  activityDuration: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  activityAgeGroup: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  activityCategory: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learningGoals: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 12,
  },
  goalTag: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  goalText: {
    fontSize: 11,
    color: '#495057',
    fontWeight: '500',
  },
  activityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startIcon: {
    fontSize: 16,
    color: '#fff',
  },
  gamesButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamesIcon: {
    fontSize: 16,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },

  // Error
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 100,
  },

  // Bottom spacing
  bottomSpacing: {
    height: 30,
  },

  // Translation Toggle Styles
  translationToggleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  
  translationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderColor: '#007AFF',
    borderWidth: 1.5,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minWidth: 150,
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  translationToggleActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  
  toggleIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  
  translationToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
    letterSpacing: 0.3,
  },
  
  translationToggleTextActive: {
    color: '#FFFFFF',
  },
  
  languageIndicator: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  
  languageText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default CategoryDetailScreen;