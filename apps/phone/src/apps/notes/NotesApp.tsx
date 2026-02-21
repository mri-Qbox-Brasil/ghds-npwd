import React, { useEffect } from 'react';
import { AppWrapper, AppContent, AppTitle } from '@ui/components';
import { useApp } from '@os/apps/hooks/useApps';
import NoteList from './list/NoteList';
import { NoteModal } from './modal/NoteModal';
import { RiEditBoxLine } from "@react-icons/all-files/ri/RiEditBoxLine";
import { NotesThemeProvider } from './providers/NotesThemeProvider';
import { Route } from 'react-router-dom';
import { useSetModalVisible, useSetSelectedNote, useNotesValue } from './hooks/state';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { AddNoteExportData } from '@typings/notes';

export const NotesApp: React.FC = () => {
  const notesApp = useApp('NOTES');
  const setSelectedNote = useSetSelectedNote();
  const setModalVisible = useSetModalVisible();
  const notes = useNotesValue();

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
    <NotesThemeProvider>
      <AppWrapper id="notes-app" className="bg-background">
        <AppTitle app={notesApp} />
        <NoteModal />
        <AppContent className="flex flex-col h-full overflow-hidden">
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/notes" component={NoteList} />
          </React.Suspense>
        </AppContent>

        <div className="flex justify-center py-4 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 font-medium">
            {notes.length} {notes.length === 1 ? 'Nota' : 'Notas'}
          </p>
        </div>

        <button
          className="absolute right-6 bottom-20 z-10 p-3 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 active:scale-90"
          onClick={onClickCreate}
        >
          <RiEditBoxLine size={24} />
        </button>
      </AppWrapper>
    </NotesThemeProvider>
  );
};

export default NotesApp;