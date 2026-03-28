import { MessageSquare, Plus, Settings, History, User, LogOut, Sparkles, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { updateProfile } from '../services/auth';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Sidebar = ({ isOpen, setIsOpen, onLogout }: SidebarProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('aurora_current_user') || 'User');
  const chatHistory = [
    "Productivity hack ideas",
    "Code debugging help",
    "Creative writing prompt",
    "Travel itinerary Tokyo",
  ];

  const handleProfileUpdate = async () => {
    setProfileError('');
    setProfileSuccess('');

    const requestedUsername = prompt('Enter a new username (leave blank to keep current):')?.trim() || '';
    const requestedPassword = prompt('Enter a new password (leave blank to keep current):')?.trim() || '';

    if (!requestedUsername && !requestedPassword) {
      setProfileError('No changes were provided.');
      return;
    }

    try {
      const result = await updateProfile(currentUser, {
        newUsername: requestedUsername || undefined,
        newPassword: requestedPassword || undefined,
      });

      const nextUsername = result.user?.username || currentUser;
      localStorage.setItem('aurora_current_user', nextUsername);
      setCurrentUser(nextUsername);
      setProfileSuccess('Profile updated.');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to update profile.');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-gray-950 border-r border-gray-800 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Aurora AI</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                >
                  <span className="md:hidden">✕</span>
                </button>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 transition-all text-white font-medium shadow-lg shadow-indigo-500/20 active:scale-95">
                <Plus size={20} />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                Recent Chats
              </div>
              <div className="space-y-1">
                {chatHistory.map((chat, idx) => (
                  <button 
                    key={idx}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/80 text-gray-300 text-sm transition-colors text-left"
                  >
                    <MessageSquare size={16} className="text-gray-500" />
                    <span className="truncate">{chat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800/60 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/80 text-gray-300 text-sm transition-colors">
                <History size={16} className="text-gray-500" />
                History
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/80 text-gray-300 text-sm transition-colors"
              >
                <Settings size={16} className="text-gray-500" />
                Settings
              </button>
              <div className="pt-4 border-t border-gray-800/60 mt-2">
                <button 
                  onClick={() => setShowProfile(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/80 text-gray-300 text-sm transition-colors"
                >
                  <User size={16} className="text-gray-500" />
                  My Account
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/20 text-red-400 text-sm transition-colors mt-1"
                >
                  <LogOut size={16} className="text-red-500" />
                  Logout
                </button>
              </div>
            </div>
            
            {/* Settings Modal */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-950 z-50 flex flex-col"
                >
                  <div className="p-6 border-b border-gray-800/60">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Settings</h2>
                      <button 
                        onClick={() => setShowSettings(false)}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                        <div>
                          <h3 className="text-white font-medium">Dark Mode</h3>
                          <p className="text-gray-400 text-sm">Toggle dark theme</p>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-colors",
                            darkMode ? "bg-indigo-600" : "bg-gray-700"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 bg-white rounded-full transition-transform",
                            darkMode ? "translate-x-6" : "translate-x-0.5"
                          )} />
                        </button>
                      </div>
                      
                      <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                        <h3 className="text-white font-medium mb-2">About Aurora AI</h3>
                        <p className="text-gray-400 text-sm">Version 1.0.0</p>
                        <p className="text-gray-400 text-sm mt-1">Your personal AI companion</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Profile Modal */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-950 z-50 flex flex-col"
                >
                  <div className="p-6 border-b border-gray-800/60">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">My Account</h2>
                      <button 
                        onClick={() => setShowProfile(false)}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <User size={40} className="text-white" />
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="text-white text-xl font-bold">{currentUser}</h3>
                          <button 
                            onClick={handleProfileUpdate}
                            className="p-1 hover:bg-gray-800 rounded-md text-gray-400 hover:text-indigo-400 transition-colors"
                          >
                            <Settings2 size={14} />
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm">Username</p>
                        {profileError && <p className="text-red-400 text-xs mt-2">{profileError}</p>}
                        {profileSuccess && <p className="text-emerald-400 text-xs mt-2">{profileSuccess}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                        <h3 className="text-white font-medium mb-2">Account Info</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Member Since</span>
                            <span className="text-gray-200">Today</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          onLogout();
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
                      >
                        <LogOut size={20} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
