# RISS - Reputation & Identity Scoring System

A complete decentralized reputation platform built on KRNL Protocol, featuring EVM-based smart contracts, a TypeScript backend, and a React frontend.

## 📁 Project Structure

```
RISS/
├── riss-frontend/        # React + TypeScript frontend
├── riss-backend/         # Node.js + Express backend API
└── riss-contracts/       # Solidity smart contracts (EVM)
```

## 🚀 Quick Start

### Frontend

```bash
cd riss-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend

```bash
cd riss-backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

Backend runs on `http://localhost:3000`

### Smart Contracts

```bash
cd riss-contracts
npm install
npm run compile
npm run node  # Start local Hardhat node
# In another terminal:
npm run deploy:local
```

## 📖 Documentation

- **Frontend**: See `riss-frontend/README.md`
- **Backend**: See `riss-backend/README.md`
- **Contracts**: See `riss-contracts/README.md`

## 🔗 Integration

The three components work together:

1. **Frontend** → Calls **Backend API** → Interacts with **Smart Contracts**
2. **Backend** → Syncs data between **MongoDB** and **Blockchain**
3. **Smart Contracts** → Store reputation scores on-chain
4. **KRNL Protocol** → Integrates via `KRNLIntegration.sol`

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- ethers.js

### Backend
- Node.js + Express
- TypeScript
- MongoDB
- ethers.js

### Smart Contracts
- Solidity 0.8.20
- Hardhat
- EVM-compatible chains

## 📝 License

MIT

