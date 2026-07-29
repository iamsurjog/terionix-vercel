import { useEffect, useRef } from 'react'
import { isSafari } from '#/lib/browser'

export function CursorGlow() {
  // Safari chokes on mix-blend-mode: difference with fixed-position
  // elements, causing severe scroll/input lag. Fall back to native cursor.
  if (isSafari()) return null
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mouseX = 0, mouseY = 0
    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let rafId: number
    let idleTimer: ReturnType<typeof setTimeout>
    let isAnimating = true

    const stopAnimation = () => {
      isAnimating = false
      if (rafId) cancelAnimationFrame(rafId)
    }

    const startAnimation = () => {
      if (isAnimating) return
      isAnimating = true
      animate()
    }

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      clearTimeout(idleTimer)
      startAnimation()
      idleTimer = setTimeout(stopAnimation, 2000)
    }

    const onHoverable = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, input, textarea, select, [role="button"]')
      if (target) {
        ringRef.current?.classList.add('hovering')
      } else {
        ringRef.current?.classList.remove('hovering')
      }
    }

    const animate = () => {
      if (!isAnimating) return
      dotX += (mouseX - dotX) * 0.25
      dotY += (mouseY - dotY) * 0.25
      ringX += (mouseX - ringX) * 0.1
      ringY += (mouseY - ringY) * 0.1

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouse)
    document.addEventListener('mouseover', onHoverable)
    animate()

    return () => {
      document.removeEventListener('mousemove', onMouse)
      document.removeEventListener('mouseover', onHoverable)
      clearTimeout(idleTimer)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
