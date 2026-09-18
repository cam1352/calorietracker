import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Minimal translation dictionaries for the Header and main UI
const resources = {
  en: {
    translation: {
      "app_name": "Calorie Tracker",
      "subtitle": "AI Photo Food & Plate Calorie Reader",
      "scan": "Scan Plate",
      "daily": "Daily Log",
      "analytics": "Analytics",
      "seo": "SEO Engine",
      "sign_in": "Sign In",
      "pro": "Pro"
    }
  },
  es: {
    translation: {
      "app_name": "Rastreador de Calorías",
      "subtitle": "Lector de calorías de alimentos con IA",
      "scan": "Escanear Plato",
      "daily": "Registro Diario",
      "analytics": "Analíticas",
      "seo": "Motor SEO",
      "sign_in": "Iniciar Sesión",
      "pro": "Pro"
    }
  },
  zh: {
    translation: {
      "app_name": "卡路里追踪器",
      "subtitle": "AI 食物及盘子卡路里读取器",
      "scan": "扫描餐盘",
      "daily": "每日记录",
      "analytics": "分析",
      "seo": "SEO引擎",
      "sign_in": "登录",
      "pro": "专业版"
    }
  },
  hi: {
    translation: {
      "app_name": "कैलोरी ट्रैकर",
      "subtitle": "एआई फोटो फूड और प्लेट कैलोरी रीडर",
      "scan": "स्कैन प्लेट",
      "daily": "दैनिक लॉग",
      "analytics": "एनालिटिक्स",
      "seo": "एसईओ इंजन",
      "sign_in": "साइन इन करें",
      "pro": "प्रो"
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
