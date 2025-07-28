import React from 'react';
import { Play, Shield, Zap, TrendingUp, Users, Award, CheckCircle } from 'lucide-react';

interface HomepageProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
  onLogin: () => void;
}

export const Homepage = ({ onGetStarted, onLearnMore, onLogin }: HomepageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header/Navigation */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-orange-500 font-bold text-lg md:text-xl">CryptoMine Pro</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
          <a href="#plans" className="text-slate-300 hover:text-white transition-colors">Plans</a>
          <button 
            onClick={onLogin}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
          >
            Login
          </button>
        </nav>
        <button 
          onClick={onLogin}
          className="md:hidden bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Smart <span className="text-orange-500">Crypto Mining</span>
                  <br />
                  With Guaranteed Returns
                </h1>
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                  Grow your cryptocurrency assets with our automated trading algorithms and mining packages. 
                  Earn up to 100% monthly returns.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onGetStarted}
                  className="bg-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center"
                >
                  Get Started
                </button>
                <button 
                  onClick={onLearnMore}
                  className="border border-slate-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-center"
                >
                  Learn More
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300 text-sm">Bank-level Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-300 text-sm">10,000+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span className="text-slate-300 text-sm">Licensed Platform</span>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 border border-slate-700 relative overflow-hidden">
                {/* 3D Cube Visual - Enhanced design matching screenshot */}
                <div className="relative h-64 md:h-80 flex items-center justify-center">
                  <div className="relative transform-gpu">
                    {/* Main 3D cube structure with glow effects */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                      {/* Multiple cube layers for 3D effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-12 shadow-2xl animate-pulse opacity-90"></div>
                      <div className="absolute inset-1 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg transform rotate-6 shadow-xl opacity-80"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-blue-700 to-purple-800 rounded-lg transform -rotate-3 shadow-lg opacity-70"></div>
                      
                      {/* Floating particles */}
                      <div className="absolute -top-6 -right-6 w-4 h-4 bg-orange-500 rounded-full animate-bounce shadow-lg"></div>
                      <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
                      <div className="absolute top-6 -left-6 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                      <div className="absolute -top-3 left-8 w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-75"></div>
                      <div className="absolute bottom-8 -right-3 w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-100"></div>
                    </div>
                  </div>
                </div>

                {/* ROI Badge */}
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  +25% ROI
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">78%</div>
                    <div className="text-slate-400 text-sm">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-slate-400 text-sm">Automated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-16 md:mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white">Why Choose CryptoMine Pro?</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Experience the future of cryptocurrency mining with our advanced platform
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-colors">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Automated Mining</h3>
                <p className="text-slate-300">
                  Advanced algorithms handle all the technical aspects while you earn passively
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-colors">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">High Returns</h3>
                <p className="text-slate-300">
                  Earn up to 100% monthly returns with our proven mining strategies
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-colors">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Platform</h3>
                <p className="text-slate-300">
                  Bank-level encryption and security measures protect your investments
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-colors">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Community Driven</h3>
                <p className="text-slate-300">
                  Join thousands of successful miners in our growing community
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-colors">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Easy to Start</h3>
                <p className="text-slate-300">
                  Get started in minutes with our user-friendly interface
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-colors">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Proven Results</h3>
                <p className="text-slate-300">
                  Track record of consistent profits and satisfied users
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mt-16 md:mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white">How It Works</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Start earning in just 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">Sign Up</h3>
                <p className="text-slate-300">
                  Create your account and verify your email in under 2 minutes
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Choose Plan</h3>
                <p className="text-slate-300">
                  Select a mining package that fits your investment goals
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">Start Earning</h3>
                <p className="text-slate-300">
                  Watch your profits grow with automated daily returns
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 md:mt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Mining?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already earning daily profits with CryptoMine Pro
              </p>
              <button 
                onClick={onGetStarted}
                className="bg-white text-orange-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 md:mt-24 border-t border-slate-700 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">CryptoMine Pro</span>
            </div>
                 <div className="text-slate-400 text-sm">
                    © {new Date().getFullYear()} CryptoMine Pro. All rights reserved.
                </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
