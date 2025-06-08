import { useEffect, useRef, useState } from "react"

type UseRevealOnScrollResult = {
  sectionRef: React.RefObject<HTMLElement | null>
  isVisible: boolean
  visibleCards: number[]
}

export function useRevealOnScroll(
  cardCount: number,
  delayPerCard: number = 150,
  repeat: boolean = false
): UseRevealOnScrollResult {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          for (let i = 0; i < cardCount; i++) {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, i])
            }, i * delayPerCard)
          }
        } else if (repeat) {
          // Reset when not visible
          setIsVisible(false)
          setVisibleCards([])
        }
      },
      { threshold: 0.1 }
    )

    const current = sectionRef.current
    if (current) observer.observe(current)

    return () => observer.disconnect()
  }, [cardCount, delayPerCard, repeat])

  return { sectionRef, isVisible, visibleCards }
}
