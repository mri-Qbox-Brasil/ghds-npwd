import React from 'react';
import { useTranslation } from 'react-i18next';
import { useContactFilterInput } from '../../hooks/state';
import { NPWDInput } from '@ui/components/Input';
import { Search, X } from 'lucide-react';

export const SearchContacts: React.FC = () => {
    const [t] = useTranslation();
    const [search, setSearch] = useContactFilterInput();

    const clearSearch = () => setSearch("");

    return (
        <div className="relative w-full group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-blue-500">
                <Search size={18} />
            </div>
            <NPWDInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('CONTACTS.SEARCH') + "..."}
                className="w-full pl-10 pr-10 h-11 bg-neutral-100 dark:bg-neutral-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-neutral-400"
            />
            {search.length > 0 && (
                <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-neutral-300 dark:bg-neutral-600 text-white hover:bg-neutral-400 dark:hover:bg-neutral-500 transition-colors animate-in zoom-in"
                >
                    <X size={12} />
                </button>
            )}
        </div>
    );
};
