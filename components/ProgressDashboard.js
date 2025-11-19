// Progress Dashboard Components - Visual progress tracking and achievement displays
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  Pressable
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// 🏆 Achievement Badge Component
export const AchievementBadge = ({ achievement, size = 'medium', onPress, unlocked = false, showTitle = true }) => {
  const sizeStyles = {
    small: { width: 40, height: 40, fontSize: 20 },
    medium: { width: 60, height: 60, fontSize: 30 },
    large: { width: 80, height: 80, fontSize: 40 }
  };

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity 
      style={[
        styles.achievementBadge, 
        { width: currentSize.width, height: currentSize.height },
        unlocked ? styles.unlockedBadge : styles.lockedBadge
      ]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.badgeIcon, { fontSize: currentSize.fontSize }]}>
        {unlocked ? achievement.reward.badge : '🔒'}
      </Text>
      {showTitle && (
        <Text style={[styles.badgeTitle, unlocked ? styles.unlockedTitle : styles.lockedTitle]} numberOfLines={2}>
          {achievement.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// 📊 Level Progress Bar Component
export const LevelProgressBar = ({ currentLevel, progressToNextLevel, showDetails = true }) => {
  const progressWidth = (progressToNextLevel / 100) * (screenWidth - 40);

  return (
    <View style={styles.levelContainer}>
      {showDetails && (
        <View style={styles.levelHeader}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelIcon}>{currentLevel.badge}</Text>
            <Text style={styles.levelNumber}>Level {currentLevel.level}</Text>
          </View>
          <Text style={styles.levelTitle}>{currentLevel.title}</Text>
        </View>
      )}
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: progressWidth }
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progressToNextLevel)}%</Text>
      </View>
    </View>
  );
};

// 📈 Stats Dashboard Component
export const StatsDashboard = ({ stats, gameStats, todayStats }) => {
  return (
    <View style={styles.statsDashboard}>
      <Text style={styles.dashboardTitle}>📊 Your Learning Stats</Text>
      
      {/* Today's Progress */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayStats.activitiesCompleted}</Text>
          <Text style={styles.statLabel}>Activities Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(todayStats.goalProgress)}%</Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.learningStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Overall Progress */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Object.keys(stats.categoriesExplored || {}).length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPoints}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.longestLearningStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      {/* Game Performance */}
      <View style={styles.gameStatsSection}>
        <Text style={styles.gameStatsTitle}>🎮 Game Performance</Text>
        <View style={styles.gameStatsGrid}>
          <View style={styles.gameStatItem}>
            <Text style={styles.gameStatIcon}>🎯</Text>
            <Text style={styles.gameStatValue}>{Math.round(gameStats.vocabularyGames.averageScore || 0)}%</Text>
            <Text style={styles.gameStatLabel}>Vocabulary</Text>
          </View>
          <View style={styles.gameStatItem}>
            <Text style={styles.gameStatIcon}>🧩</Text>
            <Text style={styles.gameStatValue}>{Math.round(gameStats.comprehensionQuizzes.averageScore || 0)}%</Text>
            <Text style={styles.gameStatLabel}>Quizzes</Text>
          </View>
          <View style={styles.gameStatItem}>
            <Text style={styles.gameStatIcon}>🎮</Text>
            <Text style={styles.gameStatValue}>{Math.round(gameStats.memoryGames.averageScore || 0)}%</Text>
            <Text style={styles.gameStatLabel}>Memory</Text>
          </View>
          <View style={styles.gameStatItem}>
            <Text style={styles.gameStatIcon}>🎯</Text>
            <Text style={styles.gameStatValue}>{Math.round(gameStats.patternGames.averageScore || 0)}%</Text>
            <Text style={styles.gameStatLabel}>Patterns</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// 🏆 Achievements Gallery Component
