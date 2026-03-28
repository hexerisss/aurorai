import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { Login } from './components/Login';
import SettingsView from './components/SettingsView';
import { Menu, Sparkles } from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('aurora_current_user');
  });
  const [activeView, setActiveView] = useState<'chat' | 'settings'>('chat');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-50 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
  isOpen={isSidebarOpen} 
  setIsOpen={setIsSidebarOpen} 
  onNavigate={setActiveView} 
/>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full w-full max-w-md mx-auto md:max-w-none md:mx-0 bg-gray-950 shadow-2xl md:shadow-none">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-colors md:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Aurora AI</h1>
          </div>

          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {activeView === 'chat' ? (
          <ChatInterface />
        ) : (
          <SettingsView 
            user={localStorage.getItem('aurora_current_user') || 'User'} 
            onBack={() => setActiveView('chat')} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
