import React, { useRef, useState } from 'react';
import { Direction } from '../types';
import { COLORS } from '../constants';

interface JoystickProps {
  onChangeDirection: (direction: Direction) => void;
  size?: number; // Diameter of the joystick base
  disabled?: boolean;
}

const Joystick: React.FC<JoystickProps> = ({ onChangeDirection, size = 120, disabled = false }) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });

  const deadZone = 0.01; // Reduced from 0.1 to 0.01 for more sensitivity
  const knobSize = size * 0.4; // Knob is 40% of the base size
  const maxKnobOffset = (size - knobSize) / 2;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || !baseRef.current) return;
    setIsDragging(true);
    updateKnobPosition(event.touches[0]);
    event.preventDefault(); // Prevent page scroll/zoom
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || disabled || !baseRef.current) return;
    updateKnobPosition(event.touches[0]);
    event.preventDefault();
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 }); // Reset knob to center
  };

  const updateKnobPosition = (touch: React.Touch) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxKnobOffset) {
      dx = (dx / distance) * maxKnobOffset;
      dy = (dy / distance) * maxKnobOffset;
    }
    setKnobPosition({ x: dx, y: dy });

    // Determine direction
    const angle = Math.atan2(dy, dx);
    const normalizedDistance = distance / maxKnobOffset;

    if (normalizedDistance < deadZone) {
      // Optionally, do nothing or send a "neutral" signal if needed
      return;
    }

    // Angle ranges:
    // Right: -45 to 45 deg (-PI/4 to PI/4)
    // Down: 45 to 135 deg (PI/4 to 3PI/4)
    // Left: 135 to 225 deg (3PI/4 to 5PI/4) or -45 to -135 (-PI/4 to -3PI/4)
    // Up: -45 to -135 deg (-PI/4 to -3PI/4) or 225 to 315 deg (5PI/4 to 7PI/4)

    if (angle > -Math.PI / 4 && angle <= Math.PI / 4) {
      onChangeDirection(Direction.RIGHT);
    } else if (angle > Math.PI / 4 && angle <= (3 * Math.PI) / 4) {
      onChangeDirection(Direction.DOWN);
    } else if (angle > (3 * Math.PI) / 4 || angle <= (-3 * Math.PI) / 4) {
      onChangeDirection(Direction.LEFT);
    } else { // angle > (-3 * Math.PI) / 4 && angle <= -Math.PI / 4
      onChangeDirection(Direction.UP);
    }
  };
  
  if (disabled) {
    return null;
  }

  return (
    <div
      ref={baseRef}
      className="fixed bottom-8 left-8 rounded-full bg-slate-700/50 border-2 border-cyan-500/70 shadow-xl"
      style={{ width: `${size}px`, height: `${size}px`, touchAction: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd} // Treat cancel like end
      aria-label="Joystick control"
      role="region"
    >
      <div
        className={`absolute rounded-full ${COLORS.BUTTON_BG} shadow-lg border-2 border-cyan-300/80`}
        style={{
          width: `${knobSize}px`,
          height: `${knobSize}px`,
          top: `calc(50% - ${knobSize / 2}px)`,
          left: `calc(50% - ${knobSize / 2}px)`,
          transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Joystick;