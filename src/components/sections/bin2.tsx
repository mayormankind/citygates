import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Users, CheckCircle, ArrowRight, Star } from "lucide-react"

export default function CityGatesHero() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-transparent"></div>

        {/* Floating orbs for depth */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-bounce delay-2000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CityGates</h1>
                <p className="text-xs text-blue-200">iWorth Investment</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Investment
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-sm">
                <Shield className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-200 text-sm font-medium">SEC Compliant & Secure</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Grow Your Wealth{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Confidently
                  </span>{" "}
                  with CityGates{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                    iWorth
                  </span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Enjoy up to <span className="text-blue-400 font-semibold">12% annual return</span> — secure, flexible,
                  and transparent investment options designed for your financial growth.
                </p>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 border-0"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-400" />
                    <span>Trusted by 10,000+ investors</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    <span>SEC Compliant</span>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">12%</div>
                  <div className="text-sm text-gray-300">Max Annual Return</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">₦50k</div>
                  <div className="text-sm text-gray-300">Minimum Investment</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">24/7</div>
                  <div className="text-sm text-gray-300">Support Available</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative">
                {/* Main illustration container */}
                <div className="w-96 h-96 relative">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl"></div>

                  {/* Central icon/illustration */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full backdrop-blur-sm border border-blue-400/30 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl">
                        <TrendingUp className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute top-8 right-8 w-16 h-16 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-400/30 flex items-center justify-center animate-bounce delay-500">
                    <span className="text-green-400 font-bold text-sm">+12%</span>
                  </div>

                  <div className="absolute bottom-8 left-8 w-20 h-20 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-400/30 flex items-center justify-center animate-pulse">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>

                  <div className="absolute top-1/2 right-0 w-12 h-12 bg-cyan-500/20 rounded-full backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center animate-ping">
                    <Star className="h-6 w-6 text-cyan-400" />
                  </div>

                  {/* Investment growth visualization */}
                  <div className="absolute bottom-16 right-16">
                    <div className="flex items-end space-x-1">
                      <div className="w-2 h-8 bg-blue-500 rounded-sm"></div>
                      <div className="w-2 h-12 bg-blue-400 rounded-sm"></div>
                      <div className="w-2 h-16 bg-cyan-400 rounded-sm"></div>
                      <div className="w-2 h-20 bg-cyan-300 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-8 text-gray-400 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span>Live Trading</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse delay-500"></div>
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse delay-1000"></div>
            <span>Secure Platform</span>
          </div>
        </div>
      </div>
    </div>
  )
}
