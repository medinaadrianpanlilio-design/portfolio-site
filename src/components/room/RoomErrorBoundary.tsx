import { Component, type ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode }

// Duck-typed so this boundary can sit outside the lazy chunk without importing three.
const missingNodes = (error: unknown) =>
  error instanceof Error && error.name === 'RoomContractError'
    ? (error as Error & { missing: string[] }).missing
    : null

/**
 * A failed chunk download or a broken room export shows the still image,
 * never a blank hero or a blank site.
 */
export class RoomErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    const missing = missingNodes(error)
    if (missing) {
      console.error('[room] missing nodes:', missing.join(', '))
    } else {
      console.error('[room]', error)
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
