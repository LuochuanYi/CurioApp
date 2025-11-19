// Game Activity Manager - Integrates interactive games into learning activities
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert
} from 'react-native';

import {
  VocabularyMatchingGame,
  ComprehensionQuiz,
  MemoryMatchingGame,
  PatternGame
} from './InteractiveLearningGames';

import { useDynamicTranslation } from '../hooks/useDynamicTranslation';
import { useUserProgress } from '../hooks/useUserProgress';

// 🎮 Main Game Activity Manager Component
export const GameActivityManager = ({ 
  activity, 
  onGameComplete, 
  onExitGame, 
  language = 'en' 
}) => {
  const { translateContent } = useDynamicTranslation();
  const { updateActivityProgress, getActivityProgress } = useUserProgress();
  const [currentGame, setCurrentGame] = useState(null);
  const [gameResults, setGameResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🎯 Game Generation Based on Activity Type
  const generateGameFromActivity = (activity) => {
    const games = [];

    // Generate vocabulary games for language-related activities
    if (activity.category === 'Language Tips' || activity.tags?.includes('vocabulary')) {
      const vocabularyWords = extractVocabularyFromActivity(activity);
      if (vocabularyWords.length >= 3) {
        games.push({
          type: 'vocabulary-matching',
          title: '🎯 Vocabulary Challenge',
          data: vocabularyWords,
          difficulty: activity.difficulty || 'beginner'
        });
      }
    }

    // Generate comprehension quiz for any activity with story content
    if (activity.instructions && activity.instructions.length > 2) {
      const quizQuestions = generateComprehensionQuestions(activity);
      if (quizQuestions.length >= 2) {
        games.push({
          type: 'comprehension-quiz',
          title: '🧩 Understanding Check',
          data: quizQuestions,
          storyContext: activity.shortDescription || activity.instructions.slice(0, 2).join(' ')
        });
      }
    }

    // Generate memory games for creative/visual activities
    if (activity.category === 'Arts & Crafts' || activity.tags?.includes('creative')) {
      const memoryItems = generateMemoryPairs(activity);
      if (memoryItems.length >= 4) {
        games.push({
          type: 'memory-matching',
          title: '🎮 Memory Challenge',
          data: memoryItems
        });
      }
    }

    // Generate pattern games for science/logic activities
    if (activity.category === 'Science & Nature' || activity.tags?.includes('logic')) {
      const patterns = generatePatternSequences(activity);
      if (patterns.length >= 2) {
        games.push({
          type: 'pattern-game',
          title: '🎯 Pattern Master',
          data: patterns,
          difficulty: activity.difficulty || 'beginner'
        });
      }
    }

    return games;
  };

  // 📚 Extract vocabulary from activity content
  const extractVocabularyFromActivity = (activity) => {
    const vocabularyKeywords = {
      'Language Tips': [
        { word: 'Hello', definition: 'A greeting used when meeting someone' },
        { word: 'Please', definition: 'Used when asking for something politely' },
        { word: 'Thank you', definition: 'Used to express gratitude' },
        { word: 'Excuse me', definition: 'Used to get attention or apologize' },
        { word: 'Goodbye', definition: 'A farewell greeting' }
      ],
      'Science & Nature': [
        { word: 'Photosynthesis', definition: 'How plants make food using sunlight' },
        { word: 'Ecosystem', definition: 'A community of living things and their environment' },
        { word: 'Gravity', definition: 'The force that pulls objects toward Earth' },
        { word: 'Evaporation', definition: 'When water turns into vapor' },
        { word: 'Habitat', definition: 'The natural home of an animal or plant' }
      ],
      'Feelings': [
        { word: 'Happy', definition: 'Feeling joy or pleasure' },
        { word: 'Sad', definition: 'Feeling unhappy or sorrowful' },
        { word: 'Excited', definition: 'Feeling very enthusiastic and eager' },
        { word: 'Nervous', definition: 'Feeling worried or anxious' },
        { word: 'Proud', definition: 'Feeling pleased with an achievement' }
      ]
    };

    const categoryWords = vocabularyKeywords[activity.category] || [];
    
    // Add activity-specific vocabulary if available
    if (activity.vocabulary) {
      return [...activity.vocabulary, ...categoryWords.slice(0, 3)];
    }
    
    return categoryWords.slice(0, Math.min(5, categoryWords.length));
  };

  // 🧩 Generate comprehension questions
  const generateComprehensionQuestions = (activity) => {
    const questions = [];

    // Question about activity purpose
    if (activity.learningGoals && activity.learningGoals.length > 0) {
      questions.push({
        question: `What is the main goal of "${activity.title}"?`,
        options: [
          activity.learningGoals[0],
          'To have fun without learning',
          'To compete with others',
          'To finish as quickly as possible'
        ],
        correctAnswer: 0,
        explanation: `The main goal is: ${activity.learningGoals[0]}`
      });
    }

    // Question about materials needed
    if (activity.materials && activity.materials.length > 2) {
      const correctMaterial = activity.materials[0];
      const wrongMaterials = ['A computer', 'A bicycle', 'A telephone'];
      
      questions.push({
        question: `Which material do you need for "${activity.title}"?`,
        options: [
          correctMaterial,
          ...wrongMaterials.slice(0, 3)
        ],
        correctAnswer: 0,
        explanation: `You need ${correctMaterial} for this activity.`
      });
    }

    // Question about safety or important steps
    if (activity.safetyTips && activity.safetyTips.length > 0) {
      questions.push({
        question: 'What should you remember for safety?',
        options: [
          activity.safetyTips[0],
          'Safety is not important',
          'Go as fast as possible',
          'Don\'t ask for help'
        ],
        correctAnswer: 0,
        explanation: `Important safety tip: ${activity.safetyTips[0]}`
      });
    }

    // Question about age appropriateness
    if (activity.ageRange) {
      const [minAge] = activity.ageRange.split('-');
      questions.push({
        question: `This activity is best for children who are:`,
        options: [
          `${minAge} years old or older`,
          'Any age without help',
          'Only teenagers',
          'Only adults'
        ],
        correctAnswer: 0,
        explanation: `This activity is designed for children ${activity.ageRange} years old.`
      });
    }

    return questions.slice(0, 4); // Limit to 4 questions max
  };

  // 🎮 Generate memory game pairs
  const generateMemoryPairs = (activity) => {
    const memoryData = {
      'Arts & Crafts': [
        { first: '🎨', second: 'Paint' },
        { first: '✂️', second: 'Scissors' },
        { first: '📄', second: 'Paper' },
        { first: '🖍️', second: 'Crayon' },
        { first: '🖌️', second: 'Brush' }
      ],
      'Science & Nature': [
        { first: '🌱', second: 'Seed' },
        { first: '🌞', second: 'Sun' },
        { first: '💧', second: 'Water' },
        { first: '🌍', second: 'Earth' },
        { first: '🔬', second: 'Microscope' }
      ],
      'default': [
        { first: '👁️', second: 'See' },
        { first: '👂', second: 'Hear' },
        { first: '👃', second: 'Smell' },
        { first: '👅', second: 'Taste' },
        { first: '✋', second: 'Touch' }
      ]
    };

    const pairs = memoryData[activity.category] || memoryData['default'];
    return pairs.slice(0, Math.min(6, pairs.length));
  };

  // 🎯 Generate pattern sequences
  const generatePatternSequences = (activity) => {
    const patterns = [
      {
        sequence: ['🔴', '🟢', '🔴', '🟢'],
        items: ['🔴', '🟢', '🔵', '🟡'],
        difficulty: 'beginner'
      },
      {
        sequence: ['⭐', '🌙', '⭐', '🌙', '⭐'],
        items: ['⭐', '🌙', '☀️', '🌍'],
        difficulty: 'intermediate'
      },
      {
        sequence: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣', '3️⃣'],
        items: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
        difficulty: 'advanced'
      }
    ];

    const difficultyLevel = activity.difficulty || 'beginner';
    return patterns.filter(p => 
      p.difficulty === difficultyLevel || difficultyLevel === 'beginner'
    );
  };

  // 🎉 Handle game completion
  const handleGameComplete = (gameType, results) => {
    const gameResult = {
      gameType,
      score: results.score || 0,
      completedAt: new Date().toISOString(),
      details: results
    };

    const updatedResults = [...gameResults, gameResult];
    setGameResults(updatedResults);

    // Update user progress
    updateActivityProgress(activity.id, {
      gameResults: updatedResults,
      lastPlayed: new Date().toISOString(),
      bestScore: Math.max(
        results.score || 0,
        getActivityProgress(activity.id)?.bestScore || 0
      )
    });

    // Show completion feedback
    Alert.alert(
      '🎉 Game Complete!',
      `Great job! You scored ${results.score}% on ${gameType}. Would you like to try another game?`,
      [
        { text: 'Play Another', onPress: () => setCurrentGame(null) },
        { text: 'Finish', onPress: () => handleFinishGames() }
      ]
    );
  };

  const handleFinishGames = () => {
    setShowResults(true);
    
    // Calculate overall performance
    const totalScore = gameResults.reduce((sum, result) => sum + (result.score || 0), 0);
    const averageScore = gameResults.length > 0 ? Math.round(totalScore / gameResults.length) : 0;

    setTimeout(() => {
      onGameComplete({
        gamesPlayed: gameResults.length,
        averageScore,
        results: gameResults,
        activityId: activity.id
      });
    }, 2000);
  };

  // Render game selection screen
  const renderGameSelection = () => {
    const availableGames = generateGameFromActivity(activity);
    
    if (availableGames.length === 0) {
      return (
        <View style={styles.noGamesContainer}>
          <Text style={styles.noGamesTitle}>🎮 No Interactive Games Available</Text>
          <Text style={styles.noGamesText}>
            This activity doesn't have interactive games yet, but you can still learn by following the activity steps!
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={onExitGame}>
            <Text style={styles.backButtonText}>Back to Activity</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onExitGame}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🎮 Interactive Learning Games</Text>
          <Text style={styles.activityTitle}>For: {activity.title}</Text>
        </View>

        <ScrollView style={styles.gamesList} showsVerticalScrollIndicator={false}>
          <Text style={styles.instructionsText}>
            Choose a game to practice what you've learned! 🌟
          </Text>
          
          {availableGames.map((game, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gameCard}
              onPress={() => setCurrentGame(game)}
            >
              <Text style={styles.gameCardTitle}>{game.title}</Text>
              <Text style={styles.gameCardDescription}>
                {getGameDescription(game.type)}
              </Text>
              <View style={styles.gameCardFooter}>
                <Text style={styles.difficultyBadge}>
                  {game.difficulty || 'beginner'}
                </Text>
                <Text style={styles.playButtonText}>Play →</Text>
              </View>
            </TouchableOpacity>
          ))}

          {gameResults.length > 0 && (
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>🏆 Your Progress</Text>
              {gameResults.map((result, index) => (
                <View key={index} style={styles.progressItem}>
                  <Text style={styles.progressText}>
                    {result.gameType}: {result.score}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishGames}
          >
            <Text style={styles.finishButtonText}>
              {gameResults.length > 0 ? 'Finish Games' : 'Back to Activity'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  };

  // Render current game
  const renderCurrentGame = () => {
    if (!currentGame) return null;

    const gameProps = {
      onComplete: (results) => handleGameComplete(currentGame.type, results),
      difficulty: currentGame.difficulty,
      ...currentGame.data && { [getGameDataProp(currentGame.type)]: currentGame.data }
    };

    // Add story context for quiz games
    if (currentGame.type === 'comprehension-quiz' && currentGame.storyContext) {
      gameProps.storyContext = currentGame.storyContext;
    }

    switch (currentGame.type) {
      case 'vocabulary-matching':
        return (
          <VocabularyMatchingGame 
            words={currentGame.data} 
            {...gameProps}
          />
        );
        
      case 'comprehension-quiz':
        return (
          <ComprehensionQuiz 
            questions={currentGame.data}
            {...gameProps}
          />
        );
        
      case 'memory-matching':
        return (
          <MemoryMatchingGame 
            items={currentGame.data}
            {...gameProps}
          />
        );
        
      case 'pattern-game':
        return (
          <PatternGame 
            patterns={currentGame.data}
            {...gameProps}
          />
        );
        
      default:
        return null;
    }
  };

  // Helper functions
  const getGameDescription = (gameType) => {
    const descriptions = {
      'vocabulary-matching': 'Match words with their meanings to test your vocabulary!',
      'comprehension-quiz': 'Answer questions about what you learned in this activity.',
      'memory-matching': 'Find matching pairs to exercise your memory skills.',
      'pattern-game': 'Remember and repeat patterns to boost your attention.'
    };
    
    return descriptions[gameType] || 'Test your knowledge with this fun game!';
  };

  const getGameDataProp = (gameType) => {
    const props = {
      'vocabulary-matching': 'words',
      'comprehension-quiz': 'questions',
      'memory-matching': 'items',
      'pattern-game': 'patterns'
    };
    
    return props[gameType] || 'data';
  };

  // Render results screen
  if (showResults) {
    const totalScore = gameResults.reduce((sum, result) => sum + (result.score || 0), 0);
    const averageScore = gameResults.length > 0 ? Math.round(totalScore / gameResults.length) : 0;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>🎉 Games Complete!</Text>
        <Text style={styles.resultsScore}>Average Score: {averageScore}%</Text>
        <Text style={styles.resultsGames}>Games Played: {gameResults.length}</Text>
        
        <View style={styles.resultsList}>
          {gameResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultGameType}>{result.gameType}</Text>
              <Text style={styles.resultScore}>{result.score}%</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.encouragementText}>
          {averageScore >= 80 ? "Excellent work! You're a learning champion! 🌟" :
           averageScore >= 60 ? "Good job! Keep practicing to improve! 👍" :
           "Great effort! Practice makes perfect! 📚"}
        </Text>
      </View>
    );
  }

  return currentGame ? renderCurrentGame() : renderGameSelection();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  header: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  
  activityTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  
  gamesList: {
    flex: 1,
    padding: 20,
  },
  
  instructionsText: {
    fontSize: 18,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  gameCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  
  gameCardDescription: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
    marginBottom: 16,
  },
  
  gameCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  difficultyBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  
  progressSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
  },
  
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 12,
  },
  
  progressItem: {
    marginBottom: 8,
  },
  
  progressText: {
    fontSize: 16,
    color: '#495057',
  },
  
  finishButton: {
    backgroundColor: '#6c757d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  noGamesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  
  noGamesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  noGamesText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  
  backButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 16,
  },
  
  resultsScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  
  resultsGames: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 24,
  },
  
  resultsList: {
    width: '100%',
    marginBottom: 24,
  },
  
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  
  resultGameType: {
    fontSize: 16,
    color: '#495057',
  },
  
  resultScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  
  encouragementText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
    textAlign: 'center',
  },
});

export default GameActivityManager;