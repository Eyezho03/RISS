# RISS Smart Contracts

EVM-based smart contracts for the RISS Reputation & Identity Scoring System, designed for seamless integration with KRNL Protocol.

## 📋 Contracts

### RISSReputation.sol
Main contract managing reputation scores, activity proofs, and verification requests.

**Key Features:**
- Reputation scoring with weighted categories (Identity 25%, Contribution 35%, Trust 20%, Social 10%, Engagement 10%)
- Activity proof submission and verification
- Verification request system
- KRNL Protocol integration hooks
- Authorized verifier management

### KRNLIntegration.sol
Bridge contract connecting KRNL Protocol tasks with RISS reputation system.

**Key Features:**
- Automatic reputation updates from KRNL task completions
- Batch task processing
- Task status validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Hardhat

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Deploy to Local Network

1. Start local Hardhat node:
```bash
npm run node
```

2. In another terminal, deploy:
```bash
npm run deploy:local
```

### Deploy to Sepolia Testnet

1. Create `.env` file:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
ETHERSCAN_API_KEY=your_etherscan_key
KRNL_TASK_CONTRACT=0x... # KRNL task contract address
```

2. Deploy:
```bash
npm run deploy:sepolia
```

## 📖 Contract Functions

### RISSReputation

#### User Functions
- `submitActivityProof()` - Submit a new activity proof
- `submitVerificationRequest()` - Request identity/skill verification
- `getReputationScore()` - Get current reputation score
- `getUserActivities()` - Get all user activities

#### Verifier Functions
- `verifyActivity()` - Verify an activity proof
- `reviewVerificationRequest()` - Approve/reject verification requests

#### KRNL Functions
- `recordKrnlTaskCompletion()` - Record completed KRNL task (only authorized contracts)

#### Owner Functions
- `addVerifier()` / `removeVerifier()` - Manage verifiers
- `addKrnlContract()` / `removeKrnlContract()` - Manage KRNL contracts

### KRNLIntegration

- `processKrnlTask()` - Process a validated KRNL task
- `batchProcessKrnlTasks()` - Process multiple tasks at once
- `isTaskProcessed()` - Check if task was already processed

## 🔗 Integration with KRNL Protocol

1. Deploy RISSReputation contract
2. Deploy KRNLIntegration contract with RISSReputation address
3. Authorize KRNLIntegration in RISSReputation using `addKrnlContract()`
4. When KRNL tasks are validated, call `processKrnlTask()` to update reputation

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY

# Private key for deployment (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_key

# KRNL Protocol contract address
KRNL_TASK_CONTRACT=0x...
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test file
npx hardhat test test/RISSReputation.test.js
```

## 📦 Contract Addresses

After deployment, save the contract addresses for frontend/backend integration:

- **RISSReputation**: `0x...`
- **KRNLIntegration**: `0x...`

## 🔒 Security

- All external functions have proper access controls
- Input validation on all user inputs
- Score caps to prevent overflow
- Reentrancy protection (consider adding if needed)

## 📄 License

MIT

