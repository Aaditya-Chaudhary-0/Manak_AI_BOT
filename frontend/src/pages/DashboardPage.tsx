import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Search, ShieldCheck, FileCheck2, 
  MessageSquare, ListTree, History, User, Lock, 
  FileText, CheckCircle, ExternalLink, Bookmark, Sparkles
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, history, savedStandards } = useApp();
  const [heroSearch, setHeroSearch] = useState('');

  const features = [
    { id: 1, icon: MessageSquare, title: 'AI BIS Assistant', desc: 'Interactive chat interface for BIS standards, testing, and queries.', link: '/app/assistant', badge: 'Core' },
    { id: 2, icon: Search, title: 'Standards Search', desc: 'Semantic search and advanced filters across official Indian Standards.', link: '/app/standards' },
    { id: 3, icon: ListTree, title: 'Product Matcher', desc: 'Multi-step wizard to map your product details to IS codes.', link: '/app/recommend' },
    { id: 4, icon: FileCheck2, title: 'Evidence Citations', desc: 'Verifiable citations linking answers to official BIS gazettes & clauses.', link: '/app/assistant' },
    { id: 5, icon: FileText, title: 'Standard Detail', desc: 'Deep dive into scope, key requirements, and clauses for any standard.', link: '/app/standards' },
    { id: 6, icon: ShieldCheck, title: 'Certification Guidance', desc: 'Step-by-step roadmap for ISI Mark Scheme-I & CRS certification.', link: '/app/certification' },
    { id: 7, icon: Bookmark, title: 'Saved Standards', desc: 'Directly view and manage bookmarked Indian Standards.', link: '/app/saved' },
    { id: 8, icon: User, title: 'User Profile & Settings', desc: 'Manage organization details, sector, and bilingual preferences.', link: '/app/profile' },
    { id: 9, icon: History, title: 'History & Activity', desc: 'Track and review previous queries, recommendations, and searches.', link: '/app/history' },
    { id: 10, icon: Lock, title: 'Admin Console', desc: 'Governance console for platform sources, queue, and verification.', link: '/admin' },
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = heroSearch.trim() || 'Which BIS standard applies to LED bulbs?';
    navigate('/app/assistant', { state: { initialQuery: query } });
  };

  const handlePromptClick = (query: string) => {
    navigate('/app/assistant', { state: { initialQuery: query } });
  };

  return (
    <AppLayout
      pageTitle="MANAK AI Dashboard"
      pageSubtitle="Bureau of Indian Standards Intelligence & Compliance Workspace"
    >
      <div className="min-h-full bg-[#F7F8FA] pb-16">
        {/* 1. HERO: MAIN MANAK AI ASSISTANT SECTION */}
        <section className="bg-white border-b border-gray-200 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* User status badge */}
            <motion.div 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 px-3.5 py-1 rounded-full text-xs font-semibold text-gray-700 mb-4 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#D7193F]"></span>
              <span>Welcome back, {user.fullName}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-normal">{savedStandards.length} Saved Standards</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-normal">{history.length} Recent Activities</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight"
            >
              MANAK <span className="text-[#D7193F]">AI</span> Assistant
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Ask anything about Bureau of Indian Standards. Describe your product, regulatory requirement, or test parameters in plain language.
            </motion.p>
            
            {/* Main AI Input Form - Navigates directly to /app/assistant with query */}
            <motion.form 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              onSubmit={handleHeroSubmit}
              className="bg-white border-2 border-gray-200 focus-within:border-[#D7193F] focus-within:ring-4 focus-within:ring-red-50 rounded-2xl shadow-sm p-2 sm:p-3 mb-5 flex flex-col sm:flex-row gap-2 items-center transition-all"
            >
              <div className="pl-3 text-gray-400 hidden sm:block">
                <Sparkles className="w-5 h-5 text-[#D7193F]" />
              </div>
              <input 
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="What do you want to know about BIS standards, products, or certification?"
                className="flex-1 w-full text-sm sm:text-base outline-none text-gray-900 placeholder:text-gray-400 bg-transparent px-2 py-2"
                aria-label="Ask Manak AI a question"
              />
              <button 
                type="submit"
                className="w-full sm:w-auto bg-[#D7193F] hover:bg-[#BE1435] active:scale-98 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-xs shrink-0 flex items-center justify-center space-x-2"
              >
                <span>Ask Manak AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>

            {/* Quick Suggestion Chips */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 text-xs"
            >
              <span className="text-gray-400 font-medium py-1">Try asking:</span>
              <button 
                type="button"
                onClick={() => handlePromptClick("Which BIS standard applies to LED bulbs?")}
                className="px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-[#D7193F] hover:border-red-200 border border-gray-200 text-gray-700 rounded-full transition-colors font-medium cursor-pointer"
              >
                "Which BIS standard applies to LED bulbs?"
              </button>
              <button 
                type="button"
                onClick={() => handlePromptClick("What standard is relevant for Ordinary Portland Cement?")}
                className="px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-[#D7193F] hover:border-red-200 border border-gray-200 text-gray-700 rounded-full transition-colors font-medium cursor-pointer"
              >
                "What standard is relevant for Ordinary Portland Cement?"
              </button>
              <button 
                type="button"
                onClick={() => handlePromptClick("How can I find the certification requirements for my product under Scheme-I?")}
                className="px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-[#D7193F] hover:border-red-200 border border-gray-200 text-gray-700 rounded-full transition-colors font-medium cursor-pointer"
              >
                "Certification requirements under Scheme-I"
              </button>
            </motion.div>
          </div>
        </section>

        {/* 2. PLATFORM CAPABILITIES / FEATURE CARDS */}
        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Platform Capabilities
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dedicated toolsets for standards discovery, product matching, and conformity verification
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.03 * i }}
                >
                  <Link 
                    to={f.link}
                    className="group flex flex-col h-full bg-white border border-gray-200 p-5 rounded-xl hover:-translate-y-1 hover:border-[#1677B7]/40 hover:shadow-md transition-all duration-200 ease-out shadow-2xs relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-gray-50 p-2.5 rounded-lg text-gray-700 group-hover:text-[#D7193F] group-hover:bg-red-50 transition-colors border border-gray-100">
                        <f.icon className="w-5 h-5" />
                      </div>
                      {f.badge && (
                        <span className="text-[10px] font-bold text-[#D7193F] bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-wider">
                          {f.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-[#D7193F] transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-xs text-gray-600 flex-1 mb-4 leading-relaxed">
                      {f.desc}
                    </p>
                    <div className="text-[#1677B7] text-xs font-semibold flex items-center pt-2 border-t border-gray-50 group-hover:text-[#D7193F] transition-colors">
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. EVIDENCE TRUST & VERIFICATION ARCHITECTURE */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 border-t border-b border-gray-200/80 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[11px] font-bold text-[#1677B7] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
              Authoritative Reference Model
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-2 tracking-tight">
              How MANAK AI Grounds Every Response
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              AI interprets and searches natural language, while official BIS gazettes, standard specifications, and Quality Control Orders provide verifiable ground truth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-800 shadow-2xs">
                  <MessageSquare className="w-5 h-5 text-[#D7193F]" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">1. Natural Query</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Describe product parameters, voltage ratings, or testing questions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-800 shadow-2xs">
                  <FileText className="w-5 h-5 text-[#1677B7]" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">2. Standards Match</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Maps product to official IS codes across 14 technical divisions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-800 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[#1677B7]" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">3. Official Evidence</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cites exact clauses, gazette notifications, and QCO mandates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-800 shadow-2xs">
                  <CheckCircle className="w-5 h-5 text-[#0E8A43]" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">4. User Verification</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Direct external links to verify against official BIS portals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. OFFICIAL BIS SOURCE NOTICE */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#1677B7]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Authoritative Reference: Bureau of Indian Standards
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Standards references are indexed from official BIS specifications and gazettes.
                </p>
              </div>
            </div>
            <a 
              href="https://www.services.bis.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#1677B7] bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-colors shrink-0"
            >
              <span>Visit Official BIS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default DashboardPage;
