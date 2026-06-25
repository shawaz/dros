"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Catches render crashes from incomplete/malformed report data (AI output can
 * omit fields) so a single bad section can't take down the whole page. Reset it
 * by giving it a `key` tied to the report's identity (e.g. generatedAt).
 */
export class ReportErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="text-xs text-muted-custom italic px-1 py-3">
            This section couldn&rsquo;t be displayed — its data looks incomplete. Try regenerating the report.
          </div>
        )
      )
    }
    return this.props.children
  }
}
