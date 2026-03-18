import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search or start a new chat", 
  debounceTime = 500 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        console.log("Searched Item:", searchTerm);
      }
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime]);

  return (
    <div className="w-full max-w-md p-2">
      <div
        className={`
          flex items-center px-4 py-2 rounded-full border-1 transition-all duration-200
          ${isFocused ? 'border-[#22C55E]' : 'border-gray-400'} 
          bg-gray-300
        `}
      >
        <Search 
          size={20} 
          className={`mr-3 text-gray-200`} 
        />
        <input
          type="text"
          value={searchTerm}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-200 text-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;