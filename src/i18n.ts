import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Minimal translation dictionaries for the Header and main UI
const resources = {
  en: {
    translation: {
      "app_name": "Calorie Tracker",
      "scan": "Scan Plate",
      "daily": "Daily Log",
      "analytics": "Analytics",
      "seo": "SEO Engine",
      "sign_in": "Sign In",
      "pro": "Pro",
      "hero_title": "Snap & Read Food Plate",
      "hero_desc": "Reads itemized calories (e.g. Corn 250 kcal, Potatoes 400 kcal, Meat 500 kcal = 1,150 total kcal) with exact timestamp logging."
    }
  },
  es: {
    translation: {
      "app_name": "Rastreador de Calorías",
      "scan": "Escanear Plato",
      "daily": "Registro Diario",
      "analytics": "Analíticas",
      "seo": "Motor SEO",
      "sign_in": "Iniciar Sesión",
      "pro": "Pro",
      "hero_title": "Tomar Foto y Leer Plato",
      "hero_desc": "Lee las calorías detalladas con registro exacto de tiempo."
    }
  },
  zh: {
    translation: {
      "app_name": "卡路里追踪器",
      "scan": "扫描餐盘",
      "daily": "每日记录",
      "analytics": "分析",
      "seo": "SEO引擎",
      "sign_in": "登录",
      "pro": "专业版",
      "hero_title": "拍照并识别餐盘",
      "hero_desc": "准确读取各项食物卡路里并记录确切时间戳。"
    }
  },
  hi: {
    translation: {
      "app_name": "कैलोरी ट्रैकर",
      "scan": "स्कैन प्लेट",
      "daily": "दैनिक लॉग",
      "analytics": "एनालिटिक्स",
      "seo": "एसईओ इंजन",
      "sign_in": "साइन इन करें",
      "pro": "प्रो",
      "hero_title": "फोटो लें और भोजन पढ़ें",
      "hero_desc": "सटीक समय स्टैम्प लॉगिंग के साथ आइटम की गई कैलोरी पढ़ता है।"
    }
  },
  fr: {
    translation: {
      "app_name": "Suivi des Calories",
      "scan": "Scanner l'assiette",
      "daily": "Journal Quotidien",
      "analytics": "Analytique",
      "seo": "Moteur SEO",
      "sign_in": "Se Connecter",
      "pro": "Pro",
      "hero_title": "Prendre une photo de l'assiette",
      "hero_desc": "Lit les calories détaillées avec enregistrement exact de l'heure."
    }
  },
  pt: {
    translation: {
      "app_name": "Rastreador de Calorias",
      "scan": "Escanear Prato",
      "daily": "Registro Diário",
      "analytics": "Análises",
      "seo": "Motor SEO",
      "sign_in": "Entrar",
      "pro": "Pro",
      "hero_title": "Tirar Foto do Prato",
      "hero_desc": "Lê as calorias detalhadas com registro exato de tempo."
    }
  }
};

// Parse the language directly from the URL path to ensure the UI changes instantly
const currentPathLang = window.location.pathname.split('/')[1];
const initialLang = ['en', 'es', 'zh', 'hi', 'fr', 'pt'].includes(currentPathLang) ? currentPathLang : 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang, // Force the language based on the URL
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
