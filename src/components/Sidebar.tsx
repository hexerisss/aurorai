import { MessageSquare, Plus, Settings, History, User, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const chatHistory = [
    "Productivity hack ideas",
    "Code debugging help",
    "Creative writing prompt",
    "Travel itinerary Tokyo",
  ];

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
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/80 text-gray-300 text-sm transition-colors">
                <Settings size={16} className="text-gray-500" />
                Settings
              </button>
              <div className="pt-4 border-t border-gray-800/60 mt-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/80 text-gray-300 text-sm transition-colors">
                  <User size={16} className="text-gray-500" />
                  My Account
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/20 text-red-400 text-sm transition-colors mt-1"
                >
                  <LogOut size={16} className="text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
