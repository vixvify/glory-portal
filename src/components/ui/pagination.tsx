"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-6 select-none animate-fade-in">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800/40 text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700/50 disabled:opacity-40 disabled:hover:bg-zinc-900/60 disabled:hover:border-zinc-800/40 disabled:hover:text-zinc-400 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="text-xl" />
      </button>

      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-10 h-10 flex items-center justify-center text-zinc-500 text-sm font-medium"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-250 cursor-pointer shadow-md ${
                isActive
                  ? "bg-brand text-black font-extrabold scale-105 border border-brand/50 shadow-brand/20 shadow-lg"
                  : "bg-zinc-900/60 border border-zinc-800/40 text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700/50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800/40 text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700/50 disabled:opacity-40 disabled:hover:bg-zinc-900/60 disabled:hover:border-zinc-800/40 disabled:hover:text-zinc-400 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md"
        aria-label="Next page"
      >
        <ChevronRightIcon className="text-xl" />
      </button>
    </div>
  );
}
