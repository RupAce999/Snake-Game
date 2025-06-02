import React from 'react';
import { COLORS } from '../constants';
import { ControlMode } from '../types'; // Import ControlMode

interface StartScreenProps {
  onStartGame: () => void;
  onShowLeaderboard: () => void;
  onLogout: () => void;
  username: string | null;
  currentControlMode: ControlMode;
  onSetControlMode: (mode: ControlMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onShowLeaderboard,
  onLogout,
  username,
  currentControlMode,
  onSetControlMode
}) => {

  const isMobile = () => {
    return typeof window !== 'undefined' && (window.innerWidth <= 768 || navigator.maxTouchPoints > 0);
  };

  let controlHint = 'Arrow Keys / WASD';
  if (isMobile()) {
    if (currentControlMode === ControlMode.JOYSTICK) {
      controlHint = 'Joystick';
    } else if (currentControlMode === ControlMode.BUTTONS) {
      controlHint = 'On-Screen Buttons';
    } else {
      controlHint = 'Swipe';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
      <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-2 ${COLORS.TEXT_ACCENT} tracking-tight`}>
        SNAKE <span className={COLORS.TEXT_PRIMARY}>GAME</span>
      </h1>
      {username && (
        <p className={`${COLORS.TEXT_MUTED} mb-4 text-sm sm:text-base`}>Logged in as: <span className={COLORS.TEXT_ACCENT}>{username}</span></p>
      )}
      <p className={`text-base sm:text-lg ${COLORS.TEXT_PRIMARY} mb-6 sm:mb-8 max-w-md`}>
        Navigate the neon grid. Consume data orbs to grow. Avoid collisions. How long can you survive in the cyber realm?
      </p>

      {isMobile() && (
        <div className="mb-6 w-full max-w-xs sm:max-w-sm">
          <p className={`${COLORS.TEXT_MUTED} text-sm mb-2`}>Control Mode:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSetControlMode(ControlMode.SWIPE)}
              aria-pressed={currentControlMode === ControlMode.SWIPE}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200 ${
                currentControlMode === ControlMode.SWIPE
                  ? `${COLORS.BUTTON_BG} ${COLORS.TEXT_PRIMARY} ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-400`
                  : `bg-slate-700 ${COLORS.TEXT_MUTED} hover:bg-slate-600`
              }`}
            >
              Swipe
            </button>
            <button
              onClick={() => onSetControlMode(ControlMode.JOYSTICK)}
              aria-pressed={currentControlMode === ControlMode.JOYSTICK}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200 ${
                currentControlMode === ControlMode.JOYSTICK
                ? `${COLORS.BUTTON_BG} ${COLORS.TEXT_PRIMARY} ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-400`
                : `bg-slate-700 ${COLORS.TEXT_MUTED} hover:bg-slate-600`
              }`}
            >
              Joystick
            </button>
            <button
              onClick={() => onSetControlMode(ControlMode.BUTTONS)}
              aria-pressed={currentControlMode === ControlMode.BUTTONS}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200 ${
                currentControlMode === ControlMode.BUTTONS
                ? `${COLORS.BUTTON_BG} ${COLORS.TEXT_PRIMARY} ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-400`
                : `bg-slate-700 ${COLORS.TEXT_MUTED} hover:bg-slate-600`
              }`}
            >
              Buttons
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 w-full max-w-xs sm:max-w-sm">
        <button
          onClick={onStartGame}
          aria-label="Start new game"
          className={`w-full px-6 py-3 text-lg sm:text-xl font-semibold ${COLORS.TEXT_PRIMARY} ${COLORS.BUTTON_BG} ${COLORS.BUTTON_HOVER_BG} rounded-lg shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50`}
        >
          Play Game
        </button>
        <button
          onClick={onShowLeaderboard}
          aria-label="View leaderboard"
          className={`w-full px-6 py-3 text-lg sm:text-xl font-semibold ${COLORS.TEXT_PRIMARY} bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50`}
        >
          View Leaderboard
        </button>
        {username && (
          <button
            onClick={onLogout}
            aria-label="Logout"
            className={`w-full px-6 py-3 text-base sm:text-lg font-semibold ${COLORS.TEXT_PRIMARY} ${COLORS.BUTTON_DANGER_BG} ${COLORS.BUTTON_DANGER_HOVER_BG} rounded-lg shadow-xl hover:shadow-rose-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-opacity-50`}
          >
            Logout
          </button>
        )}
      </div>
      <div className={`mt-8 text-xs sm:text-sm ${COLORS.TEXT_MUTED} font-mono`}>
        Controls: {controlHint}
      </div>
    </div>
  );
};

export default StartScreen;