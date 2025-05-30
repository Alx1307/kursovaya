import React, {useState, useEffect} from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton, Button, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import './styles/ReturnIssueModal.css';

const ReturnIssueModal = ({ open, handleClose, issueData, reloadIssueData }) => {
    const initialValue = {
        comment: issueData?.comment || ''
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
            comment: formValues.comment,
            status: "Возвращена"
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
            alert('Книга успешно возвращена!');
            handleClose();
            reloadIssueData();
          } else {
            alert('Ошибка при возврате книги.');
          }
        } catch (err) {
          console.log('Передаваемые данные:', formValues);
          console.error('Ошибка при возврате книги:', err.response?.data || err.message);
        }
    };

    const handleCancel = () => {
        setFormValues(initialValue);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
        <Box className="return-issue-modal">
            <div className="return-issue-modal-header">
            <div className="return-issue-modal-icon-container">
                <LibraryBooksIcon style={{ color: '#000', fontSize: '30px' }} />
            </div>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" className="return-issue-modal-title">
                Возврат книги
                </Typography>
            </div>
            <div>
                <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: '#A44A3F' }} />
                </IconButton>
            </div>
            </div>
            <Divider style={{ backgroundColor: '#A44A3F', height: '1px' }} />
            
            <div className="return-issue-modal-info-section">
                <div className="return-modal-row">
                <label className="return-modal-label">Комментарий:</label>
                <TextField
                    className="return-modal-textfield"
                    name='comment'
                    value={formValues.comment || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setFormValues(prev => ({ ...prev, comment: e.target.value }))}
                />
                </div>

                <div className='return-issue-button-container'>
                    <Button variant="outlined"
                        style={{ backgroundColor: 'rgba(167, 109, 96, 0.7)', color: '#000', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button variant="contained"
                        style={{ backgroundColor: '#618D4A', color: '#fff', fontWeight: 'bold', fontSize: '16px', width: '260px', height: '54px', borderRadius: '10px', outline: 'none !important', boxShadow: 'none !important' }}
                        onClick={handleSubmit}>
                        Принять
                    </Button>
                </div>
            </div>
        </Box>
        </Modal>
    );
};

export default ReturnIssueModal;