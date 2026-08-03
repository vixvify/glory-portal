import React, { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "เพิ่มแท็ก...",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const newValue = [...value];
      newValue.pop();
      onChange(newValue);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion),
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className="min-h-[50px] w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 flex flex-wrap gap-2 focus-within:border-brand transition-colors"
        onClick={() => setIsOpen(true)}
      >
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 text-zinc-200 rounded-lg text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(tag);
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <CloseIcon className="text-[14px]" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-500"
        />
      </div>

      {isOpen && (inputValue.length > 0 || filteredSuggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-zinc-800 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors border-b border-zinc-800/50 last:border-0"
              onClick={(e) => {
                e.preventDefault();
                handleAddTag(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}

          {inputValue.trim() &&
            !filteredSuggestions.some(
              (s) => s.toLowerCase() === inputValue.trim().toLowerCase(),
            ) && (
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-brand font-medium hover:bg-zinc-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTag(inputValue);
                }}
              >
                + เพิ่ม &quot;{inputValue}&quot; เป็นตำแหน่งใหม่
              </button>
            )}
        </div>
      )}
    </div>
  );
}
