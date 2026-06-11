"use client";

import { useState, useEffect } from "react";
import { SEARCH_PLACEHOLDERS } from "@/core/constants/search-placeholder";

export function useSearchPlaceholder(intervalMs: number = 30000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (SEARCH_PLACEHOLDERS.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return SEARCH_PLACEHOLDERS[currentIndex];
}
