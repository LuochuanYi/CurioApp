// 🌍 Simple Multilingual Story Content
// Direct multilingual content without complex imports to avoid Metro bundler issues

export const MULTILINGUAL_STORY_CONTENT = {
  // Sample multilingual stories - can be expanded
  1: {
    en: { title: "The Three Little Pigs", summary: "Three pigs learn about hard work" },
    zh: { title: "三只小猪", summary: "三只小猪学习努力工作" },
    fr: { title: "Les Trois Petits Cochons", summary: "Trois cochons apprennent le travail" },
    es: { title: "Los Tres Cerditos", summary: "Tres cerditos aprenden sobre trabajo" },
    uk: { title: "Три Поросятка", summary: "Три поросятка вчаться працювати" },
    nl: { title: "De Drie Biggetjes", summary: "Drie biggetjes leren over werk" }
  }
};

export const MULTILINGUAL_CATEGORIES = {
  bedtime: {
    en: "Bedtime", zh: "睡前", fr: "Coucher", 
    es: "Hora de dormir", uk: "Час сну", nl: "Bedtijd"
  },
  classic: {
    en: "Classic Tales", zh: "经典故事", fr: "Contes Classiques",
    es: "Cuentos Clásicos", uk: "Класичні Казки", nl: "Klassieke Verhalen"
  },
  adventure: {
    en: "Adventure", zh: "冒险", fr: "Aventure",
    es: "Aventura", uk: "Пригода", nl: "Avontuur"
  },
  educational: {
    en: "Educational", zh: "教育", fr: "Éducatif",
    es: "Educativo", uk: "Освітні", nl: "Educatief"
  }
};