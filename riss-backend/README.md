# RISS Backend

Backend API server for the RISS Reputation & Identity Scoring System, providing RESTful endpoints for reputation management, activity tracking, and KRNL Protocol integration.

## 🚀 Features

- **RESTful API** for reputation and activity management
- **Blockchain Integration** with EVM-compatible smart contracts
- **KRNL Protocol Integration** for task-based reputation
- **MongoDB** for off-chain data storage
- **TypeScript** for type safety
- **Express.js** for the web framework

## 📋 API Endpoints

### Reputation
- `GET /api/reputation/:address` - Get reputation score
- `GET /api/reputation/:address/breakdown` - Get detailed breakdown

### Activity
- `POST /api/activity` - Submit activity proof
- `GET /api/activity/:address` - Get user activities
- `POST /api/activity/:proofId/verify` - Verify activity (verifier only)

### Verification
- `POST /api/verification/request` - Submit verification request
- `GET /api/verification/requests` - Get verification requests
- `POST /api/verification/:requestId/review` - Review request (verifier only)

### KRNL
- `POST /api/krnl/task/complete` - Process completed KRNL task
- `POST /api/krnl/tasks/batch` - Process multiple tasks

### User
- `POST /api/user/register` - Register new user
- `GET /api/user/:identifier` - Get user by DID or address

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Access to Ethereum node (for blockchain features)

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/riss
RPC_URL=http://localhost:8545
RISS_REPUTATION_ADDRESS=0x...
KRNL_INTEGRATION_ADDRESS=0x...
PRIVATE_KEY=your_private_key_here
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## 🔗 Integration with Smart Contracts

The backend integrates with the RISS smart contracts:

1. **RISSReputation Contract**: For on-chain reputation storage
2. **KRNLIntegration Contract**: For KRNL task processing

The backend acts as a bridge between the frontend and blockchain, providing:
- Off-chain caching and indexing
- Batch operations
- Error handling and retries
- Event listening and synchronization

## 📦 Project Structure

```
src/
├── index.ts              # Entry point
├── routes/               # API routes
│   ├── reputation.ts
│   ├── activity.ts
│   ├── verification.ts
│   ├── krnl.ts
│   ├── user.ts
│   └── organization.ts
├── database/             # Database models and connection
│   ├── connection.ts
│   └── models/
├── services/            # Business logic
│   └── blockchain.ts
└── utils/               # Utilities
    └── logger.ts
```

## 🧪 Testing

```bash
npm test
```

## 📝 License

MIT

