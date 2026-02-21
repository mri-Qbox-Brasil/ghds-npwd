import { Bird } from 'lucide-react';

export function TwitterTitle() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-center px-4 bg-background/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Bird size={28} className="text-sky-500 fill-sky-500/10" />
      </div>
    </header>
  );
}

export default TwitterTitle;