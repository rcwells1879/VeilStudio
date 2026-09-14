'use client'

import Script from 'next/script'
import { useEffect } from 'react'

type ScrollWorldRoot = HTMLElement & { scrollWorldCleanup?: () => void }

export default function ScrollWorldController() {
  useEffect(() => {
    const root = document.getElementById('scroll-world') as ScrollWorldRoot | null
    return () => root?.scrollWorldCleanup?.()
  }, [])

  return (
    <Script
      src="/scroll-world/scroll-world.js?v=20260914-3"
      strategy="afterInteractive"
      onReady={() => {
        const runtime = window as Window & { initScrollWorld?: () => void }
        runtime.initScrollWorld?.()
      }}
    />
  )
}
