// Progress Integration Hooks - Connect enhanced progress with existing components
import { useEffect, useCallback } from 'react';
import { useEnhancedProgress } from './useEnhancedProgress';
import { useUserProgress } from './useUserProgress';

/**
 * Hook to sync enhanced progress with legacy user progress system
 * Ensures backward compatibility while adding new features
 */
export const useProgressSync = () => {
  const legacyProgress = useUserProgress();
  const enhancedProgress = useEnhancedProgress();

  // Sync completion events from legacy system to enhanced progress
  const syncActivityCompletion = useCallback(async (activityData) => {
    try {
      console.log('🔄 Syncing activity completion:', activityData);
      
      // Enhanced progress handles the new tracking
      if (enhancedProgress.recordActivityCompletion) {
        await enhancedProgress.recordActivityCompletion(
          activityData.activityId,
          activityData.category,
          {
            duration: activityData.duration || 0,
            score: activityData.score || 100,
            completed: true,
            timestamp: new Date().toISOString()
          }
        );
      }

      // Still update legacy for compatibility
      if (legacyProgress.markActivityComplete) {
        legacyProgress.markActivityComplete(activityData.activityId, activityData.category);
      }

      console.log('✅ Progress sync completed');
    } catch (error) {
      console.error('❌ Progress sync failed:', error);
    }
  }, [enhancedProgress, legacyProgress]);

  // Sync game completion events
  const syncGameCompletion = useCallback(async (gameData) => {
    try {
      console.log('🎮 Syncing game completion:', gameData);
      
      if (enhancedProgress.recordGameResult) {
        await enhancedProgress.recordGameResult(
          gameData.gameType,
          gameData.score,
          gameData.timeSpent || 0,
          {
            accuracy: gameData.accuracy || 0,
            difficulty: gameData.difficulty || 'medium',
            category: gameData.category,
            activityId: gameData.activityId
          }
        );
      }

      console.log('✅ Game sync completed');
    } catch (error) {
      console.error('❌ Game sync failed:', error);
    }
  }, [enhancedProgress]);

  return {
    syncActivityCompletion,
    syncGameCompletion,
    legacyProgress,
    enhancedProgress
  };
};

/**
 * Hook for achievement notifications and celebrations
 */
export const useAchievementNotifications = () => {
  const { checkForNewAchievements, unlockedAchievements } = useEnhancedProgress();
  
  const triggerAchievementCheck = useCallback(async () => {
    try {
      const newAchievements = await checkForNewAchievements();
      
      if (newAchievements && newAchievements.length > 0) {
        console.log('🏆 New achievements unlocked:', newAchievements);
        
        // Could trigger visual celebrations here
        newAchievements.forEach(achievement => {
          console.log(`🎉 Achievement unlocked: ${achievement.title}`);
        });
        
        return newAchievements;
      }
    } catch (error) {
      console.warn('Achievement check failed:', error);
    }
    
    return [];
  }, [checkForNewAchievements]);

  return {
    triggerAchievementCheck,
    unlockedAchievements,
    totalAchievements: unlockedAchievements.length
  };
};

/**
 * Hook for daily goal tracking and motivation
 */
export const useDailyGoals = () => {
  const { getTodayStats, preferences, stats } = useEnhancedProgress();
  
  const checkDailyGoalProgress = useCallback(async () => {
    try {
      const todayStats = await getTodayStats();
      const goalProgress = Math.min(100, todayStats.goalProgress);
      const activitiesLeft = Math.max(0, preferences.dailyLearningGoal - todayStats.activitiesCompleted);
      
      return {
        progress: goalProgress,
        activitiesCompleted: todayStats.activitiesCompleted,
        activitiesLeft,
        goalReached: goalProgress >= 100,
        isCloseToGoal: goalProgress >= 80,
        encouragementMessage: getEncouragementMessage(goalProgress, activitiesLeft)
      };
    } catch (error) {
      console.warn('Daily goal check failed:', error);
      return {
        progress: 0,
        activitiesCompleted: 0,
        activitiesLeft: preferences.dailyLearningGoal,
        goalReached: false,
        isCloseToGoal: false,
        encouragementMessage: "Let's start learning today! 🌟"
      };
    }
  }, [getTodayStats, preferences]);

  const getEncouragementMessage = (progress, activitiesLeft) => {
    if (progress >= 100) {
      return "🎉 Amazing! You've reached your daily goal! Keep up the great work!";
    } else if (progress >= 80) {
      return `🔥 So close! Just ${activitiesLeft} more ${activitiesLeft === 1 ? 'activity' : 'activities'} to reach your goal!`;
    } else if (progress >= 50) {
      return `💪 Great progress! You're halfway there with ${activitiesLeft} more to go!`;
    } else if (progress > 0) {
      return `🌟 Nice start! ${activitiesLeft} more ${activitiesLeft === 1 ? 'activity' : 'activities'} to reach your daily goal!`;
    } else {
      return "Let's start learning today! Every small step counts! 🚀";
    }
  };

  return {
    checkDailyGoalProgress,
    currentStreak: stats.learningStreak || 0,
    longestStreak: stats.longestLearningStreak || 0,
    dailyGoal: preferences.dailyLearningGoal
  };
};

