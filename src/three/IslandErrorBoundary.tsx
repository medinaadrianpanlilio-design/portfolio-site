import { Component, type ErrorInfo, type ReactNode } from 'react'

type IslandErrorBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
}

type IslandErrorBoundaryState = {
  failed: boolean
}

export class IslandErrorBoundary extends Component<
  IslandErrorBoundaryProps,
  IslandErrorBoundaryState
> {
  state: IslandErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): IslandErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('SkySprout island render failed', error, info.componentStack)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
