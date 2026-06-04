"use client";

import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Input } from "./input";

interface SelectOption {
  id: string;
  name: string;
  photoUrl?: string | null;
}

interface CreatableSearchSelectProps {
  value: SelectOption;
  onChange: (val: SelectOption) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function CreatableSearchSelect({
  value,
  onChange,
  options,
  placeholder = "พิมพ์ชื่อ หรือเลือก...",
  className = "",
}: CreatableSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value.name);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value.name);
  }, [value.name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = searchTerm.trim()
    ? options.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    const exactMatch = options.find(
      (opt) => opt.name.toLowerCase() === val.trim().toLowerCase(),
    );
    if (exactMatch) {
      onChange({ id: exactMatch.id, name: exactMatch.name });
    } else {
      onChange({ id: "", name: val });
    }
    setIsOpen(true);
  };

  const handleSelectOption = (opt: SelectOption) => {
    onChange(opt);
    setSearchTerm(opt.name);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="bg-black/40 border-zinc-800 focus:border-brand rounded-xl py-2.5"
        icon={(() => {
          const matchedOpt = options.find((o) => o.id === value.id);
          const pUrl = matchedOpt?.photoUrl || value.photoUrl;
          if (pUrl) {
            return (
              <img
                src={pUrl}
                alt={value.name}
                className="w-5 h-5 rounded-full object-cover border border-zinc-700"
              />
            );
          }
          return <AccountCircleIcon className="text-sm" />;
        })()}
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-950/95 border border-zinc-800/80 rounded-xl shadow-2xl max-h-60 overflow-y-auto no-scrollbar backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredOptions.length > 0 ? (
            <div className="p-1.5 space-y-0.5">
              {filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left px-3.5 py-2.5 text-xs rounded-lg hover:bg-zinc-850 hover:text-white text-zinc-300 font-medium transition-all duration-200 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.photoUrl ? (
                      <img
                        src={opt.photoUrl}
                        alt={opt.name}
                        className="w-6 h-6 rounded-full object-cover border border-zinc-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0">
                        <AccountCircleIcon className="text-[14px]" />
                      </div>
                    )}
                    <span className="truncate">{opt.name}</span>
                  </div>
                  <span className="text-[9px] bg-brand/10 border border-brand/20 text-brand px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider scale-90">
                    ในระบบ
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-zinc-500 mb-1">ไม่พบรายชื่อในระบบ</p>
              {searchTerm.trim() && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-brand hover:underline font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <AddIcon className="text-xs" />
                  เพิ่มทีมงานและนักแสดง: &quot;{searchTerm}&quot;
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
