# RISS Integration Guide

Complete guide for integrating Frontend, Backend, and Smart Contracts.

## 🔄 Architecture Flow

```
Frontend (React)
    ↓ HTTP API
Backend (Express)
    ↓ ethers.js
Smart Contracts (Solidity)
    ↓ Events
Backend (Event Listeners)
    ↓ MongoDB
Database (User Data)
```

## 📡 API Integration

### Frontend → Backend

Update frontend API calls to point to backend:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getReputation(address: string) {
  const response = await fetch(`${API_BASE_URL}/api/reputation/${address}`);
  return response.json();
}
```

### Backend → Smart Contracts

Backend uses ethers.js to interact with contracts:

```typescript
// Backend automatically syncs with contracts
// See src/services/blockchain.ts
```

## 🔗 KRNL Protocol Integration

### 1. Deploy Contracts

```bash
cd riss-contracts
npm run deploy:local
# Save: RISSReputation address, KRNLIntegration address
```

### 2. Configure KRNL Integration

In `KRNLIntegration.sol`, set the KRNL task contract address:

```solidity
// Deploy with actual KRNL contract address
constructor(address _rissReputation, address _krnlTaskContract)
```

### 3. Authorize Contracts

After deployment:

```javascript
// In Hardhat console or script
await rissReputation.addKrnlContract(krnlIntegrationAddress);
```

### 4. Process KRNL Tasks

When a KRNL task is validated:

```javascript
// Backend automatically processes via:
POST /api/krnl/task/complete
{
  "taskId": "krnl_task_123",
  "userId": "0x...",
  "scoreWeight": 50
}
```

## 🔐 Authentication Flow

1. **User connects wallet** → Frontend
2. **Frontend gets address** → Calls backend
3. **Backend creates/updates user** → MongoDB
4. **User submits activity** → Backend → Smart Contract
5. **Verifier approves** → Smart Contract emits event
6. **Backend listens** → Updates MongoDB

## 📊 Data Synchronization

### On-Chain (Smart Contracts)
- Reputation scores
- Activity proofs (verified)
- Verification requests (final status)

### Off-Chain (MongoDB)
- User profiles
- Activity history (all statuses)
- Social accounts
- Metadata

### Sync Strategy
- **Write**: Backend writes to both blockchain and database
- **Read**: Backend reads from blockchain (source of truth) and caches in DB
- **Events**: Backend listens to contract events and updates DB

## 🧪 Testing Integration

### 1. Local Testing

```bash
# Terminal 1: Hardhat node
cd riss-contracts
npm run node

# Terminal 2: Deploy contracts
npm run deploy:local

# Terminal 3: Backend
cd riss-backend
npm run dev

# Terminal 4: Frontend
cd riss-frontend
npm run dev
```

### 2. Test Flow

1. Connect wallet in frontend
2. Submit activity proof
3. Verify activity (as verifier)
4. Check reputation score updates
5. Complete KRNL task
6. Verify reputation updates

## 🔧 Configuration Checklist

- [ ] Contracts deployed
- [ ] Contract addresses in backend `.env`
- [ ] MongoDB running
- [ ] Backend `.env` configured
- [ ] Frontend API URL set
- [ ] KRNL contract address set
- [ ] Verifiers authorized in contract
- [ ] KRNL Integration authorized

## 📝 Environment Variables Summary

### Frontend
```env
VITE_API_URL=http://localhost:3000
VITE_RPC_URL=http://localhost:8545
VITE_RISS_REPUTATION_ADDRESS=0x...
```

### Backend
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/riss
RPC_URL=http://localhost:8545
RISS_REPUTATION_ADDRESS=0x...
KRNL_INTEGRATION_ADDRESS=0x...
PRIVATE_KEY=0x...
```

### Contracts
```env
PRIVATE_KEY=0x...
RPC_URL=http://localhost:8545
KRNL_TASK_CONTRACT=0x...
```

## 🚀 Production Deployment

1. Deploy contracts to mainnet/testnet
2. Update backend with production contract addresses
3. Configure production MongoDB
4. Set up environment variables
5. Deploy backend (Vercel, Railway, etc.)
6. Deploy frontend (Vercel, Netlify, etc.)
7. Update frontend API URL

## 📚 Next Steps

1. Implement event listeners in backend
2. Add GitHub API integration
3. Add more activity sources
4. Implement caching layer
5. Add rate limiting
6. Set up monitoring

