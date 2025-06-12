import { User, Purchase, Earning, LiveUpdate, ReferralStats } from '../types';

// Simulated database using localStorage
class DatabaseService {
  private readonly USERS_KEY = 'referral_users';
  private readonly PURCHASES_KEY = 'referral_purchases';
  private readonly EARNINGS_KEY = 'referral_earnings';
  private readonly UPDATES_KEY = 'referral_updates';

  // Users
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(user => user.id === id);
  }

  getUserByReferralCode(code: string): User | undefined {
    return this.getUsers().find(user => user.referralCode === code);
  }

  // Purchases
  getPurchases(): Purchase[] {
    const purchases = localStorage.getItem(this.PURCHASES_KEY);
    return purchases ? JSON.parse(purchases) : [];
  }

  savePurchases(purchases: Purchase[]): void {
    localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));
  }

  // Earnings
  getEarnings(): Earning[] {
    const earnings = localStorage.getItem(this.EARNINGS_KEY);
    return earnings ? JSON.parse(earnings) : [];
  }

  saveEarnings(earnings: Earning[]): void {
    localStorage.setItem(this.EARNINGS_KEY, JSON.stringify(earnings));
  }

  // Live Updates
  getLiveUpdates(): LiveUpdate[] {
    const updates = localStorage.getItem(this.UPDATES_KEY);
    return updates ? JSON.parse(updates) : [];
  }

  saveLiveUpdates(updates: LiveUpdate[]): void {
    localStorage.setItem(this.UPDATES_KEY, JSON.stringify(updates));
  }
}

export class APIService {
  private db = new DatabaseService();

  // Initialize with demo data
  initializeDemoData(): void {
    const users = this.db.getUsers();
    if (users.length === 0) {
      this.createDemoUsers();
    }
  }

