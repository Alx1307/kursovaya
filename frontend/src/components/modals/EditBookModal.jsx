import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import './styles/EditBookModal.css';

const EditBookModal = ({ open, handleClose, bookData, reloadBookData }) => {
    const initialValues = {
        title: bookData?.title || '',
        authors: bookData?.authors || '',
        publish_year: bookData?.publish_year || '',
        isbn: bookData?.isbn || '',
        code: bookData?.code || '',
        date_added: bookData?.date_added ? new Date(bookData.date_added).toISOString().split("T")[0] : "",
        available_quantity: bookData?.available_quantity || ''
    };

    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        setFormValues(initialValues);
    }, [bookData]);

    const handleSubmit = async () => {
        try {
            const editedData = formValues;
            const book_id = bookData.book_id;
            const authToken = localStorage.getItem('authToken');

            const response = await fetch(`http://localhost:8080/books/edit/${book_id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                alert('Книга успешно обновлена!');
                handleClose();
                reloadBookData();
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
        <Box className="edit-book-modal">
            <div className="edit-book-modal-header">
            <div className="edit-book-modal-icon-container">
                <BookIcon style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="edit-book-modal-title">
                Редактирование книги
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
            {bookData && (
            <div className="edit-book-modal-info-section">
                <div className="edit-modal-row">
                <label className="edit-modal-label">Название:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.title || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">Авторы:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.authors || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, authors: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">Год публикации:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.publish_year || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, publish_year: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">ISBN:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.isbn || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, isbn: e.target.value }))}
                />
                </div>

                <div className="edit-modal-row">
                <label className="edit-modal-label">Количество свободных экземпляров:</label>
                <TextField
                    className="edit-modal-textfield"
                    value={formValues.available_quantity || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, available_quantity: e.target.value }))}
                />
                </div>

                <div className='edit-book-button-container'>
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

export default EditBookModal;