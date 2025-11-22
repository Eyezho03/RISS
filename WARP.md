# Developer Notes

Internal notes for working with code in this repository.

## Repository Overview

RISS is a decentralized reputation and identity scoring system built on the KRNL Protocol. This repo is a monorepo with three main packages:

- `RISS-frontend/` – React 19 + TypeScript SPA (Vite) with a strongly opinionated Cyber-Noir design system.
- `riss-backend/` – Node.js + Express + TypeScript REST API, integrating MongoDB and the EVM contracts.
- `riss-contracts/` – Solidity (0.8.20) smart contracts managed via Hardhat.

System-level flow:

1. **Frontend** → calls **Backend** over REST (`/api/*`).
2. **Backend** → reads/writes **MongoDB** and interacts with **RISSReputation** / **KRNLIntegration** contracts via `ethers`.
3. **Contracts** → store reputation scores and activity proofs on-chain and integrate with the KRNL Protocol.

There is no root-level build; work inside each sub-project.

---

## Common Commands

### Frontend (`RISS-frontend/`)

**Install dependencies**

- Windows (preferred):
  - `npm install -g yarn`
  - `yarn install --ignore-platform`
- macOS/Linux: `npm install`

**Development server**

- `npm run dev`  (or `yarn dev`)
  - Vite dev server with MSW mock API at `http://localhost:5173`.

**Build & preview**

- `npm run build`
- `npm run preview`

**Linting**

- `npm run lint`

**Tests (Jest)**

- All tests: `npm run test`
- Watch mode: `npm run test:watch`
- Single test file (example):
  - `npx jest src/components/ui/__tests__/Button.test.tsx`

### Backend (`riss-backend/`)

**Install & configure**

- `npm install`
- Copy env template and configure:
  - `cp .env.example .env`
  - Set values such as `PORT`, `MONGODB_URI`, `RPC_URL`, `RISS_REPUTATION_ADDRESS`, `KRNL_INTEGRATION_ADDRESS`, `PRIVATE_KEY`.

**Development**

- `npm run dev` – `tsx`-based watch mode on `src/index.ts` (default `http://localhost:3000`).

**Build & run**

- `npm run build` – compiles TypeScript to `dist/`.
- `npm start` – runs `dist/index.js`.

**Linting**

- `npm run lint` – ESLint on `src/**/*.ts`.

**Tests (Jest)**

- All tests: `npm test`
- Single test file or pattern (example):
  - `npx jest src/routes/reputation.test.ts`

**Database migrations (if present)**

- After building, migrations can be run via:
  - `npm run migrate` (executes `dist/database/migrate.js`).

### Smart Contracts (`riss-contracts/`)

**Install**

- `npm install`

**Compile & test**

- Compile: `npm run compile`
- All tests: `npm run test`
- Single test file:
  - `npx hardhat test test/RISSReputation.test.js`

**Local Hardhat node & deployment**

- Start node: `npm run node`
- In another terminal, deploy locally: `npm run deploy:local`

**Testnet / mainnet deployment**

1. Create `.env` in `riss-contracts/` with (non-exhaustive):
   - `PRIVATE_KEY`
   - `SEPOLIA_RPC_URL`
   - `MAINNET_RPC_URL`
   - `ETHERSCAN_API_KEY`
   - `KRNL_TASK_CONTRACT`
2. Deploy:
   - Sepolia: `npm run deploy:sepolia`
   - Mainnet: `npm run deploy:mainnet`

---

## High-Level Architecture

### System Architecture

- **Frontend (`RISS-frontend/`)**
  - React + TypeScript SPA with React Router.
  - Talks to backend via `/api/*` endpoints (mocked with MSW during local dev).
  - Manages DID creation/management, wallet connection, verification flows, credential management, and admin analytics UI.

