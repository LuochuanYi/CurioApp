// Curio Component Library - Complete Export
export { CurioButton } from './CurioButton';
export { CurioCard } from './CurioCard';
export { CurioMascot } from './CurioMascot';
export { CurioHeader, CurioLogo } from './CurioHeader';
export { default as SignLanguageAnimation } from './SignLanguageAnimation';

// Development and Debug Components
export { default as AudioTestButton } from './AudioTestButton';
export { default as TranslationPerformanceMonitor } from './TranslationPerformanceMonitor';

// Interactive Learning Game Components
export {
  VocabularyMatchingGame,
  ComprehensionQuiz,
  MemoryMatchingGame,
  PatternGame
} from './InteractiveLearningGames';

export { default as GameActivityManager } from './GameActivityManager';

// Re-export theme for components
export { CURIO_THEME, COMPONENT_STYLES, TEXT_STYLES } from '../theme';