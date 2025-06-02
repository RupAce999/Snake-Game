export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Position {
  x: number;
  y: number;
}

export enum GameState {
  IDLE,
  PLAYING,
  GAME_OVER,
}

export enum CellType {
  EMPTY,
  SNAKE,
  FOOD,
}

export interface User {
  username: string;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
}

export enum AppView {
  LOGIN,
  START_SCREEN,
  GAME,
  LEADERBOARD,
}

export enum ControlMode {
  SWIPE,
  JOYSTICK,
  BUTTONS, // Added new control mode
}