- **Backend (`riss-backend/`)**
  - Express + TypeScript service exposing domain-specific routes under `/api`:
    - Reputation: `GET /api/reputation/:address`, `GET /api/reputation/:address/breakdown`.
    - Activity: `POST /api/activity`, `GET /api/activity/:address`, `POST /api/activity/:proofId/verify`.
    - Verification: `POST /api/verification/request`, `GET /api/verification/requests`, `POST /api/verification/:requestId/review`.
    - KRNL: `POST /api/krnl/task/complete`, `POST /api/krnl/tasks/batch`.
    - User: `POST /api/user/register`, `GET /api/user/:identifier`.
  - Integrates with MongoDB for off-chain data and uses `ethers` to call `RISSReputation` / `KRNLIntegration` contracts.
  - Acts as a bridge between the SPA and the blockchain: caching, batching, error handling, and event-driven sync.

- **Smart Contracts (`riss-contracts/`)**
  - `RISSReputation.sol` – main on-chain reputation system:
    - Weighted categories: Identity (25%), Contribution (35%), Trust (20%), Social (10%), Engagement (10%).
    - Activity proofs, verification requests, reputation scoring.
    - Verifier management and KRNL integration hooks.
  - `KRNLIntegration.sol` – connects validated KRNL tasks to on-chain reputation:
    - Processes single and batched KRNL tasks.
    - Ensures tasks are valid and not double-counted.

- **Integration points**
  - After deploying contracts, addresses must be wired into:
    - Backend `.env` (`RISS_REPUTATION_ADDRESS`, `KRNL_INTEGRATION_ADDRESS`).
    - Frontend env (e.g., `VITE_API_URL`, `VITE_CHAIN_ID`, and any contract addresses used in hooks/components).
  - KRNL Protocol integrates via `KRNLIntegration.sol` and corresponding backend KRNL routes.

### Frontend Architecture Details (`RISS-frontend/`)

Source layout (simplified):

- `src/assets/` – static assets (e.g., `LogoSVG.tsx`).
- `src/components/`
  - `ui/` – base UI primitives (Button, Input, Modal, StaggerReveal, Toggle) with `__tests__/` alongside.
  - Higher-level components like `Navbar`, `MobileBottomBar`.
- `src/context/AppContext.tsx` – global React context (app-wide state, theme, etc.).
- `src/hooks/` – domain-specific hooks with `__tests__/`:
  - `useWallet` – MetaMask integration (and WalletConnect stub) via `ethers`.
  - `useDID` – W3C-style DIDs (`did:riss:...`), DID Document handling.
  - `useVerification` – document verification flow.
  - `useTheme` – dark/light theme toggle and persistence.
- `src/layouts/Layout.tsx` – shared layout wrapper.
- `src/lib/utils.ts` – utility helpers.
- `src/mocks/` – MSW setup (`browser.ts`, `handlers.ts`, `sample-credentials.json`) for local API mocking.
- `src/pages/` – page-level components and tests:
  - `Landing`, `Auth`, `Dashboard`, `VerificationFlow`, `AdminPanel`.
- `src/test/setup.ts` – Jest/RTL test setup.
- `src/design-tokens.ts` – TypeScript source of design tokens.
- `src/index.css` – CSS that exposes tokens as variables and global styles.
- `src/main.tsx`, `src/App.tsx` – React entrypoint and router shell.

Key frontend behaviors:

- **Wallet & DID**
  - `useWallet` abstracts MetaMask connection logic and address state.
  - `useDID` implements the DID format (`did:riss:method-specific-id`) and basic DID Document handling.

- **Verification & Credentials**
  - `useVerification` and verification-related pages manage stepwise verification flows, mock transactions, and credential issuance/display.

- **Mock API**
  - MSW intercepts `/api/*` calls during dev:
    - `POST /api/verify` – returns mock tx hash and DID.
    - `POST /api/share-credential` – returns a shareable credential URL.

- **Design System** (from `docs/DESIGN_TOKENS.md`)
  - **Colors**: Cyber-Noir theme with a single accent `#B6FF3B` and dark/light variants, exposed as CSS variables (`--bg`, `--panel`, `--accent`, `--muted`, `--glass`).
  - **Typography**: two font stacks via CSS variables (`--font-display`, `--font-body`). Do **not** introduce other font families like Inter, Roboto, Arial, system-ui, or Space Grotesk.
  - **Spacing & layout**: tokenized spacing scale (`--spacing-*`) used via utility classes.
  - **Animation**: primary reveal animation is `StaggerReveal` (40ms stagger, 360ms duration) for major page loads; micro-interactions are simple color transitions only.
  - **Components**: rigid, rectangular shapes (buttons, inputs, modals) with strong typographic hierarchy; no soft rounded corners or gradients.

