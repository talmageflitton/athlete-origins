'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Athlete } from '@/types/game';
import { fuzzySearch } from '@/data/athletes';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  shake?: boolean;
  wrongGuesses: string[];
}

export default function GuessInput({ onGuess, disabled, shake, wrongGuesses }: GuessInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Athlete[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback((value: string) => {
    setQuery(value);
    setHighlightIndex(-1);
    if (value.length >= 2) {
      const results = fuzzySearch(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      onGuess(trimmed);
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightIndex(-1);
      inputRef.current?.focus();
    },
    [onGuess],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
          handleSubmit(suggestions[highlightIndex].name);
        } else if (query.trim()) {
          handleSubmit(query);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    },
    [suggestions, highlightIndex, query, handleSubmit],
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const canSubmit = query.trim().length >= 2 && !disabled;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Wrong guesses */}
      {wrongGuesses.length > 0 && (
        <div className="mb-3 flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark">
            Wrong guesses
          </p>
          {wrongGuesses.map((g, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-apple bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
            >
              <span className="text-apple-red dark:text-apple-red-dark text-[13px]">✕</span>
              <span className="text-[13px] font-medium text-apple-label dark:text-apple-label-dark">{g}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className={`relative flex gap-2 ${shake ? 'animate-shake' : ''}`}>
        <div className="relative flex-1">
          {/* Search icon */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-secondary dark:text-apple-secondary-dark pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            disabled={disabled}
            placeholder="Search athletes…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            className="
              w-full pl-10 pr-4 py-3.5 rounded-apple text-[15px] font-medium
              bg-apple-card dark:bg-apple-card-dark
              text-apple-label dark:text-apple-label-dark
              placeholder:text-apple-secondary dark:placeholder:text-apple-secondary-dark
              border border-apple-separator dark:border-apple-separator-dark
              focus:outline-none focus:ring-2 focus:ring-apple-blue/30 dark:focus:ring-apple-blue-dark/30
              focus:border-apple-blue dark:focus:border-apple-blue-dark
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-apple
            "
          />
        </div>

        {/* Submit button */}
        <button
          onClick={() => canSubmit && handleSubmit(highlightIndex >= 0 ? suggestions[highlightIndex]?.name ?? query : query)}
          disabled={!canSubmit}
          className="
            flex-shrink-0 px-5 py-3.5 rounded-apple font-semibold text-[15px]
            bg-apple-blue dark:bg-apple-blue-dark text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95 transition-all duration-150
            shadow-apple-blue
          "
        >
          Guess
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="
          absolute top-full left-0 right-0 mt-1 z-50
          bg-apple-card dark:bg-apple-card-dark
          border border-apple-separator dark:border-apple-separator-dark
          rounded-apple shadow-apple-md overflow-hidden
          animate-slide-down
        ">
          {suggestions.map((athlete, i) => (
            <button
              key={athlete.id}
              onMouseDown={(e) => { e.preventDefault(); handleSubmit(athlete.name); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                transition-colors duration-100
                ${i === highlightIndex
                  ? 'bg-apple-blue dark:bg-apple-blue-dark'
                  : 'hover:bg-apple-bg dark:hover:bg-apple-card2-dark'
                }
                ${i !== suggestions.length - 1 ? 'border-b border-apple-separator dark:border-apple-separator-dark' : ''}
              `}
            >
              <span className="text-xl">{athlete.emoji}</span>
              <div className="min-w-0">
                <p className={`text-[14px] font-semibold truncate ${i === highlightIndex ? 'text-white' : 'text-apple-label dark:text-apple-label-dark'}`}>
                  {athlete.name}
                </p>
                <p className={`text-[11px] truncate ${i === highlightIndex ? 'text-white/70' : 'text-apple-secondary dark:text-apple-secondary-dark'}`}>
                  {athlete.sport} · {athlete.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
