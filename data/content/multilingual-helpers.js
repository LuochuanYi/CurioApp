// 🌍 Multilingual Content Helper Functions
// Utilities to work with multilingual story and song content

import { MULTILINGUAL_STORIES, MULTILINGUAL_CATEGORIES } from './stories-multilingual';
import { MULTILINGUAL_SONGS, MULTILINGUAL_SONG_CATEGORIES } from './songs-multilingual';

// Default language fallback
const DEFAULT_LANGUAGE = 'en';

/**
 * Get story content in specified language
 * @param {number|string} storyId - The story ID
 * @param {string} language - Language code (en, zh, fr, es, uk, nl)
 * @returns {object|null} Story content object or null if not found
 */
export const getStoryContent = (storyId, language = DEFAULT_LANGUAGE) => {
  const story = MULTILINGUAL_STORIES[storyId];
  if (!story) return null;
  
  // Return content in requested language, fallback to English if not available
  return story[language] || story[DEFAULT_LANGUAGE] || null;
};

/**
 * Get all stories in specified language with metadata
 * @param {string} language - Language code
 * @returns {Array} Array of story objects with IDs and content
 */
export const getAllStoriesInLanguage = (language = DEFAULT_LANGUAGE) => {
  const stories = [];
  
  Object.keys(MULTILINGUAL_STORIES).forEach(storyId => {
    const content = getStoryContent(storyId, language);
    if (content) {
      stories.push({
        id: parseInt(storyId),
        ...content,
        // Add category mapping if needed
        category: getStoryCategoryForId(storyId)
      });
    }
  });
  
  return stories;
};

/**
 * Get stories filtered by category in specified language
 * @param {string} category - Category key (bedtime, classic, adventure, etc.)
 * @param {string} language - Language code
 * @returns {Array} Filtered array of story objects
 */
export const getStoriesByCategory = (category, language = DEFAULT_LANGUAGE) => {
  const allStories = getAllStoriesInLanguage(language);
  return allStories.filter(story => story.category === category);
};

/**
 * Get localized category name and icon
 * @param {string} categoryKey - Category key
 * @param {string} language - Language code
 * @returns {object} Category object with name and icon
 */
export const getCategoryInfo = (categoryKey, language = DEFAULT_LANGUAGE) => {
  const category = MULTILINGUAL_CATEGORIES[categoryKey];
  if (!category) return null;
  
  return category[language] || category[DEFAULT_LANGUAGE] || null;
};

/**
 * Get all categories in specified language
 * @param {string} language - Language code
 * @returns {object} Object with category keys and localized info
 */
export const getAllCategoriesInLanguage = (language = DEFAULT_LANGUAGE) => {
  const categories = {};
  
  Object.keys(MULTILINGUAL_CATEGORIES).forEach(key => {
    const categoryInfo = getCategoryInfo(key, language);
    if (categoryInfo) {
      categories[key] = categoryInfo;
    }
  });
  
  return categories;
};

/**
 * Search stories by title or content in specified language
 * @param {string} searchTerm - Search term
 * @param {string} language - Language code
 * @returns {Array} Array of matching story objects
 */
export const searchStories = (searchTerm, language = DEFAULT_LANGUAGE) => {
  if (!searchTerm.trim()) return [];
  
  const allStories = getAllStoriesInLanguage(language);
  const searchLower = searchTerm.toLowerCase();
  
  return allStories.filter(story => 
    story.title.toLowerCase().includes(searchLower) ||
    story.summary.toLowerCase().includes(searchLower) ||
    story.content.toLowerCase().includes(searchLower) ||
    story.tags?.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

// Song helper functions

/**
 * Get song content in specified language
 * @param {number|string} songId - The song ID
 * @param {string} language - Language code
 * @returns {object|null} Song content object or null if not found
 */
export const getSongContent = (songId, language = DEFAULT_LANGUAGE) => {
  const song = MULTILINGUAL_SONGS[songId];
  if (!song) return null;
  
  return song[language] || song[DEFAULT_LANGUAGE] || null;
};

/**
 * Get all songs in specified language
 * @param {string} language - Language code
 * @returns {Array} Array of song objects with IDs and content
 */
export const getAllSongsInLanguage = (language = DEFAULT_LANGUAGE) => {
  const songs = [];
  
  Object.keys(MULTILINGUAL_SONGS).forEach(songId => {
    const content = getSongContent(songId, language);
    if (content) {
      songs.push({
        id: parseInt(songId),
        ...content,
        // Add category mapping if needed
        category: getSongCategoryForId(songId)
      });
    }
  });
  
  return songs;
};

/**
 * Get song category info in specified language
 * @param {string} categoryKey - Category key
 * @param {string} language - Language code
 * @returns {object} Category object with name and icon
 */
export const getSongCategoryInfo = (categoryKey, language = DEFAULT_LANGUAGE) => {
  const category = MULTILINGUAL_SONG_CATEGORIES[categoryKey];
  if (!category) return null;
  
  return category[language] || category[DEFAULT_LANGUAGE] || null;
};

/**
 * Get all song categories in specified language
 * @param {string} language - Language code
 * @returns {object} Object with category keys and localized info
 */
export const getAllSongCategoriesInLanguage = (language = DEFAULT_LANGUAGE) => {
  const categories = {};
  
  Object.keys(MULTILINGUAL_SONG_CATEGORIES).forEach(key => {
    const categoryInfo = getSongCategoryInfo(key, language);
    if (categoryInfo) {
      categories[key] = categoryInfo;
    }
  });
  
  return categories;
};

// Mapping functions (these would need to be defined based on your existing category structure)

/**
 * Get story category for a given story ID
 * This should map to your existing STORY_CATEGORIES structure
 */
const getStoryCategoryForId = (storyId) => {
  // Map story IDs to categories - you'll need to update this based on your existing structure
  const storyToCategory = {
    1: 'classic',      // Three Little Pigs
    2: 'adventure',    // Jack and the Beanstalk
    3: 'classic',      // Goldilocks
    4: 'bedtime',      // Sleepy Forest Animals
    5: 'educational',  // Other stories...
  };
  
  return storyToCategory[storyId] || 'modern';
};

/**
 * Get song category for a given song ID
 */
const getSongCategoryForId = (songId) => {
  // Map song IDs to categories
  const songToCategory = {
    1: 'classic',      // Twinkle Twinkle
    2: 'interactive',  // If You're Happy
    3: 'educational',  // Alphabet Song
    // Add more mappings...
  };
  
  return songToCategory[songId] || 'classic';
};

/**
 * Get available languages
 * @returns {Array} Array of language codes
 */
export const getAvailableLanguages = () => {
  return ['en', 'zh', 'fr', 'es', 'uk', 'nl'];
};

/**
 * Check if content exists in specified language
 * @param {string} contentType - 'stories' or 'songs'
 * @param {number|string} contentId - Content ID
 * @param {string} language - Language code
 * @returns {boolean} True if content exists in language
 */
export const hasContentInLanguage = (contentType, contentId, language) => {
  if (contentType === 'stories') {
    return MULTILINGUAL_STORIES[contentId] && MULTILINGUAL_STORIES[contentId][language];
  } else if (contentType === 'songs') {
    return MULTILINGUAL_SONGS[contentId] && MULTILINGUAL_SONGS[contentId][language];
  }
  return false;
};