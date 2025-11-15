// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RISSReputation.sol";

/**
 * @title KRNLIntegration
 * @notice Integration contract for KRNL Protocol task management
 * @dev Acts as a bridge between KRNL Protocol and RISS Reputation system
 */
interface IKRNLTask {
    function getTaskStatus(string memory _taskId) external view returns (uint8); // 0=open, 1=assigned, 2=in_progress, 3=completed, 4=validated
    function getTaskCreator(string memory _taskId) external view returns (address);
    function getTaskAssignee(string memory _taskId) external view returns (address);
    function getTaskScoreWeight(string memory _taskId) external view returns (uint256);
}

contract KRNLIntegration {
    RISSReputation public rissReputation;
    IKRNLTask public krnlTaskContract;
    
    address public owner;
    mapping(string => bool) public processedTasks; // Track processed KRNL tasks
    
    event TaskProcessed(string indexed taskId, address indexed user, uint256 scoreWeight);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "KRNLIntegration: Not owner");
        _;
    }
    
    constructor(address _rissReputation, address _krnlTaskContract) {
        owner = msg.sender;
        rissReputation = RISSReputation(_rissReputation);
        krnlTaskContract = IKRNLTask(_krnlTaskContract);
    }
    
    /**
     * @notice Process a completed KRNL task and update RISS reputation
     * @param _taskId KRNL task ID
     */
    function processKrnlTask(string memory _taskId) external {
        require(!processedTasks[_taskId], "KRNLIntegration: Task already processed");
        
        uint8 status = krnlTaskContract.getTaskStatus(_taskId);
        require(status == 4, "KRNLIntegration: Task not validated"); // 4 = validated
        
        address assignee = krnlTaskContract.getTaskAssignee(_taskId);
        require(assignee != address(0), "KRNLIntegration: No assignee");
        
        uint256 scoreWeight = krnlTaskContract.getTaskScoreWeight(_taskId);
        
        // Record task completion in RISS
        rissReputation.recordKrnlTaskCompletion(assignee, _taskId, scoreWeight);
        
        processedTasks[_taskId] = true;
        
        emit TaskProcessed(_taskId, assignee, scoreWeight);
    }
    
    /**
     * @notice Batch process multiple KRNL tasks
     * @param _taskIds Array of KRNL task IDs
     */
    function batchProcessKrnlTasks(string[] memory _taskIds) external {
        for (uint256 i = 0; i < _taskIds.length; i++) {
            if (!processedTasks[_taskIds[i]]) {
                this.processKrnlTask(_taskIds[i]);
            }
        }
    }
    
    /**
     * @notice Update RISS reputation contract address
     * @param _rissReputation New RISS reputation contract address
     */
    function setRissReputation(address _rissReputation) external onlyOwner {
        rissReputation = RISSReputation(_rissReputation);
    }
    
    /**
     * @notice Update KRNL task contract address
     * @param _krnlTaskContract New KRNL task contract address
     */
    function setKrnlTaskContract(address _krnlTaskContract) external onlyOwner {
        krnlTaskContract = IKRNLTask(_krnlTaskContract);
    }
    
    /**
     * @notice Check if a task has been processed
     * @param _taskId KRNL task ID
     * @return True if task has been processed
     */
    function isTaskProcessed(string memory _taskId) external view returns (bool) {
        return processedTasks[_taskId];
    }
}

