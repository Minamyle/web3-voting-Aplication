import React, { useState } from 'react';
import './CreateProposal.css';

function CreateProposal({ contract, signer, onProposalCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '3600', // 1 hour default
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);

      if (!formData.title.trim()) {
        throw new Error('Title cannot be empty');
      }

      if (!formData.description.trim()) {
        throw new Error('Description cannot be empty');
      }

      const duration = parseInt(formData.duration);
      if (duration <= 0) {
        throw new Error('Duration must be greater than 0');
      }

      const tx = await contract.createProposal(
        formData.title,
        formData.description,
        duration
      );

      await tx.wait();

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        duration: '3600',
      });

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

      onProposalCreated();
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError(err.message || 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-proposal">
      <h2>Create New Proposal</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">✓ Proposal created successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Proposal Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter proposal title"
            disabled={loading}
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter proposal description"
            disabled={loading}
            rows="4"
            maxLength="500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Voting Duration (seconds)</label>
          <div className="duration-inputs">
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration in seconds"
              disabled={loading}
              min="1"
            />
            <select
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
              disabled={loading}
            >
              <option value="3600">1 Hour</option>
              <option value="86400">1 Day</option>
              <option value="604800">1 Week</option>
              <option value="2592000">30 Days</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Proposal'}
        </button>
      </form>
    </div>
  );
}

export default CreateProposal;
