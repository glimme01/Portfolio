"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// Tetris piece types
const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // J
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0]
  ],
  // L
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0]
  ],
  // O
  [
    [4, 4],
    [4, 4]
  ],
  // S
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0]
  ],
  // T
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  // Z
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
  ]
];

// Colors for each piece
const COLORS = [
  'transparent',
  '#00FFFF', // I - Cyan
  '#0000FF', // J - Blue
  '#FFA500', // L - Orange
  '#FFFF00', // O - Yellow
  '#00FF00', // S - Green
  '#800080', // T - Purple
  '#FF0000'  // Z - Red
];

// Dark mode colors
const DARK_COLORS = [
  'transparent',
  '#00CCCC', // I - Darker Cyan
  '#0000CC', // J - Darker Blue
  '#CC8500', // L - Darker Orange
  '#CCCC00', // O - Darker Yellow
  '#00CC00', // S - Darker Green
  '#660066', // T - Darker Purple
  '#CC0000'  // Z - Darker Red
];

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 25;

export function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const { theme } = useTheme();
  
  // Game state
  const boardRef = useRef(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const currentPieceRef = useRef({ shape: [[]], position: { x: 0, y: 0 } });
  const nextPieceRef = useRef(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
  const requestIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const dropTimeRef = useRef(1000);
  const dropCounterRef = useRef(0);
  
  // Initialize the game
  const initGame = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Reset game state
        boardRef.current = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
        currentPieceRef.current = {
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          position: { x: Math.floor(COLS / 2) - 1, y: 0 }
        };
        nextPieceRef.current = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setScore(0);
        setLevel(1);
        setLines(0);
        setGameOver(false);
        setPaused(false);
        dropTimeRef.current = 1000;
        
        // Draw the initial state
        drawBoard(ctx);
        drawCurrentPiece(ctx);
        drawNextPiece();
        
        // Start the game loop
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
        }
        lastTimeRef.current = 0;
        dropCounterRef.current = 0;
        requestIdRef.current = requestAnimationFrame(gameLoop);
      }
    }
  }, []);
  
  // Game loop
  const gameLoop = useCallback((time = 0) => {
    if (gameOver || paused) {
      return;
    }
    
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    dropCounterRef.current += deltaTime;
    if (dropCounterRef.current > dropTimeRef.current) {
      dropPiece();
      dropCounterRef.current = 0;
    }
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawBoard(ctx);
        drawCurrentPiece(ctx);
      }
    }
    
    requestIdRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver, paused]);
  
  // Draw the board
  const drawBoard = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    
    // Draw the grid
    ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const value = boardRef.current[row][col];
        if (value > 0) {
          ctx.fillStyle = theme === 'dark' ? DARK_COLORS[value] : COLORS[value];
          ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        } else {
          ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
  }, [theme]);
  
  // Draw the current piece
  const drawCurrentPiece = useCallback((ctx: CanvasRenderingContext2D) => {
    const { shape, position } = currentPieceRef.current;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        const value = shape[row][col];
        if (value > 0) {
          ctx.fillStyle = theme === 'dark' ? DARK_COLORS[value] : COLORS[value];
          ctx.fillRect(
            (position.x + col) * BLOCK_SIZE,
            (position.y + row) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
          ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
          ctx.strokeRect(
            (position.x + col) * BLOCK_SIZE,
            (position.y + row) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      }
    }
  }, [theme]);
  
  // Draw the next piece
  const drawNextPiece = useCallback(() => {
    const nextPieceCanvas = document.getElementById('next-piece') as HTMLCanvasElement;
    if (nextPieceCanvas) {
      const ctx = nextPieceCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        
        const shape = nextPieceRef.current;
        const blockSize = 20;
        const offsetX = (nextPieceCanvas.width - shape[0].length * blockSize) / 2;
        const offsetY = (nextPieceCanvas.height - shape.length * blockSize) / 2;
        
        for (let row = 0; row < shape.length; row++) {
          for (let col = 0; col < shape[row].length; col++) {
            const value = shape[row][col];
            if (value > 0) {
              ctx.fillStyle = theme === 'dark' ? DARK_COLORS[value] : COLORS[value];
              ctx.fillRect(
                offsetX + col * blockSize,
                offsetY + row * blockSize,
                blockSize,
                blockSize
              );
              ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
              ctx.strokeRect(
                offsetX + col * blockSize,
                offsetY + row * blockSize,
                blockSize,
                blockSize
              );
            }
          }
        }
      }
    }
  }, [theme]);
  
  // Check if a move is valid
  const isValidMove = useCallback((shape: number[][], position: { x: number, y: number }) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] > 0) {
          const newX = position.x + col;
          const newY = position.y + row;
          
          // Check boundaries
          if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) {
            return false;
          }
          
          // Check collision with existing pieces
          if (boardRef.current[newY][newX] > 0) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);
  
  // Move the current piece
  const movePiece = useCallback((direction: number) => {
    if (gameOver || paused) return;
    
    const newPosition = {
      x: currentPieceRef.current.position.x + direction,
      y: currentPieceRef.current.position.y
    };
    
    if (isValidMove(currentPieceRef.current.shape, newPosition)) {
      currentPieceRef.current.position = newPosition;
    }
  }, [gameOver, paused, isValidMove]);
  
  // Rotate the current piece
  const rotatePiece = useCallback(() => {
    if (gameOver || paused) return;
    
    const shape = currentPieceRef.current.shape;
    const newShape = Array(shape[0].length).fill(null).map(() => Array(shape.length).fill(0));
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        newShape[col][shape.length - 1 - row] = shape[row][col];
      }
    }
    
    if (isValidMove(newShape, currentPieceRef.current.position)) {
      currentPieceRef.current.shape = newShape;
    }
  }, [gameOver, paused, isValidMove]);
  
  // Drop the current piece one row
  const dropPiece = useCallback(() => {
    if (gameOver || paused) return;
    
    const newPosition = {
      x: currentPieceRef.current.position.x,
      y: currentPieceRef.current.position.y + 1
    };
    
    if (isValidMove(currentPieceRef.current.shape, newPosition)) {
      currentPieceRef.current.position = newPosition;
    } else {
      // Lock the piece in place
      const { shape, position } = currentPieceRef.current;
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] > 0) {
            const boardRow = position.y + row;
            const boardCol = position.x + col;
            if (boardRow >= 0) {
              boardRef.current[boardRow][boardCol] = shape[row][col];
            }
          }
        }
      }
      
      // Check for completed lines
      let linesCleared = 0;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (boardRef.current[row].every(cell => cell > 0)) {
          // Remove the line
          boardRef.current.splice(row, 1);
          // Add a new empty line at the top
          boardRef.current.unshift(Array(COLS).fill(0));
          linesCleared++;
          row++; // Check the same row again
        }
      }
      
      // Update score and level
      if (linesCleared > 0) {
        const linePoints = [0, 40, 100, 300, 1200];
        setScore(prevScore => prevScore + linePoints[linesCleared] * level);
        setLines(prevLines => {
          const newLines = prevLines + linesCleared;
          // Level up every 10 lines
          if (Math.floor(newLines / 10) > Math.floor(prevLines / 10)) {
            setLevel(prevLevel => {
              const newLevel = prevLevel + 1;
              // Increase speed with level
              dropTimeRef.current = Math.max(100, 1000 - (newLevel - 1) * 100);
              return newLevel;
            });
          }
          return newLines;
        });
      }
      
      // Check for game over
      if (boardRef.current[0].some(cell => cell > 0)) {
        setGameOver(true);
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
          requestIdRef.current = null;
        }
        return;
      }
      
      // Create a new piece
      currentPieceRef.current = {
        shape: nextPieceRef.current,
        position: { x: Math.floor(COLS / 2) - 1, y: 0 }
      };
      nextPieceRef.current = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      drawNextPiece();
    }
  }, [gameOver, paused, isValidMove, level, drawNextPiece]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to avoid scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      
      if (gameOver) {
        if (e.code === 'Enter' || e.code === 'Space') {
          initGame();
        }
        return;
      }
      
      if (e.code === 'KeyP') {
        setPaused(prev => !prev);
        return;
      }
      
      if (paused) return;
      
      switch (e.code) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, paused, movePiece, dropPiece, rotatePiece, initGame]);
  
  // Focus the game container when mounted to capture keyboard events
  useEffect(() => {
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, []);
  
  // Start/pause game loop based on paused state
  useEffect(() => {
    if (paused) {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    } else if (!gameOver && requestIdRef.current === null) {
      lastTimeRef.current = 0;
      dropCounterRef.current = 0;
      requestIdRef.current = requestAnimationFrame(gameLoop);
    }
  }, [paused, gameOver, gameLoop]);
  
  // Initialize the game on mount
  useEffect(() => {
    initGame();
    
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [initGame]);
  
  // Update next piece display when theme changes
  useEffect(() => {
    drawNextPiece();
  }, [theme, drawNextPiece]);
  
  return (
    <div 
      ref={gameContainerRef}
      className="flex flex-col md:flex-row gap-8 items-center justify-center w-full"
      tabIndex={0} // Make div focusable to capture keyboard events
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50"
        />
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <h2 className="text-3xl font-bold mb-4">Game Over</h2>
            <p className="text-xl mb-6">Score: {score}</p>
            <button
              className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
              onClick={initGame}
            >
              Play Again
            </button>
          </div>
        )}
        
        {paused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <h2 className="text-3xl font-bold mb-4">Paused</h2>
            <button
              className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
              onClick={() => setPaused(false)}
            >
              Resume
            </button>
          </div>
        )}
        
        {/* Mobile controls */}
        <div className="md:hidden mt-4 grid grid-cols-3 gap-2 w-full">
          <button
            className="p-4 bg-slate-200 dark:bg-slate-700 rounded-lg text-2xl"
            onClick={() => movePiece(-1)}
            aria-label="Move left"
          >
            ←
          </button>
          <button
            className="p-4 bg-slate-200 dark:bg-slate-700 rounded-lg text-2xl"
            onClick={() => dropPiece()}
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            className="p-4 bg-slate-200 dark:bg-slate-700 rounded-lg text-2xl"
            onClick={() => movePiece(1)}
            aria-label="Move right"
          >
            →
          </button>
          <button
            className="p-4 bg-slate-200 dark:bg-slate-700 rounded-lg text-2xl"
            onClick={() => rotatePiece()}
            aria-label="Rotate"
          >
            ↻
          </button>
          <button
            className="p-4 bg-slate-200 dark:bg-slate-700 rounded-lg text-2xl col-span-2"
            onClick={() => setPaused(!paused)}
            aria-label="Pause/Resume"
          >
            {paused ? "▶️ Resume" : "⏸️ Pause"}
          </button>
        </div>
      </div>
      
      <div className="glass p-6 rounded-lg space-y-6 w-full md:w-auto">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Next Piece</h3>
          <canvas
            id="next-piece"
            width={100}
            height={100}
            className="border border-slate-300 dark:border-slate-700 mx-auto bg-white/50 dark:bg-slate-900/50"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Score</h3>
            <p className="text-2xl font-mono">{score}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Level</h3>
            <p className="text-2xl font-mono">{level}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Lines</h3>
            <p className="text-2xl font-mono">{lines}</p>
          </div>
        </div>
        
        <div className="space-y-2 hidden md:block">
          <h3 className="text-lg font-semibold">Controls</h3>
          <ul className="text-sm space-y-1">
            <li>← → : Move left/right</li>
            <li>↓ : Soft drop</li>
            <li>↑ : Rotate</li>
            <li>P : Pause game</li>
          </ul>
        </div>
        
        <div className="flex gap-2 hidden md:flex">
          <button
            className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors flex-1"
            onClick={() => setPaused(!paused)}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex-1"
            onClick={initGame}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
} 