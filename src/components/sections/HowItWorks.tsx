"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, Star } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../ui/table"
import { investmentPlans } from "@/lib/globalConst"
import { investmentSteps } from "@/lib/globalConst"

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [visibleItems, setVisibleItems] = useState({ plans: [] as number[], steps: [] as number[] })

  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)

        // Animate plans
        investmentPlans.forEach((_, i) =>
          setTimeout(() => setVisibleItems(prev => ({
            ...prev,
            plans: [...prev.plans, i],
          })), i * 150)
        )

        // Animate steps after a delay
        setTimeout(() => {
          investmentSteps.forEach((_, i) =>
            setTimeout(() => setVisibleItems(prev => ({
              ...prev,
              steps: [...prev.steps, i],
            })), i * 100)
          )
        }, 800)
      } else {
        // Reset when out of view
        setIsVisible(false)
        setVisibleItems({ plans: [], steps: [] })
      }
    },
    { threshold: 0.1 }
  )

  const ref = sectionRef.current
  if (ref) observer.observe(ref)
  return () => observer.disconnect()
}, [])


    return (
    <section ref={sectionRef} className="relative w-full bg-gradient-to-br from-gray-900 via-slate-900 to-black py-24 overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)",
          backgroundSize: "50px 50px"
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-blue-200 text-sm font-medium">CityGates iWorth Investment</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Join the CityGates <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">iWorth Investment</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            GROW WITH UP TO <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">12%</span> ON YOUR INVESTMENTS
          </p>

          <Link href="/auth/register">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              Register Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Plans Table */}
        <div className="mb-24">
          <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Investment Plan</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Select from our flexible investment packages designed to maximize your returns</p>
          </div>

          <div className="flex mx-auto max-w-4xl">
            <Table className="w-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg animate-slide-up">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Minimum</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Tenure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentPlans.map((plan, i) => (
                  <TableRow
                    key={plan.name}
                    className={`transition-all duration-500 transform ${plan.classes.bg} ${plan.classes.border} ${
                      visibleItems.plans.includes(i) ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
                    }`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    <TableCell className="font-medium flex flex-col md:flex-row items-center gap-2">
                      {plan.name}
                      {plan.popular && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white ml-2">
                          <Star className="h-4 w-4 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{plan.min}</TableCell>
                    <TableCell>{plan.rate}</TableCell>
                    <TableCell>{plan.tenure}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get started with your investment in just 10 simple steps</p>
          </div>
          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {investmentSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i}
                  className={`relative flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10 shadow-lg transition-all duration-500 ${
                    visibleItems.steps.includes(i)
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-10 scale-95"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className="absolute flex top-1 left-2 w-6 h-fit opacity-20 font-bold text-2xl text-white">{i + 1}</span>
                    <div className="p-3 bg-gradient-to-br from-yellow-600 via-purple-800 to-slate-700 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-300">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
