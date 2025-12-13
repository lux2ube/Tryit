import { Broker } from '../types';

export const brokers: Record<string, Broker> = {
  headway: {
    id: 'headway',
    name: 'Headway',
    description: 'منصة سهلة جداً في الاستخدام وتناسب الجميع. ابدأ استثمارك حتى بـ 1$ فقط',
    logoUrl: 'https://i.ibb.co/1nN1X5P/headway-logo.png', // Placeholder, using a generic if this fails, but keeping structure
    themeColor: 'blue',
  },
  valetax: {
    id: 'valetax',
    name: 'Valetax',
    description: 'خدمات تداول ECN متميزة مع تنفيذ فوري للصفقات.',
    logoUrl: 'https://picsum.photos/id/104/200/200', 
    themeColor: 'teal',
  }
};