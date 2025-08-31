import React, { useEffect, useRef, useState } from 'react';

export type Option = { label: string; value: string | number | null };

export interface ControllableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string; // wrapper class
}

// Default export React component so it can be previewed
export default function ControllableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  className = '',
}: ControllableSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value) || null;

  useEffect(() => {
    if (!open) setHighlightedIndex(-1);
  }, [open]);

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // keyboard handling
  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
        scrollHighlightedIntoView();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        scrollHighlightedIntoView();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && highlightedIndex >= 0) {
        const opt = options[highlightedIndex];
        if (opt) onChange(opt.value as string);
        setOpen(false);
      } else {
        setOpen((o) => !o);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  }

  function onOptionClick(index: number) {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value as string);
    setOpen(false);
  }

  function scrollHighlightedIntoView() {
    if (!listRef.current) return;
    const el =
      listRef.current.querySelectorAll('[role=option]')[highlightedIndex];
    if (el && (el as HTMLElement).scrollIntoView) {
      (el as HTMLElement).scrollIntoView({ block: 'nearest' });
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-sm ${className}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="select-label"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`select-btn w-56 text-left px-3 py-2 rounded-lg border transition-shadow focus:outline-none focus:shadow ring-1 ring-inset ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span id="select-label" className="block truncate">
          {selected ? (
            selected.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
          }
          className="select-list absolute z-50 mt-1 w-56 max-h-60 overflow-auto rounded-lg border bg-white shadow-lg"
        >
          {options.length === 0 && (
            <div className="px-3 py-2 text-gray-500">No options</div>
          )}

          {options.map((opt, idx) => {
            const isSelected = value === opt.value;
            const isHighlighted = highlightedIndex === idx;
            return (
              <div
                id={`option-${idx}`}
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                onClick={() => onOptionClick(idx)}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer select-none ${
                  isHighlighted ? 'bg-gray-100' : ''
                } ${isSelected ? 'font-semibold' : ''}`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
