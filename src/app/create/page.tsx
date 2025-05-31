"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Gamepad2, Coins, Zap, Timer, Star, Plus, Target, Wallet, Upload, Save, Eye } from "lucide-react"
import { getWalletInformation, checkWalletConnection, disconnectWallet } from "@/lib/wallet"

interface WalletInfo {
  address: string;
  network: string;
  chainId: string;
  balance: string;
}

export default function CreatePage() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gameName, setGameName] = useState("")
  const [gameDescription, setGameDescription] = useState("")

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

      {/* Game Creator */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Game <span className="text-purple-400">Creator</span>
          </h2>
          
          {!walletInfo && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-3 mb-8 rounded-lg text-center">
              <p className="text-sm">Connect your wallet to start creating games on the blockchain</p>
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Game Details */}
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-green-400" />
                  Game Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set up your game's basic information and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gameName" className="text-white">Game Name</Label>
                  <Input
                    id="gameName"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Enter your game name"
                    className="bg-black/20 border-purple-800/30 text-white placeholder:text-gray-400"
                    disabled={!walletInfo}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gameDescription" className="text-white">Description</Label>
                  <Textarea
                    id="gameDescription"
                    value={gameDescription}
                    onChange={(e) => setGameDescription(e.target.value)}
                    placeholder="Describe your game..."
                    className="bg-black/20 border-purple-800/30 text-white placeholder:text-gray-400 min-h-[100px]"
                    disabled={!walletInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Game Thumbnail</Label>
                  <div className="border-2 border-dashed border-purple-800/30 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Upload game thumbnail</p>
                    <Button 
                      variant="outline" 
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                      disabled={!walletInfo}
                    >
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!walletInfo}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    disabled={!walletInfo}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Creator */}
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Background Themes</span>
                    <span className="text-purple-400">25+ Themes</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!walletInfo}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {walletInfo ? "Open Level Editor" : "Connect Wallet to Create"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Game Mechanics */}
          <div className="mt-8">
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-red-400" />
                  Game Mechanics
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose from various game modes and mechanics for your platformer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Badge 
                    variant="outline" 
                    className={`border-purple-400 text-purple-300 justify-center py-3 transition-colors ${
                      walletInfo 
                        ? "cursor-pointer hover:bg-purple-400 hover:text-white" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    Time Attack
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`border-yellow-400 text-yellow-300 justify-center py-3 transition-colors ${
                      walletInfo 
                        ? "cursor-pointer hover:bg-yellow-400 hover:text-black" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Coin Rush
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`border-green-400 text-green-300 justify-center py-3 transition-colors ${
                      walletInfo 
                        ? "cursor-pointer hover:bg-green-400 hover:text-black" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Star Collect
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`border-red-400 text-red-300 justify-center py-3 transition-colors ${
                      walletInfo 
                        ? "cursor-pointer hover:bg-red-400 hover:text-white" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Speed Run
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Difficulty Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20 border border-purple-800/30">
                        <span className="text-white">Easy</span>
                        <Badge className="bg-green-600">Recommended</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20 border border-purple-800/30">
                        <span className="text-white">Medium</span>
                        <Badge variant="outline" className="border-yellow-400 text-yellow-300">Popular</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20 border border-purple-800/30">
                        <span className="text-white">Hard</span>
                        <Badge variant="outline" className="border-red-400 text-red-300">Challenge</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Prize Pool Settings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Entry Fee</span>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          className="w-20 h-8 bg-black/20 border-purple-800/30 text-white text-right"
                          disabled={!walletInfo}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Creator Share</span>
                        <span className="text-purple-400">10%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Winner Prize</span>
                        <span className="text-yellow-400">80%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Platform Fee</span>
                        <span className="text-gray-400">10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={!walletInfo}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {walletInfo ? "Create Game" : "Connect Wallet to Create"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    disabled={!walletInfo}
                  >
                    View Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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