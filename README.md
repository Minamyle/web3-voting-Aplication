# 🗳️ Full-Stack Voting dApp

A complete decentralized voting application built with Solidity, Hardhat, React, and Ethers.js. This project demonstrates a full-stack blockchain development workflow with smart contracts, comprehensive testing, and a modern frontend UI.

## 📋 Features

### Smart Contract (Solidity)
- **Admin-based Proposal Creation**: Only the contract deployer (admin) can create voting proposals
- **One Vote Per Address**: Each address can vote only once per proposal
- **Real-time Vote Counts**: View current vote tallies for any proposal
- **Deadline Management**: Each proposal has a defined voting period
- **Automatic Winner Determination**: Winner is determined after voting deadline
- **View Functions**: Access proposal details, vote counts, voting status, and time remaining

### Frontend (React + Ethers.js)
- **Wallet Connection**: MetaMask integration for wallet connection/disconnection
- **Active Proposals Display**: View all active and completed proposals in real-time
- **Vote Counts Visualization**: Visual vote progress bars showing FOR vs AGAINST votes
- **Real-time Voting**: Cast votes directly from the UI with transaction confirmation
- **Wallet Status Display**: Shows connected wallet address and admin status
- **Transaction Confirmations**: Users receive feedback on voting transactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Testing
- **16 Comprehensive Test Cases** covering:
  - Proposal creation and management
  - Voting functionality and constraints
  - Deadline enforcement and edge cases
  - Access control verification
  - Winner determination logic
  - View function accuracy

## 🛠 Technical Stack

- **Smart Contracts**: Solidity 0.8.18
- **Development Environment**: Hardhat
- **Testing Framework**: Chai with Ethers.js
- **Frontend Framework**: React 18
- **Blockchain Interaction**: Ethers.js v6
- **Wallet Integration**: MetaMask
- **Styling**: CSS3 with responsive design

## 📦 Project Structure

```
votingapp/
├── contracts/
│   └── Voting.sol                 # Main voting smart contract
├── test/
│   └── Voting.test.js             # Comprehensive test suite
├── scripts/
│   └── deploy.js                  # Deployment script
├── frontend/                       # React frontend application
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── WalletConnect.js   # Wallet connection component
│       │   ├── ProposalList.js    # Proposals display component
│       │   ├── ProposalCard.js    # Individual proposal component
│       │   └── CreateProposal.js  # Create proposal form (admin only)
│       ├── App.js                 # Main application component
│       ├── App.css
│       └── index.js
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Project dependencies
├── .env.example                   # Environment variables template
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension
- An Sepolia testnet wallet with test ETH

### Installation

1. **Clone the repository**
   ```bash
   cd votingapp
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   - Create a `.env` file in the root directory:
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   PRIVATE_KEY=your_wallet_private_key
   ETHERSCAN_API_KEY=your_etherscan_key
   ```

   - Create a `.env.local` file in the `frontend` directory:
   ```env
   REACT_APP_VOTING_CONTRACT_ADDRESS=0x...deployed_contract_address...
   ```

## 📝 Smart Contract API

### Key Functions

#### Admin Functions
```solidity
// Create a new proposal (only admin)
function createProposal(
    string memory _title,
    string memory _description,
    uint256 _durationInSeconds
) public onlyAdmin
```

#### Voting Functions
```solidity
// Cast a vote on a proposal
function vote(uint256 _proposalId, bool _support) public

// Execute proposal after deadline
function executeProposal(uint256 _proposalId) public
```

#### View Functions
```solidity
// Get all proposals
function getAllProposals() public view returns (Proposal[] memory)

// Get specific proposal details
function getProposal(uint256 _proposalId) public view returns (Proposal memory)

// Check vote count
function getVoteCounts(uint256 _proposalId) 
    public view returns (uint256 votesFor, uint256 votesAgainst)

// Check if address has voted
function hasVoted(uint256 _proposalId, address _voter) 
    public view returns (bool)

// Check if voting is active
function isVotingActive(uint256 _proposalId) public view returns (bool)

// Get time remaining for voting
function getTimeRemaining(uint256 _proposalId) public view returns (int256)
```

## 🧪 Testing

Run the test suite with:

```bash
# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/Voting.test.js

