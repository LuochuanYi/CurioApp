import { useState, useEffect } from 'react';

// User progress data structure
const defaultUserProgress = {
  stories: {
    // [storyId]: {
    //   currentPosition: 0,        // For "continue reading"  
    //   completionPercentage: 0,   // 0-100
    //   rating: null,              // User rating 1-5
    //   lastAccessed: null,        // Date
    //   completedSessions: 0,      // Number of times completed
    //   isFavorite: false
    // }
  },
  songs: {
    // [songId]: {
    //   playCount: 0,              // Number of times played
    //   lastPlayed: null,          // Date
    //   isFavorite: false,         // User marked as favorite
    //   signLanguageProgress: 'beginner' // beginner/intermediate/advanced
    // }
  },
  preferences: {
    favoriteCategories: [],        // Array of preferred story/song categories
    preferredDifficulty: 'beginner', // beginner/intermediate/advanced
    bedtimeRoutineEnabled: false,   // Parent setting
    dailyGoalMinutes: 15,          // Daily engagement goal
    parentalControls: {
      maxSessionTime: 30,          // Minutes
      bedtimeHoursStart: 19,       // 7 PM
      bedtimeHoursEnd: 7           // 7 AM
    }
  },
  stats: {
    totalStoriesRead: 0,
    totalSongsPlayed: 0,
    currentStreak: 0,              // Consecutive days with activity
    longestStreak: 0,
    lastActiveDate: null,
    categoriesExplored: [],
    totalEngagementMinutes: 0
  }
};

// Local storage key
const USER_PROGRESS_KEY = 'curioapp_user_progress';

