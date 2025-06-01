
export const GRID_SIZE = 20; // Number of cells in width and height
export const INITIAL_SNAKE_SPEED = 160; // Milliseconds per move (Reduced from 200)
export const MIN_SNAKE_SPEED = 50; // Fastest speed
export const SPEED_INCREMENT_FACTOR = 0.95; // Factor to multiply speed by (lower is faster)
export const SCORE_INCREMENT = 10; // Points per food

export const COLORS = {
  BACKGROUND: 'bg-transparent', // Main background is now on body
  SNAKE_HEAD: 'bg-cyan-300', // Brighter for neon effect
  SNAKE_BODY: 'bg-cyan-500', // Slightly darker for body segments
  FOOD: 'bg-red-500', // Fruit-like color (e.g., apple/cherry)
  TEXT_PRIMARY: 'text-slate-100',
  TEXT_ACCENT: 'text-cyan-400',
  TEXT_MUTED: 'text-slate-400',
  BORDER_ACCENT: 'border-cyan-500',
  BORDER_MUTED: 'border-slate-700',
  BUTTON_BG: 'bg-cyan-600',
  BUTTON_HOVER_BG: 'hover:bg-cyan-500',
  BUTTON_DANGER_BG: 'bg-rose-600',
  BUTTON_DANGER_HOVER_BG: 'hover:bg-rose-500',
  MODAL_BG: 'bg-slate-800/95', // Slightly more opaque
  GRID_LINE: 'border-slate-700/50', // More subtle grid lines
  INPUT_BG: 'bg-slate-700',
  INPUT_BORDER: 'border-slate-600',
  INPUT_FOCUS_BORDER: 'focus:border-cyan-500',
  SCORE_POP_TEXT: 'text-yellow-300', // Color for score pop animation
};

export const KEYBOARD_CONTROLS = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT',
  W: 'UP',
  S: 'DOWN',
  A: 'LEFT',
  D: 'RIGHT',
};

export const SWIPE_THRESHOLD = 30; // Minimum pixels for a swipe to register

export const LOCAL_STORAGE_KEYS = {
  CURRENT_USER: 'cyberSnakeCurrentUser',
  USER_HIGH_SCORE_PREFIX: 'cyberSnakeHighScore_', // e.g., cyberSnakeHighScore_player1
  LEADERBOARD: 'cyberSnakeLeaderboard',
};

// LEADERBOARD_LIMIT has been removed to show all users.
