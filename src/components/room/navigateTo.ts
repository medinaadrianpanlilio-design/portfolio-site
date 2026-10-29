/**
 * Files (the résumé PDF) need a real navigation; `window.open` after the
 * camera flight would be popup-blocked on phones. Same-page sections are
 * scrolled to directly, because the router does nothing when the hash is
 * already the same.
 */
export function navigateTo(
  to: string,
  navigate: (to: string) => void,
  assign: (url: string) => void,
  scroll: (id: string) => void,
): void {
  if (/\.pdf$/i.test(to)) {
    assign(to)
    return
  }
  navigate(to)
  if (to.startsWith('/#')) scroll(to.slice(2))
}
