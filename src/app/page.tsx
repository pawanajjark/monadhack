"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Gamepad2, Trophy, Coins, Users, Zap, Timer, Star, Play, Plus, Crown, Target, Wallet } from "lucide-react"

export default function GamingPlatform() {
  const [connectedWallet, setConnectedWallet] = useState(false)

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
  ]

  const leaderboard = [
    { rank: 1, player: "SpeedDemon", score: 15420, tokens: 2500 },
    { rank: 2, player: "JumpMaster", score: 14890, tokens: 2000 },
    { rank: 3, player: "CoinHunter", score: 14230, tokens: 1500 },
    { rank: 4, player: "PlatformPro", score: 13980, tokens: 1000 },
    { rank: 5, player: "GameChamp", score: 13750, tokens: 800 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">ChainJump</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#games" className="text-gray-300 hover:text-purple-400 transition-colors">
              Games
            </a>
            <a href="#create" className="text-gray-300 hover:text-purple-400 transition-colors">
              Create
            </a>
            <a href="#leaderboard" className="text-gray-300 hover:text-purple-400 transition-colors">
              Leaderboard
            </a>
            <a href="#tournaments" className="text-gray-300 hover:text-purple-400 transition-colors">
              Tournaments
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Coins className="h-5 w-5" />
              <span className="font-semibold">1,250 GAME</span>
            </div>
            <Button
              onClick={() => setConnectedWallet(!connectedWallet)}
              variant={connectedWallet ? "secondary" : "default"}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {connectedWallet ? "Connected" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </header>

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
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
              <Play className="h-5 w-5 mr-2" />
              Start Playing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-4"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Game
            </Button>
          </div>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Play className="h-4 w-4 mr-2" />
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
