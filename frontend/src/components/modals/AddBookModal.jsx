import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import axios from 'axios';
import './styles/AddBookModal.css';

const resetFormValues = () => ({
    title: '',
    publish_year: '',
    isbn: '',
    code: '',
    quantity: '',
    authors: [{
        surname: '',
        name: '',
        patronymic: ''
    }],
});

const AddBookModal = ({ open, handleClose, onSuccess }) => {
    const [formValues, setFormValues] = useState(resetFormValues());

    const handleSubmit = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          
          const newAuthor = {
            surname: formValues.surname,
            name: formValues.name,
            patronymic: formValues.patronymic
          };

          const preparedData = {
            title: formValues.title,
            publish_year: formValues.publish_year,
            isbn: formValues.isbn,
            code: formValues.code,
            quantity: formValues.quantity,
            authors: [newAuthor]
        };

          const response = await axios.post('http://localhost:8080/books/create', preparedData,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            }
          );
    
          if (response.status === 201) {
            alert('Книга успешно добавлена!');
            handleClose();
            onSuccess();
            setFormValues(resetFormValues());
          } else {
            alert('Ошибка при добавлении книги.');
          }
        } catch (err) {
          console.error('Ошибка при добавлении книги:', err.message);
        }
    };

    const handleCancel = () => {
        handleClose();
        setFormValues(resetFormValues());
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Modal open={open} onClose={handleClose}>
        <Box className="add-book-modal">
            <div className="add-book-modal-header">
            <div className="add-book-modal-icon-container">
                <BookIcon style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="add-book-modal-title">
                Добавление книги
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
            <div className="add-book-modal-info-section">
                <div className="add-modal-row">
                <label className="add-modal-label">Название:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.title}
                    name='title'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Фамилия автора:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.surname}
                    name='surname'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Имя автора:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.name}
                    name='name'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Отчество автора:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.patronymic}
                    name='patronymic'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Год публикации:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.publish_year}
                    name='publish_year'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">ISBN:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.isbn}
                    name='isbn'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Шифр:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.code}
                    name='code'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Количество экземпляров:</label>
                <TextField
                    className="add-modal-textfield"
                    value={formValues.quantity}
                    name='quantity'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={handleChange}
                />
                </div>

                <div className='add-book-button-container'>
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
        </Box>
        </Modal>
    );
};

export default AddBookModal;