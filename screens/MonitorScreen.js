import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CurioHeader, CurioCard, CurioButton, CurioMascot, CURIO_THEME, TEXT_STYLES } from '../components';

// Custom hook for sensor data (simulated)
const useSensorData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setData({
        airQuality: Math.random() > 0.6 ? 'Good' : 'Low',
        sound: Math.random() > 0.7 ? 'Loud' : 'Normal', 
        motion: Math.random() > 0.5 ? 'Active' : 'Still',
        lastUpdated: new Date().toLocaleTimeString()
      });
      setLoading(false);
    };

    fetchData();
    // Update every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
};

// Mock alerts data
const mockAlerts = [
  {
    id: 1,
    type: 'air_quality',
    icon: '⚠️',
    message: 'Air quality dropped',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    severity: 'medium'
  },
  {
    id: 2,
    type: 'sound',
    icon: '🔊',
    message: 'Loud noise detected',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    severity: 'low'
  },
  {
    id: 3,
    type: 'motion',
    icon: '🏃',
    message: 'High activity detected',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    severity: 'low'
  }
];

const { width } = Dimensions.get('window');

const MonitorScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { data: sensorData, loading: sensorLoading } = useSensorData();

  const handleNavigation = (screen) => {
    if (navigation && screen !== 'Monitor') {
      navigation.navigate(screen);
    }
  };

  const handleEmergencyPress = () => {
    console.log('Emergency notification sent to parent');
    // In real app: trigger actual notification
  };

  const handleSensorPress = (sensorType) => {
    console.log(`Open ${sensorType} details`);
    // In real app: navigation?.navigate('SensorDetail', { sensor: sensorType })
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Helper function to get translated sensor data
  const getSensorData = () => [
    { 
      key: 'airQuality', 
      icon: '🌬️', 
      title: t('monitor.sensors.airQuality.title'), 
      value: sensorData?.airQuality === 'Good' ? t('monitor.sensors.airQuality.good') : t('monitor.sensors.airQuality.low'),
      status: sensorData?.airQuality === 'Good' ? 'good' : 'warning',
      color: sensorData?.airQuality === 'Good' ? CURIO_THEME.colors.success : CURIO_THEME.colors.warning,
      description: sensorData?.airQuality === 'Good' ? t('monitor.sensors.airQuality.goodDescription') : t('monitor.sensors.airQuality.lowDescription'),
      trend: 'stable'
    },
    { 
      key: 'sound', 
      icon: '🔊', 
      title: t('monitor.sensors.sound.title'), 
      value: sensorData?.sound === 'Loud' ? t('monitor.sensors.sound.loud') : t('monitor.sensors.sound.normal'),
      status: sensorData?.sound === 'Loud' ? 'warning' : 'good',
      color: sensorData?.sound === 'Loud' ? CURIO_THEME.colors.warning : CURIO_THEME.colors.success,
      description: sensorData?.sound === 'Loud' ? t('monitor.sensors.sound.loudDescription') : t('monitor.sensors.sound.normalDescription'),
      trend: 'stable'
    },
    { 
      key: 'motion', 
      icon: '🚶', 
      title: t('monitor.sensors.motion.title'), 
      value: sensorData?.motion === 'Active' ? t('monitor.sensors.motion.active') : t('monitor.sensors.motion.still'),
      status: 'good',
      color: CURIO_THEME.colors.primary,
      description: sensorData?.motion === 'Active' ? t('monitor.sensors.motion.activeDescription') : t('monitor.sensors.motion.stillDescription'),
      trend: 'stable'
    }
  ];

  return (
    <ScrollView style={{ 
      flex: 1, 
      backgroundColor: CURIO_THEME.colors.surface 
    }}>
      {/* Monitor Header with Branding */}
      <View style={styles.brandingHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('monitor.header.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('monitor.header.subtitle')}
          </Text>
        </View>
        <View style={styles.statusIndicator}>
          <CurioMascot 
            size="small" 
            isAnimating={sensorLoading}
          />
          <Text style={styles.statusText}>
            {sensorLoading ? t('monitor.status.updating') : t('monitor.status.active')}
          </Text>
        </View>
      </View>

      {/* Welcome hint for new users */}
      {mockAlerts.length === 0 && (
        <View style={styles.welcomeHint}>
          <Text style={styles.welcomeIcon}>🛡️</Text>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Your Safety Guardian</Text>
            <Text style={styles.welcomeText}>
              We're actively monitoring your environment. Green means everything is perfect, yellow indicates minor changes to be aware of.
            </Text>
          </View>
        </View>
      )}

      {/* Live Sensor Cards - Enhanced with descriptions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📡</Text>
          <Text style={styles.sectionTitle}>{t('monitor.sections.liveSensors.title')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t('monitor.sections.liveSensors.description')}
        </Text>
        
        <View style={styles.sensorsGrid}>
          {getSensorData().map((sensor) => (
            <TouchableOpacity
              key={sensor.key}
              onPress={() => handleSensorPress(sensor.key)}
              style={[styles.sensorCard, { borderLeftColor: sensor.color }]}
              accessible={true}
              accessibilityLabel={`${sensor.title}: ${sensor.value}, ${sensor.description}, tap for details`}
              accessibilityRole="button"
            >
              <View style={styles.sensorHeader}>
                <View style={[styles.sensorIconContainer, { backgroundColor: sensor.color }]}>
                  <Text style={styles.sensorIcon}>{sensor.icon}</Text>
                </View>
                <View style={styles.sensorInfo}>
                  <Text style={styles.sensorTitle}>{sensor.title}</Text>
                  <Text style={[styles.sensorValue, { 
                    color: sensor.status === 'warning' ? CURIO_THEME.colors.warning : CURIO_THEME.colors.textPrimary 
                  }]}>
                    {sensorLoading ? 'Loading...' : sensor.value}
                  </Text>
                </View>
                {sensor.status === 'warning' && (
                  <View style={styles.warningBadge}>
                    <Text style={styles.warningText}>!</Text>
                  </View>
                )}
              </View>
              <Text style={styles.sensorDescription}>
                {sensor.description}
              </Text>
              <View style={styles.sensorFooter}>
                <View style={[styles.trendIndicator, {
                  backgroundColor: sensor.trend === 'stable' ? CURIO_THEME.colors.success : CURIO_THEME.colors.warning
                }]}>
                  <Text style={styles.trendText}>
                    {sensor.trend === 'stable' ? t('monitor.sensors.stable') : t('monitor.sensors.changing')}
                  </Text>
                </View>
                <Text style={styles.tapHint}>{t('monitor.sensors.tapForDetails')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Alert Timeline - Enhanced with better messaging */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🚨</Text>
          <Text style={styles.sectionTitle}>{t('monitor.alerts.title')}</Text>
          {mockAlerts.length > 0 && (
            <View style={styles.alertsBadge}>
              <Text style={styles.alertsBadgeText}>{mockAlerts.length}</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionDescription}>
          {mockAlerts.length > 0 ? 
            t('monitor.alerts.description') :
            t('monitor.alerts.allClear')
          }
        </Text>
        
        {mockAlerts.length > 0 ? (
          <View style={styles.alertsList}>
            {mockAlerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={[styles.alertItem, {
                  borderLeftColor: alert.severity === 'medium' ? CURIO_THEME.colors.warning : CURIO_THEME.colors.success
                }]}
                accessible={true}
                accessibilityLabel={`Alert: ${alert.message} at ${formatTime(alert.timestamp)}`}
                accessibilityRole="button"
              >
                <View style={[styles.alertIconContainer, {
                  backgroundColor: alert.severity === 'medium' ? CURIO_THEME.colors.warning : CURIO_THEME.colors.success
                }]}>
                  <Text style={styles.alertIcon}>{alert.icon}</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{formatTime(alert.timestamp)}</Text>
                  <Text style={styles.alertDescription}>
                    {alert.type === 'air_quality' ? t('monitor.alerts.airQualityAdvice') :
                     alert.type === 'sound' ? t('monitor.alerts.soundAdvice') :
                     t('monitor.alerts.activityAdvice')}
                  </Text>
                </View>
                <View style={[styles.severityIndicator, {
                  backgroundColor: alert.severity === 'medium' ? CURIO_THEME.colors.warning : CURIO_THEME.colors.success
                }]} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>✅</Text>
            <Text style={styles.emptyStateTitle}>All Clear!</Text>
            <Text style={styles.emptyStateText}>
              Your environment has been stable and safe. Keep up the great work maintaining optimal conditions!
            </Text>
          </View>
        )}
      </View>

      {/* Safety Progress Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🏆</Text>
          <Text style={styles.sectionTitle}>{t('monitor.progress.title')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t('monitor.progress.description')}
        </Text>
        
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>7</Text>
              <Text style={styles.streakLabel}>{t('monitor.progress.daysSafe')}</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>{t('monitor.progress.weeklyGoal')}</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '100%' }]} />
              </View>
              <Text style={styles.goalText}>{t('monitor.progress.goalComplete')}</Text>
            </View>
          </View>
          
          <View style={styles.achievementsList}>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🌟</Text>
              <Text style={styles.achievementText}>{t('monitor.progress.achievements.airQuality')}</Text>
            </View>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🔇</Text>
              <Text style={styles.achievementText}>{t('monitor.progress.achievements.quietMaster')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Emergency Control - Enhanced */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🚨</Text>
          <Text style={styles.sectionTitle}>{t('monitor.emergency.title')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t('monitor.emergency.description')}
        </Text>
        
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyPress}
          accessible={true}
          accessibilityLabel="Emergency button to notify parent immediately"
          accessibilityRole="button"
        >
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <View style={styles.emergencyTextContainer}>
              <Text style={styles.emergencyTitle}>Notify Parent</Text>
              <Text style={styles.emergencySubtitle}>Instant alert with your location</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={{
        backgroundColor: CURIO_THEME.colors.background,
        flexDirection: 'row',
        paddingVertical: CURIO_THEME.spacing.md,
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        borderTopWidth: 1,
        borderTopColor: CURIO_THEME.colors.lightGray,
        ...CURIO_THEME.shadows.nav,
      }}>
        {[
          { key: 'Home', icon: '🏠', label: t('common.home'), active: false, color: CURIO_THEME.colors.skyBlue },
          { key: 'Monitor', icon: '📊', label: t('common.monitor'), active: true, color: CURIO_THEME.colors.deepNavy },
          { key: 'Engage', icon: '💡', label: t('common.engage'), active: false, color: CURIO_THEME.colors.goldenYellow },
          { key: 'Personalize', icon: '👤', label: t('common.personalize'), active: false, color: CURIO_THEME.colors.deepNavy }
        ].map((navItem) => (
          <TouchableOpacity
            key={navItem.key}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: CURIO_THEME.spacing.xs,
            }}
            onPress={() => handleNavigation(navItem.key)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${navItem.label} tab${navItem.active ? ', currently selected' : ''}`}
            accessibilityState={{ selected: navItem.active }}
          >
            <Text style={{ 
              fontSize: 24, 
              marginBottom: CURIO_THEME.spacing.xs,
              opacity: navItem.active ? 1 : 0.6,
            }}>
              {navItem.icon}
            </Text>
            <Text style={[
              TEXT_STYLES.caption,
              { 
                color: navItem.active ? navItem.color : CURIO_THEME.colors.textSecondary,
                fontWeight: navItem.active ? '600' : '400',
              }
            ]}>
              {navItem.label}
            </Text>
            {navItem.active && (
              <View style={{
                width: 30,
                height: 3,
                backgroundColor: navItem.color,
                borderRadius: 2,
                marginTop: 5,
              }} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Branding Header (consistent with other screens)
  brandingHeader: {
    marginTop: 20,
    marginHorizontal: CURIO_THEME.spacing.screenPadding,
    backgroundColor: CURIO_THEME.colors.surface,
    borderRadius: CURIO_THEME.radius.lg,
    padding: CURIO_THEME.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  statusIndicator: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: CURIO_THEME.colors.success,
    marginTop: 4,
  },

  // Welcome hint (consistent with HomeScreen)
  welcomeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CURIO_THEME.colors.surface,
    marginHorizontal: CURIO_THEME.spacing.screenPadding,
    marginTop: CURIO_THEME.spacing.md,
    padding: CURIO_THEME.spacing.md,
    borderRadius: CURIO_THEME.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: CURIO_THEME.colors.success,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  welcomeIcon: {
    fontSize: 28,
    marginRight: CURIO_THEME.spacing.md,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 18,
  },

  // Section styles (consistent with other screens)
  section: {
    paddingHorizontal: CURIO_THEME.spacing.screenPadding,
    marginTop: CURIO_THEME.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CURIO_THEME.spacing.md,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: CURIO_THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CURIO_THEME.colors.textPrimary,
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: CURIO_THEME.spacing.md,
    lineHeight: 20,
  },

  // Enhanced Sensors Section
  sensorsGrid: {
    gap: CURIO_THEME.spacing.md,
  },
  sensorCard: {
    backgroundColor: CURIO_THEME.colors.surface,
    borderRadius: CURIO_THEME.radius.md,
    padding: CURIO_THEME.spacing.md,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CURIO_THEME.spacing.sm,
  },
  sensorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CURIO_THEME.spacing.md,
  },
  sensorIcon: {
    fontSize: 24,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 2,
  },
  sensorValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  sensorDescription: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: CURIO_THEME.spacing.sm,
    lineHeight: 16,
  },
  sensorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  tapHint: {
    fontSize: 10,
    color: CURIO_THEME.colors.textSecondary,
  },
  warningBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: CURIO_THEME.colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // Enhanced Alerts Section
  alertsBadge: {
    backgroundColor: CURIO_THEME.colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  alertsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  alertsList: {
    gap: CURIO_THEME.spacing.sm,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CURIO_THEME.colors.surface,
    padding: CURIO_THEME.spacing.md,
    borderRadius: CURIO_THEME.radius.md,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CURIO_THEME.spacing.md,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 11,
    color: CURIO_THEME.colors.textSecondary,
    lineHeight: 14,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Empty state (consistent with other screens)
  emptyState: {
    alignItems: 'center',
    paddingVertical: CURIO_THEME.spacing.xl,
    paddingHorizontal: CURIO_THEME.spacing.md,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: CURIO_THEME.spacing.md,
    opacity: 0.8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: CURIO_THEME.spacing.xs,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  // Safety Progress Section
  progressCard: {
    backgroundColor: CURIO_THEME.colors.surface,
    borderRadius: CURIO_THEME.radius.md,
    padding: CURIO_THEME.spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CURIO_THEME.spacing.lg,
  },
  streakInfo: {
    alignItems: 'center',
    marginRight: CURIO_THEME.spacing.lg,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: CURIO_THEME.colors.success,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: CURIO_THEME.colors.textSecondary,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: CURIO_THEME.colors.textPrimary,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: CURIO_THEME.colors.lightGray,
    borderRadius: 3,
    marginBottom: CURIO_THEME.spacing.xs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: CURIO_THEME.colors.success,
    borderRadius: 3,
  },
  goalText: {
    fontSize: 12,
    color: CURIO_THEME.colors.success,
    fontWeight: '600',
  },
  achievementsList: {
    gap: CURIO_THEME.spacing.sm,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 16,
    marginRight: CURIO_THEME.spacing.sm,
  },
  achievementText: {
    fontSize: 12,
    color: CURIO_THEME.colors.textSecondary,
    fontWeight: '500',
  },

  // Enhanced Emergency Button
  emergencyButton: {
    backgroundColor: CURIO_THEME.colors.error,
    borderRadius: CURIO_THEME.radius.md,
    padding: CURIO_THEME.spacing.lg,
    elevation: 4,
    shadowColor: CURIO_THEME.colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyIcon: {
    fontSize: 32,
    marginRight: CURIO_THEME.spacing.md,
  },
  emergencyTextContainer: {
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  emergencySubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    paddingHorizontal: Math.max(20, width * 0.05), // Responsive padding
  },

});

export default MonitorScreen;
