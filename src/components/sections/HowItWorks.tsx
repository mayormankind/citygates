"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText, Settings, Calculator, CreditCard, TrendingUp,
  Calendar, Wallet, CheckCircle, Sparkles, ArrowRight, Star,
} from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../ui/table"



const investmentPlans = [
  {
    name: "CityMax",
    min: "₦1,000,000",
    rate: "12%",
    tenure: "365 Days",
    popular: false,
    classes: {
      bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600",
    },
  },
  {
    name: "CityFlex",
    min: "₦500,000",
    rate: "10%",
    tenure: "182 or 365 Days",
    popular: true,
    classes: {
      bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600",
    },
  },
  {
    name: "CityCrux",
    min: "₦50,000",
    rate: "7%",
    tenure: "90, 182 or 365 Days",
    popular: false,
    classes: {
      bg: "bg-green-50", border: "border-green-200", text: "text-green-600",
    },
  },
]

const investmentSteps = [
  { title: "Pick Investment Form", description: "Choose a CityGatesFB Investment Form to get started", icon: FileText },
  { title: "Select Package", description: "Fill the form and select your preferred Investment Package", icon: Settings },
  { title: "Set Investment Amount", description: "Name your investment and input the amount you want to invest", icon: Calculator },
  { title: "Choose Payment Method", description: "Select your preferred method of payment to CityGatesFB", icon: CreditCard },
  { title: "Configure Top-ups", description: "Choose your periodic top-up type and value for growth", icon: TrendingUp },
  { title: "Select Tenure", description: "Pick your preferred tenor from the available options", icon: Calendar },
  { title: "Set Payout Account", description: "Indicate where you want your investment paid at maturity", icon: Wallet },
  { title: "Review & Confirm", description: "Review summary, accept terms and get your investment certificate", icon: CheckCircle },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [visibleItems, setVisibleItems] = useState({ plans: [] as number[], steps: [] as number[] })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)

          investmentPlans.forEach((_, i) =>
            setTimeout(() => setVisibleItems(prev => ({
              ...prev, plans: [...prev.plans, i]
            })), i * 150)
          )

          setTimeout(() => {
            investmentSteps.forEach((_, i) =>
              setTimeout(() => setVisibleItems(prev => ({
                ...prev, steps: [...prev.steps, i]
              })), i * 100)
            )
          }, 800)
        }
      },
      { threshold: 0.1 }
    )

    const ref = sectionRef.current
    if (ref) observer.observe(ref)
    return () => observer.disconnect()
  }, [isVisible])

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
                    className={`transition-all duration-500 transform hover:scale-105 ${plan.classes.bg} ${plan.classes.border} ${
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
        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {investmentSteps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i}
                className={`flex flex-col items-center delay-[${i * 100}ms]text-center p-6 rounded-xl bg-white/5 border border-white/10 shadow-lg transition-all duration-500 ${
                  visibleItems.steps.includes(i)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95"
                }`}
              >
                {/* <div className="bg-blue-600/20 text-blue-300 rounded-full p-3 mb-4"> */}
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
    </section>
  )
}
