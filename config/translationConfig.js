// Translation API Configuration
// Configure different translation providers (Google Translate, Azure Translator, etc.)

export const TRANSLATION_CONFIG = {
  // Current provider: 'mock' | 'google' | 'azure' | 'aws'
  provider: 'mock',
  
  // API keys (keep these secure in real apps)
  apiKeys: {
    google: process.env.GOOGLE_TRANSLATE_API_KEY,
    azure: process.env.AZURE_TRANSLATOR_KEY,
    aws: process.env.AWS_TRANSLATE_KEY
  },
  
  // Provider endpoints
  endpoints: {
    google: 'https://translation.googleapis.com/language/translate/v2',
    azure: 'https://api.cognitive.microsofttranslator.com/translate',
    aws: 'https://translate.amazonaws.com'
  },
  
  // Cache settings
  cache: {
    enabled: true,
    maxSize: 1000, // Maximum number of cached translations
    ttl: 86400000 // 24 hours in milliseconds
  },
  
  // Fallback options
  fallback: {
    enabled: true,
    returnOriginal: true // Return original text if translation fails
  }
};

// Real API integration examples (for future implementation)

// Google Translate API
export const translateWithGoogle = async (text, targetLang, sourceLang = 'en') => {
  const apiKey = TRANSLATION_CONFIG.apiKeys.google;
  if (!apiKey) throw new Error('Google Translate API key not configured');
  
  const response = await fetch(`${TRANSLATION_CONFIG.endpoints.google}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      target: targetLang,
      source: sourceLang,
      format: 'text'
    })
  });
  
  const data = await response.json();
  return data.data.translations[0].translatedText;
};

// Azure Translator API
export const translateWithAzure = async (text, targetLang, sourceLang = 'en') => {
  const apiKey = TRANSLATION_CONFIG.apiKeys.azure;
  if (!apiKey) throw new Error('Azure Translator API key not configured');
  
  const response = await fetch(`${TRANSLATION_CONFIG.endpoints.azure}?api-version=3.0&to=${targetLang}&from=${sourceLang}`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{ text }])
  });
  
  const data = await response.json();
  return data[0].translations[0].text;
};

// Mock translations for development
export const MOCK_TRANSLATIONS = {
  'en-zh': {
    // Stories
    'The Sleepy Forest Animals': '睡觉的森林动物',
    'The Dream Collector': '梦境收集者', 
    'The Whispering Willow Tree': '低语的柳树',
    'The Little Star\'s Bedtime Journey': '小星星的睡前旅程',
    'The Sleepy Lighthouse': '困倦的灯塔',
    'The Goodnight Garden': '晚安花园',
    'The Three Little Pigs': '三只小猪',
    'Jack and the Beanstalk': '杰克与豆茎',
    'The Amazing Water Cycle Adventure': '神奇的水循环冒险',
    'The Robot Who Learned to Feel': '学会感受的机器人',
    'Cinderella\'s Kindness': '灰姑娘的善良',
    
    // Categories
    'Bedtime': '睡前故事',
    'Classic Tales': '经典故事',
    'Adventure': '冒险故事',
    'Educational': '教育故事',
    'Modern Tales': '现代故事',
    
    // Songs (Real song names from data)
    'Twinkle, Twinkle, Little Star': '小星星',
    'A-B-C Song': 'ABC歌',
    'If You\'re Happy and You Know It': '如果感到幸福你就拍拍手',
    'The Wheels on the Bus': '巴士上的轮子',
    'Rain, Rain, Go Away': '雨雨快走开',
    'Five Little Ducks': '五只小鸭子',
    'Brahms\' Lullaby': '布拉姆斯摇篮曲',
    'Golden Slumbers': '金色睡眠',
    'Hush Little Baby': '安静小宝贝',
    'Rock-a-Bye Baby': '摇摆宝贝',
    'Somewhere Over the Rainbow (Bedtime Version)': '彩虹之上（睡前版）',
    
    // Song Categories (Real categories from data)
    'Classic Nursery': '经典儿歌',
    'Interactive': '互动歌曲',
    'Movement': '运动歌曲', 
    'Calming': '平静歌曲',
    
    // Learning Categories (Real categories from data)
    'Language Tips': '语言技巧',
    'Fun Facts': '有趣事实',
    'Science & Nature': '科学与自然',
    'Feelings': '情感',
    'Arts & Crafts': '艺术与手工',
    'Role Play': '角色扮演',
    
    // Recommendations
    'Submit a lullaby': '提交摇篮曲',
    'Music Sing Together Play': '音乐合唱游戏',
    'Guiro': '刮葫芦',
    'History Multilingual Story': '历史多语言故事',
    
    // Descriptions
    'Gentle forest animals help each other get ready for a peaceful night\'s sleep.': '温和的森林动物互相帮助，准备度过一个宁静的夜晚。',
    'A magical creature helps children have the most wonderful dreams every night.': '一个神奇的生物帮助孩子们每晚都有最美妙的梦境。',
    'An ancient willow tree shares gentle wisdom and comfort with a restless child.': '一棵古老的柳树与一个不安的孩子分享温和的智慧和安慰。',
    'A tiny star learns the importance of rest as it travels across the night sky.': '一颗小星星在夜空中旅行时学会了休息的重要性。',
    'A lighthouse keeper and his gentle light help ships and sea creatures find their way home safely.': '一位灯塔看守员和他温和的灯光帮助船只和海洋生物安全回家。',
    'A kind-hearted girl\'s goodness is rewarded with magic and a happy ending.': '一个善良女孩的美德得到了魔法的回报和幸福的结局。',
    'Three little pigs learn the importance of hard work and planning when they build their houses.': '三只小猪在盖房子时学会了努力工作和规划的重要性。',
    'A brave boy climbs a magical beanstalk and discovers a giant\'s castle in the clouds.': '一个勇敢的男孩爬上魔法豆茎，发现了云中巨人的城堡。'
  },
  
  'en-fr': {
    'The Sleepy Forest Animals': 'Les Animaux Endormis de la Forêt',
    'The Dream Collector': 'Le Collecteur de Rêves',
    'Bedtime': 'Heure du coucher',
    'Classic Tales': 'Contes Classiques',
    'Adventure': 'Aventure',
    'Educational': 'Éducatif',
    'Modern Tales': 'Contes Modernes',
    'Twinkle, Twinkle, Little Star': 'Brille, brille, petite étoile',
    'A-B-C Song': 'Chanson de l\'alphabet',
    'If You\'re Happy and You Know It': 'Si tu es heureux',
    'The Wheels on the Bus': 'Les roues de l\'autobus',
    'Classic Nursery': 'Comptines classiques',
    'Interactive': 'Interactif',
    'Movement': 'Mouvement',
    'Calming': 'Apaisant',
    'Language Tips': 'Conseils linguistiques',
    'Fun Facts': 'Faits amusants',
    'Science & Nature': 'Science et nature',
    'Feelings': 'Sentiments',
    'Arts & Crafts': 'Arts et artisanat',
    'Role Play': 'Jeu de rôle',
    'Submit a lullaby': 'Soumettre une berceuse',
    'Music Sing Together Play': 'Jeu musical chanter ensemble',
    'Guiro': 'Guiro',
    'History Multilingual Story': 'Histoire multilingue'
  },
  
  'en-es': {
    'The Sleepy Forest Animals': 'Los Animales Dormidos del Bosque',
    'The Dream Collector': 'El Colector de Sueños',
    'Bedtime': 'Hora de dormir',
    'Classic Tales': 'Cuentos Clásicos',
    'Adventure': 'Aventura',
    'Educational': 'Educativo',
    'Modern Tales': 'Cuentos Modernos'
  },
  
  'en-uk': {
    'The Sleepy Forest Animals': 'Сонні Лісові Тварини',
    'The Dream Collector': 'Колекціонер Снів',
    'Bedtime': 'Час сну',
    'Classic Tales': 'Класичні Казки',
    'Adventure': 'Пригоди',
    'Educational': 'Освітні',
    'Modern Tales': 'Сучасні Казки'
  },
  
  'en-nl': {
    'The Sleepy Forest Animals': 'De Slaperige Bosdieren',
    'The Dream Collector': 'De Droomverzamelaar',
    'Bedtime': 'Bedtijd',
    'Classic Tales': 'Klassieke Verhalen',
    'Adventure': 'Avontuur',
    'Educational': 'Educatief',
    'Modern Tales': 'Moderne Verhalen'
  }
};