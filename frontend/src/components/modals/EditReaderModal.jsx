import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import './styles/EditReaderModal.css';

const EditReaderModal = ({ open, handleClose, readerData, reloadReaderData }) => {
    const initialValues = {
        name: readerData?.name || '',
        card_number: readerData?.card_number || '',
        birth_date: readerData?.birth_date ? new Date(readerData.birth_date).toISOString().split("T")[0] : "",
        phone: readerData?.phone || '',
        hall_id: readerData?.hall_id || ''
    };

    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        setFormValues(initialValues);
    }, [readerData]);

    const handleSubmit = async () => {
        try {
            const editedData = formValues;
            const reader_id = readerData.reader_id;
            const authToken = localStorage.getItem('authToken');

            const response = await fetch(`http://localhost:8080/readers/edit/${reader_id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                alert('Читатель успешно обновлен!');
                handleClose();
                reloadReaderData();
            } else {
                alert('Ошибка при отправке данных.');
            }
        } catch (err) {
            console.error('Ошибка: ', err);
            alert('Что-то пошло не так.');
        }
    };

    const handleCancel = () => {
        setFormValues(initialValues);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
        <Box className="edit-reader-modal">
            <div className="edit-reader-modal-header">
            <div className="edit-reader-modal-icon-container">
                <LocalLibrary style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="edit-reader-modal-title">
                Редактирование читателя
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
            {readerData && (
            <div className="edit-reader-modal-info-section">
                <div className="edit-modal-row">
                <label className="edit-modal-label">ФИО:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.name || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">№ читательского билета:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.card_number || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, card_number: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">Дата рождения:</label>
                <TextField
                    className="edit-modal-textfield"
                    type="date"
                    value={formValues.birth_date || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, birth_date: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">Телефон:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.phone || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, phone: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">ID зала:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.hall_id || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, hall_id: e.target.value }))}
                />
                </div>

                <div className='edit-reader-button-container'>
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

export default EditReaderModal;