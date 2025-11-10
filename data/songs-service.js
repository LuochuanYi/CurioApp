// 🎵 Multilingual Songs Service
// Service layer for accessing localized song content

import { 
  getAllSongsInLanguage, 
  getAllSongCategoriesInLanguage, 
  getSongContent 
} from './content/multilingual-helpers';

/**
 * Get songs in specified language with same structure as SONGS_LIBRARY
 * @param {string} language - Language code (en, zh, fr, es, uk, nl)
 * @returns {Array} Array of songs in specified language
 */
export const getSongsInLanguage = (language = 'en') => {
  const localizedSongs = getAllSongsInLanguage(language);
  
  // Map to maintain compatibility with existing SONGS_LIBRARY structure
  return localizedSongs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    category: song.category,
    duration: getDurationFromLyrics(song.lyrics), // Calculate duration
    difficulty: "Easy", // Default difficulty
    language: getLanguageDisplayName(language),
    lyrics: song.lyrics,
    description: song.description,
    audioFile: getAudioFileName(song.id), // Map to audio file
    icon: "🎵",
    isInteractive: song.category === 'interactive',
    hasActions: song.category === 'movement' || song.category === 'interactive',
    tags: extractTagsFromContent(song),
    rating: 4.5,
    playCount: 0,
    isFavorite: false,
    lastPlayed: null
  }));
};

/**
 * Get songs by category in specified language
 * @param {string} category - Category ID
 * @param {string} language - Language code
 * @returns {Array} Filtered songs array
 */
export const getSongsByCategoryInLanguage = (category, language = 'en') => {
  return getSongsInLanguage(language).filter(song => song.category === category);
};

/**
 * Get localized song categories
 * @param {string} language - Language code
 * @returns {Object} Categories object with localized names
 */
export const getSongCategoriesInLanguage = (language = 'en') => {
  const localizedCategories = getAllSongCategoriesInLanguage(language);
  const categories = {};
  
  // Map to maintain compatibility with existing structure
  Object.keys(localizedCategories).forEach(key => {
    const category = localizedCategories[key];
    categories[key.toUpperCase()] = {
      id: key,
      name: category.name,
      icon: category.icon,
      color: getSongCategoryColor(key)
    };
  });
  
  return categories;
};

/**
 * Get song by ID in specified language
 * @param {number} id - Song ID
 * @param {string} language - Language code
 * @returns {Object|null} Song object or null
 */
export const getSongByIdInLanguage = (id, language = 'en') => {
  const songs = getSongsInLanguage(language);
  return songs.find(song => song.id === id) || null;
};

/**
 * Search songs in specified language
 * @param {string} searchTerm - Search term
 * @param {string} language - Language code
 * @returns {Array} Matching songs array
 */
export const searchSongsInLanguage = (searchTerm, language = 'en') => {
  if (!searchTerm.trim()) return [];
  
  const allSongs = getSongsInLanguage(language);
  const searchLower = searchTerm.toLowerCase();
  
  return allSongs.filter(song => 
    song.title.toLowerCase().includes(searchLower) ||
    song.artist.toLowerCase().includes(searchLower) ||
    song.lyrics.toLowerCase().includes(searchLower) ||
    song.description.toLowerCase().includes(searchLower) ||
    song.tags?.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

/**
 * Get recommended songs based on age and preferences
 * @param {number} userAge - User age
 * @param {Array} preferredCategories - Preferred category IDs
 * @param {string} language - Language code
 * @returns {Array} Recommended songs
 */
export const getSongRecommendationsInLanguage = (userAge, preferredCategories = [], language = 'en') => {
  let songs = getSongsInLanguage(language);
  
  // Filter by preferred categories if provided
  if (preferredCategories.length > 0) {
    songs = songs.filter(song => 
      preferredCategories.includes(song.category)
    );
  }
  
  // Simple age-based filtering (could be enhanced)
  if (userAge <= 3) {
    songs = songs.filter(song => 
      song.category === 'lullaby' || song.category === 'classic'
    );
  } else if (userAge <= 6) {
    songs = songs.filter(song => 
      song.category !== 'educational' || song.difficulty === 'Easy'
    );
  }
  
  // Sort by rating and return top 5
  return songs
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
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

const getSongCategoryColor = (categoryKey) => {
  const colors = {
    lullaby: '#9b6bcc',
    interactive: '#ff6b8a',
    educational: '#45b7d1',
    movement: '#4ecdc4',
    classic: '#f9ca24'
  };
  return colors[categoryKey] || '#45b7d1';
};

const getDurationFromLyrics = (lyrics) => {
  // Simple estimation: ~2 seconds per line
  const lines = lyrics.split('\n').filter(line => line.trim());
  const estimatedSeconds = lines.length * 2;
  const minutes = Math.ceil(estimatedSeconds / 60);
  return `${minutes} min`;
};

const getAudioFileName = (songId) => {
  // Map song IDs to audio file names - you would update this based on your audio assets
  const audioMap = {
    1: require('../assets/audio/songs/twinkle-star.mp3'),
    2: require('../assets/audio/songs/happy-clap.mp3'),
    3: require('../assets/audio/songs/alphabet.mp3')
    // Add more mappings as needed
  };
  
  return audioMap[songId] || null;
};

const extractTagsFromContent = (song) => {
  // Extract meaningful tags from song content
  const tags = [];
  
  if (song.category === 'interactive') tags.push('interactive', 'participation');
  if (song.category === 'movement') tags.push('movement', 'exercise');
  if (song.category === 'lullaby') tags.push('calming', 'bedtime');
  if (song.category === 'educational') tags.push('learning', 'alphabet');
  if (song.lyrics.toLowerCase().includes('clap')) tags.push('clapping');
  if (song.lyrics.toLowerCase().includes('dance')) tags.push('dancing');
  
  return tags;
};

export { 
  getLanguageDisplayName, 
  getSongCategoryColor, 
  getDurationFromLyrics, 
  extractTagsFromContent 
};