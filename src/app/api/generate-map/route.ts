import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const LEVEL_SYMBOLS = {
  ' ': 'Empty space',
  '=': 'Grass Platform (solid ground)',
  '-': 'Steel Platform (solid metal)',
  '0': 'Bag Block (solid block)',
  '$': 'Coin (collectible)',
  '%': 'Prize Block (hit for power-ups)',
  '^': 'Spike (dangerous)',
  '#': 'Apple (power-up)',
  '>': 'Enemy (moving threat)',
  '@': 'Portal (level exit)',
}

const GRID_WIDTH = 27
const GRID_HEIGHT = 11

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemPrompt = `You are a level designer for a 2D platformer game. Create a level based on the user's description.

IMPORTANT RULES:
1. The level must be exactly ${GRID_WIDTH} characters wide and ${GRID_HEIGHT} characters tall
2. Each row must be exactly ${GRID_WIDTH} characters - COUNT CAREFULLY!
3. Use only these symbols: ${Object.entries(LEVEL_SYMBOLS).map(([symbol, desc]) => `'${symbol}' (${desc})`).join(', ')}
4. Always include at least one '@' (Portal) as the exit
5. Make sure there's a way for the player to reach the portal
6. Use '=' or '-' for platforms the player can stand on
7. Place '$' (coins) strategically for collection
8. Use '^' (spikes) sparingly for challenge
9. Use '>' (enemies) moderately for difficulty
10. Use '%' (prize blocks) and '#' (apples) for power-ups
11. Leave ' ' (empty space) for areas the player can move through
12. Consider gravity - platforms should support the player's movement
13. Create interesting jumping challenges and paths

CRITICAL: Each line must be EXACTLY ${GRID_WIDTH} characters. Count each character carefully!

Return ONLY the level grid as ${GRID_HEIGHT} lines of exactly ${GRID_WIDTH} characters each, with no additional text, explanations, or formatting.

Example format (each line exactly ${GRID_WIDTH} chars):
===========================
=     $   >    $    >    =
=  ==========   ====     =
=         $    >    $    =
=   ====    ======   === =
=>               >       =
====   ====   ====   ====
=  $    >   $           =
= ============  ===== @ =
=    >     >    >   ====
===========================`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI')
    }

    console.log("content", content)

    const levelText = content.text.trim()
    const lines = levelText.split('\n')

    // Validate the number of rows
    if (lines.length !== GRID_HEIGHT) {
      throw new Error(`AI generated ${lines.length} rows, expected ${GRID_HEIGHT}`)
    }

    const grid: string[][] = []
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      
      // Fix line length FIRST before any validation
      if (line.length < GRID_WIDTH) {
        // Pad with spaces to reach correct width
        line = line + ' '.repeat(GRID_WIDTH - line.length)
        console.log(`Fixed row ${i + 1}: padded from ${lines[i].length} to ${GRID_WIDTH} characters`)
      } else if (line.length > GRID_WIDTH) {
        // Truncate if too long
        line = line.substring(0, GRID_WIDTH)
        console.log(`Fixed row ${i + 1}: truncated from ${lines[i].length} to ${GRID_WIDTH} characters`)
      }
      
      // Now validate that we have the correct length
      if (line.length !== GRID_WIDTH) {
        throw new Error(`Failed to fix row ${i + 1}: has ${line.length} characters, expected ${GRID_WIDTH}`)
      }
      
      // Validate symbols and replace invalid ones
      const validatedLine = line.split('').map(char => {
        if (char in LEVEL_SYMBOLS) {
          return char
        } else {
          console.log(`Replaced invalid symbol '${char}' with space`)
          return ' '
        }
      }).join('')
      
      grid.push(validatedLine.split(''))
    }

    // Ensure there's at least one portal
    const hasPortal = grid.some(row => row.includes('@'))
    if (!hasPortal) {
      // Add a portal in the top-right area
      grid[1][GRID_WIDTH - 2] = '@'
      console.log('Added missing portal to the level')
    }

    // Ensure there's some solid ground (platforms)
    const hasPlatforms = grid.some(row => row.some(cell => cell === '=' || cell === '-' || cell === '0'))
    if (!hasPlatforms) {
      // Add a bottom platform
      for (let col = 0; col < GRID_WIDTH; col++) {
        grid[GRID_HEIGHT - 1][col] = '='
      }
      console.log('Added bottom platform to ensure playability')
    }

    return NextResponse.json({ 
      grid,
      success: true 
    })

  } catch (error) {
    console.error('AI Map Generation Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate map',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}