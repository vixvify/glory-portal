import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Input } from "./input";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  maxLength
}) => {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="bg-black/40 border-zinc-800 focus:border-brand rounded-xl py-2"
        icon={<SearchIcon className="text-lg text-zinc-500" />}
        suffix={
          value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
            >
              <CloseIcon className="text-base" />
            </button>
          ) : undefined
        }
      />
    </div>
  );
};
