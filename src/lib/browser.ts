/**
 * Browser detection and performance preference utilities.
 * Used to selectively disable expensive visual features on
 * Safari (known for poor backdrop-filter / mix-blend-mode perf)
 * and for users who prefer reduced motion.
 */

export function isSafari(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium')
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function shouldReduceMotion(): boolean {
  return isSafari() || prefersReducedMotion()
}
