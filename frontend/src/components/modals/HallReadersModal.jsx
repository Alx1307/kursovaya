import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import LocallibraryIcon from '@mui/icons-material/LocalLibrary';
import PersonIcon from '@mui/icons-material/Person';

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

const HallReadersModal = ({ readersList, open, handleClose }) => {
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
                <LocallibraryIcon style={{ color: '#000', fontSize: '30px'}} />
            </div>
          <div style={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div" style={{ color: '#A44A3F', fontWeight: 'bold' }}>
              Читатели в зале
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
        {readersList.length > 0 ? (
          <List dense>
            {readersList.map((reader, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar><PersonIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${reader.name}`} secondary={`№ читательского билета: ${reader.card_number}`}/>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" style={{ paddingTop: '20px', textAlign: 'center' }}>
            Зал пуст
          </Typography>
        )}
        </Box>
      </Box>
    </Modal>
  );
};

export default HallReadersModal;