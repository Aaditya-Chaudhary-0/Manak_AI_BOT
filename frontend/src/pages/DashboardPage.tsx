import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Search, ShieldCheck, FileCheck2, 
  MessageSquare, ListTree, History, User, Lock, 
  FileText, CheckCircle, ExternalLink, HelpCircle,
  Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

function DashboardPage() {
  const navigate = useNavigate();
  const { user, history, savedStandards } = useApp();
  const [heroSearch, setHeroSearch] = useState('');
  const [miniChatOpen, setMiniChatOpen] = useState(false);
  const [miniChatMsgs, setMiniChatMsgs] = useState<{ role: 'user' | 'assistant', text: string, link?: string }[]>([
    { role: 'assistant', text: 'Need help finding the right section?' }
  ]);
  const [miniChatInput, setMiniChatInput] = useState('');

  const features = [
    { id: 1, icon: MessageSquare, title: 'AI BIS Assistant', desc: 'Chat interface for standards queries.', link: '/app/assistant' },
    { id: 2, icon: Search, title: 'Standards Search', desc: 'Semantic search across documents.', link: '/app/standards' },
    { id: 3, icon: ListTree, title: 'Product Recommendation', desc: 'Map products to IS codes.', link: '/app/recommend' },
    { id: 4, icon: FileCheck2, title: 'Citation System', desc: 'Robust evidence linking for claims.', link: '/app/assistant' },
    { id: 5, icon: FileText, title: 'Standard Detail', desc: 'Deep dive into requirements.', link: '/app/standards' },
    { id: 6, icon: ShieldCheck, title: 'Certification Guidance', desc: 'Step-by-step help for certification.', link: '/app/certification' },
    { id: 7, icon: Bookmark, title: 'Saved Standards', desc: 'Directly view bookmarked IS specifications.', link: '/app/saved' },
    { id: 8, icon: User, title: 'User Profile & Settings', desc: 'Manage profile, organization and language.', link: '/app/profile' },
    { id: 9, icon: History, title: 'History & Activity', desc: 'Track previous searches, chats and matches.', link: '/app/history' },
    { id: 10, icon: Lock, title: 'Admin Dashboard', desc: 'Manage sources and content.', link: '/admin/dashboard' },
  ];

  const handleMiniChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniChatInput.trim()) return;

    const userText = miniChatInput;
    setMiniChatMsgs(prev => [...prev, { role: 'user', text: userText }]);
    setMiniChatInput('');

    // Mock rule-based response
    setTimeout(() => {
      let reply = "I can help you navigate. Try 'standards' or 'history'.";
      let navLink = undefined;
      const lower = userText.toLowerCase();

      if (lower.includes('standard') && lower.includes('product')) {
        reply = "Use Product → Standard Recommendation.";
        navLink = "/app/recommend";
      } else if (lower.includes('standard') || lower.includes('search')) {
        reply = "Open Standards Search.";
        navLink = "/app/standards";
      } else if (lower.includes('history') || lower.includes('previous')) {
        reply = "Go to History.";
        navLink = "/app/history";
      } else if (lower.includes('certif')) {
        reply = "Check Certification Guidance.";
        navLink = "/app/certification";
      }

      setMiniChatMsgs(prev => [...prev, { role: 'assistant', text: reply, link: navLink }]);
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 4. MAIN HERO: MANAK AI BIS ASSISTANT */}
      <section className="bg-white pt-10 pb-16 px-6 border-b border-gray-100 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Welcome back, {user.fullName}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{savedStandards.length} Saved Standards</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{history.length} Recent Activities</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            MANAK AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Ask anything about BIS Standards. Describe your product, requirement or question in simple language.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/app/assistant');
            }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-4 items-center focus-within:border-blue-300 focus-within:shadow-md transition-all"
          >
            <input 
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="What do you want to know about BIS?"
              className="flex-1 w-full text-lg outline-none text-gray-800 bg-transparent py-2"
            />
            <button 
              type="submit"
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Ask Manak AI
            </button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 text-sm"
          >
            <button 
              onClick={() => navigate('/app/assistant')}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-full transition-colors"
            >
              "Which BIS standard applies to LED bulbs?"
            </button>
            <button 
              onClick={() => navigate('/app/assistant')}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-full transition-colors"
            >
              "What certification is required for my product?"
            </button>
            <button 
              onClick={() => navigate('/app/assistant')}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-full transition-colors"
            >
              "Find the relevant standard for this product."
            </button>
          </motion.div>
        </div>
      </section>

      {/* 5. TEN PLATFORM FEATURES */}
      <section className="py-16 bg-gray-50 border-b border-gray-100 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
            Platform Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (i * 0.05) }}
              >
                <Link 
                  to={f.link}
                  className="group flex flex-col h-full bg-white border border-gray-200 p-5 rounded-xl hover:-translate-y-1 hover:border-blue-200 hover:shadow-md transition-all duration-200 ease-out"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-600 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base">{f.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 flex-1 mb-4 leading-relaxed">{f.desc}</p>
                  <span className="text-blue-600 text-xs font-medium flex items-center uppercase tracking-wide">
                    Open <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EVIDENCE TRUST SECTION */}
      <section className="py-16 bg-white border-b border-gray-100 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How Manak AI works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-700 mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-800">AI Explanation</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 hidden md:block" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-800">Relevant Standard</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 hidden md:block" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-800">Official Evidence</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 hidden md:block" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-800">User Verification</span>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-600 max-w-lg mx-auto">
            AI helps interpret information, while official BIS sources provide authoritative reference so you can always verify the source.
          </p>
        </div>
      </section>

      {/* 6. OFFICIAL BIS DATA / SOURCE NOTICE */}
      <section className="py-12 bg-gray-50 px-6">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
          <ShieldCheck className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Information and standards references are based on official BIS sources.</h3>
          <p className="text-sm text-gray-600 mb-4">Official Source: Bureau of Indian Standards</p>
          <a href="#" className="inline-flex items-center text-blue-600 text-sm font-medium hover:underline">
            View Official Source <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </section>

      {/* 8. MINI MANAK AI GUIDE */}
      <div className="fixed bottom-6 right-6 z-50">
        {!miniChatOpen ? (
          <button 
            onClick={() => setMiniChatOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5 py-3 shadow-lg flex items-center font-medium transition-transform hover:scale-105"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Ask Manak
          </button>
        ) : (
          <div className="bg-white border border-gray-200 shadow-2xl rounded-xl w-[320px] flex flex-col h-[400px] overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" /> Manak AI Guide
              </span>
              <button onClick={() => setMiniChatOpen(false)} className="text-gray-300 hover:text-white">&times;</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
              {miniChatMsgs.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                  {msg.link && (
                    <Link to={msg.link} className="mt-2 inline-flex items-center text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                      Go There <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
                <button onClick={() => setMiniChatInput("Find a Standard")} className="whitespace-nowrap text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded">Find a Standard</button>
                <button onClick={() => setMiniChatInput("Check Certification")} className="whitespace-nowrap text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded">Check Certification</button>
                <button onClick={() => setMiniChatInput("View History")} className="whitespace-nowrap text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded">View History</button>
              </div>
              <form onSubmit={handleMiniChatSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={miniChatInput}
                  onChange={(e) => setMiniChatInput(e.target.value)}
                  placeholder="Tell me what you're looking for..."
                  className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </form>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default DashboardPage;
