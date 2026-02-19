// NoteList.tsx (simplificado, removendo a parte da contagem)

import React from 'react';
import { Box, List, ListItem, Typography, Divider, Paper } from '@mui/material';
import { useNotesValue, useSetModalVisible } from '../hooks/state';
import { useSetSelectedNote } from '../hooks/state';
import { NoteItem } from '@typings/notes';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';

const NoteList = () => {
  const notes = useNotesValue();
  const setNote = useSetSelectedNote();
  const setModalVisible = useSetModalVisible();
  const query = useQueryParams();
  const history = useHistory();
  const phoneTheme = useTheme();

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
      <Box sx={{ paddingX: '16px', paddingTop: '16px', width: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: phoneTheme.palette.background.paper, // Fundo branco para imitar o iPhone
          }}
        >
          <List disablePadding sx={{ width: '100%' }}>
            {notes.map((note, index) => (
              <React.Fragment key={note.id}>
                <ListItem
                  button
                  onClick={() => handleNoteModal(note)}
                  sx={{
                    paddingY: '12px',
                    paddingX: '6%',
                    alignItems: 'flex-start',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: phoneTheme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                        color: phoneTheme.palette.text.primary,
                      }}
                    >
                      {note.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: phoneTheme.palette.text.disabled,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {note.content || 'Sem conteúdo disponível'}
                    </Typography>
                  </Box>
                </ListItem>
                {index < notes.length - 1 && (
                  <Divider
                    sx={{
                      borderBlockWidth: '%0.01',
                      marginLeft: '6%', // Deixar o divisor com uma margem horizontal
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="top"
      alignItems="center"
      flexDirection="column"
      height="100%"
      marginTop={'16px'}
    >
      <Typography
        color="inherit"
        variant="subtitle2"
        style={{ fontWeight: 300, color: phoneTheme.palette.text.primary }}
      >
        Nenhuma anotação disponível
      </Typography>
    </Box>
  );
};

export default NoteList;
