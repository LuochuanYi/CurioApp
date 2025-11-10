import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translation files
import en from './translations/en.json';
import zh from './translations/zh.json';
import fr from './translations/fr.json';
import es from './translations/es.json';
import uk from './translations/uk.json';
import nl from './translations/nl.json';

// Language resources
const resources = {
  en: { translation: en },
  zh: { translation: zh },
  fr: { translation: fr },
  es: { translation: es },
  uk: { translation: uk },
  nl: { translation: nl },
};

// Language mapping for PersonalizeScreen compatibility
export const LANGUAGE_MAPPING = {
  'English': 'en',
  'Chinese': 'zh', 
  'French': 'fr',
  'Spanish': 'es',
  'Ukrainian': 'uk',
  'Flemish': 'nl'
};

// Reverse mapping for display
export const DISPLAY_LANGUAGE_MAPPING = {
  'en': 'English',
  'zh': 'Chinese',
  'fr': 'French', 
  'es': 'Spanish',
  'uk': 'Ukrainian',
  'nl': 'Flemish'
};

// Get device language or fallback
const getDeviceLanguage = () => {
  try {
    const deviceLanguage = Localization.locale;
    
    // Check if deviceLanguage exists and is a string
    if (!deviceLanguage || typeof deviceLanguage !== 'string') {
      console.log('Device language not available, using fallback');
      return 'en';
    }
    
    // Extract language code (e.g., 'en-US' -> 'en')
    const langCode = deviceLanguage.split('-')[0];
    
    // Check if we support this language
    if (resources[langCode]) {
      console.log('Using device language:', langCode);
      return langCode;
    }
    
    console.log('Device language not supported, using fallback');
    return 'en';
  } catch (error) {
    console.warn('Error detecting device language:', error);
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    debug: __DEV__, // Enable debug mode in development
    resources,
    lng: getDeviceLanguage(), // Default language
    fallbackLng: 'en', // Fallback language
    
    // Options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React-i18next options
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
    
    // Namespace and key separator
    defaultNS: 'translation',
    keySeparator: '.',
    nsSeparator: ':',
  })
  .catch((error) => {
    console.error('i18n initialization error:', error);
  });

export default i18n;

// Helper function to change language
export const changeLanguage = (languageCode) => {
  try {
    console.log('Changing language to:', languageCode);
    if (!languageCode || typeof languageCode !== 'string') {
      console.warn('Invalid language code provided:', languageCode);
      return Promise.resolve();
    }
    return i18n.changeLanguage(languageCode);
  } catch (error) {
    console.error('Error changing language:', error);
    return Promise.resolve();
  }
};

// Helper function to get current language
export const getCurrentLanguage = () => {
  try {
    return i18n.language || 'en';
  } catch (error) {
    console.error('Error getting current language:', error);
    return 'en';
  }
};

// Helper function to get current display language
export const getCurrentDisplayLanguage = () => {
  try {
    const currentLang = getCurrentLanguage();
    return DISPLAY_LANGUAGE_MAPPING[currentLang] || 'English';
  } catch (error) {
    console.error('Error getting display language:', error);
    return 'English';
  }
};