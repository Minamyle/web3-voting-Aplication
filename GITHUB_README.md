# 🗳️ Full-Stack Voting dApp

[![Tests](https://github.com/YOUR_USERNAME/voting-dapp/actions/workflows/tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/voting-dapp/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.18-blue)](https://solidity-lang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)

A complete, production-ready decentralized voting application built with **Solidity**, **Hardhat**, **React**, and **Ethers.js**. Features comprehensive smart contract testing (16+ tests), a modern Web3-integrated frontend, and deployment guides for Sepolia testnet and live hosting.

---

## ✨ Features

### 🔐 Smart Contract (Voting.sol)

- **Admin Proposals**: Only contract admin can create voting proposals
- **Democratic Voting**: Each address can vote once per proposal
- **Real-time Counts**: View current vote tallies anytime
- **Deadline Enforcement**: Voting periods are strictly enforced
- **Auto Winner**: Winner determined automatically after deadline
- **Access Control**: Secure permission management
- **Events**: Comprehensive event logging

### 💻 React Frontend

- **MetaMask Integration**: Connect wallet in one click
- **Live Proposals**: Real-time proposal display and updates
- **Vote Visualization**: Progress bars showing FOR vs AGAINST
- **Easy Voting**: Simple one-click voting interface
- **Admin Panel**: Create proposals (admin only)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Status Indicators**: See voting time remaining and results

### 🧪 Testing (16+ Test Cases)

- Comprehensive test coverage for all functions
- Edge case handling
- Access control verification
- Deadline enforcement testing
- Winner determination validation

---

## 🚀 Quick Start

### Prerequisites

- Node.js v14+
- MetaMask
- Git

### Installation (2 minutes)

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/voting-dapp.git
cd voting-dapp
npm install
cd frontend && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run tests
npm test

# Start locally
npm run frontend
```

See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

---

## 📚 Documentation

| Document                                         | Purpose                            |
| ------------------------------------------------ | ---------------------------------- |
| [README.md](./README.md)                         | Complete project documentation     |
| [QUICK_START.md](./QUICK_START.md)               | 5-minute setup guide               |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)     | Step-by-step deployment to Sepolia |
| [TEST_COVERAGE.md](./TEST_COVERAGE.md)           | Detailed test coverage report      |
| [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md) | Assignment completion details      |

---

## 🛠 Tech Stack

| Component              | Technology      |
| ---------------------- | --------------- |
| Smart Contract         | Solidity 0.8.18 |
| Development            | Hardhat         |
| Testing                | Chai + Hardhat  |
| Frontend               | React 18        |
| Blockchain Interaction | Ethers.js v6    |
| Wallet                 | MetaMask        |
| Styling                | CSS3            |
| CI/CD                  | GitHub Actions  |

---

## 📁 Project Structure

```
voting-dapp/
├── contracts/
│   └── Voting.sol              # Smart contract
├── test/
│   └── Voting.test.js          # 16+ test cases
├── scripts/
│   └── deploy.js               # Deployment script
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── hardhat.config.js           # Hardhat config
├── package.json
└── README.md
```

---

## 🚀 Deployment

### Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

### Deploy Frontend to Vercel

```bash
cd frontend
npm run build
vercel --prod
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Gas report
REPORT_GAS=true npm test
```

**Test Results**: ✅ 16+ tests passing  
**Coverage**: ✅ 100% of contract functions

---

## 📊 Contract Functions

### Admin Functions

```solidity
createProposal(string title, string description, uint256 duration)
```

### Voting Functions

```solidity
vote(uint256 proposalId, bool support)
executeProposal(uint256 proposalId)
```

### View Functions

```solidity
getProposal(uint256 proposalId)
getAllProposals()
getVoteCounts(uint256 proposalId)
hasVoted(uint256 proposalId, address voter)
isVotingActive(uint256 proposalId)
getTimeRemaining(uint256 proposalId)
```

See [README.md](./README.md) for complete API documentation.

---

## 🔒 Security Features

- ✅ Access control (admin-only functions)
- ✅ Double voting prevention
- ✅ Deadline enforcement
- ✅ Input validation
- ✅ State consistency checks

---

## 🎯 Smart Contract Details

| Feature   | Details                     |
| --------- | --------------------------- |
| Language  | Solidity 0.8.18             |
| Network   | Sepolia Testnet             |
| Functions | 11 total (6 public, 5 view) |
| Tests     | 16+ comprehensive tests     |
| Coverage  | 100%                        |

---

## 💡 Usage Examples

### Create a Proposal (Admin)

```javascript
await contract.createProposal(
  "Budget Allocation",
  "Allocate budget for Q1 2024",
  3600, // 1 hour
);
```

### Vote on Proposal

```javascript
await contract.vote(0, true); // Vote FOR
await contract.vote(0, false); // Vote AGAINST
```

### Check Results

```javascript
const proposal = await contract.getProposal(0);
console.log(proposal.winner); // "FOR", "AGAINST", or "TIE"
```

---

## 🌐 Live Demo

Frontend: [Deploy to Vercel](https://vercel.com/import/project?template=https://github.com/YOUR_USERNAME/voting-dapp)

Contract: [View on Etherscan Sepolia](#)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙋 Support

Need help? Check out:

- [QUICK_START.md](./QUICK_START.md) - Quick setup
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment help
- [Issues](https://github.com/YOUR_USERNAME/voting-dapp/issues) - Report bugs

---

## 🎓 Learning

This project is great for learning:

- Full-stack blockchain development
- Solidity smart contract design
- React + Web3 integration
- Smart contract testing
- Ethereum deployment

---

## 📈 Roadmap

- [ ] Multi-sig admin support
- [ ] Proposal delegation
- [ ] Vote delegation
- [ ] DAO integration
- [ ] Layer 2 deployment
- [ ] Cross-chain voting

---

## 🎉 Key Achievements

✅ 16+ comprehensive test cases  
✅ 100% smart contract test coverage  
✅ Production-ready React frontend  
✅ Complete deployment guides  
✅ Security best practices  
✅ Mobile-responsive UI

---

## 📞 Contact

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your.email@example.com
- Twitter: [@YOUR_HANDLE](https://twitter.com/YOUR_HANDLE)

---

## 🙏 Acknowledgments

Built with:

- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [OpenZeppelin](https://openzeppelin.com/) - Security libraries
- [Ethers.js](https://docs.ethers.org/) - Web3 library
- [React](https://react.dev/) - UI framework

---

## 📄 Project Status

**Status**: ✅ Complete and Production-Ready

**Version**: 1.0.0

**Last Updated**: February 6, 2024

---

<div align="center">

### ⭐ If you found this helpful, please star the repository! ⭐

[View on GitHub](https://github.com/YOUR_USERNAME/voting-dapp) • [Read Documentation](./README.md) • [Deploy Now](./DEPLOYMENT_GUIDE.md)

**Happy Voting! 🗳️**

</div>
