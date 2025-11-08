// Learning Categories Data Structure
export const LEARNING_CATEGORIES = {
  LANGUAGE_TIPS: {
    id: 'language_tips',
    name: 'Language Tips',
    icon: '🗣️',
    color: '#3498db',
    description: 'Build communication skills and vocabulary',
    ageGroup: '2-8 years',
    totalActivities: 12
  },
  FUN_FACTS: {
    id: 'fun_facts', 
    name: 'Fun Facts',
    icon: '🤔',
    color: '#9b59b6',
    description: 'Discover amazing facts about our world',
    ageGroup: '4-10 years',
    totalActivities: 8
  },
  SCIENCE_NATURE: {
    id: 'science_nature',
    name: 'Science & Nature',
    icon: '🔬',
    color: '#27ae60',
    description: 'Explore the wonders of science and nature',
    ageGroup: '3-12 years', 
    totalActivities: 15
  },
  FEELINGS: {
    id: 'feelings',
    name: 'Feelings',
    icon: '😊',
    color: '#e74c3c',
    description: 'Learn about emotions and social skills',
    ageGroup: '2-8 years',
    totalActivities: 10
  },
  ARTS_CRAFTS: {
    id: 'arts_crafts',
    name: 'Arts & Crafts', 
    icon: '🎨',
    color: '#f39c12',
    description: 'Express creativity through art and crafts',
    ageGroup: '3-10 years',
    totalActivities: 18
  },
  ROLE_PLAY: {
    id: 'role_play',
    name: 'Role Play',
    icon: '🎭',
    color: '#1abc9c',
    description: 'Develop imagination through role-playing',
    ageGroup: '3-9 years',
    totalActivities: 6
  }
};

// Activity Types
export const ACTIVITY_TYPES = {
  INTERACTIVE_GAME: 'interactive_game',
  QUIZ: 'quiz',
  CREATIVE_PROJECT: 'creative_project',
  STORYTELLING: 'storytelling',
  PRACTICE_EXERCISE: 'practice_exercise',
  EXPLORATION: 'exploration'
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: { id: 'beginner', name: 'Beginner', icon: '⭐', color: '#2ecc71' },
  INTERMEDIATE: { id: 'intermediate', name: 'Intermediate', icon: '⭐⭐', color: '#f39c12' },
  ADVANCED: { id: 'advanced', name: 'Advanced', icon: '⭐⭐⭐', color: '#e74c3c' }
};