  private createDemoUsers(): void {
    const demoUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        referralCode: 'JOHN2024',
        level: 0,
        directReferrals: ['2', '3', '4'],
        totalEarnings: 15750,
        levelOneEarnings: 12500,
        levelTwoEarnings: 3250,
        joinedAt: new Date('2024-01-15'),
        isActive: true
      },
      {
        id: '2',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        referralCode: 'ALICE2024',
        parentReferralCode: 'JOHN2024',
        level: 1,
        directReferrals: ['5', '6'],
        totalEarnings: 8400,
        levelOneEarnings: 8400,
        levelTwoEarnings: 0,
        joinedAt: new Date('2024-01-20'),
        isActive: true
      },
      {
        id: '3',
        name: 'Bob Smith',
        email: 'bob@example.com',
        referralCode: 'BOB2024',
        parentReferralCode: 'JOHN2024',
        level: 1,
        directReferrals: ['7'],
        totalEarnings: 5200,
        levelOneEarnings: 5200,
        levelTwoEarnings: 0,
        joinedAt: new Date('2024-01-25'),
        isActive: true
      }
    ];

    this.db.saveUsers(demoUsers);

    // Create demo purchases
    const demoPurchases: Purchase[] = [
      {
        id: '1',
        userId: '2',
        amount: 5000,
        profit: 2500,
        createdAt: new Date(),
        status: 'completed'
      },
      {
        id: '2',
        userId: '5',
        amount: 3400,
        profit: 1700,
        createdAt: new Date(),
        status: 'completed'
      }
    ];

    this.db.savePurchases(demoPurchases);
  }

  // User management
  async registerUser(userData: Omit<User, 'id' | 'joinedAt'>): Promise<User> {
    const users = this.db.getUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      joinedAt: new Date()
    };
    
    users.push(newUser);
    this.db.saveUsers(users);
    
    return newUser;
  }

  async getUser(id: string): Promise<User | null> {
    return this.db.getUserById(id) || null;
  }

  async getUserReferrals(userId: string): Promise<User[]> {
    const users = this.db.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return [];
    
    return users.filter(u => user.directReferrals.includes(u.id));
  }

  async getReferralTree(userId: string): Promise<any> {
    const users = this.db.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return null;

    const buildTree = (currentUser: User, depth: number = 0): any => {
      if (depth >= 2) return { ...currentUser, children: [] };
      
      const children = users
        .filter(u => currentUser.directReferrals.includes(u.id))
        .map(child => buildTree(child, depth + 1));
      
      return { ...currentUser, children };
    };

    return buildTree(user);
  }

  // Purchase and earnings
  async createPurchase(userId: string, amount: number): Promise<void> {
    if (amount < 1000) {
      throw new Error('Purchase amount must be at least 1000Rs');
    }

    const profit = amount * 0.2; // 20% profit assumption
    const purchase: Purchase = {
      id: Date.now().toString(),
      userId,
      amount,
      profit,
      createdAt: new Date(),
      status: 'completed'
    };

    const purchases = this.db.getPurchases();
    purchases.push(purchase);
    this.db.savePurchases(purchases);

    // Calculate and distribute earnings
    await this.distributeEarnings(purchase);
  }

  private async distributeEarnings(purchase: Purchase): Promise<void> {
    const users = this.db.getUsers();
    const buyer = users.find(u => u.id === purchase.userId);
    
    if (!buyer || !buyer.parentReferralCode) return;

    const parent = users.find(u => u.referralCode === buyer.parentReferralCode);
    if (!parent) return;

    const earnings = this.db.getEarnings();
    const updates = this.db.getLiveUpdates();

    // Level 1 earnings (5%)
    const level1Earning = purchase.profit * 0.05;
    const level1EarningRecord: Earning = {
      id: Date.now().toString(),
      userId: parent.id,
      fromUserId: buyer.id,
      amount: level1Earning,
      percentage: 5,
      level: 1,
      purchaseId: purchase.id,
      createdAt: new Date()
    };

    earnings.push(level1EarningRecord);

    // Update parent earnings
    parent.levelOneEarnings += level1Earning;
    parent.totalEarnings += level1Earning;

    // Add live update
    updates.push({
      id: Date.now().toString(),
      type: 'earning',
      message: `You earned ₹${level1Earning.toFixed(2)} from ${buyer.name}'s purchase`,
      amount: level1Earning,
      timestamp: new Date(),
      read: false
    });

    // Level 2 earnings (1%) - if parent has a parent
    if (parent.parentReferralCode) {
      const grandParent = users.find(u => u.referralCode === parent.parentReferralCode);
      if (grandParent) {
        const level2Earning = purchase.profit * 0.01;
        const level2EarningRecord: Earning = {
          id: (Date.now() + 1).toString(),
          userId: grandParent.id,
          fromUserId: buyer.id,
          amount: level2Earning,
          percentage: 1,
          level: 2,
          purchaseId: purchase.id,
          createdAt: new Date()
        };

        earnings.push(level2EarningRecord);
        
        grandParent.levelTwoEarnings += level2Earning;
        grandParent.totalEarnings += level2Earning;

        updates.push({
          id: (Date.now() + 1).toString(),
          type: 'earning',
          message: `You earned ₹${level2Earning.toFixed(2)} from Level 2 referral`,
          amount: level2Earning,
          timestamp: new Date(),
          read: false
        });
      }
    }

    this.db.saveUsers(users);
    this.db.saveEarnings(earnings);
    this.db.saveLiveUpdates(updates);
  }

  async getReferralStats(userId: string): Promise<ReferralStats> {
    const users = this.db.getUsers();
    const earnings = this.db.getEarnings();
    
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const level1Referrals = users.filter(u => user.directReferrals.includes(u.id));
    const level2Referrals = users.filter(u => 
      level1Referrals.some(l1 => l1.directReferrals.includes(u.id))
    );

    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const monthlyEarnings = earnings
      .filter(e => e.userId === userId && new Date(e.createdAt) >= thisMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalReferrals: level1Referrals.length + level2Referrals.length,
      levelOneReferrals: level1Referrals.length,
      levelTwoReferrals: level2Referrals.length,
      totalEarnings: user.totalEarnings,
      monthlyEarnings,
      averageEarningPerReferral: level1Referrals.length > 0 ? user.totalEarnings / level1Referrals.length : 0
    };
  }

  async getLiveUpdates(userId: string): Promise<LiveUpdate[]> {
    const updates = this.db.getLiveUpdates();
    return updates.filter(u => !u.read).slice(0, 10);
  }

  async markUpdateAsRead(updateId: string): Promise<void> {
    const updates = this.db.getLiveUpdates();
    const update = updates.find(u => u.id === updateId);
    if (update) {
      update.read = true;
      this.db.saveLiveUpdates(updates);
    }
  }
}

export const apiService = new APIService();