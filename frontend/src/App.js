import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import WalletConnect from './components/WalletConnect';
import ProposalList from './components/ProposalList';
import CreateProposal from './components/CreateProposal';

const VOTING_CONTRACT_ADDRESS = process.env.REACT_APP_VOTING_CONTRACT_ADDRESS || '';
const VOTING_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposalCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_durationInSeconds", "type": "uint256" }
    ],
    "name": "createProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_proposalId", "type": "uint256" },
      { "internalType": "bool", "name": "_support", "type": "bool" }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_proposalId", "type": "uint256" }],
    "name": "executeProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_proposalId", "type": "uint256" }],
    "name": "getProposal",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint256", "name": "votesFor", "type": "uint256" },
          { "internalType": "uint256", "name": "votesAgainst", "type": "uint256" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "bool", "name": "executed", "type": "bool" },
          { "internalType": "string", "name": "winner", "type": "string" }
        ],
        "internalType": "struct Voting.Proposal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProposals",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint256", "name": "votesFor", "type": "uint256" },
          { "internalType": "uint256", "name": "votesAgainst", "type": "uint256" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "bool", "name": "executed", "type": "bool" },
          { "internalType": "string", "name": "winner", "type": "string" }
        ],
        "internalType": "struct Voting.Proposal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_proposalId", "type": "uint256" },
      { "internalType": "address", "name": "_voter", "type": "address" }
    ],
    "name": "hasVoted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_proposalId", "type": "uint256" },
      { "internalType": "address", "name": "_voter", "type": "address" }
    ],
    "name": "getVote",
    "outputs": [
      {
        "components": [
          { "internalType": "bool", "name": "voted", "type": "bool" },
          { "internalType": "bool", "name": "support", "type": "bool" }
        ],
        "internalType": "struct Voting.Vote",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_proposalId", "type": "uint256" }],
    "name": "getVoteCounts",
    "outputs": [
      { "internalType": "uint256", "name": "votesFor", "type": "uint256" },
      { "internalType": "uint256", "name": "votesAgainst", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_proposalId", "type": "uint256" }],
    "name": "isVotingActive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_proposalId", "type": "uint256" }],
    "name": "getTimeRemaining",
    "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize contract when provider and signer are available
  useEffect(() => {
    if (provider && signer) {
      const votingContract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        signer
      );
      setContract(votingContract);
      checkIfAdmin();
      loadProposals();
    }
  }, [provider, signer]);

  const checkIfAdmin = async () => {
    try {
      if (contract && account) {
        const admin = await contract.admin();
        setIsAdmin(admin.toLowerCase() === account.toLowerCase());
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  const loadProposals = async () => {
    try {
      setLoading(true);
      if (contract) {
        const allProposals = await contract.getAllProposals();
        setProposals(allProposals);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading proposals:', err);
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = (provider, signer, account) => {
    setProvider(provider);
    setSigner(signer);
    setAccount(account);
  };

  const handleProposalCreated = () => {
    loadProposals();
  };

  const handleVote = () => {
    loadProposals();
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🗳️ Voting dApp</h1>
        <WalletConnect onConnect={handleWalletConnect} />
      </header>

      <main className="app-main">
        {account && (
          <div className="user-info">
            <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            {isAdmin && <span className="admin-badge">Admin</span>}
          </div>
        )}

        {!account && (
          <div className="connect-wallet-message">
            <p>Please connect your wallet to participate in voting.</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {account && isAdmin && (
          <CreateProposal
            contract={contract}
            signer={signer}
            onProposalCreated={handleProposalCreated}
          />
        )}

        {loading ? (
          <div className="loading">Loading proposals...</div>
        ) : (
          <ProposalList
            proposals={proposals}
            contract={contract}
            account={account}
            onVote={handleVote}
          />
        )}
      </main>
    </div>
  );
}

export default App;
