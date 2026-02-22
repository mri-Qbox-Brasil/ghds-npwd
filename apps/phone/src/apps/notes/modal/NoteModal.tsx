import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useModalVisible, useSelectedNote } from '../hooks/state';
import { useHistory, useLocation } from 'react-router-dom';
import { useNotesAPI } from '../hooks/useNotesAPI';
import { ChevronLeft, Trash2 } from 'lucide-react';
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
      "fixed inset-0 z-[100] flex flex-col bg-white dark:bg-neutral-900 transition-all duration-300",
      modalVisible ? "animate-in slide-in-from-right" : "animate-out slide-out-to-right"
    )}>
      {/* iOS Header */}
      <header className="flex shrink-0 items-center justify-between px-2 pt-[50px] pb-2 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <button
          onClick={_handleClose}
          className="flex items-center text-yellow-600 dark:text-yellow-500 active:text-yellow-700 transition-colors font-normal"
        >
          <ChevronLeft size={28} strokeWidth={2} />
          <span className="text-[17px]">Notas</span>
        </button>

        <button
          onClick={isNewNote ? handleNewNote : handleUpdateNote}
          disabled={noteTitle.length === 0}
          className="text-[17px] text-yellow-600 dark:text-yellow-500 font-semibold px-3 py-1 disabled:opacity-40 transition-opacity"
        >
          {isNewNote ? 'Salvar' : 'OK'}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <textarea
          ref={titleRef}
          className="w-full bg-transparent border-none outline-none resize-none font-bold text-[24px] text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 overflow-hidden leading-snug"
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
          className="w-full bg-transparent border-none outline-none resize-none text-[16px] text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 leading-relaxed min-h-[300px]"
          placeholder="Comece a escrever..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-4 py-3 pb-6 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800">
        {!isNewNote ? (
          <button
            onClick={handleDeleteNote}
            className="flex items-center gap-2 text-red-500 active:text-red-600 p-2 rounded-xl transition-colors"
          >
            <Trash2 size={20} />
          </button>
        ) : (
          <div />
        )}
        <span className="text-[11px] text-neutral-400 font-medium">
          {noteContent.length}/250
        </span>
      </footer>
    </div>
  );
};

export default NoteModal;