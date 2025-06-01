
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Username cannot be empty.');
      return;
    }
    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (trimmedUsername.length > 15) {
      setError('Username cannot exceed 15 characters.');
      return;
    }
    setError('');
    login(trimmedUsername);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className={`w-full max-w-sm p-6 sm:p-8 rounded-xl shadow-2xl ${COLORS.MODAL_BG} border-2 ${COLORS.BORDER_ACCENT}`}>
        <h1 className={`text-3xl sm:text-4xl font-bold mb-6 ${COLORS.TEXT_ACCENT}`}>
          SNAKE <span className={COLORS.TEXT_PRIMARY}>GAME</span>
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium ${COLORS.TEXT_PRIMARY} mb-1 text-left`}>
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. NeonRider_77"
              className={`w-full px-4 py-3 ${COLORS.INPUT_BG} ${COLORS.TEXT_PRIMARY} ${COLORS.INPUT_BORDER} border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${COLORS.INPUT_FOCUS_BORDER} transition-colors`}
              maxLength={15}
              aria-describedby={error ? "username-error" : undefined}
            />
            {error && <p id="username-error" className="mt-2 text-sm text-red-400" role="alert">{error}</p>}
          </div>
          <button
            type="submit"
            className={`w-full px-6 py-3 text-lg font-semibold ${COLORS.TEXT_PRIMARY} ${COLORS.BUTTON_BG} ${COLORS.BUTTON_HOVER_BG} rounded-lg shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50`}
          >
            Register
          </button>
        </form>
      </div>
      <p className={`mt-8 text-xs ${COLORS.TEXT_MUTED} font-mono max-w-xs`}>
        Identify yourself to record your legacy on the Snake Game leaderboards.
      </p>
    </div>
  );
};

export default LoginPage;