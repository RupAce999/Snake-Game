
import React, { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry } from '../types';
import { LOCAL_STORAGE_KEYS, COLORS } from '../constants';

interface LeaderboardPageProps {
  onBackToMenu: () => void;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onBackToMenu }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const fetchLeaderboard = useCallback(() => {
    // Fetches all scores for all players recorded in this browser's local storage.
    const savedLeaderboard = localStorage.getItem(LOCAL_STORAGE_KEYS.LEADERBOARD);
    if (savedLeaderboard) {
      try {
        setLeaderboard(JSON.parse(savedLeaderboard));
      } catch (error) {
        console.error("Failed to parse leaderboard from localStorage", error);
        setLeaderboard([]);
      }
    } else {
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(); // Initial fetch on component mount.

    // Listen for storage events to sync leaderboard if changed in another tab.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEYS.LEADERBOARD) {
        fetchLeaderboard();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchLeaderboard]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 w-full max-w-lg mx-auto">
      <h1 className={`text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 ${COLORS.TEXT_ACCENT} tracking-tight`}>
        GRID <span className={COLORS.TEXT_PRIMARY}>LEGENDS</span>
      </h1>
      
      {leaderboard.length === 0 ? (
        <p className={`${COLORS.TEXT_PRIMARY} text-lg`}>No scores recorded yet. Be the first to leave your mark!</p>
      ) : (
        <div className={`w-full rounded-lg shadow-2xl ${COLORS.MODAL_BG} border-2 ${COLORS.BORDER_ACCENT} overflow-y-auto max-h-[60vh]`}>
          <ul className="divide-y divide-slate-700">
            {leaderboard.map((entry, index) => (
              <li key={`${entry.username}-${index}`} className="flex justify-between items-center p-3 sm:p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center min-w-0"> {/* Added min-w-0 for better truncation */}
                  <span className={`mr-3 sm:mr-4 text-lg font-semibold ${index < 3 ? COLORS.TEXT_ACCENT : COLORS.TEXT_PRIMARY}`}>
                    #{index + 1}
                  </span>
                  <span className={`text-md sm:text-lg ${COLORS.TEXT_PRIMARY} truncate`}>{entry.username}</span>
                </div>
                <span className={`text-lg sm:text-xl font-bold ${COLORS.TEXT_ACCENT} ml-2`}>{entry.score}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onBackToMenu}
        aria-label="Back to main menu"
        className={`mt-8 px-8 py-3 text-lg font-semibold ${COLORS.TEXT_PRIMARY} bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50`}
      >
        Return to Main Menu
      </button>
    </div>
  );
};

export default LeaderboardPage;
