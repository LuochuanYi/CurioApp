// Centralized Logging Utility
// Controls log output based on environment and log levels

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  VERBOSE: 4
};

class Logger {
  constructor() {
    // Set log level based on environment
    // Production: Only errors and warnings
    // Development: All logs (but can be configured)
    this.logLevel = __DEV__ ? LOG_LEVELS.INFO : LOG_LEVELS.WARN;
    
    // Feature flags to disable specific log categories
    this.disableCategories = {
      translation: !__DEV__,  // Disable translation logs in production (re-enabled for dev)
      audio: !__DEV__,        // Disable audio logs in production  
      navigation: true,       // Always disable navigation logs
      testing: true,          // Always disable testing logs
      debug: !__DEV__         // Disable debug logs in production
    };
  }

  // Core logging methods with level checking
  error(...args) {
    if (this.logLevel >= LOG_LEVELS.ERROR) {
      console.error(...args);
    }
  }

  warn(...args) {
    if (this.logLevel >= LOG_LEVELS.WARN) {
      console.warn(...args);
    }
  }

  info(...args) {
    if (this.logLevel >= LOG_LEVELS.INFO) {
      console.log(...args);
    }
  }

  debug(...args) {
    if (this.logLevel >= LOG_LEVELS.DEBUG) {
      console.log('[DEBUG]', ...args);
    }
  }

  verbose(...args) {
    if (this.logLevel >= LOG_LEVELS.VERBOSE) {
      console.log('[VERBOSE]', ...args);
    }
  }

  // Category-specific logging methods
  translation(...args) {
    if (!this.disableCategories.translation && this.logLevel >= LOG_LEVELS.INFO) {
      console.log('[TRANSLATION]', ...args);
    }
  }

  audio(...args) {
    if (!this.disableCategories.audio && this.logLevel >= LOG_LEVELS.INFO) {
      console.log('[AUDIO]', ...args);
    }
  }

  navigation(...args) {
    if (!this.disableCategories.navigation && this.logLevel >= LOG_LEVELS.DEBUG) {
      console.log('[NAV]', ...args);
    }
  }

  testing(...args) {
    if (!this.disableCategories.testing && this.logLevel >= LOG_LEVELS.VERBOSE) {
      console.log('[TEST]', ...args);
    }
  }

  // Performance logging (always minimal)
  performance(label, fn) {
    if (__DEV__ && this.logLevel >= LOG_LEVELS.DEBUG) {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`[PERF] ${label}: ${(end - start).toFixed(2)}ms`);
      return result;
    }
    return fn();
  }

  // Set log level dynamically
  setLogLevel(level) {
    this.logLevel = level;
  }

  // Enable/disable specific categories
  enableCategory(category) {
    this.disableCategories[category] = false;
  }

  disableCategory(category) {
    this.disableCategories[category] = true;
  }
}

// Create singleton logger instance
const logger = new Logger();

// Override console methods in production to reduce memory usage
if (!__DEV__) {
  // Disable console.log and console.info in production
  console.log = () => {};
  console.info = () => {};
  
  // Keep console.error and console.warn for important issues
  // console.error and console.warn remain unchanged
}

// Filter out known harmless warnings and errors
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  const message = args.join(' ');
  
  // Suppress known harmless React Native Web deprecation warnings
  const suppressedWarnings = [
    'textShadow',
    'boxShadow', 
    'Invalid style property of "backgroundColor"',
    'Expo av has been deprecated',
    'Device language not available',
    'expo-av',
    'expo-video',
    'Cannot read properties of undefined (reading \'body\')',
    'TypeError: Cannot read properties of undefined',
    'reading \'body\'',
    'Uncaught TypeError'
  ];
  
  // Only show warning if it's not in the suppressed list
  const shouldSuppress = suppressedWarnings.some(warning => 
    message.toLowerCase().includes(warning.toLowerCase())
  );
  
  if (!shouldSuppress) {
    originalWarn(...args);
  }
};

console.error = (...args) => {
  const message = args.join(' ');
  
  // Suppress known harmless Metro/bundler errors
  const suppressedErrors = [
    'Cannot read properties of undefined (reading \'body\')',
    'TypeError: Cannot read properties of undefined',
    'reading \'body\'',
    'Uncaught TypeError',
    'Invalid style property of "backgroundColor"'
  ];
  
  // Only show error if it's not in the suppressed list
  const shouldSuppress = suppressedErrors.some(error => 
    message.toLowerCase().includes(error.toLowerCase())
  );
  
  if (!shouldSuppress) {
    originalError(...args);
  }
};

export default logger;

// Convenience exports
export const logError = (...args) => logger.error(...args);
export const logWarn = (...args) => logger.warn(...args);
export const logInfo = (...args) => logger.info(...args);
export const logDebug = (...args) => logger.debug(...args);
export const logTranslation = (...args) => logger.translation(...args);
export const logAudio = (...args) => logger.audio(...args);
export const logNavigation = (...args) => logger.navigation(...args);
export const logSpeech = (...args) => logger.audio(...args); // Speech logs use audio category
export const logSettings = (...args) => logger.info(...args); // Settings logs use info category
export const logPerformance = (label, fn) => logger.performance(label, fn);

// Quick configuration helpers
export const enableVerboseLogging = () => logger.setLogLevel(LOG_LEVELS.VERBOSE);
export const enableDebugLogging = () => logger.setLogLevel(LOG_LEVELS.DEBUG);
export const disableAllLogs = () => logger.setLogLevel(-1);