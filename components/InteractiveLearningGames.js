// Interactive Learning Game Components
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// 🎯 Vocabulary Matching Game Component
export const VocabularyMatchingGame = ({ words, onComplete, difficulty = 'beginner' }) => {
  const [shuffledWords] = useState(() => shuffleArray([...words]));
  const [shuffledDefinitions] = useState(() => shuffleArray(words.map(w => w.definition)));
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [matches, setMatches] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);

  const handleWordPress = (word, index) => {
    setSelectedWord({ word, index });
  };

  const handleDefinitionPress = (definition, index) => {
    setSelectedDefinition({ definition, index });
    
    if (selectedWord) {
      checkMatch(selectedWord.word, definition);
    }
  };

  const checkMatch = (word, definition) => {
    setAttempts(attempts + 1);
    
    const isCorrect = word.definition === definition;
    
    if (isCorrect) {
      setMatches([...matches, { word: word.word, definition }]);
      setShowFeedback({ type: 'correct', message: `Great! "${word.word}" matches perfectly! 🎉` });
      
      // Check if game is complete
      if (matches.length + 1 === words.length) {
        setTimeout(() => {
          onComplete({
            score: Math.max(100 - (attempts - words.length) * 10, 50),
            attempts,
            correctMatches: matches.length + 1
          });
        }, 1500);
      }
    } else {
      setShowFeedback({ 
        type: 'incorrect', 
        message: `Not quite right. Try again! 🤔`,
        correct: `"${word.word}" means: ${word.definition}`
      });
    }
    
    // Reset selections
    setSelectedWord(null);
    setSelectedDefinition(null);
    
    // Clear feedback after delay
    setTimeout(() => setShowFeedback(null), 2500);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const isWordMatched = (word) => matches.some(match => match.word === word);
  const isDefinitionMatched = (definition) => matches.some(match => match.definition === definition);

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>🎯 Vocabulary Matching</Text>
        <Text style={styles.gameProgress}>
          {matches.length} / {words.length} matched • {attempts} attempts
        </Text>
      </View>

      {showFeedback && (
        <View style={[styles.feedback, 
          showFeedback.type === 'correct' ? styles.correctFeedback : styles.incorrectFeedback
        ]}>
          <Text style={styles.feedbackText}>{showFeedback.message}</Text>
          {showFeedback.correct && (
            <Text style={styles.correctAnswerText}>{showFeedback.correct}</Text>
          )}
        </View>
      )}

      <View style={styles.matchingGameContainer}>
        <View style={styles.wordsColumn}>
          <Text style={styles.columnTitle}>Words</Text>
          {shuffledWords.map((word, index) => (
            <TouchableOpacity
              key={`word-${index}`}
              style={[
                styles.matchingCard,
                selectedWord?.index === index && styles.selectedCard,
                isWordMatched(word.word) && styles.matchedCard
              ]}
              onPress={() => !isWordMatched(word.word) && handleWordPress(word, index)}
              disabled={isWordMatched(word.word)}
            >
              <Text style={[
                styles.matchingText,
                isWordMatched(word.word) && styles.matchedText
              ]}>
                {word.word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.connectorsColumn}>
          {matches.map((match, index) => (
            <View key={`connector-${index}`} style={styles.connector} />
          ))}
        </View>

        <View style={styles.definitionsColumn}>
          <Text style={styles.columnTitle}>Meanings</Text>
          {shuffledDefinitions.map((definition, index) => (
            <TouchableOpacity
              key={`def-${index}`}
              style={[
                styles.matchingCard,
                selectedDefinition?.index === index && styles.selectedCard,
                isDefinitionMatched(definition) && styles.matchedCard
              ]}
              onPress={() => !isDefinitionMatched(definition) && handleDefinitionPress(definition, index)}
              disabled={isDefinitionMatched(definition)}
            >
              <Text style={[
                styles.matchingText,
                isDefinitionMatched(definition) && styles.matchedText
              ]}>
                {definition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// 🧩 Comprehension Quiz Component
export const ComprehensionQuiz = ({ questions, onComplete, onClose, storyContext = null }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({}); // Change to object to track by question index
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentQuestion];

  // Effect to restore state when navigating to a previously answered question
  useEffect(() => {
    const currentAnswer = answers[currentQuestion];
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer.selectedAnswer);
      setShowExplanation(true);
    } else {
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentQuestion, answers]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    const newAnswer = {
      questionIndex: currentQuestion,
      selectedAnswer,
      isCorrect,
      timeTaken: Date.now() // Could track actual time
    };
    
    setAnswers({...answers, [currentQuestion]: newAnswer});
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete
      setQuizComplete(true);
      const answersArray = Object.values(answers);
      const correctAnswers = answersArray.filter(a => a.isCorrect).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      setTimeout(() => {
        onComplete({
          score,
          correctAnswers,
          totalQuestions: questions.length,
          answers: answersArray
        });
      }, 1000);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // State will be restored by useEffect
    }
  };

  if (quizComplete) {
    const answersArray = Object.values(answers);
    const correctAnswers = answersArray.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <View style={styles.gameContainer}>
        {/* Fixed Header */}
        <View style={styles.gameHeader}>
          <View style={styles.headerTop}>
            <Text style={styles.gameTitle}>🎉 Quiz Results</Text>
            {onClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.gameProgress}>Final Score: {score}%</Text>
        </View>

        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.quizCompleteContainer}>
            <Text style={styles.scoreText}>{correctAnswers} out of {questions.length} correct</Text>
            
            <View style={styles.performanceIndicator}>
              {score >= 80 ? (
                <Text style={styles.excellentPerformance}>Excellent work! 🌟</Text>
              ) : score >= 60 ? (
                <Text style={styles.goodPerformance}>Good job! Keep practicing! 👍</Text>
              ) : (
                <Text style={styles.needsPractice}>Keep practicing to improve! 📚</Text>
              )}
            </View>

            {/* Question Review */}
            <View style={styles.questionReview}>
              <Text style={styles.reviewTitle}>📋 Question Review</Text>
              {questions.map((question, qIndex) => {
                const userAnswer = answers[qIndex];
                const isCorrect = userAnswer?.isCorrect || false;
                
                return (
                  <View key={qIndex} style={styles.reviewQuestion}>
                    <Text style={styles.reviewQuestionText}>
                      {qIndex + 1}. {question.question}
                    </Text>
                    
                    <View style={styles.reviewAnswers}>
                      {question.options.map((option, optIndex) => {
                        const isUserChoice = userAnswer?.selectedAnswer === optIndex;
                        const isCorrectAnswer = optIndex === question.correctAnswer;
                        
                        return (
                          <View
                            key={optIndex}
                            style={[
                              styles.reviewAnswer,
                              isCorrectAnswer && styles.correctReviewAnswer,
                              isUserChoice && !isCorrectAnswer && styles.incorrectReviewAnswer,
                              isUserChoice && isCorrectAnswer && styles.userCorrectAnswer
                            ]}
                          >
                            <Text style={[
                              styles.reviewAnswerLetter,
                              isCorrectAnswer && styles.correctAnswerText,
                              isUserChoice && !isCorrectAnswer && { color: '#dc3545' }
                            ]}>
                              {String.fromCharCode(65 + optIndex)}
                            </Text>
                            <Text style={[
                              styles.reviewAnswerText,
                              isCorrectAnswer && styles.correctAnswerText,
                              isUserChoice && !isCorrectAnswer && { color: '#dc3545' }
                            ]}>
                              {option}
                            </Text>
                            {isUserChoice && (
                              <Text style={styles.reviewAnswerIcon}>
                                {isCorrectAnswer ? '✓' : '✗'}
                              </Text>
                            )}
                            {isCorrectAnswer && !isUserChoice && (
                              <Text style={styles.reviewAnswerIcon}>✓</Text>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={onClose}>
            <Text style={styles.navButtonText}>Back to Activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      {/* Fixed Header */}
      <View style={styles.gameHeader}>
        <View style={styles.headerTop}>
          <Text style={styles.gameTitle}>🧩 Comprehension Quiz</Text>
          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.gameProgress}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {storyContext && currentQuestion === 0 && (
          <View style={styles.storyContext}>
            <Text style={styles.storyTitle}>📖 Story Recap</Text>
            <Text style={styles.storyText}>{storyContext}</Text>
          </View>
        )}

        <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        
        <View style={styles.answersContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerOption,
                selectedAnswer === index && styles.selectedAnswer,
                showExplanation && index === question.correctAnswer && styles.correctAnswer,
                showExplanation && selectedAnswer === index && index !== question.correctAnswer && styles.incorrectAnswer
              ]}
              onPress={() => !showExplanation && handleAnswerSelect(index)}
              disabled={showExplanation}
            >
              <Text style={[
                styles.answerLetter,
                selectedAnswer === index && styles.selectedAnswerText,
                showExplanation && index === question.correctAnswer && styles.correctAnswerText
              ]}>
                {String.fromCharCode(65 + index)}
              </Text>
              <Text style={[
                styles.answerText,
                selectedAnswer === index && styles.selectedAnswerText,
                showExplanation && index === question.correctAnswer && styles.correctAnswerText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>
              {selectedAnswer === question.correctAnswer ? "Correct! 🎉" : "Not quite right 🤔"}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}

          {selectedAnswer !== null && !showExplanation && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAnswer}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Fixed Navigation at Bottom */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]} 
          onPress={handlePreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleNextQuestion}
        >
          <Text style={styles.navButtonText}>
            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish Quiz'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🎮 Interactive Memory Game Component
export const MemoryMatchingGame = ({ items, onComplete, gameType = 'pictures' }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [items]);

  const initializeGame = () => {
    // Create pairs of cards
    const pairs = items.flatMap((item, index) => [
      { id: `${index}_a`, content: item.first, type: 'first', pairId: index },
      { id: `${index}_b`, content: item.second, type: 'second', pairId: index }
    ]);
    
    // Shuffle the cards
    const shuffled = shuffleArray(pairs);
    setCards(shuffled);
    setGameStarted(true);
  };

  const handleCardPress = (cardId) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (matchedPairs.some(pair => pair.includes(cardId))) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedCardIds) => {
    const [firstCardId, secondCardId] = flippedCardIds;
    const firstCard = cards.find(card => card.id === firstCardId);
    const secondCard = cards.find(card => card.id === secondCardId);

    setTimeout(() => {
      if (firstCard.pairId === secondCard.pairId) {
        // Match found!
        setMatchedPairs([...matchedPairs, flippedCardIds]);
        setFlippedCards([]);
        
        // Check if game is complete
        if (matchedPairs.length + 1 === items.length) {
          setTimeout(() => {
            onComplete({
              moves: moves + 1,
              score: Math.max(100 - (moves + 1 - items.length) * 5, 50),
              pairs: items.length
            });
          }, 1000);
        }
      } else {
        // No match, flip cards back
        setFlippedCards([]);
      }
    }, 1000);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const isCardFlipped = (cardId) => 
    flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId));

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>🎮 Memory Matching</Text>
        <Text style={styles.gameProgress}>
          Moves: {moves} • Pairs: {matchedPairs.length}/{items.length}
        </Text>
      </View>

      <View style={styles.memoryGameGrid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.memoryCard,
              isCardFlipped(card.id) && styles.flippedCard
            ]}
            onPress={() => handleCardPress(card.id)}
          >
            <Text style={styles.memoryCardText}>
              {isCardFlipped(card.id) ? card.content : '❓'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// 🎯 Pattern Recognition Game Component
export const PatternGame = ({ patterns, onComplete, difficulty = 'beginner' }) => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [userSequence, setUserSequence] = useState([]);
  const [showPattern, setShowPattern] = useState(false);
  const [gamePhase, setGamePhase] = useState('instructions'); // instructions, show, input, feedback
  const [correctSequences, setCorrectSequences] = useState(0);

  const pattern = patterns[currentPattern];

  useEffect(() => {
    if (gamePhase === 'show') {
      const timer = setTimeout(() => {
        setGamePhase('input');
      }, pattern.sequence.length * 1000 + 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gamePhase, pattern]);

  const startPattern = () => {
    setGamePhase('show');
    setShowPattern(true);
    setUserSequence([]);
  };

  const handlePatternInput = (item) => {
    const newSequence = [...userSequence, item];
    setUserSequence(newSequence);

    // Check if sequence matches so far
    const isCorrectSoFar = pattern.sequence
      .slice(0, newSequence.length)
      .every((item, index) => item === newSequence[index]);

    if (!isCorrectSoFar) {
      // Wrong item selected
      setGamePhase('feedback');
      setTimeout(() => {
        setGamePhase('instructions');
        setShowPattern(false);
      }, 2000);
      return;
    }

    if (newSequence.length === pattern.sequence.length) {
      // Pattern completed correctly!
      setCorrectSequences(correctSequences + 1);
      setGamePhase('feedback');
      
      setTimeout(() => {
        if (currentPattern < patterns.length - 1) {
          setCurrentPattern(currentPattern + 1);
          setGamePhase('instructions');
          setShowPattern(false);
        } else {
          // Game complete
          onComplete({
            score: Math.round((correctSequences + 1) / patterns.length * 100),
            correctPatterns: correctSequences + 1,
            totalPatterns: patterns.length
          });
        }
      }, 2000);
    }
  };

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>🎯 Pattern Memory</Text>
        <Text style={styles.gameProgress}>
          Pattern {currentPattern + 1} of {patterns.length}
        </Text>
      </View>

      <View style={styles.patternContainer}>
        {gamePhase === 'instructions' && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.patternInstructions}>
              Watch the pattern carefully, then repeat it!
            </Text>
            <TouchableOpacity style={styles.startPatternButton} onPress={startPattern}>
              <Text style={styles.startPatternText}>Show Pattern</Text>
            </TouchableOpacity>
          </View>
        )}

        {gamePhase === 'show' && (
          <View style={styles.patternDisplay}>
            <Text style={styles.watchText}>Watch carefully! 👀</Text>
            <PatternSequenceDisplay 
              sequence={pattern.sequence} 
              items={pattern.items}
            />
          </View>
        )}

        {gamePhase === 'input' && (
          <View style={styles.patternInput}>
            <Text style={styles.inputText}>
              Now repeat the pattern! ({userSequence.length}/{pattern.sequence.length})
            </Text>
            <View style={styles.patternItems}>
              {pattern.items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.patternItem}
                  onPress={() => handlePatternInput(item)}
                >
                  <Text style={styles.patternItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {gamePhase === 'feedback' && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>
              {userSequence.length === pattern.sequence.length ? "Perfect! 🎉" : "Try again! 🤔"}
            </Text>
            <Text style={styles.feedbackMessage}>
              {userSequence.length === pattern.sequence.length 
                ? "You got the pattern exactly right!"
                : "Watch more carefully next time!"
              }
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Helper component for pattern display
const PatternSequenceDisplay = ({ sequence, items }) => {
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < sequence.length) {
        setHighlightIndex(currentIndex);
        setTimeout(() => setHighlightIndex(-1), 500);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sequence]);

  return (
    <View style={styles.sequenceDisplay}>
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.sequenceItem,
            sequence[highlightIndex] === item && styles.highlightedItem
          ]}
        >
          <Text style={styles.sequenceItemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  gameHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  
  gameProgress: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },

  // Vocabulary Matching Game Styles
  matchingGameContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  
  wordsColumn: {
    flex: 1,
    paddingRight: 8,
  },
  
  definitionsColumn: {
    flex: 1,
    paddingLeft: 8,
  },
  
  connectorsColumn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  matchingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  
  selectedCard: {
    borderColor: '#4ecdc4',
    backgroundColor: '#e8f5e8',
  },
  
  matchedCard: {
    borderColor: '#27ae60',
    backgroundColor: '#d4edda',
  },
  
  matchingText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
  },
  
  matchedText: {
    color: '#27ae60',
    fontWeight: '600',
  },
  
  connector: {
    width: 3,
    height: 60,
    backgroundColor: '#27ae60',
    marginVertical: 12,
    borderRadius: 2,
  },

  // Feedback Styles
  feedback: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  
  correctFeedback: {
    backgroundColor: '#d4edda',
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  
  incorrectFeedback: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  correctAnswerText: {
    fontSize: 14,
    color: '#495057',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Quiz Styles
  questionContainer: {
    flex: 1,
  },
  
  storyContext: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  
  storyText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    lineHeight: 28,
  },
  
  answersContainer: {
    gap: 12,
  },
  
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  
  selectedAnswer: {
    borderColor: '#007bff',
    backgroundColor: '#e8f4fd',
  },
  
  correctAnswer: {
    borderColor: '#28a745',
    backgroundColor: '#d4edda',
  },
  
  incorrectAnswer: {
    borderColor: '#dc3545',
    backgroundColor: '#f8d7da',
  },
  
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    color: '#495057',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    marginRight: 12,
  },
  
  selectedAnswerText: {
    color: '#007bff',
  },
  
  correctAnswerText: {
    color: '#28a745',
  },
  
  answerText: {
    fontSize: 16,
    color: '#495057',
    flex: 1,
  },
  
  explanationContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  
  explanationText: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
  },
  
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  quizCompleteContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  quizCompleteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 16,
  },
  
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  scoreDetails: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 24,
  },
  
  // Question Review Styles
  questionReview: {
    width: '100%',
    marginTop: 20,
  },
  
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  reviewQuestion: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  reviewQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    lineHeight: 22,
  },
  
  reviewAnswers: {
    gap: 8,
  },
  
  reviewAnswer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  
  correctReviewAnswer: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  
  incorrectReviewAnswer: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  
  userCorrectAnswer: {
    backgroundColor: '#d1ecf1',
    borderColor: '#17a2b8',
  },
  
  reviewAnswerLetter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    color: '#495057',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 12,
    fontSize: 14,
  },
  
  reviewAnswerText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },
  
  reviewAnswerIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  performanceIndicator: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  
  excellentPerformance: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  goodPerformance: {
    fontSize: 18,
    color: '#ffc107',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  needsPractice: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Memory Game Styles
  memoryGameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  
  memoryCard: {
    width: (screenWidth - 56) / 4 - 4,
    height: 80,
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  flippedCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4ecdc4',
  },
  
  memoryCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },

  // Pattern Game Styles
  patternContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  instructionsContainer: {
    alignItems: 'center',
  },
  
  patternInstructions: {
    fontSize: 18,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  startPatternButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  
  startPatternText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  patternDisplay: {
    alignItems: 'center',
  },
  
  watchText: {
    fontSize: 20,
    color: '#495057',
    marginBottom: 24,
  },
  
  sequenceDisplay: {
    flexDirection: 'row',
    gap: 12,
  },
  
  sequenceItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  highlightedItem: {
    backgroundColor: '#ffc107',
    transform: [{ scale: 1.2 }],
  },
  
  sequenceItemText: {
    fontSize: 24,
  },
  
  patternInput: {
    alignItems: 'center',
  },
  
  inputText: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 24,
    textAlign: 'center',
  },
  
  patternItems: {
    flexDirection: 'row',
    gap: 16,
  },
  
  patternItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  patternItemText: {
    fontSize: 28,
  },
  
  feedbackContainer: {
    alignItems: 'center',
  },
  
  feedbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  
  feedbackMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },

  // Quiz Layout Styles
  scrollContainer: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Quiz Navigation Styles
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  
  navButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  
  navButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default {
  VocabularyMatchingGame,
  ComprehensionQuiz,
  MemoryMatchingGame,
  PatternGame
};