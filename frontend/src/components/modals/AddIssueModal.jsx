import React, {useState} from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button, Select, MenuItem } from '@mui/material';
import MaskedInput from 'react-input-mask';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import axios from 'axios';
import './styles/AddIssueModal.css';
import { toast } from 'react-toastify';

const AddIssueModal = ({ open, handleClose, onSuccess, initialBookId }) => {
    const [formValues, setFormValues] = useState({
        book_id: initialBookId || '',
        reader_id: '',
        return_date: '',
        comment: ''
    });

    const handleSubmit = async () => {
        try {
          const authToken = localStorage.getItem('authToken');

          const payload = {
            book_id: initialBookId || formValues.book_id,
            ...formValues
        };
          
          const response = await axios.post('http://localhost:8080/issues/add', payload,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            }
          );
    
          if (response.status === 201) {
            toast.success('Книга успешно выдана!');
            handleClose();
            onSuccess();
            setFormValues(resetFormValues());
          } else {
            toast.error('Ошибка при выдаче книги.');
          }
        } catch (err) {
          toast.error('Ошибка при выдаче книги.');
          console.error('Ошибка при выдаче книги:', err.response?.data || err.message);
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
        <Box className="add-issue-modal">
            <div className="add-issue-modal-header">
            <div className="add-issue-modal-icon-container">
                <LibraryBooksIcon style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="add-issue-modal-title">
                Выдача книги
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
                <div className="add-issue-modal-info-section">
                <div className="add-modal-row">
                <label className="add-modal-label">ID книги:</label>
                <TextField
                    className="add-modal-textfield"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name="book_id"
                    value={initialBookId || formValues.book_id}
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">ID читателя:</label>
                <TextField
                    className="add-modal-textfield"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name='reader_id'
                    value={formValues.reader_id}
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Дата возврата:</label>
                <TextField
                    className="add-modal-textfield"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name='return_date'
                    value={formValues.return_date}
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Комментарий:</label>
                <TextField
                    className="add-modal-textfield"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name='comment'
                    value={formValues.comment}
                    onChange={handleChange}
                />
                </div>

                <div className='add-issue-button-container'>
                    <Button variant="outlined"
                        style={{ backgroundColor: 'rgba(167, 109, 96, 0.7)', color: '#000', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button variant="contained"
                        style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleSubmit}>
                        Выдать
                    </Button>
                </div>
            </div>
        </Box>
        </Modal>
    );
};

export default AddIssueModal;