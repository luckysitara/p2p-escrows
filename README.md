# P2P Escrows - Solana Milestone-Based Payment Platform

> **Secure, transparent, and decentralized freelance payments with milestone-based escrow on Solana**

A beautiful, feature-rich React application that enables secure peer-to-peer freelance payments through milestone-based escrow smart contracts on the Solana blockchain. Built with modern web technologies and designed for optimal user experience.

![P2P Escrows Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=P2P+Escrows+-+Solana+Milestone+Payments)

## 🌟 Features

### 💰 **Smart Contract Integration**
- **Milestone-Based Payments** - Break projects into manageable milestones
- **Secure Escrow** - Funds held safely in Solana smart contracts
- **Automatic Releases** - Payments released upon milestone completion
- **Refund Protection** - Built-in dispute resolution and refund mechanisms

### 🎨 **Beautiful User Interface**
- **Glass Morphism Design** - Modern, elegant UI with backdrop blur effects
- **Smooth Animations** - Framer Motion powered interactions
- **Responsive Layout** - Perfect on desktop, tablet, and mobile
- **Dark/Light Themes** - Adaptive design for user preference

### 🔐 **Wallet Integration**
- **Multi-Wallet Support** - Phantom, Solflare, and more
- **Secure Connections** - Industry-standard wallet adapter
- **Transaction Signing** - Seamless blockchain interactions
- **Balance Tracking** - Real-time SOL and token balances

### 📊 **Project Management**
- **Project Dashboard** - Comprehensive project overview
- **Progress Tracking** - Visual progress bars and statistics
- **Search & Filter** - Find projects quickly with advanced filters
- **Grid/List Views** - Flexible viewing options
- **Real-time Updates** - Live status updates and notifications

### 🚀 **Advanced Features**
- **Tag System** - Categorize projects with custom tags
- **Priority Levels** - Set project priorities (Low, Medium, High)
- **Due Dates** - Track milestone deadlines
- **Transaction History** - Complete audit trail
- **Export Functionality** - Download project data

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library

### **Blockchain**
- **Solana Web3.js** - Solana blockchain interaction
- **Anchor Framework** - Solana smart contract framework
- **Wallet Adapter** - Standardized wallet connections
- **SPL Token** - Solana token program integration

