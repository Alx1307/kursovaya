import React, {useState} from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import axios from 'axios';
import './styles/AddUserModal.css';
import { toast } from 'react-toastify';

const resetFormValues = () => ({
    email: '',
    role: ''
});

const AddUserModal = ({ open, handleClose, onSuccess }) => {
    const [formValues, setFormValues] = useState(resetFormValues());

    const handleSubmit = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          
          const response = await axios.post('http://localhost:8080/add', formValues,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            }
          );
    
          if (response.status === 201) {
            toast.success('Сотрудник успешно добавлен!');
            handleClose();
            onSuccess();
            setFormValues(resetFormValues());
          } else {
            toast.error('Ошибка при добавлении сотрудника.');
          }
        } catch (err) {
          toast.error('Ошибка при добавлении сотрудника.');
          console.error('Ошибка при добавлении сотрудника:', err.response?.data || err.message);
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
        <Box className="add-user-modal">
            <div className="add-user-modal-header">
            <div className="add-user-modal-icon-container">
                <PeopleAltIcon style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="add-user-modal-title">
                Добавление сотрудника
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
                <div className="add-user-modal-info-section">
                <div className="add-modal-row">
                    <label className="add-modal-label">Email:</label>
                        <TextField
                            className="add-modal-textfield"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                </div>

                <div className="add-modal-row">
                    <label className="add-modal-label">Роль:</label>
                    <Select
                        style={{ maxWidth: '300px', height: '40px', borderRadius: '12px', border: '1px solid #A44A3F', marginLeft: 'auto' }}
                        fullWidth
                        name="role"
                        value={formValues.role}
                        onChange={handleChange}
                    >
                        {["Администратор", "Библиограф", "Библиотекарь"].map((role) => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                        ))}
                    </Select>
                </div>

                <div className='add-user-button-container'>
                    <Button variant="outlined"
                        style={{ backgroundColor: 'rgba(167, 109, 96, 0.7)', color: '#000', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button variant="contained"
                        style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleSubmit}>
                        Добавить
                    </Button>
                </div>
            </div>
        </Box>
        </Modal>
    );
};

export default AddUserModal;