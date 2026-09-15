// ============================================================
// LubriExpert AI — Frontend TypeScript Models
// ============================================================

export type MessageRole = 'user' | 'assistant';
export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  language: Language;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  language: Language;
}

export interface ChatResponse {
  success: boolean;
  message: {
    role: MessageRole;
    content: string;
  };
  conversationId: string;
  error?: string;
  configurationRequired?: boolean;
}

export interface QuickAction {
  id: string;
  iconName: 'car' | 'factory' | 'gear' | 'droplet' | 'search' | 'scale';
  labelAr: string;
  labelEn: string;
  messageAr: string;
  messageEn: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'automotive',
    iconName: 'car',
    labelAr: 'زيت السيارات',
    labelEn: 'Automotive Oil',
    messageAr: 'أحتاج مساعدة في اختيار زيت المحرك المناسب لسيارتي.',
    messageEn: 'I need help choosing the right engine oil for my car.',
  },
  {
    id: 'industrial',
    iconName: 'factory',
    labelAr: 'التشحيم الصناعي',
    labelEn: 'Industrial Lubrication',
    messageAr: 'أحتاج معلومات عن زيوت التشحيم الصناعية.',
    messageEn: 'I need information about industrial lubricants.',
  },
  {
    id: 'machinery',
    iconName: 'gear',
    labelAr: 'المعدات والآلات',
    labelEn: 'Machinery',
    messageAr: 'أحتاج زيت مناسب لمعدة في مصنع.',
    messageEn: 'I need a lubricant for an industrial machine.',
  },
  {
    id: 'grease',
    iconName: 'droplet',
    labelAr: 'الجريس والشحوم',
    labelEn: 'Grease',
    messageAr: 'ما هو الفرق بين NLGI 2 و NLGI 3؟',
    messageEn: 'What is the difference between NLGI 2 and NLGI 3 grease?',
  },
  {
    id: 'mobil',
    iconName: 'search',
    labelAr: 'منتجات موبيل',
    labelEn: 'Mobil Products',
    messageAr: 'أريد معرفة المزيد عن منتجات موبيل وExxonMobil.',
    messageEn: 'Tell me about Mobil and ExxonMobil lubricant products.',
  },
  {
    id: 'compare',
    iconName: 'scale',
    labelAr: 'مقارنة الزيوت',
    labelEn: 'Compare Oils',
    messageAr: 'ما هو الفرق بين 5W-30 و 5W-40؟',
    messageEn: 'What is the difference between 5W-30 and 5W-40?',
  },
];

export const EXAMPLE_QUESTIONS: Record<Language, string[]> = {
  ar: [
    'ما هو الزيت المناسب لعربيتي؟',
    'ايه الفرق بين 5W-30 و 5W-40؟',
    'ايه الفرق بين NLGI 2 و NLGI 3؟',
    'محتاج زيت لمعدة في مصنع.',
  ],
  en: [
    'What engine oil should I use?',
    'What is the difference between 5W-30 and 5W-40?',
    'What is the difference between NLGI 2 and NLGI 3?',
    'I need lubricant for an industrial gearbox.',
  ],
};
