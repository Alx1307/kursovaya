import React from 'react';
import { Modal, Box, Typography, Divider, Button, TextField, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width:630,
  height: 500,
  bgcolor: '#fff',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const ProfileModal = ({ userInfo, open, handleClose }) => (
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
          <SettingsIcon style={{ color: '#000', fontSize: '30px'}} />
        </div>
        <div style={{ flexGrow: 1, textAlign: 'center'}}>
          <Typography variant="h6" component="div" style={{ color: '#A44A3F', fontWeight: 'bold' }}>
            Профиль
          </Typography>
        </div>
        <div style={{ marginRight: '-10px' }}>
          <IconButton onClick={handleClose}>
            <CloseIcon style={{ color: '#A44A3F' }} />
          </IconButton>
        </div>
      </div>
      <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '34px', marginTop: '40px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '220px' }}>
            <label style={{ fontSize: '20px', color: '#A44A3F', minWidth: '80px', textAlign: 'left' }}>ФИО:</label>
            <TextField value={userInfo?.full_name || ''} InputLabelProps={{ shrink: true }}
                    fullWidth inputProps={{ readOnly: true }} InputProps={{
                        style: {
                        maxWidth: '300px',
                        height: '55px',
                        borderRadius: '12px',
                        border: '1px solid #A44A3F',
                        },
                    }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '220px' }}>
            <label style={{ fontSize: '20px', color: '#A44A3F', minWidth: '80px', textAlign: 'left' }}>Email:</label>
            <TextField value={userInfo?.email || ''} InputLabelProps={{ shrink: true }}
                    fullWidth inputProps={{ readOnly: true }} InputProps={{
                        style: {
                        maxWidth: '300px',
                        height: '55px',
                        borderRadius: '12px',
                        border: '1px solid #A44A3F',
                        },
                    }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '220px' }}>
            <label style={{ fontSize: '20px', color: '#A44A3F', minWidth: '80px', textAlign: 'left' }}>Роль:</label>
            <TextField value={userInfo?.role || ''} InputLabelProps={{ shrink: true }}
                    fullWidth inputProps={{ readOnly: true }} InputProps={{
                        style: {
                        maxWidth: '300px',
                        height: '55px',
                        borderRadius: '12px',
                        border: '1px solid #A44A3F',
                        },
                    }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '51px' }}>
        <Button variant="contained"
                style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px' }}>
          Редактировать
        </Button>
      </div>
    </Box>
  </Modal>
);

export default ProfileModal;