import React, { useState } from 'react';
import { RefreshCw, DollarSign } from 'lucide-react';

export const MiningNow = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          
          <h2 className="text-white text-xl font-bold">Mining Operations</h2>
          
        </div>
        
        <RefreshCw className="w-5 h-5 text-slate-400" />
      </div>

      {/* Available Rewards */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Available Mining Rewards</p>
            <p className="text-green-500 text-lg font-bold">KES 0.00</p>
          </div>
        </div>
        <button className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
          💰 Collect All Rewards
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-slate-400 text-sm">Total Invested</span>
          </div>
          <p className="text-white text-lg font-bold">KES 0.00</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-slate-400 text-sm">Active Mining</span>
          </div>
          <p className="text-white text-lg font-bold">0 miners</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'active' 
              ? 'bg-orange-500 text-white' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Mining
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'completed' 
              ? 'bg-orange-500 text-white' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-slate-800 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-400">You have no active mining operations.</p>
      </div>
    </div>
  );
};


