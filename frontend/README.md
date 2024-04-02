# OrionDAO Frontend

Modern web interface for OrionDAO governance platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔗 Web3 wallet connection (MetaMask, WalletConnect, etc.)
- 📝 Proposal creation and browsing
- 🗳️ Quadratic voting interface
- 🏆 Reputation dashboard
- 💰 Treasury management
- 📊 Real-time governance analytics

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi + viem
- **State Management**: React Query
- **Wallet**: RainbowKit

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update contract addresses in .env.local
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/          # Next.js pages
│   ├── components/     # React components
│   ├── lib/            # Utilities and configs
│   └── styles/         # Global styles
├── public/             # Static assets
└── package.json
```

## Environment Variables

See `.env.example` for required variables.

## Contributing

Please read CONTRIBUTING.md for guidelines.

## License

MIT

