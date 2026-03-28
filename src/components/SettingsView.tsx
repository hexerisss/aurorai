import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Bell, Moon, Shield, Save } from 'lucide-react';
import { cn } from '../utils/cn';

interface SettingsViewProps {
  user: string;
  onBack: () => void;
}

const SettingsView = ({ user, onBack }: SettingsViewProps) => {
  const [username, setUsername] = useState(user);
  const [password, setPassword] = useState('********');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [privacy, setPrivacy] = useState('Private');

  const handleSave = () => {
    localStorage.setItem('aurora_current_user', username);
    // In a real app, you'd hit your DATABASE_URL here
    alert('Profile updated successfully!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col bg-gray-950 text-gray-100 overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-800 flex items-center gap-4 sticky top-0 bg-gray-950/80 backdrop-blur-md z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">Settings & Profile</h2>
      </div>

      <div className="p-6 space-y-8 max-w-2xl mx-auto w-full">
        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
            <User size={16} />
            <span>Account Profile</span>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 ml-1">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500 ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
            <Bell size={16} />
            <span>Preferences</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <Moon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-gray-500">Optimize for night viewing</p>
                </div>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "w-11 h-6 rounded-full transition-all relative",
                  darkMode ? "bg-indigo-600" : "bg-gray-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  darkMode ? "left-6" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Privacy Mode</p>
                  <p className="text-xs text-gray-500">Limit data collection</p>
                </div>
              </div>
              <select 
                value={privacy} 
                onChange={(e) => setPrivacy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none"
              >
                <option>Private</option>
                <option>Standard</option>
                <option>Open</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-gray-500">Get alerts for new updates</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={cn(
                  "w-11 h-6 rounded-full transition-all relative",
                  notifications ? "bg-indigo-600" : "bg-gray-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  notifications ? "left-6" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
