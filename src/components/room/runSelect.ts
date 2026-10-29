/**
 * One tap on a room object: fly in, open the page, fly back to the start
 * view. `busy` lives on the component so taps during a flight are ignored,
 * and `finally` unlocks the room even when a step fails.
 */
export async function runSelect(
  busy: { current: boolean },
  steps: { fly: () => Promise<void>; open: () => void; reset: () => Promise<void> },
): Promise<void> {
  if (busy.current) return
  busy.current = true
  try {
    await steps.fly()
    steps.open()
  } finally {
    // Same-page sections and the PDF keep this room mounted: never leave it zoomed in.
    await steps.reset().catch(() => {})
    busy.current = false
  }
}
