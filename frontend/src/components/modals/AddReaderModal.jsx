import React, {useState} from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button, Select, MenuItem } from '@mui/material';
import MaskedInput from 'react-input-mask';
import CloseIcon from '@mui/icons-material/Close';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import axios from 'axios';
import './styles/AddReaderModal.css';

const resetFormValues = () => ({
    name: '',
    card_number: '',
    birth_date: '',
    phone: '',
    hall_id: ''
});

const AddReaderModal = ({ open, handleClose, onSuccess }) => {
    const [formValues, setFormValues] = useState(resetFormValues());

    const handleSubmit = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          
          const response = await axios.post('http://localhost:8080/readers/add', formValues,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            }
          );
    
          if (response.status === 201) {
            alert('Читатель успешно добавлен!');
            handleClose();
            onSuccess();
            setFormValues(resetFormValues());
          } else {
            alert('Ошибка при добавлении читателя.');
          }
        } catch (err) {
          console.error('Ошибка при добавлении читателя:', err.response?.data || err.message);
          alert('Ошибка при добавлении читателя.');
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
        <Box className="add-reader-modal">
            <div className="add-reader-modal-header">
            <div className="add-reader-modal-icon-container">
                <LocalLibrary style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="add-reader-modal-title">
                Добавление читателя
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
            <div className="add-reader-modal-info-section">
                <div className="add-modal-row">
                <label className="add-modal-label">ФИО:</label>
                <TextField
                    className="add-modal-textfield"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">№ читательского билета:</label>
                <TextField
                    className="add-modal-textfield"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name='card_number'
                    value={formValues.card_number}
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Дата рождения:</label>
                <TextField
                    className="add-modal-textfield"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name='birth_date'
                    value={formValues.birth_date}
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                <label className="add-modal-label">Телефон:</label>
                <TextField
                    className="add-modal-textfield"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name='phone'
                    inputComponent={MaskedInput}
                    mask="+7 999 999-99-99"
                    placeholder="+7 ___ ___-__-__"
                    value={formValues.phone}
                    onChange={handleChange}
                />
                </div>

                <div className="add-modal-row">
                    <label className="add-modal-label">ID зала:</label>
                    <Select
                        style={{ maxWidth: '300px', height: '40px', borderRadius: '12px', border: '1px solid #A44A3F', marginLeft: 'auto' }}
                        fullWidth
                        name="hall_id"
                        value={formValues.hall_id}
                        onChange={handleChange}
                    >
                        {[1, 2, 3, 4, 5].map((hallId) => (
                            <MenuItem key={hallId} value={hallId}>{hallId}</MenuItem>
                        ))}
                    </Select>
                </div>

                <div className='add-reader-button-container'>
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
            </div>
        </Box>
        </Modal>
    );
};

export default AddReaderModal;