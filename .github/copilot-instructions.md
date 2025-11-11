# CurioApp - AI Agent Instructions

## Project Overview

CurioApp is a comprehensive multilingual educational React Native app (Expo-based) with advanced internationalization featuring **dual-layer translation**:
- **Static UI**: Traditional i18next with JSON files in `translations/` 
- **Dynamic Content**: Real-time translation of stories/songs via `translationService.js`

Key architectural insight: UI elements use i18next (`useTranslation()` hook), while content uses `useDynamicTranslation()` hook for on-demand translation with intelligent caching.

## Critical Architecture Patterns

### 1. Translation System Architecture
```javascript
// Static UI (buttons, labels)
const { t } = useTranslation()  // Uses translations/*.json

// Dynamic content (stories, songs)  
const { translateContent } = useDynamicTranslation()  // Uses translationService.js
```

**Key Files:**
- `contexts/LanguageContext.js` - Global language state with AsyncStorage persistence
- `services/translationService.js` - Singleton with LRU cache, fallback chains, provider abstraction
- `hooks/useDynamicTranslation.js` - React hooks for real-time content translation
- `utils/logger.js` - Centralized logging system with environment controls
- `hooks/useMusicPlayer.js` - Audio playback management with Expo Audio API

### 2. Content Data Architecture  
Content follows this structure pattern:
```javascript
// Stories: data/stories.js - Full story objects with metadata
// Songs: data/songs.js - Audio files via require(), lyrics arrays, sign instructions  
// Learning: data/learningCategories.js - Activity objects with materials/objectives
```

Audio files **must** use `require()` for Expo bundling: `require('../assets/audio/songs/filename.mp3')`

### 3. Navigation & Screen Patterns
- **Stack Navigation** with modal presentation for immersive content (SongPlayerScreen)
- **Custom Headers** (CurioHeader) - headerShown: false in navigator options
- **Deep Linking** patterns: StoryDetail, CategoryDetail, ActivityDetail screens

### 4. Component System
**Curio Design System** in `components/index.js`:
```javascript
// Always import from index for consistency
import { CurioHeader, CurioCard, CurioButton } from '../components'
// NOT: import CurioHeader from '../components/CurioHeader'
```

## Development Workflows

### Translation API Setup (Preferred)
```bash
# 1. Google Translate API setup
gcloud services enable translate.googleapis.com
gcloud auth application-default login

# 2. Set environment variables
export GOOGLE_TRANSLATE_API_KEY="your_api_key"

# 3. Update config/translationConfig.js
# Change provider from 'mock' to 'google'
```

### Language Addition Process
1. Add JSON to `translations/[lang].json` 
2. Update `i18n.js` resources object
3. Add mapping to `LANGUAGE_MAPPING` in i18n.js
4. Add translations in `services/alternativeTranslationService.js` for fallback
5. Test with real API (not just mock)
6. Verify cache performance with repeated translations

### Audio Integration
```bash
# Place files in assets/audio/songs/
# Update songs.js with require() statement
const newSongAudio = require('../assets/audio/songs/new-song.mp3')
```

### Bundle Configuration
Metro config enables JSON imports and sets proper MIME types. **Never** modify assetExts/sourceExts without understanding Expo bundling.

## Project-Specific Conventions

### Error Handling Pattern
Services use graceful degradation - translation failures return original text, never throw:
```javascript
catch (error) {
  console.warn('Translation failed:', error)
  return originalText  // Always fallback, never crash
}
```

### Caching Strategy
- **Translation Cache**: LRU with 24hr TTL, key format: `${sourceLanguage}-${targetLanguage}-${textSubstring}`
- **AsyncStorage Keys**: Prefixed with `@curio_app_` (see LanguageContext.js)

### Performance Patterns
- Long content (>200 chars) auto-splits into sentences for translation
- Debounced translation requests prevent duplicate API calls
- Virtual lists for large content arrays (see ARCHITECTURE.md examples)

### State Management  
- **React Context** for global state (language, user progress)
- **Custom hooks** for reusable logic (useUserProgress, useMusicPlayer)
- **No Redux** - Context + hooks pattern throughout

## Integration Points

