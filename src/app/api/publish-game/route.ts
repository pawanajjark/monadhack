import { NextRequest, NextResponse } from 'next/server';
import { createGameWithLevelsAndCost } from '@/lib/smartContract';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameName, levels, costOfPlay } = body;

    // Validate input
    if (!gameName || !levels || !costOfPlay) {
      return NextResponse.json(
        { error: 'Missing required fields: gameName, levels, costOfPlay' },
        { status: 400 }
      );
    }

    // Parse levels from string format to array format
    let parsedLevels: string[][];
    try {
      // If levels is a string, parse it
      if (typeof levels === 'string') {
        // Remove outer brackets and split by level
        const levelsString = levels.replace(/^\[|\]$/g, '');
        const levelMatches = levelsString.match(/\[[^\]]+\]/g);
        
        if (!levelMatches) {
          throw new Error('Invalid levels format');
        }

        parsedLevels = levelMatches.map(levelString => {
          // Remove brackets and split by comma, then clean quotes
          const rowsString = levelString.replace(/^\[|\]$/g, '');
          return rowsString.split(',').map(row => row.trim().replace(/^"|"$/g, ''));
        });
      } else if (Array.isArray(levels)) {
        parsedLevels = levels;
      } else {
        throw new Error('Levels must be an array or string');
      }
    } catch (error) {
      console.error('Error parsing levels:', error);
      return NextResponse.json(
        { error: 'Invalid levels format' },
        { status: 400 }
      );
    }

    console.log('Parsed levels:', parsedLevels);

    // Call the smart contract function
    const result = await createGameWithLevelsAndCost(
      gameName,
      parsedLevels,
      costOfPlay
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Game created successfully',
        gameAddress: result.gameAddress,
        transactionHash: result.transactionHash
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to create game' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 