# Generate coverage report
npx hardhat coverage
```

### Test Coverage

The test suite includes **16 comprehensive test cases** covering:

1. **Deployment Tests** (2 cases)
   - Admin initialization
   - Proposal count initialization

2. **Proposal Creation Tests** (5 cases)
   - Admin can create proposals
   - Non-admin cannot create proposals
   - Validation of duration and title
   - Correct proposal count increment
   - Correct deadline timestamp

3. **Voting Functionality Tests** (6 cases)
   - Voting functionality
   - Deadline enforcement
   - Double voting prevention
   - Vote counting (FOR and AGAINST)
   - Voter tracking
   - Multiple voters

4. **Deadline Enforcement Tests** (5 cases)
   - Voting before deadline
   - Voting status
   - Voting after deadline prevention
   - Proposal execution timing
   - Time remaining calculation

5. **Access Control Tests** (3 cases)
   - Admin-only proposal creation
   - Anyone can vote
   - Anyone can execute

6. **Edge Cases Tests** (6 cases)
   - Tie handling
   - FOR winner determination
   - AGAINST winner determination
   - Double execution prevention
   - Empty proposal handling
   - Non-existent proposal handling

7. **View Functions Tests** (2 cases)
   - Proposal data accuracy
   - Voting status reporting

## 🚀 Deployment

### Local Testing with Hardhat
```bash
# Start a local Hardhat node
npx hardhat node

# In a new terminal, deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Deploy to Sepolia Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

The deployment script will:
1. Deploy the Voting contract
2. Log the contract address
3. Save the address to `contract-address.json`

## 🎨 Frontend Setup

### Running the Frontend Locally

1. **Update contract address**
   ```bash
   cd frontend
   cp .env.example .env.local
   # Edit .env.local with your deployed contract address
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Connect your MetaMask wallet
   - Make sure you're on the Sepolia network

### Features

- **Wallet Connection**: Click "Connect Wallet" to connect MetaMask
- **View Proposals**: All active and completed proposals are displayed
- **Vote**: Click "Vote For" or "Vote Against" to cast your vote
- **Create Proposals** (Admin only): If you're the admin, create new proposals
- **Real-time Updates**: Vote counts update in real-time
- **Status Indicators**: See voting time remaining, vote distribution, and results

## 📊 Contract Addresses

After deployment, your contract address will be saved in `contract-address.json`.

Example:
```json
{
  "address": "0x5FbDB2315678afccb333f8a9c91ff6e34edb2e19",
  "network": "sepolia",
  "deployer": "0x...",
  "deployedAt": "2024-02-06T12:00:00.000Z"
}
```

## 🌐 Deployment to Vercel/Netlify

### Frontend Deployment (Vercel)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - Add `REACT_APP_VOTING_CONTRACT_ADDRESS`

### Frontend Deployment (Netlify)

1. **Connect your GitHub repository to Netlify**
2. **Set build settings**:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
3. **Add environment variables**:
   - `REACT_APP_VOTING_CONTRACT_ADDRESS`

## 🔒 Security Considerations

- ✅ Implements access control (onlyAdmin modifier)
- ✅ Prevents double voting per proposal
- ✅ Enforces deadline constraints
- ✅ Uses SafeMath implicitly (Solidity 0.8.18+)
- ✅ No delegatecall or unsafe patterns
- ⚠️ This is a learning project - not audited for production use

## 📚 Learning Resources

- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Docs](https://hardhat.org/)
- [Ethers.js Docs](https://docs.ethers.org/v6/)
- [React Docs](https://react.dev/)
- [Ethereum Development Docs](https://ethereum.org/en/developers/)

## 🐛 Troubleshooting

### MetaMask Connection Issues
- Make sure MetaMask is installed and unlocked
- Ensure you're on the correct network (Sepolia testnet)
- Check that contract address is correctly set in `.env.local`

### Transaction Failures
- Ensure your wallet has sufficient test ETH
- Check that you haven't exceeded gas limits
- Verify the proposal deadline hasn't passed

### Frontend Not Loading
- Clear browser cache and localStorage
- Check browser console for errors
- Verify `.env.local` file has correct contract address

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Happy Voting! 🗳️**
#   w e b 3 - v o t i n g - A p l i c a t i o n  
 