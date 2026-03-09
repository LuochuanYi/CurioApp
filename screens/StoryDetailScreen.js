import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';
import { getBilingualStoryById, getLocalizedStory, getLocalizedCategory } from '../data/stories-bilingual';
import { STORY_CATEGORIES, getStoryById } from '../data/stories';
import { useBilingualContent } from '../hooks/useBilingualContent';
const { getLocalizedStoryContent, isMixedBilingualContent } = require('../utils/storyContentFilter');

const { width: screenWidth } = Dimensions.get('window');

// Hybrid approach: Handle both regular stories (from StoryCategoryScreen) and bilingual stories
const useHybridStoryDetail = (storyParam) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useBilingualContent();

  useEffect(() => {
    const fetchStoryDetail = async () => {
      console.log('🔍 useHybridStoryDetail - Story param:', storyParam);
      setLoading(true);
      
      // Check if we received a full story object (from StoryCategoryScreen) or just an ID
      if (storyParam && typeof storyParam === 'object' && storyParam.title) {
        // We received a complete story object from StoryCategoryScreen - use it directly
        console.log('✅ Using regular story object:', storyParam.title);
        setData(storyParam);
        setLoading(false);
        return;
      }
      
      // We received just an ID - try to find it in bilingual system
      const storyId = storyParam?.id || storyParam;
      if (storyId) {
        console.log('🔍 Looking for bilingual story with ID:', storyId);
        
        // Try bilingual system first
        let bilingualStory = getBilingualStoryById(storyId);
        
        if (bilingualStory) {
          // Get localized version based on current language
          const localizedStory = getLocalizedStory(bilingualStory, currentLanguage);
          const localizedCategory = getLocalizedCategory(bilingualStory.category, currentLanguage);
          
          setData({
            ...localizedStory,
            categoryName: localizedCategory?.name || bilingualStory.category,
            categoryIcon: localizedCategory?.icon || '📚',
            nextStory: bilingualStory.nextStory ? { id: bilingualStory.nextStory } : null,
            previousStory: bilingualStory.previousStory ? { id: bilingualStory.previousStory } : null
          });
          
          console.log('✅ Bilingual story loaded:', localizedStory.title);
        } else {
          // Fallback to regular story library
          console.log('⚠️ Bilingual story not found, trying regular story library...');
          const regularStory = getStoryById(storyId);
          
          if (regularStory) {
            // Use regular story as-is (already in English)
            const categoryData = Object.values(STORY_CATEGORIES).find(c => c.id === regularStory.category);
            
            setData({
              ...regularStory,
              categoryName: categoryData?.name || regularStory.category,
              categoryIcon: categoryData?.icon || '📚',
              nextStory: regularStory.nextStory ? { id: regularStory.nextStory } : null,
              previousStory: regularStory.previousStory ? { id: regularStory.previousStory } : null
            });
            
            console.log('✅ Regular story loaded:', regularStory.title);
          } else {
            // Story not found in either system
            console.log('❌ Story not found in any system');
            setData({
              id: storyId,
              title: currentLanguage === 'zh' ? "找不到故事" : "Story Not Found",
              category: "unknown",
              categoryName: currentLanguage === 'zh' ? "未知" : "Unknown",
              categoryIcon: "❓",
              rating: 0,
              duration: currentLanguage === 'zh' ? "0分钟" : "0 min",
              content: currentLanguage === 'zh' ? "抱歉，找不到这个故事。" : "Sorry, this story could not be found.",
              moral: "",
              nextStory: null,
              previousStory: null
            });
          }
        }
      }
      setLoading(false);
    };

    if (storyParam) {
      fetchStoryDetail();
    }
  }, [storyParam, currentLanguage]);

  return { data, loading };
};

