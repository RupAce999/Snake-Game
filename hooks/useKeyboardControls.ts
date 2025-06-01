
import { useEffect } from 'react';
import { Direction, GameState } from '../types'; // Correctly import GameState
import { KEYBOARD_CONTROLS } from '../constants';

interface KeyboardControlsProps {
  changeDirection: (newDirection: Direction) => void;
  gameState: GameState; // Use the imported GameState type
}

export const useKeyboardControls = ({ changeDirection, gameState }: KeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return; // Compare with imported GameState

      const newDirKey = KEYBOARD_CONTROLS[event.key as keyof typeof KEYBOARD_CONTROLS];
      if (newDirKey) {
        event.preventDefault(); // Prevents page scrolling with arrow keys
        switch (newDirKey) {
          case 'UP':
            changeDirection(Direction.UP);
            break;
          case 'DOWN':
            changeDirection(Direction.DOWN);
            break;
          case 'LEFT':
            changeDirection(Direction.LEFT);
            break;
          case 'RIGHT':
            changeDirection(Direction.RIGHT);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, gameState]);
};