// Learning Activities Database
export const LEARNING_ACTIVITIES = {
  // 🗣️ LANGUAGE TIPS (12 activities)
  language_tips: [
    {
      id: 'lt_001',
      title: 'Rhyming Words Game',
      description: 'Find words that sound alike and create fun rhymes together',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '10-15 min',
      ageGroup: '3-6 years',
      instructions: [
        'Say a simple word like "cat"',
        'Help your child find words that rhyme',
        'Make silly sentences with rhyming words',
        'Draw pictures of the rhyming words together'
      ],
      materials: ['Paper', 'Crayons or markers'],
      learningGoals: ['Phonemic awareness', 'Vocabulary building', 'Language play'],
      tips: 'Start with simple one-syllable words and make it playful!'
    },
    {
      id: 'lt_002', 
      title: 'Story Retelling',
      description: 'Practice storytelling skills by retelling favorite stories',
      type: ACTIVITY_TYPES.STORYTELLING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '15-20 min',
      ageGroup: '4-8 years',
      instructions: [
        'Read a story together first',
        'Ask your child to retell the story in their own words',
        'Encourage them to add their own details',
        'Ask questions about characters and events'
      ],
      materials: ['Favorite storybook', 'Optional: props or toys'],
      learningGoals: ['Narrative skills', 'Memory', 'Sequencing', 'Vocabulary'],
      tips: 'Let them change the story - creativity is encouraged!'
    },
    {
      id: 'lt_003',
      title: 'Word Treasure Hunt',
      description: 'Search for objects that start with specific letters or sounds',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-25 min',
      ageGroup: '3-7 years',
      instructions: [
        'Choose a letter of the day',
        'Hunt around the house for objects starting with that letter',
        'Say the object names together',
        'Make a list or draw pictures of what you find'
      ],
      materials: ['Paper', 'Pencil', 'Optional: camera for photos'],
      learningGoals: ['Letter recognition', 'Phonics', 'Vocabulary', 'Observation'],
      tips: 'Start with common letters like B, C, or M for easier success!'
    },
    {
      id: 'lt_004',
      title: 'Conversation Starters',
      description: 'Practice asking questions and having meaningful conversations',
      type: ACTIVITY_TYPES.PRACTICE_EXERCISE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '10-20 min',
      ageGroup: '4-8 years',
      instructions: [
        'Use conversation starter cards or prompts',
        'Take turns asking and answering questions',
        'Practice good listening skills',
        'Encourage detailed responses'
      ],
      materials: ['Conversation prompt cards', 'Timer (optional)'],
      learningGoals: ['Communication skills', 'Listening', 'Social interaction', 'Vocabulary'],
      tips: 'Model good conversation skills and be patient with responses!'
    },
    {
      id: 'lt_005',
      title: 'Sound Scavenger Hunt',
      description: 'Find and identify different sounds around your environment',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-20 min',
      ageGroup: '2-6 years',
      instructions: [
        'Walk around your home or yard quietly',
        'Listen carefully for different sounds',
        'Name each sound you hear (clock ticking, birds chirping, etc.)',
        'Try to imitate the sounds with your voice'
      ],
      materials: ['Paper for recording sounds (optional)'],
      learningGoals: ['Auditory discrimination', 'Vocabulary', 'Attention skills', 'Sound awareness'],
      tips: 'Start in quiet areas and gradually move to busier spaces!'
    },
    {
      id: 'lt_006',
      title: 'Silly Sentence Building',
      description: 'Create funny sentences using different parts of speech',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '15-25 min',
      ageGroup: '4-8 years',
      instructions: [
        'Choose a person (noun): "The funny elephant"',
        'Add an action (verb): "dances"',
        'Add where (place): "in the kitchen"',
        'Read the silly sentence together and laugh!'
      ],
      materials: ['Word cards or paper', 'Colored pens'],
      learningGoals: ['Grammar basics', 'Sentence structure', 'Creativity', 'Parts of speech'],
      tips: 'The sillier the better - let imagination run wild!'
    },
    {
      id: 'lt_007',
      title: 'Opposite Day Game',
      description: 'Learn new vocabulary by exploring word opposites',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '10-15 min',
      ageGroup: '3-7 years',
      instructions: [
        'Say a simple word like "big"',
        'Help your child think of the opposite word',
        'Act out both words with your bodies',
        'Draw pictures showing the opposites'
      ],
      materials: ['Paper', 'Crayons', 'Mirror (optional)'],
      learningGoals: ['Vocabulary expansion', 'Concept understanding', 'Critical thinking'],
      tips: 'Use everyday objects to demonstrate opposites!'
    },
    {
      id: 'lt_008',
      title: 'Family Story Chain',
      description: 'Create collaborative stories by taking turns adding sentences',
      type: ACTIVITY_TYPES.STORYTELLING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '20-30 min',
      ageGroup: '4-10 years',
      instructions: [
        'Start with "Once upon a time..."',
        'Take turns adding one sentence to the story',
        'Build on each other\'s ideas',
        'Draw illustrations for your story'
      ],
      materials: ['Paper', 'Drawing supplies', 'Recording device (optional)'],
      learningGoals: ['Collaborative storytelling', 'Imagination', 'Listening skills', 'Turn-taking'],
      tips: 'Say "Yes, and..." to build on ideas positively!'
    },
    {
      id: 'lt_009',
      title: 'Emotion Voice Practice',
      description: 'Practice expressing different emotions through voice and tone',
      type: ACTIVITY_TYPES.PRACTICE_EXERCISE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '10-15 min',
      ageGroup: '3-8 years',
      instructions: [
        'Say the same sentence in different emotional tones',
        'Try happy, sad, excited, scared, and surprised voices',
        'Guess what emotion the other person is expressing',
        'Practice with different sentences'
      ],
      materials: ['Emotion cards (optional)', 'Mirror'],
      learningGoals: ['Emotional expression', 'Vocal variety', 'Social cues', 'Communication'],
      tips: 'Exaggerate expressions to make it more fun and clear!'
    },
    {
      id: 'lt_010',
      title: 'Picture Description Game',
      description: 'Develop descriptive language skills through detailed picture descriptions',
      type: ACTIVITY_TYPES.PRACTICE_EXERCISE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '15-20 min',
      ageGroup: '4-9 years',
      instructions: [
        'Choose an interesting picture or photograph',
        'Take turns describing what you see',
        'Use color, size, and action words',
        'Ask questions about details in the picture'
      ],
      materials: ['Pictures, books, or magazines', 'Magnifying glass (fun addition)'],
      learningGoals: ['Descriptive language', 'Observation skills', 'Vocabulary', 'Detail awareness'],
      tips: 'Encourage specific details rather than general descriptions!'
    },
    {
      id: 'lt_011',
      title: 'Tongue Twister Challenge',
      description: 'Improve pronunciation and speech clarity with fun tongue twisters',
      type: ACTIVITY_TYPES.PRACTICE_EXERCISE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      duration: '10-15 min',
      ageGroup: '5-10 years',
      instructions: [
        'Start with simple tongue twisters like "Red lorry, yellow lorry"',
        'Practice saying them slowly first',
        'Gradually increase speed',
        'Create your own tongue twisters'
      ],
      materials: ['Tongue twister book or cards', 'Timer'],
      learningGoals: ['Articulation', 'Speech clarity', 'Phonemic awareness', 'Persistence'],
      tips: 'Focus on clarity over speed - perfect pronunciation first!'
    },
    {
      id: 'lt_012',
      title: 'Question Word Detective',
      description: 'Learn to ask and answer different types of questions using question words',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '15-25 min',
      ageGroup: '4-8 years',
      instructions: [
        'Learn the question words: Who, What, Where, When, Why, How',
        'Look at pictures and ask questions using each word',
        'Take turns being the questioner and answerer',
        'Make up stories by asking lots of questions'
      ],
      materials: ['Question word cards', 'Pictures or storybooks'],
      learningGoals: ['Question formation', 'Curiosity', 'Critical thinking', 'Information gathering'],
      tips: 'Celebrate all questions - there are no silly questions!'
    }
  ],

  // 🤔 FUN FACTS (8 activities)
  fun_facts: [
    {
      id: 'ff_001',
      title: 'Animal Superpowers',
      description: 'Discover amazing abilities of different animals',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-20 min',
      ageGroup: '4-10 years',
      instructions: [
        'Learn about 3-4 animals with special abilities',
        'Discuss what makes each animal unique',
        'Act out the animal behaviors together',
        'Draw your favorite animal superpower'
      ],
      materials: ['Animal fact cards or books', 'Paper', 'Crayons'],
      learningGoals: ['Natural science', 'Critical thinking', 'Creativity'],
      funFacts: [
        'Octopuses have three hearts!',
        'Dolphins have names for each other',
        'Butterflies taste with their feet',
        'Elephants can "hear" with their feet'
      ],
      tips: 'Connect animal abilities to things your child can do!'
    },
    {
      id: 'ff_002',
      title: 'Space Adventures',
      description: 'Explore fascinating facts about planets and space',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '20-30 min',
      ageGroup: '5-10 years',
      instructions: [
        'Learn about different planets in our solar system',
        'Compare planet sizes using household objects',
        'Discuss what it would be like to visit each planet',
        'Create a space travel journal'
      ],
      materials: ['Planet pictures or books', 'Household objects for size comparison', 'Notebook'],
      learningGoals: ['Astronomy', 'Measurement concepts', 'Imagination'],
      funFacts: [
        'A day on Venus is longer than a year on Venus!',
        'Jupiter is so big that all other planets could fit inside it',
        'Saturn would float in water because it\'s less dense',
        'Mars has the largest volcano in our solar system'
      ],
      tips: 'Use a flashlight as the sun to show how planets orbit!'
    },
    {
      id: 'ff_003',
      title: 'Ocean Mysteries',
      description: 'Discover amazing facts about ocean creatures and underwater worlds',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-20 min',
      ageGroup: '4-9 years',
      instructions: [
        'Learn about different ocean zones (surface, twilight, midnight)',
        'Discover creatures that live at each level',
        'Compare sizes of ocean animals to familiar objects',
        'Act out how different sea creatures move'
      ],
      materials: ['Ocean books or videos', 'Blue blanket for "ocean"', 'Flashlight'],
      learningGoals: ['Marine biology', 'Habitat understanding', 'Size concepts'],
      funFacts: [
        'Blue whales are larger than any dinosaur that ever lived!',
        'Some fish can change colors like chameleons',
        'The ocean is deeper than Mount Everest is tall',
        'Jellyfish have been around for 500 million years'
      ],
      tips: 'Use different colored lights to show ocean depths!'
    },
    {
      id: 'ff_004',
      title: 'Weather Wonders',
      description: 'Explore fascinating weather phenomena and how they work',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '20-25 min',
      ageGroup: '5-10 years',
      instructions: [
        'Learn about different types of weather',
        'Create weather in a jar (cloud formation)',
        'Make a rainbow with a garden hose on a sunny day',
        'Keep a weather diary for a week'
      ],
      materials: ['Clear jar', 'Hot water', 'Ice cubes', 'Garden hose', 'Weather diary'],
      learningGoals: ['Meteorology', 'Scientific observation', 'Weather patterns'],
      funFacts: [
        'Lightning is 5 times hotter than the sun!',
        'No two snowflakes are exactly alike',
        'A hurricane releases energy equal to 10 atomic bombs per second',
        'Raindrops are not shaped like teardrops - they\'re round!'
      ],
      tips: 'Always do weather experiments with adult supervision!'
    },
    {
      id: 'ff_005',
      title: 'Human Body Mysteries',
      description: 'Learn incredible facts about how your body works',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-20 min',
      ageGroup: '4-8 years',
      instructions: [
        'Feel your pulse and count heartbeats',
        'Look at your fingerprints with a magnifying glass',
        'Test your reflexes (knee tap, blinking)',
        'Learn about your five senses'
      ],
      materials: ['Magnifying glass', 'Ink pad', 'Paper', 'Stopwatch'],
      learningGoals: ['Body awareness', 'Health education', 'Scientific observation'],
      funFacts: [
        'Your heart beats about 100,000 times per day!',
        'You have about 10,000 taste buds',
        'Your brain uses 20% of your body\'s energy',
        'You blink about 15,000 times per day'
      ],
      tips: 'Make it interactive by testing different body functions!'
    },
    {
      id: 'ff_006',
      title: 'Plant Power',
      description: 'Discover amazing abilities and facts about plants',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '20-30 min',
      ageGroup: '5-10 years',
      instructions: [
        'Learn how plants "eat" sunlight through photosynthesis',
        'Discover plants that move (sensitive plant, Venus flytrap)',
        'Find the biggest and smallest plants in the world',
        'Create a plant fact collection'
      ],
      materials: ['Plant books', 'Magnifying glass', 'Notebook', 'House plants'],
      learningGoals: ['Botany', 'Photosynthesis concepts', 'Plant diversity'],
      funFacts: [
        'Some bamboo can grow 3 feet in one day!',
        'The largest living thing on Earth is a fungus in Oregon',
        'Bananas are berries, but strawberries aren\'t!',
        'Some plants can live for thousands of years'
      ],
      tips: 'Look for plants around your home to observe closely!'
    },
    {
      id: 'ff_007',
      title: 'Ancient Civilizations',
      description: 'Explore fascinating facts about people from long ago',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      duration: '25-35 min',
      ageGroup: '6-12 years',
      instructions: [
        'Learn about pyramids and how they were built',
        'Discover what children did in ancient times',
        'Compare ancient inventions to modern ones',
        'Create your own "ancient artifact"'
      ],
      materials: ['History books', 'Clay or playdough', 'Drawing supplies'],
      learningGoals: ['Historical awareness', 'Cultural understanding', 'Timeline concepts'],
      funFacts: [
        'Ancient Egyptians used toothpaste made from ox hooves!',
        'The Great Wall of China took over 1,000 years to build',
        'Ancient Romans had fast food restaurants',
        'Vikings actually wore colorful clothes, not just brown and gray'
      ],
      tips: 'Connect ancient life to modern equivalents kids understand!'
    },
    {
      id: 'ff_008',
      title: 'Food Around the World',
      description: 'Discover amazing facts about foods from different countries',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-25 min',
      ageGroup: '4-10 years',
      instructions: [
        'Learn about unusual fruits from other countries',
        'Discover how chocolate and pizza were invented',
        'Find out what kids eat for breakfast around the world',
        'Try to guess which country different foods come from'
      ],
      materials: ['World map', 'Food pictures', 'Globe (if available)'],
      learningGoals: ['Cultural awareness', 'Geography', 'Nutrition basics'],
      funFacts: [
        'Honey never spoils - 3,000-year-old honey is still good to eat!',
        'Carrots used to be purple, not orange',
        'Ice cream was once only for royalty',
        'Apples float because they are 25% air'
      ],
      tips: 'If possible, try tasting foods from different cultures!'
    }
  ],

  // 🔬 SCIENCE & NATURE (15 activities)
  science_nature: [
    {
      id: 'sn_001',
      title: 'Rainbow in a Glass',
      description: 'Create colorful density layers using household liquids',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '20-30 min',
      ageGroup: '4-10 years',
      instructions: [
        'Gather honey, dish soap, water (with food coloring), and oil',
        'Slowly pour each liquid into a clear glass',
        'Observe how they separate into layers',
        'Discuss why some liquids float on others'
      ],
      materials: ['Clear glass', 'Honey', 'Dish soap', 'Water', 'Oil', 'Food coloring'],
      learningGoals: ['Density concepts', 'Scientific observation', 'Prediction skills'],
      safetyTips: ['Adult supervision required', 'Handle materials carefully'],
      tips: 'Pour very slowly to create distinct layers!'
    },
    {
      id: 'sn_002',
      title: 'Plant Growth Journal',
      description: 'Track and document how seeds grow into plants',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '10 min daily for 2-3 weeks',
      ageGroup: '3-8 years',
      instructions: [
        'Plant seeds in small pots with soil',
        'Water gently and place in sunlight',
        'Measure and draw plant growth daily',
        'Record observations in a journal'
      ],
      materials: ['Seeds (beans work well)', 'Small pots', 'Soil', 'Ruler', 'Journal', 'Colored pencils'],
      learningGoals: ['Plant biology', 'Measurement', 'Scientific documentation', 'Patience'],
      tips: 'Bean seeds sprout quickly and are easy for kids to observe!'
    },
    {
      id: 'sn_003',
      title: 'Magnetic Magic',
      description: 'Explore the invisible forces of magnetism through experiments',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '20-30 min',
      ageGroup: '3-8 years',
      instructions: [
        'Test different objects to see which are magnetic',
        'Try making a compass with a needle and magnet',
        'Explore magnetic fields with iron filings or paper clips',
        'Play magnetic fishing with paper clips and a magnet'
      ],
      materials: ['Strong magnets', 'Various small objects', 'Paper clips', 'Bowl of water', 'Iron filings (optional)'],
      learningGoals: ['Magnetism concepts', 'Scientific method', 'Prediction skills', 'Properties of materials'],
      safetyTips: ['Keep magnets away from electronics', 'Adult supervision with small objects'],
      tips: 'Let kids predict first, then test their hypotheses!'
    },
    {
      id: 'sn_004',
      title: 'Water Cycle in a Bag',
      description: 'Create a mini water cycle to understand evaporation and condensation',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '30 min setup + daily observation',
      ageGroup: '4-10 years',
      instructions: [
        'Fill a clear plastic bag halfway with water',
        'Add a few drops of blue food coloring',
        'Seal the bag and tape it to a sunny window',
        'Observe daily and record changes you see'
      ],
      materials: ['Clear plastic bags', 'Water', 'Blue food coloring', 'Tape', 'Observation journal'],
      learningGoals: ['Water cycle understanding', 'Evaporation', 'Condensation', 'Scientific observation'],
      tips: 'Draw pictures of changes you observe each day!'
    },
    {
      id: 'sn_005',
      title: 'Static Electricity Experiments',
      description: 'Explore the power of static electricity with safe, fun experiments',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-25 min',
      ageGroup: '4-9 years',
      instructions: [
        'Rub a balloon on your hair and pick up small pieces of paper',
        'Make your hair stand up with the balloon',
        'Try separating salt and pepper using static electricity',
        'Create "dancing" tissue paper with static'
      ],
      materials: ['Balloons', 'Small pieces of paper', 'Salt', 'Pepper', 'Tissue paper', 'Plastic comb'],
      learningGoals: ['Static electricity', 'Electrical charges', 'Cause and effect', 'Scientific observation'],
      safetyTips: ['Only use balloons and safe materials', 'Adult supervision recommended'],
      tips: 'Works best on dry days - humidity reduces static electricity!'
    },
    {
      id: 'sn_006',
      title: 'Crystal Garden',
      description: 'Grow your own crystals and learn about crystal formation',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '30 min setup + 1-2 weeks observation',
      ageGroup: '5-12 years',
      instructions: [
        'Create a supersaturated salt or sugar solution with hot water',
        'Hang a string in the solution',
        'Place in a quiet spot where it won\'t be disturbed',
        'Observe crystal growth over several days'
      ],
      materials: ['Salt or sugar', 'Hot water', 'String', 'Clear jars', 'Magnifying glass'],
      learningGoals: ['Crystal formation', 'Supersaturation', 'Patience', 'Scientific observation'],
      safetyTips: ['Adult help needed with hot water', 'Handle crystals gently'],
      tips: 'Try different materials like Epsom salt for different crystal shapes!'
    },
    {
      id: 'sn_007',
      title: 'Volcano Eruption',
      description: 'Create a safe volcano eruption and learn about chemical reactions',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '25-35 min',
      ageGroup: '4-10 years',
      instructions: [
        'Build a volcano shape around a small bottle using clay or playdough',
        'Mix baking soda, red food coloring, and dish soap in the bottle',
        'Add vinegar and watch the eruption!',
        'Discuss what happens when acids and bases mix'
      ],
      materials: ['Small plastic bottle', 'Baking soda', 'White vinegar', 'Red food coloring', 'Dish soap', 'Clay or playdough'],
      learningGoals: ['Chemical reactions', 'Acids and bases', 'Volcano science', 'Cause and effect'],
      safetyTips: ['Do this experiment outdoors or in a sink', 'Protect clothing'],
      tips: 'Make it more realistic by building a landscape around your volcano!'
    },
    {
      id: 'sn_008',
      title: 'Solar Oven Cooking',
      description: 'Harness the power of the sun to cook food and learn about solar energy',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      duration: '45-60 min',
      ageGroup: '6-12 years',
      instructions: [
        'Line a cardboard box with black paper and aluminum foil',
        'Place a clear plastic cover over the top',
        'Put food (like s\'mores ingredients) inside',
        'Angle toward the sun and wait for solar cooking!'
      ],
      materials: ['Cardboard box', 'Black paper', 'Aluminum foil', 'Clear plastic wrap', 'Food to cook', 'Thermometer'],
      learningGoals: ['Solar energy', 'Heat transfer', 'Renewable energy', 'Engineering design'],
      safetyTips: ['Adult supervision with food handling', 'Check food temperature before eating'],
      tips: 'Works best on sunny days with temperatures above 70°F!'
    },
    {
      id: 'sn_009',
      title: 'Weather Station',
      description: 'Build instruments to measure and track weather patterns',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '40-50 min setup + daily use',
      ageGroup: '5-11 years',
      instructions: [
        'Make a rain gauge with a clear container and ruler',
        'Create a wind vane using a straw and clay',
        'Build a barometer with a balloon and jar',
        'Record daily weather measurements'
      ],
      materials: ['Clear containers', 'Rulers', 'Straws', 'Clay', 'Balloons', 'Jars', 'Weather journal'],
      learningGoals: ['Meteorology', 'Measurement', 'Data collection', 'Weather patterns'],
      tips: 'Compare your measurements with official weather reports!'
    },
    {
      id: 'sn_010',
      title: 'Sink or Float Science',
      description: 'Explore density and buoyancy through prediction and testing',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '20-30 min',
      ageGroup: '3-7 years',
      instructions: [
        'Gather various household objects',
        'Predict which will sink and which will float',
        'Test each object in water',
        'Group objects by results and discuss why'
      ],
      materials: ['Large bowl of water', 'Various objects (cork, coin, apple, etc.)', 'Towels', 'Prediction chart'],
      learningGoals: ['Density concepts', 'Prediction skills', 'Scientific method', 'Properties of materials'],
      tips: 'Try surprising objects like grapes vs. raisins to spark curiosity!'
    },
    {
      id: 'sn_011',
      title: 'Invisible Ink Messages',
      description: 'Create secret messages using chemical reactions with household items',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '25-35 min',
      ageGroup: '5-10 years',
      instructions: [
        'Write messages with lemon juice using a cotton swab',
        'Let the paper dry completely',
        'Hold the paper near (not touching) a warm light bulb',
        'Watch your secret message appear!'
      ],
      materials: ['Lemon juice', 'Cotton swabs', 'White paper', 'Warm light bulb or iron (adult use)'],
      learningGoals: ['Chemical reactions', 'Heat effects', 'Problem solving', 'Following procedures'],
      safetyTips: ['Adult supervision with heat sources', 'Never touch hot surfaces'],
      tips: 'Try other invisible inks like milk or baking soda solutions!'
    },
    {
      id: 'sn_012',
      title: 'Sound Wave Experiments',
      description: 'Explore how sound travels through different materials and vibrations',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '30-40 min',
      ageGroup: '4-9 years',
      instructions: [
        'Make a telephone with two cups and string',
        'Test how sound travels through different materials',
        'Create different pitches by changing water levels in glasses',
        'Feel vibrations by placing hands on speakers'
      ],
      materials: ['Plastic cups', 'String', 'Various materials (wood, metal, etc.)', 'Glasses', 'Water'],
      learningGoals: ['Sound waves', 'Vibrations', 'Sound transmission', 'Pitch concepts'],
      tips: 'Keep the string tight for the cup telephone to work best!'
    },
    {
      id: 'sn_013',
      title: 'Light and Shadows',
      description: 'Investigate how light creates shadows and changes throughout the day',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '25-35 min',
      ageGroup: '3-8 years',
      instructions: [
        'Use a flashlight to create shadows on the wall',
        'Make hand shadow puppets and tell stories',
        'Track how outdoor shadows change during the day',
        'Experiment with colored transparent materials'
      ],
      materials: ['Flashlight', 'Various objects', 'Colored cellophane', 'White wall or sheet'],
      learningGoals: ['Light properties', 'Shadow formation', 'Time concepts', 'Creative expression'],
      tips: 'Try making shadows with multiple light sources for interesting effects!'
    },
    {
      id: 'sn_014',
      title: 'Nature\'s Patterns',
      description: 'Discover mathematical patterns that exist in nature around us',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '30-45 min',
      ageGroup: '5-11 years',
      instructions: [
        'Look for spirals in shells, flowers, and plants',
        'Count petals on different flowers',
        'Find symmetry in leaves and butterflies',
        'Create art based on natural patterns you discover'
      ],
      materials: ['Magnifying glass', 'Notebook', 'Ruler', 'Art supplies', 'Nature items'],
      learningGoals: ['Pattern recognition', 'Mathematics in nature', 'Observation skills', 'Art integration'],
      tips: 'Look for Fibonacci spirals in pinecones and sunflowers!'
    },
    {
      id: 'sn_015',
      title: 'Recycling Laboratory',
      description: 'Learn about environmental science through hands-on recycling experiments',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '35-45 min',
      ageGroup: '5-12 years',
      instructions: [
        'Sort household items by recyclable materials',
        'Create new items from recycled materials',
        'Test how long different materials take to decompose',
        'Design a mini recycling system'
      ],
      materials: ['Various recyclable items', 'Craft supplies', 'Soil samples', 'Clear containers'],
      learningGoals: ['Environmental science', 'Sustainability', 'Material properties', 'Creative problem solving'],
      tips: 'Connect recycling to protecting animal habitats and clean water!'
    }
  ],

  // 😊 FEELINGS (10 activities)
  feelings: [
    {
      id: 'f_001',
      title: 'Emotion Faces Mirror',
      description: 'Practice identifying and expressing different emotions',
      type: ACTIVITY_TYPES.PRACTICE_EXERCISE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '10-15 min',
      ageGroup: '2-6 years',
      instructions: [
        'Look in a mirror together',
        'Make different emotion faces (happy, sad, surprised, angry)',
        'Name each emotion as you make the face',
        'Talk about when you might feel each emotion'
      ],
      materials: ['Mirror', 'Emotion cards (optional)'],
      learningGoals: ['Emotional literacy', 'Self-awareness', 'Communication'],
      tips: 'Start with basic emotions and gradually add more complex ones!'
    },
    {
      id: 'f_002',
      title: 'Feelings Weather Report',
      description: 'Use weather metaphors to describe emotions',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '15-20 min',
      ageGroup: '4-8 years',
      instructions: [
        'Talk about how feelings can be like weather',
        'Happy = sunny, sad = rainy, angry = stormy',
        'Create a daily feelings weather report',
        'Draw weather symbols for different emotions'
      ],
      materials: ['Paper', 'Crayons', 'Weather symbol stickers (optional)'],
      learningGoals: ['Emotional vocabulary', 'Metaphorical thinking', 'Self-reflection'],
      tips: 'Let your child create their own feeling-weather connections!'
    },
    {
      id: 'f_003',
      title: 'Emotion Charades',
      description: 'Act out different feelings for others to guess',
      type: ACTIVITY_TYPES.ROLE_PLAY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-20 min',
      ageGroup: '3-10 years',
      instructions: [
        'Write different emotions on cards',
        'Take turns acting out feelings without words',
        'Guess the emotion being shown',
        'Discuss when you might feel that way'
      ],
      materials: ['Emotion cards', 'Timer'],
      learningGoals: ['Emotion recognition', 'Non-verbal communication', 'Empathy', 'Social skills'],
      tips: 'Start with basic emotions like happy, sad, angry, scared!'
    },
    {
      id: 'f_004',
      title: 'Gratitude Garden',
      description: 'Create a visual representation of things you\'re thankful for',
      type: ACTIVITY_TYPES.CREATIVE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '20-30 min',
      ageGroup: '4-12 years',
      instructions: [
        'Draw a large tree on paper',
        'Cut out leaf shapes from colored paper',
        'Write one thing you\'re grateful for on each leaf',
        'Glue leaves to your gratitude tree'
      ],
      materials: ['Large paper', 'Colored paper', 'Scissors', 'Glue', 'Markers or crayons'],
      learningGoals: ['Gratitude practice', 'Positive thinking', 'Fine motor skills', 'Self-reflection'],
      tips: 'Add new leaves throughout the week as you think of more things!'
    },
    {
      id: 'f_005',
      title: 'Calming Breathing Buddies',
      description: 'Learn relaxation techniques through guided breathing with stuffed animals',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '10-15 min',
      ageGroup: '3-8 years',
      instructions: [
        'Lie down and place a stuffed animal on your belly',
        'Breathe slowly and watch your buddy rise and fall',
        'Count to 4 while breathing in, hold for 2, out for 4',
        'Practice different breathing patterns together'
      ],
      materials: ['Stuffed animals or small toys', 'Comfortable space to lie down'],
      learningGoals: ['Self-regulation', 'Anxiety management', 'Mindfulness', 'Body awareness'],
      tips: 'Practice when calm so you can use this technique when upset!'
    },
    {
      id: 'f_006',
      title: 'Kindness Rock Garden',
      description: 'Paint rocks with positive messages to spread kindness in your community',
      type: ACTIVITY_TYPES.CREATIVE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '30-45 min',
      ageGroup: '4-12 years',
      instructions: [
        'Collect smooth, clean rocks from outside',
        'Paint them with bright colors and positive messages',
        'Let them dry completely',
        'Hide them around your neighborhood for others to find'
      ],
      materials: ['Smooth rocks', 'Acrylic paints', 'Small brushes', 'Markers', 'Clear sealant spray'],
      learningGoals: ['Kindness', 'Community service', 'Creativity', 'Positive messaging'],
      safetyTips: ['Adult help with spray sealant', 'Choose safe hiding spots'],
      tips: 'Write messages like "You are loved" or "You make a difference"!'
    },
    {
      id: 'f_007',
      title: 'Emotion Color Mixing',
      description: 'Explore how different emotions can be represented through colors and art',
      type: ACTIVITY_TYPES.CREATIVE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '25-35 min',
      ageGroup: '4-10 years',
      instructions: [
        'Discuss what colors represent different emotions',
        'Mix paints to create "emotion colors"',
        'Create abstract paintings showing different feelings',
        'Share your artwork and explain your color choices'
      ],
      materials: ['Paints (red, blue, yellow, white, black)', 'Brushes', 'Paper', 'Mixing plates'],
      learningGoals: ['Emotional expression', 'Color theory', 'Art therapy', 'Creative communication'],
      tips: 'There are no wrong answers - let children express emotions their way!'
    },
    {
      id: 'f_008',
      title: 'Compliment Circle',
      description: 'Build self-esteem and social skills through structured positive feedback',
      type: ACTIVITY_TYPES.SOCIAL,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '15-20 min',
      ageGroup: '4-12 years',
      instructions: [
        'Sit in a circle with family or friends',
        'Take turns giving genuine compliments to each person',
        'Focus on character traits, not just appearance',
        'Write down compliments you receive to remember later'
      ],
      materials: ['Paper and pencils (optional)', 'Comfortable seating arrangement'],
      learningGoals: ['Self-esteem', 'Social skills', 'Positive communication', 'Empathy'],
      tips: 'Model specific compliments like "You are a good listener" or "You help others"!'
    },
    {
      id: 'f_009',
      title: 'Worry Monsters',
      description: 'Create friendly monsters that "eat" worries to help manage anxiety',
      type: ACTIVITY_TYPES.CREATIVE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '30-40 min',
      ageGroup: '4-10 years',
      instructions: [
        'Decorate a tissue box or small container as a monster',
        'Give it a friendly face and big mouth opening',
        'Write worries on small pieces of paper',
        'Feed your worries to the worry monster'
      ],
      materials: ['Tissue boxes or containers', 'Craft supplies', 'Paper', 'Pencils'],
      learningGoals: ['Anxiety management', 'Worry processing', 'Creative expression', 'Emotional regulation'],
      tips: 'Make the monster friendly and helpful, not scary!'
    },
    {
      id: 'f_010',
      title: 'Feeling Thermometer',
      description: 'Learn to identify and measure the intensity of emotions',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '20-25 min',
      ageGroup: '5-12 years',
      instructions: [
        'Draw a thermometer with numbers 1-10',
        'Practice rating different emotions on the scale',
        'Role-play situations and rate how they would feel',
        'Discuss strategies for when feelings get too high'
      ],
      materials: ['Paper', 'Markers or colored pencils', 'Lamination (optional)'],
      learningGoals: ['Emotional awareness', 'Self-monitoring', 'Coping strategies', 'Communication skills'],
      tips: 'Use this daily to help children communicate their emotional state!'
    }
  ],

  // 🎨 ARTS & CRAFTS (18 activities)
  arts_crafts: [
    {
      id: 'ac_001',
      title: 'Nature Collage Art',
      description: 'Create beautiful artwork using natural materials',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '30-45 min',
      ageGroup: '3-10 years',
      instructions: [
        'Go on a nature walk to collect leaves, flowers, twigs',
        'Arrange materials on paper to create pictures',
        'Glue down your nature arrangement',
        'Add details with crayons or markers if desired'
      ],
      materials: ['Paper or cardboard', 'Glue', 'Natural materials', 'Crayons (optional)'],
      learningGoals: ['Creativity', 'Fine motor skills', 'Nature appreciation', 'Artistic composition'],
      tips: 'Press flowers and leaves flat first for better gluing!'
    },
    {
      id: 'ac_002',
      title: 'Story Illustration Book',
      description: 'Create your own illustrated storybook',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '45-60 min',
      ageGroup: '4-10 years',
      instructions: [
        'Think of a simple story together',
        'Fold paper to create a small book',
        'Write or dictate the story on each page',
        'Illustrate each page with drawings'
      ],
      materials: ['Paper', 'Stapler or yarn', 'Crayons/markers', 'Pencil'],
      learningGoals: ['Storytelling', 'Art skills', 'Fine motor development', 'Creative expression'],
      tips: 'Keep stories simple - even 4-5 pages makes a great book!'
    },
    {
      id: 'ac_003',
      title: 'Paper Plate Animals',
      description: 'Transform paper plates into colorful animal characters',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '25-35 min',
      ageGroup: '3-8 years',
      instructions: [
        'Choose an animal to create',
        'Paint or color the paper plate as the animal\'s face',
        'Cut out ears, nose, and other features from construction paper',
        'Glue features onto the plate to complete your animal'
      ],
      materials: ['Paper plates', 'Paint or crayons', 'Construction paper', 'Scissors', 'Glue'],
      learningGoals: ['Animal recognition', 'Fine motor skills', 'Color recognition', 'Following instructions'],
      tips: 'Popular animals include lions, cats, pigs, and owls!'
    },
    {
      id: 'ac_004',
      title: 'Handprint Family Tree',
      description: 'Create a meaningful family keepsake using handprints as leaves',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '40-50 min',
      ageGroup: '4-12 years',
      instructions: [
        'Draw a tree trunk and branches on large paper',
        'Dip hands in different colored paints',
        'Press handprints as leaves around the branches',
        'Write family member names on each handprint'
      ],
      materials: ['Large paper', 'Brown paint/crayon', 'Various colored paints', 'Markers'],
      learningGoals: ['Family identity', 'Fine motor skills', 'Color mixing', 'Personal expression'],
      tips: 'Use different colors for different generations or family branches!'
    },
    {
      id: 'ac_005',
      title: 'Salt Dough Sculptures',
      description: 'Make and sculpt with homemade salt dough',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '60-90 min (including drying)',
      ageGroup: '4-12 years',
      instructions: [
        'Mix 2 cups flour, 1 cup salt, 1 cup water to make dough',
        'Knead until smooth',
        'Shape into animals, flowers, or other objects',
        'Let air dry for 24 hours or bake at 200°F for 3 hours'
      ],
      materials: ['Flour', 'Salt', 'Water', 'Sculpting tools (optional)', 'Paint (for later)'],
      learningGoals: ['Following recipes', 'Sculpting skills', 'Patience', 'Three-dimensional thinking'],
      safetyTips: ['Adult supervision with oven use'],
      tips: 'Add food coloring to the dough for colored sculptures!'
    },
    {
      id: 'ac_006',
      title: 'Coffee Filter Rainbows',
      description: 'Explore color mixing while creating beautiful rainbow art',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '20-30 min',
      ageGroup: '3-9 years',
      instructions: [
        'Fold coffee filters into triangles',
        'Dip corners into different colored water',
        'Watch colors spread and blend through the filter',
        'Unfold to reveal your unique rainbow pattern'
      ],
      materials: ['Coffee filters', 'Food coloring', 'Water', 'Small cups', 'Paper towels'],
      learningGoals: ['Color theory', 'Scientific observation', 'Fine motor skills', 'Pattern recognition'],
      tips: 'Use primary colors and watch them mix into secondary colors!'
    },
    {
      id: 'ac_007',
      title: 'Texture Rubbings Collection',
      description: 'Discover textures around your home and create art with them',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '30-40 min',
      ageGroup: '3-10 years',
      instructions: [
        'Find textured surfaces (tree bark, coins, leaves, fabric)',
        'Place paper over the texture',
        'Rub crayon or pencil over the paper to reveal the pattern',
        'Create a collection book of different textures'
      ],
      materials: ['Thin paper', 'Crayons or pencils', 'Various textured objects', 'Notebook'],
      learningGoals: ['Texture awareness', 'Fine motor skills', 'Observation skills', 'Art techniques'],
      tips: 'Try different colors for the same texture to create variety!'
    },
    {
      id: 'ac_008',
      title: 'Recycled Robot Workshop',
      description: 'Build creative robots using recyclable materials',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '45-60 min',
      ageGroup: '5-12 years',
      instructions: [
        'Collect boxes, tubes, bottle caps, and other recyclables',
        'Design your robot on paper first',
        'Assemble pieces using glue and tape',
        'Decorate with paint, markers, or stickers'
      ],
      materials: ['Recyclable materials', 'Glue', 'Tape', 'Paint', 'Markers', 'Aluminum foil'],
      learningGoals: ['Engineering thinking', 'Problem solving', 'Environmental awareness', 'Creative planning'],
      tips: 'Give your robot a name and story about what it does!'
    },
    {
      id: 'ac_009',
      title: 'Butterfly Coffee Filter Art',
      description: 'Create delicate butterfly art using coffee filters and clothes pins',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '25-35 min',
      ageGroup: '3-8 years',
      instructions: [
        'Color coffee filters with washable markers',
        'Spray lightly with water to blend colors',
        'Let dry, then gather in the middle with a clothespin',
        'Add pipe cleaner antennae to complete your butterfly'
      ],
      materials: ['Coffee filters', 'Washable markers', 'Spray bottle', 'Clothespins', 'Pipe cleaners'],
      learningGoals: ['Color blending', 'Fine motor skills', 'Scientific observation', 'Nature study'],
      tips: 'Hang your butterflies around the room for a beautiful display!'
    },
    {
      id: 'ac_010',
      title: 'Magic Milk Science Art',
      description: 'Create swirling color patterns while learning about surface tension',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '20-30 min',
      ageGroup: '4-10 years',
      instructions: [
        'Pour milk in a shallow dish',
        'Add drops of different food coloring around the edges',
        'Dip cotton swab in dish soap, then touch the milk',
        'Watch the amazing color explosions and swirls!'
      ],
      materials: ['Whole milk', 'Food coloring', 'Dish soap', 'Cotton swabs', 'Shallow dishes'],
      learningGoals: ['Scientific observation', 'Color mixing', 'Cause and effect', 'Art through science'],
      tips: 'Whole milk works better than skim milk for this experiment!'
    },
    {
      id: 'ac_011',
      title: 'Sock Puppet Theater',
      description: 'Create sock puppets and put on your own puppet show',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '50-70 min',
      ageGroup: '4-12 years',
      instructions: [
        'Decorate clean socks with buttons, yarn, and fabric scraps',
        'Create different characters with unique personalities',
        'Set up a puppet theater using a cardboard box',
        'Write and perform a short puppet show'
      ],
      materials: ['Clean socks', 'Buttons', 'Yarn', 'Fabric scraps', 'Glue', 'Cardboard box'],
      learningGoals: ['Character development', 'Storytelling', 'Performance skills', 'Creative expression'],
      tips: 'Give each puppet a different voice and personality!'
    },
    {
      id: 'ac_012',
      title: 'Painted Rock Story Stones',
      description: 'Create story-telling rocks that inspire creative narratives',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '45-60 min',
      ageGroup: '5-12 years',
      instructions: [
        'Collect smooth, clean rocks of various sizes',
        'Paint simple images on each rock (animals, objects, people)',
        'Let rocks dry completely',
        'Use rocks to inspire and tell creative stories'
      ],
      materials: ['Smooth rocks', 'Acrylic paint', 'Small brushes', 'Permanent markers', 'Storage bag'],
      learningGoals: ['Storytelling', 'Narrative skills', 'Creative thinking', 'Art techniques'],
      tips: 'Include a mix of characters, settings, and objects for more story possibilities!'
    },
    {
      id: 'ac_013',
      title: 'Woven Paper Placemats',
      description: 'Learn basic weaving techniques while creating functional art',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '35-45 min',
      ageGroup: '5-11 years',
      instructions: [
        'Cut strips in one piece of construction paper, leaving borders',
        'Cut separate strips from different colored paper',
        'Weave the loose strips through the cuts in the first paper',
        'Glue ends down to secure your woven placemat'
      ],
      materials: ['Construction paper in various colors', 'Scissors', 'Glue', 'Ruler'],
      learningGoals: ['Pattern recognition', 'Fine motor skills', 'Following sequences', 'Functional art'],
      tips: 'Alternate colors to create interesting checkerboard patterns!'
    },
    {
      id: 'ac_014',
      title: 'Nature Paintbrushes',
      description: 'Make art tools from natural materials and create unique textures',
      type: ACTIVITY_TYPES.EXPLORATION,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '40-50 min',
      ageGroup: '3-10 years',
      instructions: [
        'Collect items like pine needles, leaves, flowers, and twigs',
        'Attach natural items to sticks with rubber bands',
        'Dip your nature brushes in paint',
        'Experiment with different textures and patterns on paper'
      ],
      materials: ['Natural materials', 'Sticks', 'Rubber bands', 'Paint', 'Paper'],
      learningGoals: ['Nature exploration', 'Texture awareness', 'Creative problem solving', 'Art experimentation'],
      tips: 'Different materials create completely different painting effects!'
    },
    {
      id: 'ac_015',
      title: 'Melted Crayon Art',
      description: 'Create flowing rainbow art using the heat of the sun or hair dryer',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      duration: '30-45 min',
      ageGroup: '6-12 years',
      instructions: [
        'Tape old crayons to the top edge of a canvas or thick paper',
        'Place the artwork outside on a hot day or use a hair dryer',
        'Watch as crayons melt and create flowing color streams',
        'Stop when you like the pattern created'
      ],
      materials: ['Old crayons', 'Canvas or thick paper', 'Tape', 'Hair dryer (optional)'],
      learningGoals: ['Heat effects on materials', 'Color mixing', 'Process art', 'Scientific observation'],
      safetyTips: ['Adult supervision with hair dryer', 'Protect work surface'],
      tips: 'Arrange crayons in rainbow order for the most dramatic effect!'
    },
    {
      id: 'ac_016',
      title: 'Puffy Paint Creations',
      description: 'Make textured art with homemade puffy paint',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '40-50 min',
      ageGroup: '4-10 years',
      instructions: [
        'Mix equal parts shaving cream, white glue, and food coloring',
        'Paint pictures with your puffy paint mixture',
        'Let dry for several hours to maintain the puffy texture',
        'Create landscapes, flowers, or abstract designs'
      ],
      materials: ['Shaving cream', 'White school glue', 'Food coloring', 'Paper', 'Plastic spoons'],
      learningGoals: ['Texture exploration', 'Following recipes', 'Sensory experience', 'Art techniques'],
      tips: 'The paint will stay puffy as it dries - don\'t flatten it!'
    },
    {
      id: 'ac_017',
      title: 'Marble Rolling Paint',
      description: 'Create dynamic patterns by rolling marbles through paint',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '25-35 min',
      ageGroup: '3-9 years',
      instructions: [
        'Place paper in a shallow box or tray',
        'Add small drops of paint in different colors',
        'Drop marbles into the box with the paint',
        'Tilt and roll the box to move marbles through paint'
      ],
      materials: ['Shallow box', 'Paper', 'Paint', 'Marbles', 'Spoons'],
      learningGoals: ['Cause and effect', 'Color mixing', 'Physics concepts', 'Process art'],
      safetyTips: ['Supervise young children with marbles'],
      tips: 'Try different sized balls or objects for varied effects!'
    },
    {
      id: 'ac_018',
      title: 'Collaborative Family Mural',
      description: 'Work together to create a large-scale family art project',
      type: ACTIVITY_TYPES.CREATIVE_PROJECT,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '60-90 min (can be done over multiple sessions)',
      ageGroup: '3-12 years',
      instructions: [
        'Cover a large wall area with butcher paper',
        'Choose a theme (family tree, underwater scene, space adventure)',
        'Let each family member contribute their own section',
        'Work together on connecting elements and background'
      ],
      materials: ['Large paper roll', 'Tape', 'Various art supplies', 'Paint', 'Markers'],
      learningGoals: ['Collaboration', 'Planning skills', 'Family bonding', 'Large-scale thinking'],
      tips: 'Take photos of the process and display your mural proudly!'
    }
  ],

  // 🎭 ROLE PLAY (6 activities)
  role_play: [
    {
      id: 'rp_001',
      title: 'Community Helper Heroes',
      description: 'Pretend to be different community workers',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '20-30 min',
      ageGroup: '3-8 years',
      instructions: [
        'Choose community helpers (firefighter, doctor, teacher, etc.)',
        'Use props or costumes if available',
        'Act out what each helper does',
        'Create scenarios where helpers solve problems'
      ],
      materials: ['Costumes or props (optional)', 'Cardboard boxes for vehicles', 'Toy tools'],
      learningGoals: ['Social awareness', 'Empathy', 'Problem-solving', 'Career awareness'],
      tips: 'Let your child lead the scenarios and be creative!'
    },
    {
      id: 'rp_002',
      title: 'Restaurant Adventure',
      description: 'Set up and run a pretend restaurant together',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '25-40 min',
      ageGroup: '4-9 years',
      instructions: [
        'Set up a restaurant area with table and chairs',
        'Create menus with pictures and prices',
        'Take turns being customer, chef, and waiter',
        'Practice polite conversation and ordering'
      ],
      materials: ['Table and chairs', 'Play food or pictures', 'Notepad for orders', 'Play money'],
      learningGoals: ['Social skills', 'Math concepts', 'Communication', 'Service orientation'],
      tips: 'Include writing practice by having them write down orders!'
    },
    {
      id: 'rp_003',
      title: 'Veterinarian Clinic',
      description: 'Care for stuffed animals and dolls as a pretend veterinarian',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '30-45 min',
      ageGroup: '4-10 years',
      instructions: [
        'Set up a veterinary clinic with stuffed animals as patients',
        'Create patient charts and appointment schedules',
        'Use toy medical tools to "examine" animals',
        'Discuss how to care for pets and show gentleness'
      ],
      materials: ['Stuffed animals', 'Toy medical kit', 'Clipboards', 'Bandages', 'Pet care books'],
      learningGoals: ['Empathy', 'Caring behavior', 'Animal knowledge', 'Medical awareness'],
      tips: 'Teach real pet care facts while playing!'
    },
    {
      id: 'rp_004',
      title: 'Space Exploration Mission',
      description: 'Blast off on an imaginary journey to explore planets and stars',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      duration: '35-50 min',
      ageGroup: '5-12 years',
      instructions: [
        'Build a spaceship using chairs and blankets',
        'Plan a mission to visit different planets',
        'Pack supplies for space travel',
        'Encounter aliens and discover new worlds together'
      ],
      materials: ['Chairs', 'Blankets', 'Flashlights', 'Walkie-talkies (optional)', 'Space books'],
      learningGoals: ['Imagination', 'Science concepts', 'Problem-solving', 'Teamwork'],
      tips: 'Research real space facts to include in your adventure!'
    },
    {
      id: 'rp_005',
      title: 'Grocery Store Shopping',
      description: 'Practice real-world skills through pretend grocery shopping',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      duration: '20-35 min',
      ageGroup: '3-8 years',
      instructions: [
        'Set up store shelves with play food or empty containers',
        'Create shopping lists with pictures and words',
        'Take turns being shopkeeper and customer',
        'Practice counting money and making change'
      ],
      materials: ['Play food', 'Empty containers', 'Shopping baskets', 'Play money', 'Cash register (optional)'],
      learningGoals: ['Math skills', 'Planning', 'Social interaction', 'Life skills'],
      tips: 'Include healthy food choices in your pretend shopping!'
    },
    {
      id: 'rp_006',
      title: 'Time Travel Adventures',
      description: 'Journey to different time periods and learn about history',
      type: ACTIVITY_TYPES.INTERACTIVE_GAME,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      duration: '40-60 min',
      ageGroup: '6-12 years',
      instructions: [
        'Choose different historical periods to visit',
        'Dress up in period-appropriate costumes if available',
        'Research what life was like in each time period',
        'Act out daily life, meet historical figures, and solve period problems'
      ],
      materials: ['Costume pieces', 'History books', 'Props related to time periods', 'Art supplies'],
      learningGoals: ['Historical knowledge', 'Cultural awareness', 'Research skills', 'Creative thinking'],
      tips: 'Include dinosaurs, ancient Egypt, medieval times, or the wild west!'
    }
  ]
};

