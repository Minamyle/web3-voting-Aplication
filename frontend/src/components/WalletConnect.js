import React, { useState } from 'react';
import { ethers } from 'ethers';
import './WalletConnect.css';

function WalletConnect({ onConnect }) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setConnected(true);
      onConnect(provider, signer, accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    onConnect(null, null, null);
  };

  return (
    <div className="wallet-connect">
      {!connected ? (
        <button
          className="wallet-btn connect-btn"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <button className="wallet-btn disconnect-btn" onClick={disconnectWallet}>
          Disconnect
        </button>
      )}
    </div>
  );
}

export default WalletConnect;
