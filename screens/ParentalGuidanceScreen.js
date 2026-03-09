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
      <View style={styles.verticalAgeCardsContainer}>
        {guidanceSections.map((section, idx) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.ageCard,
              { backgroundColor: section.backgroundColor },
              selectedGuidance?.id === section.id && styles.ageCardSelected,
            ]}
            onPress={() => setSelectedGuidance(section)}
          >
            <Text style={styles.ageCardIcon}>{section.icon}</Text>
            <View style={styles.ageCardTextContainer}>
              <Text style={styles.ageCardText}>{section.ageRange}</Text>
              <Text style={styles.ageCardSubtext}>{section.title}</Text>
            </View>
            <Text style={styles.ageCardArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
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

  const [expandedConcern, setExpandedConcern] = React.useState(null);

  const renderCommonConcerns = () => (
    <View style={styles.concernsContainer}>
      <Text style={[TEXT_STYLES.heading2, styles.sectionTitle]}>
        {t('parentalGuidance.commonConcerns', 'Common Concerns')}
      </Text>
      <Text style={[TEXT_STYLES.small, styles.concernsDescription]}>
        Universal parenting challenges & solutions for all ages 0-12 months
      </Text>
      <View style={styles.verticalConcernsContainer}>
        {Object.values(COMMON_CONCERNS).map((concern, idx) => {
          const isExpanded = expandedConcern === idx;
          const visibleSolutions = isExpanded ? concern.solutions : concern.solutions.slice(0, 3);
          return (
            <View
              key={idx}
              style={styles.concernCard}
            >
              <View style={styles.concernHeader}>
                <Text style={styles.concernIcon}>{concern.icon}</Text>
                <View style={styles.concernHeaderText}>
                  <Text style={[TEXT_STYLES.heading3, styles.concernTitle]}>{concern.title}</Text>
                </View>
              </View>
              <View style={styles.concernSolutions}>
                {visibleSolutions.map((solution, sIdx) => (
                  <View key={sIdx} style={styles.solutionItem}>
                    <Text style={styles.solutionBullet}>•</Text>
                    <Text style={[TEXT_STYLES.body, styles.concernSolution]}>
                      {solution}
                    </Text>
                  </View>
                ))}
                {!isExpanded && concern.solutions.length > 3 && (
                  <TouchableOpacity
                    style={styles.moreInfoButton}
                    onPress={() => setExpandedConcern(idx)}
                  >
                    <Text style={[TEXT_STYLES.small, styles.moreInfoText]}>
                      +{concern.solutions.length - 3} more solutions
                    </Text>
                  </TouchableOpacity>
                )}
                {isExpanded && concern.solutions.length > 3 && (
                  <TouchableOpacity
                    style={styles.moreInfoButton}
                    onPress={() => setExpandedConcern(null)}
                  >
                    <Text style={[TEXT_STYLES.small, styles.moreInfoText]}>
                      Show less
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
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
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerBackIcon}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('parentalGuidance.title', 'Parental Guidance')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: CURIO_THEME.colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerBackButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 60,
  },
  headerBackIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  selectorContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    color: CURIO_THEME.colors.primary,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  selectorDescription: {
    marginBottom: 20,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
  concernsDescription: {
    marginBottom: 20,
    color: CURIO_THEME.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 14,
  },
  // Vertical Age Cards Layout
  verticalAgeCardsContainer: {
    gap: 12,
  },
  ageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ageCardSelected: {
    borderColor: CURIO_THEME.colors.primary,
    elevation: 6,
    shadowColor: CURIO_THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  ageCardIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  ageCardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ageCardText: {
    ...TEXT_STYLES.heading3,
    color: CURIO_THEME.colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  ageCardSubtext: {
    ...TEXT_STYLES.small,
    color: CURIO_THEME.colors.textSecondary,
  },
  ageCardArrow: {
    fontSize: 20,
    color: CURIO_THEME.colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailContainer: {
    marginTop: 0,
  },
  guidanceHeader: {
    padding: 24,
    borderRadius: 0,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingBottom: 12,
    paddingHorizontal: 0,
  },
  backButtonText: {
    ...TEXT_STYLES.heading3,
    color: CURIO_THEME.colors.primary,
    fontWeight: '600',
  },
  guidanceIcon: {
    fontSize: 56,
    marginVertical: 16,
  },
  guidanceTitle: {
    textAlign: 'center',
    marginBottom: 12,
    color: CURIO_THEME.colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
  guidanceDescription: {
    textAlign: 'center',
    color: CURIO_THEME.colors.textSecondary,
    marginTop: 12,
    lineHeight: 20,
  },
  contentContainer: {
    padding: 20,
  },
  subsectionTitle: {
    marginBottom: 16,
    color: CURIO_THEME.colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  milestoneCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: CURIO_THEME.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 14,
    color: CURIO_THEME.colors.primary,
    marginLeft: 12,
    fontWeight: '600',
  },
  milestoneContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    color: CURIO_THEME.colors.primary,
    fontSize: 16,
    marginRight: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  milestoneItemText: {
    flex: 1,
    color: CURIO_THEME.colors.text,
    lineHeight: 20,
  },
  tipSection: {
    marginBottom: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  tipHeaderExpanded: {
    backgroundColor: '#FFF3CC',
  },
  tipCategory: {
    flex: 1,
    color: CURIO_THEME.colors.text,
    fontWeight: '500',
  },
  tipContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: CURIO_THEME.colors.primary,
    marginRight: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  tipText: {
    flex: 1,
    color: CURIO_THEME.colors.text,
    lineHeight: 20,
  },
  concernsContainer: {
    padding: 20,
  },
  // Vertical Concerns Layout
  verticalConcernsContainer: {
    gap: 14,
    marginTop: 8,
  },
  concernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: CURIO_THEME.colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  concernHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  concernIcon: {
    fontSize: 32,
    marginRight: 12,
    marginTop: 2,
  },
  concernHeaderText: {
    flex: 1,
  },
  concernTitle: {
    color: CURIO_THEME.colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  concernSolutions: {
    marginTop: 8,
  },
  solutionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 0,
  },
  solutionBullet: {
    fontSize: 14,
    color: CURIO_THEME.colors.primary,
    marginRight: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  concernSolution: {
    flex: 1,
    color: CURIO_THEME.colors.text,
    lineHeight: 20,
  },
  moreInfoButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    alignSelf: 'flex-start',
  },
  moreInfoText: {
    color: CURIO_THEME.colors.primary,
    fontWeight: '600',
  },
  moreInfo: {
    color: CURIO_THEME.colors.primary,
    fontWeight: '600',
    marginTop: 10,
    paddingLeft: 24,
  },
});

export default ParentalGuidanceScreen;
