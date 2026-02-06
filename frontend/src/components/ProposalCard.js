import React, { useState, useEffect } from 'react';
import './ProposalCard.css';

function ProposalCard({ proposal, contract, account, onVote }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (account && contract) {
      checkIfVoted();
    }
    updateTimeRemaining();
  }, [account, proposal, contract]);

  const checkIfVoted = async () => {
    try {
      const voted = await contract.hasVoted(proposal.id, account);
      setHasVoted(voted);

      if (voted) {
        const voteData = await contract.getVote(proposal.id, account);
        setUserVote(voteData.support);
      }
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const updateTimeRemaining = () => {
    const now = Math.floor(Date.now() / 1000);
    const deadline = Number(proposal.deadline);
    const remaining = deadline - now;

    if (remaining > 0) {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      setTimeRemaining(`${hours}h ${minutes}m`);
    } else {
      setTimeRemaining('Expired');
    }
  };

  const handleVote = async (support) => {
    try {
      setVoting(true);

      const tx = await contract.vote(proposal.id, support);
      await tx.wait();

      setHasVoted(true);
      setUserVote(support);
      onVote();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error voting. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  const votesFor = Number(proposal.votesFor);
  const votesAgainst = Number(proposal.votesAgainst);
  const totalVotes = votesFor + votesAgainst;
  const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0;

  return (
    <div className="proposal-card">
      <div className="proposal-header">
        <h3>{proposal.title}</h3>
        <span className={`status-badge ${proposal.executed ? 'executed' : 'active'}`}>
          {proposal.executed ? '✓ Closed' : '⏳ Active'}
        </span>
      </div>

      <p className="proposal-description">{proposal.description}</p>

      <div className="vote-stats">
        <div className="vote-bar">
          <div className="vote-for" style={{ width: `${forPercentage}%` }}>
            {forPercentage > 10 && <span>{votesFor}</span>}
          </div>
          <div className="vote-against" style={{ width: `${againstPercentage}%` }}>
            {againstPercentage > 10 && <span>{votesAgainst}</span>}
          </div>
        </div>
        <div className="vote-labels">
          <span className="vote-for-label">For: {votesFor}</span>
          <span className="vote-against-label">Against: {votesAgainst}</span>
        </div>
      </div>

      {proposal.executed && proposal.winner && (
        <div className={`result ${proposal.winner.toLowerCase()}`}>
          <strong>Result: {proposal.winner}</strong>
        </div>
      )}

      {!proposal.executed && (
        <div className="time-remaining">
          ⏱️ {timeRemaining}
        </div>
      )}

      {!proposal.executed && (
        <div className="vote-buttons">
          {hasVoted ? (
            <div className="already-voted">
              <p>✓ You voted: <strong>{userVote ? 'FOR' : 'AGAINST'}</strong></p>
            </div>
          ) : (
            <>
              <button
                className="btn btn-for"
                onClick={() => handleVote(true)}
                disabled={voting || proposal.executed}
              >
                {voting ? '...' : '👍 Vote For'}
              </button>
              <button
                className="btn btn-against"
                onClick={() => handleVote(false)}
                disabled={voting || proposal.executed}
              >
                {voting ? '...' : '👎 Vote Against'}
              </button>
            </>
          )}
        </div>
      )}

      <div className="proposal-meta">
        <small>Created: {new Date(Number(proposal.createdAt) * 1000).toLocaleDateString()}</small>
      </div>
    </div>
  );
}

export default ProposalCard;
