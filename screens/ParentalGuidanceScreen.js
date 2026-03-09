import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CurioHeader, CurioCard, CurioButton, CURIO_THEME, TEXT_STYLES } from '../components';
import { PARENTAL_GUIDANCE, COMMON_CONCERNS, getAllGuidanceSections } from '../data/parentalGuidance';

const { width } = Dimensions.get('window');

const ParentalGuidanceScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedGuidance, setSelectedGuidance] = useState(null);
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [expandedTip, setExpandedTip] = useState(null);

  const guidanceSections = getAllGuidanceSections();

  const renderGuidanceSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={[TEXT_STYLES.heading2, styles.sectionTitle]}>
        {t('parentalGuidance.selectAgeRange', 'Select Baby\'s Age Range')}
      </Text>
      <Text style={[TEXT_STYLES.small, styles.selectorDescription]}>
        Tap to view developmental milestones and parenting tips for each stage
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        scrollEventThrottle={16}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.scrollViewContent}
      >
        {guidanceSections.map((section, idx) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.ageCard,
              { backgroundColor: section.backgroundColor },
              selectedGuidance?.id === section.id && styles.ageCardSelected,
              idx === guidanceSections.length - 1 && styles.lastAgeCard
            ]}
            onPress={() => setSelectedGuidance(section)}
          >
            <Text style={styles.ageCardIcon}>{section.icon}</Text>
            <Text style={styles.ageCardText}>{section.ageRange}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMilestone = (milestone, index) => {
    const isExpanded = expandedMilestone === `${selectedGuidance.id}-${index}`;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.milestoneCard, isExpanded && styles.milestoneCardExpanded]}
        onPress={() => setExpandedMilestone(isExpanded ? null : `${selectedGuidance.id}-${index}`)}
      >
        <View style={styles.milestoneHeader}>
          <Text style={[TEXT_STYLES.heading3, styles.milestoneTitle]}>
            {milestone.title}
          </Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </View>
        {isExpanded && (
          <View style={styles.milestoneContent}>
            {milestone.items.map((item, idx) => (
              <View key={idx} style={styles.milestoneItem}>
                <Text style={styles.bulletPoint}>✓</Text>
                <Text style={[TEXT_STYLES.body, styles.milestoneItemText]}>{item}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderParentTip = (tipSection, sectionIndex) => {
    const isExpanded = expandedTip === `${selectedGuidance.id}-${sectionIndex}`;

    return (
      <View key={sectionIndex} style={styles.tipSection}>
        <TouchableOpacity
          style={[styles.tipHeader, isExpanded && styles.tipHeaderExpanded]}
          onPress={() => setExpandedTip(isExpanded ? null : `${selectedGuidance.id}-${sectionIndex}`)}
        >
          <Text style={[TEXT_STYLES.heading3, styles.tipCategory]}>
            💡 {tipSection.category}
          </Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.tipContent}>
            {tipSection.tips.map((tip, tipIdx) => (
              <View key={tipIdx} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={[TEXT_STYLES.body, styles.tipText]}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderCommonConcerns = () => (
    <View style={styles.concernsContainer}>
      <Text style={[TEXT_STYLES.heading2, styles.sectionTitle]}>
        {t('parentalGuidance.commonConcerns', 'Common Concerns')}
      </Text>
      <Text style={[TEXT_STYLES.small, styles.concernsDescription]}>
        Universal parenting challenges & solutions for all ages 0-12 months
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        scrollEventThrottle={16}
        style={styles.concernsScroll}
        contentContainerStyle={styles.scrollViewContent}
      >
        {Object.values(COMMON_CONCERNS).map((concern, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.concernCard}
            onPress={() => setSelectedGuidance(null)}
          >
            <Text style={styles.concernIcon}>{concern.icon}</Text>
            <Text style={[TEXT_STYLES.heading3, styles.concernTitle]}>{concern.title}</Text>
            <View style={styles.concernSolutions}>
              {concern.solutions.slice(0, 2).map((solution, sIdx) => (
                <Text key={sIdx} style={[TEXT_STYLES.small, styles.concernSolution]}>
                  • {solution}
                </Text>
              ))}
              <Text style={[TEXT_STYLES.small, styles.moreInfo]}>+{concern.solutions.length - 2} more</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderGuidanceDetail = () => {
    if (!selectedGuidance) {
      return renderCommonConcerns();
    }

    return (
      <View style={styles.detailContainer}>
        <View
          style={[
            styles.guidanceHeader,
            { backgroundColor: selectedGuidance.backgroundColor }
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedGuidance(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.guidanceIcon}>{selectedGuidance.icon}</Text>
          <Text style={[TEXT_STYLES.heading2, styles.guidanceTitle]}>
            {selectedGuidance.title}
          </Text>
          <Text style={[TEXT_STYLES.body, styles.guidanceDescription]}>
            {selectedGuidance.description}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[TEXT_STYLES.heading3, styles.subsectionTitle]}>
            📊 Development Milestones
          </Text>
          {selectedGuidance.milestones.map((milestone, idx) =>
            renderMilestone(milestone, idx)
          )}

          <Text style={[TEXT_STYLES.heading3, styles.subsectionTitle, { marginTop: 24 }]}>
            👨‍👩‍👧 Parent Tips & Strategies
          </Text>
          {selectedGuidance.parentTips.map((tipSection, idx) =>
            renderParentTip(tipSection, idx)
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CurioHeader title={t('parentalGuidance.title', 'Parental Guidance')} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!selectedGuidance && renderGuidanceSelector()}
        {renderGuidanceDetail()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CURIO_THEME.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  selectorContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    color: CURIO_THEME.colors.primary,
    textAlign: 'center',
  },
  selectorDescription: {
    marginBottom: 12,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
  },
  concernsDescription: {
    marginBottom: 12,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scrollViewContent: {
    paddingHorizontal: 8,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  ageCard: {
    width: width * 0.28,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 140,
  },
  lastAgeCard: {
    marginRight: 8,
  },
  ageCardSelected: {
    borderColor: CURIO_THEME.colors.primary,
    elevation: 4,
    shadowColor: CURIO_THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  ageCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  ageCardText: {
    ...TEXT_STYLES.heading3,
    textAlign: 'center',
  },
  detailContainer: {
    marginTop: 0,
  },
  guidanceHeader: {
    padding: 20,
    borderRadius: 0,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingBottom: 8,
  },
  backButtonText: {
    ...TEXT_STYLES.heading3,
    color: CURIO_THEME.colors.primary,
  },
  guidanceIcon: {
    fontSize: 48,
    marginVertical: 12,
  },
  guidanceTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: CURIO_THEME.colors.text,
  },
  guidanceDescription: {
    textAlign: 'center',
    color: CURIO_THEME.colors.textSecondary,
    marginTop: 8,
  },
  contentContainer: {
    padding: 16,
  },
  subsectionTitle: {
    marginBottom: 12,
    color: CURIO_THEME.colors.primary,
  },
  milestoneCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: CURIO_THEME.colors.primary,
  },
  milestoneCardExpanded: {
    backgroundColor: '#E8F4F8',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneTitle: {
    flex: 1,
    color: CURIO_THEME.colors.text,
  },
  expandIcon: {
    fontSize: 14,
    color: CURIO_THEME.colors.primary,
    marginLeft: 8,
  },
  milestoneContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    color: CURIO_THEME.colors.primary,
    fontSize: 16,
    marginRight: 12,
    fontWeight: 'bold',
  },
  milestoneItemText: {
    flex: 1,
    color: CURIO_THEME.colors.text,
  },
  tipSection: {
    marginBottom: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  tipHeaderExpanded: {
    backgroundColor: '#FFF3CC',
  },
  tipCategory: {
    flex: 1,
    color: CURIO_THEME.colors.text,
  },
  tipContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: CURIO_THEME.colors.primary,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    color: CURIO_THEME.colors.text,
  },
  concernsContainer: {
    padding: 16,
  },
  concernsScroll: {
    marginTop: 12,
  },
  concernCard: {
    width: width * 0.42,
    marginRight: 12,
    padding: 16,
    backgroundColor: CURIO_THEME.colors.accent,
    borderRadius: 12,
    alignItems: 'center',
  },
  concernIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  concernTitle: {
    textAlign: 'center',
    marginBottom: 12,
    color: CURIO_THEME.colors.text,
  },
  concernSolutions: {
    width: '100%',
  },
  concernSolution: {
    color: CURIO_THEME.colors.textSecondary,
    marginBottom: 4,
  },
  moreInfo: {
    color: CURIO_THEME.colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default ParentalGuidanceScreen;
