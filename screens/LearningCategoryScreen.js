import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { CurioHeader } from '../components';
import { CURIO_THEME } from '../theme';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';
import { 
  LEARNING_CATEGORIES, 
  getActivitiesByCategory, 
  getActivitiesByDifficulty 
} from '../data/learningCategories';

// Helper function to add opacity to hex colors for React Native Web compatibility
const addOpacityToColor = (color, opacity) => {
  if (!color) return CURIO_THEME.colors.background;
  if (color.startsWith('#')) {
    // Convert hex to rgb, then return as rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

const { width } = Dimensions.get('window');

const LearningCategoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { translateContent } = useDynamicTranslation();
  
  const categoryId = route.params?.categoryId;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Get category information
  const category = Object.values(LEARNING_CATEGORIES || {}).find(cat => cat?.id === categoryId);

  // Get activities for this category with filtering
  const filteredActivities = useMemo(() => {
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
  }, [categoryId, searchQuery, selectedDifficulty]);

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const handleActivityPress = (activity) => {
    console.log(`Opening activity: ${activity.title}`);
    navigation.navigate('ActivityDetail', { activity, categoryId });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800', 
      advanced: '#F44336',
    };
    // Handle both string and object difficulty formats
    const difficultyId = typeof difficulty === 'string' ? difficulty : difficulty?.id;
    return colors[difficultyId] || CURIO_THEME.colors.textSecondary;
  };

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <CurioHeader 
          title={t("Learning Category")} 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t("Learning category not found")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={CURIO_THEME.colors.primary} />
      
      <CurioHeader 
        title={category.name || t("Learning")} 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Header */}
        <View style={[styles.categoryHeader, { backgroundColor: addOpacityToColor(category?.color, 0.125) }]}>
          <View style={styles.categoryIconContainer}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.categorySubtitle}>
              {filteredActivities.length} {t("activities")} • {category.ageGroup || t("All Ages")}
            </Text>
            {category.description && (
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {category.description}
              </Text>
            )}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t("Search activities...")}
            placeholderTextColor={CURIO_THEME.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Difficulty Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>{t("Difficulty")}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.difficultyTabs}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyTab,
                    selectedDifficulty === difficulty && styles.activeDifficultyTab
                  ]}
                  onPress={() => setSelectedDifficulty(difficulty)}
                >
                  <Text style={[
                    styles.difficultyTabText,
                    selectedDifficulty === difficulty && styles.activeDifficultyTabText
                  ]}>
                    {t(difficulty.charAt(0).toUpperCase() + difficulty.slice(1))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Activities Grid */}
        {filteredActivities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? t("No activities found matching your search") : t("No activities available in this category")}
            </Text>
          </View>
        ) : (
          <View style={styles.activitiesGrid}>
            {filteredActivities.map((activity, index) => (
              <TouchableOpacity
                key={activity.id || index}
                style={styles.activityCard}
                onPress={() => handleActivityPress(activity)}
                activeOpacity={0.8}
              >
                <View style={[styles.activityImageContainer, { backgroundColor: addOpacityToColor(category?.color, 0.188) }]}>
                  <Text style={styles.activityEmoji}>
                    {activity.icon || category.icon || '🎯'}
                  </Text>
                  {activity.difficulty && (
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(activity.difficulty) }]}>
                      <Text style={styles.difficultyBadgeText}>
                        {activity.difficulty?.name?.toUpperCase() || activity.difficulty?.id?.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle} numberOfLines={2}>
                    {activity.title}
                  </Text>
                  
                  <Text style={styles.activityMeta}>
                    {activity.duration || t("15 min")} • {activity.ageRange || category.ageGroup}
                  </Text>
                  
                  {activity.description && (
                    <Text style={styles.activityDescription} numberOfLines={2}>
                      {activity.description}
                    </Text>
                  )}

                  {/* Learning Goals */}
                  {activity.learningGoals && activity.learningGoals.length > 0 && (
                    <View style={styles.learningGoals}>
                      <Text style={styles.learningGoalsTitle}>{t("Learn")}:</Text>
                      <View style={styles.goalTags}>
                        {activity.learningGoals && activity.learningGoals.slice(0, 3).map((goal, goalIndex) => (
                          <View key={goalIndex} style={styles.goalTag}>
                            <Text style={styles.goalText}>{goal}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Activity Stats */}
                  <View style={styles.activityStats}>
                    {activity.materials && (
                      <View style={styles.stat}>
                        <Text style={styles.statIcon}>📦</Text>
                        <Text style={styles.statText}>{activity.materials.length} {t("materials")}</Text>
                      </View>
                    )}
                    {activity.interactive && (
                      <View style={styles.stat}>
                        <Text style={styles.statIcon}>🎮</Text>
                        <Text style={styles.statText}>{t("Interactive")}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CURIO_THEME.colors.primary,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: CURIO_THEME.spacing.lg,
  },
  errorText: {
    fontSize: CURIO_THEME.typography.body.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CURIO_THEME.spacing.lg,
    margin: CURIO_THEME.spacing.md,
    borderRadius: CURIO_THEME.radius.card,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CURIO_THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CURIO_THEME.spacing.md,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: CURIO_THEME.typography.h3.fontSize,
    fontWeight: CURIO_THEME.typography.weights.bold,
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: CURIO_THEME.typography.bodySmall.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  searchContainer: {
    paddingHorizontal: CURIO_THEME.spacing.md,
    marginBottom: CURIO_THEME.spacing.sm,
  },
  searchInput: {
    backgroundColor: CURIO_THEME.colors.background,
    borderRadius: CURIO_THEME.radius.input,
    paddingHorizontal: CURIO_THEME.spacing.md,
    paddingVertical: CURIO_THEME.spacing.sm,
    fontSize: CURIO_THEME.typography.body.fontSize,
    color: CURIO_THEME.colors.textPrimary,
    borderWidth: 1,
    borderColor: CURIO_THEME.colors.border,
  },
  filterContainer: {
    paddingHorizontal: CURIO_THEME.spacing.md,
    marginBottom: CURIO_THEME.spacing.md,
  },
  filterLabel: {
    fontSize: CURIO_THEME.typography.bodySmall.fontSize,
    color: CURIO_THEME.colors.textPrimary,
    fontWeight: CURIO_THEME.typography.weights.medium,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  difficultyTabs: {
    flexDirection: 'row',
    gap: CURIO_THEME.spacing.xs,
  },
  difficultyTab: {
    paddingHorizontal: CURIO_THEME.spacing.md,
    paddingVertical: CURIO_THEME.spacing.xs,
    borderRadius: 20,
    backgroundColor: CURIO_THEME.colors.background,
    borderWidth: 1,
    borderColor: CURIO_THEME.colors.border,
  },
  activeDifficultyTab: {
    backgroundColor: CURIO_THEME.colors.primary,
    borderColor: CURIO_THEME.colors.primary,
  },
  difficultyTabText: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    fontWeight: CURIO_THEME.typography.weights.medium,
  },
  activeDifficultyTabText: {
    color: CURIO_THEME.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: CURIO_THEME.spacing.xl,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: CURIO_THEME.spacing.md,
  },
  emptyText: {
    fontSize: CURIO_THEME.typography.body.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  activitiesGrid: {
    padding: CURIO_THEME.spacing.md,
    gap: CURIO_THEME.spacing.md,
  },
  activityCard: {
    backgroundColor: CURIO_THEME.colors.background,
    borderRadius: CURIO_THEME.radius.card,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: CURIO_THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: CURIO_THEME.spacing.sm,
  },
  activityImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activityEmoji: {
    fontSize: 48,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadgeText: {
    fontSize: 10,
    color: CURIO_THEME.colors.primary,
    fontWeight: CURIO_THEME.typography.weights.bold,
  },
  activityContent: {
    padding: CURIO_THEME.spacing.md,
  },
  activityTitle: {
    fontSize: CURIO_THEME.typography.cardTitle.fontSize,
    fontWeight: CURIO_THEME.typography.weights.semiBold,
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  activityMeta: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  activityDescription: {
    fontSize: CURIO_THEME.typography.bodySmall.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: CURIO_THEME.spacing.sm,
  },
  learningGoals: {
    marginBottom: CURIO_THEME.spacing.sm,
  },
  learningGoalsTitle: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textPrimary,
    fontWeight: CURIO_THEME.typography.weights.medium,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  goalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CURIO_THEME.spacing.xs,
  },
  goalTag: {
    backgroundColor: addOpacityToColor(CURIO_THEME.colors.primary, 0.125),
    paddingHorizontal: CURIO_THEME.spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
  },
  goalText: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.primary,
    fontWeight: CURIO_THEME.typography.weights.medium,
  },
  activityStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CURIO_THEME.spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statText: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
  },
});

export default LearningCategoryScreen;
