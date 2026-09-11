import React, { useState } from 'react';
import { X, Lock, Mail, User, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; name: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Save auth session locally
    const userData = {
      email,
      name: isSignUp ? name : email.split('@')[0],
    };
    localStorage.setItem('nutrisnap_user_v1', JSON.stringify(userData));
    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 text-xs">
            {isSignUp
              ? 'Sign up to sync your AI meal logs and daily/weekly/monthly history'
              : 'Log in with your password to view your calorie history'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>{isSignUp ? 'Create Free Account' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