### **UI Components**
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Sonner** - Toast notifications
- **Class Variance Authority** - Component variant management

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Solana Wallet** (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/p2p-escrows.git
   cd p2p-escrows
   \`\`\`

2. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application running.

### Building for Production

\`\`\`bash
# Build the application
npm run build

# Preview the production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
\`\`\`

## 📁 Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── Header.tsx      # Application header
│   │   ├── WelcomePage.tsx # Landing page
│   │   ├── ProjectDashboard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── MilestoneCard.tsx
│   │   └── CreateProjectDialog.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useEscrowProgram.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── config/             # Configuration files
│   │   └── idl.json        # Anchor program IDL
│   ├── lib/                # Utility functions
│   │   └── utils.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
\`\`\`

## 🎯 Usage Guide

### For Clients

1. **Connect Your Wallet**
   - Click the wallet button in the header
   - Select your preferred wallet (Phantom, Solflare, etc.)
   - Approve the connection

2. **Create a New Project**
   - Click "Create Project" button
   - Fill in project details (title, description, category)
   - Add freelancer's wallet address
   - Define milestones with amounts and due dates
   - Set priority level and add tags
   - Submit to create the project

3. **Fund Milestones**
   - Navigate to your project
   - Click "Fund" on any upcoming milestone
   - Confirm the transaction in your wallet
   - Funds are held securely in escrow

4. **Monitor Progress**
   - Track milestone completion
   - View real-time progress updates
   - Communicate with freelancers
   - Release payments upon completion

5. **Manage Disputes**
   - Request refunds if needed
   - Use built-in dispute resolution
   - Access transaction history

### For Freelancers

1. **Connect Your Wallet**
   - Use the same wallet address provided by the client
   - Connect using your preferred wallet

2. **View Assigned Projects**
   - See all projects where you're the freelancer
   - Track milestone statuses and deadlines
   - Monitor funded amounts

3. **Claim Payments**
   - Complete milestone deliverables
   - Click "Claim Payment" on funded milestones
   - Confirm transaction to receive payment
   - Funds are transferred directly to your wallet

4. **Track Earnings**
   - View completed projects and earnings
   - Access payment history
   - Monitor project progress

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

\`\`\`env
# Solana Network Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Program Configuration
VITE_PROGRAM_ID=6NKNtHYLCLmUpBqNDhhxycwUPZxjiZEimm9HddcALKRk

# Optional: Custom RPC endpoints
VITE_CUSTOM_RPC_URL=your-custom-rpc-url
\`\`\`

### Network Configuration

The application supports multiple Solana networks:

- **Devnet** (default) - For development and testing
- **Testnet** - For staging and pre-production testing
- **Mainnet** - For production use

To change networks, modify the `network` variable in `src/App.tsx`:

\`\`\`typescript
const network = WalletAdapterNetwork.Devnet // or Mainnet, Testnet
\`\`\`

### Program ID Configuration

Update the program ID in `src/hooks/useEscrowProgram.ts`:

\`\`\`typescript
const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID_HERE")
\`\`\`

## 🧪 Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test ProjectCard.test.tsx
\`\`\`

### Test Structure

\`\`\`
src/
├── __tests__/              # Test files
│   ├── components/         # Component tests
│   ├── hooks/             # Hook tests
│   └── utils/             # Utility tests
├── __mocks__/             # Mock files
└── setupTests.ts          # Test configuration
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set environment variables in Vercel dashboard**
4. **Deploy automatically on push to main branch**

### Netlify

1. **Connect your repository to Netlify**
2. **Configure build settings:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Set environment variables in Netlify dashboard**
4. **Deploy automatically on push**

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Upload the dist/ folder to your hosting provider
# Configure your web server to serve the index.html file
\`\`\`

## 🔧 Development

### Code Style

The project uses ESLint and Prettier for code formatting:

\`\`\`bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
\`\`\`

### Git Hooks

Pre-commit hooks ensure code quality:

\`\`\`bash
# Install husky for git hooks
npm install --save-dev husky

# Set up pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
\`\`\`

### Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📚 API Reference

### useEscrowProgram Hook

The main hook for interacting with the Solana escrow program:

\`\`\`typescript
const {
  fundMilestone,      // Fund a milestone with escrow
  claimPayment,       // Claim payment from escrow
  refundMilestone,    // Refund a milestone
  getEscrowAccount,   // Get escrow account data
  updateEscrow,       // Update escrow parameters
  isConnected,        // Wallet connection status
  programId           // Program ID string
} = useEscrowProgram()
\`\`\`

### Key Functions

#### fundMilestone
\`\`\`typescript
await fundMilestone(
  freelancerAddress: string,
  amount: number,
  seed: number
): Promise<string>
\`\`\`

#### claimPayment
\`\`\`typescript
await claimPayment(
  escrowAddress: string,
  clientAddress: string
): Promise<void>
\`\`\`

#### refundMilestone
\`\`\`typescript
await refundMilestone(
  escrowAddress: string
): Promise<void>
\`\`\`

## 🐛 Troubleshooting

### Common Issues

#### Wallet Connection Issues
\`\`\`bash
# Clear browser cache and cookies
# Disable browser extensions temporarily
# Try a different wallet
# Check network connectivity
\`\`\`

#### Transaction Failures
\`\`\`bash
# Ensure sufficient SOL balance for gas fees
# Check if wallet is connected to correct network
# Verify program ID is correct
# Try increasing transaction timeout
\`\`\`

#### Build Issues
\`\`\`bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
\`\`\`

### Getting Help

- **GitHub Issues** - Report bugs and request features
- **Discord Community** - Join our developer community
- **Documentation** - Check our comprehensive docs
- **Stack Overflow** - Tag questions with `p2p-escrows`

## 📊 Performance

### Optimization Features

- **Code Splitting** - Automatic route-based code splitting
- **Tree Shaking** - Remove unused code from bundles
- **Asset Optimization** - Optimized images and fonts
- **Caching** - Aggressive caching strategies
- **Lazy Loading** - Components loaded on demand

### Performance Metrics

- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Time to Interactive** - < 3.5s
- **Cumulative Layout Shift** - < 0.1

## 🔒 Security

### Security Features

- **Wallet Security** - Never store private keys
- **Transaction Verification** - All transactions verified on-chain
- **Input Validation** - Comprehensive input sanitization
- **XSS Protection** - Content Security Policy headers
- **HTTPS Only** - Secure connections required

### Best Practices

- Always verify transaction details before signing
- Keep your wallet software updated
- Use hardware wallets for large amounts
- Never share your seed phrase or private keys
- Verify smart contract addresses

## 📈 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Multi-token support (USDC, USDT)
- [ ] Advanced dispute resolution system
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

### Version 2.1 (Q3 2024)
- [ ] Integration with popular freelance platforms
- [ ] Advanced analytics and reporting
- [ ] Automated milestone triggers
- [ ] Smart contract upgrades

### Version 3.0 (Q4 2024)
- [ ] Cross-chain support (Ethereum, Polygon)
- [ ] DAO governance features
- [ ] NFT-based reputation system
- [ ] Advanced escrow templates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain platform
- **Anchor Framework** - For simplifying Solana development
- **React Team** - For the incredible frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For the excellent deployment platform

## 📞 Support

Need help? We're here for you:

- **Email:** support@p2p-escrows.com
- **Discord:** [Join our community](https://discord.gg/p2p-escrows)
- **Twitter:** [@P2PEscrows](https://twitter.com/P2PEscrows)
- **GitHub:** [Create an issue](https://github.com/yourusername/p2p-escrows/issues)

---

<div align="center">
  <p>Built with ❤️ by the P2P Escrows team</p>
  <p>
    <a href="https://p2p-escrows.com">Website</a> •
    <a href="https://docs.p2p-escrows.com">Documentation</a> •
    <a href="https://discord.gg/p2p-escrows">Community</a> •
    <a href="https://twitter.com/P2PEscrows">Twitter</a>
  </p>
</div>
