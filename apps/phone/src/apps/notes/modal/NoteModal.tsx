import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useModalVisible, useSelectedNote } from '../hooks/state';
import { useHistory, useLocation } from 'react-router-dom';
import { useNotesAPI } from '../hooks/useNotesAPI';
import { ChevronLeft } from 'lucide-react';
import { RiDeleteBin2Line } from '@react-icons/all-files/ri/RiDeleteBin2Line';
import { NoteItem } from '@typings/notes';
import { cn } from '@utils/cn';

export const NoteModal: React.FC = () => {
  const { addNewNote, deleteNote, updateNote } = useNotesAPI();
  const [modalVisible, setModalVisible] = useModalVisible();
  const [t] = useTranslation();
  const [selectedNote, setSelectedNote] = useSelectedNote();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const history = useHistory();
  const location = useLocation();

  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const isNewNote = !Boolean(selectedNote?.id);

  useEffect(() => {
    if (selectedNote !== null) {
      setNoteContent(selectedNote.content);
      setNoteTitle(selectedNote.title);
    }
  }, [selectedNote]);

  useEffect(() => {
    if (titleRef.current) {
      adjustHeight(titleRef.current);
    }
  }, [noteTitle]);

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleDeleteNote = () => {
    if (!selectedNote?.id) return;
    deleteNote({ id: selectedNote.id })
      .then(() => {
        setModalVisible(false);
      })
      .catch(console.error);
  };

  const handleUpdateNote = () => {
    if (!selectedNote?.id) return;
    updateNote({ id: selectedNote.id, title: noteTitle, content: noteContent })
      .then(() => {
        setModalVisible(false);
      })
      .catch(console.error);
  };

  const handleNewNote = () => {
    addNewNote({ title: noteTitle, content: noteContent })
      .then(() => {
        if (location.search) history.goBack();
        setModalVisible(false);
      })
      .catch(console.error);
  };

  const _handleClose = () => {
    setModalVisible(false);
  };

  const handleClearContent = () => {
    setSelectedNote(null);
    if (location.search) history.goBack();
  };

  useEffect(() => {
    if (!modalVisible && selectedNote) {
      const timeout = setTimeout(handleClearContent, 300);
      return () => clearTimeout(timeout);
    }
  }, [modalVisible, selectedNote]);

  if (selectedNote === null && !modalVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col bg-background transition-all duration-300",
      modalVisible ? "animate-in slide-in-from-right" : "animate-out slide-out-to-right"
    )}>
      <header className="flex h-16 shrink-0 items-center justify-between px-2 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <button
          onClick={_handleClose}
          className="flex items-center text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-xl transition-colors font-medium"
        >
          <ChevronLeft size={24} />
          <span>{t('APPS_NOTES') as string}</span>
        </button>

        <button
          onClick={isNewNote ? handleNewNote : handleUpdateNote}
          disabled={noteTitle.length === 0}
          className="text-blue-500 font-bold px-4 py-2 disabled:opacity-50 transition-opacity"
        >
          {isNewNote ? t('GENERIC_SAVE') : t('GENERIC_DONE')}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <textarea
          ref={titleRef}
          className="w-full bg-transparent border-none outline-none resize-none font-bold text-2xl text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 overflow-hidden"
          rows={1}
          placeholder="Título"
          maxLength={50}
          value={noteTitle}
          onChange={(e) => {
            setNoteTitle(e.target.value);
            adjustHeight(e.target);
          }}
        />

        <textarea
          className="w-full bg-transparent border-none outline-none resize-none text-base text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 leading-relaxed min-h-[300px]"
          placeholder="Comece a escrever..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </main>

      <footer className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 shadow-inner">
        {!isNewNote && (
          <button
            onClick={handleDeleteNote}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-colors"
          >
            <RiDeleteBin2Line size={20} />
          </button>
        )}
        <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
          {noteContent.length}/250 caracteres
        </div>
      </footer>
    </div>
  );
};

export default NoteModal;