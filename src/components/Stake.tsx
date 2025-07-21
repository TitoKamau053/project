import { useState, useRef } from 'react';
import { Zap, Clock, Percent } from 'lucide-react';

export const Stake = () => {
  const [selectedEngine, setSelectedEngine] = useState(0);
  const profitEnginesRef = useRef<HTMLDivElement>(null);

  const scrollToProfitEngines = () => {
    if (profitEnginesRef.current) {
      profitEnginesRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const engines = [
    {
      id: 1,
      name: "Daily Mine Pro",
      roi: "10.00%",
      duration: "1 Days",
      minInvestment: "KSh 300.00",
      maxInvestment: "KSh 1,000,000.00",
      price: "KSh 300.00",
      featured: true,
      remaining: "3 left",
      selected: false
    },
    {
      id: 2,
      name: "Crypto Blast",
      roi: "30.00%",
      duration: "1 Days",
      minInvestment: "KSh 5,000.00",
      maxInvestment: "KSh 1,000,000.00",
      price: "KSh 5,000.00",
      featured: false,
      selected: false
    },
    {
      id: 3,
      name: "Triple Mine",
      roi: "35.00%",
      duration: "10 Hours",
      minInvestment: "KSh 50,000.00",
      maxInvestment: "KSh 1,000,000.00",
      price: "KSh 50,000.00",
      featured: false,
      selected: false
    },
    {
      id: 4,
      name: "Five days vault",
      roi: "56.00%",
      duration: "5 Days",
      minInvestment: "KSh 100,000.00",
      maxInvestment: "KSh 1,000,000.00",
      price: "KSh 100,000.00",
      featured: false,
      selected: false
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-orange-500 text-xl font-bold">Mining Operations</h2>
          <p className="text-slate-400 text-sm">Active mining operations</p>
        </div>
        <div className="bg-slate-700 px-3 py-1 rounded-lg">
          <p className="text-slate-400 text-sm">Balance: <span className="text-white font-bold">KSh 0.00</span></p>
        </div>
      </div>

      {/* Featured Engine */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
          ★ Featured Engine
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-1 text-white text-sm">
          <Clock className="w-4 h-4" />
          <span>11:54:41</span>
        </div>
        <div className="mt-6">
          <div className="bg-purple-700 rounded-lg p-3 mb-3 flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">1.{engines[0].name}</h3>
              <div className="flex items-center space-x-4 text-white text-sm">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{engines[0].roi} ROI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{engines[0].duration}</span>
                </div>
              </div>
              <p className="text-white text-xs">{engines[0].remaining}</p>
            </div>
          </div>
          <p className="text-white text-sm mb-3">Investment: {engines[0].price}</p>
          <button 
            onClick={scrollToProfitEngines}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            ACTIVATE MINE 🚀
          </button>
        </div>
      </div>

      {/* All Engines */}
      <div className="bg-orange-500 text-black py-2 px-4 rounded-lg text-center font-bold">
        All Engines
      </div>

      {/* Engine Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-4">
        {engines.map((engine, index) => (
          <div
            key={engine.id}
            className={`bg-slate-800 rounded-lg p-4 border-2 transition-colors ${
              engine.selected ? 'border-orange-500' : 'border-slate-700'
            }`}
            onClick={() => setSelectedEngine(index)}
          >
            {/* Engine Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {engine.id}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{engine.id}. {engine.name}</h3>
                  {engine.selected && (
                    <span className="text-orange-500 text-xs">Selected</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-lg font-bold">{engine.id}</p>
              </div>
            </div>

            {/* Engine Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400 text-xs">Duration</span>
                </div>
                <span className="text-white text-xs">{engine.duration}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Percent className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400 text-xs">Interest</span>
                </div>
                <span className="text-white text-xs">{engine.roi}</span>
              </div>

              <div className="border-t border-slate-700 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Min Investment</span>
                  <span className="text-white">{engine.minInvestment}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Max Investment</span>
                  <span className="text-white">{engine.maxInvestment}</span>
                </div>
              </div>
            </div>

            {/* Price and Activate Button */}
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-orange-500 font-bold text-lg">{engine.price}</p>
              </div>
              <button 
                onClick={scrollToProfitEngines}
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors"
              >
                Activate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Start New Profit Engines Section */}
      <div ref={profitEnginesRef} className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-orange-500 text-xl font-bold">Start New Profit Engines</h3>
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Secure Connection</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Selected Engines */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Selected Engines
              </label>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-white">1. {engines[selectedEngine].name}</span>
                  <div className="w-5 h-5 bg-slate-600 rounded border border-slate-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Duration
              </label>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-white">{engines[selectedEngine].duration}</span>
                  <div className="w-5 h-5 bg-slate-600 rounded-full border border-slate-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engine Amount */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Engine Amount (KSh)
              </label>
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="KSh 300"
                min="300"
              />
              <p className="text-red-400 text-xs mt-2">
                Insufficient balance. Your current balance is KSh 0
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Return Percentage */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Return Percentage
              </label>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-bold">{engines[selectedEngine].roi}</span>
                  <span className="text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* Minimum Amount */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Minimum Amount
              </label>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-white">{engines[selectedEngine].minInvestment}</span>
                  <span className="text-slate-400">KSh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engine Summary */}
        <div className="mt-6 bg-blue-800 rounded-lg p-4 border border-blue-700">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">📊</span>
            </div>
            <h4 className="text-white font-semibold">Engine Summary</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* You Invest */}
            <div className="bg-blue-900 rounded-lg p-4 text-center">
              <p className="text-slate-300 text-sm mb-2">You Invest</p>
              <p className="text-white text-2xl font-bold">KSh 0.00</p>
            </div>

            {/* You Earn */}
            <div className="bg-blue-900 rounded-lg p-4 text-center">
              <p className="text-slate-300 text-sm mb-2">You Earn</p>
              <p className="text-white text-2xl font-bold">KSh 0.00</p>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white">⟶</span>
            </div>
          </div>

          <p className="text-center text-slate-400 text-sm mt-3">
            📈 Returns are calculated after Engine period ends
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
            Cancel
          </button>
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
            <span className="text-white">🔒</span>
            <span>Activate Engine Now</span>
          </button>
        </div>

        {/* Active Profit Engines */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-orange-500 font-bold">Your Active Profit Engines</h4>
            <span className="text-slate-400 text-sm">Live Status</span>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-slate-400 text-2xl">📊</span>
            </div>
            <p className="text-slate-400">You don't have any active Engines</p>
          </div>
        </div>
      </div>
    </div>
  );
};