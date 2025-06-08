"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Users,
  ShoppingBag,
  Landmark,
  Home,
  Store,
  Target,
  Lightbulb,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Award,
  Calendar,
  Building,
} from "lucide-react"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  const platforms = [
    {
      title: "Food Bumper Packages",
      description:
        "A food security initiative with zero tolerance for hunger. Participants contribute a minimum of ₦200 daily for a tenure of three, six, or 12 months to collect bountiful food packages.",
      icon: ShoppingBag,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Personal Savings and Loan Scheme",
      description:
        "Save through regular contributions redeemable at the end of tenure or on request. Access non-collateral, low-interest loans and partake in year-end dividends.",
      icon: Landmark,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Own Your Own Property",
      description:
        "Own household and personal properties by making small payments over 3, 6, or 12 months. Items include laptops, plasma TVs, gas cookers, and generators.",
      icon: Home,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "The Store Front",
      description:
        "An online store that provides the opportunity to buy food items directly from us at wholesale prices, making quality food more accessible.",
      icon: Store,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "Cooperative Membership",
      description:
        "Open a Cooperative Membership Account (CMA) and Save As You Earn (SAYE) account for periods of three, six, nine, or twelve months. Access loans without collateral at minimum interest rates.",
      icon: Users,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      borderColor: "border-teal-200",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Animate sections one by one
          platforms.forEach((_, index) => {
            setTimeout(() => {
              setVisibleSections((prev) => [...prev, index])
            }, index * 150)
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=800&width=1200"
            alt="About CityGates Food Bank"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#5B1A68]/80 via-purple-900/70 to-black/60" />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#F2C400]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-[#F2C400]/10 border border-[#F2C400]/20 rounded-full backdrop-blur-sm mb-4">
                <Sparkles className="h-4 w-4 text-[#F2C400] mr-2" />
                <span className="text-[#F2C400] text-sm font-medium">About CityGates Food Bank</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Empowering Communities Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C400] to-yellow-300">
                  Food Security
                </span>
              </h1>

              <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Dedicated to providing quality food through innovative savings schemes, empowering communities, and
                alleviating hunger across Nigeria.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#F2C400] to-yellow-500 text-[#5B1A68] hover:from-yellow-500 hover:to-[#F2C400] font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg rounded-xl"
                >
                  Explore Our Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <Building className="h-4 w-4 mr-2" />
                Who We Are
              </div>

              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                An Independent Organization Promoting{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Food Security
                </span>
              </h2>

              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  CityGates Food Bank is an independent organization registered with the Corporate Affairs Commission
                  with the intention to promote food security in the country. Our aim is to create a sustainable system
                  that enables every individual to have access to quality food with little or no money despite
                  prevailing economic challenges.
                </p>
                <p>
                  We are poised to provide a strong food supply network and adequate financial support to members and
                  the general public in a unique and innovative dimension.
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 font-medium">CAC Registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">Trusted Platform</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group-hover:shadow-3xl transition-all duration-300">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="CityGates Food Bank Team"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Heart className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Registered</p>
                      <p className="text-gray-600">Corporate Affairs Commission</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                <Target className="h-4 w-4 mr-2" />
                Our Vision
              </div>

              <h2 className="text-4xl font-bold text-gray-900">
                Creative Solutions for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Vulnerable Communities
                </span>
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed">
                To creatively provide quality food to the most vulnerable people in the society, empower individuals for
                sustainable economic advancement thereby giving their lives a meaning.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Our Vision"
                  width={500}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative md:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-3xl blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Our Mission"
                  width={500}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="space-y-6 md:order-2">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <Lightbulb className="h-4 w-4 mr-2" />
                Our Mission
              </div>

              <h2 className="text-4xl font-bold text-gray-900">
                Fostering{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                  Sustainable Growth
                </span>
              </h2>

              <ul className="space-y-4">
                {[
                  "Foster sustainable productivity and investment activities among members and the public",
                  "Encourage crave for fixed deposit which may be a guarantee for short-term loan facility",
                  "Enhance food security through our Food Bumper Pack project",
                  "Provide an investment platform capable of breaking the Chain of Poverty among members",
                  "Promote among members the spirit of thrift and mutual help",
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do & Our Beliefs */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Approach & Beliefs</h2>
            <p className="text-lg text-gray-600">Understanding our methodology and core values</p>
          </div>

          <Tabs defaultValue="what-we-do" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md bg-white shadow-lg">
                <TabsTrigger
                  value="what-we-do"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  What We Do
                </TabsTrigger>
                <TabsTrigger
                  value="our-beliefs"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Our Beliefs
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="what-we-do">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">What We Do</h3>
                  </div>
                  <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                    <p>
                      CityGates Food Bank provides strategic food supply chain and financial support in an ethical
                      cooperative manner with a view to eradicate poverty and ensure food security in the land. We also
                      grant instant loans to men and women in business and career to solve their immediate financial
                      issues.
                    </p>
                    <p>
                      In a bid to touch the lives of the most vulnerable, we also go to rural communities to provide
                      food to vulnerable women and children through our communal food outreach programme.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="our-beliefs">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Our Beliefs</h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We strongly believe in food as essential to human existence. We are a quality nutrition focused
                    organization that is committed to alleviating hunger and poverty by delivering quality and high
                    nutritious value food, as well as delivering self-sustaining and wealth creation programmes to the
                    most vulnerable in the society.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Transformation Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              Our Journey
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Transformation</h2>
            <p className="text-lg text-gray-600">From cooperative society to comprehensive food bank</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>

            <div className="relative z-10 space-y-16">
              {/* 2018 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Champions Finance</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Registered as a Multi-Purpose Cooperative Society Ltd. with the Federal Capital Territory
                        Authority (FCTA) in accordance to Section 2 of Nigeria Cooperative Society Act No. 98 of 2004.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center z-10 shadow-lg">
                  <span className="font-bold text-blue-600 text-lg">2018</span>
                </div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>

              {/* 2023 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12"></div>
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border-4 border-green-500 flex items-center justify-center z-10 shadow-lg">
                  <span className="font-bold text-green-600 text-lg">2023</span>
                </div>
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">CityGates Food Bank Ltd</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Re-registered as CityGates Food Bank Ltd under the company act of 1982 with the Corporate
                        Affairs Commission to expand our services to every corner of the country, overcoming the limited
                        legal capabilities of a Cooperative Society.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Platforms */}
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Platforms</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We created a platform that provides opportunity for the Not-Too-Poor in society to afford quality food
              supply through small contributions within a short period of time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <Card
                key={platform.title}
                className={`group relative overflow-hidden transition-all duration-700 transform ${
                  visibleSections.includes(index)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95"
                } hover:scale-105 hover:shadow-2xl ${platform.borderColor} border-2`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <CardContent className="p-8 relative z-10">
                  <div
                    className={`w-16 h-16 ${platform.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <platform.icon className={`h-8 w-8 ${platform.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {platform.title}
                  </h3>

                  <p className="text-gray-700 mb-6 leading-relaxed group-hover:text-gray-600 transition-colors">
                    {platform.description}
                  </p>

                  <Link
                    href="#"
                    className={`inline-flex items-center ${platform.iconColor} hover:opacity-80 font-medium group/link`}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#5B1A68] via-purple-800 to-[#5B1A68] py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2C400]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F2C400]/5 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Don't Be Left Behind, Join the Train NOW!</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start your journey towards food security and financial empowerment today with CityGates Food Bank Ltd.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#F2C400] to-yellow-500 text-[#5B1A68] hover:from-yellow-500 hover:to-[#F2C400] font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Become a Member
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg rounded-xl"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
