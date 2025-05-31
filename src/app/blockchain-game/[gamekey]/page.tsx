'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Maximize, Volume2, VolumeX, RotateCcw, Trophy, Coins, Target, Gamepad2, Wallet } from 'lucide-react'
import { getGameByIdOrAddress, SmartContractGame } from '@/lib/smartContract'
import { checkWalletConnection, sendPayment, getWalletInformation, disconnectWallet } from '@/lib/wallet'

interface WalletInfo {
  address: string;
  network: string;
  chainId: string;
  balance: string;
}

export default function BlockchainGamePage() {
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const gameInitialized = useRef(false)
  const params = useParams()
  const router = useRouter()
  const gameKey = params.gamekey as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [smartContractGame, setSmartContractGame] = useState<SmartContractGame | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  
  // Add wallet state management
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)

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
      setWalletError(null)
      return
    }

    setIsConnecting(true)
    setWalletError(null)

    try {
      const connection = await getWalletInformation()
      setWalletInfo(connection)
    } catch (error: any) {
      setWalletError(error.message || "Failed to connect wallet")
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Convert smart contract game to game info format
  const getGameInfo = (scGame: SmartContractGame) => {
    const getDifficulty = (levelsCount: number): string => {
      if (levelsCount <= 2) return 'Easy';
      if (levelsCount <= 4) return 'Medium';
      return 'Hard';
    }

    const getThemeFromLevels = (levelsCount: number): string => {
      const themes = ['Forest', 'Industrial', 'Sky', 'Cave', 'Neon', 'Ancient', 'Volcanic'];
      return themes[levelsCount % themes.length] || 'Forest';
    }

    const getColorFromDifficulty = (difficulty: string): string => {
      switch (difficulty) {
        case 'Easy': return 'from-green-600 to-emerald-700';
        case 'Medium': return 'from-blue-600 to-cyan-700';
        case 'Hard': return 'from-red-600 to-orange-700';
        default: return 'from-purple-600 to-indigo-700';
      }
    }

    const difficulty = getDifficulty(scGame.levelsCount);
    
    return {
      title: scGame.gameName || `Game ${scGame.gameId}`,
      description: `Blockchain game with ${scGame.levelsCount} levels. Prize pool: ${scGame.prizePool} MONAD. Cost: ${scGame.costOfPlay} MONAD.`,
      difficulty,
      levels: scGame.levelsCount,
      theme: getThemeFromLevels(scGame.levelsCount),
      color: getColorFromDifficulty(difficulty)
    };
  }

  // Load smart contract game data
  const loadSmartContractGame = async (gameIdentifier: string) => {
    try {
      setIsLoading(true)
      setLoadingError(null)
      
      // Check wallet connection
      const walletConnection = await checkWalletConnection()
      if (!walletConnection) {
        throw new Error('Wallet not connected. Please connect your wallet to play blockchain games.')
      }

      console.log(`Loading blockchain game with identifier: ${gameIdentifier}`);
      const scGame = await getGameByIdOrAddress(gameIdentifier);
      
      setSmartContractGame(scGame);
      console.log('Blockchain game loaded:', scGame);
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Error loading blockchain game:', error);
      setLoadingError(error.message || 'Failed to load blockchain game');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (gameKey) {
      loadSmartContractGame(gameKey);
    }
  }, [gameKey])

  // Handle payment for the game
  const handlePayment = async () => {
    if (!smartContractGame) {
      setPaymentError('Game data not loaded');
      return;
    }

    setPaymentStatus('processing');
    setPaymentError(null);

    try {
      // Send payment to the game creator (owner) instead of contract address
      const paymentResult = await sendPayment(
        smartContractGame.owner,
        smartContractGame.costOfPlay
      );

      if (paymentResult.success) {
        setPaymentStatus('completed');
        setGameStarted(true);
        console.log('Payment successful:', paymentResult.transactionHash);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setPaymentError(error.message || 'Payment failed. Please try again.');
    }
  };

  // Separate effect to reinitialize game when smart contract data is loaded
  useEffect(() => {
    if (smartContractGame && gameInitialized.current) {
      // Reset and reinitialize the game with new data
      gameInitialized.current = false;
    }
  }, [smartContractGame])

  // Game initialization - only start after payment is completed
  useEffect(() => {
    if (gameInitialized.current || !gameContainerRef.current || !gameKey || !smartContractGame || !gameStarted) return
    gameInitialized.current = true

    // Dynamically import kaboom to avoid SSR issues
    import('kaboom').then(({ default: kaboom }) => {
      // Start kaboom
      const k = kaboom({
        canvas: gameContainerRef.current?.querySelector('canvas') || undefined,
        width: 1000,
        height: 600,
        background: [20, 20, 30],
        crisp: true,
      })

      // Load assets
      k.loadSprite("bean", "/sprites/bean.png")
      k.loadSprite("bag", "/sprites/bag.png")
      k.loadSprite("ghosty", "/sprites/ghosty.png")
      k.loadSprite("spike", "/sprites/spike.png")
      k.loadSprite("grass", "/sprites/grass.png")
      k.loadSprite("steel", "/sprites/steel.png")
      k.loadSprite("prize", "/sprites/jumpy.png")
      k.loadSprite("apple", "/sprites/apple.png")
      k.loadSprite("portal", "/sprites/portal.png")
      k.loadSprite("coin", "/sprites/coin.png")
      k.loadSound("coin", "/examples/sounds/score.mp3")
      k.loadSound("powerup", "/examples/sounds/powerup.mp3")
      k.loadSound("blip", "/examples/sounds/blip.mp3")
      k.loadSound("hit", "/examples/sounds/hit.mp3")
      k.loadSound("portal", "/examples/sounds/portal.mp3")

      k.setGravity(3200)

      // Custom component controlling enemy patrol movement
      function patrol(speed = 60, dir = 1) {
        return {
          id: "patrol",
          require: ["pos", "area"],
          add(this: any) {
            this.on("collide", (obj: any, col: any) => {
              if (col.isLeft() || col.isRight()) {
                dir = -dir
              }
            })
          },
          update(this: any) {
            this.move(speed * dir, 0)
          },
        }
      }

      // Custom component that makes stuff grow big
      function big() {
        let timer = 0
        let isBig = false
        let destScale = 1
        return {
          id: "big",
          require: ["scale"],
          update(this: any) {
            if (isBig) {
              timer -= k.dt()
              if (timer <= 0) {
                this.smallify()
              }
            }
            this.scale = this.scale.lerp(k.vec2(destScale), k.dt() * 6)
          },
          isBig() {
            return isBig
          },
          smallify() {
            destScale = 1
            timer = 0
            isBig = false
          },
          biggify(time: number) {
            destScale = 2
            timer = time
            isBig = true
          },
        }
      }

      // Define some constants
      const JUMP_FORCE = 1320
      const MOVE_SPEED = 480
      const FALL_DEATH = 2400

      // Load levels from smart contract data
      let LEVELS: string[][] = []
      let LEVELS_COUNT = 0

      // Process smart contract level data
      console.log('Processing blockchain game levels...');
      console.log('Smart contract game data:', smartContractGame);
      console.log('Smart contract levels:', smartContractGame.levels);
      
      LEVELS = smartContractGame.levels.map((level, index) => {
        console.log(`Processing level ${index}:`, level);
        console.log(`Level data:`, level.levelData);
        
        // Ensure levelData is a proper array of strings
        const levelArray: string[] = Array.isArray(level.levelData) 
          ? level.levelData.map(item => String(item))
          : Array.from(level.levelData).map(item => String(item));
        
        console.log(`Converted level ${index} to array:`, levelArray);
        return levelArray;
      });
      
      LEVELS_COUNT = smartContractGame.levelsCount;
      console.log(`Final LEVELS array:`, LEVELS);
      console.log(`Loaded ${LEVELS_COUNT} levels from blockchain for game: ${smartContractGame.gameName}`);

      // Define what each symbol means in the level graph
      const levelConf = {
        tileWidth: 64,
        tileHeight: 64,
        tiles: {
          "=": () => [
            k.sprite("grass"),
            k.area(),
            k.body({ isStatic: true }),
            k.anchor("bot"),
            k.offscreen({ hide: true }),
            "platform",
          ],
          "-": () => [
            k.sprite("steel"),
            k.area(),
            k.body({ isStatic: true }),
            k.offscreen({ hide: true }),
            k.anchor("bot"),
          ],
          "0": () => [
            // Empty space - no sprite, no collision
            k.pos(0, 0),
            k.opacity(0),
            "empty",
          ],
          "$": () => [
            k.sprite("coin"),
            k.area(),
            k.pos(0, -9),
            k.anchor("bot"),
            k.offscreen({ hide: true }),
            "coin",
          ],
          "%": () => [
            k.sprite("prize"),
            k.area(),
            k.body({ isStatic: true }),
            k.anchor("bot"),
            k.offscreen({ hide: true }),
            "prize",
          ],
          "^": () => [
            k.sprite("spike"),
            k.area(),
            k.body({ isStatic: true }),
            k.anchor("bot"),
            k.offscreen({ hide: true }),
            "danger",
          ],
          "#": () => [
            k.sprite("apple"),
            k.area(),
            k.anchor("bot"),
            k.body(),
            k.offscreen({ hide: true }),
            "apple",
          ],
          ">": () => [
            k.sprite("ghosty"),
            k.area(),
            k.anchor("bot"),
            k.body(),
            patrol(),
            k.offscreen({ hide: true }),
            "enemy",
          ],
          "@": () => [
            k.sprite("portal"),
            k.area({ scale: 0.5 }),
            k.anchor("bot"),
            k.pos(0, -12),
            k.offscreen({ hide: true }),
            "portal",
          ],
          " ": () => [
            // Space character - also empty
            k.pos(0, 0),
            k.opacity(0),
            "empty",
          ],
        },
      }

      k.scene("game", ({ levelId, coins }: { levelId?: number; coins?: number } = { levelId: 0, coins: 0 }) => {
        // Add level to scene
        const level = k.addLevel(LEVELS[levelId ?? 0], levelConf)

        // Define player object
        const player = k.add([
          k.sprite("bean"),
          k.pos(0, 0),
          k.area(),
          k.scale(1),
          k.body(),
          k.anchor("bot"),
          big(),
        ])

        player.onUpdate(() => {
          k.camPos(player.pos)
          if (player.pos.y >= FALL_DEATH) {
            k.go("lose")
          }
        })

        player.onBeforePhysicsResolve((collision: any) => {
          if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
            collision.preventResolution()
          }
        })

        player.onPhysicsResolve(() => {
          k.camPos(player.pos)
        })

        player.onCollide("enemy", (enemy: any, col: any) => {
          if (col.isBottom()) {
            player.jump(JUMP_FORCE * 1.5)
            k.destroy(enemy)
            k.addKaboom(player.pos)
            k.play("powerup")
          } else {
            k.go("lose")
            k.play("hit")
          }
        })

        let hasApple = false

        player.onCollide("prize", (obj: any, col: any) => {
          if (col.isTop() && !hasApple) {
            const apple = level.spawn("#", obj.tilePos.sub(0, 1))
            apple.jump()
            hasApple = true
            k.play("blip")
          }
        })

        player.onCollide("apple", (a: any) => {
          k.destroy(a)
          player.biggify(3)
          hasApple = false
          k.play("powerup")
        })

        let coinPitch = 0

        k.onUpdate(() => {
          if (coinPitch > 0) {
            coinPitch = Math.max(0, coinPitch - k.dt() * 100)
          }
        })

        player.onCollide("coin", (c: any) => {
          k.destroy(c)
          k.play("coin", {
            detune: coinPitch,
          })
          coinPitch += 100
          coins = (coins ?? 0) + 1
          coinsLabel.text = coins.toString()
        })

        // Enhanced UI elements
        const coinsLabel = k.add([
          k.text((coins ?? 0).toString(), {
            size: 24,
            font: "monospace",
          }),
          k.pos(80, 32),
          k.fixed(),
          k.color(255, 215, 0),
        ])

        k.add([
          k.sprite("coin"),
          k.pos(40, 32),
          k.fixed(),
          k.scale(0.8),
        ])

        k.add([
          k.text(`Level ${(levelId ?? 0) + 1}/${LEVELS_COUNT}`, {
            size: 20,
            font: "monospace",
          }),
          k.pos(40, 70),
          k.fixed(),
          k.color(255, 255, 255),
        ])

        k.add([
          k.text(`${smartContractGame?.gameName || gameKey}`, {
            size: 16,
            font: "monospace",
          }),
          k.pos(40, 100),
          k.fixed(),
          k.color(150, 150, 255),
        ])

        function jump() {
          if (player.isGrounded()) {
            player.jump(JUMP_FORCE)
          }
        }

        k.onKeyPress("space", jump)
        k.onKeyDown("left", () => {
          player.move(-MOVE_SPEED, 0)
        })
        k.onKeyDown("right", () => {
          player.move(MOVE_SPEED, 0)
        })
        k.onKeyPress("down", () => {
          (player as any).weight = 3
        })
        k.onKeyRelease("down", () => {
          (player as any).weight = 1
        })

        k.onGamepadButtonPress("south", jump)
        k.onGamepadStick("left", (v: any) => {
          player.move(v.x * MOVE_SPEED, 0)
        })

        k.onKeyPress("f", () => {
          k.setFullscreen(!k.isFullscreen())
          setIsFullscreen(!isFullscreen)
        })

        player.onCollide("portal", () => {
          k.play("portal")
          if ((levelId ?? 0) + 1 < LEVELS_COUNT) {
            k.go("game", {
              levelId: (levelId ?? 0) + 1,
              coins: coins ?? 0,
            })
          } else {
            k.go("win")
          }
        })

        player.onCollide("danger", () => {
          k.go("lose")
          k.play("hit")
        })
      })

      k.scene("loading", () => {
        k.add([
          k.text(`Loading ${smartContractGame?.gameName || 'Blockchain Game'}...`, {
            size: 32,
            font: "monospace",
          }),
          k.pos(k.center()),
          k.anchor("center"),
          k.color(255, 255, 255),
        ])
      })

      k.scene("lose", () => {
        k.add([
          k.rect(k.width(), k.height()),
          k.color(0, 0, 0),
          k.opacity(0.7),
        ])
        k.add([
          k.text("Game Over", {
            size: 48,
            font: "monospace",
          }),
          k.pos(k.center().x, k.center().y - 50),
          k.anchor("center"),
          k.color(255, 100, 100),
        ])
        k.add([
          k.text("Press any key to restart", {
            size: 24,
            font: "monospace",
          }),
          k.pos(k.center().x, k.center().y + 20),
          k.anchor("center"),
          k.color(255, 255, 255),
        ])
        k.onKeyPress(() => k.go("game"))
      })

      k.scene("win", () => {
        k.add([
          k.rect(k.width(), k.height()),
          k.color(0, 0, 0),
          k.opacity(0.7),
        ])
        k.add([
          k.text("Victory!", {
            size: 48,
            font: "monospace",
          }),
          k.pos(k.center().x, k.center().y - 50),
          k.anchor("center"),
          k.color(100, 255, 100),
        ])
        k.add([
          k.text("You earned MONAD tokens!", {
            size: 24,
            font: "monospace",
          }),
          k.pos(k.center().x, k.center().y + 20),
          k.anchor("center"),
          k.color(255, 255, 255),
        ])
        k.onKeyPress(() => k.go("game"))
      })

      // Start the game directly
      k.go("game")
    })

    return () => {
      gameInitialized.current = false
    }
  }, [smartContractGame, gameStarted])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      gameContainerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  const restartGame = () => {
    gameInitialized.current = false
    window.location.reload()
  }

  if (!gameKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-red-900/20 border-red-500/30">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Invalid Game Key</h1>
            <p className="text-gray-300 mb-6">
              Please provide a valid blockchain game identifier
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/play">← Back to Games</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading error if smart contract game failed to load
  if (loadingError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-red-900/20 border-red-500/30">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">🔗</div>
            <h1 className="text-2xl font-bold text-white mb-4">Blockchain Game Error</h1>
            <p className="text-gray-300 mb-6">
              {loadingError}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => loadSmartContractGame(gameKey)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                🔄 Retry Loading
              </Button>
              <Button asChild variant="outline" className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                <Link href="/play">← Back to Games</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const gameInfo = smartContractGame ? getGameInfo(smartContractGame) : null;

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

      {/* Error Messages */}
      {walletError && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 mx-4 mt-4 rounded-lg">
          <p className="text-sm">{walletError}</p>
        </div>
      )}

      {/* Game Controls Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-800/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-600/20 text-purple-300 border-purple-400">
                🔗 Blockchain Game
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={restartGame}
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Game Info Card */}
        {gameInfo && smartContractGame && (
          <Card className={`mb-6 bg-gradient-to-r ${gameInfo.color} border-0 text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{gameInfo.title}</h1>
                  <p className="text-white/90 mb-4">{gameInfo.description}</p>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <Target className="h-3 w-3 mr-1" />
                      {gameInfo.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <Trophy className="h-3 w-3 mr-1" />
                      {gameInfo.levels} Levels
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      🎨 {gameInfo.theme}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      🔗 Blockchain
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">#{smartContractGame.gameId}</div>
                  <div className="text-white/80">Game ID</div>
                </div>
              </div>
              
              {/* Smart Contract Game Info */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-white/70">Prize Pool</div>
                    <div className="font-semibold">{smartContractGame.prizePool} MONAD</div>
                  </div>
                  <div>
                    <div className="text-white/70">Cost to Play</div>
                    <div className="font-semibold">{smartContractGame.costOfPlay} MONAD</div>
                  </div>
                  <div>
                    <div className="text-white/70">Total Players</div>
                    <div className="font-semibold">{smartContractGame.totalPlayers}</div>
                  </div>
                  <div>
                    <div className="text-white/70">Contract</div>
                    <div className="font-semibold text-xs">{smartContractGame.gameAddress.slice(0, 8)}...</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls Info */}
        <Card className="mb-6 bg-black/40 border-purple-800/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-white">
                <div className="bg-purple-600/20 p-2 rounded">⌨️</div>
                <div>
                  <div className="font-semibold">Movement</div>
                  <div className="text-sm text-gray-400">Arrow Keys</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white">
                <div className="bg-purple-600/20 p-2 rounded">🚀</div>
                <div>
                  <div className="font-semibold">Jump</div>
                  <div className="text-sm text-gray-400">Spacebar</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white">
                <div className="bg-purple-600/20 p-2 rounded">🎯</div>
                <div>
                  <div className="font-semibold">Goal</div>
                  <div className="text-sm text-gray-400">Reach Portal</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Container */}
        <Card className="bg-black/60 border-purple-800/30 overflow-hidden">
          <CardContent className="p-0">
            {!gameStarted && smartContractGame ? (
              // Payment UI
              <div className="h-[600px] flex items-center justify-center p-8">
                <div className="text-center text-white max-w-md">
                  {paymentStatus === 'pending' && (
                    <>
                      <div className="text-6xl mb-6">💰</div>
                      <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
                      <p className="text-gray-300 mb-6">
                        Pay {smartContractGame.costOfPlay} MONAD to start playing this blockchain game.
                        Your payment will be sent to the game creator.
                      </p>
                      <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Game Cost:</span>
                          <span className="font-semibold text-yellow-400">{smartContractGame.costOfPlay} MONAD</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Prize Pool:</span>
                          <span className="font-semibold text-green-400">{smartContractGame.prizePool} MONAD</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Creator:</span>
                          <span className="font-mono text-xs text-blue-400">{smartContractGame.owner.slice(0, 10)}...</span>
                        </div>
                      </div>
                      <Button 
                        onClick={handlePayment}
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                      >
                        <Coins className="h-5 w-5 mr-2" />
                        Pay & Play Now
                      </Button>
                    </>
                  )}
                  
                  {paymentStatus === 'processing' && (
                    <>
                      <div className="animate-spin text-6xl mb-6">⏳</div>
                      <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
                      <p className="text-gray-300 mb-6">
                        Please wait while your payment is being processed on the blockchain.
                        Do not close this window.
                      </p>
                      <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
                        <div className="text-sm text-blue-300">
                          Sending {smartContractGame.costOfPlay} MONAD to {smartContractGame.owner.slice(0, 10)}...
                        </div>
                      </div>
                    </>
                  )}
                  
                  {paymentStatus === 'failed' && (
                    <>
                      <div className="text-6xl mb-6">❌</div>
                      <h2 className="text-2xl font-bold mb-4">Payment Failed</h2>
                      <p className="text-gray-300 mb-4">
                        {paymentError || 'Your payment could not be processed. Please try again.'}
                      </p>
                      <div className="space-y-3">
                        <Button 
                          onClick={handlePayment}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Coins className="h-5 w-5 mr-2" />
                          Try Again
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => router.back()}
                          className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Go Back
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : isLoading ? (
              <div className="h-[600px] flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin text-4xl mb-4">🔗</div>
                  <div className="text-xl">Loading Blockchain Game...</div>
                  <div className="text-sm text-gray-400 mt-2">
                    Fetching levels from smart contract...
                  </div>
                </div>
              </div>
            ) : (
              <div 
                ref={gameContainerRef}
                className="w-full flex justify-center bg-gradient-to-b from-slate-800 to-slate-900"
                style={{ height: '600px' }}
              >
                <canvas className="max-w-full max-h-full rounded-lg" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Tips */}
        <Card className="mt-6 bg-black/40 border-purple-800/30">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              💡 Blockchain Game Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>• Jump on enemies to defeat them</div>
              <div>• Hit prize blocks (%) for power-ups</div>
              <div>• Collect coins ($) for points</div>
              <div>• Avoid spikes (^) and enemies</div>
              <div>• Press F for fullscreen mode</div>
              <div>• Use Down arrow for fast fall</div>
              <div>• "0" represents empty space in levels</div>
              <div>• Reach the portal (@) to advance</div>
              <div>• This is a blockchain game with real rewards</div>
              <div>• Complete all levels to earn MONAD tokens</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 