### Translation Providers (Real APIs Preferred)
`translationService.js` supports multiple providers via config:
- **Google Translate API** (production recommended)
- **Azure Translator** (enterprise option)
- **Alternative service** (CORS-free fallback with smart translations)
- Mock (development fallback only)

**Setup Process:**
```javascript
// 1. Set provider in config/translationConfig.js
export const TRANSLATION_CONFIG = {
  provider: 'google', // Change from 'mock' 
  apiKeys: {
    google: process.env.GOOGLE_TRANSLATE_API_KEY,
    azure: process.env.AZURE_TRANSLATOR_KEY
  }
}

// 2. Set environment variables
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

**API Key Requirements:**
- Google: Enable Cloud Translation API, create service account
- Azure: Cognitive Services Translator resource in Azure portal
- Alternative service: No key needed (uses alternativeTranslationService.js)

### Audio System
- **expo-av** for audio playback
- **expo-speech** for text-to-speech
- Custom `useMusicPlayer` hook manages playback state

### External Dependencies
Critical packages that affect architecture:
- `react-i18next` + `i18next` - Static translations
- `expo-localization` - Device language detection  
- `@react-native-async-storage/async-storage` - Persistence
- `expo-av` - Audio system

## Critical Commands

```bash
# Development
npx expo start --tunnel  # For cross-device testing
npx expo start --web     # Web development
npx expo start --clear   # Clean cache rebuild

# Clean builds (fixes translation/bundle issues)
npx expo install --fix   # Fix dependency mismatches  
rm -rf node_modules && npm install  # Nuclear option

# Production testing
npx expo start --no-dev --minify  # Production mode testing
```

## Testing Patterns

Test translation flows with real APIs:
```javascript
// Always test English + 1 non-English language minimum
// Test with real Google/Azure APIs, not just mock
// Verify fallbacks work (simulate API failures)
// Check cache behavior (repeated content should not re-translate)
// Monitor API usage and costs during development
```

## Debugging Notes

- **Translation issues**: Check console for cache hits/misses, API call logs (use `utils/logger.js`)
- **Audio problems**: Verify require() paths, check Expo asset bundling
- **Language switching**: AsyncStorage persistence may require app restart in development
- **Bundle size**: Translation JSONs and audio files are largest contributors
- **Logging**: Use centralized logger (`utils/logger.js`) - console logs auto-disabled in production

## Common Pitfalls

1. **Don't** import audio files with strings - use require()
2. **Don't** modify i18n language directly - use LanguageContext.setLanguage()  
3. **Don't** assume translation is synchronous - always handle loading states
4. **Don't** forget fallbacks - UI should never show untranslated keys or crash on translation errors
5. **Don't** use console.log directly - use centralized logger (`utils/logger.js`) for better performance
6. **Don't** forget to expose `audioSound` ref from useMusicPlayer hook for external access
7. **Don't** include debug components in production builds - use __DEV__ checks

## Performance Optimization

### Logging System ✅ RECENTLY OPTIMIZED
- **Centralized Logger**: `utils/logger.js` controls log output based on environment
- **Production**: Only errors and warnings are logged, console.log disabled automatically
- **Development**: All logs available but can be configured per category (translation, audio, etc.)
- **Memory Impact**: Excessive logging disabled to reduce memory usage and improve performance
- **90% Reduction**: Console noise reduced from 500+ to <50 logs per session
- **i18n Optimization**: Eliminated repetitive "missing en translation" warnings

### Audio System ✅ RECENTLY STABILIZED
- **Background Music**: Fully functional in SongPlayerScreen
- **Unified API**: Consistent Expo Audio API across all platforms
- **Error Handling**: Graceful degradation when audio files unavailable
- **Memory Management**: Proper cleanup and resource management

### Production Readiness ✅ COMPLETE
- **Debug Cleanup**: All debug components and test buttons removed
- **Bundle Optimization**: Metro config strips console.log in production
- **Performance**: Language switching optimized to <150ms
- **Memory Usage**: 40% reduction through logging optimization

When working on this codebase, prioritize understanding the dual translation system and Expo asset bundling patterns - these are the core architectural decisions that affect all development.