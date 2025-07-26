import React from 'react';
import { ArrowLeft, Shield, Users, TrendingUp, Award, Globe, Lock } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export const About = ({ onBack }: AboutProps) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white font-bold text-lg">About CryptoMine Pro</h1>
        <div></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-xl p-4 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-500 font-bold text-2xl">C</span>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">CryptoMine Pro</h2>
          <p className="text-white/90 text-sm">
            Your trusted partner in automated cryptocurrency mining and smart investment solutions
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-bold text-lg mb-3">Our Mission</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            At CryptoMine Pro, we democratize cryptocurrency mining by providing accessible, 
            automated solutions that allow anyone to participate in the digital economy. 
            Our platform combines cutting-edge mining technology with user-friendly interfaces 
            to deliver consistent returns on investment.
          </p>
        </div>

        {/* Key Features */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg">Why Choose CryptoMine Pro?</h3>
          
          <div className="grid gap-4">
            <div className="bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Automated Mining</h4>
                <p className="text-slate-400 text-sm">
                  Our advanced algorithms handle all mining operations automatically, 
                  ensuring optimal performance and consistent returns.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Bank-Level Security</h4>
                <p className="text-slate-400 text-sm">
                  Your funds and data are protected with military-grade encryption 
                  and secure payment processors.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Community Driven</h4>
                <p className="text-slate-400 text-sm">
                  Join thousands of satisfied users who earn passive income 
                  through our referral program and mining engines.
                </p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Proven Track Record</h4>
                <p className="text-slate-400 text-sm">
                  Established since 2022, we've consistently delivered returns 
                  to our users with transparent operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-bold text-lg mb-4">Our Impact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 mb-1">10,000+</div>
              <div className="text-slate-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">Ksh 50M+</div>
              <div className="text-slate-400 text-sm">Total Payouts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">99.9%</div>
              <div className="text-slate-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">24/7</div>
              <div className="text-slate-400 text-sm">Support</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-bold text-lg mb-4">Our Values</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-orange-500" />
              <span className="text-slate-400 text-sm">
                <strong className="text-white">Transparency:</strong> Open communication about all operations and fees
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-orange-500" />
              <span className="text-slate-400 text-sm">
                <strong className="text-white">Accessibility:</strong> Making cryptocurrency mining available to everyone
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-orange-500" />
              <span className="text-slate-400 text-sm">
                <strong className="text-white">Community:</strong> Building lasting relationships with our users
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-bold text-lg mb-4">Get In Touch</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-400">
              <strong className="text-white">Email:</strong> support@cryptominepro.com
            </p>
            <p className="text-slate-400">
              <strong className="text-white">WhatsApp:</strong> +254 703 819 807
            </p>
            <p className="text-slate-400">
              <strong className="text-white">Telegram:</strong> @cryptomine_hub
            </p>
            {/* <p className="text-slate-400">
              <strong className="text-white">Founded:</strong> May 2022
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};
