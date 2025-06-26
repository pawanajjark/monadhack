"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Gamepad2, Trophy, Coins, Users, Timer, Play, Crown, Wallet, RefreshCw } from "lucide-react"
import { getWalletInformation, checkWalletConnection, disconnectWallet } from "@/lib/wallet"
import { getAllGamesWithInfo, SmartContractGame, formatAddress, getDifficulty, getDifficultyColor } from "@/lib/smartContract"

interface WalletInfo {
  address: string;
  network: string;
  chainId: string;
  balance: string;
}

export default function PlayPage() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [smartContractGames, setSmartContractGames] = useState<SmartContractGame[]>([])
  const [isLoadingGames, setIsLoadingGames] = useState(false)
  const [gamesError, setGamesError] = useState<string | null>(null)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connection = await checkWalletConnection()
        if (connection) {
          setWalletInfo(connection)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
    
    checkConnection()
  }, [])

  // Load smart contract games when wallet is connected
  useEffect(() => {
    if (walletInfo) {
      loadSmartContractGames()
    }
  }, [walletInfo])

  const loadSmartContractGames = async () => {
    setIsLoadingGames(true)
    setGamesError(null)
    
    try {
      const games = await getAllGamesWithInfo()
      setSmartContractGames(games)
    } catch (error: any) {
      setGamesError(error.message || "Failed to load games from smart contract")
      console.error("Error loading smart contract games:", error)
    } finally {
      setIsLoadingGames(false)
    }
  }

  const handleWalletConnect = async () => {
    if (walletInfo) {
      // Disconnect wallet
      disconnectWallet()
      setWalletInfo(null)
      setError(null)
      setSmartContractGames([])
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const connection = await getWalletInformation()
      setWalletInfo(connection)
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const formatAddressDisplay = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const featuredGames = [
    {
      id: 1,
      title: "Neon Runner",
      creator: "GameDev123",
      prize: "500 GAME",
      players: 1247,
      difficulty: "Easy",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Crystal Caves",
      creator: "PixelMaster",
      prize: "1,200 GAME",
      players: 892,
      difficulty: "Medium",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Sky Jumper",
      creator: "CloudNine",
      prize: "800 GAME",
      players: 2156,
      difficulty: "Hard",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Pixel Adventure",
      creator: "RetroGamer",
      prize: "650 GAME",
      players: 1543,
      difficulty: "Medium",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "Space Hopper",
      creator: "CosmicDev",
      prize: "900 GAME",
      players: 987,
      difficulty: "Hard",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Forest Quest",
      creator: "NatureGames",
      prize: "400 GAME",
      players: 2341,
      difficulty: "Easy",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 7,
      title: "Sky Temple",
      creator: "ChainJump Team",
      prize: "3 Levels",
      players: 756,
      difficulty: "Medium",
      image: "/placeholder.svg?height=200&width=300",
      gameKey: "0x003"
    },
    {
      id: 8,
      title: "Underground Maze",
      creator: "ChainJump Team", 
      prize: "5 Levels",
      players: 432,
      difficulty: "Hard",
      image: "/placeholder.svg?height=200&width=300",
      gameKey: "0x004"
    },
    {
      id: 9,
      title: "Speed Run Arena",
      creator: "ChainJump Team",
      prize: "3 Levels", 
      players: 1089,
      difficulty: "Hard",
      image: "/placeholder.svg?height=200&width=300",
      gameKey: "0x005"
    },
    {
      id: 10,
      title: "Mystic Chambers",
      creator: "ChainJump Team",
      prize: "4 Levels",
      players: 623,
      difficulty: "Medium",
      image: "/placeholder.svg?height=200&width=300", 
      gameKey: "0x006"
    },
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">ChainJump</span>
          </Link>
          <div className="flex items-center space-x-4">
            {walletInfo && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <Coins className="h-5 w-5" />
                <span className="font-semibold">{walletInfo.balance} MONAD</span>
              </div>
            )}
            <Button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              variant={walletInfo ? "secondary" : "default"}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting 
                ? "Connecting..." 
                : walletInfo 
                  ? formatAddressDisplay(walletInfo.address)
                  : "Connect Wallet"
              }
            </Button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 mx-4 mt-4 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Back Button */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Link href="/">
            <Button
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white mb-6"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>
      </section>

      {/* Games Gallery */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Available <span className="text-purple-400">Games</span>
          </h2>
          
          <Tabs defaultValue="games" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/30 border border-purple-800/30 mb-8">
              <TabsTrigger value="games" className="data-[state=active]:bg-purple-600">
                Featured Games
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="data-[state=active]:bg-purple-600">
                Blockchain Games
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Game 0x001 */}
                <Card className="bg-black/40 border-purple-800/30 hover:border-purple-600/50 transition-all">
                  <CardHeader className="pb-3">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Game 0x001"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">Game 0x001</CardTitle>
                        <CardDescription className="text-gray-400">by ChainJump Team</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                        Easy
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <Trophy className="h-4 w-4" />
                        <span className="font-semibold">4 Levels</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>1,234</span>
                      </div>
                    </div>
                    <Button 
                      asChild
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!walletInfo}
                    >
                      <Link href="/game/0x001">
                        <Play className="h-4 w-4 mr-2" />
                        {walletInfo ? "Play Now" : "Connect Wallet to Play"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Game 0x002 */}
                <Card className="bg-black/40 border-purple-800/30 hover:border-purple-600/50 transition-all">
                  <CardHeader className="pb-3">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Game 0x002"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">Game 0x002</CardTitle>
                        <CardDescription className="text-gray-400">by ChainJump Team</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300">
                        Medium
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <Trophy className="h-4 w-4" />
                        <span className="font-semibold">2 Levels</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>892</span>
                      </div>
                    </div>
                    <Button 
                      asChild
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!walletInfo}
                    >
                      <Link href="/game/0x002">
                        <Play className="h-4 w-4 mr-2" />
                        {walletInfo ? "Play Now" : "Connect Wallet to Play"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Game 0xABC */}
                <Card className="bg-black/40 border-purple-800/30 hover:border-purple-600/50 transition-all">
                  <CardHeader className="pb-3">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Game 0xABC"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">Game 0xABC</CardTitle>
                        <CardDescription className="text-gray-400">by ChainJump Team</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-red-600/20 text-red-300">
                        Hard
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <Trophy className="h-4 w-4" />
                        <span className="font-semibold">1 Level</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>567</span>
                      </div>
                    </div>
                    <Button 
                      asChild
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!walletInfo}
                    >
                      <Link href="/game/0xABC">
                        <Play className="h-4 w-4 mr-2" />
                        {walletInfo ? "Play Now" : "Connect Wallet to Play"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Featured Games */}
                {featuredGames.map((game) => (
                  <Card
                    key={game.id}
                    className="bg-black/40 border-purple-800/30 hover:border-purple-600/50 transition-all"
                  >
                    <CardHeader className="pb-3">
                      <img
                        src={game.image || "/placeholder.svg"}
                        alt={game.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{game.title}</CardTitle>
                          <CardDescription className="text-gray-400">by {game.creator}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                          {game.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <Trophy className="h-4 w-4" />
                          <span className="font-semibold">{game.prize}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{game.players}</span>
                        </div>
                      </div>
                      {game.gameKey ? (
                        <Button 
                          asChild
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          disabled={!walletInfo}
                        >
                          <Link href={`/game/${game.gameKey}`}>
                            <Play className="h-4 w-4 mr-2" />
                            {walletInfo ? "Play Now" : "Connect Wallet to Play"}
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          disabled={!walletInfo}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {walletInfo ? "Play Now" : "Connect Wallet to Play"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="blockchain" className="mt-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Smart Contract Games</h3>
                  <p className="text-gray-400">Games deployed on the blockchain with real rewards</p>
                </div>
                <Button
                  onClick={loadSmartContractGames}
                  disabled={!walletInfo || isLoadingGames}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingGames ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {!walletInfo && (
                <Card className="bg-black/40 border-purple-800/30 mb-6">
                  <CardContent className="p-6 text-center">
                    <Wallet className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-400 mb-4">
                      Connect your wallet to view and play blockchain games with real rewards
                    </p>
                    <Button
                      onClick={handleWalletConnect}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Connect Wallet
                    </Button>
                  </CardContent>
                </Card>
              )}

              {gamesError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 mb-6 rounded-lg">
                  <p className="text-sm">{gamesError}</p>
                </div>
              )}

              {isLoadingGames && (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading games from blockchain...</p>
                </div>
              )}

              {walletInfo && !isLoadingGames && smartContractGames.length === 0 && !gamesError && (
                <Card className="bg-black/40 border-purple-800/30">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
                    <p className="text-gray-400">
                      No games are currently deployed on the smart contract
                    </p>
                  </CardContent>
                </Card>
              )}

              {smartContractGames.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {smartContractGames.map((game) => {
                    const difficulty = getDifficulty(game.levelsCount)
                    const difficultyColor = getDifficultyColor(difficulty)
                    
                    return (
                      <Card
                        key={game.gameId}
                        className="bg-black/40 border-purple-800/30 hover:border-purple-600/50 transition-all"
                      >
                        <CardHeader className="pb-3">
                          <img
                            src="/game.png"
                            alt={game.gameName}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white">{game.gameName}</CardTitle>
                              <CardDescription className="text-gray-400">
                                by {formatAddress(game.owner)}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className={difficultyColor}>
                              {difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2 text-yellow-400">
                                <Trophy className="h-4 w-4" />
                                <span className="font-semibold">{game.prizePool} MONAD</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Users className="h-4 w-4" />
                                <span>{game.totalPlayers}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-400">
                                Cost: {game.costOfPlay} MONAD
                              </div>
                              <div className="text-sm text-gray-400">
                                {game.levelsCount} Level{game.levelsCount !== 1 ? 's' : ''}
                              </div>
                            </div>
                            
                            {/* Level Information */}
                            {game.levels && game.levels.length > 0 && (
                              <div className="mt-3 p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
                                <h4 className="text-sm font-semibold text-purple-300 mb-2">Game Levels:</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {game.levels.map((level) => (
                                    <div key={level.levelIndex} className="text-xs">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-purple-200 font-medium">
                                          Level {level.levelIndex + 1}
                                        </span>
                                        <span className="text-gray-400">
                                          {level.levelData.length} elements
                                        </span>
                                      </div>
                                      <div className="text-gray-500 truncate">
                                        {level.levelData.length > 0 ? (
                                          <span>
                                            {level.levelData.slice(0, 3).join(', ')}
                                            {level.levelData.length > 3 && '...'}
                                          </span>
                                        ) : (
                                          <span>No data</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-500">
                              Game ID: {game.gameId} • {formatAddress(game.gameAddress)}
                            </div>
                          </div>
                          <Button 
                            asChild
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            disabled={!walletInfo}
                          >
                            <Link href={`/blockchain-game/${game.gameAddress}`}>
                              <Play className="h-4 w-4 mr-2" />
                              {walletInfo ? "Play Now" : "Connect Wallet to Play"}
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-800/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Gamepad2 className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">ChainJump</span>
              </div>
              <p className="text-gray-400">
                The future of hyper-casual gaming on blockchain. Create, play, and win together.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Game Creator
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Reddit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Bug Reports
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-800/30 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ChainJump. All rights reserved. Built on blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 