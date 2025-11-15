# 🚀 RISS - Getting Started Guide

Follow these steps to get your RISS platform up and running!

## Step 1: Rename Frontend Folder (When Ready)

The frontend folder is currently named `RISS`. When you're ready:

1. **Close Cursor/VS Code** (the folder is in use)
2. **Right-click** the `RISS` folder on your Desktop
3. **Rename** it to `riss-frontend`

Or use PowerShell (when folder is closed):
```powershell
cd C:\Users\gilly\Desktop
Rename-Item -Path "RISS" -NewName "riss-frontend"
```

## Step 2: Install Dependencies

### 2.1 Smart Contracts
```powershell
cd C:\Users\gilly\Desktop\riss-contracts
npm install
```

### 2.2 Backend
```powershell
cd C:\Users\gilly\Desktop\riss-backend
npm install
```

### 2.3 Frontend
```powershell
cd C:\Users\gilly\Desktop\RISS  # or riss-frontend after renaming
npm install
```

## Step 3: Set Up Smart Contracts

### 3.1 Create Environment File
```powershell
cd C:\Users\gilly\Desktop\riss-contracts
# Copy the example file
Copy-Item .env.example .env
```

### 3.2 Edit `.env` (Optional for local testing)
For local testing, you can skip this. For testnet/mainnet:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
KRNL_TASK_CONTRACT=0x...  # If you have KRNL contract address
```

### 3.3 Compile Contracts
```powershell
npm run compile
```

### 3.4 Start Local Blockchain (Terminal 1)
```powershell
npm run node
```
**Keep this terminal open!** This runs a local Hardhat node.

### 3.5 Deploy Contracts (Terminal 2 - New Terminal)
```powershell
cd C:\Users\gilly\Desktop\riss-contracts
npm run deploy:local
```

**IMPORTANT**: Copy the contract addresses from the output:
- `RISSReputation deployed to: 0x...`
- `KRNLIntegration deployed to: 0x...`

You'll need these for the backend!

## Step 4: Set Up Backend

### 4.1 Create Environment File
```powershell
cd C:\Users\gilly\Desktop\riss-backend
Copy-Item env.example .env
```

### 4.2 Edit `.env` File
Open `.env` and update:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database (install MongoDB or use MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/riss
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/riss

# Blockchain - USE THE ADDRESSES FROM STEP 3.5!
RPC_URL=http://localhost:8545
RISS_REPUTATION_ADDRESS=0x...  # Paste from contract deployment
KRNL_INTEGRATION_ADDRESS=0x... # Paste from contract deployment
PRIVATE_KEY=0x...  # Use one of the private keys from Hardhat node output

# Logging
LOG_LEVEL=info
```

**To get a private key:**
- Check the Hardhat node terminal output
- It shows accounts with private keys
- Use one of those (for testing only!)

### 4.3 Install MongoDB (If Not Installed)

**Option A: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud - Free)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Use in `MONGODB_URI`

### 4.4 Start Backend
```powershell
cd C:\Users\gilly\Desktop\riss-backend
npm run dev
```

Backend should start on `http://localhost:3000`

## Step 5: Update Frontend Configuration

### 5.1 Create Environment File
```powershell
cd C:\Users\gilly\Desktop\RISS  # or riss-frontend
# Create .env file
New-Item -Path .env -ItemType File
```

### 5.2 Add to `.env`
```env
VITE_API_URL=http://localhost:3000
VITE_RPC_URL=http://localhost:8545
VITE_RISS_REPUTATION_ADDRESS=0x...  # From contract deployment
```

### 5.3 Start Frontend
```powershell
npm run dev
```

Frontend should start on `http://localhost:5173`

## Step 6: Test Everything

### 6.1 Check Services Are Running
- ✅ Hardhat node (Terminal 1)
- ✅ Backend (Terminal 2) - `http://localhost:3000`
- ✅ Frontend (Terminal 3) - `http://localhost:5173`

### 6.2 Test Flow
1. Open `http://localhost:5173` in browser
2. Click "Authenticate" or go to `/auth`
3. Connect MetaMask (or use Hardhat accounts)
4. Create DID
5. Go to Dashboard
6. Submit an activity proof
7. Check reputation score

## 🎯 Quick Start Commands Summary

```powershell
# Terminal 1: Hardhat Node
cd C:\Users\gilly\Desktop\riss-contracts
npm install
npm run node

# Terminal 2: Deploy Contracts (after node starts)
cd C:\Users\gilly\Desktop\riss-contracts
npm run deploy:local
# COPY THE ADDRESSES!

# Terminal 3: Backend
cd C:\Users\gilly\Desktop\riss-backend
npm install
Copy-Item env.example .env
# Edit .env with contract addresses
npm run dev

# Terminal 4: Frontend
cd C:\Users\gilly\Desktop\RISS
npm install
# Create .env with API_URL
npm run dev
```

## 🐛 Troubleshooting

### "Cannot find module" errors
- Run `npm install` in each folder
- Make sure you're in the correct directory

### "Port already in use"
- Kill the process using the port
- Or change PORT in `.env`

### "MongoDB connection failed"
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For local: `mongodb://localhost:27017/riss`

### "Contract not found"
- Make sure Hardhat node is running
- Check contract addresses in backend `.env`
- Redeploy contracts if needed

### "Frontend can't connect to backend"
- Check backend is running on port 3000
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

## ✅ Checklist

- [ ] Renamed RISS folder to riss-frontend (when ready)
- [ ] Installed all dependencies (contracts, backend, frontend)
- [ ] Compiled contracts
- [ ] Started Hardhat node
- [ ] Deployed contracts
- [ ] Copied contract addresses
- [ ] Configured backend `.env`
- [ ] MongoDB running/configured
- [ ] Backend started successfully
- [ ] Frontend `.env` configured
- [ ] Frontend started successfully
- [ ] Tested wallet connection
- [ ] Tested activity submission

## 🎉 You're Ready!

Once everything is running:
1. Connect your wallet
2. Start building reputation
3. Complete KRNL tasks
4. Watch your RISS score grow!

For detailed API documentation, see:
- `riss-backend/README.md`
- `riss-contracts/README.md`
- `INTEGRATION.md`

