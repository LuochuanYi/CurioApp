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
import {
  LEARNING_CATEGORIES,
  getActivitiesByCategory,
  DIFFICULTY_LEVELS,
  getActivitiesByDifficulty,
  searchActivities
} from '../data/learningCategories';

const { width: screenWidth } = Dimensions.get('window');

const CategoryDetailScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const category = Object.values(LEARNING_CATEGORIES).find(cat => cat.id === categoryId);
  
  const filteredActivities = useMemo(() => {
    let activities = getActivitiesByCategory(categoryId);
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      activities = getActivitiesByDifficulty(categoryId, selectedDifficulty);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      activities = activities.filter(activity => 
        activity.title.toLowerCase().includes(lowerQuery) ||
        activity.description.toLowerCase().includes(lowerQuery) ||
        activity.learningGoals.some(goal => goal.toLowerCase().includes(lowerQuery))
      );
    }
    
    return activities;
  }, [categoryId, selectedDifficulty, searchQuery]);

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </SafeAreaView>
    );
  }

  const handleActivityPress = (activity) => {
    navigation.navigate('ActivityDetail', { 
      activity,
      categoryId,
      categoryName: category.name 
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getDifficultyColor = (difficulty) => {
    return DIFFICULTY_LEVELS[difficulty.id.toUpperCase()]?.color || '#6c757d';
  };

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
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.categorySubtitle}>
              {category.totalActivities} activities • {category.ageGroup}
            </Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search activities..."
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

        {/* Difficulty Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Difficulty Level:</Text>
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
                All Levels
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
                  {difficulty.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery ? `Search Results` : 
             selectedDifficulty === 'all' ? 'All Activities' : 
             `${DIFFICULTY_LEVELS[selectedDifficulty.toUpperCase()]?.name} Activities`}
          </Text>
          <Text style={styles.resultsCount}>{filteredActivities.length} activities</Text>
        </View>

        {/* Activities List */}
        <View style={styles.activitiesContainer}>
          {filteredActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No activities found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try a different search term' : 'Try changing the difficulty filter'}
              </Text>
            </View>
          ) : (
            filteredActivities.map((activity, index) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityCard,
                  { borderLeftColor: getDifficultyColor(activity.difficulty) }
                ]}
                onPress={() => handleActivityPress(activity)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${activity.title}, ${activity.difficulty.name} difficulty, ${activity.duration}`}
              >
                <View style={styles.activityHeader}>
                  <View style={styles.activityTitleContainer}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(activity.difficulty) }
                    ]}>
                      <Text style={styles.difficultyBadgeText}>{activity.difficulty.icon}</Text>
                    </View>
                  </View>
                  <View style={styles.activityMeta}>
                    <Text style={styles.activityDuration}>⏱️ {activity.duration}</Text>
                    <Text style={styles.activityAgeGroup}>👶 {activity.ageGroup}</Text>
                  </View>
                </View>
                
                <Text style={styles.activityDescription} numberOfLines={2}>
                  {activity.description}
                </Text>
                
                <View style={styles.activityFooter}>
                  <View style={styles.learningGoals}>
                    {activity.learningGoals.slice(0, 3).map((goal, goalIndex) => (
                      <View key={goalIndex} style={styles.goalTag}>
                        <Text style={styles.goalText}>{goal}</Text>
                      </View>
                    ))}
                    {activity.learningGoals.length > 3 && (
                      <View style={styles.goalTag}>
                        <Text style={styles.goalText}>+{activity.learningGoals.length - 3}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.startButton}>
                    <Text style={styles.startIcon}>▶️</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Bottom spacing */}
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
});

export default CategoryDetailScreen;