// 📚 CurioApp Bilingual Story Library
// Static content with both English and Chinese versions

export const STORY_CATEGORIES_BILINGUAL = {
  BEDTIME: { 
    id: 'bedtime', 
    name: { en: 'Bedtime', zh: '睡前故事' }, 
    icon: '🌙', 
    color: '#9b6bcc' 
  },
  CLASSIC: { 
    id: 'classic', 
    name: { en: 'Classic Tales', zh: '经典故事' }, 
    icon: '👑', 
    color: '#ff6b8a' 
  },
  ADVENTURE: { 
    id: 'adventure', 
    name: { en: 'Adventure', zh: '冒险故事' }, 
    icon: '🗺️', 
    color: '#4ecdc4' 
  },
  EDUCATIONAL: { 
    id: 'educational', 
    name: { en: 'Educational', zh: '教育故事' }, 
    icon: '🧠', 
    color: '#45b7d1' 
  },
  MODERN: { 
    id: 'modern', 
    name: { en: 'Modern Tales', zh: '现代故事' }, 
    icon: '🚀', 
    color: '#f9ca24' 
  }
};

export const BILINGUAL_STORY_LIBRARY = [
  // CLASSIC TALES - The Three Little Pigs
  {
    id: 1,
    category: STORY_CATEGORIES_BILINGUAL.CLASSIC.id,
    rating: 4.8,
    duration: { en: "5 min", zh: "5分钟" },
    ageGroup: { en: "3-7 years", zh: "3-7岁" },
    tags: {
      en: ["friendship", "hard work", "perseverance"],
      zh: ["友谊", "努力工作", "坚持"]
    },
    
    // English version
    en: {
      title: "The Three Little Pigs",
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
      moral: "Hard work and planning ahead help us stay safe and secure."
    },
    
    // Chinese version
    zh: {
      title: "三只小猪",
      summary: "三只小猪在建造房屋时学会了努力工作和规划的重要性。",
      content: `从前，有三只小猪决定建造自己的房子。

第一只小猪用稻草建造房子，因为这样简单快捷。第二只小猪用树枝建造房子，因为树枝比稻草结实一点。

但是第三只小猪很聪明。他决定用砖块建造房子，尽管这需要更长的时间和更辛苦的工作。

一天，一只大灰狼走过来，看到第一只小猪在他的稻草房子里。"小猪，小猪，让我进去！"狼说。

"休想！我绝不让你进来！"第一只小猪回答。

"那我就要吹气，用力吹，把你的房子吹倒！"狼把稻草房子吹倒了。

第一只小猪跑到他兄弟的树枝房子里。但是狼跟过来，也把树枝房子吹倒了！

两只小猪都跑到他们兄弟的砖房子里。狼又吹又喷，但是他吹不倒结实的砖房子。

三只小猪学会了认真做事能保证安全。`,
      moral: "努力工作和提前规划有助于我们保持安全。"
    },
    
    nextStory: 4,
    previousStory: 2
  },

  // Jack and the Beanstalk
  {
    id: 2,
    category: STORY_CATEGORIES_BILINGUAL.ADVENTURE.id,
    rating: 4.9,
    duration: { en: "8 min", zh: "8分钟" },
    ageGroup: { en: "5-10 years", zh: "5-10岁" },
    tags: {
      en: ["courage", "adventure", "magic"],
      zh: ["勇气", "冒险", "魔法"]
    },
    
    en: {
      title: "Jack and the Beanstalk",
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
      moral: "Courage and kindness help us do what's right, even when it's scary."
    },
    
    zh: {
      title: "杰克与豆茎",
      summary: "一个勇敢的男孩爬上神奇的豆茎，在云端发现了巨人的城堡。",
      content: `从前，有一个叫杰克的贫穷男孩和他的母亲住在一起。他们只剩下一头老牛贝西。

"杰克，"他的母亲说，"我们必须在市场上卖掉贝西。我们需要钱买食物。"

在去市场的路上，杰克遇到了一个奇怪的老人。"我用这些神奇的豆子和你换牛，"老人说，向杰克展示了五颗在阳光下闪闪发光的彩色豆子。

杰克对神奇的豆子很好奇，便进行了交易。当他回到家时，他的母亲非常难过。"豆子？我们需要的是钱，不是豆子！"她把豆子扔出了窗外。

第二天早上，杰克醒来看到窗外长出了一根巨大的豆茎。它伸向天空，顶部消失在云层中！

杰克既勇敢又好奇，所以他开始攀登。他往上爬，越过鸟儿，穿过蓬松的白云。

在顶部，他发现了一座宏伟的城堡。里面住着一个拥有许多财宝的巨人，包括一只会下金蛋的鹅！

巨人不善良，他从下面的村民那里夺走了这些财宝。杰克知道他必须帮助他的村庄，所以他小心地拿回了一些被偷的财宝。

当巨人发现杰克时，他追着杰克下豆茎。"Fee, fi, fo, fum！"巨人咆哮道。

杰克迅速爬下来，用斧头砍倒了豆茎。巨人再也不能下来了！

杰克把财宝还给了村民，他和他的母亲再也不贫穷了。`,
      moral: "勇气和善良帮助我们做正确的事，即使很可怕。"
    },
    
    nextStory: 3,
    previousStory: 1
  },

  // The Amazing Water Cycle Adventure
  {
    id: 3,
    category: STORY_CATEGORIES_BILINGUAL.EDUCATIONAL.id,
    rating: 4.6,
    duration: { en: "6 min", zh: "6分钟" },
    ageGroup: { en: "6-10 years", zh: "6-10岁" },
    tags: {
      en: ["science", "nature", "learning"],
      zh: ["科学", "自然", "学习"]
    },
    
    en: {
      title: "The Amazing Water Cycle Adventure",
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
      moral: "Science is all around us, and learning about nature helps us understand our amazing world."
    },
    
    zh: {
      title: "神奇的水循环冒险",
      summary: "跟随一滴小水珠踏上穿越水循环的不可思议的旅程。",
      content: `认识小水珠，一滴快乐地生活在波光粼粼的蓝色海洋中的小水珠，与数百万的朋友们在一起。

一个阳光明媚的早晨，小水珠感到有奇妙的事情发生了。温暖的阳光正在加热她周围的水！"我感觉如此轻盈自由！"她兴奋地说着，开始升向天空。

这个神奇的过程叫做蒸发。小水珠正在从液态水变成看不见的水蒸气，向上，向上，向上漂浮到大气中。

在高空中，小水珠遇到了其他水蒸气朋友。随着他们升得更高，空气变得越来越冷。"哇！"小水珠颤抖着。"我变得如此寒冷，我正在变回小水滴！"

这个过程叫做凝结。小水珠和她的朋友们形成了美丽蓬松的白云，像棉花球一样在蓝天中舞蹈。

随着更多的水滴加入，云变得越来越重。很快，小水珠和她的朋友们准备好了冒险的下一部分。

"我们走吧！"小水珠叫道，她作为雨滴从云中落下。这叫做降水——当水以雨、雪或雨夹雪的形式从云中落下。

小水珠落在山上，开始与她的朋友们沿着溪流向下流。这叫做汇集——当水聚集在河流、湖泊和海洋中。

溪流把小水珠一直带回到她旅程开始的海洋。"多么奇妙的冒险！"她笑着说。"明天，我可能会再次蒸发，从云端看世界！"

就这样，水循环永远持续着——蒸发、凝结、降水和汇集——为地球上所有的植物、动物和人类带来水。`,
      moral: "科学就在我们身边，学习自然有助于我们理解这个奇妙的世界。"
    },
    
    nextStory: 4,
    previousStory: 2
  },

  // The Sleepy Forest Animals
  {
    id: 4,
    category: STORY_CATEGORIES_BILINGUAL.BEDTIME.id,
    rating: 4.7,
    duration: { en: "4 min", zh: "4分钟" },
    ageGroup: { en: "2-6 years", zh: "2-6岁" },
    tags: {
      en: ["bedtime", "animals", "peaceful"],
      zh: ["睡前", "动物", "平静"]
    },
    
    en: {
      title: "The Sleepy Forest Animals",
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
      moral: "Bedtime is a special, peaceful time when we can rest and dream sweet dreams."
    },
    
    zh: {
      title: "睡觉的森林动物",
      summary: "温柔的森林动物互相帮助，为宁静的夜晚睡眠做准备。",
      content: `当金色的太阳开始在高大的树木后面落下时，宁静的森林正在为睡觉做准备。

小兔子跳跳是第一个感到困倦的。她跳到她舒适的洞穴，拍松她的柔软草床。"哈欠，"她说。"多么美好的一天啊。"

睿智的老猫头鹰从他的树上轻声叫着。"晚安，兔子跳跳。做个好梦，小朋友。"

接下来，小熊宝宝慢慢地走向他的洞穴。他的妈妈用柔软的叶子和苔藓让他的床变得格外舒适。"妈妈，"他打着哈欠，"你能给我讲个故事吗？"

"当然可以，我的小熊宝宝，"熊妈妈温柔地说。她给他讲了跳舞的萤火虫和唱歌的蟋蟀的故事，直到他的眼睛变得沉重。

在小溪边，小鹿正在最后喝一口清凉的淡水。水面倒映着上方第一批闪烁的星星。"该睡觉了，"小鹿轻声说，她蜷缩在她柔软的蕨类植物窝里。

在他的树上高处，困倦的松鼠正在整理他收集的橡子。"一，二，三，"他轻声数着，很快他就在他的树洞里熟睡了，梦见坚果树和阳光明媚的日子。

轻柔的夜晚声音开始了——蟋蟀的轻声鸣叫，风穿过叶子的低语，和小溪的静静潺潺声。

月亮微笑着看着所有睡着的森林朋友。"睡个好觉，小家伙们，"月亮轻声说。"我会整夜看护着你们。"

当星星在黑暗的天空中像钻石一样闪烁时，所有的森林动物都进入了最平静、最舒适的睡眠，做着快乐的梦直到早晨。`,
      moral: "睡觉时光是特殊而宁静的时光，我们可以休息并做甜美的梦。"
    },
    
    nextStory: 1,
    previousStory: 3
  },

  // The Dream Collector
  {
    id: 7,
    category: STORY_CATEGORIES_BILINGUAL.BEDTIME.id,
    rating: 4.8,
    duration: { en: "5 min", zh: "5分钟" },
    ageGroup: { en: "3-7 years", zh: "3-7岁" },
    tags: {
      en: ["dreams", "magic", "comfort"],
      zh: ["梦境", "魔法", "安慰"]
    },
    
    en: {
      title: "The Dream Collector",
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
      moral: "Kindness and good deeds create beautiful dreams for everyone around us."
    },
    
    zh: {
      title: "梦境收集者",
      summary: "一个神奇的生物每晚都帮助孩子们做最美好的梦。",
      content: `在云层之上，在一座由柔软的月光和星尘建造的城堡里，住着月亮女神露娜，梦境收集者。每天晚上，她都会带着她特殊的梦境袋飘到地球上，帮助孩子们做美好的梦。

露娜有着卷曲的银色头发，像星光一样闪闪发光，穿着像北极光一样变换颜色的飘逸长袍。她的工作非常重要——她确保每个孩子都有甜美的梦。

一天晚上，露娜拜访了小艾玛，她难以入睡。艾玛在床上辗转反侧，担心她在新学校的第一天。

"你好，小家伙，"露娜轻声低语，像温柔的微风一样出现在艾玛的床边。"我看到你睡不着。"

艾玛揉了揉眼睛。"我一直在想明天。如果其他孩子不喜欢我怎么办？"

露娜温暖地微笑，伸手进入她神奇的梦境袋。"让我给你看些特别的东西。"她拿出一个闪烁着彩虹色彩的发光泡泡。

"这是一个自信的梦，"露娜解释道。"在这个泡泡里，你会梦到结交美好的朋友，在你的新学校里有惊人的冒险。"

当露娜轻轻地向艾玛吹泡泡时，它变得越来越大，直到它用温暖的金光包围了小女孩。

"这里有一个勇气的梦，"露娜说，释放了另一个美丽的泡泡。"这会帮助你对新体验感到勇敢和兴奋。"

露娜继续分享神奇的梦境泡泡——充满笑声、友谊、发现和爱的泡泡。每个泡泡都让艾玛感到更加放松和平静。

"但是所有这些梦都来自哪里？"艾玛困倦地问。

"梦来自孩子们心中的希望和愿望，"露娜解释道。"我收集所有像你一样勇敢善良的孩子的美好想法，把它们变成给其他人的梦。"

"所以当我帮助某人或做善事时，它就变成了另一个孩子的梦？"艾玛问。

"正确！"露娜微笑着。"每一个善举都在世界的某个地方创造了一个美丽的梦。"

当艾玛在梦境泡泡的温柔光芒包围下进入睡眠时，她对明天感到兴奋。在她的梦里，她看到自己交朋友，学习新事物，并与他人分享自己的善良。

露娜用星光毯子给艾玛盖好，轻声说："做个好梦，小家伙。记住，你无论走到哪里都带着魔法。"

从那晚起，每当艾玛在睡前感到担心时，她就会想起露娜的话，想想她那天做的所有善事，知道它们会成为世界各地孩子们的美丽梦境。`,
      moral: "善良和好行为为我们周围的每个人创造美丽的梦。"
    },
    
    nextStory: 8,
    previousStory: 4
  },

  // The Whispering Willow Tree
  {
    id: 8,
    category: STORY_CATEGORIES_BILINGUAL.BEDTIME.id,
    rating: 4.6,
    duration: { en: "6 min", zh: "6分钟" },
    ageGroup: { en: "4-8 years", zh: "4-8岁" },
    tags: {
      en: ["nature", "wisdom", "peace"],
      zh: ["自然", "智慧", "平静"]
    },
    
    en: {
      title: "The Whispering Willow Tree",
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

"Rest well, little one," Grandmother Willow whispered. "Tomorrow is a new day full of wonderful possibilities."`,
      moral: "Change can be scary, but taking things one day at a time helps us grow strong and find peace."
    },
    
    zh: {
      title: "低语的柳树",
      summary: "一棵古老的柳树与一个不安的孩子分享温柔的智慧和安慰。",
      content: `在一个安静的草地中央，矗立着任何人见过的最美丽的柳树。她长长优雅的树枝在晚风中轻柔摇摆，她的叶子向任何愿意倾听的人低语着轻柔的秘密。

草地上的动物们叫她柳树奶奶，因为她非常古老，非常智慧。几百年来，她一直守护着这个草地，夏天提供阴凉，冬天提供庇护。

一天晚上，一个叫奥利弗的小男孩睡不着。他搬到了草地附近的新房子，一切都感觉陌生而不熟悉。他的父母忙着拆箱子，所以奥利弗走出去，发现自己坐在柳树奶奶温柔的树枝下。

"你好，小家伙，"从上面传来柔和的沙沙声。奥利弗惊奇地抬头看。

"你...你刚才和我说话了吗？"奥利弗问。

"确实如此，"柳树奶奶回答，她的声音像温柔微风中的风铃。"我守护这个草地已经很长时间了。你想听听我的故事吗？"

奥利弗急切地点头，更舒适地靠在树的温暖树干上。

"很久以前，"柳树奶奶开始说，"我只是一颗小种子，害怕而孤单。一个善良的小女孩把我种在这里的柔软土壤中。我担心我不知道如何成长。"

她的树枝轻柔地摇摆，继续说道。"但是你知道我学到了什么吗？成长不是你必须一下子就弄清楚的事情。你只需要一天一天地来。每一天，我的根长得更深一点，我的树干更强壮一点，我的树枝向太阳伸得更高一点。"

奥利弗听着这舒缓的声音，感到肩膀放松了。

"这些年来，我看着许多小孩子来来去去，"柳树奶奶继续说。"有些很勇敢，有些很害羞，有些很快乐，有些很悲伤。但每一个都教给我一些特别的东西——感受不同的情绪是可以的，花时间在新地方感到宾至如归也是可以的。"

一阵温柔的微风让她的叶子舞动，奥利弗感觉就像这棵树在给他一个柔软的、叶子的拥抱。

"当季节变化时，"柳树奶奶轻声说，"我不会抗拒。当冬天来临时，我让我的叶子离去，知道春天会带来新的叶子。当暴风雨来临时，我弯曲以免断裂。当像今晚这样平静、宁静的夜晚来临时，我休息并为明天积聚力量。"

奥利弗打了个哈欠，搬家以来第一次感到平静。"明天你还会在这里吗，柳树奶奶？"

"我每天每夜都会在这里，"她承诺道。"每当你需要朋友或安静的地方思考时，你总是可以来和我坐在一起。我的树枝永远在这里为你遮蔽，我的根会让我保持强壮稳定。"

当奥利弗靠着树的舒适树干睡着时，柳树奶奶轻柔地摇摆她的树枝，创造出最柔和的摇篮曲。草地的夜晚声音也加入进来——蟋蟀的鸣叫，附近温柔的小溪潺潺声，以及草在微风中的低语。

"好好休息，小家伙，"柳树奶奶轻声说。"明天是充满美好可能性的新一天。"`,
      moral: "变化可能很可怕，但一天一天地面对能帮助我们变得坚强，找到平静。"
    },
    
    nextStory: 7,
    previousStory: 1
  }
];

// Helper functions for bilingual content
export const getBilingualStoryById = (id) => {
  return BILINGUAL_STORY_LIBRARY.find(story => story.id === parseInt(id));
};

export const getLocalizedStory = (story, language = 'en') => {
  if (!story) return null;
  
  const lang = language === 'zh' ? 'zh' : 'en';
  
  return {
    ...story,
    title: story[lang].title,
    summary: story[lang].summary,
    content: story[lang].content,
    moral: story[lang].moral,
    duration: story.duration[lang],
    ageGroup: story.ageGroup[lang],
    tags: story.tags[lang],
    language: lang === 'zh' ? 'Chinese' : 'English'
  };
};

export const getLocalizedCategory = (categoryId, language = 'en') => {
  const category = Object.values(STORY_CATEGORIES_BILINGUAL).find(cat => cat.id === categoryId);
  if (!category) return null;
  
  const lang = language === 'zh' ? 'zh' : 'en';
  
  return {
    ...category,
    name: category.name[lang]
  };
};

// Get all stories in specified language
export const getBilingualStories = (language = 'en') => {
  return BILINGUAL_STORY_LIBRARY.map(story => getLocalizedStory(story, language));
};