import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface EarningsData {
  date: string;
  level1: number;
  level2: number;
  total: number;
}

interface EarningsChartProps {
  userId: string;
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ userId }) => {
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    generateMockData();
  }, [timeRange]);

  const generateMockData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data: EarningsData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const level1 = Math.random() * 500 + 100;
      const level2 = Math.random() * 200 + 50;
      
      data.push({
        date: date.toISOString().split('T')[0],
        level1,
        level2,
        total: level1 + level2
      });
    }
    
    setEarningsData(data);
  };

  const maxEarning = Math.max(...earningsData.map(d => d.total));
  const totalEarnings = earningsData.reduce((sum, d) => sum + d.total, 0);
  const avgDailyEarnings = totalEarnings / earningsData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Total Earnings</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">₹{totalEarnings.toFixed(0)}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-300">Daily Average</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">₹{avgDailyEarnings.toFixed(0)}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-300">Peak Day</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">₹{maxEarning.toFixed(0)}</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Earnings Over Time</h4>
        <div className="flex space-x-2">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="h-64 flex items-end space-x-1">
          {earningsData.map((data, index) => {
            const level1Height = (data.level1 / maxEarning) * 100;
            const level2Height = (data.level2 / maxEarning) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col justify-end h-48">
                  {/* Level 2 earnings (top) */}
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${level2Height}%` }}
                  />
                  {/* Level 1 earnings (bottom) */}
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-emerald-500 transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${level1Height}%` }}
                  />
                </div>
                
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute bg-black/80 text-white p-2 rounded text-xs mt-2 z-10 transition-opacity duration-200">
                  <div className="text-center">
                    <p className="font-medium">{new Date(data.date).toLocaleDateString()}</p>
                    <p className="text-green-400">L1: ₹{data.level1.toFixed(0)}</p>
                    <p className="text-blue-400">L2: ₹{data.level2.toFixed(0)}</p>
                    <p className="text-white font-semibold">Total: ₹{data.total.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            <span className="text-sm text-gray-300">Level 1 (5%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
            <span className="text-sm text-gray-300">Level 2 (1%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};