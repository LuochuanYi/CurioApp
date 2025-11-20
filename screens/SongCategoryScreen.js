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
import { SONG_CATEGORIES, getSongsByCategory } from '../data/songs';

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

const SongCategoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { translateContent } = useDynamicTranslation();
  
  const categoryId = route.params?.categoryId;
  const [searchQuery, setSearchQuery] = useState('');

  // Get category information
  const category = Object.values(SONG_CATEGORIES || {}).find(cat => cat?.id === categoryId);

  // Get songs for this category with search filtering
  const filteredSongs = useMemo(() => {
    let songs = getSongsByCategory(categoryId) || [];
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      songs = songs.filter(song => 
        song.title?.toLowerCase().includes(lowerQuery) ||
        song.description?.toLowerCase().includes(lowerQuery) ||
        song.learningGoals?.some(goal => goal?.toLowerCase().includes(lowerQuery))
      );
    }
    
    return songs;
  }, [categoryId, searchQuery]);

  const handleSongPress = (song) => {
    console.log(`Playing song: ${song.title}`);
    navigation.navigate('SongPlayer', { song });
  };

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <CurioHeader 
          title={t("Song Category")} 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t("Song category not found")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={CURIO_THEME.colors.primary} />
      
      <CurioHeader 
        title={category.name || t("Songs")} 
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
              {filteredSongs.length} {t("songs")}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t("Search songs...")}
            placeholderTextColor={CURIO_THEME.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Songs Grid */}
        {filteredSongs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? t("No songs found matching your search") : t("No songs available in this category")}
            </Text>
          </View>
        ) : (
          <View style={styles.songsGrid}>
            {filteredSongs.map((song, index) => (
              <TouchableOpacity
                key={song.id || index}
                style={styles.songCard}
                onPress={() => handleSongPress(song)}
                activeOpacity={0.8}
              >
                <View style={[styles.songImageContainer, { backgroundColor: addOpacityToColor(category?.color, 0.188) }]}>
                  <Text style={styles.songEmoji}>🎤</Text>
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶️</Text>
                  </View>
                </View>
                
                <View style={styles.songContent}>
                  <Text style={styles.songTitle} numberOfLines={2}>
                    {song.title}
                  </Text>
                  
                  <Text style={styles.songMeta}>
                    {song.duration} • {song.difficulty || t("All Ages")}
                  </Text>
                  
                  {song.description && (
                    <Text style={styles.songDescription} numberOfLines={2}>
                      {song.description}
                    </Text>
                  )}

                  {/* Learning Goals */}
                  {song.learningGoals && song.learningGoals.length > 0 && (
                    <View style={styles.learningGoals}>
                      <Text style={styles.learningGoalsTitle}>{t("Learn")}:</Text>
                      <View style={styles.goalTags}>
                        {song.learningGoals.slice(0, 2).map((goal, goalIndex) => (
                          <View key={goalIndex} style={styles.goalTag}>
                            <Text style={styles.goalText}>{goal}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Song Features */}
                  <View style={styles.songFeatures}>
                    {song.hasSignLanguage && (
                      <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🤟</Text>
                        <Text style={styles.featureText}>{t("Sign Language")}</Text>
                      </View>
                    )}
                    {song.hasLyrics && (
                      <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📝</Text>
                        <Text style={styles.featureText}>{t("Lyrics")}</Text>
                      </View>
                    )}
                    {song.interactive && (
                      <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🎯</Text>
                        <Text style={styles.featureText}>{t("Interactive")}</Text>
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
  songsGrid: {
    padding: CURIO_THEME.spacing.md,
    gap: CURIO_THEME.spacing.md,
  },
  songCard: {
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
  songImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  songEmoji: {
    fontSize: 48,
  },
  playButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: CURIO_THEME.colors.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 14,
  },
  songContent: {
    padding: CURIO_THEME.spacing.md,
  },
  songTitle: {
    fontSize: CURIO_THEME.typography.cardTitle.fontSize,
    fontWeight: CURIO_THEME.typography.weights.semiBold,
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  songMeta: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  songDescription: {
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
  songFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CURIO_THEME.spacing.sm,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  featureText: {
    fontSize: CURIO_THEME.typography.caption.fontSize,
    color: CURIO_THEME.colors.textSecondary,
  },
});

export default SongCategoryScreen;
