"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = "พิมพ์แท็กแล้วกด Enter" }: TagInputProps) {
  const [inputVal, setInputVal] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputVal("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && inputVal === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className="w-full flex flex-col items-start gap-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-zinc-800 text-white text-sm font-medium px-3 py-1.5 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                className="text-zinc-400 hover:text-white transition-colors ml-1"
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </button>
            </span>
          ))}
        </div>
      )}

      {isAdding || value.length === 0 ? (
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputVal.trim()) addTag(inputVal);
            setIsAdding(false);
          }}
          placeholder={value.length === 0 ? placeholder : "พิมพ์แท็กแล้วกด Enter..."}
          className="w-full bg-[#0D0D0D] border border-[#3A3A3A] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand transition-colors"
          autoFocus={isAdding}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="text-sm text-white font-medium hover:text-brand transition-colors flex items-center"
        >
          เพิ่มแท็ก
        </button>
      )}
    </div>
  );
}
