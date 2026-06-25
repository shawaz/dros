"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Tracks which section is currently in view as the page scrolls, returning the
 * active id and a `scrollTo` that smooth-scrolls to a section (suppressing the
 * observer briefly so the clicked item stays highlighted during the scroll).
 *
 * Section elements are looked up by `id` from the DOM, so callers just need to
 * render elements with matching ids.
 */
export function useScrollSpy(ids: string[], defaultId?: string) {
  const [active, setActive] = useState(defaultId ?? ids[0] ?? "")
  const clickLock = useRef(false)
  const visibility = useRef<Record<string, boolean>>({})
  const idsKey = ids.join(",")

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibility.current[e.target.id] = e.isIntersecting
        })
        if (clickLock.current) return
        const firstVisible = ids.find((id) => visibility.current[id])
        if (firstVisible) setActive(firstVisible)
      },
      // Activate a section once it reaches the top ~12% band of the viewport.
      { rootMargin: "-12% 0px -78% 0px", threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  const scrollTo = useCallback((id: string) => {
    setActive(id)
    clickLock.current = true
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    window.setTimeout(() => {
      clickLock.current = false
    }, 700)
  }, [])

  return { active, scrollTo }
}
