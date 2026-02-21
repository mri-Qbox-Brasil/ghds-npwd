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
        <div className="relative w-full px-2">
            <div className="relative flex items-center bg-neutral-100 dark:bg-neutral-800/80 rounded-[10px] px-2 h-9 transition-all focus-within:bg-neutral-200 dark:focus-within:bg-neutral-700">
                <Search size={16} className="text-neutral-500 shrink-0" />
                <NPWDInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS', 'Buscar...') as string}
                    className="flex-1 bg-transparent border-none text-[17px] h-full py-0 px-2 focus:ring-0 placeholder:text-neutral-500"
                />
                {search.length > 0 && (
                    <button
                        onClick={clearSearch}
                        className="p-0.5 rounded-full bg-neutral-400 text-white hover:bg-neutral-500 transition-colors"
                    >
                        <X size={14} fill="currentColor" />
                    </button>
                )}
            </div>
        </div>
    );
};
