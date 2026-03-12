/**
 * Utility functions to filter story content based on language selection
 * Handles Chinese bedtime stories with mixed Chinese/Pinyin/English format
 */

// Helper to clean up titles that contain both Chinese and English segments
const filterMixedTitle = (text = '', language = 'en') => {
  if (!text) return '';
  if (language === 'en') {
    return text
      .replace(/[\u4E00-\u9FFF]/g, '')        // remove Chinese characters
      .replace(/\([^)]*\)/g, '')              // remove pinyin in parentheses
      .replace(/\s*[-–—]\s*/g, '')            // drop hyphen separators
      .trim();
  }
  if (language === 'zh') {
    return text.split(' - ')[0].trim();
  }
  return text;
};

/**
 * Extracts English-only content from mixed bilingual story format
 * Removes Chinese text and Pinyin lines, keeps only English
 * 
 * @param {string} mixedContent - The raw story content with mixed languages
 * @returns {string} - English-only content
 */
const extractEnglishContent = (mixedContent) => {
  if (!mixedContent) return '';
  
  const lines = mixedContent.split('\n');
  const englishLines = [];
  let skipNext = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines for now, will add back spacing later
    if (!line) {
      englishLines.push('');
      continue;
    }

    // Skip lines that are purely Chinese (contain Chinese characters)
    const chineseRegex = /[\u4E00-\u9FFF]/g;
    if (chineseRegex.test(line)) {
      // Check if this line contains both Chinese and Pinyin (in parentheses)
      // Pattern: Chinese text with (Pinyin text) - these are the bilingual source lines
      if (line.match(/[\u4E00-\u9FFF].*\(.*\)/)) {
        // Skip entire bilingual line (Chinese with Pinyin translation)
        skipNext = false;
        continue;
      }
      // Skip pure Chinese text
      skipNext = false;
      continue;
    }

    // Skip Pinyin-only lines (text in parentheses that looks like pinyin)
    // Pattern: (Pinyin text with diacritics)
    if (line.match(/^\([^)]*[āáǎàēéěèīíǐìōóǒòūúǔù][^)]*\)$/)) {
      continue;
    }

    // Skip dialogue markers that are in Chinese format
    if (line.match(/^[""]/)) {
      continue;
    }

    // Keep English text
    if (line.match(/[A-Za-z]/)) {
      // Clean up quotation marks that might have Chinese styling
      const cleanedLine = line
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'");
      englishLines.push(cleanedLine);
    }
  }

  // Clean up and rejoin, removing excessive blank lines
  return englishLines
    .join('\n')
    .replace(/\n\n\n+/g, '\n\n') // Replace multiple blank lines with single blank line
    .trim();
};

/**
 * Extracts Chinese-only content from mixed bilingual story format
 * Removes English text, keeps Chinese with optional Pinyin
 * 
 * @param {string} mixedContent - The raw story content with mixed languages
 * @param {boolean} includePinyin - Whether to include Pinyin in output (default: true)
 * @returns {string} - Chinese-only content
 */
const extractChineseContent = (mixedContent, includePinyin = true) => {
  if (!mixedContent) return '';

  const lines = mixedContent.split('\n');
  const chineseLines = [];
  let lastWasBlank = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle blank lines - avoid excessive spacing
    if (!line) {
      if (!lastWasBlank) {
        chineseLines.push('');
        lastWasBlank = true;
      }
      continue;
    }

    lastWasBlank = false;
    const chineseRegex = /[\u4E00-\u9FFF]/g;

    // Check if line contains Chinese characters
    if (chineseRegex.test(line)) {
      // This is a Chinese line (with or without Pinyin)
      if (includePinyin) {
        // Keep line as-is (includes pinyin in parentheses)
        chineseLines.push(line);
      } else {
        // Remove Pinyin from the line
        // Pattern: (Pinyin text) - remove everything in parentheses
        const cleanedLine = line
          .replace(/\s*\([^)]*\)\s*/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleanedLine.match(/[\u4E00-\u9FFF]/)) {
          chineseLines.push(cleanedLine);
        }
      }
      continue;
    }

    // If the line contains only pinyin (diacritics) and we are including pinyin,
    // this should also be kept so pronunciation guidance remains available.
    if (includePinyin && line.match(/[āáǎàēéěèīíǐìōóǒòūúǔù]/) && !chineseRegex.test(line)) {
      chineseLines.push(line);
      continue;
    }

    // Skip English-only lines and quoted English text
    if (line.match(/^[""]/)) {
      continue;
    }

    // Skip English explanatory text (but keep dialogue within stories)
    // English lines that start with capital letters and have multiple words
    if (
      line.match(/^[A-Z][a-z]+.*[a-z]$/) &&
      !line.match(/[\u4E00-\u9FFF]/)
    ) {
      continue;
    }
  }

  // Clean up and rejoin
  return chineseLines
    .join('\n')
    .replace(/\n\n\n+/g, '\n\n') // Replace multiple blank lines with single blank line
    .trim();
};

/**
 * Gets story content appropriate for the current language setting
 * 
 * @param {string} content - The raw mixed-language story content
 * @param {string} language - The current language setting ('en' or 'zh')
 * @param {boolean} includePinyin - Whether to include Pinyin for Chinese (default: true)
 * @returns {string} - Language-appropriate story content
 */
const getLocalizedStoryContent = (content, language = 'en', includePinyin = true) => {
  if (!content) return '';

  // If content contains Chinese/mixed languages and language is set to English
  if (language === 'en' || language === 'english') {
    return extractEnglishContent(content);
  }

  // If language is set to Chinese
  if (language === 'zh' || language === 'chinese') {
    return extractChineseContent(content, includePinyin);
  }

  // Default: return original content
  return content;
};

/**
 * Check if content appears to be mixed bilingual format
 * 
 * @param {string} content - The story content to check
 * @returns {boolean} - True if content contains mixed languages
 */
// Helper to clean up titles that contain both languages
const filterMixedTitle = (text = '', language = 'en') => {
  if (!text) return '';
  if (language === 'en') {
    return text
      .replace(/[\u4E00-\u9FFF]/g, '')        // remove Chinese chars
      .replace(/\([^)]*\)/g, '')              // remove pinyin parentheses
      .replace(/\s*[-–—]\s*/g, '')            // remove separator hyphen
      .trim();
  }
  if (language === 'zh') {
    return text.split(' - ')[0].trim();
  }
  return text;
};

const isMixedBilingualContent = (content) => {
  if (!content) return false;

  const chineseRegex = /[\u4E00-\u9FFF]/;
  const englishRegex = /[A-Za-z]{5,}/; // At least 5 consecutive English characters
  const pinyinRegex = /[āáǎàēéěèīíǐìōóǒòūúǔù]/; // Pinyin diacritics

  return (
    chineseRegex.test(content) &&
    englishRegex.test(content) &&
    pinyinRegex.test(content)
  );
};

// Export functions for use in React Native/Expo
module.exports = {
  extractEnglishContent,
  extractChineseContent,
  getLocalizedStoryContent,
  isMixedBilingualContent,
  filterMixedTitle,
};
