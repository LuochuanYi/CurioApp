// Enhanced User Progress System with Learning Activities, Achievements & Badges
import { useState, useEffect, useMemo } from 'react';
import { useUserProgress } from './useUserProgress';

// Achievement definitions
const ACHIEVEMENTS = {
  // Learning Activity Achievements
  FIRST_ACTIVITY: {
    id: 'first_activity',
    title: 'First Steps! 👶',
    description: 'Completed your first learning activity',
    type: 'milestone',
    requirement: { type: 'activities_completed', value: 1 },
    reward: { points: 10, badge: '🌟' }
  },
  ACTIVITY_EXPLORER: {
    id: 'activity_explorer',
    title: 'Explorer! 🗺️',
    description: 'Tried activities from 3 different categories',
    type: 'exploration',
    requirement: { type: 'categories_explored', value: 3 },
    reward: { points: 25, badge: '🎒' }
  },
  ACTIVITY_MASTER: {
    id: 'activity_master',
    title: 'Activity Master! 🏆',
    description: 'Completed 25 learning activities',
    type: 'progress',
    requirement: { type: 'activities_completed', value: 25 },
    reward: { points: 100, badge: '👑' }
  },
  
  // Game Achievements
  FIRST_GAME: {
    id: 'first_game',
    title: 'Game Player! 🎮',
    description: 'Played your first interactive game',
    type: 'milestone',
    requirement: { type: 'games_played', value: 1 },
    reward: { points: 15, badge: '🕹️' }
  },
  VOCABULARY_EXPERT: {
    id: 'vocabulary_expert',
    title: 'Word Wizard! 📚',
    description: 'Scored 90%+ on 10 vocabulary games',
    type: 'skill',
    requirement: { type: 'vocabulary_high_scores', value: 10 },
    reward: { points: 50, badge: '🧙‍♂️' }
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    title: 'Quiz Champion! 🏅',
    description: 'Perfect score on 5 comprehension quizzes',
    type: 'skill',
    requirement: { type: 'quiz_perfect_scores', value: 5 },
    reward: { points: 75, badge: '🎯' }
  },
  
  // Streak Achievements
  CONSISTENT_LEARNER: {
    id: 'consistent_learner',
    title: 'Consistent Learner! 📅',
    description: 'Maintained a 7-day learning streak',
    type: 'habit',
    requirement: { type: 'learning_streak', value: 7 },
    reward: { points: 40, badge: '🔥' }
  },
  DEDICATION_MASTER: {
    id: 'dedication_master',
    title: 'Dedication Master! 💎',
    description: 'Maintained a 30-day learning streak',
    type: 'habit',
    requirement: { type: 'learning_streak', value: 30 },
    reward: { points: 200, badge: '💎' }
  },
  
  // Skill Development
  MULTISKILL_LEARNER: {
    id: 'multiskill_learner',
    title: 'Multi-Skill Learner! 🌈',
    description: 'Completed activities in all difficulty levels',
    type: 'skill',
    requirement: { type: 'all_difficulty_levels', value: 3 },
    reward: { points: 60, badge: '🌈' }
  },
  PERFECT_WEEK: {
    id: 'perfect_week',
    title: 'Perfect Week! ⭐',
    description: 'Completed daily learning goals for 7 days straight',
    type: 'habit',
    requirement: { type: 'perfect_week', value: 1 },
    reward: { points: 80, badge: '⭐' }
  }
};

// Learning progress levels
const LEARNING_LEVELS = [
  { level: 1, title: 'Curious Beginner', minPoints: 0, maxPoints: 99, badge: '🌱' },
  { level: 2, title: 'Eager Learner', minPoints: 100, maxPoints: 249, badge: '🌿' },
  { level: 3, title: 'Smart Explorer', minPoints: 250, maxPoints: 499, badge: '🌳' },
  { level: 4, title: 'Knowledge Seeker', minPoints: 500, maxPoints: 999, badge: '🦋' },
  { level: 5, title: 'Learning Champion', minPoints: 1000, maxPoints: 1999, badge: '🦅' },
  { level: 6, title: 'Wisdom Master', minPoints: 2000, maxPoints: 4999, badge: '🦉' },
  { level: 7, title: 'Genius Scholar', minPoints: 5000, maxPoints: 9999, badge: '🧠' },
  { level: 8, title: 'Learning Legend', minPoints: 10000, maxPoints: Infinity, badge: '🌟' }
];

