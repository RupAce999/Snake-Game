
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useSwipeControls } from './hooks/useSwipeControls';
import GameBoard from './components/GameBoard';
import ScoreDisplay from './components/ScoreDisplay';
import StartScreen from './components/StartScreen';
import GameOverModal from './components/GameOverModal';
import LoginPage from './components/LoginPage';
import LeaderboardPage from './components/LeaderboardPage';
import Joystick from './components/Joystick';
import ControlButtons from './components/ControlButtons'; // Import ControlButtons
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameState, AppView, ControlMode, Direction } from './types';
import { COLORS } from './constants';

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [appView, setAppView] = useState<AppView>(AppView.START_SCREEN);
  const [controlMode, setControlMode] = useState<ControlMode>(ControlMode.SWIPE);
  const [isGameOverFlashing, setIsGameOverFlashing] = useState(false);

  const {
    snake,
    food,
    score,
    userHighScore,
    gameState,
    startGame,
    resetGame,
    changeDirection,
    gridSize,
    setGameState,
  } = useGameLogic(currentUser ? currentUser.username : null);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  useKeyboardControls({ changeDirection, gameState });

  const isMobile = useCallback(() => {
    // Simple check, can be more sophisticated
    return typeof window !== 'undefined' && (window.innerWidth <= 768 || navigator.maxTouchPoints > 0);
  }, []);

  useSwipeControls({
    changeDirection,
    targetRef: gameAreaRef,
    gameState,
    enabled: isMobile() && controlMode === ControlMode.SWIPE && gameState === GameState.PLAYING
  });

  const [boardPixelSize, setBoardPixelSize] = useState(300);

  useEffect(() => {
    const calculateBoardSize = () => {
      const mainContentAreaQuery = gameAreaRef.current?.querySelector('#main-content-area') as HTMLElement | null;
      const containerElement = mainContentAreaQuery || gameAreaRef.current || document.body;

      const availableWidth = containerElement.offsetWidth;
      let otherElementsHeight = window.innerHeight * (appView === AppView.GAME ? 0.28 : 0.20);
      if (isMobile() && (controlMode === ControlMode.JOYSTICK || controlMode === ControlMode.BUTTONS) && appView === AppView.GAME) {
        otherElementsHeight += 80; // Approximate height for joystick/buttons area
      }
      const availableHeight = window.innerHeight - otherElementsHeight;

      const sizeBasedOnWidth = availableWidth * 0.9;
      const sizeBasedOnHeight = availableHeight * (appView === AppView.GAME ? 0.75 : 0.7);

      let size = Math.min(sizeBasedOnWidth, sizeBasedOnHeight, 500);
      size = Math.max(size, 200);
      setBoardPixelSize(Math.floor(size / gridSize) * gridSize);
    };

    calculateBoardSize();
    window.addEventListener('resize', calculateBoardSize);
    return () => window.removeEventListener('resize', calculateBoardSize);
  }, [gridSize, appView, gameState, controlMode, isMobile]);

  const handleStartGame = () => {
    startGame();
    setAppView(AppView.GAME);
  };

  const handleShowLeaderboard = () => {
    setAppView(AppView.LEADERBOARD);
  };

  const handleLogout = () => {
    logout();
  };

  const handleGoToMenu = () => {
    resetGame();
    setGameState(GameState.IDLE);
    setAppView(AppView.START_SCREEN);
  };

  const handleRestartGame = () => {
    resetGame();
    startGame();
    setAppView(AppView.GAME);
  };

  useEffect(() => {
    if (!currentUser) {
      setAppView(AppView.LOGIN);
    } else if (appView === AppView.LOGIN && currentUser) {
      setAppView(AppView.START_SCREEN);
    }
  }, [currentUser, appView]);

  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      setIsGameOverFlashing(true);
      const timer = setTimeout(() => {
        setIsGameOverFlashing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  if (appView === AppView.LOGIN) {
    return <LoginPage />;
  }

  return (
    <div
      ref={gameAreaRef}
      className={`min-h-screen ${COLORS.BACKGROUND} flex flex-col items-center justify-center p-2 sm:p-4 touch-none select-none overflow-hidden w-full ${isGameOverFlashing ? 'game-over-flash-active' : ''}`}
    >
      <div id="main-content-area" className="w-full h-full flex flex-col items-center justify-center">
        {appView === AppView.START_SCREEN && (
          <StartScreen
            onStartGame={handleStartGame}
            onShowLeaderboard={handleShowLeaderboard}
            onLogout={handleLogout}
            username={currentUser?.username || null}
            currentControlMode={controlMode}
            onSetControlMode={setControlMode}
          />
        )}

        {appView === AppView.GAME && gameState === GameState.PLAYING && (
          <>
            <ScoreDisplay score={score} userHighScore={userHighScore} username={currentUser?.username} />
            <GameBoard snake={snake} food={food} boardSize={boardPixelSize} />
            {isMobile() && controlMode === ControlMode.JOYSTICK && (
              <Joystick
                onChangeDirection={changeDirection}
                size={120}
                disabled={gameState !== GameState.PLAYING}
              />
            )}
            {isMobile() && controlMode === ControlMode.BUTTONS && (
              <ControlButtons
                onChangeDirection={changeDirection}
                disabled={gameState !== GameState.PLAYING}
              />
            )}
            <p className={`mt-4 text-xs ${COLORS.TEXT_MUTED} font-mono hidden md:block`}>Use Arrow Keys or WASD to move.</p>
            {isMobile() && controlMode === ControlMode.SWIPE && (
              <p className={`mt-2 text-xs ${COLORS.TEXT_MUTED} font-mono`}>Swipe to move.</p>
            )}
             {isMobile() && controlMode === ControlMode.JOYSTICK && (
              <p className={`mt-2 text-xs ${COLORS.TEXT_MUTED} font-mono`}>Use Joystick to move.</p>
            )}
            {isMobile() && controlMode === ControlMode.BUTTONS && (
              <p className={`mt-2 text-xs ${COLORS.TEXT_MUTED} font-mono`}>Use On-Screen Buttons to move.</p>
            )}
          </>
        )}

        {gameState === GameState.GAME_OVER && !isGameOverFlashing && (
          <GameOverModal
            score={score}
            userHighScore={userHighScore}
            onRestart={handleRestartGame}
            onGoToMenu={handleGoToMenu}
          />
        )}

        {appView === AppView.LEADERBOARD && (
          <LeaderboardPage onBackToMenu={handleGoToMenu} />
        )}
      </div>
      <footer className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-xs ${COLORS.TEXT_MUTED} font-mono opacity-70`}>
        Snake Game v1.3
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;