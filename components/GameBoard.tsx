import React from 'react';
import { Position } from '../types';
import { COLORS, GRID_SIZE } from '../constants';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  boardSize: number; // in pixels
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, boardSize }) => {
  const cellSize = boardSize / GRID_SIZE;

  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let cellClass = `${COLORS.BACKGROUND} ${COLORS.GRID_LINE}`;
      let isSnakeHead = false;

      const isSnakeSegment = snake.some((segment, index) => {
        if (segment.x === x && segment.y === y) {
          if (index === 0) isSnakeHead = true;
          return true;
        }
        return false;
      });
      
      const isFood = food.x === x && food.y === y;

      if (isSnakeHead) {
        cellClass = `${COLORS.SNAKE_HEAD} shadow-lg shadow-cyan-300/70`; // Adjusted shadow to match new head color
      } else if (isSnakeSegment) {
        cellClass = `${COLORS.SNAKE_BODY} shadow-md shadow-cyan-400/50`; // Adjusted shadow for body
      } else if (isFood) {
        cellClass = `${COLORS.FOOD} animate-pulse shadow-lg shadow-red-500/70`; // Adjusted shadow to match new food color
      }

      cells.push(
        <div
          key={`${x}-${y}`}
          className={`border ${cellClass} transition-colors duration-100`}
          style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
        />
      );
    }
  }

  return (
    <div
      className="grid border-2 border-slate-700 shadow-2xl shadow-black/50"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        width: `${boardSize}px`,
        height: `${boardSize}px`,
        // Adding a subtle glow to the board itself
        boxShadow: `0 0 20px ${COLORS.BORDER_ACCENT.replace('border-', 'rgba(').replace('-500', ',0.3)')}`
      }}
    >
      {cells}
    </div>
  );
};

export default GameBoard;