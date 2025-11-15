// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockKRNLTask
 * @notice Mock contract for testing KRNL Protocol integration
 * @dev This simulates the KRNL Protocol task contract interface
 * In production, replace with actual KRNL Protocol contract
 */
contract MockKRNLTask {
    // Task status enum: 0=open, 1=assigned, 2=in_progress, 3=completed, 4=validated
    enum TaskStatus { Open, Assigned, InProgress, Completed, Validated }
    
    struct Task {
        string taskId;
        string title;
        string description;
        address creator;
        address assignee;
        TaskStatus status;
        uint256 scoreWeight;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    mapping(string => Task) public tasks;
    string[] public taskIds;
    
    event TaskCreated(string indexed taskId, address indexed creator);
    event TaskAssigned(string indexed taskId, address indexed assignee);
    event TaskCompleted(string indexed taskId, address indexed assignee);
    event TaskValidated(string indexed taskId, address indexed validator);
    
    /**
     * @notice Create a new task
     */
    function createTask(
        string memory _taskId,
        string memory _title,
        string memory _description,
        uint256 _scoreWeight
    ) external {
        require(bytes(tasks[_taskId].taskId).length == 0, "Task ID exists");
        
        tasks[_taskId] = Task({
            taskId: _taskId,
            title: _title,
            description: _description,
            creator: msg.sender,
            assignee: address(0),
            status: TaskStatus.Open,
            scoreWeight: _scoreWeight,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        taskIds.push(_taskId);
        emit TaskCreated(_taskId, msg.sender);
    }
    
    /**
     * @notice Assign a task to a user
     */
    function assignTask(string memory _taskId, address _assignee) external {
        require(bytes(tasks[_taskId].taskId).length > 0, "Task not found");
        require(tasks[_taskId].status == TaskStatus.Open, "Task not open");
        
        tasks[_taskId].assignee = _assignee;
        tasks[_taskId].status = TaskStatus.Assigned;
        
        emit TaskAssigned(_taskId, _assignee);
    }
    
    /**
     * @notice Mark task as completed
     */
    function completeTask(string memory _taskId) external {
        require(bytes(tasks[_taskId].taskId).length > 0, "Task not found");
        require(tasks[_taskId].assignee == msg.sender, "Not assigned to you");
        require(tasks[_taskId].status == TaskStatus.Assigned || tasks[_taskId].status == TaskStatus.InProgress, "Invalid status");
        
        tasks[_taskId].status = TaskStatus.Completed;
        tasks[_taskId].completedAt = block.timestamp;
        
        emit TaskCompleted(_taskId, msg.sender);
    }
    
    /**
     * @notice Validate a completed task (only creator can validate)
     */
    function validateTask(string memory _taskId) external {
        require(bytes(tasks[_taskId].taskId).length > 0, "Task not found");
        require(tasks[_taskId].creator == msg.sender, "Not task creator");
        require(tasks[_taskId].status == TaskStatus.Completed, "Task not completed");
        
        tasks[_taskId].status = TaskStatus.Validated;
        
        emit TaskValidated(_taskId, msg.sender);
    }
    
    /**
     * @notice Get task status (for KRNLIntegration interface)
     */
    function getTaskStatus(string memory _taskId) external view returns (uint8) {
        require(bytes(tasks[_taskId].taskId).length > 0, "Task not found");
        return uint8(tasks[_taskId].status);
    }
    
    /**
     * @notice Get task creator
     */
    function getTaskCreator(string memory _taskId) external view returns (address) {
        require(bytes(tasks[_taskId].taskId).length > 0, "Task not found");
        return tasks[_taskId].creator;
    }
    
    /**
     * @notice Get task assignee
     */
    function getTaskAssignee(string memory _taskId) external view returns (address) {
        require(bytes(tasks[_taskId].taskId).length > 0, "Task not found");
        return tasks[_taskId].assignee;
    }
    
    /**
     * @notice Get task score weight
     */
    function getTaskScoreWeight(string memory _taskId) external view returns (uint256) {
        require(bytes(tasks[_taskId].taskId).length > 0, "Task not found");
        return tasks[_taskId].scoreWeight;
    }
    
    /**
     * @notice Get all task IDs
     */
    function getAllTaskIds() external view returns (string[] memory) {
        return taskIds;
    }
}

