export const iahbrary = {
  name: 'Iahbrary',
  tagline: 'A reading tracker that treats reading like training.',
  description:
    'A mobile and web reading tracker for timed sessions, pace, a personal library, reviews, highlights, and weekly stats. Expo and Supabase; the public repository is a sanitized copy.',
  notes: [
    'Owner-only RLS and email-only login remove the prototype’s public email directory.',
    'Sessions and reviews derive ownership from the parent user_books row; the shared catalog is insert-only for clients.',
    'An offline queue keeps a reading session safe when the network drops.',
  ],
  repoUrl: 'https://github.com/medinaadrianpanlilio-design/iahbrary',
  image: '/images/iahbrary-home.webp',
  imageAlt:
    'Iahbrary reading screen showing The Way of Kings, 19 sessions, and a start button.',
} as const