/**
 * Hook for level progression and advancement
 */
export const useLevelProgression = () => {
  const { currentLevel, progressToNextLevel, stats } = useEnhancedProgress();
  
  const getLevelAdvancementInfo = useCallback(() => {
    if (!currentLevel) return null;
    
    const pointsToNextLevel = Math.max(0, currentLevel.nextLevelPoints - stats.totalPoints);
    const progressPercentage = Math.min(100, progressToNextLevel);
    
    return {
      currentLevel: currentLevel.level,
      currentLevelTitle: currentLevel.title,
      currentLevelBadge: currentLevel.badge,
      pointsToNext: pointsToNextLevel,
      progressPercentage,
      totalPoints: stats.totalPoints,
      isCloseToLevelUp: progressPercentage >= 80,
      motivationMessage: getLevelMotivationMessage(progressPercentage, pointsToNextLevel)
    };
  }, [currentLevel, progressToNextLevel, stats.totalPoints]);

  const getLevelMotivationMessage = (progress, pointsLeft) => {
    if (progress >= 90) {
      return `🚀 Almost there! Just ${pointsLeft} more points to level up!`;
    } else if (progress >= 70) {
      return `💎 Excellent progress! ${pointsLeft} points until your next level!`;
    } else if (progress >= 50) {
      return `⭐ You're doing great! Keep going to earn ${pointsLeft} more points!`;
    } else {
      return `🌟 Every activity brings you closer to the next level!`;
    }
  };

  return {
    getLevelAdvancementInfo,
    currentLevel,
    progressToNextLevel
  };
};

/**
 * Hook for learning analytics and insights
 */
export const useLearningAnalytics = () => {
  const { stats, gameStats, getTodayStats } = useEnhancedProgress();
  
  const getLearningInsights = useCallback(async () => {
    try {
      const todayStats = await getTodayStats();
      
      // Calculate learning patterns
      const totalActivities = stats.totalActivitiesCompleted || 0;
      const totalGames = Object.values(gameStats).reduce((sum, game) => sum + (game.gamesPlayed || 0), 0);
      const averageGameScore = calculateAverageGameScore(gameStats);
      const favoriteCategory = getFavoriteCategory(stats.categoriesExplored);
      
      return {
        summary: {
          totalActivities,
          totalGames,
          totalPoints: stats.totalPoints || 0,
          currentStreak: stats.learningStreak || 0,
          longestStreak: stats.longestLearningStreak || 0
        },
        today: {
          activitiesCompleted: todayStats.activitiesCompleted,
          gamesPlayed: todayStats.gamesPlayed,
          pointsEarned: todayStats.pointsEarned,
          goalProgress: todayStats.goalProgress
        },
        performance: {
          averageGameScore,
          strongestGameType: getStrongestGameType(gameStats),
          improvementArea: getImprovementArea(gameStats)
        },
        exploration: {
          categoriesExplored: Object.keys(stats.categoriesExplored || {}).length,
          favoriteCategory,
          explorationScore: calculateExplorationScore(stats.categoriesExplored)
        }
      };
    } catch (error) {
      console.warn('Learning analytics failed:', error);
      return null;
    }
  }, [stats, gameStats, getTodayStats]);

  const calculateAverageGameScore = (gameStats) => {
    const allScores = Object.values(gameStats)
      .filter(game => game && typeof game.averageScore === 'number')
      .map(game => game.averageScore);
    
    return allScores.length > 0 
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : 0;
  };

  const getFavoriteCategory = (categoriesExplored) => {
    if (!categoriesExplored) return 'None yet';
    
    return Object.entries(categoriesExplored)
      .reduce((favorite, [category, count]) => 
        count > (categoriesExplored[favorite] || 0) ? category : favorite,
        Object.keys(categoriesExplored)[0] || 'None yet'
      );
  };

  const getStrongestGameType = (gameStats) => {
    return Object.entries(gameStats)
      .filter(([_, stats]) => stats && typeof stats.averageScore === 'number')
      .reduce((strongest, [gameType, stats]) => 
        stats.averageScore > (gameStats[strongest]?.averageScore || 0) ? gameType : strongest,
        Object.keys(gameStats)[0] || 'None'
      );
  };

  const getImprovementArea = (gameStats) => {
    return Object.entries(gameStats)
      .filter(([_, stats]) => stats && typeof stats.averageScore === 'number')
      .reduce((weakest, [gameType, stats]) => 
        stats.averageScore < (gameStats[weakest]?.averageScore || 100) ? gameType : weakest,
        Object.keys(gameStats)[0] || 'None'
      );
  };

  const calculateExplorationScore = (categoriesExplored) => {
    const totalCategories = 6; // Adjust based on available categories
    const exploredCount = Object.keys(categoriesExplored || {}).length;
    return Math.round((exploredCount / totalCategories) * 100);
  };

  return {
    getLearningInsights,
    stats,
    gameStats
  };
};

export default {
  useProgressSync,
  useAchievementNotifications,
  useDailyGoals,
  useLevelProgression,
  useLearningAnalytics
};