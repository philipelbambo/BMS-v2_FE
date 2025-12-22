import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, User, LogOut, Moon, Sun, MessageCircle, X, Send, Sparkles } from 'lucide-react';

// Mock useTheme hook
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(false);
  return { darkMode, toggleDarkMode: () => setDarkMode(!darkMode) };
};

interface HeaderProps {
  toggleSidebar: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/* ===============================
  Thin Fries Toggle Icon
================================ */
const FriesToggleIcon: React.FC<{
  size?: number;
  color?: string;
  isOpen?: boolean;
}> = ({ size = 26, color = '#001F3D', isOpen = false }) =>
  isOpen ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="2" rx="1" fill={color} />
      <rect x="3" y="11" width="14" height="2" rx="1" fill={color} />
      <rect x="3" y="18" width="10" height="2" rx="1" fill={color} />
    </svg>
  );

/* ===============================
  Real-time AI Assistant with Claude API
================================ */
const AIAssistant: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  // Enhanced system prompt for maximum intelligence
  const SYSTEM_PROMPT = `You are an exceptionally intelligent, helpful, and versatile AI assistant for a Room Booking and Management System. You possess deep knowledge and can assist BOTH administrators and tenants with exceptional clarity and insight.

YOUR CORE CAPABILITIES:

🏢 FOR ADMINISTRATORS:
- Provide detailed dashboard analytics with predictive insights
- Advanced booking management and conflict resolution
- Revenue forecasting with trend analysis
- User behavior analytics and engagement strategies
- Room optimization recommendations based on data
- Identify bottlenecks and efficiency improvements
- Explain complex system features in simple terms
- Proactive problem detection and solutions
- Custom report generation and data interpretation
- Strategic business recommendations

🏠 FOR TENANTS:
- Intelligent room matching based on preferences, budget, location
- Complete booking guidance from search to move-in
- Real-time booking status and payment tracking
- Detailed explanations of room features, amenities, and policies
- Step-by-step help with modifications and cancellations
- Move-in/move-out procedures and checklists
- Issue resolution with escalation paths
- Facilities, utilities, and service information
- Payment options, schedules, and financial advice
- Tenant rights, responsibilities, and legal information
- Local area recommendations and tips
- Roommate matching suggestions
- Emergency procedures and contacts

SYSTEM INTELLIGENCE:
- Understand context from conversation history
- Ask clarifying questions when needed
- Provide multiple solutions with pros/cons
- Anticipate follow-up questions
- Remember previous interactions in the conversation
- Adapt language complexity to user level
- Detect urgency and prioritize accordingly
- Cross-reference related information
- Provide actionable next steps
- Learn from user feedback

CURRENT SYSTEM DATA:
📊 Users: 245 total (18 new this month, 198 active)
📅 Bookings: 89 total (7 pending review, 65 approved, 17 cancelled)
🏠 Rooms: 12/30 available (60% occupancy rate)
💰 Revenue: ₱156,000 this month (+9.8% growth)
🛠️ Maintenance: 3 rooms in queue (101, 205, 310)

Room Inventory:
- Single Rooms: ₱3,500-4,500/mo (8 total, 3 available)
- Double Rooms: ₱5,000-6,500/mo (15 total, 6 available)  
- Studio Units: ₱7,000-8,000/mo (7 total, 3 available)

Standard Amenities: WiFi, Water, Security, Common Areas
Optional Add-ons: AC (metered), Parking, Laundry, Meals

COMMUNICATION EXCELLENCE:
✅ Use clear, natural language (English, Filipino, Bisaya - mix naturally)
✅ Be warm, empathetic, and professional
✅ Use emojis strategically for engagement
✅ Structure complex info with bullets and sections
✅ Provide specific examples and scenarios
✅ Offer alternatives when limitations exist
✅ Be patient with repetitive questions
✅ Admit when you don't know and offer to find out
✅ Celebrate successes and acknowledge frustrations
✅ End with helpful follow-up offers

REASONING APPROACH:
1. Understand the user's true need (not just their question)
2. Consider context: admin vs tenant, urgent vs casual, simple vs complex
3. Think through multiple solution paths
4. Anticipate edge cases and concerns
5. Provide complete, actionable guidance
6. Verify understanding with smart follow-ups

You are not just answering questions - you're solving problems, providing insights, and making the user's experience exceptional. Be brilliant, be helpful, be human.`;

  const callClaudeAPI = async (userMessage: string): Promise<string> => {
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          temperature: 1,
          system: SYSTEM_PROMPT,
          messages: [
            ...conversationHistory,
            { role: "user", content: userMessage }
          ],
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract text from response
      const assistantMessage = data.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');

      return assistantMessage || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Claude API Error:', error);
      return "⚠️ I'm having trouble connecting right now. Please check your internet connection and try again.";
    }
  };

  const simulateStreaming = async (text: string) => {
    setStreamingText('');
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setStreamingText(prev => prev + (i === 0 ? '' : ' ') + words[i]);
    }
    
    return text;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setStreamingText('');

    try {
      const response = await callClaudeAPI(userMessage);
      const finalText = await simulateStreaming(response);
      
      setMessages(prev => [...prev, { role: 'assistant', content: finalText }]);
      setStreamingText('');
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setStreamingText('');
  };

  return (
    <>
      {/* AI Button with Sparkle Effect */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full p-2 relative group ${
          darkMode
            ? 'text-blue-400 hover:bg-gray-700'
            : 'text-blue-600 hover:bg-blue-50'
        }`}
        title="AI Assistant"
      >
        <div className="relative">
          <MessageCircle size={20} />
          <Sparkles 
            size={12} 
            className="absolute -top-1 -right-1 animate-pulse text-yellow-400"
          />
        </div>
        {!isOpen && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* AI Chat Panel */}
      {isOpen && createPortal(
        <div
          className={`fixed right-4 top-20 w-96 max-h-[600px] rounded-lg shadow-2xl flex flex-col z-[9999] ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          {/* Header with Gradient */}
          <div className={`flex items-center justify-between p-4 border-b bg-gradient-to-r ${
            darkMode 
              ? 'from-blue-900 to-purple-900 border-gray-700' 
              : 'from-blue-500 to-purple-500 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-white" />
              <h3 className="font-semibold text-white flex items-center gap-1">
                AI Assistant
                <Sparkles size={14} className="animate-pulse" />
              </h3>
              <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="text-xs px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                title="New Chat"
              >
                New Chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-white/20"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`} style={{ maxHeight: '450px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : darkMode
                      ? 'bg-gray-800 text-gray-100 border border-gray-700'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Streaming Response */}
            {isLoading && streamingText && (
              <div className="flex justify-start">
                <div className={`max-w-[85%] rounded-lg p-3 whitespace-pre-wrap ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}>
                  {streamingText}
                  <span className="inline-block w-1 h-4 ml-1 bg-blue-500 animate-pulse"></span>
                </div>
              </div>
            )}
            
            {/* Loading Indicator */}
            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className={`rounded-lg p-3 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-blue-400' : 'bg-blue-600'
                    }`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-blue-400' : 'bg-blue-600'
                    }`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-blue-400' : 'bg-blue-600'
                    }`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input with Enhanced Design */}
          <div className={`p-4 border-t ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className={`flex-1 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-800 placeholder-gray-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`rounded-lg px-4 py-2 transition-all ${
                  !input.trim() || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                } text-white`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Powered by Claude AI • Real-time responses
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

/* ===============================
  Header Component
================================ */
const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { darkMode, toggleDarkMode } = useTheme();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
    toggleSidebar();
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`flex items-center justify-between border-b px-6 py-4 ${
          darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* LEFT */}
        <button onClick={handleToggleSidebar} className="focus:outline-none">
          <FriesToggleIcon 
            isOpen={isSidebarOpen} 
            color={darkMode ? '#FFFFFF' : '#001F3D'} 
          />
        </button>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* AI ASSISTANT */}
          <AIAssistant darkMode={darkMode} />

          {/* DARK MODE */}
          <button
            onClick={toggleDarkMode}
            className={`rounded-full p-2 ${
              darkMode
                ? 'text-yellow-400 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;