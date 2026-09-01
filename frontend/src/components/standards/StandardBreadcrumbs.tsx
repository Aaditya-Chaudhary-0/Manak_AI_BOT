import { Link } from 'react-router-dom';
import { ChevronRight, Home, BookOpen } from 'lucide-react';

interface StandardBreadcrumbsProps {
  currentCode: string;
}

export function StandardBreadcrumbs({ currentCode }: StandardBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-500 py-3 px-4 sm:px-6 bg-white border-b border-gray-100">
      <Link
        to="/app/dashboard"
        className="hover:text-gray-900 flex items-center space-x-1 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />

      <Link
        to="/app/standards"
        className="hover:text-gray-900 flex items-center space-x-1 transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>BIS Standards</span>
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />

      <span className="font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
        {currentCode}
      </span>
    </nav>
  );
}

export default StandardBreadcrumbs;