const StoryDetailScreen = ({ navigation, route }) => {
  const { story } = route.params || {};
  console.log('🎯 Route params:', route.params);
  console.log('📖 Story from params:', story);
  console.log('🔢 Story ID:', story?.id);
  
  const { data, loading } = useHybridStoryDetail(story);
  const { t } = useTranslation();
  const { currentLanguage, isChineseMode } = useBilingualContent();
  const { translateContent } = useDynamicTranslation();
  
  // State for translated content
  const [translatedData, setTranslatedData] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Debug logging
  console.log('🔄 StoryDetailScreen render - Loading:', loading);
  console.log('📚 Story data available:', !!data);
  console.log('🌐 Current Language:', currentLanguage);
  
  // Translate regular English stories to Chinese when needed
  useEffect(() => {
    const translateStory = async () => {
      if (!data || loading) return;
      
      // Check if this is a regular English story (not a Chinese bedtime story with mixed content)
      const hasMixedContent = data.content && isMixedBilingualContent(data.content);
      const hasChineseTitle = !!data.chineseTitle;
      const isChinesesBedtimeStory = hasMixedContent || hasChineseTitle;
      
      // Only translate non-Chinese bedtime stories when in Chinese mode
      if (isChineseMode && !isChinesesBedtimeStory) {
        console.log('📖 Translating regular English story to Chinese:', data.title);
        setIsTranslating(true);
        try {
          // Translate the main content fields
          const translatedTitle = await translateContent(data.title, 'en');
          const translatedSummary = await translateContent(data.summary, 'en');
          const translatedContent = await translateContent(data.content, 'en');
          const translatedMoral = data.moral ? await translateContent(data.moral, 'en') : '';
          
          setTranslatedData({
            ...data,
            title: translatedTitle,
            summary: translatedSummary,
            content: translatedContent,
            moral: translatedMoral
          });
          console.log('✅ Story translated successfully');
        } catch (error) {
          console.warn('⚠️ Translation failed, using original English:', error);
          setTranslatedData(null); // Fall back to original
        } finally {
          setIsTranslating(false);
        }
      } else {
        // Not in Chinese mode or is a Chinese bedtime story - no translation needed
        setTranslatedData(null);
      }
    };
    
    translateStory();
  }, [data, loading, isChineseMode, currentLanguage, translateContent]);
  
  // Text-to-speech with bilingual support
  const {
    playPause,
    stopStory,
    isPlaying,
    isLoading,
    progress,
    formatProgress
  } = useTextToSpeech(translatedData?.content || data?.content);

  // Force re-render when TTS state changes
  const [renderKey, setRenderKey] = useState(0);
  useEffect(() => {
    setRenderKey(prev => prev + 1); // Force re-render
  }, [isLoading, isPlaying]);

  // Smart content display function - works with both regular and bilingual stories
  const getDisplayContent = (field) => {
    // Use translated data if available
    const displayData = translatedData || data;
    if (!displayData) return '';
    
    // For regular Chinese stories, use Chinese-specific fields when available and in Chinese mode
    if (isChineseMode && field === 'title' && displayData.chineseTitle) {
      return displayData.chineseTitle;
    }
    
    // For story content, filter based on language setting if it's mixed bilingual
    if (field === 'content' && displayData.content) {
      // Check if this is a Chinese bedtime story with mixed language content
      if (isMixedBilingualContent(displayData.content)) {
        console.log('🌐 Filtering mixed bilingual content for language:', currentLanguage);
        // Filter content based on current language setting
        return getLocalizedStoryContent(displayData.content, currentLanguage, true);
      }
    }
    
    return displayData[field] || '';
  };
  
  // Get the best title - works with both story systems
  const getTitle = () => {
    const displayData = translatedData || data;
    if (!displayData) return '';
    
    // For regular Chinese stories in Chinese mode, show Chinese title prominently
    if (isChineseMode && displayData.chineseTitle) {
      return `${displayData.chineseTitle}\n(${displayData.title})`;
    }
    
    return displayData.title;
  };

  const handleSpeak = () => {
    playPause();
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
    console.log('🔄 Showing loading screen');
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!data) {
    console.log('❌ No data - showing error screen');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Story Not Found</Text>
      </View>
    );
  }

  console.log('✅ Rendering story content');

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
          key={`speaker-${renderKey}`}
          style={styles.speakButton}
          onPress={handleSpeak}
          disabled={isLoading}
        >
          <Text style={styles.speakButtonText}>
            {isLoading ? '⏳' : isPlaying ? '⏹️' : '🔊'}
          </Text>
        </TouchableOpacity>
        
        {/* Progress indicator when playing */}
        {(isPlaying || progress > 0) && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {formatProgress ? formatProgress() : `${Math.round(progress)}%`}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        )}
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
        <Text style={styles.title}>{getTitle()}</Text>

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
                <View key={`tag-${tag}-${index}`} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cultural Context - for Chinese stories */}
        {data.culturalContext && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isChineseMode ? '文化背景' : 'Cultural Context'}
            </Text>
            <Text style={styles.culturalContext}>{data.culturalContext}</Text>
          </View>
        )}

        {/* Pinyin Guide - for Chinese stories */}
        {data.pinyin && isChineseMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>拼音 (Pinyin)</Text>
            <Text style={styles.pinyin}>{data.pinyin}</Text>
          </View>
        )}

        {/* Story Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('story')}</Text>
          <Text style={styles.content}>{getDisplayContent('content')}</Text>
        </View>

        {/* Debug TTS - TEMPORARY */}
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
  culturalContext: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a4a4a',
    fontStyle: 'italic',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  pinyin: {
    fontSize: 18,
    lineHeight: 26,
    color: '#d32f2f',
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: '#fef7f0',
    padding: 12,
    borderRadius: 8,
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
  // Text-to-Speech Progress Styles
  progressContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 2,
  },
});

export default StoryDetailScreen;