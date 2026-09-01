import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
              MANAK<span className="text-red-600">AI</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Features</Link>
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">How It Works</Link>
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Standards</Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">EN | हिन्दी</Link>
            <Link to="/login" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors">Login</Link>
            <Link to="/signup" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              Get Started
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <nav className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Standards</Link>
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>EN | हिन्दी</Link>
            <div className="border-t border-gray-200 pt-4 pb-2">
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="block w-full text-center mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
