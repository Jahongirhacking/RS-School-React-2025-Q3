import React, { useState, useEffect } from 'react';

export interface SearchInputProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SearchInput({
  value,
  onSearch,
  placeholder = 'Search...',
  disabled = false,
  className = '',
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  // keep local state in sync if parent value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
  }

  function handleSearch() {
    onSearch(inputValue);
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring focus:border-blue-400 transition-shadow text-sm ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>
      <button
        type="button"
        onClick={handleSearch}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Search
      </button>
    </div>
  );
}
