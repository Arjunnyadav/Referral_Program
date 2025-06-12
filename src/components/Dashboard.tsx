import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Bell, 
  Share2, 
  BarChart3,
  Wallet,
  UserPlus,
  Eye,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLiveUpdates } from '../hooks/useLiveUpdates';
import { ReferralTree } from './ReferralTree';
import { EarningsChart } from './EarningsChart';
import { LiveUpdatePanel } from './LiveUpdatePanel';
import { PurchaseSimulator } from './PurchaseSimulator';
import { ReferralStats } from '../types';
import { apiService } from '../services/api';

export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { updates, unreadCount } = useLiveUpdates(currentUser?.id || null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [showUpdates, setShowUpdates] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (currentUser) {
      fetchStats();
      const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchStats = async () => {
    if (!currentUser) return;
    try {
      const referralStats = await apiService.getReferralStats(currentUser.id);
      setStats(referralStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!currentUser || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ReferEarn</h1>
                <p className="text-sm text-gray-300">Welcome back, {currentUser.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUpdates(!showUpdates)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={logout}
                className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-400">+12.5%</span>
                <span className="text-gray-300">from last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Referrals</p>
                <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-300">
                Level 1: {stats.levelOneReferrals} | Level 2: {stats.levelTwoReferrals}
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Monthly Earnings</p>
                <p className="text-2xl font-bold text-white">₹{stats.monthlyEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-300">
                Avg per referral: ₹{stats.averageEarningPerReferral.toFixed(0)}
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Referral Code</p>
                <p className="text-lg font-bold text-white">{currentUser.referralCode}</p>
              </div>
              <button
                onClick={copyReferralCode}
                className="bg-orange-500/20 rounded-lg p-3 hover:bg-orange-500/30 transition-colors duration-200"
              >
                <Share2 className="w-6 h-6 text-orange-400" />
              </button>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-300">
                Click to copy & share
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 mb-8 border border-white/20">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'referrals', label: 'Referral Tree', icon: Users },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'simulator', label: 'Purchase Simulator', icon: Wallet }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Earnings Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Level 1 Earnings (5%)</span>
                    <span className="text-white font-semibold">₹{currentUser.levelOneEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Level 2 Earnings (1%)</span>
                    <span className="text-white font-semibold">₹{currentUser.levelTwoEarnings.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Earnings</span>
                      <span className="text-green-400 font-bold text-lg">₹{currentUser.totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={copyReferralCode}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Referral Code</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('referrals')}
                    className="w-full bg-white/10 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Referral Tree</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-6">Referral Tree</h3>
              <ReferralTree userId={currentUser.id} />
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-6">Earnings Analytics</h3>
              <EarningsChart userId={currentUser.id} />
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-6">Purchase Simulator</h3>
              <PurchaseSimulator />
            </div>
          )}
        </div>
      </div>

      {/* Live Updates Panel */}
      {showUpdates && (
        <LiveUpdatePanel
          updates={updates}
          onClose={() => setShowUpdates(false)}
        />
      )}
    </div>
  );
};