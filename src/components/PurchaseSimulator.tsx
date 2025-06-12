import React, { useState } from 'react';
import { ShoppingCart, DollarSign, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const PurchaseSimulator: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = JSON.parse(localStorage.getItem('referral_users') || '[]');
    setUsers(allUsers);
  };

  const calculateEarnings = (amount: number) => {
    if (amount < 1000) return { level1: 0, level2: 0 };
    
    const profit = amount * 0.2; // 20% profit
    const level1Earning = profit * 0.05; // 5% for level 1
    const level2Earning = profit * 0.01; // 1% for level 2
    
    return { level1Earning, level2Earning, profit };
  };

  const handleSimulatePurchase = async () => {
    if (!selectedUser || !purchaseAmount) {
      setMessage({ type: 'error', text: 'Please select a user and enter purchase amount' });
      return;
    }

    const amount = parseFloat(purchaseAmount);
    if (amount < 1000) {
      setMessage({ type: 'error', text: 'Purchase amount must be at least ₹1000 to generate earnings' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await apiService.createPurchase(selectedUser, amount);
      const { level1Earning, level2Earning } = calculateEarnings(amount);
      
      setMessage({
        type: 'success',
        text: `Purchase simulated! Level 1: ₹${level1Earning.toFixed(2)}, Level 2: ₹${level2Earning.toFixed(2)}`
      });
      
      setPurchaseAmount('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error simulating purchase' });
    } finally {
      setLoading(false);
    }
  };

  const presetAmounts = [1000, 2500, 5000, 10000, 25000];

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <p className="text-blue-300 text-sm">
            This simulator shows how earnings are distributed when referrals make purchases above ₹1000.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select User (Buyer)
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id} className="bg-gray-800">
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Purchase Amount (₹)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setPurchaseAmount(amount.toString())}
                  className="px-3 py-1 bg-white/10 text-gray-300 rounded text-sm hover:bg-white/20 transition-colors duration-200"
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSimulatePurchase}
            disabled={loading || !selectedUser || !purchaseAmount}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Simulate Purchase</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Earnings Preview</h4>
          
          {purchaseAmount && parseFloat(purchaseAmount) >= 1000 && (
            <div className="space-y-3">
              {(() => {
                const { level1Earning, level2Earning, profit } = calculateEarnings(parseFloat(purchaseAmount));
                return (
                  <>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Purchase Amount</span>
                        <span className="text-white font-semibold">₹{parseFloat(purchaseAmount).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Estimated Profit (20%)</span>
                        <span className="text-white font-semibold">₹{profit.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-green-300">Level 1 Earning (5%)</span>
                        <span className="text-green-400 font-bold">₹{level1Earning.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300">Level 2 Earning (1%)</span>
                        <span className="text-blue-400 font-bold">₹{level2Earning.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {purchaseAmount && parseFloat(purchaseAmount) < 1000 && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300 text-sm">
                  No earnings generated. Purchase must be ≥ ₹1000.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`rounded-lg p-4 border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500/30' 
            : 'bg-red-500/20 border-red-500/30'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-300' : 'text-red-300'
            }`}>
              {message.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};