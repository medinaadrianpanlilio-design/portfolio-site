export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Contact', to: '/#contact' },
] as const

export function isNavActive(to: string, pathname: string, hash: string) {
  if (to === '/') {
    return pathname === '/' && hash !== '#skills' && hash !== '#contact'
  }
  if (to === '/projects') {
    return pathname === '/projects' || pathname.startsWith('/projects/')
  }
  if (to === '/about') {
    return pathname === '/about' && hash !== '#skills' && hash !== '#contact'
  }
  if (to === '/#skills') {
    return hash === '#skills' && (pathname === '/' || pathname === '/about')
  }
  if (to === '/#contact') {
    return hash === '#contact' && (pathname === '/' || pathname === '/about')
  }
  return false
}
