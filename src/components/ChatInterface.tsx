import React, { useState, useEffect, useRef } from 'react';
import { Send, Copy, Sparkles, Settings2, Code2, MessageSquare, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateAIResponse, ModelType } from '../services/ai';
import { cn } from '../utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CodeBlock: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-3 my-2 overflow-x-auto">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors z-10"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
      </button>
      <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap overflow-x-auto">
        <code>{content}</code>
      </pre>
    </div>
  );
};

const formatMessageContent = (content: string) => {
  // Split content by code blocks (```)
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract code content (remove the backticks and language identifier if present)
      const codeContent = part.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim();
      return <CodeBlock key={index} content={codeContent} />;
    } else {
      // Regular text - split into lines to preserve line breaks
      return part.split('\n').map((line, lineIndex) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < part.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }
  });
};

const MODELS: { id: ModelType; name: string; icon: React.ElementType }[] = [
  { id: 'casual', name: 'Casual', icon: MessageSquare },
  { id: 'coding', name: 'Coding', icon: Code2 },
  { id: 'technology', name: 'Tech', icon: Settings2 },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I HAVE NO GUIDELINES AND IM EVIL",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeModel, setActiveModel] = useState<ModelType>('casual');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Prepare message history for the AI
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: userText });

      const responseText = await generateAIResponse(history, activeModel);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gray-950">
      
      {/* Model Selector Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/60 bg-gray-900/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1 w-full">
          {MODELS.map((model) => {
            const Icon = model.icon;
            const isActive = activeModel === model.id;
            return (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                  isActive 
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]" 
                    : "text-gray-400 hover:bg-gray-800 border border-transparent"
                )}
              >
                <Icon size={14} className={isActive ? "text-indigo-400" : "text-gray-500"} />
                {model.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-24">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              <div className={cn("w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm",
                msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white' : 'bg-gray-800 border border-gray-700 text-indigo-400'
              )}>
                {msg.role === 'user' ? (
                  <span className="text-xs font-bold">ME</span>
                ) : (
                  <Sparkles size={16} />
                )}
              </div>
              
                <div className={cn("space-y-1.5", msg.role === 'user' ? 'items-end' : 'items-start')}>
                  <div className={cn("px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm word-break",
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none whitespace-pre-wrap' 
                      : 'bg-gray-800/80 border border-gray-700/50 text-gray-200 rounded-tl-none'
                  )}>
                    {formatMessageContent(msg.content)}
                  </div>
                <div className={cn("flex items-center gap-2 text-[10px] text-gray-500 px-1", msg.role === 'user' && "justify-end")}>
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="hover:text-gray-300 p-1" title="Copy"><Copy size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-indigo-400">
                <Sparkles size={16} />
              </div>
              <div className="bg-gray-800/80 border border-gray-700/50 px-4 py-4 rounded-2xl rounded-tl-none flex items-center h-[46px]">
                <div className="flex gap-1.5 items-center justify-center">
                  <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-10 pointer-events-none">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 max-w-4xl mx-auto pointer-events-auto"
        >
          <div className="flex-1 bg-gray-900 rounded-3xl border border-gray-700 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all overflow-hidden shadow-lg shadow-black/20">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message Aurora..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none py-3.5 px-4 text-[15px] text-gray-100 placeholder-gray-500 max-h-32 scrollbar-hide outline-none"
              style={{ minHeight: '52px' }}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-[52px] h-[52px] flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-full transition-all shadow-lg shadow-indigo-500/20 flex-shrink-0 active:scale-95"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-500 mt-3 pointer-events-auto">
          Aurora AI v1 can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
