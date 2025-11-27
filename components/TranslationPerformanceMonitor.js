import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { performanceTranslationService } from '../services/performanceTranslationService';
import { enhancedTranslationCache } from '../services/enhancedTranslationCache';
import { logInfo } from '../utils/logger';

/**
 * Translation Performance Monitor
 * Shows cache statistics and translation performance metrics
 * Only visible in development mode
 */
export const TranslationPerformanceMonitor = ({ visible = false }) => {
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Refresh stats every 5 seconds when visible
  useEffect(() => {
    if (!visible || !__DEV__) return;

    const refreshStats = () => {
      try {
        const serviceStats = performanceTranslationService.getStats();
        const cacheStats = enhancedTranslationCache.getStats();
        
        setStats({
          cache: cacheStats,
          service: serviceStats,
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error('Error refreshing translation stats:', error);
      }
    };

    // Initial refresh
    refreshStats();

    // Auto-refresh every 5 seconds
    const interval = setInterval(refreshStats, 5000);

    return () => clearInterval(interval);
  }, [visible, refreshCount]);

  // Manual refresh
  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  // Clear cache
  const handleClearCache = async () => {
    try {
      await enhancedTranslationCache.clearCache();
      await performanceTranslationService.reset();
      handleRefresh();
      logInfo('Translation cache cleared via monitor');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Don't render in production or when not visible
  if (!__DEV__ || !visible || !stats) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.headerText}>
          🚀 Translation Performance {isExpanded ? '▼' : '▶'}
        </Text>
        <Text style={styles.timestamp}>{stats.timestamp}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.content}>
          {/* Cache Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Cache Statistics</Text>
            <View style={styles.statGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Hit Rate</Text>
                <Text style={styles.statValue}>{stats.cache.hitRate}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Memory Cache</Text>
                <Text style={styles.statValue}>{stats.cache.memoryCacheSize}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Cache Hits</Text>
                <Text style={styles.statValue}>{stats.cache.hits}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Cache Misses</Text>
                <Text style={styles.statValue}>{stats.cache.misses}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Popular Items</Text>
                <Text style={styles.statValue}>{stats.cache.popularItems}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Preload Queue</Text>
                <Text style={styles.statValue}>{stats.cache.preloadQueueSize}</Text>
              </View>
            </View>
          </View>

          {/* Service Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Service Statistics</Text>
            <View style={styles.statGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Background Queue</Text>
                <Text style={styles.statValue}>{stats.service.backgroundQueue}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Processing</Text>
                <Text style={styles.statValue}>
                  {stats.service.isProcessing ? '🟢 Yes' : '🔴 No'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Popular Content</Text>
                <Text style={styles.statValue}>{stats.service.popularContentSize}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={handleRefresh}>
              <Text style={styles.buttonText}>🔄 Refresh</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.dangerButton]} 
              onPress={handleClearCache}
            >
              <Text style={styles.buttonText}>🗑️ Clear Cache</Text>
            </TouchableOpacity>
          </View>

          {/* Performance Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Performance Tips</Text>
            <Text style={styles.tipText}>
              • Hit rate above 70% is excellent{'\n'}
              • Memory cache reduces API calls{'\n'}
              • Popular items get pre-loaded for Chinese users{'\n'}
              • Background queue processes low-priority translations
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#ffffff90',
    fontSize: 12,
  },
  content: {
    maxHeight: 400,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 6,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statLabel: {
    fontSize: 11,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  button: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  tipText: {
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 18,
  },
});

export default TranslationPerformanceMonitor;