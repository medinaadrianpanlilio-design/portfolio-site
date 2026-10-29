/**
 * Files (the résumé PDF) need a real navigation; `window.open` after the
 * camera flight would be popup-blocked on phones.
 */
export function navigateTo(
  to: string,
  navigate: (to: string) => void,
  assign: (url: string) => void,
): void {
  if (/\.pdf$/i.test(to)) {
    assign(to)
    return
  }
  navigate(to)
}
