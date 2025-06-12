import React from 'react';
import { X, DollarSign, Users, ShoppingCart, Clock } from 'lucide-react';
import { LiveUpdate } from '../types';

interface LiveUpdatePanelProps {
  updates: LiveUpdate[];
  onClose: () => void;
}

export const LiveUpdatePanel: React.FC<LiveUpdatePanelProps> = ({ updates, onClose }) => {
  const getUpdateIcon = (type: LiveUpdate['type']) => {
    switch (type) {
      case 'earning':
        return <DollarSign className="w-5 h-5 text-green-400" />;
      case 'referral':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-purple-400" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl w-full max-w-md border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h3 className="text-xl font-semibold text-white">Live Updates</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="p-6 text-center text-gray-300">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent updates</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getUpdateIcon(update.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{update.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(update.timestamp)}
                        </span>
                        {update.amount && (
                          <span className="text-green-400 font-semibold text-sm">
                            +₹{update.amount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};