import React, { useCallback, useEffect } from 'react';
import { Modal2 } from '../../../../ui/components/Modal';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useNotesValue } from '@apps/notes/hooks/state';
import { NoteItem } from '@typings/notes';
import { StickyNote, Share2, X, FileText } from 'lucide-react';
import { cn } from '@utils/cn';

interface IProps {
  messageGroup: MessageConversation | undefined;
  notePreview: any;
  onClose(): void;
  noteId?: string;
  setNotePreview: (preview: NoteItem | null) => void;
}

export const MessageNoteModal = ({
  messageGroup,
  onClose,
  noteId,
  setNotePreview,
  notePreview,
}: IProps) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const { sendEmbedMessage } = useMessageAPI();
  const notes = useNotesValue();
  const { activeMessageConversation } = useMessages();

  const removeQueryParamImage = useCallback(() => {
    setNotePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'note'));
  }, [history, pathname, search, setNotePreview]);

  const sendNoteMessage = useCallback(
    (note: NoteItem) => {
      if (!messageGroup || !activeMessageConversation) return;
      sendEmbedMessage({
        conversationId: messageGroup.id,
        conversationList: activeMessageConversation.conversationList,
        embed: { type: 'note', ...note },
        tgtPhoneNumber: messageGroup.participant,
        message: '',
      });
      onClose();
    },
    [sendEmbedMessage, messageGroup, onClose, activeMessageConversation],
  );

  const sendFromQueryParam = useCallback(
    (note: NoteItem) => {
      sendNoteMessage(note);
      removeQueryParamImage();
    },
    [removeQueryParamImage, sendNoteMessage],
  );

  useEffect(() => {
    if (!noteId) return;
    const note = notes.find((note) => note.id === Number(noteId));
    setNotePreview(note || null);
  }, [noteId, notes, setNotePreview]);

  return (
    <Modal2 visible={!!notePreview} handleClose={removeQueryParamImage} className="p-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900 rounded-3xl">
      <header className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">Compartilhar Nota</h2>
        </div>
        <button onClick={removeQueryParamImage} className="text-neutral-400 hover:text-red-500 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex flex-col p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border-2 border-amber-100 dark:border-amber-900/30 gap-3 shadow-xl transform rotate-1">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
            <div className="p-1.5 rounded-lg bg-white dark:bg-black/20 shadow-sm">
              <StickyNote size={20} strokeWidth={2.5} />
            </div>
            <span className="font-black text-lg truncate tracking-tight uppercase italic">{notePreview?.title || "Sem título"}</span>
          </div>
          <div className="h-px bg-amber-200/50 dark:bg-amber-700/50 w-full" />
          <p className="text-[13px] text-neutral-700 dark:text-neutral-300 line-clamp-4 italic leading-relaxed font-medium">
            "{notePreview?.content || "Conteúdo vazio..."}"
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => sendFromQueryParam(notePreview)}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Share2 size={20} strokeWidth={3} />
            Enviar para conversa
          </button>
          <button
            onClick={removeQueryParamImage}
            className="w-full py-3.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest rounded-2xl transition-all active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal2>
  );
};
