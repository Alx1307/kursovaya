import React from 'react';
import { Modal, Box, Typography, Divider, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import './styles/ConfirmDeleteUserModal.css';

const ConfirmDeleteUserModal = ({ open, handleClose, handleConfirm }) => {
  return (
    <Modal open={open} onClose={handleClose}>
        <Box className="delete-user-modal">
            <div className="delete-user-modal-header">
                <div className="delete-user-modal-icon-container">
                    <DeleteIcon style={{ color: '#000', fontSize: '30px' }} />
                </div>
                <div style={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6" component="div" className="delete-user-modal-title">
                        Подтверждение
                    </Typography>
                </div>
                <div>
                    <IconButton onClick={handleClose}>
                    <CloseIcon style={{ color: '#A44A3F' }} />
                    </IconButton>
                </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />

            <div className="delete-user-modal-info-section">
                <Typography variant="body1" style={{ textAlign: 'center', fontSize: '20px' }}>
                    Вы уверены, что хотите удалить этого сотрудника?
                </Typography>
                <div className='delete-user-button-container'>
                    <Button variant="outlined"
                        style={{ backgroundColor: 'rgba(167, 109, 96, 0.7)', color: '#000', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="contained"
                        style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleConfirm}>
                        Удалить
                    </Button>
                </div>
            </div>
        </Box>
    </Modal>
  );
};

export default ConfirmDeleteUserModal;