import { Broker } from '../types';

export const brokers: Record<string, Broker> = {
  headway: {
    id: 'headway',
    name: 'Headway',
    description: 'منصة سهلة جداً في الاستخدام وتناسب الجميع. ابدأ استثمارك حتى بـ 1$ فقط',
    logoUrl: 'https://hw.online/wp-content/themes/headway/img/logo.svg',
    themeColor: 'blue',
    referralLink: 'https://headway.partners/user/signup?hwp=50ca6f',
  },
  valetax: {
    id: 'valetax',
    name: 'Valetax',
    description: 'خدمات تداول ECN متميزة مع تنفيذ فوري للصفقات.',
    logoUrl: 'https://valetax.com/wp-content/uploads/valetax-logo.svg', 
    themeColor: 'teal',
    referralLink: 'https://ma.valetax.com/p/1646025',
  },
  oneroyal: {
    id: 'oneroyal',
    name: 'OneRoyal',
    description: 'منصة تداول موثوقة مع حد أدنى للإيداع من 10 دولارات فقط. ابدأ رحلتك الاستثمارية الآن',
    logoUrl: 'https://mma.prnewswire.com/media/2657329/OneRoyal_FullColor_BlackBack_Logo.jpg',
    themeColor: 'amber',
    referralLink: 'https://vc.cabinet.oneroyal.com/links/go/13824',
  }
};