import React, { useState, useEffect } from 'react';
import ProposalCard from './ProposalCard';
import './ProposalList.css';

function ProposalList({ proposals, contract, account, onVote }) {
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (proposals) {
      let filtered = proposals;

      if (filter === 'active') {
        filtered = proposals.filter((p) => !p.executed);
      } else if (filter === 'completed') {
        filtered = proposals.filter((p) => p.executed);
      }

      setFilteredProposals(filtered);
    }
  }, [proposals, filter]);

  return (
    <div className="proposal-list">
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Proposals ({proposals.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {filteredProposals.length === 0 ? (
        <div className="no-proposals">
          <p>No proposals found</p>
        </div>
      ) : (
        <div className="proposals-grid">
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              contract={contract}
              account={account}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProposalList;
