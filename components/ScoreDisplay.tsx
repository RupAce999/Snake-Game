import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../constants';

interface ScoreDisplayProps {
  score: number;
  userHighScore: number;
  username?: string | null;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, userHighScore, username }) => {
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);
  const prevScoreRef = useRef<number>(score);

  useEffect(() => {
    if (score > prevScoreRef.current) {
      setIsScoreAnimating(true);
      const timer = setTimeout(() => {
        setIsScoreAnimating(false);
      }, 400); // Duration of the animation

      // Cleanup timeout if component unmounts or score changes again quickly
      return () => clearTimeout(timer);
    }
    prevScoreRef.current = score; // Update previous score after checking
  }, [score]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md p-3 my-3 bg-slate-800/60 rounded-lg shadow-xl border border-slate-700/80">
      {username && (
        <div className="text-center sm:text-left mb-2 sm:mb-0 sm:mr-4">
          <p className={`text-xs ${COLORS.TEXT_MUTED} uppercase tracking-wider font-mono`}>Pilot</p>
          <p className={`text-lg font-semibold ${COLORS.TEXT_ACCENT}`}>{username}</p>
        </div>
      )}
      <div className="flex justify-around w-full sm:w-auto">
        <div className="text-center mx-2">
          <p className={`text-sm ${COLORS.TEXT_ACCENT} uppercase tracking-wider font-mono`}>Score</p>
          <p 
            className={`text-3xl font-bold ${isScoreAnimating ? 'score-pop-animate' : COLORS.TEXT_PRIMARY}`}
            // Key ensures re-triggering if animation is interrupted by rapid scoring for some animation types, though class toggling should work.
            key={score} 
          >
            {score}
          </p>
        </div>
        <div className="text-center mx-2">
          <p className={`text-sm ${COLORS.TEXT_ACCENT} uppercase tracking-wider font-mono`}>Personal Best</p>
          <p className={`text-3xl font-bold ${COLORS.TEXT_PRIMARY}`}>{userHighScore}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;