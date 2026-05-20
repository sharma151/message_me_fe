import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  onDebouncedChange: (value: string) => void
  delay?: number
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search or start a new chat',
  onDebouncedChange,
  delay = 500, // Customizable debounce timing
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [localValue, setLocalValue] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      onDebouncedChange(localValue)
    }, delay)

    // Cleanup: clears timeout if localValue changes before delay ends
    return () => clearTimeout(handler)
  }, [localValue, delay, onDebouncedChange])

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
          value={localValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-200 text-sm"
        />
      </div>
    </div>
  )
}

export default SearchBar