export const AchievementsGallery = ({ achievements, unlockedAchievements, onAchievementPress }) => {
  return (
    <View style={styles.achievementsGallery}>
      <Text style={styles.galleryTitle}>🏆 Achievements</Text>
      <Text style={styles.gallerySubtitle}>
        {unlockedAchievements.length} of {achievements.length} unlocked
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.some(unlock => unlock.achievementId === achievement.id);
          
          return (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              size="large"
              unlocked={isUnlocked}
              onPress={() => onAchievementPress && onAchievementPress(achievement, isUnlocked)}
              showTitle={true}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

// 🎉 Achievement Unlock Modal
export const AchievementUnlockModal = ({ visible, achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.achievementModal}>
          <Text style={styles.unlockTitle}>🎉 Achievement Unlocked!</Text>
          
          <View style={styles.achievementDisplay}>
            <Text style={styles.achievementIcon}>{achievement.reward.badge}</Text>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
          </View>
          
          <View style={styles.rewardSection}>
            <Text style={styles.rewardTitle}>Reward Earned:</Text>
            <Text style={styles.rewardPoints}>+{achievement.reward.points} Points</Text>
          </View>
          
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

// 📅 Daily Goals Progress Component
export const DailyGoalsProgress = ({ todayStats, preferences }) => {
  const goalProgress = Math.min(100, todayStats.goalProgress);
  const activitiesLeft = Math.max(0, preferences.dailyLearningGoal - todayStats.activitiesCompleted);

  return (
    <View style={styles.dailyGoalsContainer}>
      <Text style={styles.dailyGoalsTitle}>📅 Today's Learning Goal</Text>
      
      <View style={styles.goalProgressContainer}>
        <View style={styles.goalProgressBar}>
          <View style={[styles.goalProgressFill, { width: `${goalProgress}%` }]} />
        </View>
        <Text style={styles.goalProgressText}>
          {todayStats.activitiesCompleted} / {preferences.dailyLearningGoal} activities
        </Text>
      </View>
      
      {activitiesLeft > 0 ? (
        <Text style={styles.goalEncouragement}>
          {activitiesLeft === 1 
            ? "Just 1 more activity to reach your goal! 🎯"
            : `${activitiesLeft} more activities to reach your goal! 💪`
          }
        </Text>
      ) : (
        <Text style={styles.goalCompleted}>
          🎉 Goal completed! Great job today!
        </Text>
      )}
    </View>
  );
};

// 🎖️ Recent Achievements Component
export const RecentAchievements = ({ recentAchievements, allAchievements }) => {
  if (recentAchievements.length === 0) return null;

  return (
    <View style={styles.recentAchievements}>
      <Text style={styles.recentTitle}>🎖️ Recent Achievements</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {recentAchievements.map((unlock, index) => {
          const achievement = allAchievements.find(a => a.id === unlock.achievementId);
          if (!achievement) return null;
          
          return (
            <View key={index} style={styles.recentAchievementCard}>
              <Text style={styles.recentAchievementIcon}>{achievement.reward.badge}</Text>
              <Text style={styles.recentAchievementTitle} numberOfLines={2}>
                {achievement.title}
              </Text>
              <Text style={styles.recentAchievementDate}>
                {new Date(unlock.unlockedAt).toLocaleDateString()}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

// 🏅 Progress Summary Component (for HomeScreen)
export const ProgressSummary = ({ 
  currentLevel, 
  progressToNextLevel, 
  todayStats, 
  learningStreak, 
  totalPoints 
}) => {
  return (
    <View style={styles.progressSummary}>
      <View style={styles.summaryHeader}>
        <View style={styles.levelSummary}>
          <Text style={styles.summaryLevelIcon}>{currentLevel.badge}</Text>
          <View>
            <Text style={styles.summaryLevelTitle}>Level {currentLevel.level}</Text>
            <Text style={styles.summaryLevelName}>{currentLevel.title}</Text>
          </View>
        </View>
        <View style={styles.summaryStats}>
          <Text style={styles.summaryStatValue}>{totalPoints}</Text>
          <Text style={styles.summaryStatLabel}>Points</Text>
        </View>
      </View>

      <LevelProgressBar 
        currentLevel={currentLevel} 
        progressToNextLevel={progressToNextLevel} 
        showDetails={false}
      />

      <View style={styles.summaryQuickStats}>
        <View style={styles.summaryQuickStat}>
          <Text style={styles.quickStatIcon}>📅</Text>
          <Text style={styles.quickStatValue}>{todayStats.activitiesCompleted}</Text>
          <Text style={styles.quickStatLabel}>Today</Text>
        </View>
        <View style={styles.summaryQuickStat}>
          <Text style={styles.quickStatIcon}>🔥</Text>
          <Text style={styles.quickStatValue}>{learningStreak}</Text>
          <Text style={styles.quickStatLabel}>Streak</Text>
        </View>
        <View style={styles.summaryQuickStat}>
          <Text style={styles.quickStatIcon}>🎯</Text>
          <Text style={styles.quickStatValue}>{Math.round(todayStats.goalProgress)}%</Text>
          <Text style={styles.quickStatLabel}>Goal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Achievement Badge Styles
  achievementBadge: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderWidth: 2,
  },
  unlockedBadge: {
    backgroundColor: '#fff',
    borderColor: '#4ecdc4',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lockedBadge: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  badgeIcon: {
    marginBottom: 4,
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  unlockedTitle: {
    color: '#2c3e50',
  },
  lockedTitle: {
    color: '#6c757d',
  },

  // Level Progress Styles
  levelContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    alignItems: 'center',
    marginRight: 16,
  },
  levelIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 12,
    backgroundColor: '#4ecdc4',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 12,
    minWidth: 40,
  },

  // Stats Dashboard Styles
  statsDashboard: {
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },

  // Game Stats Styles
  gameStatsSection: {
    marginTop: 20,
  },
  gameStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  gameStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameStatItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 2,
    elevation: 1,
  },
  gameStatIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  gameStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 2,
  },
  gameStatLabel: {
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
  },

  // Achievements Gallery Styles
  achievementsGallery: {
    padding: 20,
  },
  galleryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  gallerySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  achievementsScroll: {
    paddingVertical: 8,
  },

  // Achievement Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    maxWidth: 320,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  unlockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 20,
  },
  achievementDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  rewardSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    width: '100%',
  },
  rewardTitle: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
  },
  rewardPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  modalCloseButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Daily Goals Styles
  dailyGoalsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dailyGoalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  goalProgressContainer: {
    marginBottom: 12,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgressFill: {
    height: 8,
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  goalEncouragement: {
    fontSize: 14,
    color: '#ff6b35',
    textAlign: 'center',
    fontWeight: '500',
  },
  goalCompleted: {
    fontSize: 14,
    color: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // Recent Achievements Styles
  recentAchievements: {
    padding: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  recentAchievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    width: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentAchievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  recentAchievementTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
  },
  recentAchievementDate: {
    fontSize: 8,
    color: '#6c757d',
  },

  // Progress Summary Styles
  progressSummary: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLevelIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  summaryLevelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  summaryLevelName: {
    fontSize: 14,
    color: '#6c757d',
  },
  summaryStats: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  summaryQuickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  summaryQuickStat: {
    alignItems: 'center',
  },
  quickStatIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#6c757d',
  },
});

export default {
  AchievementBadge,
  LevelProgressBar,
  StatsDashboard,
  AchievementsGallery,
  AchievementUnlockModal,
  DailyGoalsProgress,
  RecentAchievements,
  ProgressSummary
};