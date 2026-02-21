import React from 'react';
import { useNotesValue, useSetModalVisible } from '../hooks/state';
import { useSetSelectedNote } from '../hooks/state';
import { NoteItem } from '@typings/notes';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { List, ListItem } from '@npwd/keyos';
import { cn } from '@utils/cn';

const NoteList = () => {
  const notes = useNotesValue();
  const setNote = useSetSelectedNote();
  const setModalVisible = useSetModalVisible();
  const query = useQueryParams();
  const history = useHistory();

  const referal = query.referal && decodeURIComponent(query.referal);

  const handleNoteModal = (note: NoteItem) => {
    if (referal) {
      history.push(addQueryToLocation(getLocationFromUrl(referal), 'note', String(note.id)));
      return;
    }
    setNote(note);
    setModalVisible(true);
  };

  if (notes && notes.length) {
    return (
      <div className="px-4 py-4 w-full h-full overflow-y-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-700/50">
          <List className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
            {notes.map((note) => (
              <ListItem
                key={note.id}
                onClick={() => handleNoteModal(note)}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors cursor-pointer p-4 flex flex-col items-start gap-1"
              >
                <div className="w-full flex flex-col gap-0.5">
                  <h3 className="font-bold text-neutral-900 dark:text-white truncate">
                    {note.title || "Sem título"}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate w-full">
                    {note.content || 'Sem conteúdo disponível'}
                  </p>
                </div>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 opacity-60 px-4 text-center">
      <div className="text-neutral-400 dark:text-neutral-500 mb-2">
        {/* Opcionalmente um ícone aqui */}
      </div>
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Nenhuma anotação disponível
      </p>
    </div>
  );
};

export default NoteList;
