"use client"

import { HeartHandshake, ArrowRight, Sparkles } from "lucide-react"
import { features } from "@/lib/globalConst"
import Separator from "@/components/layout/separator"
import Blubs from "@/components/layout/blubs"
import { useRevealOnScroll } from "@/lib/useRevealOnScroll"

export default function Purpose() {

  const { sectionRef, isVisible, visibleCards } = useRevealOnScroll(features.length, 150, true)

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 py-24 px-6 relative overflow-hidden"
    >
      <Blubs/>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Section Heading with enhanced animations */}
        <div className={`flex flex-col items-center space-y-4 mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <HeartHandshake className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Our Purpose & Key Features
            </h2>
            {/* <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div> */}
            <Separator/>
          </div>

          <p className="text-gray-600 max-w-3xl text-lg leading-relaxed">
            We're on a mission to fight hunger and improve lives by connecting communities to food resources and
            financial empowerment. Here's how we make it happen:
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-700 transform ${
                visibleCards.includes(idx) ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
              } hover:scale-105 hover:-translate-y-2`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              {/* Gradient border effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              {/* Floating sparkles effect */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>

              {/* Icon with enhanced styling */}
              <div
                className={`relative w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all duration-300 shadow-md`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
                <feature.icon className={`w-8 h-8 ${feature.iconColor} relative z-10 group-hover:animate-pulse`} />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {feature.label}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Hover arrow indicator */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, currentColor 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action section */}
        <div
          className={`mt-16 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Financial Future?</h3>
            <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
              Join thousands of families who have already started their journey towards food security and financial
              empowerment.
            </p>
            <button className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started Today
              <ArrowRight className="inline-block w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
