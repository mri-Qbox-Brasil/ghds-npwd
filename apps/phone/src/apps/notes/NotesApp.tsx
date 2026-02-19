import React, { useEffect } from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import NoteList from './list/NoteList';
import { NoteModal } from './modal/NoteModal';
import { Fab, Typography, Box } from '@mui/material';
import { RiEditBoxLine } from "@react-icons/all-files/ri/RiEditBoxLine";
import useStyles from './notes.styles';
import { NotesThemeProvider } from './providers/NotesThemeProvider';
import { Route } from 'react-router-dom';
import { useSetModalVisible, useSetSelectedNote, useNotesValue } from './hooks/state';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { AddNoteExportData } from '@typings/notes';

export const NotesApp: React.FC = () => {
  const classes = useStyles();
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
      <AppWrapper id="notes-app">
        <AppTitle app={notesApp} />
        <NoteModal />
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/notes" component={NoteList} />
          </React.Suspense>
        </AppContent>
        
        <Box sx={{ textAlign: 'center', paddingY: '16px' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {notes.length} {notes.length === 1 ? 'Nota' : 'Notas'}
          </Typography>
        </Box>
        
        <RiEditBoxLine className={`${classes.absolute} ${classes.button}`} onClick={onClickCreate}>
        </RiEditBoxLine>
      </AppWrapper>
    </NotesThemeProvider>
  );
};

// v2.0:
// Redesign finalizado
// 2.1:
// Correção do darkmode

// Futuras implementações?
// Adicionar Data
// Adicionar Buscar
// Adicionar Emojis