import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <Link 
        to="/" 
        className="flex items-center text-neutral-400 hover:text-[#5173FB] transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-neutral-300" />
          {item.path ? (
            <Link 
              to={item.path} 
              className="font-medium text-neutral-400 hover:text-[#5173FB] transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-[#5173FB] whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
