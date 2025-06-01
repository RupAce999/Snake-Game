
import { useEffect, useRef } from 'react';
import { Direction, GameState } from '../types';
import { SWIPE_THRESHOLD } from '../constants';

interface SwipeControlsProps {
  changeDirection: (newDirection: Direction) => void;
  targetRef: React.RefObject<HTMLElement>;
  gameState: GameState;
  enabled: boolean; // New prop to control if swipe is active
}

export const useSwipeControls = ({ changeDirection, targetRef, gameState, enabled }: SwipeControlsProps) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const targetElement = targetRef.current;
    if (!targetElement || !enabled) return; // Only attach if enabled

    const handleTouchStart = (event: TouchEvent) => {
      if (gameState !== GameState.PLAYING) return;
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (gameState !== GameState.PLAYING) return;
      touchEndX.current = event.touches[0].clientX;
      touchEndY.current = event.touches[0].clientY;
      if (Math.abs(touchEndX.current - touchStartX.current) > 10 || Math.abs(touchEndY.current - touchStartY.current) > 10) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (gameState !== GameState.PLAYING) return;
      if (touchEndX.current === 0 && touchEndY.current === 0 && touchStartX.current === 0 && touchStartY.current === 0) return; // No move initiated

      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          changeDirection(deltaX > 0 ? Direction.RIGHT : Direction.LEFT);
        }
      } else {
        if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
          changeDirection(deltaY > 0 ? Direction.DOWN : Direction.UP);
        }
      }
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchEndX.current = 0;
      touchEndY.current = 0;
    };
    
    targetElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    targetElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    targetElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      targetElement.removeEventListener('touchstart', handleTouchStart);
      targetElement.removeEventListener('touchmove', handleTouchMove);
      targetElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [changeDirection, targetRef, gameState, enabled]); // Add enabled to dependency array
};