import Link from 'next/link'
import { Car, Users, ClipboardList, Shield, Zap, HeadphonesIcon, ArrowRight, Star, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-16 slide-in-left">
            <div className="inline-flex items-center space-x-2 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full text-blue-700 text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Claims Processing</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 tracking-tight">
              Insurance Co-Pilot
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Revolutionary AI-powered roadside assistance with voice interaction, real-time processing, and instant claim resolution
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/customer" className="btn-primary flex items-center space-x-2 text-lg px-8 py-4">
                <Car className="h-5 w-5" />
                <span>Start Your Claim</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/agent" className="btn-outline flex items-center space-x-2 text-lg px-8 py-4">
                <Users className="h-5 w-5" />
                <span>Agent Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 slide-in-right">
            {[
              { label: 'Claims Processed', value: '50K+', icon: Shield },
              { label: 'Avg Response Time', value: '< 2min', icon: Zap },
              { label: 'Customer Rating', value: '4.9★', icon: Star },
              { label: 'Success Rate', value: '99.8%', icon: CheckCircle }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="card-premium text-center p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Three Ways to Get Help
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your preferred method to access our comprehensive insurance services
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Customer Interface */}
            <Link href="/customer" className="group block fade-in">
              <div className="card-premium card-hover group-hover:shadow-2xl group-hover:shadow-blue-200/40 h-full">
                <div className="text-center">
                  {/* Animated Icon Background */}
                  <div className="relative mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                      <Car className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Customer Interface</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    File roadside assistance claims using advanced voice interaction technology. Simply speak your issue and our AI handles the rest.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <HeadphonesIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span>Voice-powered claims</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Zap className="h-4 w-4 text-green-500 mr-2" />
                      <span>Instant AI processing</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      <span>Real-time coverage check</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    <span>Start Filing Claim</span>
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Agent Dashboard */}
            <Link href="/agent" className="group block fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="card-premium card-hover group-hover:shadow-2xl group-hover:shadow-indigo-200/40 h-full">
                <div className="text-center">
                  <div className="relative mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Agent Dashboard</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Monitor and manage customer claims with AI insights, confidence scores, and comprehensive oversight tools.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      <span>AI decision oversight</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Star className="h-4 w-4 text-green-500 mr-2" />
                      <span>Confidence scoring</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Audit trail tracking</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors">
                    <span>Access Dashboard</span>
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Claim Status */}
            <Link href="/status" className="group block fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-premium card-hover group-hover:shadow-2xl group-hover:shadow-emerald-200/40 h-full">
                <div className="text-center">
                  <div className="relative mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                      <ClipboardList className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Claim Status</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Track your roadside assistance claims with real-time updates, timeline progression, and service provider details.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <Zap className="h-4 w-4 text-green-500 mr-2" />
                      <span>Real-time tracking</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <ClipboardList className="h-4 w-4 text-green-500 mr-2" />
                      <span>Progress timeline</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <HeadphonesIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span>SMS notifications</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors">
                    <span>Track Your Claim</span>
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Experience the Future of Insurance Claims
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of satisfied customers who have streamlined their insurance experience with our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/customer" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                <Car className="h-5 w-5" />
                <span>Try Demo Now</span>
              </Link>
              <Link href="/status" className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Check Sample Claim</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}