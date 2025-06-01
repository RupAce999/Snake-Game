
import { useState, useEffect, useCallback } from 'react';
import { Direction, Position, GameState, LeaderboardEntry } from '../types';
import { GRID_SIZE, INITIAL_SNAKE_SPEED, MIN_SNAKE_SPEED, SPEED_INCREMENT_FACTOR, SCORE_INCREMENT, LOCAL_STORAGE_KEYS } from '../constants';

const createInitialSnake = (): Position[] => [
  { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
  { x: Math.floor(GRID_SIZE / 2) - 1, y: Math.floor(GRID_SIZE / 2) },
];

const getRandomPosition = (exclude: Position[] = []): Position => {
  let newPos: Position;
  do {
    newPos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (exclude.some(p => p.x === newPos.x && p.y === newPos.y));
  return newPos;
};

const getLeaderboard = (): LeaderboardEntry[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LEADERBOARD);
  return saved ? JSON.parse(saved) : [];
};

const updateLeaderboard = (username: string, newScore: number): LeaderboardEntry[] => {
  let leaderboard = getLeaderboard();
  const userIndex = leaderboard.findIndex(entry => entry.username === username);

  if (userIndex > -1) {
    if (newScore > leaderboard[userIndex].score) {
      leaderboard[userIndex].score = newScore;
    }
  } else {
    leaderboard.push({ username, score: newScore });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  // Removed slicing: leaderboard = leaderboard.slice(0, LEADERBOARD_LIMIT);
  localStorage.setItem(LOCAL_STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  return leaderboard;
};


export const useGameLogic = (currentUser: string | null) => {
  const [snake, setSnake] = useState<Position[]>(createInitialSnake());
  const [food, setFood] = useState<Position>(getRandomPosition(snake));
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [pendingDirection, setPendingDirection] = useState<Direction>(Direction.RIGHT);
  const [score, setScore] = useState<number>(0);
  const [userHighScore, setUserHighScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [currentSpeed, setCurrentSpeed] = useState<number>(INITIAL_SNAKE_SPEED);

  const loadUserHighScore = useCallback(() => {
    if (currentUser) {
      const savedHighScore = localStorage.getItem(`${LOCAL_STORAGE_KEYS.USER_HIGH_SCORE_PREFIX}${currentUser}`);
      setUserHighScore(savedHighScore ? parseInt(savedHighScore, 10) : 0);
    } else {
      setUserHighScore(0);
    }
  }, [currentUser]);

  useEffect(() => {
    loadUserHighScore();
  }, [loadUserHighScore]);


  const resetGame = useCallback(() => {
    const initialSnake = createInitialSnake();
    setSnake(initialSnake);
    setFood(getRandomPosition(initialSnake));
    setDirection(Direction.RIGHT);
    setPendingDirection(Direction.RIGHT);
    setScore(0);
    setCurrentSpeed(INITIAL_SNAKE_SPEED);
    setGameState(GameState.IDLE);
    loadUserHighScore(); // Ensure high score is fresh for the user
  }, [loadUserHighScore]);

  const startGame = useCallback(() => {
    if (!currentUser) return; // Should not happen if UI guards this
    resetGame();
    setGameState(GameState.PLAYING);
  }, [resetGame, currentUser]);

  const handleGameOver = useCallback(() => {
    setGameState(GameState.GAME_OVER);
    if (currentUser) {
      if (score > userHighScore) {
        setUserHighScore(score);
        localStorage.setItem(`${LOCAL_STORAGE_KEYS.USER_HIGH_SCORE_PREFIX}${currentUser}`, score.toString());
      }
      updateLeaderboard(currentUser, score);
    }
  }, [currentUser, score, userHighScore]);

  const moveSnake = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    setDirection(pendingDirection); // Commit the pending direction

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (pendingDirection) {
        case Direction.UP: head.y -= 1; break;
        case Direction.DOWN: head.y += 1; break;
        case Direction.LEFT: head.x -= 1; break;
        case Direction.RIGHT: head.x += 1; break;
      }

      // Check for wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return prevSnake;
      }

      // Check for self-collision (excluding the tail that will move)
      for (let i = 0; i < newSnake.length - 1; i++) {
        if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
          handleGameOver();
          return prevSnake;
        }
      }
      
      newSnake.unshift(head); // Add new head

      // Check for food consumption
      if (head.x === food.x && head.y === food.y) {
        setFood(getRandomPosition(newSnake));
        setScore(s => s + SCORE_INCREMENT);
        setCurrentSpeed(s => Math.max(MIN_SNAKE_SPEED, s * SPEED_INCREMENT_FACTOR));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }
      return newSnake;
    });
  }, [gameState, pendingDirection, food, handleGameOver]);
  
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      const gameInterval = setInterval(moveSnake, currentSpeed);
      return () => clearInterval(gameInterval);
    }
  }, [gameState, moveSnake, currentSpeed]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setPendingDirection(prevActualDirection => {
      if (direction === Direction.UP && newDirection === Direction.DOWN) return prevActualDirection;
      if (direction === Direction.DOWN && newDirection === Direction.UP) return prevActualDirection;
      if (direction === Direction.LEFT && newDirection === Direction.RIGHT) return prevActualDirection;
      if (direction === Direction.RIGHT && newDirection === Direction.LEFT) return prevActualDirection;
      return newDirection;
    });
  }, [direction]); 

  return {
    snake,
    food,
    score,
    userHighScore,
    gameState,
    startGame,
    resetGame,
    changeDirection,
    gridSize: GRID_SIZE,
    setGameState
  };
};
