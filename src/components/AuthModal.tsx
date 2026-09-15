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
    localStorage.setItem('calorietracker_user_v1', JSON.stringify(userData));
    
    // Trigger PostHog and Google Analytics tracking
    if ((window as any).posthog) {
      (window as any).posthog.capture(isSignUp ? 'user_signed_up' : 'user_logged_in', { email: userData.email, method: 'email' });
      (window as any).posthog.identify(userData.email, { name: userData.name });
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', isSignUp ? 'sign_up' : 'login', { method: 'email' });
    }

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

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-semibold uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={(e) => {
              if ((window as any).posthog) (window as any).posthog.capture('social_login_click', { provider: 'google' });
              handleSubmit(e);
            }}
            className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button
            type="button"
            onClick={(e) => {
              if ((window as any).posthog) (window as any).posthog.capture('social_login_click', { provider: 'twitter' });
              handleSubmit(e);
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Twitter
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4 text-[#ff0050]" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.14.73-4.32 2.45-5.6 1.73-1.3 4.1-1.63 6.13-.86.15.06.31.14.46.2v4.06c-.84-.23-1.74-.29-2.61-.15-1.12.18-2.15.93-2.58 1.96-.34.8-.29 1.75.14 2.51.52.92 1.57 1.53 2.64 1.59 1.34.07 2.68-.53 3.39-1.63.49-.75.76-1.65.75-2.55V.02z"/></svg>
            TikTok
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c3.224 0 6.275-1.258 8.528-3.415.426-.41.341-1.096-.134-1.396-.583-.37-1.314-.078-1.579.576-.713 1.76-2.228 3.125-4.148 3.734-1.896.602-3.957.514-5.787-.249-1.874-.781-3.344-2.246-4.133-4.116C3.967 17.279 3.882 15.244 4.475 13.37c.585-1.85 1.91-3.35 3.708-4.195 1.841-.865 3.916-.976 5.82-.31 1.956.685 3.513 2.164 4.295 4.08.793 1.944.887 4.103.262 6.071-.479 1.503-1.42 2.784-2.715 3.655-.913.616-2.146.732-3.14.288-1.002-.448-1.636-1.392-1.674-2.482-.019-.537.117-1.077.387-1.547.46-.8 1.157-1.411 1.983-1.748.868-.354 1.826-.356 2.696.002.502.206.945.541 1.282.966.195-.515.275-1.066.234-1.616-.07-1.018-.466-1.986-1.127-2.756-.63-.734-1.47-1.267-2.394-1.517-1.008-.273-2.062-.23-3.037.126-.997.363-1.858 1.01-2.449 1.84-.572.802-.857 1.73-.811 2.651.045.9.366 1.758.914 2.441.564.704 1.341 1.196 2.215 1.402.731.173 1.492.128 2.2-.132.842-.31 1.554-.889 2.025-1.645-.253.948-.797 1.776-1.544 2.348-.739.566-1.69.805-2.607.653-1.026-.17-1.93-.761-2.529-1.649-.572-.85-.808-1.884-.658-2.906.136-.932.55-1.79 1.181-2.44.629-.646 1.439-1.078 2.317-1.238.99-.181 2.016-.01 2.902.488.756.425 1.353 1.076 1.688 1.844.331.758.423 1.61.261 2.408-.188.932-.693 1.761-1.431 2.355a3.864 3.864 0 0 1-2.417.84c-1.32-.016-2.548-.686-3.268-1.785-.693-1.06-1.013-2.338-.921-3.606.09-1.24.582-2.42 1.396-3.355.836-.962 2.001-1.64 3.256-1.905 1.258-.266 2.564-.176 3.754.262 1.166.429 2.19 1.189 2.902 2.164.735 1.006 1.129 2.214 1.127 3.447-.002 1.25-.398 2.47-1.127 3.484-.717 1-.1.218-.89 1.282-1.921 1.713C23.018 19.344 24 15.82 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Threads
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-400 pt-2">
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
