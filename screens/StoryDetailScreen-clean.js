import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { getBilingualStoryById, getLocalizedStory, getLocalizedCategory } from '../data/stories-bilingual';
import { useBilingualContent } from '../hooks/useBilingualContent';
import { logInfo } from '../utils/logger';

const { width: screenWidth } = Dimensions.get('window');

// Simple hook for bilingual story data
const useBilingualStoryDetail = (storyId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useBilingualContent();

  useEffect(() => {
    const fetchStoryDetail = async () => {
      logInfo('🔍 useBilingualStoryDetail - Looking for story ID:', storyId);
      setLoading(true);
      
      // Simulate network delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get bilingual story data
      const bilingualStory = getBilingualStoryById(storyId);
      
      if (bilingualStory) {
        // Get localized version based on current language
        const localizedStory = getLocalizedStory(bilingualStory, currentLanguage);
        const localizedCategory = getLocalizedCategory(bilingualStory.category, currentLanguage);
        
        setData({
          ...localizedStory,
          categoryName: localizedCategory?.name || bilingualStory.category,
          categoryIcon: localizedCategory?.icon || '📚',
          // Add navigation helpers (simplified)
          nextStory: bilingualStory.nextStory ? { id: bilingualStory.nextStory } : null,
          previousStory: bilingualStory.previousStory ? { id: bilingualStory.previousStory } : null
        });
        
        logInfo('✅ Bilingual story loaded:', localizedStory.title);
      } else {
        logInfo('❌ Story not found');
        setData({
          id: storyId,
          title: currentLanguage === 'zh' ? "找不到故事" : "Story Not Found",
          category: "unknown",
          categoryName: currentLanguage === 'zh' ? "未知" : "Unknown",
          categoryIcon: "❓",
          rating: 0,
          duration: currentLanguage === 'zh' ? "0分钟" : "0 min",
          language: currentLanguage === 'zh' ? "Chinese" : "English",
          content: currentLanguage === 'zh' ? "抱歉，找不到这个故事。" : "Sorry, this story could not be found.",
          moral: "",
          nextStory: null,
          previousStory: null
        });
      }
      setLoading(false);
    };

    if (storyId) {
      fetchStoryDetail();
    }
  }, [storyId, currentLanguage]); // Re-fetch when language changes

  return { data, loading };
};

const StoryDetailScreen = ({ navigation, route }) => {
  const { story } = route.params || {};
  logInfo('🎯 Route params:', route.params);
  logInfo('📖 Story from params:', story);
  logInfo('🔢 Story ID:', story?.id);
  
  const { data, loading } = useBilingualStoryDetail(story?.id);
  const { t } = useTranslation();
  const { currentLanguage, isChineseMode } = useBilingualContent();
  
  // Text-to-speech
  const { speak, speaking: isPlaying, stop: stopStory } = useTextToSpeech();

  // Simple content display function - no translation needed!
  const getDisplayContent = (field) => {
    if (!data) return '';
    return data[field] || '';
  };

  const handleSpeak = () => {
    if (isPlaying) {
      stopStory();
    } else if (data?.content) {
      speak(data.content);
    }
  };

  const handleNavigation = (targetStory) => {
    if (targetStory) {
      navigation.push('StoryDetail', { story: { id: targetStory.id } });
    }
  };

  // Cleanup speech when component unmounts
  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopStory();
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('storyNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {/* Language indicator */}
        <View style={styles.languageIndicator}>
          <Text style={styles.languageText}>
            {isChineseMode ? '中文' : 'English'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.speakButton} 
          onPress={handleSpeak}
        >
          <Text style={styles.speakButtonText}>
            {isPlaying ? '⏹️' : '🔊'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{getDisplayContent('categoryIcon')}</Text>
            <Text style={styles.categoryText}>{getDisplayContent('categoryName')}</Text>
          </View>
        </View>

        {/* Story Title */}
        <Text style={styles.title}>{getDisplayContent('title')}</Text>

        {/* Story Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>⏱️ {getDisplayContent('duration')}</Text>
          <Text style={styles.infoText}>👶 {getDisplayContent('ageGroup')}</Text>
          <Text style={styles.infoText}>⭐ {data.rating}/5</Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('summary')}</Text>
          <Text style={styles.summary}>{getDisplayContent('summary')}</Text>
        </View>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('tags')}</Text>
            <View style={styles.tagsContainer}>
              {data.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Story Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('story')}</Text>
          <Text style={styles.content}>{getDisplayContent('content')}</Text>
        </View>

        {/* Moral */}
        {data.moral && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('moral')}</Text>
            <Text style={styles.moral}>{getDisplayContent('moral')}</Text>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          {data.previousStory && (
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => handleNavigation(data.previousStory)}
            >
              <Text style={styles.navButtonText}>← {t('previousStory')}</Text>
            </TouchableOpacity>
          )}
          
          {data.nextStory && (
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton]}
              onPress={() => handleNavigation(data.nextStory)}
            >
              <Text style={styles.navButtonText}>{t('nextStory')} →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  languageIndicator: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  speakButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakButtonText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    padding: 20,
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    fontStyle: 'italic',
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
  },
  moral: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4caf50',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#2e7d32',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  navButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  nextButton: {
    backgroundColor: '#4caf50',
  },
  navButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default StoryDetailScreen;