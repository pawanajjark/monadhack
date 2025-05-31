// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {
    struct Levels {
        uint256 levelsCount;
        mapping(uint256 => string[]) levels;
    }
    
    Levels public gameLevels;
    address public owner;
    address public factory;
    string public gameName;
    uint256 public gameId;
    
    // Payment mechanics
    uint256 public costOfPlay;
    uint256 public prizePool;
    address public constant PLATFORM_ADDRESS = 0x9a382e06F97384d40A5cfB354485e343419afddf;
    
    // Revenue split percentages (in basis points for precision)
    uint256 public constant POOL_PERCENTAGE = 5000;     // 50%
    uint256 public constant CREATOR_PERCENTAGE = 2000;  // 20%
    uint256 public constant PLATFORM_PERCENTAGE = 2000; // 20%
    uint256 public constant REMAINING_PERCENTAGE = 1000; // 10% (for rounding/future use)
    
    // Player tracking
    mapping(address => uint256) public playerPayments;
    mapping(address => bool) public hasPlayed;
    address[] public players;
    uint256 public totalPlayers;
    
    event GameCreated(uint256 indexed gameId, string gameName, address owner, uint256 costOfPlay);
    event LevelAdded(uint256 indexed levelIndex, uint256 rowCount);
    event PlayerPaid(address indexed player, uint256 amount, uint256 poolShare, uint256 creatorShare, uint256 platformShare);
    event PrizePoolUpdated(uint256 newBalance);
    event PaymentWithdrawn(address indexed recipient, uint256 amount, string paymentType);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyOwnerOrFactory() {
        require(msg.sender == owner || msg.sender == factory, "Only owner or factory can call this function");
        _;
    }
    
    constructor(
        uint256 _gameId,
        string memory _gameName,
        address _owner,
        address _factory,
        uint256 _costOfPlay
    ) {
        gameId = _gameId;
        gameName = _gameName;
        owner = _owner;
        factory = _factory;
        costOfPlay = _costOfPlay;
        gameLevels.levelsCount = 0;
        prizePool = 0.001 ether; // Initial prize pool
        totalPlayers = 0;
        
        emit GameCreated(_gameId, _gameName, _owner, _costOfPlay);
    }
    
    // Internal function for game play logic
    function _playGame() internal {
        require(msg.value == costOfPlay, "Incorrect payment amount");
        
        // Calculate revenue splits
        uint256 poolShare = (msg.value * POOL_PERCENTAGE) / 10000;
        uint256 creatorShare = (msg.value * CREATOR_PERCENTAGE) / 10000;
        uint256 platformShare = (msg.value * PLATFORM_PERCENTAGE) / 10000;
        
        // Update prize pool
        prizePool += poolShare;
        
        // Track player
        if (!hasPlayed[msg.sender]) {
            players.push(msg.sender);
            hasPlayed[msg.sender] = true;
            totalPlayers++;
        }
        playerPayments[msg.sender] += msg.value;
        
        // Transfer payments
        payable(owner).transfer(creatorShare);
        payable(PLATFORM_ADDRESS).transfer(platformShare);
        
        emit PlayerPaid(msg.sender, msg.value, poolShare, creatorShare, platformShare);
        emit PrizePoolUpdated(prizePool);
    }
    
    // Payment function for players (now calls internal function)
    function playGame() external payable {
        _playGame();
    }
    
    // Function to award prize (only owner can call)
    function awardPrize(address winner, uint256 amount) external onlyOwner {
        require(amount <= prizePool, "Insufficient prize pool");
        require(hasPlayed[winner], "Winner must have played the game");
        
        prizePool -= amount;
        payable(winner).transfer(amount);
        
        emit PaymentWithdrawn(winner, amount, "Prize");
        emit PrizePoolUpdated(prizePool);
    }
    
    // Function to award full prize pool
    function awardFullPrize(address winner) external onlyOwner {
        require(prizePool > 0, "No prize pool available");
        require(hasPlayed[winner], "Winner must have played the game");
        
        uint256 amount = prizePool;
        prizePool = 0;
        payable(winner).transfer(amount);
        
        emit PaymentWithdrawn(winner, amount, "Full Prize");
        emit PrizePoolUpdated(prizePool);
    }
    
    // Emergency withdrawal (only owner)
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        payable(owner).transfer(balance);
        prizePool = 0;
        
        emit PaymentWithdrawn(owner, balance, "Emergency");
        emit PrizePoolUpdated(prizePool);
    }
    
    // View functions for payment info
    function getPaymentInfo() external view returns (
        uint256 _costOfPlay,
        uint256 _prizePool,
        uint256 _totalPlayers,
        uint256 _contractBalance
    ) {
        return (costOfPlay, prizePool, totalPlayers, address(this).balance);
    }
    
    function getPlayerInfo(address player) external view returns (
        bool _hasPlayed,
        uint256 _totalPaid
    ) {
        return (hasPlayed[player], playerPayments[player]);
    }
    
    function getAllPlayers() external view returns (address[] memory) {
        return players;
    }
    
    function getRevenueBreakdown(uint256 amount) external pure returns (
        uint256 poolShare,
        uint256 creatorShare,
        uint256 platformShare,
        uint256 remaining
    ) {
        poolShare = (amount * POOL_PERCENTAGE) / 10000;
        creatorShare = (amount * CREATOR_PERCENTAGE) / 10000;
        platformShare = (amount * PLATFORM_PERCENTAGE) / 10000;
        remaining = amount - poolShare - creatorShare - platformShare;
        
        return (poolShare, creatorShare, platformShare, remaining);
    }
    
    // Update cost of play (only owner)
    function updateCostOfPlay(uint256 newCost) external onlyOwner {
        costOfPlay = newCost;
    }
    
    function _addLevel(string[] memory levelRows) internal {
        uint256 levelIndex = gameLevels.levelsCount;
        
        for (uint256 i = 0; i < levelRows.length; i++) {
            gameLevels.levels[levelIndex].push(levelRows[i]);
        }
        
        gameLevels.levelsCount++;
        emit LevelAdded(levelIndex, levelRows.length);
    }
    
    function addLevel(string[] memory levelRows) external onlyOwnerOrFactory {
        _addLevel(levelRows);
    }
    
    function addMultipleLevels(string[][] memory levels) external onlyOwnerOrFactory {
        for (uint256 i = 0; i < levels.length; i++) {
            _addLevel(levels[i]);
        }
    }
    
    function getLevel(uint256 levelIndex) external view returns (string[] memory) {
        require(levelIndex < gameLevels.levelsCount, "Level does not exist");
        
        string[] memory level = new string[](gameLevels.levels[levelIndex].length);
        for (uint256 i = 0; i < gameLevels.levels[levelIndex].length; i++) {
            level[i] = gameLevels.levels[levelIndex][i];
        }
        return level;
    }
    
    function getLevelRowCount(uint256 levelIndex) external view returns (uint256) {
        require(levelIndex < gameLevels.levelsCount, "Level does not exist");
        return gameLevels.levels[levelIndex].length;
    }
    
    function getLevelRow(uint256 levelIndex, uint256 rowIndex) external view returns (string memory) {
        require(levelIndex < gameLevels.levelsCount, "Level does not exist");
        require(rowIndex < gameLevels.levels[levelIndex].length, "Row does not exist");
        return gameLevels.levels[levelIndex][rowIndex];
    }
    
    function getLevelsCount() external view returns (uint256) {
        return gameLevels.levelsCount;
    }
    
    function getGameInfo() external view returns (
        uint256 _gameId,
        string memory _gameName,
        address _owner,
        uint256 _levelsCount
    ) {
        return (gameId, gameName, owner, gameLevels.levelsCount);
    }
    
    function getCompleteGameInfo() external view returns (
        uint256 _gameId,
        string memory _gameName,
        address _owner,
        uint256 _levelsCount,
        uint256 _costOfPlay,
        uint256 _prizePool,
        uint256 _totalPlayers
    ) {
        return (gameId, gameName, owner, gameLevels.levelsCount, costOfPlay, prizePool, totalPlayers);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
    
    // Receive function to accept ETH and automatically play game
    receive() external payable {
        // If the exact cost is sent, play the game
        if (msg.value == costOfPlay && costOfPlay > 0) {
            _playGame();
        } else {
            // Otherwise, just add to prize pool (for donations or owner funding)
            prizePool += msg.value;
            emit PrizePoolUpdated(prizePool);
        }
    }
} 