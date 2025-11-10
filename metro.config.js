const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions and MIME types
config.resolver.assetExts.push('json');
config.resolver.sourceExts.push('js', 'jsx', 'ts', 'tsx', 'json');

// Configure Metro to handle MIME types correctly
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Set correct MIME type for JavaScript files
      if (req.url && req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      if (req.url && req.url.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;