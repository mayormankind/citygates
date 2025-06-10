import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Users, CheckCircle, ArrowRight, Star } from "lucide-react"

export default function Hero() {
  return (
    <div className="h-full min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-orange-950 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/50 to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-yellow-500/20 rounded-full blur-xl animate-bounce delay-2000"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(253, 224, 71, 0.3) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Empowering Families Through{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">Food</span>{" "}
                  and{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Finance</span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl hidden md:block">
                  We make quality food accessible through simple savings because{" "}
                  <span className="text-yellow-400 font-semibold">no one should go hungry</span>. Join our community of
                  families building food security together.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Join Our Platform
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-yellow-300 hover:text-white hover:bg-white/10 px-8 py-4 text-lg underline-offset-4 hover:underline"
                  >
                    Learn how it works
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>Trusted by thousands across Nigeria</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-yellow-300" />
                    <span>Registered with CAC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative">
                <div className="w-96 h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-400/30 flex">
                      <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex shadow-2xl m-auto">
                        <TrendingUp className="h-16 w-16 text-white m-auto" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30 flex animate-bounce delay-500">
                    <span className="text-yellow-300 font-bold text-sm m-auto">+12%</span>
                  </div>

                  <div className="absolute bottom-8 left-8 w-20 h-20 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-400/30 flex animate-pulse">
                    <Shield className="h-8 w-8 text-purple-300 m-auto" />
                  </div>

                  <div className="absolute top-1/2 right-0 w-12 h-12 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30 flex animate-ping">
                    <Star className="h-6 w-6 m-auto text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}
