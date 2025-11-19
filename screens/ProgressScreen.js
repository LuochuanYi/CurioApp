// Progress Screen - Comprehensive progress tracking and achievement display
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useEnhancedProgress } from '../hooks/useEnhancedProgress';
import { CurioHeader } from '../components';
import {
  ProgressSummary,
  StatsDashboard,
  AchievementsGallery,
  LevelProgressBar,
  DailyGoalsProgress,
  RecentAchievements,
  AchievementUnlockModal
} from '../components/ProgressDashboard';

const ProgressScreen = ({ navigation }) => {
  const {
    // Progress data
    currentLevel,
    progressToNextLevel,
    stats,
    gameStats,
    achievements,
    unlockedAchievements,
    preferences,
    
    // Today's data
    getTodayStats,
    
    // Actions
    checkForNewAchievements,
    resetProgress,
    
    // Loading state
    isLoading
  } = useEnhancedProgress();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview'); // overview, achievements, stats
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [todayStats, setTodayStats] = useState({
    activitiesCompleted: 0,
    gamesPlayed: 0,
    pointsEarned: 0,
    goalProgress: 0
  });

  // Load today's stats on mount and refresh
  useEffect(() => {
    loadTodayStats();
  }, []);

  const loadTodayStats = async () => {
    try {
      const stats = await getTodayStats();
      setTodayStats(stats);
    } catch (error) {
      console.warn('Failed to load today stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTodayStats();
      await checkForNewAchievements();
    } catch (error) {
      console.warn('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAchievementPress = (achievement, isUnlocked) => {
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            await loadTodayStats();
          }
        }
      ]
    );
  };

  const renderTabButton = (tabId, title, icon) => (
    <TouchableOpacity
      key={tabId}
      style={[
        styles.tabButton,
        selectedTab === tabId && styles.activeTabButton
      ]}
      onPress={() => setSelectedTab(tabId)}
    >
      <Text style={[
        styles.tabIcon,
        selectedTab === tabId && styles.activeTabIcon
      ]}>
        {icon}
      </Text>
      <Text style={[
        styles.tabTitle,
        selectedTab === tabId && styles.activeTabTitle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Level Progress */}
      <LevelProgressBar
        currentLevel={currentLevel}
        progressToNextLevel={progressToNextLevel}
        showDetails={true}
      />

      {/* Daily Goals */}
      <DailyGoalsProgress
        todayStats={todayStats}
        preferences={preferences}
      />

      {/* Recent Achievements */}
      <RecentAchievements
        recentAchievements={unlockedAchievements.slice(0, 5)}
        allAchievements={achievements}
      />

      {/* Quick Stats Overview */}
      <View style={styles.quickOverview}>
        <Text style={styles.sectionTitle}>📊 Quick Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewIcon}>🎯</Text>
            <Text style={styles.overviewValue}>{stats.totalActivitiesCompleted || 0}</Text>
            <Text style={styles.overviewLabel}>Total Activities</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewIcon}>🏆</Text>
            <Text style={styles.overviewValue}>{unlockedAchievements.length}</Text>
            <Text style={styles.overviewLabel}>Achievements</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewIcon}>🔥</Text>
            <Text style={styles.overviewValue}>{stats.learningStreak || 0}</Text>
            <Text style={styles.overviewLabel}>Day Streak</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewIcon}>⭐</Text>
            <Text style={styles.overviewValue}>{stats.totalPoints || 0}</Text>
            <Text style={styles.overviewLabel}>Total Points</Text>
          </View>
        </View>
      </View>

      {/* Level Info */}
      <View style={styles.levelInfo}>
        <Text style={styles.sectionTitle}>🎖️ Level Information</Text>
        <View style={styles.levelInfoCard}>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoLabel}>Current Level:</Text>
            <Text style={styles.levelInfoValue}>
              {currentLevel.badge} {currentLevel.title}
            </Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoLabel}>Points to Next Level:</Text>
            <Text style={styles.levelInfoValue}>
              {Math.max(0, currentLevel.nextLevelPoints - stats.totalPoints)} points
            </Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoLabel}>Progress:</Text>
            <Text style={styles.levelInfoValue}>
              {Math.round(progressToNextLevel)}% complete
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderAchievementsTab = () => (
    <ScrollView style={styles.tabContent}>
      <AchievementsGallery
        achievements={achievements}
        unlockedAchievements={unlockedAchievements}
        onAchievementPress={handleAchievementPress}
      />
      
      {/* Achievement Categories */}
      <View style={styles.achievementCategories}>
        <Text style={styles.sectionTitle}>🏅 Achievement Categories</Text>
        
        {/* Learning Achievements */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>📚 Learning Progress</Text>
          <Text style={styles.categoryDescription}>
            Complete activities and explore different categories to unlock learning achievements.
          </Text>
          {renderCategoryAchievements(['first_activity', 'activity_master', 'category_explorer', 'learning_marathon'])}
        </View>

        {/* Game Achievements */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>🎮 Game Mastery</Text>
          <Text style={styles.categoryDescription}>
            Play games and achieve high scores to unlock gaming achievements.
          </Text>
          {renderCategoryAchievements(['game_novice', 'perfect_score', 'game_variety', 'speed_demon'])}
        </View>

        {/* Streak Achievements */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>🔥 Consistency</Text>
          <Text style={styles.categoryDescription}>
            Build learning habits by maintaining daily streaks.
          </Text>
          {renderCategoryAchievements(['streak_starter', 'streak_keeper', 'dedication_badge'])}
        </View>

        {/* Special Achievements */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>⭐ Special</Text>
          <Text style={styles.categoryDescription}>
            Special achievements for reaching major milestones.
          </Text>
          {renderCategoryAchievements(['early_bird'])}
        </View>
      </View>
    </ScrollView>
  );

  const renderCategoryAchievements = (achievementIds) => (
    <View style={styles.categoryAchievements}>
      {achievementIds.map(id => {
        const achievement = achievements.find(a => a.id === id);
        const isUnlocked = unlockedAchievements.some(unlock => unlock.achievementId === id);
        
        if (!achievement) return null;
        
        return (
          <View key={id} style={styles.categoryAchievement}>
            <TouchableOpacity
              style={[
                styles.categoryBadge,
                isUnlocked ? styles.unlockedCategoryBadge : styles.lockedCategoryBadge
              ]}
              onPress={() => handleAchievementPress(achievement, isUnlocked)}
            >
              <Text style={styles.categoryBadgeIcon}>
                {isUnlocked ? achievement.reward.badge : '🔒'}
              </Text>
            </TouchableOpacity>
            <View style={styles.categoryAchievementInfo}>
              <Text style={[
                styles.categoryAchievementTitle,
                isUnlocked ? styles.unlockedAchievementTitle : styles.lockedAchievementTitle
              ]}>
                {achievement.title}
              </Text>
              <Text style={styles.categoryAchievementDescription}>
                {achievement.description}
              </Text>
              <Text style={styles.categoryAchievementReward}>
                +{achievement.reward.points} points
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderStatsTab = () => (
    <ScrollView style={styles.tabContent}>
      <StatsDashboard
        stats={stats}
        gameStats={gameStats}
        todayStats={todayStats}
      />
      
      {/* Detailed Analytics */}
      <View style={styles.detailedAnalytics}>
        <Text style={styles.sectionTitle}>📈 Detailed Analytics</Text>
        
        {/* Learning Patterns */}
        <View style={styles.analyticsSection}>
          <Text style={styles.analyticsTitle}>🕒 Learning Patterns</Text>
          <View style={styles.analyticsCard}>
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Best Learning Streak:</Text>
              <Text style={styles.analyticsValue}>{stats.longestLearningStreak || 0} days</Text>
            </View>
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Current Streak:</Text>
              <Text style={styles.analyticsValue}>{stats.learningStreak || 0} days</Text>
            </View>
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Average Daily Goal Progress:</Text>
              <Text style={styles.analyticsValue}>
                {Math.round((todayStats.goalProgress || 0))}%
              </Text>
            </View>
          </View>
        </View>

        {/* Category Progress */}
        <View style={styles.analyticsSection}>
          <Text style={styles.analyticsTitle}>📚 Category Exploration</Text>
          <View style={styles.analyticsCard}>
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Categories Explored:</Text>
              <Text style={styles.analyticsValue}>
                {Object.keys(stats.categoriesExplored || {}).length}
              </Text>
            </View>
            {Object.entries(stats.categoriesExplored || {}).map(([category, count]) => (
              <View key={category} style={styles.analyticsRow}>
                <Text style={styles.analyticsSubLabel}>  {category}:</Text>
                <Text style={styles.analyticsValue}>{count} activities</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Game Performance Details */}
        <View style={styles.analyticsSection}>
          <Text style={styles.analyticsTitle}>🎮 Game Performance</Text>
          {Object.entries(gameStats).map(([gameType, stats]) => {
            if (!stats || typeof stats !== 'object') return null;
            
            return (
              <View key={gameType} style={styles.gameAnalyticsCard}>
                <Text style={styles.gameAnalyticsTitle}>
                  {gameType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                <View style={styles.gameAnalyticsRow}>
                  <Text style={styles.analyticsLabel}>Games Played:</Text>
                  <Text style={styles.analyticsValue}>{stats.gamesPlayed || 0}</Text>
                </View>
                <View style={styles.gameAnalyticsRow}>
                  <Text style={styles.analyticsLabel}>Average Score:</Text>
                  <Text style={styles.analyticsValue}>
                    {Math.round(stats.averageScore || 0)}%
                  </Text>
                </View>
                <View style={styles.gameAnalyticsRow}>
                  <Text style={styles.analyticsLabel}>Best Score:</Text>
                  <Text style={styles.analyticsValue}>
                    {Math.round(stats.bestScore || 0)}%
                  </Text>
                </View>
                <View style={styles.gameAnalyticsRow}>
                  <Text style={styles.analyticsLabel}>Total Points:</Text>
                  <Text style={styles.analyticsValue}>{stats.totalPoints || 0}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Debug Section (Development Only) */}
      {__DEV__ && (
        <View style={styles.debugSection}>
          <Text style={styles.sectionTitle}>🔧 Debug Options</Text>
          <TouchableOpacity style={styles.debugButton} onPress={handleResetProgress}>
            <Text style={styles.debugButtonText}>Reset All Progress</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <CurioHeader title="Progress" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CurioHeader title="Progress" />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('overview', 'Overview', '📊')}
        {renderTabButton('achievements', 'Achievements', '🏆')}
        {renderTabButton('stats', 'Statistics', '📈')}
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'achievements' && renderAchievementsTab()}
        {selectedTab === 'stats' && renderStatsTab()}
      </ScrollView>

      {/* Achievement Modal */}
      <AchievementUnlockModal
        visible={showAchievementModal}
        achievement={selectedAchievement}
        onClose={() => {
          setShowAchievementModal(false);
          setSelectedAchievement(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6c757d',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#4ecdc4',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  activeTabIcon: {
    fontSize: 16,
  },
  tabTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeTabTitle: {
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  // Overview Tab Styles
  quickOverview: {
    padding: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overviewIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  levelInfo: {
    padding: 20,
  },
  levelInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  levelInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  levelInfoLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  levelInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },

  // Achievements Tab Styles
  achievementCategories: {
    padding: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryAchievements: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryAchievement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
  },
  unlockedCategoryBadge: {
    backgroundColor: '#fff',
    borderColor: '#4ecdc4',
  },
  lockedCategoryBadge: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  categoryBadgeIcon: {
    fontSize: 20,
  },
  categoryAchievementInfo: {
    flex: 1,
  },
  categoryAchievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  unlockedAchievementTitle: {
    color: '#2c3e50',
  },
  lockedAchievementTitle: {
    color: '#6c757d',
  },
  categoryAchievementDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    lineHeight: 18,
  },
  categoryAchievementReward: {
    fontSize: 12,
    fontWeight: '600',
    color: '#28a745',
  },

  // Stats Tab Styles
  detailedAnalytics: {
    padding: 20,
  },
  analyticsSection: {
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  analyticsSubLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  analyticsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  gameAnalyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gameAnalyticsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 12,
  },
  gameAnalyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  // Debug Styles
  debugSection: {
    padding: 20,
    marginTop: 20,
  },
  debugButton: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProgressScreen;