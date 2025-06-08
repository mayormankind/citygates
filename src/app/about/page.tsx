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
  ChevronRight,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { Metadata } from "next"
import { missions } from "@/lib/globalConst"

export const metadata: Metadata = {
  title: "About Us",
  description: "CityGates Food Bank is an independent organization registered with the Corporate Affairs Commission with the intention to promote food security in the country. Our aim is to create a sustainable system that enables every individual to have access to quality food with little or no money despite prevailing economic challenges.",
  icons:'/globe.svg'
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <Image
          src="/about2.jpg"
          alt="About us"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center max-w-4xl mx-auto px-4 text-center sm:px-6 gap-6 justify-center z-10 animate-fade-in">
          <h1 className="text-white text-4xl font-bold">About CityGates Food Bank</h1>
          <p className="text-lg text-white/60">
          Dedicated to providing quality food through innovative savings schemes, empowering communities, and alleviating hunger across Nigeria.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/60">Join Our Community</Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-blue-50">
              Explore Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        {/* <div className="mx-auto px-4 sm:px-6 lg:px-8"> */}
        <div className="mx-auto">
          {/* Who We Are */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24 px-4 sm:px-6 lg:px-8">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                Who We Are
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">An Independent Organization Promoting Food Security</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                CityGates Food Bank is an independent organization registered with the Corporate Affairs Commission with
                the intention to promote food security in the country. Our aim is to create a sustainable system that
                enables every individual to have access to quality food with little or no money despite prevailing
                economic challenges.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We are poised to provide a strong food supply network and adequate financial support to members and the
                general public in a unique and innovative dimension.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/leaf.jpg?height=400&width=600"
                  alt="CityGates Food Bank Team"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Registered</p>
                    <p className="text-sm text-gray-600">Corporate Affairs Commission</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Who we are */}
          <section className='grid grid-cols-1 md:grid-cols-2 items-center w-full max-w-4xl mx-auto py-8 gap-8'>
            <div className="w-full">
              <Image
                src="/wwa.jpg"
                alt="Who we are"
                width={500} height={500}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-2 p-6">
              <h1 className="text-3xl font-semibold">Who we are</h1>
              <p>Citygates Food Bank Ltd is an organization dedicated to provision and distribution of food items to the Not-Too-Poor in the society through a systematic savings scheme, thereby, enabling people to have access to quality food supplies for the improvement of lives of people in the community. This ultimately engender positive solutions towards alleviating hunger and poverty in the society. At CityGates Food Bank Ltd, we are poised to provide a strong food supply network and adequate financial support to members and the general public in a unique and innovative dimension.</p>
            </div>
          </section>

        {/* Our vision */}
        <section className='w-full mx-auto py-8 gap-8 bg-blue-100'>
            <div className='grid grid-cols-1 md:grid-cols-2 items-center w-full max-w-4xl mx-auto gap-8'>
                <div className="flex flex-col gap-2 p-6">
                    <h1 className="text-3xl font-semibold">Our Vision</h1>
                    <p>To creatively provide quality food to the most vulnerable people in the society, empower individuals for sustainable economic advancement thereby giving their lives a meaning.</p>
                </div>
                <div className="w-full">
                    <Image
                        src="/vision.jpg"
                        alt="Who we are"
                        width={500} height={500}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </section>

        {/* Our mission */}
        <section className='w-full mx-auto py-8 gap-8 bg-white'>
          <div className='grid grid-cols-1 md:grid-cols-2 items-center w-full max-w-4xl mx-auto gap-8'>
            <div className="w-full">
              <Image
                src="/vision.jpg"
                alt="Who we are"
                width={500} height={500}
                className="object-cover w-full h-full"
              />
            </div>

            {/*mission section*/}
            <div className="flex flex-col gap-2 p-6">
              <h1 className="text-3xl font-bold text-gray-900">Our Mission</h1>
              <ul className="space-y-3 text-gray-700">
                {missions.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
                {/* <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Foster sustainable productivity and investment activities among members and the public.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>
                    Encourage crave for fixed deposit which may be a guarantee for short-term loan facility.
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Enhance food security through our Food Bumper Pack project.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Provide an investment platform capable of breaking the Chain of Poverty among members.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Promote among members the spirit of thrift and mutual help.</span>
                </li> */}
              </ul>
            </div>
          </div>
        </section>

          {/* What We Do & Our Beliefs */}
          <div className="mb-24">
            <Tabs defaultValue="what-we-do" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                  <TabsTrigger value="what-we-do" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">What We Do</TabsTrigger>
                  <TabsTrigger value="our-beliefs" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Our Beliefs</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="what-we-do" className="bg-blue-50 p-8 rounded-2xl">
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">What We Do</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    CityGates Food Bank provides strategic food supply chain and financial support in an ethical
                    cooperative manner with a view to eradicate poverty and ensure food security in the land. We also
                    grant instant loans to men and women in business and career to solve their immediate financial
                    issues.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    In a bid to touch the lives of the most vulnerable, we also go to rural communities to provide food
                    to vulnerable women and children through our communal food outreach programme.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="our-beliefs" className="bg-green-50 p-8 rounded-2xl">
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Our Beliefs</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We strongly believe in food as essential to human existence. We are a quality nutrition focused
                    organization that is committed to alleviating hunger and poverty by delivering quality and high
                    nutritious value food, as well as delivering self-sustaining and wealth creation programmes to the
                    most vulnerable in the society.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Our Transformation */}
          <div className="mb-24 w-full max-w-5xl mx-auto px-4 md:px-0">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                Our Journey
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Transformation</h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-green-500"></div>

              <div className="relative z-10">
                {/* 2018 */}
                <div className="flex flex-col md:flex-row items-center mb-16">
                  <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Champions Finance</h3>
                    <p className="text-gray-700">
                      Registered as a Multi-Purpose Cooperative Society Ltd. with the Federal Capital Territory
                      Authority (FCTA) in accordance to Section 2 of Nigeria Cooperative Society Act No. 98 of 2004.
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center z-10">
                    <span className="font-bold text-blue-600">2018</span>
                  </div>
                  <div className="md:w-1/2 md:pl-12 md:text-left"></div>
                </div>

                {/* 2023 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right"></div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-4 border-green-500 flex items-center justify-center z-10">
                    <span className="font-bold text-green-600">2023</span>
                  </div>
                  <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">CityGates Food Bank Ltd</h3>
                    <p className="text-gray-700">
                      Re-registered the company as CityGates Food Bank Ltd under the company act of 1982 with the Corporate Affairs Commission to expand our
                      services to every corner of the country, overcoming the limited legal capabilities of a
                      Cooperative Society.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Platforms */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                Our Services
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Platforms</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                We created a platform that provides opportunity for the Not-Too-Poor in society to afford quality food
                supply through small contributions within a short period of time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Food Bumper Packages */}
              <Card className="border-blue-100 hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Food Bumper Packages</h3>
                  <p className="text-gray-700 mb-4">
                    A food security initiative with zero tolerance for hunger. Participants contribute a minimum of ₦200
                    daily for a tenure of three, six, or 12 months to collect bountiful food packages.
                  </p>
                  <Link href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              {/* Personal Savings and Loan Scheme */}
              <Card className="border-green-100 hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                    <Landmark className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Savings and Loan Scheme</h3>
                  <p className="text-gray-700 mb-4">
                    Save through regular contributions redeemable at the end of tenure or on request. Access
                    non-collateral, low-interest loans and partake in year-end dividends.
                  </p>
                  <Link href="#" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              {/* Own Your Own Property */}
              <Card className="border-blue-100 hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Own Your Own Property</h3>
                  <p className="text-gray-700 mb-4">
                    Own household and personal properties by making small payments over 3, 6, or 12 months. Items
                    include laptops, plasma TVs, gas cookers, and generators.
                  </p>
                  <Link href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              {/* The Store Front */}
              <Card className="border-green-100 hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                    <Store className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The Store Front</h3>
                  <p className="text-gray-700 mb-4">
                    An online store that provides the opportunity to buy food items directly from us at wholesale
                    prices, making quality food more accessible.
                  </p>
                  <Link href="#" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              {/* Cooperative Membership */}
              <Card className="border-blue-100 hover:shadow-lg transition-all md:col-span-2 lg:col-span-1">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Cooperative Membership</h3>
                  <p className="text-gray-700 mb-4">
                    Open a Cooperative Membership Account (CMA) and Save As You Earn (SAYE) account for periods of
                    three, six, nine, or twelve months. Access loans without collateral at minimum interest rates.
                  </p>
                  <Link href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      {/* <section className="bg-gradient-to-r from-blue-900 to-green-500 py-16 mt-16"> */}
      <section className="bg-blue-900 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Don't Be Left Behind, Join the Train NOW!</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start your journey towards food security and financial empowerment today with CityGates Food Bank Ltd.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-black text-white hover:bg-white/50 hover:text-white">
              <Link href={'/auth/register'}>
                Become a Member
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/50">
              <Link href={'/contact'}>
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
