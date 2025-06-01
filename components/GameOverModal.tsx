import React from 'react';
import { COLORS } from '../constants';

interface GameOverModalProps {
  score: number;
  userHighScore: number; // Renamed from highScore
  onRestart: () => void;
  onGoToMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, userHighScore, onRestart, onGoToMenu }) => {
  const isNewPersonalBest = score > 0 && score === userHighScore; // Check if current score matches the updated userHighScore

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
      <div className={`p-6 sm:p-8 rounded-xl shadow-2xl ${COLORS.MODAL_BG} border-2 ${COLORS.BORDER_ACCENT} w-full max-w-md text-center`}>
        <h2 className={`text-3xl sm:text-4xl font-bold mb-3 ${COLORS.TEXT_ACCENT}`}>SYSTEM OFFLINE</h2>
        <p className={`${COLORS.TEXT_PRIMARY} text-md sm:text-lg mb-2`}>Critical Error: Collision Detected</p>
        <p className={`${COLORS.TEXT_PRIMARY} text-lg sm:text-xl mb-1`}>Final Score: <span className="font-bold text-cyan-400">{score}</span></p>
        
        {isNewPersonalBest && (
          <p className="text-lime-400 text-md sm:text-lg mb-2 animate-pulse">New Personal Best!</p>
        )}
        {!isNewPersonalBest && (
           <p className={`${COLORS.TEXT_MUTED} text-sm sm:text-md mb-2`}>Personal Best: <span className="font-bold text-slate-300">{userHighScore}</span></p>
        )}
        
        <div className="mt-6 space-y-3">
          <button
            onClick={onRestart}
            aria-label="Restart game"
            className={`w-full px-6 py-3 text-md sm:text-lg font-semibold ${COLORS.TEXT_PRIMARY} ${COLORS.BUTTON_BG} ${COLORS.BUTTON_HOVER_BG} rounded-lg shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50`}
          >
            Play Again
          </button>
          <button
            onClick={onGoToMenu}
            aria-label="Go to main menu"
            className={`w-full px-6 py-3 text-md sm:text-lg font-semibold ${COLORS.TEXT_PRIMARY} bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50`}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;