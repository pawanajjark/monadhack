// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Game.sol";

contract GameFactory {
    uint256 private gameCounter;
    mapping(uint256 => address) public games;
    mapping(address => uint256[]) public gamesByOwner;
    mapping(address => bool) public isGame;
    
    event GameCreated(
        uint256 indexed gameId,
        address indexed gameAddress,
        address indexed owner,
        string gameName
    );
    
    constructor() {
        gameCounter = 0;
    }
    
    function createGame(string memory gameName) public returns (address gameAddress) {
        gameCounter++;
        
        Game newGame = new Game(
            gameCounter,
            gameName,
            msg.sender,
            address(this),
            0.01 ether // Default cost of play
        );
        
        gameAddress = address(newGame);
        games[gameCounter] = gameAddress;
        gamesByOwner[msg.sender].push(gameCounter);
        isGame[gameAddress] = true;
        
        emit GameCreated(gameCounter, gameAddress, msg.sender, gameName);
        
        return gameAddress;
    }
    
    function createGameWithCost(string memory gameName, uint256 costOfPlay) public returns (address gameAddress) {
        gameCounter++;
        
        Game newGame = new Game(
            gameCounter,
            gameName,
            msg.sender,
            address(this),
            costOfPlay
        );
        
        gameAddress = address(newGame);
        games[gameCounter] = gameAddress;
        gamesByOwner[msg.sender].push(gameCounter);
        isGame[gameAddress] = true;
        
        emit GameCreated(gameCounter, gameAddress, msg.sender, gameName);
        
        return gameAddress;
    }
    
    function createGameWithLevels(
        string memory gameName,
        string[][] memory levels
    ) public returns (address gameAddress) {
        gameAddress = createGame(gameName);
        Game game = Game(payable(gameAddress));
        game.addMultipleLevels(levels);
        
        return gameAddress;
    }
    
    function createGameWithLevelsAndCost(
        string memory gameName,
        string[][] memory levels,
        uint256 costOfPlay
    ) public returns (address gameAddress) {
        gameAddress = createGameWithCost(gameName, costOfPlay);
        Game game = Game(payable(gameAddress));
        game.addMultipleLevels(levels);
        
        return gameAddress;
    }
    
    function createGameWithSampleLevels(string memory gameName) external returns (address gameAddress) {
        // Create the sample levels from the provided JSON structure
        string[][] memory sampleLevels = new string[][](2);
        
        // Level 1
        sampleLevels[0] = new string[](9);
        sampleLevels[0][0] = "$$$$$$$$$$$$$$$$$$$$$$$$$$$$";
        sampleLevels[0][1] = "$                        $";
        sampleLevels[0][2] = "$                        $";
        sampleLevels[0][3] = "$  ^^^^^^^^^^^^^^^^^^^^  $";
        sampleLevels[0][4] = "$                        $";
        sampleLevels[0][5] = "$  >    >    >    >    > $";
        sampleLevels[0][6] = "$  ==================== $";
        sampleLevels[0][7] = "$                       @$";
        sampleLevels[0][8] = "============================";
        
        // Level 2
        sampleLevels[1] = new string[](11);
        sampleLevels[1][0] = "                           ";
        sampleLevels[1][1] = "  $$$$$$$$$$$$$$$$$$$$$$$  ";
        sampleLevels[1][2] = "  $                   $   ";
        sampleLevels[1][3] = "  $  ^^   ^^   ^^   ^ $   ";
        sampleLevels[1][4] = "  $                   $   ";
        sampleLevels[1][5] = "  $  >    >    >    > $   ";
        sampleLevels[1][6] = "  $  =============== $   ";
        sampleLevels[1][7] = "  $                 @ $   ";
        sampleLevels[1][8] = "  =================== $   ";
        sampleLevels[1][9] = "                       $   ";
        sampleLevels[1][10] = "=======================";
        
        return createGameWithLevels(gameName, sampleLevels);
    }
    
    function getGame(uint256 gameId) external view returns (address) {
        require(games[gameId] != address(0), "Game does not exist");
        return games[gameId];
    }
    
    function getGamesByOwner(address owner) external view returns (uint256[] memory) {
        return gamesByOwner[owner];
    }
    
    function getGameCount() external view returns (uint256) {
        return gameCounter;
    }
    
    function getGameInfo(uint256 gameId) external view returns (
        uint256 _gameId,
        string memory gameName,
        address owner,
        uint256 levelsCount,
        address gameAddress
    ) {
        require(games[gameId] != address(0), "Game does not exist");
        
        Game game = Game(payable(games[gameId]));
        (_gameId, gameName, owner, levelsCount) = game.getGameInfo();
        gameAddress = games[gameId];
        
        return (_gameId, gameName, owner, levelsCount, gameAddress);
    }
    
    function getCompleteGameInfo(uint256 gameId) external view returns (
        uint256 _gameId,
        string memory gameName,
        address owner,
        uint256 levelsCount,
        address gameAddress,
        uint256 costOfPlay,
        uint256 prizePool,
        uint256 totalPlayers
    ) {
        require(games[gameId] != address(0), "Game does not exist");
        
        Game game = Game(payable(games[gameId]));
        (_gameId, gameName, owner, levelsCount, costOfPlay, prizePool, totalPlayers) = game.getCompleteGameInfo();
        gameAddress = games[gameId];
        
        return (_gameId, gameName, owner, levelsCount, gameAddress, costOfPlay, prizePool, totalPlayers);
    }
    
    function getAllGames() external view returns (address[] memory) {
        address[] memory allGames = new address[](gameCounter);
        for (uint256 i = 1; i <= gameCounter; i++) {
            allGames[i - 1] = games[i];
        }
        return allGames;
    }
    
    function verifyGame(address gameAddress) external view returns (bool) {
        return isGame[gameAddress];
    }
    
    // Game Level Access Functions
    function getGameLevelsCount(uint256 gameId) external view returns (uint256) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        return game.getLevelsCount();
    }
    
    function getGameLevel(uint256 gameId, uint256 levelIndex) external view returns (string[] memory) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        return game.getLevel(levelIndex);
    }
    
    function getGameLevelRow(uint256 gameId, uint256 levelIndex, uint256 rowIndex) external view returns (string memory) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        return game.getLevelRow(levelIndex, rowIndex);
    }
    
    function getGameLevelRowCount(uint256 gameId, uint256 levelIndex) external view returns (uint256) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        return game.getLevelRowCount(levelIndex);
    }
    
    function getAllGameLevels(uint256 gameId) external view returns (string[][] memory) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        uint256 levelsCount = game.getLevelsCount();
        
        string[][] memory allLevels = new string[][](levelsCount);
        for (uint256 i = 0; i < levelsCount; i++) {
            allLevels[i] = game.getLevel(i);
        }
        
        return allLevels;
    }
    
    function getCompleteGameData(uint256 gameId) external view returns (
        uint256 _gameId,
        string memory gameName,
        address owner,
        uint256 levelsCount,
        address gameAddress,
        string[][] memory allLevels
    ) {
        require(games[gameId] != address(0), "Game does not exist");
        
        Game game = Game(payable(games[gameId]));
        (_gameId, gameName, owner, levelsCount) = game.getGameInfo();
        gameAddress = games[gameId];
        
        // Get all levels
        allLevels = new string[][](levelsCount);
        for (uint256 i = 0; i < levelsCount; i++) {
            allLevels[i] = game.getLevel(i);
        }
        
        return (_gameId, gameName, owner, levelsCount, gameAddress, allLevels);
    }
    
    // Batch operations for multiple games
    function getMultipleGamesLevelsCount(uint256[] memory gameIds) external view returns (uint256[] memory) {
        uint256[] memory levelsCounts = new uint256[](gameIds.length);
        for (uint256 i = 0; i < gameIds.length; i++) {
            if (games[gameIds[i]] != address(0)) {
                Game game = Game(payable(games[gameIds[i]]));
                levelsCounts[i] = game.getLevelsCount();
            } else {
                levelsCounts[i] = 0; // Game doesn't exist
            }
        }
        return levelsCounts;
    }
    
    function getOwnerGamesWithLevels(address owner) external view returns (
        uint256[] memory gameIds,
        string[][] memory gameNames,
        uint256[] memory levelsCounts
    ) {
        gameIds = gamesByOwner[owner];
        gameNames = new string[][](gameIds.length);
        levelsCounts = new uint256[](gameIds.length);
        
        for (uint256 i = 0; i < gameIds.length; i++) {
            if (games[gameIds[i]] != address(0)) {
                Game game = Game(payable(games[gameIds[i]]));
                (, string memory gameName, , uint256 levelsCount) = game.getGameInfo();
                gameNames[i] = new string[](1);
                gameNames[i][0] = gameName;
                levelsCounts[i] = levelsCount;
            }
        }
        
        return (gameIds, gameNames, levelsCounts);
    }
    
    // Payment-related functions
    function getGamePaymentInfo(uint256 gameId) external view returns (
        uint256 costOfPlay,
        uint256 prizePool,
        uint256 totalPlayers,
        uint256 contractBalance
    ) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        return game.getPaymentInfo();
    }
    
    function getGamePlayerInfo(uint256 gameId, address player) external view returns (
        bool hasPlayed,
        uint256 totalPaid
    ) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        return game.getPlayerInfo(player);
    }
    
    function getGamePlayers(uint256 gameId) external view returns (address[] memory) {
        require(games[gameId] != address(0), "Game does not exist");
        Game game = Game(payable(games[gameId]));
        return game.getAllPlayers();
    }
    
    function getRevenueBreakdown(uint256 amount) external pure returns (
        uint256 poolShare,
        uint256 creatorShare,
        uint256 platformShare,
        uint256 remaining
    ) {
        poolShare = (amount * 5000) / 10000;     // 50%
        creatorShare = (amount * 2000) / 10000;  // 20%
        platformShare = (amount * 2000) / 10000; // 20%
        remaining = amount - poolShare - creatorShare - platformShare; // 10%
        
        return (poolShare, creatorShare, platformShare, remaining);
    }
    
    // Batch payment information
    function getMultipleGamesPaymentInfo(uint256[] memory gameIds) external view returns (
        uint256[] memory costOfPlayArray,
        uint256[] memory prizePoolArray,
        uint256[] memory totalPlayersArray
    ) {
        costOfPlayArray = new uint256[](gameIds.length);
        prizePoolArray = new uint256[](gameIds.length);
        totalPlayersArray = new uint256[](gameIds.length);
        
        for (uint256 i = 0; i < gameIds.length; i++) {
            if (games[gameIds[i]] != address(0)) {
                Game game = Game(payable(games[gameIds[i]]));
                (costOfPlayArray[i], prizePoolArray[i], totalPlayersArray[i], ) = game.getPaymentInfo();
            }
        }
        
        return (costOfPlayArray, prizePoolArray, totalPlayersArray);
    }
    
    function getTotalPlatformStats() external view returns (
        uint256 totalGames,
        uint256 totalActivePlayers,
        uint256 totalPrizePools
    ) {
        totalGames = gameCounter;
        totalActivePlayers = 0;
        totalPrizePools = 0;
        
        for (uint256 i = 1; i <= gameCounter; i++) {
            if (games[i] != address(0)) {
                Game game = Game(payable(games[i]));
                (, uint256 prizePool, uint256 players, ) = game.getPaymentInfo();
                totalActivePlayers += players;
                totalPrizePools += prizePool;
            }
        }
        
        return (totalGames, totalActivePlayers, totalPrizePools);
    }
} 