
import React from 'react';
import { Direction } from '../types';
import { COLORS } from '../constants';

interface ControlButtonsProps {
  onChangeDirection: (direction: Direction) => void;
  disabled?: boolean;
}

// The SVG path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
// creates a chevron pointing DOWN by default (rotation 0).
const ArrowIcon: React.FC<{ rotation: number }> = ({ rotation }) => (
  <svg
    className="w-6 h-6 sm:w-8 sm:h-8 fill-current"
    viewBox="0 0 20 20"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
  </svg>
);


const ControlButtons: React.FC<ControlButtonsProps> = ({ onChangeDirection, disabled = false }) => {
  if (disabled) {
    return null;
  }

  const buttonBaseStyle = `
    ${COLORS.BUTTON_BG} ${COLORS.BUTTON_HOVER_BG} ${COLORS.TEXT_PRIMARY}
    p-3 sm:p-4 rounded-lg shadow-lg active:scale-95 transition-all 
    flex items-center justify-center
    border-2 ${COLORS.BORDER_ACCENT} hover:border-cyan-300
  `;

  const handlePress = (direction: Direction) => {
    if (!disabled) {
      onChangeDirection(direction);
    }
  };

  return (
    <div 
        className="fixed bottom-4 right-4 grid grid-cols-3 grid-rows-3 gap-1.5 sm:gap-2 w-36 h-36 sm:w-48 sm:h-48 z-40"
        aria-label="Directional Pad Controls"
        role="group"
    >
      <button
        onClick={() => handlePress(Direction.UP)}
        className={`${buttonBaseStyle} col-start-2 row-start-1`}
        aria-label="Move Up"
        disabled={disabled}
      >
        <ArrowIcon rotation={180} /> {/* Corrected: Points Up */}
      </button>
      <button
        onClick={() => handlePress(Direction.LEFT)}
        className={`${buttonBaseStyle} col-start-1 row-start-2`}
        aria-label="Move Left"
        disabled={disabled}
      >
        <ArrowIcon rotation={90} /> {/* Corrected: Points Left */}
      </button>
      <button
        onClick={() => handlePress(Direction.RIGHT)}
        className={`${buttonBaseStyle} col-start-3 row-start-2`}
        aria-label="Move Right"
        disabled={disabled}
      >
        <ArrowIcon rotation={-90} /> {/* Corrected: Points Right */}
      </button>
      <button
        onClick={() => handlePress(Direction.DOWN)}
        className={`${buttonBaseStyle} col-start-2 row-start-3`}
        aria-label="Move Down"
        disabled={disabled}
      >
        <ArrowIcon rotation={0} /> {/* Corrected: Points Down */}
      </button>
    </div>
  );
};

export default ControlButtons;
