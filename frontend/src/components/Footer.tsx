

import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-4">
              MANAK<span className="text-red-600">AI</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-xs">
              AI-powered discovery and evidence layer for Indian Standards and BIS services.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-red-600 transition-colors">Features</Link></li>
              <li><Link to="/" className="text-sm text-gray-600 hover:text-red-600 transition-colors">How It Works</Link></li>
              <li><Link to="/" className="text-sm text-gray-600 hover:text-red-600 transition-colors">Standards</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-sm text-gray-600 hover:text-red-600 transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-sm text-gray-600 hover:text-red-600 transition-colors">Signup</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} MANAK AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 font-medium">
            Official BIS sources remain authoritative.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
