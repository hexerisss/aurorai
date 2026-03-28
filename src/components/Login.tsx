import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { signIn, signUp } from '../services/auth';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();

    try {
      if (isLoginView) {
        const result = await signIn(normalizedUsername, normalizedPassword);
        localStorage.setItem('aurora_current_user', result.user?.username || normalizedUsername);
        onLogin();
      } else {
        const result = await signUp(normalizedUsername, normalizedPassword);
        localStorage.setItem('aurora_current_user', result.user?.username || normalizedUsername);
        onLogin();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden px-6 pb-20 pt-10 font-sans selection:bg-indigo-500/30">
      
      {/* Background Aurora Elements */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm z-10 flex flex-col items-center"
      >
        <div className="mb-10 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 blur-xl opacity-50 rounded-full" />
            <div className="relative w-20 h-20 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-fuchsia-400" strokeWidth={1.5} />
              <svg className="absolute w-10 h-10" viewBox="0 0 24 24" fill="url(#gradient)" stroke="none">
                 <defs>
                   <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop stopColor="#818CF8" offset="0%" />
                     <stop stopColor="#C026D3" offset="100%" />
                   </linearGradient>
                 </defs>
                 <Sparkles stroke="none" fill="url(#gradient)" className="w-10 h-10 absolute inset-0 m-auto opacity-70"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Aurora AI</h1>
          <p className="text-gray-400 text-sm text-center font-medium">Your personal intelligence companion</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full pl-11 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-[16px] backdrop-blur-sm shadow-inner"
                placeholder="Username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-11 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-[16px] backdrop-blur-sm shadow-inner"
                placeholder="Password"
              />
            </div>
            {isLoginView && (
              <div className="flex justify-end pt-1">
                <button type="button" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-[16px] font-semibold text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 ease-out active:scale-[0.98]",
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:shadow-indigo-500/25"
            )}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLoginView ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">{isLoginView ? "Don't have an account? " : "Already have an account? "}</span>
          <button 
            type="button" 
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isLoginView ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
