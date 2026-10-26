export const site = {
  name: 'Adrian Medina',
  role: 'Computer Science student · backend, web, and mobile developer',
  email: 'medinaadrianpanlilio@gmail.com',
  linkedin: 'https://www.linkedin.com/in/adrian-alexander-medina-022b8a433/',
  github: 'https://github.com/medinaadrianpanlilio-design',
  location: 'Pampanga, Philippines',
} as const

export interface StackItem {
  name: string
  category: 'Languages' | 'Backend & Data' | 'Frontend & Mobile' | 'DevOps & Tools'
  brandColor: string
  description: string
}

export const STACK_ITEMS: StackItem[] = [
  { name: 'TypeScript', category: 'Languages', brandColor: '#3178c6', description: 'Strong typing for modern full-stack code' },
  { name: 'JavaScript', category: 'Languages', brandColor: '#f7df1e', description: 'ESNext core language fundamentals' },
  { name: 'Python', category: 'Languages', brandColor: '#3776ab', description: 'Scripting, tooling, and backend routines' },
  { name: 'PHP', category: 'Languages', brandColor: '#777bb4', description: 'Backend APIs and server-side web systems' },
  { name: 'C++', category: 'Languages', brandColor: '#00599c', description: 'Foundational CS, algorithms, data structures' },
  { name: 'PostgreSQL', category: 'Backend & Data', brandColor: '#336791', description: 'Relational schemas, queries, migrations' },
  { name: 'Supabase', category: 'Backend & Data', brandColor: '#3ecf8e', description: 'Auth, Postgres, storage, row-level security' },
  { name: 'React', category: 'Frontend & Mobile', brandColor: '#61dafb', description: 'Modular web apps with reactive state' },
  { name: 'React Native', category: 'Frontend & Mobile', brandColor: '#61dafb', description: 'Cross-platform mobile interfaces' },
  { name: 'Expo', category: 'Frontend & Mobile', brandColor: '#4f4a43', description: 'Mobile toolchain, native device access' },
  { name: 'Docker', category: 'DevOps & Tools', brandColor: '#2496ed', description: 'Containerized environments & reproducibility' },
  { name: 'Git', category: 'DevOps & Tools', brandColor: '#f05032', description: 'Version control, atomic commits, branch flow' },
]
