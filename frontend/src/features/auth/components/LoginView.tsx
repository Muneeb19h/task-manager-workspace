import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Added props to allow navigating back and forth with your new Registration card
interface LoginViewProps {
  darkMode: boolean;
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ darkMode, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      // Pass credentials and username into auth context (we'll display username capitalized)
      login(response.data.access, response.data.refresh, username);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { status?: number; data?: unknown } }).response
      ) {
        const response = (err as { response: { status?: number; data?: unknown } }).response;

        // Render a clean user-friendly alert if the database rejects the password match
        if (response.status === 401) {
          setError('Invalid system node credentials or access denied.');
        } else {
          setError(`Server Error Status: ${response.status} - ${JSON.stringify(response.data)}`);
        }
      } else {
        const message = err instanceof Error ? err.message : String(err);
        setError(`Network/CORS Connection Blocked: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center font-sans transition-colors ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm p-8 rounded-2xl border shadow-2xl transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="mb-6">
          <h2 className="text-xl font-black tracking-tight">Login</h2>
          <p className="text-xs text-slate-400 mt-1">Authenticate identity node credentials.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                darkMode
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
              placeholder="Enter developer identity"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                darkMode
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
        >
          {loading ? 'Authenticating Gateway...' : 'Login'}
        </button>

        {/* Navigation Toggle Trigger to swap over to your new creation component */}
        <p
          onClick={onSwitchToRegister}
          className="text-center text-[11px] text-indigo-400 hover:underline mt-4 cursor-pointer font-medium tracking-wide transition-all"
        >
          Don't have an Account? Register Here
        </p>
      </form>
    </div>
  );
};
