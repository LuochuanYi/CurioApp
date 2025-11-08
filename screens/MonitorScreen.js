import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
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

  return (
    <ScrollView style={{ 
      flex: 1, 
      backgroundColor: CURIO_THEME.colors.surface 
    }}>
      {/* Status Card with Curio Mascot - Compact */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingTop: CURIO_THEME.spacing.md,
      }}>
        <CurioCard
          title="Safety Monitor"
          subtitle={sensorLoading ? 'Updating...' : `Updated: ${sensorData?.lastUpdated || 'N/A'}`}
          variant="default"
          style={{ 
            backgroundColor: CURIO_THEME.colors.background,
            paddingVertical: CURIO_THEME.spacing.sm,
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <CurioMascot 
              size="small" 
              isAnimating={sensorLoading}
              style={{ marginRight: CURIO_THEME.spacing.sm }}
            />
            <Text style={[TEXT_STYLES.bodySmall, { textAlign: 'center', flex: 1, fontSize: 12 }]}>
              Environment monitoring active
            </Text>
          </View>
        </CurioCard>
      </View>

      {/* Live Sensor Cards - Circular Style */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingVertical: CURIO_THEME.spacing.md,
      }}>
        <Text style={[TEXT_STYLES.cardTitle, { marginBottom: CURIO_THEME.spacing.md }]}>
          Live Sensors
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
        >
          {[
            { 
              key: 'airQuality', 
              icon: '🌬️', 
              title: 'Air Quality', 
              value: sensorData?.airQuality || 'Low',
              status: sensorData?.airQuality === 'Good' ? 'good' : 'warning',
              color: sensorData?.airQuality === 'Good' ? CURIO_THEME.colors.success : CURIO_THEME.colors.warning
            },
            { 
              key: 'sound', 
              icon: '🎤', 
              title: 'Sound Level', 
              value: sensorData?.sound || 'Normal',
              status: sensorData?.sound === 'Loud' ? 'warning' : 'good',
              color: sensorData?.sound === 'Loud' ? CURIO_THEME.colors.warning : CURIO_THEME.colors.success
            },
            { 
              key: 'motion', 
              icon: '🚶', 
              title: 'Motion', 
              value: sensorData?.motion || 'Active',
              status: 'good',
              color: CURIO_THEME.colors.primary
            }
          ].map((sensor) => (
            <TouchableOpacity
              key={sensor.key}
              onPress={() => handleSensorPress(sensor.key)}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginRight: CURIO_THEME.spacing.md,
                backgroundColor: sensor.color,
                justifyContent: 'center',
                alignItems: 'center',
                padding: CURIO_THEME.spacing.xs,
                ...CURIO_THEME.shadows.card,
                position: 'relative',
              }}
              accessible={true}
              accessibilityLabel={`${sensor.title}: ${sensor.value}, tap for details`}
              accessibilityRole="button"
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, marginBottom: 4 }}>
                  {sensor.icon}
                </Text>
                <Text style={[TEXT_STYLES.bodySmall, { 
                  textAlign: 'center', 
                  fontSize: 11, 
                  fontWeight: 'bold',
                  color: CURIO_THEME.colors.textPrimary,
                }]} numberOfLines={2}>
                  {sensor.title}
                </Text>
                <Text style={[TEXT_STYLES.caption, { 
                  textAlign: 'center', 
                  fontSize: 9, 
                  color: CURIO_THEME.colors.textSecondary,
                  marginTop: 2
                }]}>
                  {sensorLoading ? 'Loading...' : sensor.value}
                </Text>
              </View>
              {sensor.status === 'warning' && (
                <View style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 12,
                  height: 12,
                  backgroundColor: CURIO_THEME.colors.error,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: CURIO_THEME.colors.background,
                }} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Alert Timeline - Horizontal Scroll */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingVertical: CURIO_THEME.spacing.md,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: CURIO_THEME.spacing.md,
        }}>
          <Text style={TEXT_STYLES.cardTitle}>
            Recent Alerts
          </Text>
          <View style={{
            backgroundColor: CURIO_THEME.colors.warning,
            paddingHorizontal: CURIO_THEME.spacing.md,
            paddingVertical: CURIO_THEME.spacing.xs,
            borderRadius: CURIO_THEME.radius.badge,
          }}>
            <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse }]}>
              {mockAlerts.length} alerts
            </Text>
          </View>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingRight: CURIO_THEME.spacing.screenPadding }}
        >
          {mockAlerts.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginRight: CURIO_THEME.spacing.md,
                backgroundColor: alert.severity === 'medium' ? CURIO_THEME.colors.warning : CURIO_THEME.colors.background,
                justifyContent: 'center',
                alignItems: 'center',
                padding: CURIO_THEME.spacing.xs,
                ...CURIO_THEME.shadows.card,
                position: 'relative',
              }}
              accessible={true}
              accessibilityLabel={`Alert: ${alert.message} at ${formatTime(alert.timestamp)}`}
              accessibilityRole="button"
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, marginBottom: 4 }}>
                  {alert.icon}
                </Text>
                <Text style={[TEXT_STYLES.bodySmall, { 
                  textAlign: 'center', 
                  fontSize: 10, 
                  fontWeight: 'bold',
                  color: CURIO_THEME.colors.textPrimary,
                  textTransform: 'capitalize'
                }]} numberOfLines={2}>
                  {alert.type.replace('_', ' ')}
                </Text>
                <Text style={[TEXT_STYLES.caption, { 
                  textAlign: 'center', 
                  fontSize: 8, 
                  color: CURIO_THEME.colors.textSecondary,
                  marginTop: 2
                }]} numberOfLines={1}>
                  {alert.timestamp.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 10,
                height: 10,
                backgroundColor: alert.severity === 'medium' ? CURIO_THEME.colors.error : CURIO_THEME.colors.success,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: CURIO_THEME.colors.background,
              }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Emergency Control - Curio Style */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingBottom: CURIO_THEME.spacing.md,
      }}>
        <CurioButton
          title="🚨 Notify Parent"
          variant="primary"
          size="large"
          onPress={handleEmergencyPress}
          style={{
            backgroundColor: CURIO_THEME.colors.error,
            minHeight: 60,
          }}
          accessible={true}
          accessibilityLabel="Emergency button to notify parent immediately"
        />
        <Text style={[TEXT_STYLES.caption, { 
          textAlign: 'center', 
          marginTop: CURIO_THEME.spacing.xs,
          color: CURIO_THEME.colors.textSecondary 
        }]}>
          Tap for immediate alert
        </Text>
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
          { key: 'Home', icon: '🏠', label: 'Home', active: false, color: CURIO_THEME.colors.skyBlue },
          { key: 'Monitor', icon: '📊', label: 'Monitor', active: true, color: CURIO_THEME.colors.deepNavy },
          { key: 'Engage', icon: '💡', label: 'Engage', active: false, color: CURIO_THEME.colors.goldenYellow },
          { key: 'Personalize', icon: '👤', label: 'Personalize', active: false, color: CURIO_THEME.colors.deepNavy }
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
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    paddingHorizontal: Math.max(20, width * 0.05), // Responsive padding
  },

  // Header styles (matching HomeScreen)
  headerCard: {
    backgroundColor: '#a8d0f0',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    marginRight: 80, // Space for robot
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#2c3e50',
    opacity: 0.8,
  },
  robotContainer: {
    position: 'absolute',
    right: Math.max(20, width * 0.05),
    bottom: 20,
  },
  robotHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  robotEyes: {
    flexDirection: 'row',
  },
  robotEye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9500',
    marginHorizontal: 2,
  },
  robotEyeBlinking: {
    backgroundColor: '#ff6b6b', // Different color when loading
  },
  robotBody: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2c3e50',
  },

  // Sensors section
  sensorsSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sensorRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  sensorCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    position: 'relative',
    minHeight: 100,
    // Add shadow for better visual hierarchy
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorCardWarning: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  sensorIcon: { 
    fontSize: 28, 
    marginBottom: 8 
  },
  sensorTitle: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  sensorValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2c3e50',
    textAlign: 'center',
  },
  sensorValueWarning: {
    color: '#ff9500',
  },
  warningDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9500',
  },

  // Timeline section
  timelineSection: { 
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  alertCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertsList: {
    marginTop: 10,
  },
  timelineItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    position: 'relative',
  },
  timelineItemMedium: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  timelineIcon: { 
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  timelineText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#2c3e50',
    marginBottom: 2,
  },
  timelineDate: { 
    fontSize: 12, 
    color: '#6c757d' 
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#66bb6a',
  },
  severityDotMedium: {
    backgroundColor: '#ff9500',
  },

  // Emergency button
  emergencyButton: {
    backgroundColor: '#ff4d4f',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    // Add shadow for emphasis
    shadowColor: '#ff4d4f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#fff',
    marginRight: 8,
  },
  emergencySubtext: {
    fontSize: 12,
    color: '#ffcccb',
    opacity: 0.9,
  },

  // Bottom navigation (matching HomeScreen)
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
    color: '#6c757d',
  },
  navIconActive: {
    color: '#4a90e2',
  },
  navLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#4a90e2',
    fontWeight: '600',
  },
  activeIndicator: {
    width: 30,
    height: 3,
    backgroundColor: '#4a90e2',
    borderRadius: 2,
    marginTop: 5,
  },
});

export default MonitorScreen;
