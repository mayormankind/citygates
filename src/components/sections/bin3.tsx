// 'use client';

// import React from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription
// } from '@/components/ui/card';
// import Image from 'next/image';
// // import { packages } from '@/lib/globalConst';
// // import { HeartHandshake } from 'lucide-react';

// export default function Packages() {

//   const packages = [
//     {
//       label: "Double Jumbo",
//       description:
//         "Designed for the Odogwus who like to do it Big because of their big responsibility",
//       price: "₦1100",
//       per: "Per day",
//       image: "/jumbo.jpg",
//     },
//     {
//       label: "Chickito Bumper",
//       description:
//         "A perfect choice for those who want a balance of quality and affordability",
//       price: "₦800",
//       per: "Per day",
//       image: "/product.jpg",
//     },
//     {
//       label: "Minimini",
//       description:
//         "Ideal for budget-conscious individuals who still want great value",
//       price: "₦500",
//       per: "Per day",
//       image: "/mini.jpg",
//     },
//   ];

//   return (
//     <section className="w-full bg-brand py-20 px-6">
//       <div className="max-w-5xl mx-auto text-center">
//         <div className="space-y-4">
//           <h2 className="text-4xl font-bold text-brand">
//             Plans and Packages We Offer
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
//           <p className="text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed text-lg">
//             Choose the package that suits your needs without compromising quality or budget.
//           </p>
//         </div>
//       </div>

//       <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
//         {packages.map((pkg) => (
//           <Card
//             key={pkg.label}
//             className="hover:shadow-xl rounded-xl overflow-hidden transition-shadow duration-300 ease-in-out grid md:grid-cols-2 py-0 gap-0 border border-brand bg-white" 
//           >
//             <Image
//               src={pkg.image}
//               alt={pkg.label}
//               width={1000}
//               height={1000}
//               className="w-full h-60 object-cover rounded-l-md"
//             />
//             <div className="flex flex-col gap-4 p-4">
//               <CardHeader className="space-y-2 text-left">
//                 <CardTitle className="text-xl font-semibold text-gray-800">
//                   {pkg.label}
//                 </CardTitle>
//                 <CardDescription className="text-gray-600">
//                   {pkg.description}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="mt-auto pt-2 border-t">
//                 <p className="text-lg font-medium  text-brand text-gray-800">{pkg.price}
//                 <span className="ml-1 text-sm text-brand/60 text-gray-500">{pkg.per}</span></p>
//               </CardContent>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Star, ArrowRight, Sparkles, Crown, Heart, CheckCircle, TrendingUp } from "lucide-react"

export default function PackagesNew() {
  const [isVisible, setIsVisible] = useState(false)
  const [visiblePackages, setVisiblePackages] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  const packages = [
    {
      label: "Double Jumbo",
      description: "Designed for the Odogwus who like to do it Big because of their big responsibility",
      price: "₦1,100",
      per: "Per day",
      image: "/jumbo.jpg",
      popular: false,
      icon: Crown,
      features: ["Premium food selection", "Family-sized portions", "Priority delivery", "24/7 support"],
      color: "from-purple-600 to-purple-800",
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      savings: "Save ₦15,000 annually",
    },
    {
      label: "Chickito Bumper",
      description: "A perfect choice for those who want a balance of quality and affordability",
      price: "₦800",
      per: "Per day",
      image: "/product.jpg",
      popular: true,
      icon: Star,
      features: ["Quality food items", "Balanced portions", "Regular delivery", "Customer support"],
      color: "from-yellow-500 to-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      savings: "Save ₦12,000 annually",
    },
    {
      label: "Minimini",
      description: "Ideal for budget-conscious individuals who still want great value",
      price: "₦500",
      per: "Per day",
      image: "/mini.jpg",
      popular: false,
      icon: Heart,
      features: ["Essential food items", "Individual portions", "Weekly delivery", "Basic support"],
      color: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      savings: "Save ₦8,000 annually",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Animate packages one by one
          packages.forEach((_, index) => {
            setTimeout(() => {
              setVisiblePackages((prev) => [...prev, index])
            }, index * 200)
          })
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-[#5B1A68] via-purple-800 to-[#5B1A68] py-24 px-6 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#F2C400]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F2C400]/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(242, 196, 0, 0.3) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div
          className={`space-y-6 mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#F2C400]/10 border border-[#F2C400]/20 rounded-full backdrop-blur-sm mb-4">
            <ShoppingBag className="h-4 w-4 text-[#F2C400] mr-2" />
            <span className="text-[#F2C400] text-sm font-medium">Food Packages</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Plans and Packages We Offer</h2>

          <div className="w-24 h-1 bg-gradient-to-r from-[#F2C400] to-yellow-500 mx-auto rounded-full mb-6"></div>

          <p className="text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed text-lg">
            Choose the package that suits your needs without compromising quality or budget. Each plan is designed to
            provide maximum value for your family's food security.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.label}
              className={`group relative overflow-hidden transition-all duration-700 transform ${
                visiblePackages.includes(index)
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-10 scale-95"
              } hover:scale-105 hover:shadow-2xl bg-white border-2 ${pkg.borderColor} rounded-2xl`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-[#F2C400] to-yellow-500 text-[#5B1A68] px-4 py-1 shadow-lg font-semibold">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
              ></div>

              {/* Sparkle Effect */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-5 w-5 text-[#F2C400] animate-pulse" />
              </div>

              {/* Image Section */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <Image
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.label}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Floating Icon */}
                <div
                  className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${pkg.color} rounded-full flex items-center justify-center shadow-lg z-20`}
                >
                  <pkg.icon className="h-6 w-6 text-white" />
                </div>

                {/* Savings Badge */}
                <div className="absolute bottom-4 right-4 bg-[#F2C400]/90 text-[#5B1A68] px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm z-20">
                  {pkg.savings}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                <CardHeader className="p-0 space-y-3">
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {pkg.label}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{pkg.description}</CardDescription>
                </CardHeader>

                {/* Features List */}
                <div className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <CardContent className="p-0 pt-4 border-t border-gray-100">
                    <div className="flex items-baseline justify-between mb-4">
                        <div>
                            <span className="text-3xl font-bold text-[#5B1A68]">{pkg.price}</span>
                            <span className="ml-2 text-sm text-gray-500">{pkg.per}</span>
                        </div>
                        <div className="flex items-center text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Great Value</span>
                        </div>
                    </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full bg-gradient-to-r ${pkg.color} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300 group-hover:from-[#5B1A68] group-hover:to-purple-700`}
                  >
                    Choose {pkg.label}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-[#F2C400]/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Can't Decide? We're Here to Help!</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Our team can help you choose the perfect package based on your family size, budget, and dietary
              preferences.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#F2C400] to-yellow-500 text-[#5B1A68] px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Personalized Recommendation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
