import React, { useState } from 'react';
import { useNotesValue, useSetModalVisible } from '../hooks/state';
import { useSetSelectedNote } from '../hooks/state';
import { NoteItem } from '@typings/notes';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { Search, FileText } from 'lucide-react';

const NoteList = () => {
  const notes = useNotesValue();
  const setNote = useSetSelectedNote();
  const setModalVisible = useSetModalVisible();
  const query = useQueryParams();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const referal = query.referal && decodeURIComponent(query.referal);

  const handleNoteModal = (note: NoteItem) => {
    if (referal) {
      history.push(addQueryToLocation(getLocationFromUrl(referal), 'note', String(note.id)));
      return;
    }
    setNote(note);
    setModalVisible(true);
  };

  const filteredNotes = notes.filter((note) =>
    (note.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search size={16} className="stroke-[2.5px]" />
          </div>
          <input
            type="text"
            className="w-full h-9 pl-9 pr-4 rounded-[10px] bg-neutral-200/60 dark:bg-neutral-800/60 border-none text-[17px] focus:ring-0 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-500"
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            placeholder="Buscar"
            value={searchTerm}
          />
        </div>
      </div>

      {filteredNotes && filteredNotes.length > 0 ? (
        <div className="px-4">
          <div className="bg-white dark:bg-neutral-800/80 rounded-[10px] overflow-hidden">
            <div className="divide-y divide-neutral-200/60 dark:divide-neutral-700/50">
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleNoteModal(note)}
                  className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 active:bg-neutral-100 dark:active:bg-neutral-700/50 transition-colors"
                >
                  <h3 className="text-[16px] font-semibold text-neutral-900 dark:text-white truncate leading-snug">
                    {note.title || "Sem título"}
                  </h3>
                  <p className="text-[14px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {note.content || 'Sem conteúdo disponível'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : notes.length > 0 && filteredNotes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-16">
          <Search size={36} strokeWidth={1.5} className="text-neutral-300 dark:text-neutral-600" />
          <p className="text-[15px] font-medium text-neutral-400">Nenhum resultado</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
          <FileText size={48} strokeWidth={1.5} className="text-neutral-300 dark:text-neutral-600" />
          <p className="text-[15px] font-medium text-neutral-400 dark:text-neutral-500">
            Nenhuma anotação
          </p>
          <p className="text-[13px] text-neutral-400 dark:text-neutral-600">
            Toque em <FileText size={14} className="inline" /> para criar uma nota
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteList;
