// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Voting
 * @dev A smart contract for managing voting on proposals with deadline enforcement
 */
contract Voting {
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 createdAt;
        uint256 deadline;
        uint256 votesFor;
        uint256 votesAgainst;
        address creator;
        bool executed;
        string winner; // "FOR", "AGAINST", or "TIE"
    }

    // Vote structure
    struct Vote {
        bool voted;
        bool support; // true for, false against
    }

    // State variables
    address public admin;
    uint256 public proposalCount;
    
    // Mapping of proposal ID to proposal details
    mapping(uint256 => Proposal) public proposals;
    
    // Mapping of proposal ID to voter address to vote details
    mapping(uint256 => mapping(address => Vote)) public votes;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        uint256 deadline,
        address creator
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        string winner,
        uint256 votesFor,
        uint256 votesAgainst
    );

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier proposalExists(uint256 _proposalId) {
        require(_proposalId < proposalCount, "Proposal does not exist");
        _;
    }

    modifier votingActive(uint256 _proposalId) {
        require(
            block.timestamp <= proposals[_proposalId].deadline,
            "Voting period has ended"
        );
        _;
    }

    modifier votingEnded(uint256 _proposalId) {
        require(
            block.timestamp > proposals[_proposalId].deadline,
            "Voting period is still active"
        );
        _;
    }

    /**
     * @dev Constructor sets the deployer as admin
     */
    constructor() {
        admin = msg.sender;
        proposalCount = 0;
    }

    /**
     * @dev Creates a new proposal (only admin)
     * @param _title Title of the proposal
     * @param _description Description of the proposal
     * @param _durationInSeconds Duration of voting period in seconds
     */
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _durationInSeconds
    ) public onlyAdmin {
        require(_durationInSeconds > 0, "Duration must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        uint256 deadline = block.timestamp + _durationInSeconds;
        
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            description: _description,
            createdAt: block.timestamp,
            deadline: deadline,
            votesFor: 0,
            votesAgainst: 0,
            creator: msg.sender,
            executed: false,
            winner: ""
        });

        emit ProposalCreated(proposalCount, _title, deadline, msg.sender);
        proposalCount++;
    }

    /**
     * @dev Cast a vote on a proposal
     * @param _proposalId ID of the proposal
     * @param _support true to vote for, false to vote against
     */
    function vote(uint256 _proposalId, bool _support)
        public
        proposalExists(_proposalId)
        votingActive(_proposalId)
    {
        require(
            !votes[_proposalId][msg.sender].voted,
            "You have already voted on this proposal"
        );

        votes[_proposalId][msg.sender] = Vote({
            voted: true,
            support: _support
        });

        if (_support) {
            proposals[_proposalId].votesFor++;
        } else {
            proposals[_proposalId].votesAgainst++;
        }

        emit VoteCast(_proposalId, msg.sender, _support);
    }

    /**
     * @dev Execute proposal after deadline has passed
     * @param _proposalId ID of the proposal
     */
    function executeProposal(uint256 _proposalId)
        public
        proposalExists(_proposalId)
        votingEnded(_proposalId)
    {
        require(!proposals[_proposalId].executed, "Proposal already executed");

        Proposal storage proposal = proposals[_proposalId];
        
        string memory winner;
        if (proposal.votesFor > proposal.votesAgainst) {
            winner = "FOR";
        } else if (proposal.votesAgainst > proposal.votesFor) {
            winner = "AGAINST";
        } else {
            winner = "TIE";
        }

        proposal.executed = true;
        proposal.winner = winner;

        emit ProposalExecuted(
            _proposalId,
            winner,
            proposal.votesFor,
            proposal.votesAgainst
        );
    }

    /**
     * @dev Get proposal details
     * @param _proposalId ID of the proposal
     */
    function getProposal(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (Proposal memory)
    {
        return proposals[_proposalId];
    }

    /**
     * @dev Get all proposals
     */
    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalCount);
        for (uint256 i = 0; i < proposalCount; i++) {
            allProposals[i] = proposals[i];
        }
        return allProposals;
    }

    /**
     * @dev Check if address has voted on a proposal
     * @param _proposalId ID of the proposal
     * @param _voter Address of the voter
     */
    function hasVoted(uint256 _proposalId, address _voter)
        public
        view
        proposalExists(_proposalId)
        returns (bool)
    {
        return votes[_proposalId][_voter].voted;
    }

    /**
     * @dev Get vote details for an address on a proposal
     * @param _proposalId ID of the proposal
     * @param _voter Address of the voter
     */
    function getVote(uint256 _proposalId, address _voter)
        public
        view
        proposalExists(_proposalId)
        returns (Vote memory)
    {
        return votes[_proposalId][_voter];
    }

    /**
     * @dev Get current vote counts for a proposal
     * @param _proposalId ID of the proposal
     */
    function getVoteCounts(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (uint256 votesFor, uint256 votesAgainst)
    {
        return (proposals[_proposalId].votesFor, proposals[_proposalId].votesAgainst);
    }

    /**
     * @dev Check if voting period is active
     * @param _proposalId ID of the proposal
     */
    function isVotingActive(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (bool)
    {
        return block.timestamp <= proposals[_proposalId].deadline;
    }

    /**
     * @dev Get time remaining for voting
     * @param _proposalId ID of the proposal
     */
    function getTimeRemaining(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (int256)
    {
        int256 timeLeft = int256(proposals[_proposalId].deadline) - int256(block.timestamp);
        return timeLeft > 0 ? timeLeft : 0;
    }
}
