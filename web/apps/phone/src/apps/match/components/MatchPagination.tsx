import React from 'react';
import { cn } from '@utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MatchPaginationProps {
  totalCount: number;
  onChange: (e: any, page: number) => void;
  currentPage?: number;
}

const MatchPagination: React.FC<MatchPaginationProps> = ({ totalCount, onChange, currentPage = 1 }) => {
  if (totalCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        disabled={currentPage <= 1}
        onClick={(e) => onChange(e, currentPage - 1)}
        className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalCount }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={(e) => onChange(e, page)}
            className={cn(
              "h-10 w-10 rounded-xl font-bold text-sm transition-all active:scale-95",
              currentPage === page
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage >= totalCount}
        onClick={(e) => onChange(e, currentPage + 1)}
        className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default React.memo(MatchPagination);
