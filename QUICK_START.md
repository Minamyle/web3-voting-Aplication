# 🚀 Quick Start Guide

Get your Voting dApp up and running in 5 minutes!

## ⚡ TL;DR - Fast Setup

```bash
# 1. Install dependencies
npm install && cd frontend && npm install && cd ..

# 2. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 3. Run tests
npm test

# 4. Start frontend
npm run frontend

# 5. Deploy to Sepolia (when ready)
npm run deploy:sepolia
```

## 📋 Prerequisites Checklist

- [ ] Node.js v14+ installed
- [ ] MetaMask browser extension
- [ ] Git installed
- [ ] Infura account (for RPC URL)
- [ ] Test ETH in wallet (from faucet)

## 🎯 First Time Setup (10 minutes)

### Step 1: Clone & Install (2 min)

```bash
cd votingapp
npm install
cd frontend && npm install && cd ..
```

### Step 2: Configure Environment (2 min)

```bash
# Create .env file
cp .env.example .env

# Edit with your credentials:
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
# PRIVATE_KEY=your_private_key
# ETHERSCAN_API_KEY=your_api_key
```

### Step 3: Test Locally (3 min)

```bash
npm test
# All tests should pass ✅
```

### Step 4: Run Locally (3 min)

```bash
# Terminal 1: Start local blockchain
npm run node

# Terminal 2: Deploy to local network
npm run deploy

# Terminal 3: Start frontend
npm run frontend
# Opens http://localhost:3000
```

### Step 5: Test MetaMask (3 min)

1. Open MetaMask
2. Switch to "Localhost 8545" network
3. Click "Connect Wallet" on the app
4. Try creating a proposal (you're the admin!)
5. Vote on it with test accounts

## 🌐 Deploy to Sepolia (5 minutes)

### Step 1: Get Test ETH

1. Go to [sepoliafaucet.com](https://sepoliafaucet.com/)
2. Add your wallet address
3. Claim test ETH

### Step 2: Deploy Contract

```bash
npm run deploy:sepolia
# Note the contract address!
```

### Step 3: Configure Frontend

```bash
# Edit frontend/.env.local
REACT_APP_VOTING_CONTRACT_ADDRESS=0x...your_address...
```

### Step 4: Test Frontend

```bash
npm run frontend
# Switch MetaMask to Sepolia testnet
# Connect wallet and test voting!
```

## 📱 Deploy Frontend to Vercel (5 minutes)

### Option A: Quick Deploy

```bash
cd frontend
npm run build
vercel --prod
```

### Option B: Via GitHub

1. Push code to GitHub
2. Go to vercel.com
3. Import your GitHub repo
4. Add `REACT_APP_VOTING_CONTRACT_ADDRESS` env var
5. Deploy!

## 🧪 Testing Commands

```bash
# Run all tests
npm test

# Run specific test
npx hardhat test test/Voting.test.js

# Generate coverage report
npm run test:coverage

# Watch mode (auto-rerun on changes)
npm run test:watch
```

## 📊 Common Tasks

### Check Test Results

```bash
npm test
```

### Deploy to Localhost

```bash
npm run node          # Terminal 1
npm run deploy         # Terminal 2
```

### Start Frontend

```bash
npm run frontend
```

### Check Contract Address

```bash
cat contract-address.json
```

### View on Etherscan

```
https://sepolia.etherscan.io/address/0x...your_address...
```

## 🐛 Common Issues & Fixes

| Issue                    | Solution                                   |
| ------------------------ | ------------------------------------------ |
| "Cannot find module"     | Run `npm install` again                    |
| "RPC URL error"          | Check `SEPOLIA_RPC_URL` in `.env`          |
| "Insufficient funds"     | Get test ETH from faucet                   |
| "MetaMask not connected" | Click "Connect Wallet" button              |
| "Contract address 0x000" | Update `REACT_APP_VOTING_CONTRACT_ADDRESS` |
| "Tests fail"             | Make sure Hardhat node is running          |

## 📚 File Structure Quick Reference

| Path                  | Purpose             |
| --------------------- | ------------------- |
| `contracts/`          | Smart contract code |
| `test/`               | Test suite          |
| `frontend/`           | React app           |
| `scripts/`            | Deployment scripts  |
| `hardhat.config.js`   | Configuration       |
| `README.md`           | Full documentation  |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment |
| `TEST_COVERAGE.md`    | Test details        |

## 🎮 Using the App

### As Admin (Contract Deployer)

1. Click "Create Proposal"
2. Fill in title, description, duration
3. Submit
4. See your proposal appear!

### As Voter (Anyone)

1. Connect wallet
2. Click "Vote For" or "Vote Against"
3. Approve in MetaMask
4. See vote count update!

### View Results

- Active proposals show live vote counts
- Completed proposals show results
- Filter by status

## 🚀 Next Steps

1. ✅ Complete setup
2. ✅ Run tests
3. ✅ Test locally
4. ✅ Deploy to Sepolia
5. ✅ Deploy frontend
6. ✅ Share URL with others!

## 💡 Pro Tips

- **Keyboard Shortcut**: F12 → Console to debug
- **Network**: Always check MetaMask network
- **Gas**: Get more test ETH if transactions fail
- **Logs**: Check browser console for errors
- **Contract**: Save address to safe location
- **Testing**: Run `npm test` before deploying

## 🆘 Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed steps
2. See `README.md` for complete documentation
3. Review `TEST_COVERAGE.md` for test details
4. Check `troubleshooting` section in README

## 🎉 You're Ready!

```bash
npm install && npm test && npm run frontend
```

**That's it! Enjoy your Voting dApp! 🗳️**

---

**Total Setup Time**: ~15 minutes (first time)

**Subsequent Runs**: 2 minutes

**Happy Voting! 🎊**
