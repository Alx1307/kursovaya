import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import './styles/EditUserModal.css';
import { toast } from 'react-toastify';

const EditUserModal = ({ open, handleClose, userData, reloadUserData }) => {
    const initialValues = {
        full_name: userData?.full_name || '',
        email: userData?.email || '',
        role: userData?.role || ''
    };

    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        setFormValues(initialValues);
    }, [userData]);

    const handleSubmit = async () => {
        try {
            const editedData = formValues;
            const librarian_id = userData.librarian_id;
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
                toast.success('Сотрудник успешно обновлен!');
                handleClose();
                reloadUserData();
            } else {
                toast.error('Ошибка при отправке данных.');
            }
        } catch (err) {
            console.error('Ошибка: ', err);
            toast.error('Ошибка при редактировании сотрудника.');
        }
    };

    const handleCancel = () => {
        setFormValues(initialValues);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
        <Box className="edit-user-modal">
            <div className="edit-user-modal-header">
            <div className="edit-user-modal-icon-container">
                <PeopleAltIcon style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="edit-user-modal-title">
                Редактирование сотрудника
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
            {userData && (
            <div className="edit-user-modal-info-section">
                <div className="edit-modal-row">
                <label className="edit-modal-label">ФИО:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.full_name || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, full_name: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">Email:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.email || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">Роль:</label>
                <Select
                    style={{ maxWidth: '300px', height: '40px', borderRadius: '12px', border: '1px solid #A44A3F', marginLeft: 'auto' }}
                    value={formValues.role || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, role: e.target.value }))}
                >
                    {["Администратор", "Библиограф", "Библиотекарь"].map((role) => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                        ))}
                </Select>
                </div>

                <div className='edit-user-button-container'>
                    <Button 
                        style={{ backgroundColor: 'rgba(167, 109, 96, 0.7)', color: '#000', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button
                        style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleSubmit}>
                        Сохранить
                    </Button>
                </div>
            </div>
            )}
        </Box>
        </Modal>
    );
};

export default EditUserModal;