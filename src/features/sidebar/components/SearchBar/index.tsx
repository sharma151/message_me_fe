import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search or start a new chat",
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-md p-2">
      <div
        className={`
          flex items-center px-4 py-2 rounded-full border transition-all duration-200
          ${isFocused ? 'border-[#22C55E]' : 'border-gray-400'} 
          bg-gray-300
        `}
      >
        <Search size={20} className="mr-3 text-gray-200" />
        <input
          type="text"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)} // Immediate update
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-200 text-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;