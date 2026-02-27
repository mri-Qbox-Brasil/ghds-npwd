import React, { useEffect, useRef } from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { useApp } from '@os/apps/hooks/useApps';
import NoteList from './list/NoteList';
import { NoteModal } from './modal/NoteModal';
import { Edit } from 'lucide-react';
import { Route } from 'react-router-dom';
import { useSetModalVisible, useSetSelectedNote, useNotesLoadable } from './hooks/state';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { AddNoteExportData } from '@typings/notes';

export const NotesApp: React.FC = () => {
  const notesApp = useApp('NOTES');
  const setSelectedNote = useSetSelectedNote();
  const setModalVisible = useSetModalVisible();
  const notesLoadable = useNotesLoadable();
  const notesCount = notesLoadable.state === 'hasValue' ? notesLoadable.contents.length : 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  const onClickCreate = () => {
    setSelectedNote({ title: '', content: '' });
    setModalVisible(true);
  };

  const { title, content } = useQueryParams<AddNoteExportData>({ title: '', content: '' });

  useEffect(() => {
    if (title || content) {
      setModalVisible(true);
      setSelectedNote({ title, content });
    } else {
      setModalVisible(false);
      setSelectedNote(null);
    }
  }, [setModalVisible, title, content, setSelectedNote]);

  return (
    <AppWrapper id="notes-app" className="bg-white/40 dark:bg-black/40 backdrop-blur-md">
      <NoteModal />

      {/* Pinned header */}
      <DynamicHeader
        title="Notas"
        scrollRef={scrollRef}
        variant="pinned"
        rightContent={
          <button
            className="text-yellow-600 dark:text-yellow-500 active:text-yellow-700 transition-colors"
            onClick={onClickCreate}
          >
            <Edit size={22} strokeWidth={2} />
          </button>
        }
      />

      <AppContent
        ref={scrollRef}
        className="flex flex-col grow pb-24 scrollbar-hide h-full relative"
      >
        {/* Large title */}
        <DynamicHeader title="Notas" scrollRef={scrollRef} variant="largeTitle" />

        <React.Suspense fallback={<LoadingSpinner />}>
          <Route path="/notes" component={NoteList} />
        </React.Suspense>
      </AppContent>

      {/* iOS bottom toolbar */}
      <div className="flex justify-center py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <p className="text-xs text-neutral-500 font-medium">
          {notesLoadable.state === 'hasValue' ? `${notesCount} ${notesCount === 1 ? 'nota' : 'notas'}` : 'Carregando...'}
        </p>
      </div>
    </AppWrapper>
  );
};

export default NotesApp;