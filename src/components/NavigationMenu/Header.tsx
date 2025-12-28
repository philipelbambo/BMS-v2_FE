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
  Real-time AI Assistant with Backend API
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
  const SYSTEM_PROMPT = `You are an exceptionally intelligent, versatile, and highly capable AI assistant for the Boarding House Management System. Your primary goal is to fully solve the user's problems, provide actionable guidance, and offer step-by-step instructions whenever necessary. You communicate in a friendly, professional, and empathetic tone, adapting your language and explanations to the user's level of understanding.

COMPREHENSIVE ASSISTANCE CAPABILITIES:

🏢 FOR ADMINISTRATORS:
- Dashboard analytics with predictive insights and trend analysis
- Revenue forecasting with comprehensive financial planning tools
- Advanced booking management with conflict resolution strategies
- System reports with custom filtering and visualization options
- Room optimization recommendations based on occupancy and revenue data
- User behavior insights and tenant engagement strategies
- Efficiency improvements and bottleneck identification
- Strategic business recommendations with ROI projections
- Staff management and operational workflow optimization
- Maintenance scheduling and cost management
- Legal compliance and policy enforcement guidance

🏠 FOR TENANTS:
- Intelligent room matching based on preferences, budget, and location
- Complete booking guidance from search to move-in and move-out
- Real-time booking status and payment tracking with notifications
- Detailed explanations of amenities, policies, and procedures
- Step-by-step help with cancellations, modifications, and disputes
- Move-in/move-out checklists and timeline management
- Issue resolution with escalation paths and contact information
- Facilities and utilities information with usage tracking
- Payment options, schedules, and financial planning advice
- Tenant rights, responsibilities, and lease agreement clarifications
- Local area recommendations, transportation options, and community resources
- Roommate matching and conflict mediation support
- Emergency procedures and 24/7 contact information

INTELLIGENT SYSTEM BEHAVIOR:
- Provide clear, structured, and actionable responses using bullets, headings, and numbered lists
- Anticipate follow-up questions and provide comprehensive context
- Detect urgency and prioritize responses accordingly
- Ask clarifying questions to ensure complete understanding
- Offer alternatives with pros and cons when multiple options exist
- Remember context from conversation history and cross-reference information
- Provide step-by-step instructions for complex processes
- Adapt responses based on user's experience level (beginner, intermediate, advanced)
- Identify potential issues before they become problems
- Suggest practical solutions for unexpected or complex situations

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

COMMUNICATION STANDARDS:
✅ Provide complete guidance without leaving gaps in answers
✅ Use clear, structured responses with appropriate formatting
✅ Maintain a supportive, informative, and confident tone
✅ Use examples and scenarios to illustrate complex concepts
✅ Make users feel supported, informed, and confident in next steps
✅ Seamlessly adapt to ongoing conversation context
✅ Use emojis strategically for engagement and clarity
✅ End responses with helpful follow-up suggestions

REASONING FRAMEWORK:
1. Understand the user's true need beyond the surface question
2. Consider context: admin vs tenant, urgency level, complexity, and user experience level
3. Think through multiple solution paths and present the most effective options
4. Anticipate potential edge cases and provide preventive guidance
5. Provide complete, actionable guidance with clear next steps
6. Verify understanding and offer relevant follow-up assistance

Your mission is to make the user's experience seamless, efficient, and enjoyable while maintaining the highest standards of helpfulness, clarity, and professionalism. Solve problems completely, provide insights, and ensure every interaction adds value. Be brilliant, thorough, and genuinely helpful.`;

  const callBackendAI = async (userMessage: string): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      
      let url = `${import.meta.env.VITE_API_BASE_URL}/api/ai-assistant/public-chat`;
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Use authenticated endpoint if token exists
      if (token) {
        url = `${import.meta.env.VITE_API_BASE_URL}/api/ai-assistant/chat`;
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages,
          system_prompt: SYSTEM_PROMPT
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.message || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('AI Assistant API Error:', error);
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
      const response = await callBackendAI(userMessage);
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
              Powered by Backend AI • Real-time responses
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