// Hook for managing user progress
export const useUserProgress = () => {
  const [userProgress, setUserProgress] = useState(defaultUserProgress);
  const [loading, setLoading] = useState(true);

  // Load user progress from storage
  useEffect(() => {
    console.log('useUserProgress: Loading user progress...');
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      console.log('loadUserProgress: Starting to load...');
      setLoading(true);
      
      // For web environment, use localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        console.log('loadUserProgress: Using localStorage');
        const stored = localStorage.getItem(USER_PROGRESS_KEY);
        if (stored) {
          console.log('loadUserProgress: Found stored data');
          const parsedData = JSON.parse(stored);
          setUserProgress({ ...defaultUserProgress, ...parsedData });
        } else {
          console.log('loadUserProgress: No stored data, using defaults');
        }
      } else {
        console.log('loadUserProgress: No localStorage available');
      }
      // For React Native, would use AsyncStorage here
      // const stored = await AsyncStorage.getItem(USER_PROGRESS_KEY);
      
    } catch (error) {
      console.error('Failed to load user progress:', error);
    } finally {
      console.log('loadUserProgress: Finished loading');
      setLoading(false);
    }
  };

  // Save user progress to storage
  const saveUserProgress = async (newProgress) => {
    try {
      const progressToSave = { ...userProgress, ...newProgress };
      
      // For web environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressToSave));
      }
      // For React Native, would use AsyncStorage here
      // await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressToSave));
      
      setUserProgress(progressToSave);
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  };

  // Story progress functions
  const updateStoryProgress = (storyId, progressData) => {
    const updatedStories = {
      ...userProgress.stories,
      [storyId]: {
        ...userProgress.stories[storyId],
        ...progressData,
        lastAccessed: new Date().toISOString()
      }
    };

    const newProgress = {
      ...userProgress,
      stories: updatedStories,
      stats: {
        ...userProgress.stats,
        lastActiveDate: new Date().toISOString()
      }
    };

    saveUserProgress(newProgress);
  };

  const markStoryComplete = (storyId) => {
    const currentStory = userProgress.stories[storyId] || {};
    updateStoryProgress(storyId, {
      completionPercentage: 100,
      completedSessions: (currentStory.completedSessions || 0) + 1
    });

    // Update total stats
    const newStats = {
      ...userProgress.stats,
      totalStoriesRead: userProgress.stats.totalStoriesRead + 1
    };
    saveUserProgress({ stats: newStats });
  };

  const setStoryFavorite = (storyId, isFavorite) => {
    updateStoryProgress(storyId, { isFavorite });
  };

  // Song progress functions  
  const updateSongProgress = (songId, progressData) => {
    const updatedSongs = {
      ...userProgress.songs,
      [songId]: {
        ...userProgress.songs[songId],
        ...progressData,
        lastPlayed: new Date().toISOString()
      }
    };

    const newProgress = {
      ...userProgress,
      songs: updatedSongs,
      stats: {
        ...userProgress.stats,
        lastActiveDate: new Date().toISOString()
      }
    };

    saveUserProgress(newProgress);
  };

  const incrementSongPlayCount = (songId) => {
    const currentSong = userProgress.songs[songId] || {};
    updateSongProgress(songId, {
      playCount: (currentSong.playCount || 0) + 1
    });

    // Update total stats
    const newStats = {
      ...userProgress.stats,
      totalSongsPlayed: userProgress.stats.totalSongsPlayed + 1
    };
    saveUserProgress({ stats: newStats });
  };

  const setSongFavorite = (songId, isFavorite) => {
    updateSongProgress(songId, { isFavorite });
  };

  // Utility functions
  const getRecentStories = (limit = 3) => {
    const storyEntries = Object.entries(userProgress.stories);
    return storyEntries
      .filter(([_, progress]) => progress.lastAccessed)
      .sort(([_, a], [__, b]) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
      .slice(0, limit)
      .map(([storyId, progress]) => ({ storyId, ...progress }));
  };

  const getRecentSongs = (limit = 3) => {
    const songEntries = Object.entries(userProgress.songs);
    return songEntries
      .filter(([_, progress]) => progress.lastPlayed)
      .sort(([_, a], [__, b]) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
      .slice(0, limit)
      .map(([songId, progress]) => ({ songId, ...progress }));
  };

  const getFavoriteStories = () => {
    return Object.entries(userProgress.stories)
      .filter(([_, progress]) => progress.isFavorite)
      .map(([storyId, progress]) => ({ storyId, ...progress }));
  };

  const getFavoriteSongs = () => {
    return Object.entries(userProgress.songs)
      .filter(([_, progress]) => progress.isFavorite)
      .map(([songId, progress]) => ({ songId, ...progress }));
  };

  const getInProgressStories = () => {
    return Object.entries(userProgress.stories)
      .filter(([_, progress]) => progress.completionPercentage > 0 && progress.completionPercentage < 100)
      .map(([storyId, progress]) => ({ storyId, ...progress }));
  };

  const updateDailyStreak = () => {
    const today = new Date().toDateString();
    const lastActive = userProgress.stats.lastActiveDate 
      ? new Date(userProgress.stats.lastActiveDate).toDateString() 
      : null;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasActiveYesterday = lastActive === yesterday.toDateString();
      
      const newStreak = wasActiveYesterday ? userProgress.stats.currentStreak + 1 : 1;
      const longestStreak = Math.max(newStreak, userProgress.stats.longestStreak);
      
      const newStats = {
        ...userProgress.stats,
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: new Date().toISOString()
      };
      
      saveUserProgress({ stats: newStats });
    }
  };

  // Check if it's bedtime based on preferences
  const isBedtime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const { bedtimeHoursStart, bedtimeHoursEnd } = userProgress.preferences.parentalControls;
    
    // Handle overnight bedtime (e.g., 7 PM to 7 AM)
    if (bedtimeHoursStart > bedtimeHoursEnd) {
      return currentHour >= bedtimeHoursStart || currentHour < bedtimeHoursEnd;
    }
    // Handle same-day bedtime (rare, but possible)
    return currentHour >= bedtimeHoursStart && currentHour < bedtimeHoursEnd;
  };

  return {
    userProgress,
    loading,
    
    // Story functions
    updateStoryProgress,
    markStoryComplete, 
    setStoryFavorite,
    
    // Song functions
    updateSongProgress,
    incrementSongPlayCount,
    setSongFavorite,
    
    // Utility functions
    getRecentStories,
    getRecentSongs,
    getFavoriteStories,
    getFavoriteSongs,
    getInProgressStories,
    updateDailyStreak,
    isBedtime,
    
    // Raw save function for preferences updates
    saveUserProgress
  };
};

export default useUserProgress;