// Helper Functions
export const getCategoriesList = () => Object.values(LEARNING_CATEGORIES);

export const getActivitiesByCategory = (categoryId) => {
  return LEARNING_ACTIVITIES[categoryId] || [];
};

export const getActivityById = (activityId) => {
  for (const categoryActivities of Object.values(LEARNING_ACTIVITIES)) {
    const activity = categoryActivities.find(a => a.id === activityId);
    if (activity) return activity;
  }
  return null;
};

export const getActivitiesByDifficulty = (categoryId, difficulty) => {
  const activities = getActivitiesByCategory(categoryId);
  return activities.filter(activity => activity.difficulty.id === difficulty);
};

export const getActivitiesByAgeGroup = (categoryId, minAge, maxAge) => {
  const activities = getActivitiesByCategory(categoryId);
  return activities.filter(activity => {
    // Parse age group like "3-8 years" to check if it overlaps with minAge-maxAge
    const ageMatch = activity.ageGroup.match(/(\d+)-(\d+)/);
    if (ageMatch) {
      const activityMinAge = parseInt(ageMatch[1]);
      const activityMaxAge = parseInt(ageMatch[2]);
      return !(maxAge < activityMinAge || minAge > activityMaxAge);
    }
    return true;
  });
};

export const searchActivities = (query) => {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  for (const [categoryId, activities] of Object.entries(LEARNING_ACTIVITIES)) {
    const category = getCategoriesList().find(c => c.id === categoryId);
    activities.forEach(activity => {
      if (
        activity.title.toLowerCase().includes(lowerQuery) ||
        activity.description.toLowerCase().includes(lowerQuery) ||
        activity.learningGoals.some(goal => goal.toLowerCase().includes(lowerQuery))
      ) {
        results.push({ ...activity, category });
      }
    });
  }
  
  return results;
};