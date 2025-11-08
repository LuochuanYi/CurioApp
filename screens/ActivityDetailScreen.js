import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { DIFFICULTY_LEVELS } from '../data/learningCategories';

const { width: screenWidth } = Dimensions.get('window');

const ActivityDetailScreen = ({ route, navigation }) => {
  const { activity, categoryId, categoryName } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activityProgress, setActivityProgress] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);



  useEffect(() => {
    // Calculate progress percentage
    const progress = (completedSteps.length / activity.instructions.length) * 100;
    setActivityProgress(progress);
  }, [completedSteps, activity.instructions.length]);

  const handleBackPress = () => {
    console.log('handleBackPress called, isStarted:', isStarted);
    console.log('Current navigation state:', navigation.getState?.());
    
    const navigateBack = () => {
      console.log('Attempting to navigate back...');
      console.log('Available navigation methods:', Object.keys(navigation));
      
      try {
        // Try multiple navigation methods in order of preference
        if (navigation.canGoBack && navigation.canGoBack()) {
          console.log('Can go back is true, using goBack()');
          navigation.goBack();
        } else if (navigation.pop) {
          console.log('Using navigation.pop()');
          navigation.pop();
        } else if (navigation.navigate && categoryId) {
          console.log('Using navigation.navigate() to CategoryDetail');
          navigation.navigate('CategoryDetail', { categoryId });
        } else if (navigation.reset) {
          console.log('Using navigation.reset() to go to CategoryDetail');
          navigation.reset({
            index: 1,
            routes: [
              { name: 'Engage' },
              { name: 'CategoryDetail', params: { categoryId } }
            ],
          });
        } else {
          console.error('No working navigation method found');
          // Last resort: try to navigate to Engage screen
          navigation.navigate?.('Engage');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to Engage screen
        try {
          navigation.navigate('Engage');
        } catch (fallbackError) {
          console.error('Fallback navigation failed:', fallbackError);
          Alert.alert('Navigation Error', 'Unable to navigate back. Please restart the app.');
        }
      }
    };
    
    if (isStarted) {
      Alert.alert(
        'Leave Activity?',
        'Are you sure you want to leave this activity? Your progress will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          { 
            text: 'Leave', 
            style: 'destructive', 
            onPress: () => {
              console.log('User confirmed leaving activity');
              navigateBack();
            }
          }
        ],
        { cancelable: true }
      );
    } else {
      console.log('Activity not started, navigating back immediately');
      navigateBack();
    }
  };

  const handleStartActivity = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < activity.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    handleNextStep();
  };

  const handleCompleteActivity = () => {
    Alert.alert(
      'Great Job! 🎉',
      'You\'ve completed this activity! Would you like to try another one?',
      [
        { text: 'Stay Here', style: 'cancel' },
        { text: 'Browse More', onPress: () => navigation.goBack() }
      ]
    );
  };

  const getDifficultyColor = () => {
    return DIFFICULTY_LEVELS[activity.difficulty.id.toUpperCase()]?.color || '#6c757d';
  };

  const renderPreview = () => (
    <ScrollView style={styles.previewContainer} showsVerticalScrollIndicator={false}>
      {/* Activity Overview */}
      <View style={styles.overviewSection}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        {/* Activity Meta Information */}
        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{activity.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👶</Text>
              <Text style={styles.metaLabel}>Age Group</Text>
              <Text style={styles.metaValue}>{activity.ageGroup}</Text>
            </View>
          </View>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
                {activity.difficulty.icon}
              </Text>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={styles.metaValue}>{activity.difficulty.name}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🎯</Text>
              <Text style={styles.metaLabel}>Type</Text>
              <Text style={styles.metaValue}>{activity.type.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Learning Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Learning Goals</Text>
        <View style={styles.goalsList}>
          {activity.learningGoals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <Text style={styles.goalBullet}>•</Text>
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Materials Needed */}
      {activity.materials && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Materials Needed</Text>
          <View style={styles.materialsList}>
            {activity.materials.map((material, index) => (
              <View key={index} style={styles.materialItem}>
                <Text style={styles.materialBullet}>✓</Text>
                <Text style={styles.materialText}>{material}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Safety Tips */}
      {activity.safetyTips && (
        <View style={[styles.section, styles.safetySection]}>
          <Text style={styles.sectionTitle}>⚠️ Safety Tips</Text>
          {activity.safetyTips.map((tip, index) => (
            <View key={index} style={styles.safetyItem}>
              <Text style={styles.safetyBullet}>!</Text>
              <Text style={styles.safetyText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Instructions Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Instructions ({activity.instructions.length} steps)</Text>
        {activity.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionPreview}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>

      {/* Tips */}
      {activity.tips && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Tips for Success</Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsText}>{activity.tips}</Text>
          </View>
        </View>
      )}

      {/* Fun Facts */}
      {activity.funFacts && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤓 Fun Facts</Text>
          {activity.funFacts.map((fact, index) => (
            <View key={index} style={styles.factItem}>
              <Text style={styles.factIcon}>✨</Text>
              <Text style={styles.factText}>{fact}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderActiveActivity = () => (
    <View style={styles.activeContainer}>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressText}>
            {currentStep + 1} of {activity.instructions.length}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${((currentStep + 1) / activity.instructions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Current Step */}
      <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepNumberLarge, { backgroundColor: getDifficultyColor() }]}>
            <Text style={styles.stepNumberLargeText}>{currentStep + 1}</Text>
          </View>
          <Text style={styles.stepTitle}>Step {currentStep + 1}</Text>
        </View>
        
        <View style={styles.instructionContainer}>
          <Text style={styles.currentInstruction}>
            {activity.instructions[currentStep]}
          </Text>
        </View>

        {/* Materials for this step (if applicable) */}
        {activity.materials && currentStep === 0 && (
          <View style={styles.stepMaterials}>
            <Text style={styles.stepMaterialsTitle}>Materials for this activity:</Text>
            {activity.materials.map((material, index) => (
              <View key={index} style={styles.stepMaterialItem}>
                <Text style={styles.stepMaterialBullet}>•</Text>
                <Text style={styles.stepMaterialText}>{material}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Step Navigation */}
      <View style={styles.stepNavigation}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={handlePrevStep}
          disabled={currentStep === 0}
        >
          <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
            ← Previous
          </Text>
        </TouchableOpacity>

        {currentStep === activity.instructions.length - 1 ? (
          <TouchableOpacity style={[styles.navButton, styles.completeButton]} onPress={handleCompleteActivity}>
            <Text style={[styles.navButtonText, styles.completeButtonText]}>Complete! 🎉</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleCompleteStep}>
            <Text style={[styles.navButtonText, styles.nextButtonText]}>Step Done ✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: getDifficultyColor() }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('Original back button pressed!');
            console.log('isStarted:', isStarted);
            
            if (isStarted) {
              console.log('Activity started, showing custom confirmation');
              setShowExitConfirm(true);
            } else {
              console.log('Activity not started, navigating back directly');
              if (navigation?.goBack) {
                navigation.goBack();
              } else {
                navigation?.navigate('CategoryDetail', { categoryId });
              }
            }
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerCategory}>{categoryName}</Text>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {activity.title}
          </Text>
        </View>



        {isStarted && (
          <View style={styles.headerProgress}>
            <Text style={styles.headerProgressText}>
              {Math.round(activityProgress)}%
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      {isStarted ? renderActiveActivity() : renderPreview()}

      {/* Start Button (only shown in preview mode) */}
      {!isStarted && (
        <View style={styles.startButtonContainer}>
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: getDifficultyColor() }]}
            onPress={handleStartActivity}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Start activity"
          >
            <Text style={styles.startButtonIcon}>▶️</Text>
            <Text style={styles.startButtonText}>Start Activity</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Exit Confirmation Modal */}
      {showExitConfirm && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Leave Activity?</Text>
            <Text style={styles.confirmationMessage}>
              Your progress will be lost if you leave now.
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => {
                  console.log('User cancelled exit');
                  setShowExitConfirm(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.leaveButton]}
                onPress={() => {
                  console.log('User confirmed exit, navigating back...');
                  setShowExitConfirm(false);
                  if (navigation?.goBack) {
                    navigation.goBack();
                  } else {
                    navigation?.navigate('CategoryDetail', { categoryId });
                  }
                }}
              >
                <Text style={styles.leaveButtonText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 26,
  },
  headerProgress: {
    alignItems: 'center',
  },
  headerProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Preview Mode
  previewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overviewSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  metaIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },

  // Learning Goals
  goalsList: {
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  goalBullet: {
    fontSize: 16,
    color: '#4ecdc4',
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  goalText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
    lineHeight: 22,
  },

  // Materials
  materialsList: {
    gap: 8,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialBullet: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: 'bold',
    marginRight: 12,
  },
  materialText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
  },

  // Safety
  safetySection: {
    backgroundColor: '#fff5f5',
    borderColor: '#fecaca',
    borderWidth: 1,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  safetyBullet: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: 'bold',
    marginRight: 8,
    backgroundColor: '#fecaca',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  safetyText: {
    fontSize: 14,
    color: '#dc2626',
    flex: 1,
    fontWeight: '500',
  },

  // Instructions Preview
  instructionPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
    lineHeight: 22,
  },

  // Tips
  tipsContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecdc4',
  },
  tipsText: {
    fontSize: 15,
    color: '#495057',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Fun Facts
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  factIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  factText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
    lineHeight: 22,
  },

  // Active Activity Mode
  activeContainer: {
    flex: 1,
  },
  progressSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  progressText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    borderRadius: 4,
  },

  // Current Step
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepNumberLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberLargeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  instructionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentInstruction: {
    fontSize: 18,
    color: '#2c3e50',
    lineHeight: 28,
    textAlign: 'center',
  },

  // Step Materials
  stepMaterials: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  stepMaterialsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  stepMaterialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepMaterialBullet: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 8,
  },
  stepMaterialText: {
    fontSize: 14,
    color: '#495057',
  },

  // Navigation
  stepNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  navButtonTextDisabled: {
    color: '#adb5bd',
  },
  nextButton: {
    backgroundColor: '#4ecdc4',
  },
  nextButtonText: {
    color: '#fff',
  },
  completeButton: {
    backgroundColor: '#27ae60',
  },
  completeButtonText: {
    color: '#fff',
  },

  // Start Button
  startButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  startButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Bottom spacing
  bottomSpacing: {
    height: 20,
  },

  // Custom confirmation modal styles
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 320,
    width: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmationMessage: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
  },
  leaveButton: {
    backgroundColor: '#dc3545',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ActivityDetailScreen;