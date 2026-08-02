"use client";

import React, { useState } from "react";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Input } from "./input";


function useDropdown(onCloseCallback?: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    onCloseCallback?.();
  };
  const toggle = () => {
    if (isOpen) close();
    else open();
  };
  return { isOpen, open, close, toggle };
}

function DropdownMenu({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="relative z-50 w-full mt-2 bg-zinc-950/95 border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
        {children}
      </div>
    </>
  );
}


interface SelectOption {
  id: string;
  name: string;
  photoUrl?: string | null;
  email?: string | null;
}

interface CreatableSearchSelectProps {
  value: SelectOption;
  onChange: (val: SelectOption) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  hideIcon?: boolean;
  addLabelPrefix?: string;
}


export function CreatableSearchSelect({
  value,
  onChange,
  options,
  placeholder = "พิมพ์ชื่อ หรือเลือก...",
  className = "",
  hideIcon = false,
  addLabelPrefix = "เพิ่มทีมงานและนักแสดง",
}: CreatableSearchSelectProps) {
  const { isOpen, open, close } = useDropdown();
  const [searchTerm, setSearchTerm] = useState(value.name);

  const [prevValueName, setPrevValueName] = useState(value.name);
  if (value.name !== prevValueName) {
    setPrevValueName(value.name);
    setSearchTerm(value.name);
  }

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
      onChange(exactMatch);
    } else {
      onChange({ id: "", name: val, email: "" });
    }
    open();
  };

  const handleSelectOption = (opt: SelectOption) => {
    onChange(opt);
    setSearchTerm(opt.name);
    close();
  };

  return (
    <div className={`relative w-full ${isOpen ? "z-50" : "z-10"} ${className}`}>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={open}
        placeholder={placeholder}
        icon={hideIcon ? undefined : (() => {
          const matchedOpt = options.find((o) => o.id === value.id);
          const pUrl = matchedOpt?.photoUrl || value.photoUrl;
          if (pUrl) {
            return (
              <Image
                src={pUrl}
                alt={value.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                unoptimized
              />
            );
          }
          return <AccountCircleIcon className="text-brand text-lg" />;
        })()}
        suffix={
          !isOpen && searchTerm.trim() !== "" ? (
            <CheckCircleIcon className="text-brand text-lg animate-fade-in" />
          ) : undefined
        }
      />

      <DropdownMenu isOpen={isOpen} onClose={close}>
        {filteredOptions.length > 0 ? (
          <div className="p-1.5 space-y-0.5 overflow-y-auto no-scrollbar max-h-64">
            {filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="w-full text-left px-3.5 py-2.5 text-xs rounded-lg hover:bg-zinc-850 hover:text-white text-zinc-300 font-medium transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.photoUrl ? (
                    <Image
                      src={opt.photoUrl}
                      alt={opt.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover border border-zinc-800 flex-shrink-0"
                      unoptimized
                    />
                  ) : hideIcon ? null : (
                    <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0">
                      <AccountCircleIcon className="text-brand text-lg" />
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
            <p className="text-xs text-zinc-500 mb-2">ไม่พบรายชื่อในระบบ</p>
            {searchTerm.trim() && (
              hideIcon ? (
                <button
                  type="button"
                  onClick={close}
                  className="text-xs text-brand hover:underline font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <AddIcon className="text-xs" />
                  {addLabelPrefix}: &quot;{searchTerm}&quot;
                </button>
              ) : (
                <button
                  type="button"
                  onClick={close}
                  className="text-xs text-brand hover:underline font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <AddIcon className="text-xs" />
                  {addLabelPrefix}: &quot;{searchTerm}&quot;
                </button>
              )
            )}
          </div>
        )}
      </DropdownMenu>
    </div>
  );
}

interface SearchSelectOption {
  value: string;
  label: string;
  searchKeywords?: string;
}

interface SearchSelectProps {
  creatable?: boolean;
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: SearchSelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export function SearchSelect({
  label,
  creatable = false,
  value,
  onChange,
  options,
  placeholder = "พิมพ์คำค้นหาหรือเลือก...",
  error,
  className = "",
}: SearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, close, toggle } = useDropdown(() => setSearchTerm(""));
  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchTerm.trim()
    ? options.filter((opt) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          opt.label.toLowerCase().includes(searchLower) ||
          (opt.searchKeywords && opt.searchKeywords.toLowerCase().includes(searchLower))
        );
      })
    : options;

  const handleSelectOption = (val: string) => {
    onChange(val);
    close();
  };

  return (
    <div className={`space-y-1 w-full text-left relative ${isOpen ? "z-50 animate-fade-in" : "z-10"} ${className}`}>
      {label && <label className="text-xs text-zinc-400 font-medium block">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={toggle}
          className={`w-full bg-zinc-900 border rounded-lg py-2.5 px-4 pr-10 text-sm text-left text-white focus:outline-none transition-colors font-light cursor-pointer flex items-center justify-between ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-zinc-800 focus:border-brand"
          }`}
        >
          <span className={selectedOption ? "text-white" : "text-zinc-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-500 w-0 h-0" />
        </button>

        <DropdownMenu isOpen={isOpen} onClose={close}>
          <div className="p-2 border-b border-zinc-800/50 shrink-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา..."
              className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand/50 font-light"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto no-scrollbar p-1.5 space-y-0.5 max-h-64">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-zinc-850 hover:text-white transition-all duration-200 cursor-pointer ${
                    opt.value === value
                      ? "bg-brand/10 text-brand font-semibold"
                      : "text-zinc-300 font-medium"
                  }`}
                >
                  {opt.label}
                </button>
              ))
            ) : !creatable ? (
              <p className="p-3 text-center text-xs text-zinc-500">ไม่พบผลลัพธ์</p>
            ) : null}

            {creatable && searchTerm.trim() && !options.find((opt) => opt.label.toLowerCase() === searchTerm.trim().toLowerCase()) && (
              <div className="mt-1 pt-1 border-t border-zinc-800/50">
                <button
                  type="button"
                  onClick={() => handleSelectOption(searchTerm.trim())}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg bg-brand/10 text-brand font-medium hover:bg-brand hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <AddIcon className="text-xs" />
                  เพิ่ม: &quot;{searchTerm}&quot;
                </button>
              </div>
            )}
          </div>
        </DropdownMenu>
      </div>
      {error && (
        <p className="text-[11px] text-red-400 mt-1 pl-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
