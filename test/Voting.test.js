const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Voting Contract", function () {
  let voting;
  let admin;
  let voter1;
  let voter2;
  let voter3;
  let nonAdmin;

  const PROPOSAL_DURATION = 3600; // 1 hour in seconds

  beforeEach(async function () {
    // Get signers
    [admin, voter1, voter2, voter3, nonAdmin] = await ethers.getSigners();

    // Deploy contract
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.deployed();
  });

  // Test 1: Contract deployment and admin setup
  describe("Deployment", function () {
    it("Should set the correct admin", async function () {
      expect(await voting.admin()).to.equal(admin.address);
    });

    it("Should initialize proposal count to 0", async function () {
      expect(await voting.proposalCount()).to.equal(0);
    });
  });

  // Test 2: Proposal creation by admin
  describe("Proposal Creation", function () {
    it("Should allow admin to create a proposal", async function () {
      const title = "Budget Allocation";
      const description = "Allocate budget for Q1 2024";
      
      await expect(
        voting.createProposal(title, description, PROPOSAL_DURATION)
      ).to.emit(voting, "ProposalCreated");

      expect(await voting.proposalCount()).to.equal(1);
      
      const proposal = await voting.getProposal(0);
      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
    });

    it("Should not allow non-admin to create a proposal", async function () {
      await expect(
        voting.connect(nonAdmin).createProposal("Title", "Description", PROPOSAL_DURATION)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should reject proposal with zero duration", async function () {
      await expect(
        voting.createProposal("Title", "Description", 0)
      ).to.be.revertedWith("Duration must be greater than 0");
    });

    it("Should reject proposal with empty title", async function () {
      await expect(
        voting.createProposal("", "Description", PROPOSAL_DURATION)
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should increment proposal count correctly", async function () {
      await voting.createProposal("Proposal 1", "Description 1", PROPOSAL_DURATION);
      await voting.createProposal("Proposal 2", "Description 2", PROPOSAL_DURATION);
      await voting.createProposal("Proposal 3", "Description 3", PROPOSAL_DURATION);
      
      expect(await voting.proposalCount()).to.equal(3);
    });

    it("Should set correct deadline timestamp", async function () {
      const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
      
      await voting.createProposal("Title", "Description", PROPOSAL_DURATION);
      
      const proposal = await voting.getProposal(0);
      expect(proposal.deadline).to.equal(blockTimestamp + PROPOSAL_DURATION);
    });
  });

  // Test 3: Voting functionality
  describe("Voting", function () {
    beforeEach(async function () {
      await voting.createProposal("Test Proposal", "Test Description", PROPOSAL_DURATION);
    });

    it("Should allow registered addresses to vote", async function () {
      await expect(voting.connect(voter1).vote(0, true))
        .to.emit(voting, "VoteCast")
        .withArgs(0, voter1.address, true);
    });

    it("Should prevent voting after deadline", async function () {
      // Advance time beyond deadline
      await time.increase(PROPOSAL_DURATION + 1);

      await expect(
        voting.connect(voter1).vote(0, true)
      ).to.be.revertedWith("Voting period has ended");
    });

    it("Should prevent double voting on same proposal", async function () {
      await voting.connect(voter1).vote(0, true);

      await expect(
        voting.connect(voter1).vote(0, false)
      ).to.be.revertedWith("You have already voted on this proposal");
    });

    it("Should correctly count votes for", async function () {
      await voting.connect(voter1).vote(0, true);
      await voting.connect(voter2).vote(0, true);
      await voting.connect(voter3).vote(0, false);

      const [votesFor, votesAgainst] = await voting.getVoteCounts(0);
      expect(votesFor).to.equal(2);
      expect(votesAgainst).to.equal(1);
    });

    it("Should correctly count votes against", async function () {
      await voting.connect(voter1).vote(0, false);
      await voting.connect(voter2).vote(0, false);
      await voting.connect(voter3).vote(0, true);

      const [votesFor, votesAgainst] = await voting.getVoteCounts(0);
      expect(votesFor).to.equal(1);
      expect(votesAgainst).to.equal(2);
    });

    it("Should track voter address correctly", async function () {
      await voting.connect(voter1).vote(0, true);

      const hasVoted = await voting.hasVoted(0, voter1.address);
      expect(hasVoted).to.be.true;

      const hasNotVoted = await voting.hasVoted(0, voter2.address);
      expect(hasNotVoted).to.be.false;
    });

    it("Should allow multiple voters to vote on same proposal", async function () {
      await voting.connect(voter1).vote(0, true);
      await voting.connect(voter2).vote(0, true);
      await voting.connect(voter3).vote(0, false);

      const [votesFor, votesAgainst] = await voting.getVoteCounts(0);
      expect(votesFor).to.equal(2);
      expect(votesAgainst).to.equal(1);
    });
  });

  // Test 4: Deadline enforcement
  describe("Deadline Enforcement", function () {
    beforeEach(async function () {
      await voting.createProposal("Deadline Test", "Test", PROPOSAL_DURATION);
    });

    it("Should allow voting before deadline", async function () {
      const timeRemaining = await voting.getTimeRemaining(0);
      expect(timeRemaining).to.be.greaterThan(0);

      await expect(voting.connect(voter1).vote(0, true)).not.to.be.reverted;
    });

    it("Should report voting as active before deadline", async function () {
      const isActive = await voting.isVotingActive(0);
      expect(isActive).to.be.true;
    });

    it("Should report voting as inactive after deadline", async function () {
      await time.increase(PROPOSAL_DURATION + 1);

      const isActive = await voting.isVotingActive(0);
      expect(isActive).to.be.false;
    });

    it("Should execute proposal only after deadline", async function () {
      await expect(
        voting.executeProposal(0)
      ).to.be.revertedWith("Voting period is still active");

      await time.increase(PROPOSAL_DURATION + 1);

      await expect(voting.executeProposal(0))
        .to.emit(voting, "ProposalExecuted");
    });

    it("Should return correct time remaining", async function () {
      const timeRemaining = await voting.getTimeRemaining(0);
      expect(timeRemaining).to.be.greaterThan(0);
      expect(timeRemaining).to.be.lessThanOrEqual(PROPOSAL_DURATION);
    });
  });

  // Test 5: Access control
  describe("Access Control", function () {
    it("Should only allow admin to create proposals", async function () {
      await expect(
        voting.connect(voter1).createProposal("Title", "Description", PROPOSAL_DURATION)
      ).to.be.revertedWith("Only admin can perform this action");

      await expect(
        voting.connect(voter2).createProposal("Title", "Description", PROPOSAL_DURATION)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should allow anyone to vote", async function () {
      await voting.createProposal("Test", "Test", PROPOSAL_DURATION);

      await expect(voting.connect(voter1).vote(0, true)).not.to.be.reverted;
      await expect(voting.connect(voter2).vote(0, false)).not.to.be.reverted;
      await expect(voting.connect(nonAdmin).vote(0, true)).not.to.be.reverted;
    });

    it("Should allow anyone to execute proposal", async function () {
      await voting.createProposal("Test", "Test", PROPOSAL_DURATION);
      await voting.connect(voter1).vote(0, true);

      await time.increase(PROPOSAL_DURATION + 1);

      await expect(voting.connect(voter2).executeProposal(0))
        .to.emit(voting, "ProposalExecuted");
    });
  });

  // Test 6: Edge cases
  describe("Edge Cases", function () {
    it("Should handle tie in voting correctly", async function () {
      await voting.createProposal("Tie Test", "Test", PROPOSAL_DURATION);

      await voting.connect(voter1).vote(0, true);
      await voting.connect(voter2).vote(0, false);

      await time.increase(PROPOSAL_DURATION + 1);
      await voting.executeProposal(0);

      const proposal = await voting.getProposal(0);
      expect(proposal.winner).to.equal("TIE");
    });

    it("Should determine winner as FOR correctly", async function () {
      await voting.createProposal("Winner Test", "Test", PROPOSAL_DURATION);

      await voting.connect(voter1).vote(0, true);
      await voting.connect(voter2).vote(0, true);
      await voting.connect(voter3).vote(0, false);

      await time.increase(PROPOSAL_DURATION + 1);
      await voting.executeProposal(0);

      const proposal = await voting.getProposal(0);
      expect(proposal.winner).to.equal("FOR");
    });

    it("Should determine winner as AGAINST correctly", async function () {
      await voting.createProposal("Winner Test", "Test", PROPOSAL_DURATION);

      await voting.connect(voter1).vote(0, false);
      await voting.connect(voter2).vote(0, false);
      await voting.connect(voter3).vote(0, true);

      await time.increase(PROPOSAL_DURATION + 1);
      await voting.executeProposal(0);

      const proposal = await voting.getProposal(0);
      expect(proposal.winner).to.equal("AGAINST");
    });

    it("Should prevent double execution of proposal", async function () {
      await voting.createProposal("Test", "Test", PROPOSAL_DURATION);

      await time.increase(PROPOSAL_DURATION + 1);
      await voting.executeProposal(0);

      await expect(
        voting.executeProposal(0)
      ).to.be.revertedWith("Proposal already executed");
    });

    it("Should handle proposal with no votes", async function () {
      await voting.createProposal("Empty Proposal", "Test", PROPOSAL_DURATION);

      await time.increase(PROPOSAL_DURATION + 1);
      await voting.executeProposal(0);

      const proposal = await voting.getProposal(0);
      expect(proposal.winner).to.equal("TIE");
      expect(proposal.votesFor).to.equal(0);
      expect(proposal.votesAgainst).to.equal(0);
    });

    it("Should handle voting on non-existent proposal", async function () {
      await expect(
        voting.connect(voter1).vote(999, true)
      ).to.be.revertedWith("Proposal does not exist");
    });

    it("Should handle retrieving non-existent proposal", async function () {
      await expect(
        voting.getProposal(999)
      ).to.be.revertedWith("Proposal does not exist");
    });

    it("Should correctly return all proposals", async function () {
      await voting.createProposal("Proposal 1", "Description 1", PROPOSAL_DURATION);
      await voting.createProposal("Proposal 2", "Description 2", PROPOSAL_DURATION);
      await voting.createProposal("Proposal 3", "Description 3", PROPOSAL_DURATION);

      const allProposals = await voting.getAllProposals();
      expect(allProposals.length).to.equal(3);
      expect(allProposals[0].title).to.equal("Proposal 1");
      expect(allProposals[1].title).to.equal("Proposal 2");
      expect(allProposals[2].title).to.equal("Proposal 3");
    });

    it("Should track vote details correctly", async function () {
      await voting.createProposal("Test", "Test", PROPOSAL_DURATION);
      await voting.connect(voter1).vote(0, true);

      const vote = await voting.getVote(0, voter1.address);
      expect(vote.voted).to.be.true;
      expect(vote.support).to.be.true;
    });
  });

  // Test 7: View functions
  describe("View Functions", function () {
    it("Should return correct proposal data", async function () {
      const title = "Test Title";
      const description = "Test Description";
      
      await voting.createProposal(title, description, PROPOSAL_DURATION);
      
      const proposal = await voting.getProposal(0);
      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
      expect(proposal.creator).to.equal(admin.address);
      expect(proposal.executed).to.be.false;
      expect(proposal.votesFor).to.equal(0);
      expect(proposal.votesAgainst).to.equal(0);
    });

    it("Should correctly report voting status", async function () {
      await voting.createProposal("Test", "Test", PROPOSAL_DURATION);

      const isActive1 = await voting.isVotingActive(0);
      expect(isActive1).to.be.true;

      await time.increase(PROPOSAL_DURATION + 1);

      const isActive2 = await voting.isVotingActive(0);
      expect(isActive2).to.be.false;
    });
  });
});
