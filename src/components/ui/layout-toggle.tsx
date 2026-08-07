import React from "react";

export type LayoutOrientation = "landscape" | "portrait";

interface LayoutToggleProps {
  value: LayoutOrientation;
  onChange: (value: LayoutOrientation) => void;
}

export function LayoutToggle({ value, onChange }: LayoutToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
      <button
        onClick={() => onChange("landscape")}
        className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          value === "landscape"
            ? "bg-white/15 text-white shadow-md"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
        }`}
      >
        แนวนอน
      </button>
      <button
        onClick={() => onChange("portrait")}
        className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          value === "portrait"
            ? "bg-white/15 text-white shadow-md"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
        }`}
      >
        แนวตั้ง
      </button>
    </div>
  );
}
