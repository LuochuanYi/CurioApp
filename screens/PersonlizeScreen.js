import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, Image } from 'react-native';
import { CurioHeader, CurioCard, CurioButton, CurioMascot, CURIO_THEME, TEXT_STYLES } from '../components';

const { width: screenWidth } = Dimensions.get('window');

// Custom hook for user preferences data (simulated)
const usePersonalizationData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user preferences
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setData({
        language: 'English',
        contentFilter: true,
        envAlerts: true,
        aqiThreshold: 75,
        routines: [
          { id: 1, label: 'Story time', time: '12:45 pm', type: 'story' },
          { id: 2, label: 'Quiet time', time: '2:00 pm – 4:00 pm', type: 'quiet' }
        ],
        lastUpdated: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
};

// Mock data - in real app, this would come from API/state management
const mockData = {
  languages: [
    { id: 'en', name: 'English', label: 'English' },
    { id: 'es', name: 'Spanish', label: 'Español' },
    { id: 'zh', name: 'Chinese', label: '中文' },
    { id: 'uk', name: 'Ukrainian', label: 'Українська' },
    { id: 'fr', name: 'French', label: 'Français' }
  ],
  preferences: {
    contentFilter: true,
    environmentalAlerts: true,
    aqiThreshold: 75,
    notificationsEnabled: true
  }
};

const PersonalizeScreen = ({ navigation }) => {
  // Use the custom hook for dynamic personalization data
  const { data: personalizationData, loading: personalizationLoading } = usePersonalizationData();
  
  // Local state for immediate UI updates
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [contentFilter, setContentFilter] = useState(true);
  const [envAlerts, setEnvAlerts] = useState(true);
  const [aqiThreshold, setAqiThreshold] = useState(75);

  // Update local state when data loads
  useEffect(() => {
    if (personalizationData) {
      setSelectedLanguage(personalizationData.language);
      setContentFilter(personalizationData.contentFilter);
      setEnvAlerts(personalizationData.envAlerts);
      setAqiThreshold(personalizationData.aqiThreshold);
    }
  }, [personalizationData]);

  const handleNavigation = (screen) => {
    if (navigation && screen !== 'Personalize') {
      navigation.navigate(screen);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
    // In real app: API call to save preference
  };

  const handleRoutineEdit = (routine) => {
    console.log(`Edit routine: ${routine.label}`);
    // In real app: navigation?.navigate('RoutineEditor', { routine })
  };

  const handleContentFilterToggle = (value) => {
    setContentFilter(value);
    console.log(`Content filter: ${value ? 'enabled' : 'disabled'}`);
    // In real app: API call to save preference
  };

  const handleEnvironmentalAlertsToggle = (value) => {
    setEnvAlerts(value);
    console.log(`Environmental alerts: ${value ? 'enabled' : 'disabled'}`);
    // In real app: API call to save preference
  };

  const handleThresholdPress = () => {
    console.log('Open AQI threshold settings');
    // In real app: navigation?.navigate('ThresholdSettings', { currentValue: aqiThreshold })
  };

  return (
    <ScrollView style={{ 
      flex: 1, 
      backgroundColor: CURIO_THEME.colors.surface 
    }}>
      {/* Welcome Card - Compact */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingTop: CURIO_THEME.spacing.md,
      }}>
        <CurioCard
          title="Your Family Space"
          subtitle={personalizationLoading ? 'Loading...' : `Updated ${personalizationData?.lastUpdated || 'recently'}`}
          variant="default"
          style={{ 
            backgroundColor: CURIO_THEME.colors.background,
            paddingVertical: CURIO_THEME.spacing.sm,
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, marginRight: CURIO_THEME.spacing.sm }}>
              👨‍👩‍👧‍👦
            </Text>
            <Text style={[TEXT_STYLES.bodySmall, { textAlign: 'center', flex: 1, fontSize: 12 }]}>
              Family preferences & settings
            </Text>
          </View>
        </CurioCard>
      </View>

      {/* Family Routines Section - Curio Style */}
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
            Family Routines
          </Text>
          <View style={{
            backgroundColor: CURIO_THEME.colors.primary,
            paddingHorizontal: CURIO_THEME.spacing.md,
            paddingVertical: CURIO_THEME.spacing.xs,
            borderRadius: CURIO_THEME.radius.badge,
          }}>
            <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse }]}>
              {personalizationData?.routines?.length || 2} routines
            </Text>
          </View>
        </View>
        
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
          {(personalizationData?.routines || [
            { id: 1, label: 'Story time', time: '12:45 pm', type: 'story' },
            { id: 2, label: 'Quiet time', time: '2:00 pm – 4:00 pm', type: 'quiet' }
          ]).map((routine) => (
            <TouchableOpacity
              key={routine.id}
              onPress={() => handleRoutineEdit(routine)}
              style={{
                width: '48%',
                backgroundColor: routine.type === 'story' ? CURIO_THEME.colors.softMint : CURIO_THEME.colors.goldenYellow,
                borderRadius: 12,
                padding: 12,
                alignItems: 'center',
                marginBottom: CURIO_THEME.spacing.sm,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                borderWidth: 1,
                borderColor: '#f1f2f6',
                position: 'relative',
                minHeight: 100,
              }}
              accessible={true}
              accessibilityLabel={`${routine.label} routine at ${routine.time}, tap to edit`}
              accessibilityRole="button"
            >
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <Text style={{ fontSize: 16 }}>
                  {routine.type === 'story' ? '📚' : '🤫'}
                </Text>
              </View>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: CURIO_THEME.colors.textPrimary,
                textAlign: 'center',
                marginBottom: 3,
              }}>
                {routine.label}
              </Text>
              <Text style={{
                fontSize: 10,
                color: CURIO_THEME.colors.textSecondary,
                textAlign: 'center',
              }}>
                {routine.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Language Preferences Section */}
      <View style={styles.languageSection}>
        <View style={styles.sectionHeader}>
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Language Preferences
          </Text>
          <Text style={styles.sectionCount}>
            {mockData.languages.length} languages
          </Text>
        </View>
        <View style={styles.languageGrid}>
          {mockData.languages.map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={[
                styles.languageCard,
                selectedLanguage === lang.name && styles.languageCardActive
              ]}
              onPress={() => handleLanguageSelect(lang.name)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Select ${lang.name} language`}
              accessibilityState={{ selected: selectedLanguage === lang.name }}
            >
              <View style={styles.languageIconContainer}>
                <Text style={styles.languageIcon}>🌍</Text>
              </View>
              <Text style={[
                styles.languageText,
                selectedLanguage === lang.name && styles.languageTextActive
              ]}>
                {lang.label}
              </Text>
              {selectedLanguage === lang.name && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.selectedLanguage}>
          Current: {selectedLanguage}
        </Text>
      </View>

      {/* Safety & Parental Controls Section */}
      <View style={styles.controlsSection}>
        <View style={styles.sectionHeader}>
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Safety & Controls
          </Text>
          <Text style={styles.sectionCount}>4 settings</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlCard}
            onPress={() => handleContentFilterToggle(!contentFilter)}
            accessible={true}
            accessibilityRole="switch"
            accessibilityLabel={`Content filter ${contentFilter ? 'enabled' : 'disabled'}`}
            accessibilityState={{ checked: contentFilter }}
          >
            <View style={styles.controlInfo}>
              <View style={styles.controlIconContainer}>
                <Text style={styles.controlIcon}>🛡️</Text>
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={styles.controlLabel}>Content Filter</Text>
                <Text style={styles.controlDescription}>
                  Age-appropriate content only
                </Text>
              </View>
            </View>
            <Switch 
              value={contentFilter} 
              onValueChange={handleContentFilterToggle}
              trackColor={{ false: '#e9ecef', true: '#3498db' }}
              thumbColor={contentFilter ? '#fff' : '#f4f3f4'}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlCard}
            onPress={() => handleEnvironmentalAlertsToggle(!envAlerts)}
            accessible={true}
            accessibilityRole="switch"
            accessibilityLabel={`Environmental alerts ${envAlerts ? 'enabled' : 'disabled'}`}
            accessibilityState={{ checked: envAlerts }}
          >
            <View style={styles.controlInfo}>
              <View style={styles.controlIconContainer}>
                <Text style={styles.controlIcon}>🌱</Text>
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={styles.controlLabel}>Environment Alerts</Text>
                <Text style={styles.controlDescription}>
                  Air quality & safety notifications
                </Text>
              </View>
            </View>
            <Switch 
              value={envAlerts} 
              onValueChange={handleEnvironmentalAlertsToggle}
              trackColor={{ false: '#e9ecef', true: '#27ae60' }}
              thumbColor={envAlerts ? '#fff' : '#f4f3f4'}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.thresholdCard}
            onPress={handleThresholdPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Air quality threshold set to ${aqiThreshold} AQI, tap to adjust`}
          >
            <View style={styles.controlInfo}>
              <View style={styles.controlIconContainer}>
                <Text style={styles.controlIcon}>📊</Text>
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={styles.controlLabel}>AQI Alert Threshold</Text>
                <Text style={styles.controlDescription}>
                  Get notified when air quality exceeds this level
                </Text>
              </View>
            </View>
            <View style={styles.thresholdBadge}>
              <Text style={styles.thresholdValue}>{aqiThreshold}</Text>
              <Text style={styles.thresholdUnit}>AQI</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { key: 'Home', icon: '🏠', label: 'Home', active: false },
          { key: 'Monitor', icon: '📊', label: 'Monitor', active: false },
          { key: 'Engage', icon: '💡', label: 'Engage', active: false },
          { key: 'Personalize', icon: '👤', label: 'Personalize', active: true }
        ].map((navItem) => (
          <TouchableOpacity
            key={navItem.key}
            style={styles.navItem}
            onPress={() => handleNavigation(navItem.key)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${navItem.label} tab${navItem.active ? ', currently selected' : ''}`}
            accessibilityState={{ selected: navItem.active }}
          >
            <Text 
              style={navItem.active ? styles.navIconActive : styles.navIcon}
              accessible={false}
            >
              {navItem.icon}
            </Text>
            <Text 
              style={[styles.navLabel, navItem.active && styles.activeLabel]}
            >
              {navItem.label}
            </Text>
            {navItem.active && <View style={styles.activeIndicator} />}
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
    paddingHorizontal: 20 
  },

  // Header section
  headerCard: {
    backgroundColor: '#e8d5ff',
    borderRadius: 20,
    padding: 24,
    marginVertical: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#2c3e50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#34495e',
    opacity: 0.8,
  },
  mascotContainer: {
    position: 'relative',
  },
  personalizationMascot: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: '#9b59b6', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mascotIcon: { 
    fontSize: 26, 
    color: '#fff' 
  },
  sparkle: {
    position: 'absolute',
    fontSize: 12,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#2c3e50' 
  },
  sectionCount: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  // Routines section
  routinesSection: { 
    marginBottom: 32 
  },
  routinesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  routineCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  routineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  routineIcon: { 
    fontSize: 22 
  },
  routineLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  routineTime: { 
    fontSize: 13, 
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
  },
  editBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editText: { 
    fontSize: 11, 
    color: '#fff',
    fontWeight: '600',
  },

  // Language section
  languageSection: { 
    marginBottom: 32 
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  languageCard: {
    width: (screenWidth - 80) / 3,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: '#f1f2f6',
    position: 'relative',
    minHeight: 70,
  },
  languageCardActive: {
    borderColor: '#3498db',
    backgroundColor: '#f8f9fa',
  },
  languageIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  languageIcon: { 
    fontSize: 12 
  },
  languageText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
  },
  languageTextActive: {
    color: '#3498db',
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedLanguage: {
    marginTop: 12,
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  // Controls section
  controlsSection: { 
    marginBottom: 32 
  },
  controlsContainer: {
    gap: 12,
  },
  controlCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  thresholdCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  controlInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  controlIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  controlIcon: { 
    fontSize: 20 
  },
  controlTextContainer: {
    flex: 1,
  },
  controlLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#2c3e50',
    marginBottom: 2,
  },
  controlDescription: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  thresholdBadge: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  thresholdValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  thresholdUnit: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
  },

  // Bottom navigation
  bottomNav: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    backgroundColor: '#fff', 
    paddingVertical: 15, 
    borderTopWidth: 1,
    borderTopColor: '#e9ecef', 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0
  },
  navItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  navIcon: { 
    fontSize: 20, 
    marginBottom: 5, 
    color: '#6c757d' 
  },
  navIconActive: { 
    fontSize: 20, 
    marginBottom: 5, 
    color: '#9b59b6' 
  },
  navLabel: { 
    fontSize: 12, 
    color: '#6c757d', 
    fontWeight: '500' 
  },
  activeLabel: { 
    color: '#9b59b6' 
  },
  activeIndicator: {
    width: 30, 
    height: 3, 
    backgroundColor: '#9b59b6',
    borderRadius: 2, 
    marginTop: 5
  },
});

export default PersonalizeScreen;
