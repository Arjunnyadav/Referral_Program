# Multi-Level Referral and Earning System

A sophisticated referral system with real-time earnings tracking, multi-level profit distribution, and live data updates. Built with React, TypeScript, and Tailwind CSS.

![Referral System Dashboard](https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🌟 Features

### Core Functionality
- **Multi-Level Referral System**: Support for up to 8 direct referrals per user
- **Real-Time Earnings**: Live profit distribution and tracking
- **Two-Level Commission Structure**: 5% for Level 1, 1% for Level 2 referrals
- **Purchase Validation**: Minimum ₹1000 threshold for earnings generation
- **Live Data Updates**: Real-time notifications without page refresh

### User Experience
- **Beautiful Dashboard**: Modern, responsive design with glassmorphism effects
- **Interactive Referral Tree**: Visual representation of your referral network
- **Earnings Analytics**: Comprehensive charts and statistics
- **Purchase Simulator**: Test earnings calculations in real-time
- **Live Notification Panel**: Instant updates on earnings and referrals

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Optimized for all device sizes
- **Local Storage**: Persistent data without external dependencies
- **Real-Time Updates**: Polling-based live data synchronization
- **Modular Architecture**: Clean, maintainable code structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/multi-level-referral-system.git
   cd multi-level-referral-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
- **Email**: `john@example.com`
- **Password**: Any password (demo mode)

## 💰 Profit Distribution Logic

### Earning Structure
- **Level 1 Referrals**: 5% of profit from direct referrals
- **Level 2 Referrals**: 1% of profit from second-level users
- **Minimum Purchase**: ₹1000 required for earnings generation
- **Profit Calculation**: 20% of purchase amount (configurable)

### Example Calculation
```
Purchase Amount: ₹10,000
Estimated Profit: ₹2,000 (20%)
Level 1 Earning: ₹100 (5% of profit)
Level 2 Earning: ₹20 (1% of profit)
```

## 🏗️ System Architecture

### Database Structure

#### Users Table
```typescript
interface User {
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
```

#### Purchases Table
```typescript
interface Purchase {
  id: string;
  userId: string;
  amount: number;
  profit: number;
  createdAt: Date;
  status: 'completed' | 'pending' | 'failed';
}
```

#### Earnings Table
```typescript
interface Earning {
  id: string;
  userId: string;
  fromUserId: string;
  amount: number;
  percentage: number;
  level: 1 | 2;
  purchaseId: string;
  createdAt: Date;
}
```

## 🔧 API Endpoints

### User Management
- `registerUser(userData)` - Register new user with referral code
- `getUser(id)` - Fetch user details
- `getUserReferrals(userId)` - Get direct referrals

### Referral System
- `getReferralTree(userId)` - Get complete referral hierarchy
- `getReferralStats(userId)` - Get comprehensive statistics

### Earnings & Purchases
- `createPurchase(userId, amount)` - Process purchase and distribute earnings
- `getLiveUpdates(userId)` - Fetch real-time updates
- `markUpdateAsRead(updateId)` - Mark notification as read

## 📊 Features Overview

### Dashboard Components

#### 1. Overview Tab
- Total earnings summary
- Referral statistics
- Quick actions panel
- Monthly performance metrics

#### 2. Referral Tree
- Interactive tree visualization
- Multi-level hierarchy display
- Expandable/collapsible nodes
- Earnings per referral

#### 3. Earnings Analytics
- Time-based earnings charts
- Level-wise breakdown
- Performance trends
- Daily/monthly/quarterly views

#### 4. Purchase Simulator
- Test earnings calculations
- Real-time preview
- Multiple purchase scenarios
- Validation and error handling

## 🎨 Design System

### Color Palette
- **Primary**: Blue to Purple gradient
- **Secondary**: Cyan to Green gradient
- **Success**: Green tones
- **Warning**: Orange tones
- **Error**: Red tones
- **Neutral**: Gray scale with transparency

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible contrast
- **Interactive**: Hover states and transitions

### Components
- **Glassmorphism**: Backdrop blur effects
- **Gradients**: Modern color transitions
- **Animations**: Smooth micro-interactions
- **Responsive**: Mobile-first approach

## 🔒 Security & Privacy

### Data Protection
- Local storage encryption (recommended for production)
- Input validation and sanitization
- XSS protection
- CSRF token implementation (for backend integration)

### User Privacy
- Minimal data collection
- Secure referral code generation
- Privacy-compliant design
- Data retention policies

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Netlify**: Drag and drop `dist` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use GitHub Actions
- **Custom Server**: Upload `dist` folder contents

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── AuthForm.tsx    # Login/Register form
│   ├── Dashboard.tsx   # Main dashboard
│   ├── ReferralTree.tsx # Tree visualization
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication logic
│   └── useLiveUpdates.ts # Real-time updates
├── services/           # API and data services
│   └── api.ts          # Database simulation
├── types/              # TypeScript definitions
│   └── index.ts        # Type definitions
└── ...
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (recommended)
- **TypeScript**: Strict mode enabled
- **Modular**: Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure responsive design


## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icons
- **Vite** - For the fast build tool

## 📞 Support

For questions, issues, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/Arjunnyadav/Referral_Program/issues)
- **Email**: arjun.yadav.engineer@gmail.com
- **Documentation**: This README and inline code comments

For support, email ar.com .

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Multi-level referral system
- ✅ Real-time earnings tracking
- ✅ Interactive dashboard
- ✅ Purchase simulator

### Phase 2 (Upcoming)
- 🔄 Backend API integration
- 🔄 Payment gateway integration
- 🔄 Email notifications
- 🔄 Mobile app

### Phase 3 (Future)
- 📋 Advanced analytics
- 📋 Team management
- 📋 Gamification features
- 📋 Multi-currency support

---



*Thanks *
