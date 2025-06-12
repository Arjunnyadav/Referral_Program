import React, { useState, useEffect } from 'react';
import { Users, User, TrendingUp, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';

interface TreeNode {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalEarnings: number;
  level: number;
  children: TreeNode[];
}

interface ReferralTreeProps {
  userId: string;
}

export const ReferralTree: React.FC<ReferralTreeProps> = ({ userId }) => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreeData();
  }, [userId]);

  const fetchTreeData = async () => {
    try {
      const tree = await apiService.getReferralTree(userId);
      setTreeData(tree);
    } catch (error) {
      console.error('Error fetching referral tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const TreeNodeComponent: React.FC<{ node: TreeNode; depth: number }> = ({ node, depth }) => {
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    const getLevelColor = (level: number) => {
      switch (level) {
        case 0: return 'from-purple-500 to-blue-500';
        case 1: return 'from-blue-500 to-cyan-500';
        case 2: return 'from-cyan-500 to-green-500';
        default: return 'from-gray-500 to-gray-600';
      }
    };

    const getLevelLabel = (level: number) => {
      switch (level) {
        case 0: return 'You';
        case 1: return 'Level 1';
        case 2: return 'Level 2';
        default: return `Level ${level}`;
      }
    };

    return (
      <div className="relative">
        <div className={`bg-gradient-to-r ${getLevelColor(node.level)} rounded-xl p-4 mb-4 shadow-lg transform transition-all duration-200 hover:scale-105`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">{node.name}</h4>
                <p className="text-white/80 text-sm">{getLevelLabel(node.level)}</p>
                <p className="text-white/60 text-xs">{node.referralCode}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1 text-white">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">₹{node.totalEarnings.toLocaleString()}</span>
              </div>
              {node.children.length > 0 && (
                <div className="flex items-center space-x-1 text-white/80 text-sm mt-1">
                  <Users className="w-3 h-3" />
                  <span>{node.children.length} referrals</span>
                </div>
              )}
            </div>
          </div>

          {node.children.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/80 hover:text-white text-sm flex items-center space-x-1 transition-colors duration-200"
              >
                <TrendingUp className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                <span>{isExpanded ? 'Hide' : 'Show'} referrals ({node.children.length})</span>
              </button>
            </div>
          )}
        </div>

        {isExpanded && node.children.length > 0 && (
          <div className="ml-8 border-l-2 border-white/20 pl-6">
            {node.children.map((child) => (
              <TreeNodeComponent key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading referral tree...</div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="text-center text-gray-300 py-8">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No referral data available</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <TreeNodeComponent node={treeData} depth={0} />
    </div>
  );
};