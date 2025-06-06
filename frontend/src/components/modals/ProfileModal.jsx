import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Divider, Button, TextField, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 630,
  height: 450,
  bgcolor: '#fff',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const ProfileModal = ({ userInfo, open, handleClose, reloadUserData, resetEditing }) => {
  const initialValues = {
    full_name: userInfo?.full_name  || '',
    email: userInfo?.email || '',
    role: userInfo?.role || ''
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    setFormValues(initialValues);
  }, [userInfo]);

  const handleSubmit = async () => {
    try {
      const editedData = formValues;
      const librarian_id = userInfo.librarian_id;
      const authToken = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:8080/librarian/edit/${librarian_id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        toast.success('Профиль успешно обновлён!');
        handleClose();
        reloadUserData();
        resetEditing();
      } else {
        toast.error('Ошибка при отправке данных.');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      toast.error('Ошибка при редактировании профиля');
    }
  };

  const handleCancel = () => {
    setFormValues(initialValues);
    setIsEditing(false);
  };

  return (
    <Modal open={open} onClose={() => {
      setFormValues(initialValues);
      setIsEditing(false);
      handleClose();
    }}>
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
            <SettingsIcon style={{ color: '#000', fontSize: '30px' }} />
          </div>
          <div style={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div" style={{ color: '#A44A3F', fontWeight: 'bold' }}>
              {isEditing ? 'Редактирование профиля' : 'Профиль'}
            </Typography>
          </div>
          <div style={{ marginRight: '-10px' }}>
            <IconButton onClick={handleClose} style={{ outline: 'none !important', boxShadow: 'none !important' }}>
              <CloseIcon style={{ color: '#A44A3F' }} />
            </IconButton>
          </div>
        </div>
        <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
        
        {!isEditing ? (
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
        ) : (

          <div style={{ display: 'flex', flexDirection: 'column', gap: '34px', marginTop: '40px', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '220px' }}>
              <label style={{ fontSize: '20px', color: '#A44A3F', minWidth: '80px', textAlign: 'left' }}>ФИО:</label>
              <TextField value={formValues.full_name || ''} onChange={(e) => setFormValues(prev => ({ ...prev, full_name: e.target.value }))}
                  fullWidth InputLabelProps={{ shrink: true }} InputProps={{
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
              <TextField value={formValues.email || ''} onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth InputLabelProps={{ shrink: true }} InputProps={{
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
              <TextField value={formValues.role || ''} onChange={(e) => setFormValues(prev => ({ ...prev, role: e.target.value }))}
                  fullWidth InputLabelProps={{ shrink: true }} inputProps={{ readOnly: true }} InputProps={{
                      style: {
                          maxWidth: '300px',
                          height: '55px',
                          borderRadius: '12px',
                          border: '1px solid #A44A3F',
                      },
                  }} />
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          {!isEditing ? (
            <Button variant="contained"
              style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
              onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '20px' }}>
              <Button variant="outlined"
                style={{ backgroundColor: 'rgba(167, 109, 96, 0.7)', color: '#000', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                onClick={handleCancel}>
                Отмена
              </Button>
              <Button variant="contained"
                style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                onClick={handleSubmit}>
                Сохранить
              </Button>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ProfileModal;