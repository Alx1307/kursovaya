import React, {useState, useEffect} from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import './styles/EditIssueModal.css';

const EditIssueModal = ({ open, handleClose, issueData, reloadIssueData }) => {
    function transformDate(date) {
        if (!date) return '';
        const parts = date.split('.');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const initialValue = {
        return_date: issueData?.return_date ? transformDate(issueData.return_date) : ''
    };

    const [formValues, setFormValues] = useState(initialValue);

    useEffect(() => {
        setFormValues(initialValue);
    }, [issueData]);

    const handleSubmit = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          const issue_id = issueData.issue_id;

          const editedValue = {
            return_date: formValues.return_date
          };
          
          const response = await fetch(`http://localhost:8080/issues/edit/${issue_id}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(editedValue),
          });
    
          if (response.status === 200) {
            alert('Дата возврата успешно изменена!');
            handleClose();
            reloadIssueData();
          } else {
            alert('Ошибка при изменении даты возврата.');
          }
        } catch (err) {
          console.log('Передаваемые данные:', formValues);
          console.error('Ошибка при изменении даты возврата:', err.response?.data || err.message);
        }
    };

    const handleCancel = () => {
        setFormValues(initialValue);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
        <Box className="edit-issue-modal">
            <div className="edit-issue-modal-header">
            <div className="edit-issue-modal-icon-container">
                <LibraryBooksIcon style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="edit-issue-modal-title">
                Изменение даты возврата
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
            <div className="edit-issue-modal-info-section">
                <div className="edit-modal-row">
                <label className="edit-modal-label">Дата возврата:</label>
                <TextField
                    className="edit-modal-textfield"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name='return_date'
                    value={formValues.return_date}
                    onChange={(e) => setFormValues(prev => ({ ...prev, return_date: e.target.value }))}
                />
                </div>

                <div className='edit-issue-button-container'>
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

export default EditIssueModal;