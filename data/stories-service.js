// 🌍 Multilingual Stories Service
// Service layer for accessing localized story content

import { 
  getAllStoriesInLanguage, 
  getStoriesByCategory, 
  getAllCategoriesInLanguage, 
  searchStories 
} from './content/multilingual-helpers';

/**
 * Get stories in specified language with same structure as STORY_LIBRARY
 * @param {string} language - Language code (en, zh, fr, es, uk, nl)
 * @returns {Array} Array of stories in specified language
 */
export const getStoriesInLanguage = (language = 'en') => {
  const localizedStories = getAllStoriesInLanguage(language);
  
  // Map to maintain compatibility with existing STORY_LIBRARY structure
  return localizedStories.map(story => ({
    id: story.id,
    title: story.title,
    category: story.category,
    rating: 4.5, // Default rating - could be made dynamic
    duration: "5 min", // Default duration - could be calculated from content length
    ageGroup: "3-8 years", // Default age group - could be made dynamic
    language: getLanguageDisplayName(language),
    summary: story.summary,
    content: story.content,
    moral: story.moral,
    tags: story.tags || [],
    illustration: "📖", // Default illustration
    voiceAvailable: false, // Could be made dynamic based on available audio
    difficulty: "Easy", // Default difficulty
    lastRead: null,
    isFavorite: false,
    readCount: 0
  }));
};

/**
 * Get stories by category in specified language
 * @param {string} category - Category ID
 * @param {string} language - Language code
 * @returns {Array} Filtered stories array
 */
export const getStoriesByCategoryInLanguage = (category, language = 'en') => {
  return getStoriesInLanguage(language).filter(story => story.category === category);
};

/**
 * Get localized categories
 * @param {string} language - Language code
 * @returns {Object} Categories object with localized names
 */
export const getCategoriesInLanguage = (language = 'en') => {
  const localizedCategories = getAllCategoriesInLanguage(language);
  const categories = {};
  
  // Map to maintain compatibility with existing STORY_CATEGORIES structure
  Object.keys(localizedCategories).forEach(key => {
    const category = localizedCategories[key];
    categories[key.toUpperCase()] = {
      id: key,
      name: category.name,
      icon: category.icon,
      color: getCategoryColor(key) // Use existing color scheme
    };
  });
  
  return categories;
};

/**
 * Search stories in specified language
 * @param {string} searchTerm - Search term
 * @param {string} language - Language code
 * @returns {Array} Matching stories array
 */
export const searchStoriesInLanguage = (searchTerm, language = 'en') => {
  const results = searchStories(searchTerm, language);
  return getStoriesInLanguage(language).filter(story => 
    results.some(result => result.id === story.id)
  );
};

/**
 * Get story by ID in specified language
 * @param {number} id - Story ID
 * @param {string} language - Language code
 * @returns {Object|null} Story object or null
 */
export const getStoryByIdInLanguage = (id, language = 'en') => {
  const stories = getStoriesInLanguage(language);
  return stories.find(story => story.id === id) || null;
};

// Helper functions
const getLanguageDisplayName = (code) => {
  const languageNames = {
    en: 'English',
    zh: '中文',
    fr: 'Français', 
    es: 'Español',
    uk: 'Українська',
    nl: 'Nederlands'
  };
  return languageNames[code] || 'English';
};

const getCategoryColor = (categoryKey) => {
  const colors = {
    bedtime: '#9b6bcc',
    classic: '#ff6b8a', 
    adventure: '#4ecdc4',
    educational: '#45b7d1',
    modern: '#f9ca24'
  };
  return colors[categoryKey] || '#45b7d1';
};

export { getLanguageDisplayName, getCategoryColor };