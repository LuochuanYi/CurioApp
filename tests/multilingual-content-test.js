// 🧪 Multilingual Content Test
// Quick test to verify the multilingual story and song system

import { getStoriesInLanguage, getCategoriesInLanguage } from '../data/stories-service';
import { getSongsInLanguage, getSongCategoriesInLanguage } from '../data/songs-service';

// Test function to verify multilingual content
export const testMultilingualContent = () => {
  console.log('🧪 Testing Multilingual Content System...');
  
  const languages = ['en', 'zh', 'fr', 'es', 'uk', 'nl'];
  
  languages.forEach(lang => {
    console.log(`\n📚 Testing ${lang.toUpperCase()} content:`);
    
    // Test stories
    const stories = getStoriesInLanguage(lang);
    const categories = getCategoriesInLanguage(lang);
    
    console.log(`Stories available: ${stories.length}`);
    console.log(`Categories available: ${Object.keys(categories).length}`);
    
    if (stories.length > 0) {
      console.log(`Sample story: "${stories[0].title}"`);
      console.log(`Category: ${categories[stories[0].category?.toUpperCase()]?.name || 'Unknown'}`);
    }
    
    // Test songs
    const songs = getSongsInLanguage(lang);
    const songCategories = getSongCategoriesInLanguage(lang);
    
    console.log(`Songs available: ${songs.length}`);
    console.log(`Song categories available: ${Object.keys(songCategories).length}`);
    
    if (songs.length > 0) {
      console.log(`Sample song: "${songs[0].title}" by ${songs[0].artist}`);
    }
  });
  
  console.log('\n✅ Multilingual content test completed!');
  
  return {
    storiesPerLanguage: languages.map(lang => ({
      language: lang,
      count: getStoriesInLanguage(lang).length
    })),
    songsPerLanguage: languages.map(lang => ({
      language: lang,
      count: getSongsInLanguage(lang).length
    }))
  };
};