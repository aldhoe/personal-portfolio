import React from 'react';
import { LucideIcon, Phone } from 'lucide-react';

interface IconLinkProps {
  Icon?: LucideIcon | null; 
  text: string;
  href: string;
  target?: string;
  className?: string; 
}

const IconLink: React.FC<IconLinkProps> = ({ Icon, text, href, target = "_self", className = 'text-sm' }) => {
  const FinalIcon = Icon || (text.includes('+') ? Phone : null);
  
  return (
    <a 
      href={href} 
      target={target} 
      // Tambahkan flex-shrink-0 pada link agar tidak dipaksa menyusut
      className={`flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors flex-shrink-0 ${className}`}
    >
      {FinalIcon && (
        <FinalIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-yellow-500" />
      )}
      {/* KUNCI PERBAIKAN: Tambahkan class font-semibold */}
      <span className="whitespace-nowrap font-bold">{text}</span>
    </a>
  );
};

export default IconLink;