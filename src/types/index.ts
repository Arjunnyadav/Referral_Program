export interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  parentReferralCode?: string;
  level: number;
  directReferrals: string[];
  totalEarnings: number;
  levelOneEarnings: number;
  levelTwoEarnings: number;
  joinedAt: Date;
  isActive: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  profit: number;
  createdAt: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface Earning {
  id: string;
  userId: string;
  fromUserId: string;
  amount: number;
  percentage: number;
  level: 1 | 2;
  purchaseId: string;
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  levelOneReferrals: number;
  levelTwoReferrals: number;
  totalEarnings: number;
  monthlyEarnings: number;
  averageEarningPerReferral: number;
}

export interface LiveUpdate {
  id: string;
  type: 'earning' | 'referral' | 'purchase';
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
}