// Enhanced progress structure
const enhancedProgressDefaults = {
  learningActivities: {
    // [activityId]: {
    //   completedAt: Date,
    //   completionCount: number,
    //   bestScore: number,
    //   timeSpent: number, 
    //   difficulty: string,
    //   category: string,
    //   gameResults: [] // Array of game performance data
    // }
  },
  gameStats: {
    vocabularyGames: { played: 0, averageScore: 0, perfectScores: 0, highScores: 0 },
    comprehensionQuizzes: { played: 0, averageScore: 0, perfectScores: 0 },
    memoryGames: { played: 0, averageScore: 0, perfectMatches: 0 },
    patternGames: { played: 0, averageScore: 0, perfectPatterns: 0 }
  },
  achievements: {
    unlocked: [], // Array of achievement IDs with unlock dates
    progress: {} // Progress towards locked achievements
  },
  learningMetrics: {
    totalPoints: 0,
    currentLevel: 1,
    weeklyGoalProgress: 0,
    monthlyGoalProgress: 0,
    categoriesExplored: [],
    difficultyLevelsCompleted: [],
    learningStreak: 0,
    longestLearningStreak: 0,
    lastLearningDate: null,
    perfectDays: 0,
    dailyGoalsMet: 0
  },
  preferences: {
    dailyLearningGoal: 3, // activities per day
    weeklyLearningGoal: 15, // activities per week
    reminderEnabled: true,
    reminderTime: '18:00', // 6 PM
    celebrationsEnabled: true,
    soundEffectsEnabled: true,
    parentalProgressReports: true
  }
};

