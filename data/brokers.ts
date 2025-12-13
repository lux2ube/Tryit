import { Broker } from '../types';

export const brokers: Record<string, Broker> = {
  headway: {
    id: 'headway',
    name: 'Headway',
    description: 'International regulated broker.',
    logoUrl: 'https://picsum.photos/id/103/200/200', 
    themeColor: 'blue',
  },
  valetax: {
    id: 'valetax',
    name: 'Valetax',
    description: 'Premium ECN trading services.',
    logoUrl: 'https://picsum.photos/id/104/200/200', 
    themeColor: 'teal',
  }
};