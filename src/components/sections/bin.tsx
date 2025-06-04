// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { ArrowRight, Users, ShoppingCart, Home, Coins, Heart, Shield } from "lucide-react"
// import Image from "next/image"

// export default function HeroSection() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

//       {/* Hero Section */}
//       <section className="relative w-full">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             {/* Left Column - Content */}
//             <div className="space-y-8 w-full">
//               <div className="space-y-4 w-full">
//                 <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                   <Shield className="h-4 w-4 mr-2" />
//                   Registered with Corporate Affairs Commission
//                 </div>
//                 <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
//                   Empowering Communities Through
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
//                     {" "}
//                     Food Security
//                   </span>
//                 </h1>
//                 <p className="text-xl text-gray-600 leading-relaxed">
//                   Join our innovative savings scheme and gain access to quality food supplies while building financial
//                   stability. We're dedicated to alleviating hunger and poverty through systematic community support.
//                 </p>
//               </div>

//               {/* Key Stats */}
//               <div className="grid grid-cols-3 gap-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-600">₦200</div>
//                   <div className="text-sm text-gray-600">Daily Minimum</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-500">12</div>
//                   <div className="text-sm text-gray-600">Months Max</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-600">0%</div>
//                   <div className="text-sm text-gray-600">Hunger Tolerance</div>
//                 </div>
//               </div>

//               {/* CTA Buttons */}
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
//                   Start Food Package
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
//                 >
//                   Learn More
//                 </Button>
//               </div>

//               {/* Trust Indicators */}
//               <div className="flex items-center space-x-6 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                   CAC Registered
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                   Zero Collateral Loans
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                   Community Focused
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Visual */}
//             <div className="relative">
//               <div className="relative z-10">
//                 <Image
//                   src="/placeholder.svg?height=600&width=500"
//                   alt="Community members receiving food packages"
//                   width={500}
//                   height={600}
//                   className="rounded-2xl shadow-2xl"
//                 />
//               </div>
//               {/* Floating Cards */}
//               <div className="absolute -top-4 -left-4 z-20">
//                 <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
//                   <CardContent className="p-4">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <Users className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">Food Bumper Package</div>
//                         <div className="text-sm text-gray-600">3, 6, or 12 months</div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//               <div className="absolute -bottom-4 -right-4 z-20">
//                 <Card className="bg-white/90 backdrop-blur-sm border-green-200">
//                   <CardContent className="p-4">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                         <Coins className="h-5 w-5 text-green-600" />
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">Savings & Loans</div>
//                         <div className="text-sm text-gray-600">Low interest rates</div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//               {/* Background Elements */}
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200 to-green-200 rounded-full opacity-20 blur-3xl"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Services Preview */}
//       {/* <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Services</h2>
//             <p className="text-lg text-gray-600">Comprehensive solutions for food security and financial empowerment</p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <Card className="hover:shadow-lg transition-shadow border-blue-100">
//               <CardContent className="p-6 text-center">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <ShoppingCart className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Food Bumper Packages</h3>
//                 <p className="text-sm text-gray-600">Daily contributions for bountiful food packages</p>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-lg transition-shadow border-green-100">
//               <CardContent className="p-6 text-center">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Coins className="h-6 w-6 text-green-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Savings & Loans</h3>
//                 <p className="text-sm text-gray-600">Non-collateral loans with low interest rates</p>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-lg transition-shadow border-green-100">
//               <CardContent className="p-6 text-center">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Home className="h-6 w-6 text-green-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Property Ownership</h3>
//                 <p className="text-sm text-gray-600">Own household items through flexible payments</p>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-lg transition-shadow border-green-100">
//               <CardContent className="p-6 text-center">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Users className="h-6 w-6 text-green-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Cooperative Membership</h3>
//                 <p className="text-sm text-gray-600">Join our community for exclusive benefits</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section> */}

//       {/* Call to Action */}
//       {/* <section className="py-16 bg-gradient-to-r from-green-600 to-green-500">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-white mb-4">Don't Be Left Behind, Join the Train NOW!</h2>
//           <p className="text-xl text-green-100 mb-8">
//             Start your journey towards food security and financial empowerment today
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg">
//               Join Food Package Program
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg"
//             >
//               Become a Member
//             </Button>
//           </div>
//         </div>
//       </section> */}
//     </div>
//   )
// }
