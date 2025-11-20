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
import { STORY_CATEGORIES, getStoriesByCategory } from '../data/stories';

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

const StoryCategoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { translateContent } = useDynamicTranslation();
  
  const categoryId = route.params?.categoryId;
  const [searchQuery, setSearchQuery] = useState('');

  // Get category information
  const category = Object.values(STORY_CATEGORIES || {}).find(cat => cat?.id === categoryId);

  // Get stories for this category with search filtering
  const filteredStories = useMemo(() => {
    let stories = getStoriesByCategory(categoryId) || [];
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      stories = stories.filter(story => 
        story.title?.toLowerCase().includes(lowerQuery) ||
        story.summary?.toLowerCase().includes(lowerQuery) ||
        story.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    return stories;
  }, [categoryId, searchQuery]);

  const handleStoryPress = (story) => {
    console.log(`Opening story: ${story.title}`);
    navigation.navigate('StoryDetail', { story });
  };

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <CurioHeader 
          title={t("Story Category")} 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t("Story category not found")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={CURIO_THEME.colors.primary} />
      
      <CurioHeader 
        title={category.name || t("Stories")} 
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
              {filteredStories.length} {t("stories")}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t("Search stories...")}
            placeholderTextColor={CURIO_THEME.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? t("No stories found matching your search") : t("No stories available in this category")}
            </Text>
          </View>
        ) : (
          <View style={styles.storiesGrid}>
            {filteredStories.map((story, index) => (
              <TouchableOpacity
                key={story.id || index}
                style={styles.storyCard}
                onPress={() => handleStoryPress(story)}
                activeOpacity={0.8}
              >
                <View style={[styles.storyImageContainer, { backgroundColor: addOpacityToColor(category?.color, 0.188) }]}>
                  <Text style={styles.storyEmoji}>📖</Text>
                </View>
                
                <View style={styles.storyContent}>
                  <Text style={styles.storyTitle} numberOfLines={2}>
                    {story.title}
                  </Text>
                  
                  <Text style={styles.storyMeta}>
                    {story.duration} • {story.ageGroup}
                  </Text>
                  
                  <Text style={styles.storySummary} numberOfLines={2}>
                    {story.summary}
                  </Text>

                  <View style={styles.storyTags}>
                    {story.tags && story.tags.slice(0, 2).map((tag, tagIndex) => (
                      <View key={tagIndex} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.storyFooter}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingIcon}>⭐</Text>
                      <Text style={styles.ratingText}>{story.rating}</Text>
                    </View>
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
  storiesGrid: {
    padding: CURIO_THEME.spacing.md,
    gap: CURIO_THEME.spacing.md,
  },
  storyCard: {
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
  storyImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyEmoji: {
    fontSize: 48,
  },
  storyContent: {
    padding: CURIO_THEME.spacing.md,
  },
  storyTitle: {
    fontSize: CURIO_THEME.typography.cardTitle.fontSize,
    fontWeight: CURIO_THEME.typography.weights.semiBold,
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  storyMeta: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  storySummary: {
    fontSize: CURIO_THEME.typography.bodySmall.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: CURIO_THEME.spacing.sm,
  },
  storyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CURIO_THEME.spacing.xs,
    marginBottom: CURIO_THEME.spacing.sm,
  },
  tag: {
    backgroundColor: addOpacityToColor(CURIO_THEME.colors.primary, 0.125),
    paddingHorizontal: CURIO_THEME.spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.primary,
    fontWeight: CURIO_THEME.typography.weights.medium,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    fontWeight: CURIO_THEME.typography.weights.medium,
  },
});

export default StoryCategoryScreen;
