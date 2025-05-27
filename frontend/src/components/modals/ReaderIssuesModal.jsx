import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookIcon from '@mui/icons-material/Book';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 630,
  height: 500,
  bgcolor: '#fff',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const scrollStyle = {
  marginTop: '10px',
  maxHeight: '420px',
  overflowY: 'auto',
};

const ReaderIssuesModal = ({ issuesList, open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
              backgroundColor: '#618d4a7f',
              width: '60px',
              height: '60px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
          }}>
              <LibraryBooksIcon style={{ color: '#000', fontSize: '30px'}} />
          </div>
          <div style={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div" style={{ color: '#A44A3F', fontWeight: 'bold' }}>
              Список выдач читателя
            </Typography>
          </div>
          <div style={{ marginRight: '-10px' }}>
            <IconButton onClick={handleClose}>
              <CloseIcon style={{ color: '#A44A3F' }} />
            </IconButton>
          </div>
        </div>
        <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
        <Box sx={scrollStyle}>
          {issuesList.length > 0 ? (
            <List dense>
              {issuesList.map((issue, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar><BookIcon /></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        ID книги: {issue.book_id}<br/>
                        Выдана: {new Date(issue.issue_date).toLocaleDateString()}<br/>
                        Дата возврата: {new Date(issue.return_date).toLocaleDateString()}
                      </>
                    }
                    secondary={
                      <>
                        Статус: {issue.status}<br/>
                        {issue.comment && <>Комментарий: {issue.comment}</>}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography style={{ paddingTop: '20px', textAlign: 'center' }}>
              Нет выданных книг
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ReaderIssuesModal;