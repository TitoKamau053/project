import React, { useState, useEffect } from 'react';
import { RefreshCw, DollarSign } from 'lucide-react';
import { purchaseAPI, earningsAPI } from '../utils/api';

export const MiningNow = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const purchasesData = await purchaseAPI.getUserPurchases();
        setPurchases(purchasesData.purchases);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error fetching data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activePurchases = purchases.filter(p => p.status === 'active');
  const completedPurchases = purchases.filter(p => p.status === 'completed');

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h2 className="text-white text-xl font-bold">Mining Operations</h2>
        </div>
        <RefreshCw className="w-5 h-5 text-slate-400 cursor-pointer" onClick={() => window.location.reload()} />
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-white">Loading mining data...</p>
      ) : (
        <>
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
              <p className="text-white text-lg font-bold">
                KES {activePurchases.reduce((sum, p) => sum + parseFloat(p.amount_invested), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <span className="text-slate-400 text-sm">Active Mining</span>
              </div>
              <p className="text-white text-lg font-bold">{activePurchases.length} miners</p>
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

          {/* Mining List */}
          <div className="bg-slate-800 rounded-lg p-4">
            {activeTab === 'active' && (
              <>
                {activePurchases.length === 0 ? (
                  <div className="text-center text-slate-400">You have no active mining operations.</div>
                ) : (
                  activePurchases.map((purchase) => (
                    <div key={purchase.id} className="mb-4 p-3 bg-slate-700 rounded-lg">
                      <h3 className="text-white font-semibold">{purchase.engine_name}</h3>
                      <p className="text-slate-400">Invested: KES {purchase.amount_invested}</p>
                      <p className="text-slate-400">Daily Return: KES {purchase.daily_earning}</p>
                      <p className="text-slate-400">Status: {purchase.status}</p>
                    </div>
                  ))
                )}
              </>
            )}
            {activeTab === 'completed' && (
              <>
                {completedPurchases.length === 0 ? (
                  <div className="text-center text-slate-400">You have no completed mining operations.</div>
                ) : (
                  completedPurchases.map((purchase) => (
                    <div key={purchase.id} className="mb-4 p-3 bg-slate-700 rounded-lg">
                      <h3 className="text-white font-semibold">{purchase.engine_name}</h3>
                      <p className="text-slate-400">Invested: KES {purchase.amount_invested}</p>
                      <p className="text-slate-400">Daily Return: KES {purchase.daily_earning}</p>
                      <p className="text-slate-400">Status: {purchase.status}</p>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
