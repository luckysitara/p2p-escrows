# Milestone Escrow Frontend

A beautiful, responsive React frontend for the Milestone Escrow dApp built on Solana. This application enables secure P2P freelance payments with milestone-based escrow functionality.

## Features

- 🎨 **Stunning UI/UX** with glass morphism effects and smooth animations
- 📱 **Fully Responsive** design that works on all devices
- 🔐 **Wallet Integration** with Phantom and Solflare support
- 💰 **Milestone Management** with funding, claiming, and refund capabilities
- 🎭 **Framer Motion Animations** for delightful user interactions
- 🔔 **Toast Notifications** with Sonner for user feedback
- 🎯 **TypeScript** for type safety and better development experience

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Solana Wallet Adapter** for wallet integration
- **Anchor** for Solana program interaction
- **Sonner** for toast notifications
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Solana wallet (Phantom or Solflare)

### Installation

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist` directory.

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── WelcomePage.tsx
│   │   ├── ProjectDashboard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── MilestoneCard.tsx
│   │   └── CreateProjectDialog.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useEscrowProgram.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── config/             # Configuration files
│   │   └── idl.json
│   ├── App.tsx             # Main App component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                 # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## Usage

### For Clients

1. **Connect Wallet**: Click the wallet button to connect your Solana wallet
2. **Create Project**: Click "Create Project" to set up a new milestone-based project
3. **Add Milestones**: Define project milestones with titles and SOL amounts
4. **Fund Milestones**: Fund individual milestones to escrow the payment
5. **Monitor Progress**: Track project progress and milestone completion

### For Freelancers

1. **Connect Wallet**: Connect your wallet to view assigned projects
2. **View Projects**: See projects where you're listed as the freelancer
3. **Claim Payments**: Claim payments for completed milestones
4. **Track Earnings**: Monitor your earnings across all projects

## Configuration

### Network Configuration

The app is configured to use Solana Devnet by default. To change the network, modify the `network` variable in `src/App.tsx`:

\`\`\`typescript
const network = WalletAdapterNetwork.Devnet // or Mainnet
\`\`\`

### Program ID

The Anchor program ID is configured in `src/hooks/useEscrowProgram.ts`. Update this to match your deployed program:

\`\`\`typescript
const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID_HERE")
\`\`\`

## Customization

### Styling

The app uses Tailwind CSS with custom CSS variables for theming. You can customize colors and other design tokens in `src/index.css`.

### Animations

Framer Motion animations can be customized in individual components. The app uses consistent animation patterns for a cohesive experience.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
