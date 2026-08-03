"use client";

import React, { useState, useEffect, useRef } from "react";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "เลือกรายการ...",
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((val) => val !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  const displayValue = selectedLabels || placeholder;

  return (
    <div ref={containerRef} className={`space-y-1 w-full text-left relative ${isOpen ? "z-50" : "z-10"} ${className}`}>
      {label && (
        <label className="text-xs text-zinc-400 font-medium block">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left bg-background border rounded-lg py-2.5 pl-4 pr-3 text-sm focus:outline-none transition-colors font-light cursor-pointer flex items-center justify-between min-h-[42px] ${
            isOpen ? "border-brand" : "border-theme-border"
          } ${error ? "border-red-500" : ""} ${
            selectedValues.length > 0 ? "text-white" : "text-zinc-400"
          }`}
        >
          <span className="truncate pr-2">{displayValue}</span>
          <KeyboardArrowDownIcon
            className={`text-zinc-500 text-sm transition-transform duration-200 ${
              isOpen ? "rotate-180 text-brand" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-zinc-950 border border-zinc-800/80 rounded-xl shadow-2xl max-h-60 overflow-y-auto no-scrollbar backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-1.5 space-y-0.5">
              {options.map((opt) => {
                const isChecked = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleToggleOption(opt.value)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs rounded-lg hover:bg-zinc-850 hover:text-white transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isChecked ? "text-brand bg-brand/5" : "text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? "border-brand bg-brand/20 text-brand"
                            : "border-zinc-700 bg-zinc-900 group-hover:border-zinc-500"
                        }`}
                      >
                        {isChecked && <CheckIcon className="text-[10px]" />}
                      </div>
                      <span className="font-medium">{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-400 mt-1 pl-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
