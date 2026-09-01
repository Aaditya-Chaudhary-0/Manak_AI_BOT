import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Brain, FileCheck2, Languages,
  Search, MessageSquare, ListTree, History, User, Lock, ExternalLink,
  CheckCircle, ThumbsUp, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../styles/animation';

function HomePage() {
  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-red-100 selection:text-red-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-50 via-white to-white opacity-70"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.p variants={fadeUp} className="text-red-600 font-semibold tracking-wide text-sm uppercase mb-3">BIS Intelligence Assistant</motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                Ask BIS anything.<br/>
                <span className="text-gray-500">Backed by official sources.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                Ask questions in natural language, discover relevant standards, understand certification requirements and verify answers using authentic BIS data.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg text-white px-6 py-3 rounded-md text-base font-medium inline-flex items-center justify-center transition-all duration-300">
                  Start Assistant <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="bg-white hover:bg-gray-50 hover:scale-105 text-gray-900 border border-gray-300 px-6 py-3 rounded-md text-base font-medium inline-flex items-center justify-center transition-all duration-300 shadow-sm">
                  Explore Standards
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Hero Right - Product Preview Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative"
            >
              <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[400px] transform hover:-translate-y-2 transition-transform duration-500">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="flex items-start gap-3 justify-end"
                  >
                    <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-lg rounded-tr-none text-sm max-w-[80%] shadow-sm">
                      What are the safety requirements for electric irons?
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Brain className="w-4 h-4 text-gray-700" />
                    </div>
                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-lg rounded-tl-none text-sm text-gray-800 w-full shadow-sm">
                      <p className="mb-2">According to <strong>IS 302-2-3 (2007)</strong>, electric irons must meet specific safety criteria:</p>
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                        className="bg-white border border-gray-200 rounded p-3 my-2 text-xs"
                      >
                        <div className="flex items-center gap-2 mb-1 text-blue-700 font-medium">
                          <ShieldCheck className="w-3 h-3" /> Evidence Source
                        </div>
                        <p className="text-gray-600 italic">"The temperature of the handle shall not exceed 60°C during normal operation..."</p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
                        className="flex items-center gap-2 mt-3 text-xs"
                      >
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">High Confidence</span>
                        <span className="text-gray-500">IS 302-2-3:2007</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { icon: ShieldCheck, color: "text-blue-600", title: "Official Sources", desc: "Answers are grounded in authoritative BIS data and Indian Standards." },
              { icon: Brain, color: "text-red-600", title: "Standards Intelligence", desc: "AI understands complex contexts to find relevant standards faster." },
              { icon: FileCheck2, color: "text-blue-600", title: "Evidence-backed", desc: "See the exact official source behind every generated answer." },
              { icon: Languages, color: "text-red-600", title: "English & Hindi", desc: "Ask questions and understand requirements in your preferred language." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Four simple steps to get accurate, standards-compliant answers.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8 relative"
          >
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0">
              <motion.div 
                initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }}
                className="h-full bg-red-200"
              />
            </div>
            {[
              { num: '01', title: 'Ask', desc: 'Describe your product or query in plain language.' },
              { num: '02', title: 'Understand', desc: 'AI interprets the context and intent.' },
              { num: '03', title: 'Retrieve Evidence', desc: 'System finds relevant official standard clauses.' },
              { num: '04', title: 'Answer & Verify', desc: 'Get a clear answer with direct citations.' }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="relative z-10 text-center flex flex-col items-center group">
                <div className="w-24 h-24 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:border-red-400 group-hover:shadow-md transition-all duration-300">
                  <span className="text-2xl font-bold text-red-600">{step.num}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why MANAK AI (Comparison) */}
      <section className="py-24 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Why MANAK AI?</h2>
            <p className="mt-4 text-lg text-gray-600">A paradigm shift in discovering standards.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Traditional Search</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></div>
                  Need exact keywords or standard numbers
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></div>
                  Open multiple large PDF documents
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></div>
                  Read and interpret context manually
                </li>
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl border border-blue-200 shadow-md relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-300"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                MANAK AI
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">New Way</span>
              </h3>
              <ul className="space-y-4">
                {[
                  "Describe your problem naturally",
                  "AI understands context automatically",
                  "Find relevant standards instantly",
                  "Get explanations backed by evidence"
                ].map((text, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.1 }} viewport={{ once: true }}
                    className="flex items-start text-sm text-gray-800 font-medium"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    {text}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Everything You Need</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful tools for businesses and individuals.</p>
          </motion.div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {[
              { icon: MessageSquare, title: 'AI BIS Assistant', desc: 'Chat interface for all your standards queries.' },
              { icon: Search, title: 'Standards Search', desc: 'Semantic search across all BIS documents.' },
              { icon: ListTree, title: 'Product Recommendation', desc: 'Map products to applicable IS codes.' },
              { icon: FileCheck2, title: 'Citation System', desc: 'Robust evidence linking for every claim.' },
              { icon: FileText, title: 'Standard Detail', desc: 'Deep dive into specific standard requirements.' },
              { icon: ShieldCheck, title: 'Certification Guidance', desc: 'Step-by-step help for BIS certification.' },
              { icon: Languages, title: 'English + Hindi', desc: 'Full bilingual support for all features.' },
              { icon: User, title: 'User Dashboard', desc: 'Manage your profile and preferences.' },
              { icon: History, title: 'History & Saved', desc: 'Keep track of previous queries and bookmarks.' },
              { icon: Lock, title: 'Admin Dashboard', desc: 'Management interface for system administrators.' },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-1 hover:border-red-200 transition-all duration-300 bg-white group cursor-pointer">
                <feature.icon className="w-6 h-6 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Evidence Preview */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Trust but Verify</h2>
            <p className="mt-4 text-lg text-gray-600">Every answer is backed by verifiable evidence.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Official Source
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Bureau of Indian Standards</h3>
                <p className="text-gray-600 font-medium mb-6">IS 302-2-3: 2007</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 hover:bg-gray-100 transition-colors">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Evidence Snippet</h4>
                  <p className="text-gray-700 italic border-l-2 border-red-500 pl-4">
                    "The product must meet the safety standards outlined in Section 4. The temperature of the external casing shall not exceed safety limits under normal operating conditions."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">AI Confidence:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> High
                  </span>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <button className="bg-white border border-gray-300 hover:bg-gray-50 hover:shadow text-gray-900 px-6 py-3 rounded-md text-sm font-medium transition-all flex items-center">
                  View Source Document <ExternalLink className="w-4 h-4 ml-2 text-gray-500" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800 via-blue-900 to-blue-900 opacity-50"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Find the right BIS information faster.</h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Search, understand and verify Indian Standards with one intelligent interface.
          </p>
          <Link to="/login" className="bg-red-600 hover:bg-red-500 hover:scale-105 text-white px-8 py-4 rounded-md text-lg font-medium inline-block transition-all duration-300 shadow-xl hover:shadow-red-500/30">
            Start with MANAK AI
          </Link>
        </motion.div>
      </section>
      
    </div>
  );
}

export default HomePage;
