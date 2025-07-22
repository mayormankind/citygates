"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { packages } from '@/lib/globalConst';
import Separator from "@/components/layout/separator"
import { useRevealOnScroll } from "@/lib/useRevealOnScroll"
import { useEffect, useState } from "react"
import { Plan } from "@/lib/types"
import { Crown, Loader2 } from "lucide-react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"


export default function Packages() {

  const { sectionRef, isVisible, visibleCards } = useRevealOnScroll(packages.length, 150, true)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

    // Fetch plans from Firestore

  useEffect(() => {
      // Real-time listener for plans
      const unsubscribePlans = onSnapshot(collection(db, "plans"), (snapshot) => {
        const plansData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Plan[]
        setPlans(plansData)
        setLoading(false)
      })
      return () => unsubscribePlans()
    }, [])


  return (
    <section ref={sectionRef}
      className="w-full bg-gradient-to-br from-[#5B1A68]/70  via-purple-800 to-[#5B1A68] py-24 px-6 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#F2C400]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F2C400]/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(242, 196, 0, 0.3) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className={`space-y-6 mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Plans and Packages We Offer</h2>
          <Separator/>
          <p className="text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed text-lg">
            Choose the package that suits your needs without compromising quality or budget. Each plan is designed to
            provide maximum value for your family's food security.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid gap-8 md:grid-cols-2 sm:grid-cols-1 max-w-5xl mx-auto">
          {loading ? (
            <div className="col-span-2 text-center text-gray-500">
              <Loader2 className="inline-block mr-2" />
              Loading packages...
            </div>
          ) : (
            plans.filter((pkg) => pkg.status === 'active').map((pkg,index) => (
              <Card
                key={pkg.name}
                className={`grid md:grid-cols-2 py-0 gap-0 group relative delay-[${index * 200}ms] overflow-hidden transition-all duration-500 transform ${
                  visibleCards.includes(index)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95"
                } hover:scale-105 hover:shadow-2xl bg-white border border-purple-200 rounded-xl`}
              >
                {/* background overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
              ></div>

              {/* Image section */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  width={1000}
                  height={1000}
                  className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500 rounded-l-md"
                />
                {/* Floating Icon */}
                <div
                  className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg z-20`}
                >
                  <Crown className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 md:p-6">
                <CardHeader className="space-y-2 text-left p-0">
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="leading-relaxed p-0 text-gray-500">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-2 border-t">
                  <div className='w-full text-left'>
                    <span className="text-3xl font-bold text-[#5B1A68]">₦{pkg.amount}</span>
                    <span className="ml-2 text-sm text-gray-500">per day</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
          )}
        </div>
      </div>
    </section>
  )
}
