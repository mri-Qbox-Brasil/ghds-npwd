import { Box, Slide, Paper, Typography, Container } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import useStyles from './modal.styles';
import { useTranslation } from 'react-i18next';
import { useModalVisible, useSelectedNote } from '../hooks/state';
import { useHistory, useLocation } from 'react-router-dom';
import { useNotesAPI } from '../hooks/useNotesAPI';
import { useTheme } from '@mui/material';
import { RiDeleteBin2Line } from '@react-icons/all-files/ri/RiDeleteBin2Line';
import { RiEditBoxLine } from "@react-icons/all-files/ri/RiEditBoxLine";

export const NoteModal: React.FC = () => {
  const classes = useStyles();
  const { addNewNote, deleteNote, updateNote } = useNotesAPI();
  const [modalVisible, setModalVisible] = useModalVisible();
  const [t] = useTranslation();
  const [selectedNote, setSelectedNote] = useSelectedNote();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const phoneTheme = useTheme();

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
    element.style.height = 'auto'; // Reseta a altura para recalcular
    element.style.height = `${element.scrollHeight}px`; // Ajusta a altura com base no conteúdo
  };

  const handleDeleteNote = () => {
    deleteNote({ id: selectedNote.id })
      .then(() => {
        setModalVisible(false);
      })
      .catch(console.error);
  };

  const handleUpdateNote = () => {
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteContent(e.target.value);
  };

  const _handleClose = () => {
    setModalVisible(false);
  };

  const handleClearContent = () => {
    setSelectedNote(null);
    if (location.search) history.goBack();
  };

  if (selectedNote === null) return null;

  return (
    <Slide
      direction="left"
      in={modalVisible}
      mountOnEnter
      unmountOnExit
      onExited={handleClearContent}
    >
      <Paper className={classes.modalRoot} square elevation={0} sx={{ padding: '16px' }}>
        <Container>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box
              onClick={_handleClose}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ArrowBackIosNewRoundedIcon
                style={{
                  color: phoneTheme.palette.primary.main,
                  marginRight: '2px',
                  marginLeft: '-25px',
                }}
              />
              <Typography variant="body1" color="primary">
                {t('APPS_NOTES')}
              </Typography>
            </Box>
            <Box
              onClick={isNewNote ? handleNewNote : handleUpdateNote}
              sx={{
                cursor: noteTitle.length === 0 ? 'default' : 'pointer',
                color: phoneTheme.palette.primary.main,
                fontWeight: 'lighter',
                fontSize: '16px',
                opacity: noteTitle.length === 0 ? 0.5 : 1,
                marginRight: '-10px',
              }}
            >
              {isNewNote ? t('GENERIC_SAVE') : t('GENERIC_DONE')}
            </Box>
          </Box>
          {/* Campos de título e conteúdo da nota */}
          <Box mb={2}>
            <textarea
              ref={titleRef}
              className={classes.input}
              rows={1} // Começa com uma linha
              placeholder="Título"
              maxLength={30} // Aumentei o limite para permitir um título maior
              value={noteTitle}
              onChange={(e) => {
                handleTitleChange(e);
                if (e.target) {
                  adjustHeight(e.target as HTMLTextAreaElement);
                }
              }}
              style={{
                width: '100%',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                border: 'none',
                outline: 'none',
                resize: 'none', // Não permite ao usuário redimensionar manualmente
                marginBottom: '8px',
                overflow: 'hidden', // Evita barras de rolagem
              }}
            />
            <textarea
              className={classes.input}
              placeholder="Conteúdo"
              maxLength={250}
              rows={10}
              value={noteContent}
              onChange={handleContentChange}
              style={{
                width: '100%',
                fontSize: '1rem',
                border: 'none',
                outline: 'none',
                resize: 'none',
                lineHeight: '1.5',
              }}
            />
            <Typography align="right" variant="body2" color="text.disabled">
              {noteContent.length}/250
            </Typography>
          </Box>
          {/* Ícone de lixeira na parte inferior */}
          {!isNewNote && (
            <Box
              className={`${classes.absoluteLeft}`}
              onClick={handleDeleteNote}
              sx={{
                cursor: 'pointer',
                color: phoneTheme.palette.error.main,
                fontWeight: 'lighter',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'left',
                justifyContent: 'left',
                mt: 4,
              }}
            >
              <RiDeleteBin2Line />
            </Box>
          )}
          <RiEditBoxLine className={`${classes.absoluteRight} ${classes.button}`}>
          </RiEditBoxLine>
        </Container>
      </Paper>
    </Slide>
  );
};