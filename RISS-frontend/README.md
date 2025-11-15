# RISS - Decentralized Identity Platform

A single-page application (SPA) with optional SSR capability, built with React, TypeScript, and a strongly opinionated Cyber-Noir design system. RISS enables users to create, manage, and verify their decentralized identities with absolute ownership.

## 🎨 Design Philosophy

**Anti-Slop Aesthetic**: Rigid geometric components, editorial typography, and a single toxic green accent (#B6FF3B) against a dark Cyber-Noir backdrop. No soft gradients, no generic fonts, no template-y cards.

## 🚀 Features

- **Decentralized Identity (DID)**: W3C DID pattern support with local creation and management
- **Wallet Integration**: MetaMask connection with ethers.js (WalletConnect stub included)
- **Verification Flow**: Step-by-step document verification with mock blockchain transactions
- **Credential Management**: Issue, view, and share verifiable credentials
- **Admin Analytics**: User management and verification analytics with Recharts
- **Dark/Light Mode**: Theme toggle with persistent storage
- **Responsive Design**: Mobile-first with sticky bottom navigation bar
- **Accessibility**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Animations**: Staggered reveals using Framer Motion (40ms stagger, 360ms duration)

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Framer Motion** - Staggered reveal animations
- **React Router DOM** - Client-side routing
- **ethers.js** - Ethereum wallet integration
- **lucide-react** - Icon library
- **recharts** - Admin analytics charts
- **shadcn/ui** (Radix UI primitives) - Accessible component primitives
- **MSW** - Mock Service Worker for API mocking
- **Jest + React Testing Library** - Unit testing

## 📦 Installation

### Windows Users

Due to a known issue with `fsevents` (macOS-only package) on Windows, use **Yarn** instead of npm:

```bash
# Install Yarn globally (if not already installed)
npm install -g yarn

# Install dependencies
yarn install --ignore-platform
```

### macOS/Linux Users

```bash
npm install
```

**Note**: If you encounter platform errors on Windows, the `--ignore-platform` flag with Yarn will skip incompatible optional dependencies.

## 🏃 Development

Start the development server with MSW mock API:

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

The app will be available at `http://localhost:5173`

MSW will automatically intercept API calls to `/api/*` endpoints.

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📁 Project Structure

```
src/
  ├── assets/           # Static assets (logo, images)
  │   └── LogoSVG.tsx
  ├── components/       # React components
  │   ├── ui/          # Base UI components (Button, Input, Modal, etc.)
  │   │   ├── __tests__/
  │   │   ├── Button.tsx
  │   │   ├── Input.tsx
  │   │   ├── Modal.tsx
  │   │   ├── StaggerReveal.tsx
  │   │   └── Toggle.tsx
  │   ├── Navbar.tsx
  │   └── MobileBottomBar.tsx
  ├── context/         # React Context providers
  │   └── AppContext.tsx
  ├── hooks/           # Custom React hooks
  │   ├── __tests__/
  │   ├── useDID.ts
  │   ├── useTheme.ts
  │   ├── useVerification.ts
  │   └── useWallet.ts
  ├── layouts/         # Layout components
  │   └── Layout.tsx
  ├── lib/             # Utility functions
  │   └── utils.ts
  ├── mocks/           # MSW mock handlers
  │   ├── browser.ts
  │   ├── handlers.ts
  │   └── sample-credentials.json
  ├── pages/           # Page components
  │   ├── __tests__/
  │   ├── AdminPanel.tsx
  │   ├── Auth.tsx
  │   ├── Dashboard.tsx
  │   ├── Landing.tsx
  │   └── VerificationFlow.tsx
  ├── test/            # Test setup
  │   └── setup.ts
  ├── App.tsx          # Main app component
  ├── design-tokens.ts # Design system tokens
  ├── index.css       # Global styles
  └── main.tsx        # Entry point
```

## 🎨 Design System

### Typography

- **Display Font**: Canela (Google Fonts fallback) - Used for headings
- **Body Font**: Merriweather Sans (Google Fonts) - Used for body text
- **NO Inter, Roboto, Arial, system-ui, or Space Grotesk**

### Color Theme: Cyber-Noir

- `--bg`: `#0A0A0C` (Dark background)
- `--panel`: `#1E1E22` (Panel background)
- `--accent`: `#B6FF3B` (Toxic Green - single accent color)
- `--muted`: `#9AA0A6` (Muted text)
- `--glass`: `rgba(255,255,255,0.02)` (Glass effect)

Light mode variants are defined in `src/design-tokens.ts`.

### Background

- Textured noise pattern (80x80px base64 SVG)
- Subtle grid overlay (24x24px)
- No flat white backgrounds

### Components

- **Rigid geometric buttons** (rectangular, no soft rounded corners)
- **Editorial modals** with strong typographic hierarchy
- **Minimal mechanical toggles**

See `docs/DESIGN_TOKENS.md` for detailed documentation.

## 📱 Pages

1. **Landing** (`/`) - Asymmetrical editorial layout with large "RISS" headline
2. **Auth** (`/auth`) - Wallet, DID Token, and Biometric authentication options
3. **Dashboard** (`/dashboard`) - DID block, credentials, verification status, activity grid
4. **Verification Flow** (`/verify`) - Step-by-step document verification
5. **Admin Panel** (`/admin`) - User table, pending verifications, analytics charts

## 🔐 Wallet Integration

### MetaMask

The app uses `ethers.js` to connect to MetaMask. Users can:

1. Click "Connect MetaMask" on the Auth page
2. Approve the connection in MetaMask
3. The app displays the connected address and ENS name (if available)

### WalletConnect

Stub implementation included for future integration.

## 🆔 DID Support

The app implements W3C DID pattern:

- **Format**: `did:riss:method-specific-id`
- **DID Document**: Minimal W3C-compliant structure
- **Verification Methods**: Supports Ethereum addresses as verification keys

See `src/hooks/useDID.ts` for implementation details.

## 🧪 Mock API

MSW (Mock Service Worker) provides local API mocking:

- `POST /api/verify` - Submit document for verification, returns mock tx hash and DID
- `POST /api/share-credential` - Generate shareable credential URL

Mock handlers are in `src/mocks/handlers.ts`.

## ♿ Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation support for modals and verification flow
- Color contrast meets WCAG AA standards
- Semantic HTML structure

## 📱 Responsive Design

- **Mobile-first** approach
- Sticky bottom action bar on mobile: Verify • Share • Identity
- Collapsed sections and large touch targets
- Desktop: Full navigation bar with theme toggle

## 🚀 Deployment to Vercel

### Prerequisites

1. Vercel account
2. GitHub repository (or Git provider)

### Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Environment Variables** (if needed):
   - Add any required environment variables in Vercel dashboard
   - Example: `VITE_API_URL`, `VITE_CHAIN_ID`, etc.

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Post-Deployment

- Your app will be available at `https://your-project.vercel.app`
- Automatic deployments on every push to main branch
- Preview deployments for pull requests

## 🧩 Environment Variables

Create a `.env` file for local development (optional):

```env
VITE_API_URL=http://localhost:3000
VITE_CHAIN_ID=1
```

## 📝 Scripts

- `npm run dev` - Start dev server with MSW
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## 🧪 Testing

Unit tests are written with Jest and React Testing Library:

- `Button.test.tsx` - Button component behavior
- `useWallet.test.ts` - Wallet connection logic
- `useDID.test.ts` - DID creation and resolution
- `Dashboard.test.tsx` - Dashboard rendering
- `VerificationFlow.test.tsx` - Verification flow steps
- `StaggerReveal.test.tsx` - Animation component

## 📄 License

MIT

## 🤝 Contributing

See `CONTRIBUTING.md` for code style guidelines and contribution instructions.

## 📚 Documentation

- `CONTRIBUTING.md` - Contribution guidelines
- `docs/DESIGN_TOKENS.md` - Design tokens documentation
