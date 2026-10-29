import { Component, type ReactNode } from 'react'

import { RoomContractError } from './findRoomNodes'

type Props = { fallback: ReactNode; children: ReactNode }

/** A broken or missing room export shows the still image, never a blank hero. */
export class RoomErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (error instanceof RoomContractError) {
      console.error('[room] missing nodes:', error.missing.join(', '))
    } else {
      console.error('[room]', error)
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
