import React, { useState } from 'react';
import axios from 'axios';

export const RegisterView: React.FC<{ darkMode: boolean; onSwitchToLogin: () => void }> = ({
  darkMode,
  onSwitchToLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        username,
        password,
      });
      setIsSuccess(true);
      setMessage('Registration complete! Redirecting to access gate...');
      setTimeout(() => onSwitchToLogin(), 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Registration sequence failure.');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center font-sans ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      <form
        onSubmit={handleRegister}
        className={`w-full max-w-sm p-8 rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
      >
        <div className="mb-6">
          <h2 className="text-xl font-black tracking-tight">Sign up</h2>
          <p className="text-xs text-slate-400 mt-1">Register your pipeline node credentials.</p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-xs font-semibold border ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
          >
            {isSuccess ? '✓' : '⚠️'} {message}
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
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
              placeholder="Choose identity tag"
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
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg"
        >
          Sign up
        </button>

        <p
          onClick={onSwitchToLogin}
          className="text-center text-[11px] text-indigo-400 hover:underline mt-4 cursor-pointer"
        >
          Already have a profile ? Log In
        </p>
      </form>
    </div>
  );
};
