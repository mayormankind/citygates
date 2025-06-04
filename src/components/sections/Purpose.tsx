import { HeartHandshake } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import {
    Briefcase,
    BadgeCheck,
    Lightbulb,
    Headset,
  } from 'lucide-react'

export default function Purpose() {
  
    const features = [
        {
          label: 'Expert Financial Guidance',
          description:
            'Our experienced team of financial experts provides personalized advice to help you make informed investment decisions and achieve your financial goals.',
          icon: Briefcase,
        },
        {
          label: 'Proven Track Record',
          description:
            'With a history of delivering consistent returns, we have built a reputation for trust and reliability in the investment industry.',
          icon: BadgeCheck,
        },
        {
          label: 'Innovative Investment Solutions',
          description:
            'We leverage cutting-edge technology and data-driven insights to offer innovative investment strategies tailored to meet the evolving needs of our clients.',
          icon: Lightbulb, 
        },
        {
          label: 'Comprehensive Support',
          description:
            'From account setup to portfolio management, our dedicated customer service team is here to provide you with full support every step of the way.',
          icon: Headset,
        },
    ]
    

  return (
    <section className="w-full bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our Purpose & Key Features
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                We're on a mission to fight hunger and improve lives by connecting communities to food resources and financial empowerment. Here's how we make it happen:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
                {features.map((feature, idx) => (
                    <div key={idx} className="p-6 rounded-xl shadow hover:shadow-md bg-white text-center">
                        <feature.icon className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.label}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>

  )
}
