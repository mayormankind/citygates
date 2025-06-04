'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function PartnersSection() {
  const sponsors = [
    { name: 'Activa', logo: '/activa.png' },
    { name: 'FCMB', logo: '/fcmb.png' },
    { name: 'Gando', logo: '/gando.jpg' },
    { name: 'Kings Oil', logo: '/kings.png' },
    { name: 'Milo', logo: '/milo.jpg' },
    { name: 'GB foods', logo: '/gb.svg' },
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Clone items for seamless looping
  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return
    const container = containerRef.current
    const original = Array.from(container.children)
    original.forEach(child => container.appendChild(child.cloneNode(true)))
  }, [])

  // Auto-scroll
  useEffect(() => {
    let animationFrame: number

    const scroll = () => {
      if (!scrollRef.current) return
      const el = scrollRef.current
      el.scrollLeft += 1

      // Reset scroll to beginning once halfway through
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0
      }

      animationFrame = requestAnimationFrame(scroll)
    }

    scroll()
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Detect center logo
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current || !containerRef.current) return
      const parent = scrollRef.current
      const center = parent.offsetWidth / 2
      const children = Array.from(containerRef.current.children)

      let closest = 0
      let closestDist = Infinity

      children.forEach((child, index) => {
        const box = child.getBoundingClientRect()
        const mid = box.left + box.width / 2
        const dist = Math.abs(center - mid)
        if (dist < closestDist) {
          closest = index % sponsors.length
          closestDist = dist
        }
      })

      setActiveIndex(closest)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Our Trusted Partners
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          We are proud to collaborate with organizations that share our mission to combat hunger and support communities in need.
        </p>

        <div
          ref={scrollRef}
          className="relative w-full overflow-hidden whitespace-nowrap"
        >
          <div
            ref={containerRef}
            className="flex gap-12 w-max"
          >
            {sponsors.map((sponsor, index) => (
              <div
                key={`logo-${index}`}
                className="flex items-center justify-center min-w-[120px] h-[80px] transition-all duration-300"
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={120}
                  height={60}
                  className={`object-contain transition duration-500 ${
                    index === activeIndex ? 'grayscale-0' : 'grayscale'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