export const useEnhancedProgress = () => {
  const baseProgress = useUserProgress();
  const [enhancedProgress, setEnhancedProgress] = useState(enhancedProgressDefaults);
  const [loading, setLoading] = useState(true);

  // Storage key for enhanced progress
  const ENHANCED_PROGRESS_KEY = 'curioapp_enhanced_progress';

  // Load enhanced progress
  useEffect(() => {
    loadEnhancedProgress();
  }, []);

  const loadEnhancedProgress = async () => {
    try {
      setLoading(true);
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(ENHANCED_PROGRESS_KEY);
        if (stored) {
          const parsedData = JSON.parse(stored);
          setEnhancedProgress({ ...enhancedProgressDefaults, ...parsedData });
        }
      }
    } catch (error) {
      console.error('Failed to load enhanced progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEnhancedProgress = async (newProgress) => {
    try {
      const progressToSave = { ...enhancedProgress, ...newProgress };
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(ENHANCED_PROGRESS_KEY, JSON.stringify(progressToSave));
      }
      setEnhancedProgress(progressToSave);
    } catch (error) {
      console.error('Failed to save enhanced progress:', error);
    }
  };

  // Activity progress functions
  const updateActivityProgress = (activityId, activityData) => {
    const { category, difficulty } = activityData;
    const completionTime = new Date().toISOString();
    
    const updatedActivities = {
      ...enhancedProgress.learningActivities,
      [activityId]: {
        ...enhancedProgress.learningActivities[activityId],
        completedAt: completionTime,
        completionCount: (enhancedProgress.learningActivities[activityId]?.completionCount || 0) + 1,
        category,
        difficulty,
        lastAccessedAt: completionTime
      }
    };

    // Update learning metrics
    const updatedMetrics = updateLearningMetrics(category, difficulty);
    
    const newProgress = {
      ...enhancedProgress,
      learningActivities: updatedActivities,
      learningMetrics: updatedMetrics
    };

    saveEnhancedProgress(newProgress);
    checkAchievements(newProgress);
  };

  const updateGameResults = (activityId, gameType, gameResults) => {
    const { score, gamesPlayed, correctAnswers, totalQuestions } = gameResults;
    
    // Update activity-specific game results
    const activityUpdate = {
      ...enhancedProgress.learningActivities[activityId],
      gameResults: [
        ...(enhancedProgress.learningActivities[activityId]?.gameResults || []),
        {
          gameType,
          score,
          playedAt: new Date().toISOString(),
          details: gameResults
        }
      ],
      bestScore: Math.max(score, enhancedProgress.learningActivities[activityId]?.bestScore || 0)
    };

    // Update global game statistics
    const updatedGameStats = { ...enhancedProgress.gameStats };
    
    switch (gameType) {
      case 'vocabulary-matching':
        const vocabStats = updatedGameStats.vocabularyGames;
        updatedGameStats.vocabularyGames = {
          played: vocabStats.played + 1,
          averageScore: ((vocabStats.averageScore * vocabStats.played) + score) / (vocabStats.played + 1),
          perfectScores: vocabStats.perfectScores + (score === 100 ? 1 : 0),
          highScores: vocabStats.highScores + (score >= 90 ? 1 : 0)
        };
        break;
        
      case 'comprehension-quiz':
        const quizStats = updatedGameStats.comprehensionQuizzes;
        updatedGameStats.comprehensionQuizzes = {
          played: quizStats.played + 1,
          averageScore: ((quizStats.averageScore * quizStats.played) + score) / (quizStats.played + 1),
          perfectScores: quizStats.perfectScores + (score === 100 ? 1 : 0)
        };
        break;
        
      case 'memory-matching':
        const memoryStats = updatedGameStats.memoryGames;
        updatedGameStats.memoryGames = {
          played: memoryStats.played + 1,
          averageScore: ((memoryStats.averageScore * memoryStats.played) + score) / (memoryStats.played + 1),
          perfectMatches: memoryStats.perfectMatches + (gameResults.moves === gameResults.pairs ? 1 : 0)
        };
        break;
        
      case 'pattern-game':
        const patternStats = updatedGameStats.patternGames;
        updatedGameStats.patternGames = {
          played: patternStats.played + 1,
          averageScore: ((patternStats.averageScore * patternStats.played) + score) / (patternStats.played + 1),
          perfectPatterns: patternStats.perfectPatterns + (score === 100 ? 1 : 0)
        };
        break;
    }

    // Award points for game performance
    const pointsEarned = calculateGamePoints(gameType, score);
    const updatedMetrics = {
      ...enhancedProgress.learningMetrics,
      totalPoints: enhancedProgress.learningMetrics.totalPoints + pointsEarned
    };

    const newProgress = {
      ...enhancedProgress,
      learningActivities: {
        ...enhancedProgress.learningActivities,
        [activityId]: activityUpdate
      },
      gameStats: updatedGameStats,
      learningMetrics: updatedMetrics
    };

    saveEnhancedProgress(newProgress);
    checkAchievements(newProgress);
  };

  const updateLearningMetrics = (category, difficulty) => {
    const today = new Date().toDateString();
    const lastLearning = enhancedProgress.learningMetrics.lastLearningDate 
      ? new Date(enhancedProgress.learningMetrics.lastLearningDate).toDateString()
      : null;

    let updatedStreak = enhancedProgress.learningMetrics.learningStreak;
    
    // Update learning streak
    if (lastLearning !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasLearningYesterday = lastLearning === yesterday.toDateString();
      
      updatedStreak = wasLearningYesterday ? updatedStreak + 1 : 1;
    }

    // Track categories explored
    const categoriesExplored = [...enhancedProgress.learningMetrics.categoriesExplored];
    if (!categoriesExplored.includes(category)) {
      categoriesExplored.push(category);
    }

    // Track difficulty levels completed
    const difficultyLevelsCompleted = [...enhancedProgress.learningMetrics.difficultyLevelsCompleted];
    if (!difficultyLevelsCompleted.includes(difficulty)) {
      difficultyLevelsCompleted.push(difficulty);
    }

    return {
      ...enhancedProgress.learningMetrics,
      totalPoints: enhancedProgress.learningMetrics.totalPoints + 10, // Base points for activity completion
      learningStreak: updatedStreak,
      longestLearningStreak: Math.max(updatedStreak, enhancedProgress.learningMetrics.longestLearningStreak),
      lastLearningDate: new Date().toISOString(),
      categoriesExplored,
      difficultyLevelsCompleted
    };
  };

  const calculateGamePoints = (gameType, score) => {
    const basePoints = {
      'vocabulary-matching': 5,
      'comprehension-quiz': 8,
      'memory-matching': 6,
      'pattern-game': 7
    };
    
    const base = basePoints[gameType] || 5;
    
    // Bonus points for high performance
    if (score >= 100) return base * 3; // Perfect score
    if (score >= 90) return base * 2;  // Excellent score  
    if (score >= 75) return Math.round(base * 1.5); // Good score
    return base; // Participation points
  };

  const checkAchievements = (currentProgress) => {
    const newAchievements = [];
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      const isAlreadyUnlocked = currentProgress.achievements.unlocked.some(
        unlock => unlock.achievementId === achievement.id
      );
      
      if (!isAlreadyUnlocked && checkAchievementRequirement(achievement, currentProgress)) {
        newAchievements.push({
          achievementId: achievement.id,
          unlockedAt: new Date().toISOString(),
          ...achievement
        });
      }
    });

    if (newAchievements.length > 0) {
      const updatedAchievements = {
        ...currentProgress.achievements,
        unlocked: [...currentProgress.achievements.unlocked, ...newAchievements]
      };

      // Award points for achievements
      const achievementPoints = newAchievements.reduce((total, achievement) => 
        total + achievement.reward.points, 0);
      
      const updatedMetrics = {
        ...currentProgress.learningMetrics,
        totalPoints: currentProgress.learningMetrics.totalPoints + achievementPoints
      };

      saveEnhancedProgress({
        ...currentProgress,
        achievements: updatedAchievements,
        learningMetrics: updatedMetrics
      });

      // Trigger achievement notifications (could be implemented with React Native notifications)
      newAchievements.forEach(achievement => {
        console.log(`🎉 Achievement Unlocked: ${achievement.title}`);
      });
    }
  };

  const checkAchievementRequirement = (achievement, progress) => {
    const { requirement } = achievement;
    
    switch (requirement.type) {
      case 'activities_completed':
        return Object.keys(progress.learningActivities).length >= requirement.value;
        
      case 'categories_explored':
        return progress.learningMetrics.categoriesExplored.length >= requirement.value;
        
      case 'games_played':
        const totalGamesPlayed = Object.values(progress.gameStats).reduce(
          (total, stats) => total + (stats.played || 0), 0);
        return totalGamesPlayed >= requirement.value;
        
      case 'vocabulary_high_scores':
        return progress.gameStats.vocabularyGames.highScores >= requirement.value;
        
      case 'quiz_perfect_scores':
        return progress.gameStats.comprehensionQuizzes.perfectScores >= requirement.value;
        
      case 'learning_streak':
        return progress.learningMetrics.learningStreak >= requirement.value;
        
      case 'all_difficulty_levels':
        return progress.learningMetrics.difficultyLevelsCompleted.length >= requirement.value;
        
      case 'perfect_week':
        // Implementation would track daily goals met for 7 consecutive days
        return false; // Placeholder
        
      default:
        return false;
    }
  };

  // Computed values
  const currentLevel = useMemo(() => {
    const points = enhancedProgress.learningMetrics.totalPoints;
    return LEARNING_LEVELS.find(level => points >= level.minPoints && points <= level.maxPoints) || LEARNING_LEVELS[0];
  }, [enhancedProgress.learningMetrics.totalPoints]);

  const progressToNextLevel = useMemo(() => {
    const currentPoints = enhancedProgress.learningMetrics.totalPoints;
    const nextLevel = LEARNING_LEVELS.find(level => level.minPoints > currentPoints);
    
    if (!nextLevel) return 100; // Max level reached
    
    const pointsNeeded = nextLevel.minPoints - currentPoints;
    const levelRange = nextLevel.minPoints - currentLevel.minPoints;
    const progressPercentage = ((levelRange - pointsNeeded) / levelRange) * 100;
    
    return Math.max(0, Math.min(100, progressPercentage));
  }, [enhancedProgress.learningMetrics.totalPoints, currentLevel]);

  const getActivityProgress = (activityId) => {
    return enhancedProgress.learningActivities[activityId] || null;
  };

  const getRecentAchievements = (limit = 5) => {
    return enhancedProgress.achievements.unlocked
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      .slice(0, limit);
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayActivities = Object.values(enhancedProgress.learningActivities)
      .filter(activity => activity.completedAt && new Date(activity.completedAt).toDateString() === today);
    
    return {
      activitiesCompleted: todayActivities.length,
      goalProgress: (todayActivities.length / enhancedProgress.preferences.dailyLearningGoal) * 100,
      pointsEarned: todayActivities.reduce((total, activity) => 
        total + (activity.gameResults?.reduce((sum, game) => sum + (game.details.score || 0), 0) || 0), 0)
    };
  };

  return {
    ...baseProgress, // Include all base progress functionality
    enhancedProgress,
    loading: loading || baseProgress.loading,
    
    // Enhanced functionality
    updateActivityProgress,
    updateGameResults,
    getActivityProgress,
    getRecentAchievements,
    getTodayStats,
    
    // Computed values
    currentLevel,
    progressToNextLevel,
    achievements: Object.values(ACHIEVEMENTS),
    unlockedAchievements: enhancedProgress.achievements.unlocked,
    
    // Save function
    saveEnhancedProgress
  };
};

export default useEnhancedProgress;