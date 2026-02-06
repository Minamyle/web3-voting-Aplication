# Deployment Guide - Voting dApp

This guide walks you through deploying the Voting dApp smart contract to Sepolia testnet and setting up the frontend.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Installed Software**
   - Node.js v14+ ([Download](https://nodejs.org/))
   - Git ([Download](https://git-scm.com/))
   - MetaMask browser extension

2. **Wallet Setup**
   - MetaMask installed and configured
   - Sepolia testnet added to MetaMask
   - Test ETH in your Sepolia wallet ([Get test ETH](https://sepoliafaucet.com/))

3. **API Keys**
   - Infura API key ([Create](https://infura.io/)) - for Sepolia RPC
   - Etherscan API key ([Create](https://etherscan.io/apis)) - for contract verification

## 🚀 Step 1: Local Setup

### 1.1 Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd votingapp

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 1.2 Configure Environment

Create `.env` file in the root directory:

```env
# Sepolia RPC URL
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY

# Your wallet private key (never share this!)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Enable gas reporting
REPORT_GAS=true
```

> ⚠️ **Security Warning**: Never commit `.env` file to git. It's in `.gitignore` for a reason!

### 1.3 Test Locally

```bash
# Run the test suite
npm test

# Generate coverage report
npm run test:coverage

# Start a local node for testing
npm run node
```

## 🌐 Step 2: Deploy to Sepolia Testnet

### 2.1 Deploy the Smart Contract

```bash
# Deploy to Sepolia
npm run deploy:sepolia
```

You should see output like:

```
Deploying Voting contract...
Voting contract deployed to: 0x5FbDB2315678afccb333f8a9c91ff6e34edb2e19
Contract address saved to contract-address.json
```

### 2.2 Save Contract Address

The deployment script automatically saves the address to `contract-address.json`. Note the contract address as you'll need it for the frontend.

### 2.3 Verify Contract on Etherscan (Optional)

To make your contract publicly verifiable on Etherscan:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

Example:

```bash
npx hardhat verify --network sepolia 0x5FbDB2315678afccb333f8a9c91ff6e34edb2e19
```

## 🎨 Step 3: Setup Frontend

### 3.1 Configure Contract Address

Edit `frontend/.env.local`:

```env
REACT_APP_VOTING_CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8a9c91ff6e34edb2e19
```

Replace `0x5FbDB...` with your deployed contract address.

### 3.2 Test Frontend Locally

```bash
# From the root directory
npm run frontend
```

The frontend will open at `http://localhost:3000`

### 3.3 Test with MetaMask

1. Open the frontend in your browser
2. Click "Connect Wallet"
3. Approve the connection in MetaMask
4. Make sure you're on Sepolia network
5. Test creating proposals (if you're the admin) and voting

## 📤 Step 4: Deploy Frontend to Vercel

### 4.1 Prepare for Deployment

```bash
# Build the frontend
cd frontend
npm run build
cd ..
```

### 4.2 Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

Follow the prompts and answer the questions:

- Framework Preset: `Create React App`
- Project name: `voting-dapp-frontend`
- Root directory: `./`

#### Option B: Using GitHub

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework: `Create React App`
   - Root Directory: `frontend`
   - Environment Variables:
     - `REACT_APP_VOTING_CONTRACT_ADDRESS`: Your contract address

### 4.3 Add Environment Variables

After deployment, add environment variables in Vercel dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add:
   - Name: `REACT_APP_VOTING_CONTRACT_ADDRESS`
   - Value: Your deployed contract address

4. Redeploy:
   ```bash
   vercel --prod
   ```

## 📤 Step 5: Deploy Frontend to Netlify

### 5.1 Prepare for Deployment

```bash
# Build the frontend
cd frontend
npm run build
cd ..
```

### 5.2 Deploy to Netlify

#### Option A: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=build
cd ..
```

#### Option B: Using GitHub

1. Push your code to GitHub
2. Go to [Netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub account and select repository
5. Configure:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
   - Environment variables:
     - `REACT_APP_VOTING_CONTRACT_ADDRESS`: Your contract address

### 5.3 Add Environment Variables

1. Go to your site settings
2. Click "Build & Deploy" > "Environment"
3. Add:
   - Key: `REACT_APP_VOTING_CONTRACT_ADDRESS`
   - Value: Your deployed contract address

4. Trigger a rebuild: Click "Trigger deploy"

## ✅ Verification Checklist

- [ ] Contract deployed to Sepolia
- [ ] Contract address saved
- [ ] Contract verified on Etherscan (optional)
- [ ] Frontend `.env.local` updated with contract address
- [ ] Frontend builds successfully
- [ ] MetaMask connected to Sepolia network
- [ ] Can create proposals (if admin)
- [ ] Can vote on proposals
- [ ] Vote counts update correctly
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Live frontend works with MetaMask

## 🔧 Troubleshooting

### Contract Deployment Issues

**Error: "insufficient funds"**

- Solution: Add more test ETH from a faucet

**Error: "Invalid JSON RPC response"**

- Solution: Check your `SEPOLIA_RPC_URL` in `.env`

**Error: "network error"**

- Solution: Verify Infura API key is correct

### Frontend Issues

**"Cannot read property 'ethereum' of undefined"**

- Solution: MetaMask is not installed. Install from metamask.io

**"Provider is not connected"**

- Solution: Click "Connect Wallet" and approve in MetaMask

**Contract address shows "0x000..."`**

- Solution: Update `REACT_APP_VOTING_CONTRACT_ADDRESS` in `frontend/.env.local`

**Votes not appearing**

- Solution: Ensure contract address is correct and on correct network

## 📊 Monitoring

### Monitor Contract Activity

1. Go to [Etherscan Sepolia](https://sepolia.etherscan.io/)
2. Search for your contract address
3. View all transactions and proposal events

### Monitor Frontend Deployment

**Vercel**: Project Settings > Deployments
**Netlify**: Site Overview > Deploy log

## 🚨 Security Reminders

- ✅ Never share your `PRIVATE_KEY`
- ✅ Never commit `.env` file to git
- ✅ Always use testnet before mainnet
- ✅ Use strong passwords for wallets
- ✅ Verify contract addresses before interacting
- ✅ Test thoroughly before mainnet deployment

## 🎓 Next Steps

1. **Add Features**
   - Proposal descriptions/details page
   - User voting history
   - Delegation functionality
   - Multi-sig admin

2. **Improve Security**
   - Security audit
   - Formal verification
   - Bug bounty program

3. **Scale**
   - Layer 2 deployment
   - Cross-chain voting
   - DAO integration

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the main [README.md](./README.md)
3. Check Hardhat [documentation](https://hardhat.org/)
4. Ask on [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)

## 🎉 Congratulations!

You've successfully deployed a full-stack voting dApp!

Next step: Customize and extend it with your own features.

---

**Happy deploying! 🚀**
