// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RISSReputation
 * @notice Main contract for RISS Reputation & Identity Scoring System
 * @dev Integrates with KRNL Protocol for task-based reputation scoring
 */
contract RISSReputation {
    // ============ Structs ============
    
    struct ReputationScore {
        uint256 total;
        uint256 identity;
        uint256 contribution;
        uint256 trust;
        uint256 social;
        uint256 engagement;
        uint256 lastUpdated;
    }
    
    struct ActivityProof {
        string proofId;
        string activityType;
        string title;
        string source;
        uint256 timestamp;
        uint256 scoreImpact;
        bool verified;
        address verifier;
    }
    
    struct VerificationRequest {
        string requestId;
        string requestType; // "identity", "skill", "project", "krnl_contract"
        address requester;
        string[] proofs;
        uint256 submittedAt;
        uint256 reviewedAt;
        bool approved;
        address reviewer;
    }
    
    // ============ State Variables ============
    
    mapping(address => ReputationScore) public reputationScores;
    mapping(address => ActivityProof[]) public userActivities;
    mapping(string => VerificationRequest) public verificationRequests;
    mapping(address => bool) public verifiers; // Authorized verifiers
    mapping(address => bool) public krnlContracts; // Authorized KRNL contracts
    
    address public owner;
    uint256 public constant MAX_SCORE = 100;
    
    // Weight multipliers (basis points: 10000 = 100%)
    uint256 public constant IDENTITY_WEIGHT = 2500; // 25%
    uint256 public constant CONTRIBUTION_WEIGHT = 3500; // 35%
    uint256 public constant TRUST_WEIGHT = 2000; // 20%
    uint256 public constant SOCIAL_WEIGHT = 1000; // 10%
    uint256 public constant ENGAGEMENT_WEIGHT = 1000; // 10%
    
    // ============ Events ============
    
    event ReputationUpdated(
        address indexed user,
        uint256 totalScore,
        uint256 identity,
        uint256 contribution,
        uint256 trust,
        uint256 social,
        uint256 engagement
    );
    
    event ActivityAdded(
        address indexed user,
        string indexed proofId,
        string activityType,
        uint256 scoreImpact
    );
    
    event ActivityVerified(
        address indexed user,
        string indexed proofId,
        address indexed verifier
    );
    
    event VerificationRequested(
        string indexed requestId,
        address indexed requester,
        string requestType
    );
    
    event VerificationReviewed(
        string indexed requestId,
        address indexed reviewer,
        bool approved
    );
    
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event KrnlContractAdded(address indexed contractAddress);
    event KrnlContractRemoved(address indexed contractAddress);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "RISS: Not owner");
        _;
    }
    
    modifier onlyVerifier() {
        require(verifiers[msg.sender], "RISS: Not authorized verifier");
        _;
    }
    
    modifier onlyKrnlContract() {
        require(krnlContracts[msg.sender], "RISS: Not authorized KRNL contract");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
        verifiers[msg.sender] = true;
    }
    
    // ============ Owner Functions ============
    
    /**
     * @notice Add an authorized verifier
     * @param _verifier Address of the verifier to add
     */
    function addVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }
    
    /**
     * @notice Remove an authorized verifier
     * @param _verifier Address of the verifier to remove
     */
    function removeVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }
    
    /**
     * @notice Add an authorized KRNL contract
     * @param _contract Address of the KRNL contract to add
     */
    function addKrnlContract(address _contract) external onlyOwner {
        krnlContracts[_contract] = true;
        emit KrnlContractAdded(_contract);
    }
    
    /**
     * @notice Remove an authorized KRNL contract
     * @param _contract Address of the KRNL contract to remove
     */
    function removeKrnlContract(address _contract) external onlyOwner {
        krnlContracts[_contract] = false;
        emit KrnlContractRemoved(_contract);
    }
    
    // ============ Public Functions ============
    
    /**
     * @notice Submit an activity proof
     * @param _proofId Unique identifier for the proof
     * @param _activityType Type of activity (e.g., "github_commit", "krnl_task_completed")
     * @param _title Title of the activity
     * @param _source Source of the activity (e.g., "GitHub", "KRNL")
     * @param _scoreImpact Score impact of this activity
     */
    function submitActivityProof(
        string memory _proofId,
        string memory _activityType,
        string memory _title,
        string memory _source,
        uint256 _scoreImpact
    ) external {
        require(_scoreImpact <= 100, "RISS: Score impact too high");
        
        ActivityProof memory newProof = ActivityProof({
            proofId: _proofId,
            activityType: _activityType,
            title: _title,
            source: _source,
            timestamp: block.timestamp,
            scoreImpact: _scoreImpact,
            verified: false,
            verifier: address(0)
        });
        
        userActivities[msg.sender].push(newProof);
        
        emit ActivityAdded(msg.sender, _proofId, _activityType, _scoreImpact);
    }
    
    /**
     * @notice Verify an activity proof (only authorized verifiers)
     * @param _user Address of the user whose activity to verify
     * @param _proofIndex Index of the proof in the user's activities array
     */
    function verifyActivity(
        address _user,
        uint256 _proofIndex
    ) external onlyVerifier {
        require(_proofIndex < userActivities[_user].length, "RISS: Invalid proof index");
        
        ActivityProof storage proof = userActivities[_user][_proofIndex];
        require(!proof.verified, "RISS: Already verified");
        
        proof.verified = true;
        proof.verifier = msg.sender;
        
        _updateReputation(_user, proof);
        
        emit ActivityVerified(_user, proof.proofId, msg.sender);
    }
    
    /**
     * @notice Submit a verification request
     * @param _requestId Unique identifier for the request
     * @param _requestType Type of verification ("identity", "skill", "project", "krnl_contract")
     * @param _proofs Array of proof identifiers
     */
    function submitVerificationRequest(
        string memory _requestId,
        string memory _requestType,
        string[] memory _proofs
    ) external {
        require(bytes(verificationRequests[_requestId].requestId).length == 0, "RISS: Request ID exists");
        
        VerificationRequest memory newRequest = VerificationRequest({
            requestId: _requestId,
            requestType: _requestType,
            requester: msg.sender,
            proofs: _proofs,
            submittedAt: block.timestamp,
            reviewedAt: 0,
            approved: false,
            reviewer: address(0)
        });
        
        verificationRequests[_requestId] = newRequest;
        
        emit VerificationRequested(_requestId, msg.sender, _requestType);
    }
    
    /**
     * @notice Review a verification request (only authorized verifiers)
     * @param _requestId ID of the verification request
     * @param _approved Whether the request is approved
     */
    function reviewVerificationRequest(
        string memory _requestId,
        bool _approved
    ) external onlyVerifier {
        VerificationRequest storage request = verificationRequests[_requestId];
        require(bytes(request.requestId).length > 0, "RISS: Request not found");
        require(request.reviewedAt == 0, "RISS: Already reviewed");
        
        request.reviewedAt = block.timestamp;
        request.approved = _approved;
        request.reviewer = msg.sender;
        
        if (_approved) {
            // Add identity verification activity if approved
            string memory proofId = string(abi.encodePacked(_requestId, "_verified"));
            ActivityProof memory identityProof = ActivityProof({
                proofId: proofId,
                activityType: "verification",
                title: string(abi.encodePacked("Identity Verified: ", request.requestType)),
                source: "RISS",
                timestamp: block.timestamp,
                scoreImpact: 25, // Base identity verification score
                verified: true,
                verifier: msg.sender
            });
            
            userActivities[request.requester].push(identityProof);
            _updateReputation(request.requester, identityProof);
        }
        
        emit VerificationReviewed(_requestId, msg.sender, _approved);
    }
    
    /**
     * @notice Record KRNL task completion (only authorized KRNL contracts)
     * @param _user Address of the user who completed the task
     * @param _taskId KRNL task ID
     * @param _scoreWeight Score weight for this task
     */
    function recordKrnlTaskCompletion(
        address _user,
        string memory _taskId,
        uint256 _scoreWeight
    ) external onlyKrnlContract {
        require(_scoreWeight <= 100, "RISS: Score weight too high");
        
        string memory proofId = string(abi.encodePacked("krnl_", _taskId));
        ActivityProof memory taskProof = ActivityProof({
            proofId: proofId,
            activityType: "krnl_task_completed",
            title: string(abi.encodePacked("KRNL Task Completed: ", _taskId)),
            source: "KRNL",
            timestamp: block.timestamp,
            scoreImpact: _scoreWeight,
            verified: true,
            verifier: msg.sender
        });
        
        userActivities[_user].push(taskProof);
        _updateReputation(_user, taskProof);
        
        emit ActivityAdded(_user, proofId, "krnl_task_completed", _scoreWeight);
        emit ActivityVerified(_user, proofId, msg.sender);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get reputation score for a user
     * @param _user Address of the user
     * @return ReputationScore struct
     */
    function getReputationScore(address _user) external view returns (ReputationScore memory) {
        return reputationScores[_user];
    }
    
    /**
     * @notice Get all activities for a user
     * @param _user Address of the user
     * @return Array of ActivityProof structs
     */
    function getUserActivities(address _user) external view returns (ActivityProof[] memory) {
        return userActivities[_user];
    }
    
    /**
     * @notice Get verification request by ID
     * @param _requestId ID of the verification request
     * @return VerificationRequest struct
     */
    function getVerificationRequest(string memory _requestId) external view returns (VerificationRequest memory) {
        return verificationRequests[_requestId];
    }
    
    /**
     * @notice Get activity count for a user
     * @param _user Address of the user
     * @return Number of activities
     */
    function getActivityCount(address _user) external view returns (uint256) {
        return userActivities[_user].length;
    }
    
    /**
     * @notice Get verified activity count for a user
     * @param _user Address of the user
     * @return Number of verified activities
     */
    function getVerifiedActivityCount(address _user) external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < userActivities[_user].length; i++) {
            if (userActivities[_user][i].verified) {
                count++;
            }
        }
        return count;
    }
    
    // ============ Internal Functions ============
    
    /**
     * @notice Update reputation score based on verified activity
     * @param _user Address of the user
     * @param _proof Activity proof that was verified
     */
    function _updateReputation(address _user, ActivityProof memory _proof) internal {
        ReputationScore storage score = reputationScores[_user];
        
        // Update category scores based on activity type
        if (_compareStrings(_proof.activityType, "verification") || 
            _compareStrings(_proof.activityType, "certification")) {
            score.identity = _min(score.identity + _proof.scoreImpact, MAX_SCORE);
        } else if (_compareStrings(_proof.activityType, "github_commit") ||
                   _compareStrings(_proof.activityType, "github_pr") ||
                   _compareStrings(_proof.activityType, "krnl_task_completed") ||
                   _compareStrings(_proof.activityType, "bounty_completed")) {
            score.contribution = _min(score.contribution + _proof.scoreImpact, MAX_SCORE);
        } else if (_compareStrings(_proof.activityType, "endorsement") ||
                   _compareStrings(_proof.activityType, "dao_vote")) {
            score.trust = _min(score.trust + _proof.scoreImpact, MAX_SCORE);
        } else if (_compareStrings(_proof.activityType, "github_issue") ||
                   _compareStrings(_proof.activityType, "dao_proposal")) {
            score.social = _min(score.social + _proof.scoreImpact, MAX_SCORE);
        } else if (_compareStrings(_proof.activityType, "course_completion") ||
                   _compareStrings(_proof.activityType, "event_attendance")) {
            score.engagement = _min(score.engagement + _proof.scoreImpact, MAX_SCORE);
        }
        
        // Calculate weighted total score
        score.total = (
            (score.identity * IDENTITY_WEIGHT) +
            (score.contribution * CONTRIBUTION_WEIGHT) +
            (score.trust * TRUST_WEIGHT) +
            (score.social * SOCIAL_WEIGHT) +
            (score.engagement * ENGAGEMENT_WEIGHT)
        ) / 10000;
        
        score.lastUpdated = block.timestamp;
        
        emit ReputationUpdated(
            _user,
            score.total,
            score.identity,
            score.contribution,
            score.trust,
            score.social,
            score.engagement
        );
    }
    
    /**
     * @notice Compare two strings
     * @param _a First string
     * @param _b Second string
     * @return True if strings are equal
     */
    function _compareStrings(string memory _a, string memory _b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b));
    }
    
    /**
     * @notice Get minimum of two values
     * @param _a First value
     * @param _b Second value
     * @return Minimum value
     */
    function _min(uint256 _a, uint256 _b) internal pure returns (uint256) {
        return _a < _b ? _a : _b;
    }
}

