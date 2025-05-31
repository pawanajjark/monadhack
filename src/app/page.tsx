"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Gamepad2, Coins, Play, Plus, Wallet, Crown, Timer, Target, Star, Zap } from "lucide-react"
import { getWalletInformation, checkWalletConnection, disconnectWallet } from "@/lib/wallet"

interface WalletInfo {
  address: string;
  network: string;
  chainId: string;
  balance: string;
}

export default function GamingPlatform() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const featuredGames = [
    {
      id: 1,
      title: "Kaboom Platformer",
      creator: "MonadHack Team",
      prize: "1000 MONAD",
      players: 1,
      difficulty: "Medium",
      image: "/game-preview.jpg",
      icon: "🎮",
      description: "A classic platformer game with multiple levels, enemies, and power-ups built with Kaboom.js",
      tags: ["Platformer", "Action", "Retro"]
    },
    {
      id: 2,
      title: "Space Adventure",
      creator: "Indie Dev",
      prize: "500 MONAD",
      players: 1,
      difficulty: "Hard",
      image: "/space-game.jpg",
      icon: "🚀",
      description: "Explore the cosmos in this thrilling space adventure game",
      tags: ["Space", "Adventure", "Sci-Fi"]
    },
    {
      id: 3,
      title: "Sky Jumper",
      creator: "CloudNine",
      prize: "800 GAME",
      players: 2156,
      difficulty: "Hard",
      image: "/placeholder.svg?height=200&width=300",
      icon: "☁️",
      description: "Jump through the clouds in this exciting platformer",
      tags: ["Platformer", "Casual"]
    },
  ]

  const leaderboard = [
    { rank: 1, player: "CryptoGamer", score: 125000, tokens: "2,500 GAME" },
    { rank: 2, player: "BlockchainBeast", score: 118000, tokens: "1,800 GAME" },
    { rank: 3, player: "DefiDaredevil", score: 112000, tokens: "1,200 GAME" },
    { rank: 4, player: "NFTNinja", score: 108000, tokens: "800 GAME" },
    { rank: 5, player: "MetaverseMaster", score: 105000, tokens: "500 GAME" },
  ]

  const handleWalletConnect = async () => {
    if (walletInfo) {
      // Disconnect wallet
      disconnectWallet()
      setWalletInfo(null)
      setError(null)
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

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
                  ? formatAddress(walletInfo.address)
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Create. Play. <span className="text-purple-400">Win.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Build hyper-casual platformer games on-chain and compete for real prizes. Fair, transparent, and
            decentralized gaming for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/play">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4"
                disabled={!walletInfo}
              >
                <Play className="h-5 w-5 mr-2" />
                Join
              </Button>
            </Link>
            <Link href="/create">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-4"
                disabled={!walletInfo}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create
              </Button>
            </Link>
          </div>
          {!walletInfo && (
            <p className="text-gray-400 text-sm mt-4">
              Connect your wallet to start playing and creating games
            </p>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">12,547</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">₿ 45.2</div>
              <div className="text-gray-400">Total Prizes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">1,892</div>
              <div className="text-gray-400">Games Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">98.7%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="games" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/30 border border-purple-800/30">
              <TabsTrigger value="games" className="data-[state=active]:bg-purple-600">
                Featured Games
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
                Game Creator
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="tournaments" className="data-[state=active]:bg-purple-600">
                Tournaments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">🎮 Play Games</h3>
                  <p className="text-gray-600 mb-4">
                    Choose a game to play by selecting a game key:
                  </p>
                  <div className="space-y-2">
                    <a 
                      href="/game/0x001" 
                      className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors text-center"
                    >
                      Game 0x001 (4 Levels)
                    </a>
                    <a 
                      href="/game/0x002" 
                      className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors text-center"
                    >
                      Game 0x002 (2 Levels)
                    </a>
                    <a 
                      href="/game/0xABC" 
                      className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors text-center"
                    >
                      Game 0xABC (1 Level)
                    </a>
                  </div>
                </div>
                {featuredGames.map((game) => (
                  <Card
                    key={game.title}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{game.icon}</span>
                        <CardTitle className="text-lg">{game.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{game.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {game.tags?.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button className="w-full group-hover:bg-blue-600 transition-colors">
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-black/40 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                      Quick Creator
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Build a platformer game in minutes with our drag-and-drop editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Level Design</span>
                        <span className="text-purple-400">Drag & Drop</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Character Customization</span>
                        <span className="text-purple-400">50+ Options</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Obstacle Library</span>
                        <span className="text-purple-400">100+ Items</span>
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Creating
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="h-5 w-5 mr-2 text-red-400" />
                      Game Mechanics
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Choose from various game modes and mechanics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="border-purple-400 text-purple-300 justify-center py-2">
                        <Timer className="h-3 w-3 mr-1" />
                        Time Attack
                      </Badge>
                      <Badge variant="outline" className="border-yellow-400 text-yellow-300 justify-center py-2">
                        <Coins className="h-3 w-3 mr-1" />
                        Coin Rush
                      </Badge>
                      <Badge variant="outline" className="border-green-400 text-green-300 justify-center py-2">
                        <Star className="h-3 w-3 mr-1" />
                        Star Collect
                      </Badge>
                      <Badge variant="outline" className="border-red-400 text-red-300 justify-center py-2">
                        <Zap className="h-3 w-3 mr-1" />
                        Speed Run
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    >
                      View All Mechanics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-8">
              <Card className="bg-black/40 border-purple-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                    Global Leaderboard
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Top players competing for the ultimate prize pool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((player) => (
                      <div
                        key={player.rank}
                        className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20 border border-purple-800/30"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              player.rank === 1
                                ? "bg-yellow-500 text-black"
                                : player.rank === 2
                                  ? "bg-gray-400 text-black"
                                  : player.rank === 3
                                    ? "bg-amber-600 text-black"
                                    : "bg-purple-600 text-white"
                            }`}
                          >
                            {player.rank}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{player.player}</div>
                            <div className="text-sm text-gray-400">Score: {player.score.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <Coins className="h-4 w-4" />
                          <span className="font-semibold">{player.tokens}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tournaments" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-white">Weekly Championship</CardTitle>
                    <CardDescription className="text-gray-400">
                      Compete for the biggest prize pool of the week
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool</span>
                      <span className="text-yellow-400 font-semibold">5,000 GAME</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Fee</span>
                      <span className="text-white">50 GAME</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Players</span>
                      <span className="text-white">847/1000</span>
                    </div>
                    <Progress value={84.7} className="h-2" />
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Join Tournament</Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-800/30">
                  <CardHeader>
                    <CardTitle className="text-white">Speed Run Challenge</CardTitle>
                    <CardDescription className="text-gray-400">
                      Beat the clock in this fast-paced tournament
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool</span>
                      <span className="text-yellow-400 font-semibold">2,500 GAME</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Fee</span>
                      <span className="text-white">25 GAME</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Limit</span>
                      <span className="text-white">2 hours</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-400">
                      <Timer className="h-4 w-4" />
                      <span>Starts in 1h 23m</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    >
                      Set Reminder
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Tournaments
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Leaderboard
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
