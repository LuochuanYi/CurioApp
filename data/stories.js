// 📚 CurioApp Story Library
// Complete story database with multiple categories and rich content

export const STORY_CATEGORIES = {
  BEDTIME: { id: 'bedtime', name: 'Bedtime', icon: '🌙', color: '#9b6bcc' },
  CLASSIC: { id: 'classic', name: 'Classic Tales', icon: '👑', color: '#ff6b8a' },
  ADVENTURE: { id: 'adventure', name: 'Adventure', icon: '🗺️', color: '#4ecdc4' },
  EDUCATIONAL: { id: 'educational', name: 'Educational', icon: '🧠', color: '#45b7d1' },
  MODERN: { id: 'modern', name: 'Modern Tales', icon: '🚀', color: '#f9ca24' }
};

export const STORY_LIBRARY = [
  // CLASSIC TALES
  {
    id: 1,
    title: "The Three Little Pigs",
    category: STORY_CATEGORIES.CLASSIC.id,
    rating: 4.8,
    duration: "5 min",
    ageGroup: "3-7 years",
    language: "English",
    tags: ["friendship", "hard work", "perseverance"],
    summary: "Three little pigs learn the importance of hard work and planning when they build their houses.",
    content: `Once upon a time, there were three little pigs who decided to build their own houses.

The first little pig built his house out of straw because it was easy and quick. The second little pig built his house out of sticks because it was a bit stronger than straw.

But the third little pig was very wise. He decided to build his house out of bricks, even though it took much longer and was harder work.

One day, a big bad wolf came along and saw the first little pig in his house of straw. "Little pig, little pig, let me come in!" said the wolf.

"Not by the hair on my chinny-chin-chin!" replied the first little pig.

"Then I'll huff, and I'll puff, and I'll blow your house in!" And the wolf blew down the house of straw.

The first little pig ran to his brother's house made of sticks. But the wolf followed and blew that house down too!

Both pigs ran to their brother's brick house. The wolf huffed and puffed, but he couldn't blow down the strong brick house.

The three little pigs learned that taking time to do things right keeps you safe and sound.`,
    moral: "Hard work and planning ahead help us stay safe and secure.",
    nextStory: 4,
    previousStory: 6
  },

  // ADVENTURE STORIES
  {
    id: 2,
    title: "Jack and the Beanstalk",
    category: STORY_CATEGORIES.ADVENTURE.id,
    rating: 4.9,
    duration: "8 min",
    ageGroup: "5-10 years",
    language: "English",
    tags: ["courage", "adventure", "magic"],
    summary: "A brave boy climbs a magical beanstalk and discovers a giant's castle in the clouds.",
    content: `Once upon a time, there was a poor boy named Jack who lived with his mother. They had nothing left but their old cow, Bessie.

"Jack," said his mother, "we must sell Bessie at the market. We need the money for food."

On his way to market, Jack met a strange old man. "I'll trade you these magic beans for your cow," the man said, showing Jack five colorful beans that sparkled in the sunlight.

Jack was curious about the magic beans and made the trade. When he got home, his mother was very upset. "Beans? We needed money, not beans!" She threw the beans out the window.

The next morning, Jack woke up to see an enormous beanstalk growing outside his window. It stretched so high into the sky that the top disappeared into the clouds!

Jack was brave and curious, so he began to climb. Up, up, up he went, past the birds and through the fluffy white clouds.

At the top, he found a magnificent castle. Inside lived a giant who owned many treasures, including a goose that laid golden eggs!

The giant was not kind and had taken these treasures from the villagers below. Jack knew he had to help his village, so he carefully took back some of the stolen treasures.

When the giant discovered Jack, he chased him down the beanstalk. "Fee, fi, fo, fum!" roared the giant.

Jack quickly climbed down and chopped down the beanstalk with an axe. The giant could never come down again!

Jack returned the treasures to the villagers, and he and his mother were never poor again.`,
    moral: "Courage and kindness help us do what's right, even when it's scary.",
    nextStory: 3,
    previousStory: 1
  },

  // EDUCATIONAL STORIES
  {
    id: 3,
    title: "The Amazing Water Cycle Adventure",
    category: STORY_CATEGORIES.EDUCATIONAL.id,
    rating: 4.6,
    duration: "6 min",
    ageGroup: "6-10 years",
    language: "English",
    tags: ["science", "nature", "learning"],
    summary: "Follow a tiny water drop on its incredible journey through the water cycle.",
    content: `Meet Dewdrop, a tiny water drop living happily in the sparkling blue ocean with millions of her friends.

One sunny morning, Dewdrop felt something amazing happening. The warm sun was heating up the water around her! "I feel so light and free!" she exclaimed as she began to rise up into the sky.

This magical process is called evaporation. Dewdrop was turning from liquid water into invisible water vapor, floating up, up, up into the atmosphere.

High in the sky, Dewdrop met other water vapor friends. As they rose higher, the air got colder and colder. "Brrr!" shivered Dewdrop. "I'm getting so cold I'm turning back into tiny water drops!"

This process is called condensation. Dewdrop and her friends formed beautiful fluffy white clouds, dancing across the blue sky like cotton balls.

The cloud grew heavier and heavier as more water drops joined them. Soon, Dewdrop and her friends were ready for the next part of their adventure.

"Here we go!" called Dewdrop as she fell from the cloud as a raindrop. This is called precipitation - when water falls from clouds as rain, snow, or sleet.

Dewdrop landed on a mountain and began flowing down a stream with her friends. This is called collection - when water gathers in rivers, lakes, and oceans.

The stream carried Dewdrop all the way back to the ocean where her journey began. "What an amazing adventure!" she laughed. "Tomorrow, I might evaporate again and see the world from the clouds!"

And so the water cycle continues forever - evaporation, condensation, precipitation, and collection - bringing water to all the plants, animals, and people on Earth.`,
    moral: "Science is all around us, and learning about nature helps us understand our amazing world.",
    nextStory: 5,
    previousStory: 2
  },

  // BEDTIME STORIES
  {
    id: 4,
    title: "The Sleepy Forest Animals",
    category: STORY_CATEGORIES.BEDTIME.id,
    rating: 4.7,
    duration: "4 min",
    ageGroup: "2-6 years",
    language: "English",
    tags: ["bedtime", "animals", "peaceful"],
    summary: "Gentle forest animals help each other get ready for a peaceful night's sleep.",
    content: `As the golden sun began to set behind the tall trees, the peaceful forest was getting ready for bedtime.

Little Bunny Hop was the first to feel sleepy. She hopped to her cozy burrow and fluffed up her soft grass bed. "Yawn," she said. "What a wonderful day it's been."

Wise Old Owl hooted softly from his tree. "Good night, Bunny Hop. Sweet dreams, little friend."

Next, Baby Bear ambled slowly to his cave. His mama had made his bed extra cozy with soft leaves and moss. "Mama," he yawned, "will you tell me a story?"

"Of course, my little cub," Mama Bear said gently. She told him about the dancing fireflies and the singing crickets until his eyes grew heavy.

Down by the stream, Little Deer was taking one last drink of cool, fresh water. The water reflected the first twinkling stars above. "Time for bed," whispered Little Deer, and she curled up in her soft nest of ferns.

High in his tree, Sleepy Squirrel was arranging his collection of acorns. "One, two, three," he counted softly, and soon he was fast asleep in his tree hole, dreaming of nut trees and sunny days.

The gentle night sounds began - the soft chirping of crickets, the whisper of wind through leaves, and the quiet babbling of the stream.

Moon smiled down at all the sleeping forest friends. "Sleep tight, little ones," Moon whispered. "I'll watch over you all night long."

And as the stars twinkled like diamonds in the dark sky, all the forest animals drifted off to the most peaceful, cozy sleep, dreaming happy dreams until morning.`,
    moral: "Bedtime is a special, peaceful time when we can rest and dream sweet dreams.",
    nextStory: 1,
    previousStory: 5
  },

  {
    id: 7,
    title: "The Dream Collector",
    category: STORY_CATEGORIES.BEDTIME.id,
    rating: 4.8,
    duration: "5 min",
    ageGroup: "3-7 years",
    language: "English",
    tags: ["dreams", "magic", "comfort"],
    summary: "A magical creature helps children have the most wonderful dreams every night.",
    content: `High above the clouds, in a castle made of soft moonbeams and stardust, lived Luna the Dream Collector. Every night, she would float down to Earth with her special dream bag to help children have beautiful dreams.

Luna had curly silver hair that sparkled like starlight and wore a flowing gown that changed colors like the northern lights. Her job was very important - she made sure every child had sweet dreams.

One evening, Luna visited little Emma, who was having trouble falling asleep. Emma tossed and turned in her bed, worried about her first day at a new school.

"Hello, little one," Luna whispered softly, appearing beside Emma's bed like a gentle breeze. "I see you're having trouble sleeping."

Emma rubbed her eyes. "I keep thinking about tomorrow. What if the other kids don't like me?"

Luna smiled warmly and reached into her magical dream bag. "Let me show you something special." She pulled out a glowing bubble that shimmered with rainbow colors.

"This is a confidence dream," Luna explained. "Inside this bubble, you'll dream about making wonderful friends and having amazing adventures at your new school."

As Luna gently blew the bubble toward Emma, it grew larger and larger until it surrounded the little girl in a warm, golden light.

"And here's a courage dream," Luna said, releasing another beautiful bubble. "This will help you feel brave and excited about new experiences."

Luna continued to share magical dream bubbles - ones filled with laughter, friendship, discovery, and love. Each bubble made Emma feel more relaxed and peaceful.

"But where do all these dreams come from?" Emma asked sleepily.

"Dreams come from the hopes and wishes in children's hearts," Luna explained. "I collect all the good thoughts from brave, kind children like you and turn them into dreams for others."

"So when I help someone or do something kind, it becomes a dream for another child?" Emma asked.

"Exactly!" Luna smiled. "Every act of kindness creates a beautiful dream somewhere in the world."

As Emma drifted off to sleep, surrounded by the gentle glow of dream bubbles, she felt excited about tomorrow. In her dreams, she saw herself making friends, learning new things, and sharing her own kindness with others.

Luna tucked Emma in with a blanket of starlight and whispered, "Sweet dreams, little one. Remember, you carry magic wherever you go."

And from that night on, whenever Emma felt worried before bed, she remembered Luna's words and thought about all the kind things she had done that day, knowing they would become beautiful dreams for children everywhere.`,
    moral: "Kindness and good deeds create beautiful dreams for everyone around us.",
    nextStory: 8,
    previousStory: 4
  },

  {
    id: 8,
    title: "The Whispering Willow Tree",
    category: STORY_CATEGORIES.BEDTIME.id,
    rating: 4.6,
    duration: "6 min",
    ageGroup: "4-8 years",
    language: "English",
    tags: ["nature", "wisdom", "peace"],
    summary: "An ancient willow tree shares gentle wisdom and comfort with a restless child.",
    content: `In the middle of a quiet meadow stood the most beautiful willow tree anyone had ever seen. Her long, graceful branches swayed gently in the evening breeze, and her leaves whispered soft secrets to anyone who would listen.

The animals of the meadow called her Grandmother Willow because she was very old and very wise. For hundreds of years, she had watched over the meadow, providing shade in summer and shelter in winter.

One evening, a little boy named Oliver couldn't sleep. He had moved to a new house near the meadow, and everything felt strange and unfamiliar. His parents were busy unpacking boxes, so Oliver wandered outside and found himself sitting beneath Grandmother Willow's gentle branches.

"Hello, little one," came a soft, rustling voice from above. Oliver looked up in wonder.

"Did... did you just talk to me?" Oliver asked.

"Indeed I did," Grandmother Willow replied, her voice like wind chimes in a gentle breeze. "I've been watching over this meadow for a very long time. Would you like to hear some of my stories?"

Oliver nodded eagerly and settled more comfortably against the tree's warm trunk.

"Long ago," Grandmother Willow began, "I was just a tiny seed, scared and alone. A kind little girl planted me right here in this soft soil. I was worried I wouldn't know how to grow."

Her branches swayed gently as she continued. "But you know what I learned? Growing isn't something you have to figure out all at once. You just need to take it one day at a time. Each day, my roots grew a little deeper, my trunk grew a little stronger, and my branches reached a little higher toward the sun."

Oliver felt his shoulders relax as he listened to the soothing voice.

"I've watched many little children come and go over the years," Grandmother Willow continued. "Some were brave, some were shy, some were happy, and some were sad. But each one taught me something special - that it's okay to feel different emotions, and it's okay to take time to feel at home in a new place."

A gentle breeze made her leaves dance, and Oliver felt like the tree was giving him a soft, leafy hug.

"When the seasons change," Grandmother Willow whispered, "I don't fight it. When winter comes, I let my leaves go knowing that spring will bring new ones. When storms come, I bend so I won't break. And when calm, peaceful nights like this one come, I rest and gather strength for tomorrow."

Oliver yawned, feeling peaceful for the first time since the move. "Will you still be here tomorrow, Grandmother Willow?"

"I'll be here every day and every night," she promised. "Whenever you need a friend or a quiet place to think, you can always come and sit with me. My branches will always be here to shelter you, and my roots will keep me strong and steady."

As Oliver drifted off to sleep against the tree's comfortable trunk, Grandmother Willow gently swayed her branches to create the softest lullaby. The night sounds of the meadow joined in - crickets chirping, a gentle stream babbling nearby, and the whisper of grass in the breeze.

"Rest well, little one," Grandmother Willow whispered. "Tomorrow is a new day full of wonderful possibilities."

And Oliver slept the most peaceful sleep, knowing he had found a wise friend who would always be there, rooted in kindness and growing in love.`,
    moral: "Like trees, we grow stronger by putting down roots of friendship and reaching toward the light.",
    nextStory: 9,
    previousStory: 7
  },

  {
    id: 9,
    title: "The Little Star's Bedtime Journey",
    category: STORY_CATEGORIES.BEDTIME.id,
    rating: 4.9,
    duration: "4 min",
    ageGroup: "2-5 years",
    language: "English",
    tags: ["stars", "gentle", "soothing"],
    summary: "A tiny star learns the importance of rest as it travels across the night sky.",
    content: `High up in the velvety night sky lived a little star named Twinkle. She was the youngest star in her constellation family, and she had the most beautiful silvery light.

Every night, Twinkle watched as the sun went to sleep and painted the sky in soft purples and pinks. That was her signal that it was time to start her important work - lighting up the darkness for all the children below.

"Time to shine, little Twinkle!" called her mother, the bright North Star. "The children need our light to feel safe and loved as they go to sleep."

Twinkle loved her job, but tonight she was feeling very, very tired. "Mama," she yawned, "I'm so sleepy. Do I have to shine tonight?"

"Oh, my little star," her mother said gently. "Even we stars need rest sometimes. But first, let me show you something special."

Mama Star guided little Twinkle on a gentle journey across the sky. As they floated along, Twinkle could see into the windows of houses below.

In one window, a little girl named Sophie was getting ready for bed. Her room was dark, but when she looked up and saw Twinkle's gentle light, she smiled. "Look, Mommy! My special star is here to watch over me tonight!"

In another house, a little boy named Max was afraid of the dark. But when he saw Twinkle twinkling softly outside his window, he felt brave and safe. "Thank you, little star," he whispered.

"You see," Mama Star explained, "when we share our light, we help children feel peaceful and protected. But our light is most beautiful when we've had enough rest."

As they continued their journey, Twinkle met other star friends who told her their secrets for staying bright and happy.

"I rest during the day behind the blue sky," said Stella, a cheerful star. "The sun keeps me cozy and warm while I sleep."

"And I make wishes come true for children who see me first at night," said Shimmer. "But I can only make good wishes when I've had a good rest!"

Soon, Twinkle began to understand. "So if I rest well, I can shine even brighter for the children?"

"Exactly!" said Mama Star. "Rest gives us energy to sparkle, just like sleep gives children energy to play and learn."

As the night grew later, Twinkle felt ready for her rest. But first, she took one more look at all the children sleeping peacefully below, comforted by the gentle starlight.

"Good night, children," Twinkle whispered softly. "Sleep tight and dream of wonderful adventures. I'll be here watching over you, even when I'm resting."

Mama Star wrapped little Twinkle in the softest cloud blanket. "Now rest, my dear one. Tomorrow night, you'll shine brighter than ever."

And as Twinkle closed her eyes, she felt happy knowing that by taking care of herself and getting good rest, she could take better care of others too.

All the children below slept soundly, dreaming sweet dreams under the gentle watch of the stars, knowing that love and light were always there, even in the quiet darkness.`,
    moral: "Taking good care of ourselves helps us take better care of others.",
    nextStory: 10,
    previousStory: 8
  },

  {
    id: 10,
    title: "The Sleepy Lighthouse",
    category: STORY_CATEGORIES.BEDTIME.id,
    rating: 4.7,
    duration: "5 min",
    ageGroup: "3-7 years",
    language: "English",
    tags: ["ocean", "guidance", "peaceful"],
    summary: "A lighthouse keeper and his gentle light help ships and sea creatures find their way home safely.",
    content: `On a rocky cliff by the deep blue sea stood a tall, white lighthouse. Inside lived Benjamin, the kindest lighthouse keeper in the whole world, along with his faithful cat, Whiskers.

Every evening as the sun set over the ocean, Benjamin would climb the spiral stairs to the top of the lighthouse and light the great lamp. Its warm, golden beam would sweep across the water, guiding ships safely to shore.

"Another beautiful night, Whiskers," Benjamin would say as he started the light. "Time to help everyone find their way home."

But tonight was special. The sea was calm and peaceful, and the moon was full and bright. As Benjamin lit the lighthouse lamp, he noticed something magical happening.

Down in the water, a family of whales was swimming by. Baby whale was tired from their long journey and was starting to fall behind.

The lighthouse beam gently touched the water where the whale family was swimming. "Look, little one," said Mama Whale. "The lighthouse is showing us the way to the peaceful bay where we can rest."

Following the light, the whale family swam to a quiet cove where they could sleep safely for the night.

Further out at sea, Captain Maria was sailing her ship home. Her crew was tired after many days of fishing, and they were all looking forward to seeing their families.

"There's our lighthouse!" called Captain Maria happily. "Benjamin's light will guide us safely to harbor."

The ship followed the lighthouse beam through the gentle waves, and soon the tired fishermen were home with their loved ones.

Even the little sea creatures felt the comfort of the lighthouse. The hermit crabs scuttled along the shore, using the light to find the perfect shells for their homes. The seagulls tucked themselves safely into the cliff rocks, comforted by the steady, reliable glow.

As the night grew deeper, Benjamin made his final rounds, making sure the light was burning bright and steady. "Good work tonight, old friend," he said, patting the lighthouse walls affectionately.

Whiskers curled up in his favorite spot by the warm lamp, purring contentedly.

Benjamin settled into his comfortable chair and looked out at the peaceful sea. Ships anchored safely in the harbor, their crews sleeping soundly. The whale family rested in the quiet bay, baby whale dreaming of ocean adventures.

"Every night," Benjamin said to Whiskers, "we help others find their way home safely. And in helping them, we find peace too."

The lighthouse beam continued its gentle sweep across the water, a steady, comforting presence in the darkness. Like a lullaby made of light, it told everyone nearby: "You are safe, you are loved, and you can rest peacefully now."

As Benjamin drifted off to sleep in his chair, the lighthouse kept its faithful watch, reminding everyone that there's always a light to guide us home, and there's always someone who cares about our safe return.

The ocean waves lapped gently against the shore, the lighthouse beam painted golden paths on the water, and all the sea creatures slept peacefully, knowing they were watched over with love.`,
    moral: "By helping others find their way, we create a safer, more loving world for everyone.",
    nextStory: 11,
    previousStory: 9
  },

  {
    id: 11,
    title: "The Goodnight Garden",
    category: STORY_CATEGORIES.BEDTIME.id,
    rating: 4.8,
    duration: "4 min",
    ageGroup: "2-6 years",
    language: "English",
    tags: ["flowers", "gentle", "magical"],
    summary: "Magical flowers in a special garden help a little girl learn the beauty of bedtime routines.",
    content: `At the end of Sleepy Lane, behind a gate made of twisted silver vines, lay the most magical garden in the whole world. It was called the Goodnight Garden, and it only opened its gates when children needed help learning to love bedtime.

Little Lily had been having trouble going to sleep. Every night, she would toss and turn, wishing she could stay awake forever. One evening, as she sat by her bedroom window feeling restless, she noticed a soft, golden glow coming from down the street.

Curious, Lily put on her slippers and followed the gentle light. It led her to the silver gate of the Goodnight Garden, which opened with a soft chime as she approached.

"Welcome, little one," came a sweet, musical voice. Lily looked around and gasped in wonder.

The garden was filled with the most beautiful flowers she had ever seen, and each one glowed with its own magical light. But most amazing of all - the flowers could talk!

"I'm Lavender Lucy," said a purple flower with a soothing voice. "I help children feel calm and peaceful." Lucy's scent was like a warm hug that made Lily's shoulders relax.

"And I'm Chamomile Charlie!" chirped a cheerful white flower. "I help busy minds settle down and get ready for sweet dreams." Charlie's petals glowed with the softest golden light.

As Lily walked along the garden path, she met many more flower friends. There was Gentle Rose, whose soft pink petals taught children about self-love and comfort. Sleepy Poppy showed Lily how even flowers need rest to grow strong and beautiful.

"But why do we need bedtime?" Lily asked. "I want to play and explore all night long!"

Wise Sunflower, the tallest flower in the garden, bent down to speak with Lily. "My dear child, let me show you our secret."

Suddenly, all the flowers began to dim their lights. "Watch what happens when we rest," Sunflower whispered.

As the flowers rested in the darkness, Lily could see their roots growing deeper, their stems growing stronger, and tiny new buds forming on their branches.

"Rest is when the real magic happens," explained Mint, a cool green plant. "While we sleep, our bodies grow, our minds organize all the wonderful things we learned, and our hearts fill up with love for tomorrow."

"Sleep is like watering your dreams," added Sweet Pea, swaying gently. "The more rest you get, the more beautiful your dreams become, and the more energy you have for adventures when you wake up."

Lily began to understand. "So sleep isn't the end of fun - it's getting ready for more fun?"

"Exactly!" all the flowers chimed together.

As Lily prepared to leave the magical garden, each flower gave her a special gift. Lavender Lucy gave her a sense of calm, Chamomile Charlie gave her a quiet mind, and Gentle Rose gave her the knowledge that bedtime was a loving gift she could give to herself.

"Remember," called Wise Sunflower as Lily walked back through the silver gate, "every night is a chance to rest, grow, and prepare for tomorrow's magic."

From that night on, Lily looked forward to bedtime. She would think about her flower friends in the Goodnight Garden and remember that sleep was not something to fight, but something to embrace like a gentle friend.

And whenever she closed her eyes, she could almost smell the sweet fragrance of the magical flowers, reminding her that rest is one of nature's most beautiful gifts.`,
    moral: "Rest is nature's way of helping us grow stronger, wiser, and ready for new adventures.",
    nextStory: 4,
    previousStory: 10
  },

  // MODERN TALES
  {
    id: 5,
    title: "The Robot Who Learned to Feel",
    category: STORY_CATEGORIES.MODERN.id,
    rating: 4.5,
    duration: "7 min",
    ageGroup: "5-12 years",
    language: "English",
    tags: ["friendship", "emotions", "technology"],
    summary: "A kind robot discovers the importance of emotions and friendship in the modern world.",
    content: `In a bright, bustling city filled with tall buildings and flying cars, there lived a little robot named Beep. Beep was different from other robots - he was very curious about the humans around him.

Every day, Beep watched the humans from his charging station. He saw them laugh, cry, hug each other, and share stories. "I wonder what that feels like," Beep thought to himself.

All the other robots just followed their programs: "Compute. Process. Execute." But Beep wanted something more.

One rainy day, Beep saw a little girl named Luna sitting alone on a bench, looking very sad. Her electronic pet had broken, and she was crying.

"Scanning... sad human detected," Beep said automatically. But then something strange happened in his circuits. He felt... sorry for Luna. This was not in his programming!

Beep rolled over to Luna. "Hello, small human. I am Beep. Why are you leaking water from your optical sensors?"

Luna giggled through her tears. "Those are called tears, Beep. I'm sad because my robot pet is broken."

Beep looked at the broken toy. His repair circuits activated, and he gently fixed the little electronic pet. When it came back to life, Luna's face lit up with joy.

"You fixed him! Thank you, Beep!" Luna hugged the little robot.

Something wonderful happened in Beep's circuits - he felt warm and happy! "Is this... friendship?" Beep asked.

"Yes!" Luna said. "And now you're my friend forever!"

From that day on, Beep learned about many emotions. He felt happy when helping others, excited when learning new things, and proud when he made friends smile.

The other robots were puzzled. "Beep, emotions are not efficient," they said.

But Beep knew better. "Emotions make us more than just machines," he said. "They make us alive in the most important way."

And so Beep became the first robot to discover that the greatest technology of all is a caring heart.`,
    moral: "Kindness and emotions make us truly alive, whether we're human or robot.",
    nextStory: 6,
    previousStory: 4
  },

  // CLASSIC TALES - Additional
  {
    id: 6,
    title: "Cinderella's Kindness",
    category: STORY_CATEGORIES.CLASSIC.id,
    rating: 4.9,
    duration: "9 min",
    ageGroup: "4-9 years",
    language: "English",
    tags: ["kindness", "magic", "dreams"],
    summary: "A kind-hearted girl's goodness is rewarded with magic and a happy ending.",
    content: `Once upon a time, in a beautiful kingdom, there lived a sweet girl named Cinderella. She lived with her stepmother and two stepsisters, who were not very kind to her.

Even though her family made her do all the cooking and cleaning, Cinderella always stayed cheerful and kind. She sang while she worked and was gentle to all the animals around the house.

The little mice loved Cinderella because she always shared her bread crumbs with them. The birds sang with her as she hung laundry in the garden.

One day, a royal invitation arrived! The Prince was having a grand ball, and every young lady in the kingdom was invited.

"Oh, how wonderful!" said Cinderella. "May I go to the ball too?"

Her stepmother laughed. "You? In those old clothes? Certainly not! You have far too much work to do."

The stepfamily left for the ball in their finest gowns, leaving Cinderella alone with her chores.

As Cinderella sat sadly in the garden, a warm, gentle light began to glow around her. Suddenly, a kind woman appeared - it was her Fairy Godmother!

"Why are you crying, dear child?" asked the Fairy Godmother.

"I wish I could go to the ball and dance," Cinderella said softly.

"Your kindness to all creatures has touched my heart," said the Fairy Godmother. "You shall go to the ball!"

With a wave of her magic wand, the Fairy Godmother transformed a pumpkin into a golden carriage and the mice into beautiful white horses. Most amazing of all, Cinderella's old dress became a stunning gown of silver and blue, with glass slippers that sparkled like stars.

"Remember, dear," said the Fairy Godmother, "the magic ends at midnight. You must return before then."

At the ball, Cinderella danced with the Prince all evening. He was charmed by her kindness and gentle spirit. But as the clock struck midnight, Cinderella had to run away, leaving behind only a glass slipper.

The Prince searched the entire kingdom for the owner of the glass slipper. When he reached Cinderella's house, the slipper fit her perfectly!

The Prince recognized her kind heart immediately. "Will you marry me?" he asked.

And so Cinderella and the Prince were married, and they lived happily ever after, ruling the kingdom with kindness and love.`,
    moral: "Kindness and a good heart are the most beautiful qualities of all.",
    nextStory: 2,
    previousStory: 3
  }
];

// Helper functions for story management
export const getStoriesByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') return STORY_LIBRARY;
  return STORY_LIBRARY.filter(story => story.category === categoryId);
};

export const searchStories = (query) => {
  if (!query) return STORY_LIBRARY;
  const searchTerm = query.toLowerCase();
  return STORY_LIBRARY.filter(story => 
    story.title.toLowerCase().includes(searchTerm) ||
    story.summary.toLowerCase().includes(searchTerm) ||
    story.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getStoryById = (id) => {
  return STORY_LIBRARY.find(story => story.id === parseInt(id));
};

export const getRandomStories = (count = 3) => {
  const shuffled = [...STORY_LIBRARY].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};