### Frontend Contribution & Style Rules (from `CONTRIBUTING.md`)

When editing frontend code, follow these project-specific rules:

- **TypeScript conventions**
  - Use TypeScript for new code; exported functions/components should have explicit return types where appropriate.
  - Prefer interfaces for object shapes, `const` over `let`, arrow functions for component definitions.

- **Naming & structure**
  - Components and their files use **PascalCase** (e.g., `Navbar.tsx`, `StaggerReveal.tsx`).
  - Hooks use **camelCase** prefixed with `use` (e.g., `useWallet`, `useDID`).
  - Utilities use camelCase and named exports.
  - One component per file; colocate tests in `__tests__/` directories next to the feature area.

- **Imports**
  - Use the `@/` alias for internal modules (e.g., `@/context/AppContext`, `@/components/ui/Button`).
  - Group imports: external libs → internal modules → types.

- **Accessibility & responsiveness**
  - All interactive elements must be real interactive elements (`<button>`, `<a>`, etc.) with accessible text or `aria-label`.
  - Ensure keyboard navigation and focus handling are correct.
  - Mobile-first layouts using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) and sufficiently large touch targets.

These conventions are important to preserve the project’s visual identity and UX.

### Backend Architecture Details (`riss-backend/`)

As described in the backend README, the main layout is:

- `src/index.ts` – Express app entrypoint (server bootstrap, middleware, route mounting, DB connection).
- `src/routes/` – per-domain route modules:
  - `reputation.ts`, `activity.ts`, `verification.ts`, `krnl.ts`, `user.ts`, `organization.ts`.
- `src/database/`
  - `connection.ts` – MongoDB connection helper.
  - `models/` – Mongoose models/schemas for reputation, activities, users, etc.
- `src/services/`
  - `blockchain.ts` – encapsulates `ethers` provider, contract instances, and blockchain-related business logic.
- `src/utils/logger.ts` – Winston-based logging.

Typical flow:

1. Request hits a route (`/api/reputation/...`, `/api/activity/...`, etc.).
2. Route validates/parses input (often via `zod` or similar) and calls into services.
3. Services talk to MongoDB models and/or blockchain through `blockchain.ts`.
4. Responses are shaped for the frontend (e.g., aggregate reputation breakdown, verification status, activity history).

The backend is also responsible for listening to contract events and keeping off-chain state in sync (batch updates, retries, and error handling live here).

### Smart Contract Architecture Details (`riss-contracts/`)

- `contracts/`
  - `RISSReputation.sol` – central contract for reputation scores, activity proofs, verification requests, verifier/KRNL contract management.
  - `KRNLIntegration.sol` – mediates tasks from the KRNL Protocol and updates `RISSReputation`.
- `test/`
  - `RISSReputation.test.js` – Hardhat/Chai tests for the reputation contract.
- `hardhat.config.js`
  - Configures Solidity 0.8.20 with optimizer, networks (`hardhat`, `localhost`, `sepolia`, `mainnet`), Etherscan verification, and paths.

Deployment considerations:

- Local development: run `npm run node` then `npm run deploy:local`; use the resulting addresses in backend/frontend configuration.
- Testnet/mainnet: ensure `.env` is correctly populated; `npm run deploy:sepolia` / `npm run deploy:mainnet` will rely on those values.

---

## Working Across Components

- For **frontend-only feature work** (UI, flows, mock behavior):
  - Work in `RISS-frontend/` using MSW-backed dev (`npm run dev`), updating UI components, hooks, and pages.

- For **API/behavior changes**:
  - Modify `riss-backend/` routes/services and corresponding frontend API calls/mocks in `RISS-frontend/src/mocks/handlers.ts`.

- For **on-chain logic changes**:
  - Update contracts in `riss-contracts/`, adjust tests, re-deploy, then update:
    - Backend `.env` contract addresses and any blockchain logic in `src/services/blockchain.ts`.
    - Frontend environment/config or hooks that reference contract addresses or ABIs.

Keeping these three layers aligned (contracts ↔ backend ↔ frontend) is essential when implementing or modifying features.