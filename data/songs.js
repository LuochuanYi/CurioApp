// Sign-Along Songs Library
// Interactive songs with lyrics, sign language instructions, and educational content

// Audio files configuration
// Using proper require() statements for Expo asset loading
console.log('Loading songs.js - configuring real audio files...');

// Import audio files using require() - Expo will bundle these as assets
const twinkleTwinkleAudio = require('../assets/audio/songs/twinkle-twinkle.mp3');
const abcSongAudio = require('../assets/audio/songs/abc-song.mp3');  
const ifYourHappyAudio = require('../assets/audio/songs/if-your-happy.mp3');
const wheelsOnBusAudio = require('../assets/audio/songs/wheels-on-bus.mp3');
const rainRainGoAwayAudio = require('../assets/audio/songs/rain-rain-go-away.mp3');
const fiveLittleDucksAudio = require('../assets/audio/songs/five-little-ducks.mp3');

// Bedtime songs audio files
const brahmsLullabyAudio = require('../assets/audio/songs/brahms-lullaby.mp3');
const goldenSlumbersAudio = require('../assets/audio/songs/golden-slumbers.mp3');
const hushLittleBabyAudio = require('../assets/audio/songs/hush-little-baby.mp3');
const rockAByeBabyAudio = require('../assets/audio/songs/rock-a-bye-baby.mp3');
const somewhereOverRainbowAudio = require('../assets/audio/songs/somewhere-over-rainbow-bedtime.mp3');

console.log('✅ Real audio files configured:', {
  twinkleTwinkle: !!twinkleTwinkleAudio,
  abcSong: !!abcSongAudio,
  ifYourHappy: !!ifYourHappyAudio,
  wheelsOnBus: !!wheelsOnBusAudio,
  rainRainGoAway: !!rainRainGoAwayAudio,
  fiveLittleDucks: !!fiveLittleDucksAudio,
  brahmsLullaby: !!brahmsLullabyAudio,
  goldenSlumbers: !!goldenSlumbersAudio,
  hushLittleBaby: !!hushLittleBabyAudio,
  rockAByeBaby: !!rockAByeBabyAudio,
  somewhereOverRainbow: !!somewhereOverRainbowAudio
});

// Song difficulty levels
export const SONG_DIFFICULTIES = {
  BEGINNER: {
    id: 'beginner',
    name: 'Beginner',
    icon: '🌱',
    color: '#4ecdc4',
    description: 'Simple gestures, easy lyrics'
  },
  INTERMEDIATE: {
    id: 'intermediate', 
    name: 'Intermediate',
    icon: '🌿',
    color: '#45b7aa',
    description: 'More complex signs, longer songs'
  },
  ADVANCED: {
    id: 'advanced',
    name: 'Advanced', 
    icon: '🌳',
    color: '#3d9970',
    description: 'Full sign language, storytelling'
  }
};

// Song categories for organization
export const SONG_CATEGORIES = {
  CLASSIC: {
    id: 'classic',
    name: 'Classic Nursery',
    icon: '🎵',
    color: '#f39c12'
  },
  EDUCATIONAL: {
    id: 'educational',
    name: 'Educational',
    icon: '📚',
    color: '#3498db'
  },
  INTERACTIVE: {
    id: 'interactive',
    name: 'Interactive',
    icon: '🙌',
    color: '#e74c3c'
  },
  MOVEMENT: {
    id: 'movement',
    name: 'Movement',
    icon: '💃',
    color: '#9b59b6'
  },
  CALMING: {
    id: 'calming',
    name: 'Calming',
    icon: '😌',
    color: '#1abc9c'
  },
  BEDTIME: {
    id: 'bedtime',
    name: 'Bedtime',
    icon: '🌙',
    color: '#6c5ce7'
  }
};

// Sign language instruction format
const createSignInstruction = (word, description, gestureType = 'hand') => ({
  word,
  description,
  gestureType, // 'hand', 'body', 'facial', 'finger'
  timing: null // Will be set during lyrics sync
});

