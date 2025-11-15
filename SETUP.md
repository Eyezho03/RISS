# RISS Project Setup Guide

## 📁 Project Structure

Your RISS project now has three main components:

```
Desktop/
├── RISS/                    # Frontend (rename to riss-frontend when ready)
├── riss-backend/            # Backend API
└── riss-contracts/          # Smart Contracts
```

## 🔄 Renaming Frontend Folder

**Note**: The RISS folder is currently in use. To rename it to `riss-frontend`:

1. Close all applications using the folder (Cursor, VS Code, terminal, etc.)
2. Right-click the `RISS` folder → Rename → `riss-frontend`
3. Or use PowerShell (when folder is not in use):
   ```powershell
   cd C:\Users\gilly\Desktop
   Rename-Item -Path "RISS" -NewName "riss-frontend"
   ```

## 🚀 Setup Instructions

### 1. Smart Contracts (riss-contracts)

```bash
cd riss-contracts
npm install
npm run compile
```

**Deploy to local network:**
```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:local
```

**Save the contract addresses** - you'll need them for backend configuration.

### 2. Backend (riss-backend)

```bash
cd riss-backend
npm install

# Copy environment template
cp env.example .env

# Edit .env with:
# - MongoDB connection string
# - RPC URL (local or testnet)
# - Contract addresses from deployment
# - Private key for blockchain interactions
```

**Start backend:**
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Frontend (RISS → riss-frontend)

```bash
cd RISS  # or riss-frontend after renaming
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔗 Integration Flow

1. **Deploy Contracts** → Get contract addresses
2. **Configure Backend** → Add contract addresses to `.env`
3. **Start Backend** → API server running
4. **Start Frontend** → Connect to backend API
5. **Connect Wallet** → Interact with smart contracts

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/riss
RPC_URL=http://localhost:8545
RISS_REPUTATION_ADDRESS=0x...  # From contract deployment
KRNL_INTEGRATION_ADDRESS=0x... # From contract deployment
PRIVATE_KEY=your_private_key_here
```

### Contracts (.env)
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
KRNL_TASK_CONTRACT=0x...  # KRNL Protocol contract address
```

## ✅ Next Steps

1. Rename `RISS` folder to `riss-frontend` (when not in use)
2. Deploy smart contracts to local/testnet
3. Configure backend with contract addresses
4. Update frontend API URL to point to backend
5. Test the full stack integration

## 🐛 Troubleshooting

- **Folder rename fails**: Close all programs using the folder
- **Contract deployment fails**: Check RPC URL and private key
- **Backend won't start**: Check MongoDB is running and .env is configured
- **Frontend can't connect**: Verify backend is running and CORS is configured

