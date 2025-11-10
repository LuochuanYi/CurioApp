import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, Image, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
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
          { id: 1, label: t('routines.storyTime'), time: '12:45 pm', type: 'story' },
          { id: 2, label: t('routines.quietTime'), time: '2:00 pm – 4:00 pm', type: 'quiet' }
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

// Get age groups with translations
const getAgeGroups = (t) => [
  { id: '1-3', label: t('ageGroups.1-3'), description: t('ageGroups.toddlerDescription') },
  { id: '3-5', label: t('ageGroups.3-5'), description: t('ageGroups.preschoolDescription') },
  { id: '5-7', label: t('ageGroups.5-7'), description: t('ageGroups.earlyElementaryDescription') },
  { id: '7-10', label: t('ageGroups.7-10'), description: t('ageGroups.advancedDescription') },
  { id: '10+', label: t('ageGroups.10+'), description: t('ageGroups.matureDescription') }
];

const PersonalizeScreen = ({ navigation }) => {
  // Translation and language hooks
  const { t } = useTranslation();
  const { currentLanguage, setLanguage, getAvailableLanguages } = useLanguage();

  // Mock data - in real app, this would come from API/state management  
  const mockData = {
    userProfile: {
      name: 'Family',
      language: 'English',
    },
    familyData: {
      routines: [
        { id: 1, label: t('routines.storyTime'), time: '12:45 pm', type: 'story' },
        { id: 2, label: t('routines.quietTime'), time: '2:00 pm – 4:00 pm', type: 'quiet' }
      ],
      lastUpdated: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    preferences: {
      contentFilter: true,
      environmentalAlerts: true,
      aqiThreshold: 75,
      notificationsEnabled: true,
      ageGroups: [t('ageGroups.1-3')]
    }
  };
  
  // Use the custom hook for dynamic personalization data
  const { data: personalizationData, loading: personalizationLoading } = usePersonalizationData();
  
  // Local state for immediate UI updates
  const [contentFilter, setContentFilter] = useState(true);
  const [envAlerts, setEnvAlerts] = useState(true);
  const [aqiThreshold, setAqiThreshold] = useState(75);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([t('ageGroups.1-3')]);
  
  // Modal states
  const [showAgeGroupModal, setShowAgeGroupModal] = useState(false);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [tempAqiThreshold, setTempAqiThreshold] = useState(75);

  // Update local state when data loads
  useEffect(() => {
    if (personalizationData) {
      setContentFilter(personalizationData.contentFilter);
      setEnvAlerts(personalizationData.envAlerts);
      setAqiThreshold(personalizationData.aqiThreshold);
      if (personalizationData.ageGroups) {
        // Convert age groups to translated versions
        const translatedAgeGroups = personalizationData.ageGroups.map(group => {
          switch(group) {
            case '1-3 years': return t('ageGroups.1-3');
            case '3-5 years': return t('ageGroups.3-5');
            case '5-7 years': return t('ageGroups.5-7');
            case '7-10 years': return t('ageGroups.7-10');
            case '10+ years': return t('ageGroups.10+');
            default: return group;
          }
        });
        setSelectedAgeGroups(translatedAgeGroups);
      }
    }
  }, [personalizationData, t]);

  const handleNavigation = (screen) => {
    if (navigation && screen !== 'Personalize') {
      navigation.navigate(screen);
    }
  };

  const handleLanguageSelect = async (language) => {
    console.log(`Language changing to: ${language}`);
    const success = await setLanguage(language);
    if (success) {
      console.log('Language changed successfully to:', language);
      // Update age groups to new language
      const currentAgeGroups = selectedAgeGroups.map(group => {
        // Convert back to English keys first, then to new language
        const ageGroupKey = Object.keys(getAgeGroups(t)).find(key => 
          getAgeGroups(t)[key] === group
        );
        return ageGroupKey ? t(`ageGroups.${ageGroupKey}`) : group;
      });
      setSelectedAgeGroups(currentAgeGroups);
    } else {
      console.error('Failed to change language');
    }
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



  const handleAgeGroupPress = () => {
    setShowAgeGroupModal(true);
  };

  const handleAgeGroupToggle = (ageGroup) => {
    setSelectedAgeGroups(prev => {
      if (prev.includes(ageGroup)) {
        // Don't allow removing if it's the last one
        if (prev.length === 1) return prev;
        return prev.filter(group => group !== ageGroup);
      } else {
        return [...prev, ageGroup];
      }
    });
  };

  const handleThresholdPress = () => {
    setTempAqiThreshold(aqiThreshold);
    setShowThresholdModal(true);
  };

  const handleThresholdSave = () => {
    setAqiThreshold(tempAqiThreshold);
    setShowThresholdModal(false);
    console.log(`AQI threshold updated to: ${tempAqiThreshold}`);
  };

  return (
    <ScrollView 
      style={{ 
        flex: 1, 
        backgroundColor: CURIO_THEME.colors.surface 
      }}
      showsVerticalScrollIndicator={true}
      indicatorStyle="default"
      scrollIndicatorInsets={{ right: 1 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Welcome Card - Compact */}
      <View style={{
        paddingHorizontal: CURIO_THEME.spacing.screenPadding,
        paddingTop: CURIO_THEME.spacing.md,
      }}>
        <CurioCard
          title={t('personalize.title')}
          subtitle={personalizationLoading ? t('common.loading') : t('personalize.subtitle', { date: personalizationData?.lastUpdated || 'recently' })}
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
              {t('personalize.familyPreferences')}
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
            {t('personalize.familyRoutines')}
          </Text>
          <View style={{
            backgroundColor: CURIO_THEME.colors.primary,
            paddingHorizontal: CURIO_THEME.spacing.md,
            paddingVertical: CURIO_THEME.spacing.xs,
            borderRadius: CURIO_THEME.radius.badge,
          }}>
            <Text style={[TEXT_STYLES.caption, { color: CURIO_THEME.colors.textInverse }]}>
              {t('personalize.routinesCount', { count: personalizationData?.routines?.length || 2 })}
            </Text>
          </View>
        </View>
        
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
          {(personalizationData?.routines || [
            { id: 1, label: t('routines.storyTime'), time: '12:45 pm', type: 'story' },
            { id: 2, label: t('routines.quietTime'), time: '2:00 pm – 4:00 pm', type: 'quiet' }
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

      {/* Safety & Parental Controls Section */}
      <View style={styles.controlsSection}>
        <View style={styles.sectionHeader}>
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            {t('personalize.safetyControls')}
          </Text>
          <Text style={styles.sectionCount}>5 {t('common.settings')}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.thresholdCard}
            onPress={handleAgeGroupPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.ageGroupsButton', { groups: selectedAgeGroups.join(', ') })}
          >
            <View style={styles.controlInfo}>
              <View style={styles.controlIconContainer}>
                <Text style={styles.controlIcon}>👶</Text>
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={styles.controlLabel}>{t('personalize.ageGroups')}</Text>
                <Text style={styles.controlDescription}>
                  {selectedAgeGroups.length === 1 
                    ? t('personalize.ageGroupsDescription') 
                    : t('personalize.ageGroupsMultipleDescription', { count: selectedAgeGroups.length })}
                </Text>
              </View>
            </View>
            <View style={styles.ageGroupsContainer}>
              {selectedAgeGroups.slice(0, 2).map((ageGroup, index) => (
                <View key={index} style={[styles.ageBadge, { marginLeft: index > 0 ? 4 : 0 }]}>
                  <Text style={styles.ageText}>{ageGroup}</Text>
                </View>
              ))}
              {selectedAgeGroups.length > 2 && (
                <View style={[styles.ageBadge, { backgroundColor: '#7f8c8d', marginLeft: 4 }]}>
                  <Text style={styles.ageText}>+{selectedAgeGroups.length - 2}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlCard}
            onPress={() => handleContentFilterToggle(!contentFilter)}
            accessible={true}
            accessibilityRole="switch"
            accessibilityLabel={t('accessibility.contentFilterSwitch', { status: contentFilter ? t('accessibility.enabled') : t('accessibility.disabled') })}
            accessibilityState={{ checked: contentFilter }}
          >
            <View style={styles.controlInfo}>
              <View style={styles.controlIconContainer}>
                <Text style={styles.controlIcon}>🛡️</Text>
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={styles.controlLabel}>{t('personalize.contentFilter')}</Text>
                <Text style={styles.controlDescription}>
                  {t('personalize.contentFilterDescription')}
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
            accessibilityLabel={t('accessibility.environmentalAlertsSwitch', { status: envAlerts ? t('accessibility.enabled') : t('accessibility.disabled') })}
            accessibilityState={{ checked: envAlerts }}
          >
            <View style={styles.controlInfo}>
              <View style={styles.controlIconContainer}>
                <Text style={styles.controlIcon}>🌱</Text>
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={styles.controlLabel}>{t('personalize.environmentalAlerts')}</Text>
                <Text style={styles.controlDescription}>
                  {t('personalize.environmentalAlertsDescription')}
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
            accessibilityLabel={t('accessibility.aqiThresholdButton', { value: aqiThreshold })}
          >
            <View style={styles.controlInfo}>
              <View style={styles.controlIconContainer}>
                <Text style={styles.controlIcon}>📊</Text>
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={styles.controlLabel}>{t('personalize.aqiThreshold')}</Text>
                <Text style={styles.controlDescription}>
                  {t('personalize.aqiThresholdDescription')}
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

      {/* Language Preferences Section - Two column grid with checkboxes */}
      <View style={styles.languageSection}>
        <Text style={styles.languageSectionTitle}>{t('personalize.languagePreferences')}</Text>
        <View style={styles.languageGrid}>
          {getAvailableLanguages().map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={styles.languageGridItem}
              onPress={() => handleLanguageSelect(lang.name)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.languageSelection', { language: lang.name })}
              accessibilityState={{ selected: currentLanguage === lang.name }}
            >
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  currentLanguage === lang.name && styles.checkboxSelected
                ]}>
                  {currentLanguage === lang.name && (
                    <Text style={styles.checkboxIcon}>✓</Text>
                  )}
                </View>
              </View>
              <Text style={styles.languageText}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { key: 'Home', icon: '🏠', label: t('common.home'), active: false },
          { key: 'Monitor', icon: '📊', label: t('common.monitor'), active: false },
          { key: 'Engage', icon: '💡', label: t('common.engage'), active: false },
          { key: 'Personalize', icon: '👤', label: t('common.personalize'), active: true }
        ].map((navItem) => (
          <TouchableOpacity
            key={navItem.key}
            style={styles.navItem}
            onPress={() => handleNavigation(navItem.key)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.tabNavigation', { label: navItem.label, active: navItem.active ? t('accessibility.currentlySelected') : '' })}
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

      {/* Age Group Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAgeGroupModal}
        onRequestClose={() => setShowAgeGroupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('personalize.selectAgeGroups')}</Text>
              <TouchableOpacity
                onPress={() => setShowAgeGroupModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>{t('common.done')}</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              {t('personalize.selectAgeGroupsSubtitle')}
            </Text>
            
            <View style={styles.ageGroupOptions}>
              {getAgeGroups(t).map((ageGroup) => (
                <TouchableOpacity
                  key={ageGroup.id}
                  style={styles.ageGroupOption}
                  onPress={() => handleAgeGroupToggle(ageGroup.label)}
                >
                  <View style={styles.ageGroupOptionContent}>
                    <View style={[
                      styles.ageGroupCheckbox,
                      selectedAgeGroups.includes(ageGroup.label) && styles.ageGroupCheckboxSelected
                    ]}>
                      {selectedAgeGroups.includes(ageGroup.label) && (
                        <Text style={styles.ageGroupCheckmark}>✓</Text>
                      )}
                    </View>
                    <View style={styles.ageGroupInfo}>
                      <Text style={styles.ageGroupLabel}>{ageGroup.label}</Text>
                      <Text style={styles.ageGroupDescription}>{ageGroup.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* AQI Threshold Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showThresholdModal}
        onRequestClose={() => setShowThresholdModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowThresholdModal(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t('personalize.aqiAlertThreshold')}</Text>
              <TouchableOpacity
                onPress={handleThresholdSave}
                style={styles.modalSaveButton}
              >
                <Text style={styles.modalSaveText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.thresholdContainer}>
              <View style={styles.thresholdDisplay}>
                <Text style={styles.thresholdDisplayValue}>{tempAqiThreshold}</Text>
                <Text style={styles.thresholdDisplayLabel}>AQI</Text>
              </View>
              
              <View style={styles.thresholdSliderContainer}>
                <Text style={styles.thresholdSliderLabel}>Alert when AQI exceeds:</Text>
                <Slider
                  style={styles.thresholdSlider}
                  minimumValue={25}
                  maximumValue={150}
                  value={tempAqiThreshold}
                  onValueChange={setTempAqiThreshold}
                  step={5}
                  minimumTrackTintColor="#f39c12"
                  maximumTrackTintColor="#ecf0f1"
                  thumbStyle={styles.sliderThumb}
                />
                <View style={styles.thresholdLabels}>
                  <Text style={styles.thresholdLabelText}>{t('personalize.aqiGood')}</Text>
                  <Text style={styles.thresholdLabelText}>{t('personalize.aqiUnhealthy')}</Text>
                </View>
              </View>
              
              <Text style={styles.thresholdInfo}>
                {tempAqiThreshold <= 50 ? t('personalize.goodAirQuality') :
                 tempAqiThreshold <= 100 ? t('personalize.moderateAirQuality') :
                 t('personalize.unhealthyAirQuality')}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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

  // Language section - Two column grid with checkboxes
  languageSection: { 
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  languageSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  languageGridItem: {
    width: (screenWidth - 64) / 2, // Explicit width calculation for 2 columns
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#3498db',
    backgroundColor: '#3498db',
  },
  checkboxIcon: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
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
  ageGroupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ageBadge: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  modalCancelButton: {
    padding: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  modalSaveButton: {
    padding: 8,
  },
  modalSaveText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
    marginBottom: 20,
  },

  // Age Group Modal
  ageGroupOptions: {
    gap: 12,
  },
  ageGroupOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  ageGroupOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageGroupCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ageGroupCheckboxSelected: {
    borderColor: '#3498db',
    backgroundColor: '#3498db',
  },
  ageGroupCheckmark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  ageGroupInfo: {
    flex: 1,
  },
  ageGroupLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  ageGroupDescription: {
    fontSize: 13,
    color: '#7f8c8d',
  },

  // Threshold Modal
  thresholdContainer: {
    paddingVertical: 20,
  },
  thresholdDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  thresholdDisplayValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  thresholdDisplayLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  thresholdSliderContainer: {
    marginBottom: 20,
  },
  thresholdSliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  thresholdSlider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#f39c12',
    width: 20,
    height: 20,
  },
  thresholdLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  thresholdLabelText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  thresholdInfo: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
});

export default PersonalizeScreen;
