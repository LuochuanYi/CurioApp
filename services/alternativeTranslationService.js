// Alternative Translation Service
// Provides backup translation methods when primary API fails
import { logTranslation } from '../utils/logger';

class AlternativeTranslationService {
  constructor() {
    this.cache = new Map();
  }

  // Simple character-based translation for demonstration
  async translateWithBackup(text, targetLang) {
    logTranslation(`Using backup translation service for: "${text.substring(0, 30)}..."`);
    logTranslation(`Target language: ${targetLang}`);
    
    // For Chinese, provide comprehensive translation
    if (targetLang === 'zh' || targetLang === 'zh-cn') {
      const result = this.translateToChineseBasic(text);
      logTranslation(`Chinese translation: "${text.substring(0, 30)}..." → "${result.substring(0, 30)}..."`);
      return result;
    }
    
    // For other languages, return with language indicator
    const langIndicators = {
      'fr': '[FR] ',
      'es': '[ES] ',
      'uk': '[UK] ',
      'nl': '[NL] '
    };
    
    const result = (langIndicators[targetLang] || '[TRANSLATED] ') + text;
    logTranslation(`Language indicator added: "${result.substring(0, 30)}..."`);
    return result;
  }

  // Enhanced Chinese translation patterns
  translateToChineseBasic(text) {
    // Full sentence translations for ALL stories (most accurate)
    const fullSentences = {
      // The Three Little Pigs
      'Once upon a time, there were three little pigs who decided to build their own houses.': '从前，有三只小猪决定建造自己的房子。',
      'The first little pig built his house out of straw because it was easy and quick.': '第一只小猪用稻草建房子，因为这样简单快捷。',
      'The second little pig built his house out of sticks because it was a bit stronger than straw.': '第二只小猪用木棍建房子，因为这比稻草更坚固一些。',
      'But the third little pig was very wise.': '但是第三只小猪非常聪明。',
      'He decided to build his house out of bricks, even though it took much longer and was harder work.': '他决定用砖头建房子，尽管这需要更长时间和更辛苦的工作。',
      'One day, a big bad wolf came along and saw the first little pig in his house of straw.': '有一天，一只大灰狼路过，看见第一只小猪在他的稻草房子里。',
      '"Little pig, little pig, let me come in!" said the wolf.': '"小猪，小猪，让我进来！"大灰狼说。',
      '"Not by the hair on my chinny-chin-chin!" replied the first little pig.': '"绝对不行！"第一只小猪回答。',
      '"Then I\'ll huff, and I\'ll puff, and I\'ll blow your house in!" And the wolf blew down the house of straw.': '"那我就吹气，用力吹，把你的房子吹倒！"大灰狼把稻草房子吹倒了。',
      'The first little pig ran to his brother\'s house made of sticks.': '第一只小猪跑到他兄弟的木棍房子里。',
      'But the wolf followed and blew that house down too!': '但是大灰狼跟着来，也把那座房子吹倒了！',
      'Both pigs ran to their brother\'s brick house.': '两只小猪都跑到他们兄弟的砖房子里。',
      'The wolf huffed and puffed, but he couldn\'t blow down the strong brick house.': '大灰狼用力吹气，但是他吹不倒坚固的砖房子。',
      'The three little pigs learned that taking time to do things right keeps you safe and sound.': '三只小猪学会了，花时间把事情做对能让你安全无忧。',
      'Hard work and planning ahead help us stay safe and secure.': '努力工作和提前计划帮助我们保持安全。',
      
      // Additional story sentences that are missing
      'The first little pig built his house out of straw because it was easy and quick. The second little pig built his house out of sticks because it was a bit stronger than straw.': '第一只小猪用稻草建房子因为简单快捷。第二只小猪用木棍建房子因为比稻草更坚固一些。',
      'But the third little pig was very wise. He decided to build his house out of bricks, even though it took much longer and was harder work.': '但是第三只小猪非常聪明。他决定用砖头建房子，尽管这需要更长时间和更辛苦的工作。',
      'One day, a big bad wolf came along and saw the first little pig in his house of straw.': '有一天，一只大灰狼路过，看见第一只小猪在他的稻草房子里。',
      '"Little pig, little pig, let me come in!" said the wolf.': '"小猪，小猪，让我进来！"大灰狼说。',
      '"Not by the hair on my chinny-chin-chin!" replied the first little pig.': '"绝对不行！"第一只小猪回答。',
      '"Then I\'ll huff, and I\'ll puff, and I\'ll blow your house in!" And the wolf blew down the house of straw.': '"那我就用力吹气，把你的房子吹倒！"大灰狼把稻草房子吹倒了。',
      'The first little pig ran to his brother\'s house made of sticks. But the wolf followed and blew that house down too!': '第一只小猪跑到他兄弟的木棍房子里。但是大灰狼跟着来，也把那座房子吹倒了！',
      'Both pigs ran to their brother\'s brick house. The wolf huffed and puffed, but he couldn\'t blow down the strong brick house.': '两只小猪都跑到他们兄弟的砖房子里。大灰狼用力吹气，但是他吹不倒坚固的砖房子。',
      
      // Jack and the Beanstalk
      'Once upon a time, there was a poor boy named Jack who lived with his mother.': '从前，有一个贫穷的男孩叫杰克，他和母亲住在一起。',
      'Jack was curious about the magic beans and made the trade.': '杰克对魔法豆很好奇，于是做了这笔交易。',
      'The next morning, Jack woke up to see an enormous beanstalk growing outside his window.': '第二天早上，杰克醒来看到窗外长出了一根巨大的豆茎。',
      'Jack was brave and curious, so he began to climb.': '杰克既勇敢又好奇，所以他开始攀爬。',
      'At the top, he found a magnificent castle.': '在顶端，他发现了一座宏伟的城堡。',
      'Courage and kindness help us do what\'s right, even when it\'s scary.': '勇气和善良帮助我们做正确的事，即使害怕也要这样做。',
      
      // The Amazing Water Cycle Adventure  
      'Meet Dewdrop, a tiny water drop living happily in the sparkling blue ocean.': '认识露珠，一个快乐生活在闪闪发光的蓝色海洋中的小水滴。',
      'One sunny morning, Dewdrop felt something amazing happening.': '一个阳光明媚的早晨，露珠感觉到了令人惊奇的事情发生了。',
      'This magical process is called evaporation.': '这个神奇的过程叫做蒸发。',
      'This process is called condensation.': '这个过程叫做凝结。',
      'Science is all around us, and learning about nature helps us understand our amazing world.': '科学就在我们身边，学习自然有助于我们理解这个奇妙的世界。',
      
      // The Sleepy Forest Animals
      'As the golden sun began to set behind the tall trees, the peaceful forest was getting ready for bedtime.': '当金色的太阳开始在高大的树木后面落下时，宁静的森林正准备睡觉。',
      'Little Bunny Hop was the first to feel sleepy.': '小兔子跳跳是第一个感到困倦的。',
      'Wise Old Owl hooted softly from his tree.': '睿智的老猫头鹰从他的树上轻柔地叫着。',
      'Next, Baby Bear ambled slowly to his cave.': '接下来，小熊宝宝慢慢地走向他的洞穴。',
      'Bedtime is a special, peaceful time when we can rest and dream sweet dreams.': '睡觉时间是一个特殊、宁静的时光，我们可以休息并做美梦。',
      
      // The Dream Collector
      'High above the clouds, in a castle made of soft moonbeams and stardust, lived Luna the Dream Collector.': '在云层之上，在由柔和的月光和星尘建成的城堡里，住着梦境收集者露娜。',
      'Every night, she would float down to Earth with her special dream bag.': '每天晚上，她都会带着她特殊的梦境袋飘到地球上。',
      'Luna had curly silver hair that sparkled like starlight.': '露娜有着像星光一样闪闪发光的银色卷发。',
      'Kindness and good deeds create beautiful dreams for everyone around us.': '善良和好行为为我们周围的每个人创造美丽的梦境。',
      
      // Cinderella's Kindness - Complete story translations
      'Once upon a time, in a beautiful kingdom, there lived a sweet girl named Cinderella.': '从前，在一个美丽的王国里，住着一个善良的女孩叫灰姑娘。',
      'She lived with her stepmother and two stepsisters, who were not very kind to her.': '她和继母以及两个继姐妹住在一起，她们对她并不好。',
      'Even though her family made her do all the cooking and cleaning, Cinderella always stayed cheerful and kind.': '尽管家人让她做所有的烹饪和清洁工作，灰姑娘总是保持开朗和善良。',
      'She sang while she worked and was gentle to all the animals around the house.': '她一边工作一边唱歌，对房子周围的所有动物都很温柔。',
      'The little mice loved Cinderella because she always shared her bread crumbs with them.': '小老鼠们都喜欢灰姑娘，因为她总是和它们分享面包屑。',
      'The birds sang with her as she hung laundry in the garden.': '当她在花园里晾衣服时，鸟儿们和她一起歌唱。',
      'One day, a royal invitation arrived! The Prince was having a grand ball, and every young lady in the kingdom was invited.': '有一天，一张皇家邀请函到了！王子要举办盛大的舞会，王国里的每位年轻女士都被邀请了。',
      'The stepfamily left for the ball in their finest gowns, leaving Cinderella alone with her chores.': '继母一家穿着最好的礼服去参加舞会，留下灰姑娘独自做家务。',
      'As Cinderella sat sadly in the garden, a warm, gentle light began to glow around her.': '当灰姑娘悲伤地坐在花园里时，温暖而柔和的光开始在她周围发光。',
      'Suddenly, a kind woman appeared - it was her Fairy Godmother!': '突然，一位善良的女人出现了——那是她的仙女教母！',
      'With a wave of her magic wand, the Fairy Godmother transformed a pumpkin into a golden carriage.': '仙女教母挥动魔法棒，把南瓜变成了金色马车。',
      'Most amazing of all, Cinderella\'s old dress became a stunning gown of silver and blue, with glass slippers that sparkled like stars.': '最神奇的是，灰姑娘的旧裙子变成了银蓝色的华丽礼服，还有像星星一样闪闪发光的玻璃鞋。',
      'At the ball, Cinderella danced with the Prince all evening.': '在舞会上，灰姑娘整晚都在和王子跳舞。',
      'He was charmed by her kindness and gentle spirit.': '他被她的善良和温柔的精神所吸引。',
      'But as the clock struck midnight, Cinderella had to run away, leaving behind only a glass slipper.': '但是当时钟敲响午夜时，灰姑娘不得不逃跑，只留下了一只玻璃鞋。',
      'The Prince searched the entire kingdom for the owner of the glass slipper.': '王子在整个王国寻找玻璃鞋的主人。',
      'When he reached Cinderella\'s house, the slipper fit her perfectly!': '当他到达灰姑娘的家时，玻璃鞋完美地适合她！',
      'And so Cinderella and the Prince were married, and they lived happily ever after.': '于是灰姑娘和王子结婚了，从此过着幸福快乐的生活。',
      'A kind heart is more beautiful than any gown, and goodness always finds its reward.': '善良的心比任何礼服都美丽，善良总会得到回报。',

      // Story titles and descriptions
      'The Sleepy Forest Animals': '睡觉的森林动物',
      'The Dream Collector': '梦境收集者',
      'The Whispering Willow Tree': '低语的柳树',
      'The Little Star\'s Bedtime Journey': '小星星的睡前旅程',
      'The Sleepy Lighthouse': '困倦的灯塔',
      'The Goodnight Garden': '晚安花园',
      'The Three Little Pigs': '三只小猪',
      'Jack and the Beanstalk': '杰克与豆茎',
      'The Amazing Water Cycle Adventure': '神奇的水循环冒险',
      'Cinderella\'s Kindness': '灰姑娘的善良',
      
      // UI elements - complete phrases
      'Loading story...': '正在加载故事...',
      'Read Story Aloud': '大声朗读故事',
      'Pause Narration': '暂停朗读',
      'Currently reading:': '当前朗读：',
      'What We Learn:': '我们学到了什么：',
      'More Stories': '更多故事',
      'Previous story': '上一个故事',
      'Next story': '下一个故事'
    };

    // Check for full sentence match first
    if (fullSentences[text]) {
      return fullSentences[text];
    }

      // Phrase and word patterns for partial matching
      const basicPatterns = {
        // Complete phrases first (longer patterns get priority)
        'there were three little pigs who decided to build their own houses': '有三只小猪决定建造自己的房子',
        'The first little pig built his house out of straw': '第一只小猪用稻草建房子',
        'because it was easy and quick': '因为这样简单快捷',
        'The second little pig built his house out of sticks': '第二只小猪用木棍建房子',
        'because it was a bit stronger than straw': '因为这比稻草更坚固一些',
        'But the third little pig was very wise': '但是第三只小猪非常聪明',
        'He decided to build his house out of bricks': '他决定用砖头建房子',
        'even though it took much longer': '尽管这需要更长时间',
        'and was harder work': '而且更辛苦',
        'One day, a big bad wolf came along': '有一天，一只大灰狼路过',
        'and saw the first little pig': '看见第一只小猪',
        'in his house of straw': '在他的稻草房子里',
        'Little pig, little pig, let me come in': '小猪，小猪，让我进来',
        'Not by the hair on my chinny-chin-chin': '绝对不行',
        'Then I\'ll huff, and I\'ll puff': '那我就用力吹气',
        'and I\'ll blow your house in': '把你的房子吹倒',
        'And the wolf blew down': '大灰狼吹倒了',
        'the house of straw': '稻草房子',
        'The first little pig ran': '第一只小猪跑',
        'to his brother\'s house': '到他兄弟的房子',
        'made of sticks': '用木棍建的',
        'But the wolf followed': '但是大灰狼跟着来',
        'and blew that house down too': '也把那座房子吹倒了',
        'Both pigs ran': '两只小猪都跑',
        'to their brother\'s brick house': '到他们兄弟的砖房子',
        'The wolf huffed and puffed': '大灰狼用力吹气',
        'but he couldn\'t blow down': '但是他吹不倒',
        'the strong brick house': '坚固的砖房子',
        
        // Story elements
        'Once upon a time': '从前',
        'little pig': '小猪',
        'little pigs': '小猪们',
        'three little pigs': '三只小猪',
        'house': '房子',
        'houses': '房子们',
        'wolf': '狼',
        'big bad wolf': '大灰狼',
        'straw': '稻草',
        'sticks': '木棍',
        'bricks': '砖头',
        'brick house': '砖房子',
        'blow down': '吹倒',
        'huff and puff': '用力吹气',
        'come in': '进来',
        'safe and sound': '安全无忧',
        'hard work': '努力工作',
        'planning ahead': '提前计划',      // UI elements
      'Loading': '加载中',
      'Stories': '故事',
      'Previous': '上一个',
      'Next': '下一个',
      'Bedtime': '睡前故事',
      'Classic Tales': '经典故事',
      'Adventure': '冒险故事',
      'Educational': '教育故事',
      'Modern Tales': '现代故事',
      
      // Common words
      'and': '和',
      'but': '但是',
      'said': '说',
      'replied': '回答',
      'then': '然后',
      'very': '非常',
      'little': '小',
      'big': '大',
      'strong': '坚固',
      'weak': '脆弱',
      'wise': '聪明',
      'build': '建造',
      'decided': '决定',
      'because': '因为',
      'easy': '简单',
      'quick': '快捷',
      'longer': '更长时间',
      'harder': '更辛苦',
      'work': '工作',
      'came': '来了',
      'along': '路过',
      'saw': '看见',
      'ran': '跑',
      'followed': '跟着',
      'learned': '学会了',
      
      // Cinderella-specific terms
      'Cinderella': '灰姑娘',
      'stepmother': '继母',
      'stepsisters': '继姐妹',
      'stepfamily': '继母一家',
      'Fairy Godmother': '仙女教母',
      'glass slipper': '玻璃鞋',
      'glass slippers': '玻璃鞋',
      'pumpkin': '南瓜',
      'carriage': '马车',
      'golden carriage': '金色马车',
      'magic wand': '魔法棒',
      'Prince': '王子',
      'kingdom': '王国',
      'midnight': '午夜',
      'married': '结婚',
      'happily ever after': '从此过着幸福快乐的生活',
      
      // Universal patterns for ANY story
      'there was': '有一个',
      'there were': '有一些',
      'lived': '住着',
      'one day': '有一天',
      'the next morning': '第二天早上',
      'that night': '那天晚上',
      'suddenly': '突然',
      'carefully': '小心地',
      'quickly': '快速地',
      'slowly': '慢慢地',
      'gently': '温柔地',
      'happily': '快乐地',
      'bravely': '勇敢地',
      'quietly': '安静地',
      'softly': '轻柔地',
      'amazing': '令人惊奇的',
      'beautiful': '美丽的',
      'wonderful': '奇妙的',
      'magical': '神奇的',
      'special': '特殊的',
      'curious': '好奇的',
      'excited': '兴奋的',
      'happy': '快乐的',
      'brave': '勇敢的',
      'kind': '善良的',
      'gentle': '温柔的',
      'walked': '走',
      'climbed': '爬',
      'jumped': '跳',
      'laughed': '笑',
      'smiled': '微笑',
      'whispered': '低语',
      'asked': '问',
      'answered': '回答',
      'found': '发现',
      'made': '制作',
      'helped': '帮助',
      'loved': '爱',
      'shared': '分享',
      'dreamed': '梦见',
      'wished': '希望',
      'always': '总是',
      'never': '从不',
      'sometimes': '有时候',
      'finally': '最后',
      'together': '一起',
      'home': '家',
      'away': '离开',
      'near': '靠近',
      'far': '远',
      'high': '高',
      'small': '小',
      'huge': '巨大',
      'long': '长',
      'short': '短',
      'hot': '热',
      'cold': '冷',
      'warm': '温暖',
      'bright': '明亮',
      'dark': '黑暗',
      'fast': '快',
      'slow': '慢',
      'new': '新',
      'old': '老',
      'young': '年轻',
      'safe': '安全'
    };

    // Start with original text
    let translated = text;
    
    // Apply pattern replacements (phrases first, then words)
    const sortedPatterns = Object.entries(basicPatterns).sort((a, b) => b[0].length - a[0].length);
    
    for (const [english, chinese] of sortedPatterns) {
      if (english.length > 2) {  // Only replace meaningful phrases/words
        const regex = new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        translated = translated.replace(regex, chinese);
      }
    }
    
    // Clean up extra spaces and punctuation
    translated = translated.replace(/\s+/g, ' ').trim();
    translated = translated.replace(/\s+([，。！？])/g, '$1'); // Fix Chinese punctuation spacing
    
    // If translation is significantly different, it worked
    if (translated !== text && this.hasSignificantTranslation(translated)) {
      logTranslation(`🈚 Pattern translation successful: "${text.substring(0, 30)}..." → "${translated.substring(0, 30)}..."`);
      return translated;
    }
    
    // Try intelligent sentence construction for unknown content
    const smartTranslation = this.smartSentenceTranslation(text);
    if (smartTranslation !== text) {
      logTranslation(`🤖 Smart translation: "${text.substring(0, 30)}..." → "${smartTranslation.substring(0, 30)}..."`);
      return smartTranslation;
    }
    
    // If no translation possible, return with minimal language indicator
    logTranslation(`🏷️ No pattern match, returning original with context`);
    return text;  // Keep original text for readability
  }

  // Check if translation has meaningful Chinese content
  hasSignificantTranslation(text) {
    const chineseCharCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const totalLength = text.length;
    return chineseCharCount > 0 && (chineseCharCount / totalLength) > 0.1; // At least 10% Chinese
  }

  // Smart sentence translation using common patterns
  smartSentenceTranslation(text) {
    let result = text;
    
    // Story openings
    result = result.replace(/Once upon a time/gi, '从前');
    result = result.replace(/Long ago/gi, '很久以前');
    
    // Character introductions
    result = result.replace(/there was a/gi, '有一个');
    result = result.replace(/there was an/gi, '有一个');
    result = result.replace(/there were/gi, '有一些');
    result = result.replace(/lived in/gi, '住在');
    
    // Time expressions
    result = result.replace(/one day/gi, '有一天');
    result = result.replace(/that day/gi, '那一天');
    result = result.replace(/the next day/gi, '第二天');
    
    // Common story phrases
    result = result.replace(/he said/gi, '他说');
    result = result.replace(/she said/gi, '她说');
    result = result.replace(/and so/gi, '于是');
    result = result.replace(/and then/gi, '然后');
    
    return result.replace(/\s+/g, ' ').trim();
  }
}

export default new AlternativeTranslationService();