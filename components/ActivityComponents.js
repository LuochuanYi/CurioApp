import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Timer Component for timed activities
export const TimerComponent = ({ duration = 60, onTimerComplete, isActive = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  React.useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            onTimerComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimerComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  if (!isActive) return null;

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
      <View style={styles.timerControls}>
        <TouchableOpacity 
          style={[styles.timerButton, isRunning ? styles.pauseButton : styles.playButton]}
          onPress={handleToggle}
        >
          <Text style={styles.timerButtonText}>
            {isRunning ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.timerButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Checklist Component for step-by-step activities
export const ChecklistComponent = ({ items, onItemCheck, checkedItems = [] }) => {
  const handleItemPress = (index) => {
    onItemCheck?.(index);
  };

  return (
    <View style={styles.checklistContainer}>
      <Text style={styles.checklistTitle}>Activity Checklist:</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checklistItem}
          onPress={() => handleItemPress(index)}
        >
          <View style={[
            styles.checkbox,
            checkedItems.includes(index) && styles.checkedBox
          ]}>
            {checkedItems.includes(index) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={[
            styles.checklistText,
            checkedItems.includes(index) && styles.checkedText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Progress Ring Component
export const ProgressRing = ({ progress, size = 60, strokeWidth = 6, color = '#4ecdc4' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.progressRingContainer, { width: size, height: size }]}>
      <View style={styles.progressRingContent}>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

// Materials Checklist Component
export const MaterialsChecklist = ({ materials, onMaterialCheck, checkedMaterials = [] }) => {
  return (
    <View style={styles.materialsContainer}>
      <Text style={styles.materialsTitle}>📦 Gather Your Materials:</Text>
      <Text style={styles.materialsSubtitle}>Check off each item as you collect it</Text>
      {materials.map((material, index) => (
        <TouchableOpacity
          key={index}
          style={styles.materialItem}
          onPress={() => onMaterialCheck?.(index)}
        >
          <View style={[
            styles.materialCheckbox,
            checkedMaterials.includes(index) && styles.materialCheckedBox
          ]}>
            {checkedMaterials.includes(index) && (
              <Text style={styles.materialCheckmark}>✓</Text>
            )}
          </View>
          <Text style={[
            styles.materialText,
            checkedMaterials.includes(index) && styles.materialCheckedText
          ]}>
            {material}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Fun Fact Display Component
export const FunFactCard = ({ fact, icon = '✨', onNext }) => {
  return (
    <View style={styles.funFactContainer}>
      <View style={styles.funFactHeader}>
        <Text style={styles.funFactIcon}>{icon}</Text>
        <Text style={styles.funFactTitle}>Fun Fact!</Text>
      </View>
      <Text style={styles.funFactText}>{fact}</Text>
      {onNext && (
        <TouchableOpacity style={styles.funFactButton} onPress={onNext}>
          <Text style={styles.funFactButtonText}>Next Fact →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Activity Rating Component
export const ActivityRating = ({ onRating, title = "How was this activity?" }) => {
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRating = (rating) => {
    setSelectedRating(rating);
    onRating?.(rating);
  };

  const emotions = ['😟', '😐', '🙂', '😊', '🤩'];
  const labels = ['Not fun', 'Okay', 'Good', 'Great', 'Amazing!'];

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>{title}</Text>
      <View style={styles.ratingOptions}>
        {emotions.map((emotion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.ratingOption,
              selectedRating === index + 1 && styles.selectedRating
            ]}
            onPress={() => handleRating(index + 1)}
          >
            <Text style={styles.ratingEmoji}>{emotion}</Text>
            <Text style={styles.ratingLabel}>{labels[index]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Safety Reminder Component
export const SafetyReminder = ({ tips, onAcknowledge }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge?.();
  };

  return (
    <View style={styles.safetyContainer}>
      <View style={styles.safetyHeader}>
        <Text style={styles.safetyIcon}>⚠️</Text>
        <Text style={styles.safetyTitle}>Safety First!</Text>
      </View>
      
      <ScrollView style={styles.safetyTips}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.safetyTip}>
            <Text style={styles.safetyBullet}>•</Text>
            <Text style={styles.safetyText}>{tip}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.acknowledgeButton, acknowledged && styles.acknowledgedButton]}
        onPress={handleAcknowledge}
        disabled={acknowledged}
      >
        <Text style={[styles.acknowledgeText, acknowledged && styles.acknowledgedText]}>
          {acknowledged ? '✓ Safety Guidelines Understood' : 'I Understand - Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Timer styles
  timerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  playButton: {
    backgroundColor: '#27ae60',
  },
  pauseButton: {
    backgroundColor: '#f39c12',
  },
  resetButton: {
    backgroundColor: '#95a5a6',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  timerButtonText: {
    fontSize: 24,
    color: '#fff',
  },

  // Checklist styles
  checklistContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checklistText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },

  // Progress ring styles
  progressRingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRingContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  // Materials checklist styles
  materialsContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  materialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  materialsSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  materialCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#27ae60',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialCheckedBox: {
    backgroundColor: '#27ae60',
  },
  materialCheckmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  materialText: {
    fontSize: 15,
    color: '#2c3e50',
    flex: 1,
  },
  materialCheckedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },

  // Fun fact styles
  funFactContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#ffeaa7',
  },
  funFactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  funFactIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
  },
  funFactText: {
    fontSize: 16,
    color: '#856404',
    lineHeight: 24,
    marginBottom: 16,
  },
  funFactButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  funFactButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Rating styles
  ratingContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  selectedRating: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  ratingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Safety styles
  safetyContainer: {
    backgroundColor: '#fff5f5',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  safetyIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  safetyTips: {
    maxHeight: 200,
    marginBottom: 16,
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  safetyBullet: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  safetyText: {
    fontSize: 14,
    color: '#dc2626',
    flex: 1,
    lineHeight: 20,
  },
  acknowledgeButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  acknowledgedButton: {
    backgroundColor: '#16a34a',
  },
  acknowledgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  acknowledgedText: {
    color: '#fff',
  },
});

export default {
  TimerComponent,
  ChecklistComponent,
  ProgressRing,
  MaterialsChecklist,
  FunFactCard,
  ActivityRating,
  SafetyReminder,
};