// Main songs library
export const SONGS_LIBRARY = [
  {
    id: 'twinkle-star',
    title: 'Twinkle, Twinkle, Little Star',
    category: 'classic',
    difficulty: 'beginner',
    duration: '2:30',
    ageGroup: '2-6 years',
    icon: '⭐',
    color: '#ffd60a',
    audioFile: twinkleTwinkleAudio,
    description: 'Learn basic hand gestures while singing this beloved classic',
    learningGoals: [
      'Basic sign language gestures',
      'Rhythm and melody recognition',
      'Night sky vocabulary'
    ],
    lyrics: [
      {
        line: "Twinkle, twinkle, little star",
        signs: [
          createSignInstruction('Twinkle', 'Open and close fingers like sparkling stars'),
          createSignInstruction('Little', 'Show small size with thumb and finger'),
          createSignInstruction('Star', 'Point fingers upward, wiggle like twinkling')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "How I wonder what you are",
        signs: [
          createSignInstruction('Wonder', 'Place finger on temple, look thoughtful'),
          createSignInstruction('What', 'Shrug shoulders with open palms'),
          createSignInstruction('You', 'Point upward to the sky')
        ],
        startTime: 4,
        endTime: 8
      },
      {
        line: "Up above the world so high",
        signs: [
          createSignInstruction('Up', 'Point both hands upward'),
          createSignInstruction('Above', 'Raise hands high over head'),
          createSignInstruction('World', 'Make a big circle with arms'),
          createSignInstruction('High', 'Stretch arms up as high as possible')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "Like a diamond in the sky",
        signs: [
          createSignInstruction('Like', 'Nod and smile'),
          createSignInstruction('Diamond', 'Make sparkly gestures with fingers'),
          createSignInstruction('Sky', 'Sweep arms across overhead like the sky')
        ],
        startTime: 12,
        endTime: 16
      },
      {
        line: "Twinkle, twinkle, little star",
        signs: [
          createSignInstruction('Twinkle', 'Repeat sparkling finger movements'),
          createSignInstruction('Little', 'Small gesture again'),
          createSignInstruction('Star', 'Point and twinkle upward')
        ],
        startTime: 16,
        endTime: 20
      },
      {
        line: "How I wonder what you are",
        signs: [
          createSignInstruction('Wonder', 'Thoughtful gesture repeated'),
          createSignInstruction('What', 'Questioning gesture'),
          createSignInstruction('You', 'Point to the star again')
        ],
        startTime: 20,
        endTime: 24
      }
    ],
    tips: [
      "Start slowly to let children learn the gestures",
      "Encourage big, expressive movements", 
      "Point to real stars if it's nighttime",
      "Vary the speed - fast twinkling, slow dreamy wonder"
    ],
    extensions: [
      "Talk about stars and space",
      "Draw pictures of stars together",
      "Look for stars outside at night",
      "Learn about constellations"
    ]
  },
  
  {
    id: 'abc-song',
    title: 'A-B-C Song',
    category: 'educational',
    difficulty: 'intermediate',
    duration: '3:15', 
    ageGroup: '3-7 years',
    icon: '🔤',
    color: '#3498db',
    audioFile: abcSongAudio,
    description: 'Learn the alphabet with corresponding sign language letters',
    learningGoals: [
      'Alphabet recognition',
      'Sign language letters A-Z',
      'Sequential learning',
      'Letter-sound connection'
    ],
    lyrics: [
      {
        line: "A-B-C-D-E-F-G",
        signs: [
          createSignInstruction('A', 'Make fist with thumb beside fingers', 'finger'),
          createSignInstruction('B', 'Hold up four fingers, thumb across palm', 'finger'),
          createSignInstruction('C', 'Curve hand like letter C', 'finger'),
          createSignInstruction('D', 'Point index up, thumb touches middle/ring', 'finger'),
          createSignInstruction('E', 'Curl fingertips to touch thumb', 'finger'),
          createSignInstruction('F', 'Touch thumb to index, other fingers up', 'finger'),
          createSignInstruction('G', 'Point index and thumb sideways', 'finger')
        ],
        startTime: 0,
        endTime: 7
      },
      {
        line: "H-I-J-K-L-M-N-O-P",
        signs: [
          createSignInstruction('H', 'Point index and middle sideways', 'finger'),
          createSignInstruction('I', 'Point pinky up', 'finger'),
          createSignInstruction('J', 'Hook pinky in J shape', 'finger'),
          createSignInstruction('K', 'Index up, middle out, thumb between', 'finger'),
          createSignInstruction('L', 'Index up, thumb out in L shape', 'finger'),
          createSignInstruction('M', 'Thumb under three fingers', 'finger'),
          createSignInstruction('N', 'Thumb under two fingers', 'finger'),
          createSignInstruction('O', 'Curve all fingers in O shape', 'finger'),
          createSignInstruction('P', 'Like K but pointing down', 'finger')
        ],
        startTime: 7,
        endTime: 14
      },
      {
        line: "Q-R-S-T-U-V",
        signs: [
          createSignInstruction('Q', 'Point index and thumb down', 'finger'),
          createSignInstruction('R', 'Cross index and middle fingers', 'finger'),
          createSignInstruction('S', 'Make fist with thumb across', 'finger'),
          createSignInstruction('T', 'Thumb between index and middle', 'finger'),
          createSignInstruction('U', 'Index and middle up together', 'finger'),
          createSignInstruction('V', 'Index and middle in V shape', 'finger')
        ],
        startTime: 14,
        endTime: 19
      },
      {
        line: "W-X-Y and Z",
        signs: [
          createSignInstruction('W', 'Index, middle, ring up together', 'finger'),
          createSignInstruction('X', 'Hook index finger', 'finger'),
          createSignInstruction('Y', 'Thumb and pinky out', 'finger'),
          createSignInstruction('Z', 'Draw Z in the air with index', 'finger')
        ],
        startTime: 19,
        endTime: 23
      },
      {
        line: "Now I know my ABCs",
        signs: [
          createSignInstruction('Now', 'Palms down, bring to chest'),
          createSignInstruction('Know', 'Tap temple with fingertips'),
          createSignInstruction('My', 'Palm on chest'),
          createSignInstruction('ABCs', 'Sign A-B-C quickly')
        ],
        startTime: 23,
        endTime: 27
      },
      {
        line: "Next time won't you sing with me?",
        signs: [
          createSignInstruction('Next', 'Move hand forward'),
          createSignInstruction('Time', 'Tap wrist'),
          createSignInstruction('Sing', 'Move hand from mouth outward'),
          createSignInstruction('With me', 'Point to others then self')
        ],
        startTime: 27,
        endTime: 32
      }
    ],
    tips: [
      "Practice letter signs slowly first",
      "Show each letter clearly before singing",
      "Use letter cards as visual aids",
      "Encourage children to 'air write' letters too"
    ],
    extensions: [
      "Spell simple words with sign letters",
      "Find letters in books together", 
      "Practice writing letters on paper",
      "Play letter identification games"
    ]
  },

  {
    id: 'if-youre-happy',
    title: 'If You\'re Happy and You Know It',
    category: 'interactive',
    difficulty: 'beginner',
    duration: '3:45',
    ageGroup: '2-8 years', 
    icon: '😊',
    color: '#e74c3c',
    audioFile: ifYourHappyAudio,
    description: 'Express emotions through movement and gestures',
    learningGoals: [
      'Emotion recognition',
      'Body movement coordination',
      'Following instructions',
      'Expressing feelings'
    ],
    lyrics: [
      {
        line: "If you're happy and you know it, clap your hands",
        signs: [
          createSignInstruction('Happy', 'Smile big and pat chest upward', 'body'),
          createSignInstruction('Know it', 'Nod confidently'),
          createSignInstruction('Clap hands', 'Clap hands twice loudly')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "If you're happy and you know it, clap your hands",
        signs: [
          createSignInstruction('Happy', 'Keep smiling'),
          createSignInstruction('Clap hands', 'Clap hands twice again')
        ],
        startTime: 4,
        endTime: 8
      },
      {
        line: "If you're happy and you know it, then your face will surely show it",
        signs: [
          createSignInstruction('Face', 'Point to face with big smile'),
          createSignInstruction('Show it', 'Present face proudly', 'facial')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "If you're happy and you know it, clap your hands",
        signs: [
          createSignInstruction('Clap hands', 'Final enthusiastic claps')
        ],
        startTime: 12,
        endTime: 16
      },
      {
        line: "If you're happy and you know it, stomp your feet",
        signs: [
          createSignInstruction('Stomp feet', 'Stomp feet twice with energy', 'body')
        ],
        startTime: 16,
        endTime: 20
      },
      {
        line: "If you're happy and you know it, shout hooray!",
        signs: [
          createSignInstruction('Shout', 'Cup hands around mouth'),
          createSignInstruction('Hooray', 'Throw arms up and cheer')
        ],
        startTime: 24,
        endTime: 28
      }
    ],
    tips: [
      "Encourage big, enthusiastic movements",
      "Add your own verses (jump, spin, wiggle)",
      "Talk about different emotions",
      "Let children suggest new actions"
    ],
    extensions: [
      "Try 'If you're sad/angry/excited' versions",
      "Draw emotion faces together",
      "Practice identifying feelings",
      "Create a feelings chart"
    ]
  },

  {
    id: 'wheels-on-bus',
    title: 'The Wheels on the Bus',
    category: 'movement',
    difficulty: 'intermediate',
    duration: '4:20',
    ageGroup: '2-6 years',
    icon: '🚌',
    color: '#f39c12',
    audioFile: wheelsOnBusAudio,
    description: 'Act out transportation and city sounds with movement',
    learningGoals: [
      'Vehicle vocabulary',
      'Sound recognition',
      'Coordination skills',
      'City/community awareness'
    ],
    lyrics: [
      {
        line: "The wheels on the bus go round and round",
        signs: [
          createSignInstruction('Wheels', 'Roll hands in circles', 'hand'),
          createSignInstruction('Bus', 'Pretend to hold steering wheel'),
          createSignInstruction('Round and round', 'Big circular motions with arms')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "The wipers on the bus go swish, swish, swish",
        signs: [
          createSignInstruction('Wipers', 'Move arms back and forth like windshield wipers', 'body'),
          createSignInstruction('Swish', 'Make swishing sound and motion')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "The horn on the bus goes beep, beep, beep",
        signs: [
          createSignInstruction('Horn', 'Press palm like honking horn'),
          createSignInstruction('Beep', 'Make beeping gestures and sounds')
        ],
        startTime: 16,
        endTime: 20
      },
      {
        line: "The doors on the bus go open and shut",
        signs: [
          createSignInstruction('Doors', 'Move hands apart then together', 'hand'),
          createSignInstruction('Open', 'Spread arms wide'),
          createSignInstruction('Shut', 'Bring arms together with snap')
        ],
        startTime: 24,
        endTime: 28
      },
      {
        line: "The people on the bus go up and down",
        signs: [
          createSignInstruction('People', 'Wave to imaginary passengers'),
          createSignInstruction('Up and down', 'Bounce up and down', 'body')
        ],
        startTime: 32,
        endTime: 36
      }
    ],
    tips: [
      "Act out each verse with full body movement",
      "Make the sounds enthusiastically", 
      "Pretend to be on a real bus ride",
      "Add more verses (lights, engine, etc.)"
    ],
    extensions: [
      "Talk about public transportation",
      "Draw different vehicles",
      "Visit a bus stop or train station",
      "Learn about community helpers"
    ]
  },

  {
    id: 'rain-rain-go-away',
    title: 'Rain, Rain, Go Away',
    category: 'bedtime',
    difficulty: 'beginner',
    duration: '2:00',
    ageGroup: '2-5 years',
    icon: '🌧️',
    color: '#74b9ff',
    audioFile: rainRainGoAwayAudio,
    description: 'Gentle weather-themed song with soothing movements',
    learningGoals: [
      'Weather vocabulary',
      'Gentle movements',
      'Emotional regulation',
      'Nature awareness'
    ],
    lyrics: [
      {
        line: "Rain, rain, go away",
        signs: [
          createSignInstruction('Rain', 'Wiggle fingers downward like raindrops'),
          createSignInstruction('Go away', 'Gentle shooing motion with hands')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "Come again another day",
        signs: [
          createSignInstruction('Come again', 'Beckoning motion'),
          createSignInstruction('Another day', 'Point to tomorrow on imaginary calendar')
        ],
        startTime: 4,
        endTime: 8
      },
      {
        line: "Little children want to play",
        signs: [
          createSignInstruction('Little children', 'Indicate small height'),
          createSignInstruction('Want to play', 'Excited jumping motions')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "Rain, rain, go away",
        signs: [
          createSignInstruction('Rain', 'Gentle rain finger movements'),
          createSignInstruction('Go away', 'Soft pushing away gesture')
        ],
        startTime: 12,
        endTime: 16
      }
    ],
    tips: [
      "Use soft, gentle movements",
      "Talk about different weather",
      "Practice during actual rainy days",
      "Encourage calm, soothing tones"
    ],
    extensions: [
      "Look out the window at weather",
      "Draw rain and sunshine pictures",
      "Learn about the water cycle",
      "Make weather observation chart"
    ]
  },

  {
    id: 'five-little-ducks',
    title: 'Five Little Ducks',
    category: 'educational',
    difficulty: 'advanced',
    duration: '5:30',
    ageGroup: '3-8 years',
    icon: '🦆',
    audioFile: fiveLittleDucksAudio,
    color: '#fdcb6e',
    description: 'Counting and subtraction through storytelling with signs',
    learningGoals: [
      'Number recognition 1-5',
      'Subtraction concepts',
      'Storytelling through sign',
      'Animal vocabulary'
    ],
    lyrics: [
      {
        line: "Five little ducks went swimming one day",
        signs: [
          createSignInstruction('Five', 'Hold up five fingers'),
          createSignInstruction('Little ducks', 'Make duck bills with hands'),
          createSignInstruction('Swimming', 'Swimming motions with arms', 'body')
        ],
        startTime: 0,
        endTime: 5
      },
      {
        line: "Over the hill and far away",
        signs: [
          createSignInstruction('Over the hill', 'Arc hand over imaginary hill'),
          createSignInstruction('Far away', 'Point into the distance')
        ],
        startTime: 5,
        endTime: 9
      },
      {
        line: "Mother duck said, 'Quack, quack, quack, quack'",
        signs: [
          createSignInstruction('Mother duck', 'Larger duck bill gesture'),
          createSignInstruction('Quack', 'Open and close duck bill four times')
        ],
        startTime: 9,
        endTime: 13
      },
      {
        line: "But only four little ducks came back",
        signs: [
          createSignInstruction('Only four', 'Hold up four fingers sadly'),
          createSignInstruction('Came back', 'Beckoning motion toward self')
        ],
        startTime: 13,
        endTime: 17
      }
    ],
    tips: [
      "Count on fingers with each verse",
      "Act out the story dramatically",
      "Use different voices for characters",
      "Encourage children to count along"
    ],
    extensions: [
      "Continue with 4, 3, 2, 1, 0 ducks",
      "Practice subtraction problems",
      "Learn about duck families",
      "Visit a pond to see real ducks"
    ]
  },

  // BEDTIME SONGS
  {
    id: 'brahms-lullaby',
    title: 'Brahms\' Lullaby',
    category: 'bedtime',
    difficulty: 'beginner',
    duration: '3:00',
    ageGroup: '0-6 years',
    icon: '🎵',
    audioFile: brahmsLullabyAudio,
    color: '#a29bfe',
    description: 'Classic gentle lullaby with soothing sign movements',
    learningGoals: [
      'Calming hand gestures',
      'Gentle rhythm recognition',
      'Self-soothing techniques',
      'Musical appreciation'
    ],
    lyrics: [
      {
        line: "Lullaby and good night",
        signs: [
          createSignInstruction('Lullaby', 'Rock arms like holding a baby'),
          createSignInstruction('Good night', 'Gentle wave goodbye to the day')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "With roses bedight",
        signs: [
          createSignInstruction('Roses', 'Cup hands like holding flowers'),
          createSignInstruction('Bedight', 'Gentle spreading motions like arranging')
        ],
        startTime: 4,
        endTime: 8
      },
      {
        line: "With lilies o'er spread",
        signs: [
          createSignInstruction('Lilies', 'Graceful flower gestures'),
          createSignInstruction('O\'er spread', 'Gentle covering motions over head')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "Is baby's wee bed",
        signs: [
          createSignInstruction('Baby\'s', 'Rock arms gently'),
          createSignInstruction('Wee bed', 'Lay head on hands like pillow')
        ],
        startTime: 12,
        endTime: 16
      }
    ],
    tips: [
      "Use very gentle, slow movements",
      "Sing in a soft, soothing voice",
      "Rock gently while signing",
      "Perfect for bedtime routine"
    ],
    extensions: [
      "Learn about classical music",
      "Practice gentle movements",
      "Create a bedtime ritual",
      "Explore other lullabies"
    ]
  },

  {
    id: 'golden-slumbers',
    title: 'Golden Slumbers',
    category: 'bedtime',
    difficulty: 'beginner',
    duration: '2:45',
    ageGroup: '1-7 years',
    icon: '✨',
    audioFile: goldenSlumbersAudio,
    color: '#ffeaa7',
    description: 'Peaceful bedtime song about rest and comfort',
    learningGoals: [
      'Comfort gestures',
      'Bedtime vocabulary',
      'Peaceful movements',
      'Emotional comfort'
    ],
    lyrics: [
      {
        line: "Golden slumbers kiss your eyes",
        signs: [
          createSignInstruction('Golden', 'Sparkle fingers like gold'),
          createSignInstruction('Slumbers', 'Rest head on hands'),
          createSignInstruction('Kiss your eyes', 'Gentle touch near eyes')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "Smiles awake you when you rise",
        signs: [
          createSignInstruction('Smiles', 'Draw smile on face with finger'),
          createSignInstruction('Awake', 'Gentle stretching motion'),
          createSignInstruction('When you rise', 'Slowly lift arms up')
        ],
        startTime: 4,
        endTime: 8
      },
      {
        line: "Sleep, pretty baby, do not cry",
        signs: [
          createSignInstruction('Sleep', 'Close eyes and rest head'),
          createSignInstruction('Pretty baby', 'Gentle rocking motion'),
          createSignInstruction('Do not cry', 'Soothing wiping motion')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "And I will sing a lullaby",
        signs: [
          createSignInstruction('I will sing', 'Hand from mouth outward gently'),
          createSignInstruction('Lullaby', 'Rocking motion like cradling')
        ],
        startTime: 12,
        endTime: 16
      }
    ],
    tips: [
      "Use flowing, graceful movements",
      "Maintain eye contact and smile",
      "Sing very softly and slowly",
      "Perfect for calming anxious children"
    ],
    extensions: [
      "Talk about what makes us feel safe",
      "Practice deep breathing together",
      "Create a cozy bedtime space",
      "Share family lullaby traditions"
    ]
  },

  {
    id: 'hush-little-baby',
    title: 'Hush Little Baby',
    category: 'bedtime',
    difficulty: 'intermediate',
    duration: '4:15',
    ageGroup: '2-7 years',
    icon: '🎁',
    audioFile: hushLittleBabyAudio,
    color: '#fd79a8',
    description: 'Classic promise song with gentle gift-giving gestures',
    learningGoals: [
      'Promise and comfort concepts',
      'Object vocabulary',
      'Gentle giving motions',
      'Story sequence'
    ],
    lyrics: [
      {
        line: "Hush little baby, don't say a word",
        signs: [
          createSignInstruction('Hush', 'Gentle finger to lips'),
          createSignInstruction('Little baby', 'Rock arms like holding baby'),
          createSignInstruction('Don\'t say a word', 'Quiet gesture with finger')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "Mama's gonna buy you a mockingbird",
        signs: [
          createSignInstruction('Mama\'s gonna buy', 'Giving gesture toward child'),
          createSignInstruction('Mockingbird', 'Flapping bird wings gently')
        ],
        startTime: 4,
        endTime: 8
      },
      {
        line: "If that mockingbird won't sing",
        signs: [
          createSignInstruction('If that mockingbird', 'Point to imaginary bird'),
          createSignInstruction('Won\'t sing', 'Shake head gently, no singing')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "Mama's gonna buy you a diamond ring",
        signs: [
          createSignInstruction('Mama\'s gonna buy', 'Generous giving gesture'),
          createSignInstruction('Diamond ring', 'Make circle with fingers, sparkle')
        ],
        startTime: 12,
        endTime: 16
      }
    ],
    tips: [
      "Make each 'gift' gesture special",
      "Use a loving, promising tone",
      "Continue with more verses",
      "Emphasize the comfort of promises"
    ],
    extensions: [
      "Continue with more gift verses",
      "Talk about different ways to show love",
      "Practice making promises",
      "Discuss family traditions"
    ]
  },

  {
    id: 'rock-a-bye-baby',
    title: 'Rock-a-Bye Baby',
    category: 'bedtime',
    difficulty: 'beginner',
    duration: '2:30',
    ageGroup: '1-5 years',
    icon: '🌳',
    audioFile: rockAByeBabyAudio,
    color: '#00b894',
    description: 'Gentle rocking lullaby with nature-inspired movements',
    learningGoals: [
      'Rocking motions',
      'Nature vocabulary',
      'Gentle rhythm',
      'Comfort through movement'
    ],
    lyrics: [
      {
        line: "Rock-a-bye baby, in the treetop",
        signs: [
          createSignInstruction('Rock-a-bye baby', 'Gentle rocking motion'),
          createSignInstruction('In the treetop', 'Arms up high like tree branches')
        ],
        startTime: 0,
        endTime: 4
      },
      {
        line: "When the wind blows, the cradle will rock",
        signs: [
          createSignInstruction('When the wind blows', 'Gentle swaying like wind'),
          createSignInstruction('Cradle will rock', 'Rocking motion back and forth')
        ],
        startTime: 4,
        endTime: 8
      },
      {
        line: "When the bough breaks, the cradle will fall",
        signs: [
          createSignInstruction('When the bough breaks', 'Gentle breaking motion'),
          createSignInstruction('Cradle will fall', 'Slow, gentle lowering motion')
        ],
        startTime: 8,
        endTime: 12
      },
      {
        line: "And down will come baby, cradle and all",
        signs: [
          createSignInstruction('Down will come baby', 'Gentle catching motion'),
          createSignInstruction('Cradle and all', 'Safe encompassing gesture')
        ],
        startTime: 12,
        endTime: 16
      }
    ],
    tips: [
      "Focus on gentle rocking rhythm",
      "Make the 'falling' motion very gentle",
      "End with safe, secure feeling",
      "Use as a calming bedtime routine"
    ],
    extensions: [
      "Talk about how trees keep us safe",
      "Practice gentle rocking together",
      "Learn about wind and nature sounds",
      "Create a safe, cozy feeling"
    ]
  },

  {
    id: 'somewhere-over-rainbow',
    title: 'Somewhere Over the Rainbow (Bedtime Version)',
    category: 'bedtime',
    difficulty: 'intermediate',
    duration: '3:30',
    ageGroup: '3-10 years',
    icon: '🌈',
    audioFile: somewhereOverRainbowAudio,
    color: '#6c5ce7',
    description: 'Dreamy version of the classic with gentle, hopeful movements',
    learningGoals: [
      'Dream vocabulary',
      'Hope and comfort',
      'Color recognition',
      'Gentle storytelling'
    ],
    lyrics: [
      {
        line: "Somewhere over the rainbow, way up high",
        signs: [
          createSignInstruction('Somewhere over', 'Gentle arc motion'),
          createSignInstruction('Rainbow', 'Draw rainbow in the air'),
          createSignInstruction('Way up high', 'Point gently upward')
        ],
        startTime: 0,
        endTime: 6
      },
      {
        line: "There's a land that I heard of, once in a lullaby",
        signs: [
          createSignInstruction('There\'s a land', 'Gentle spreading gesture'),
          createSignInstruction('I heard of', 'Cup ear, listening'),
          createSignInstruction('Once in a lullaby', 'Rocking motion')
        ],
        startTime: 6,
        endTime: 12
      },
      {
        line: "Somewhere over the rainbow, skies are blue",
        signs: [
          createSignInstruction('Somewhere over', 'Repeat rainbow arc'),
          createSignInstruction('Skies are blue', 'Gentle sky sweeping motion')
        ],
        startTime: 12,
        endTime: 18
      },
      {
        line: "And the dreams that you dare to dream really do come true",
        signs: [
          createSignInstruction('Dreams that you dare', 'Hold heart, then reach out'),
          createSignInstruction('Dream really do come true', 'Sparkly, magical gesture')
        ],
        startTime: 18,
        endTime: 24
      }
    ],
    tips: [
      "Use flowing, dreamy movements",
      "Speak about hopes and dreams",
      "Make it feel magical and peaceful",
      "Perfect for children who worry"
    ],
    extensions: [
      "Talk about dreams and wishes",
      "Learn about colors in rainbows",
      "Practice positive thinking",
      "Create a dream journal together"
    ]
  }
];

// Helper functions for song data management
export const getSongsByCategory = (category) => {
  if (!category || category === 'all') {
    return SONGS_LIBRARY;
  }
  return SONGS_LIBRARY.filter(song => song.category === category);
};

export const getSongsByDifficulty = (difficulty) => {
  return SONGS_LIBRARY.filter(song => song.difficulty === difficulty);
};

export const getSongById = (id) => {
  return SONGS_LIBRARY.find(song => song.id === id);
};

export const searchSongs = (query) => {
  const lowerQuery = query.toLowerCase();
  return SONGS_LIBRARY.filter(song => 
    song.title.toLowerCase().includes(lowerQuery) ||
    song.description.toLowerCase().includes(lowerQuery) ||
    song.learningGoals.some(goal => goal.toLowerCase().includes(lowerQuery))
  );
};

export const getRandomSong = () => {
  const randomIndex = Math.floor(Math.random() * SONGS_LIBRARY.length);
  return SONGS_LIBRARY[randomIndex];
};

// Export song statistics
export const getSongStats = () => ({
  totalSongs: SONGS_LIBRARY.length,
  categoryCounts: Object.keys(SONG_CATEGORIES).reduce((acc, key) => {
    acc[key.toLowerCase()] = getSongsByCategory(key.toLowerCase()).length;
    return acc;
  }, {}),
  difficultyCounts: Object.keys(SONG_DIFFICULTIES).reduce((acc, key) => {
    acc[key.toLowerCase()] = getSongsByDifficulty(key.toLowerCase()).length;
    return acc;
  }, {}),
  averageDuration: SONGS_LIBRARY.reduce((sum, song) => {
    const [minutes, seconds] = song.duration.split(':').map(Number);
    return sum + minutes * 60 + seconds;
  }, 0) / SONGS_LIBRARY.length
});