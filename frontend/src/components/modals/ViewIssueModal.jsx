import React from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import './styles/ViewIssueModal.css';

const ViewIssueModal = ({ open, handleClose, issueData }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="issue-modal">
        <div className="issue-modal-header">
          <div className="issue-modal-icon-container">
            <LibraryBooksIcon style={{ color: '#000', fontSize: '30px' }} />
          </div>
          <div style={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div" className="issue-modal-title">
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
        
        {issueData && (
          <div className="issue-modal-info-section">
            <div className="issue-modal-row">
                <label className="issue-modal-label">ID:</label>
                <TextField
                    className="issue-modal-textfield"
                    value={issueData?.issue_id || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="issue-modal-row">
                <label className="issue-modal-label">Шифр книги:</label>
                <TextField
                    className="issue-modal-textfield"
                    value={issueData?.book_code || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="issue-modal-row">
                <label className="issue-modal-label">№ билета читателя:</label>
                <TextField
                    className="issue-modal-textfield"
                    value={issueData?.reader_card_number || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="issue-modal-row">
                <label className="issue-modal-label">Дата выдачи:</label>
                <TextField
                    className="issue-modal-textfield"
                    value={issueData?.issue_date || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="issue-modal-row">
                <label className="issue-modal-label">Дата возврата:</label>
                <TextField
                    className="issue-modal-textfield"
                    value={issueData?.return_date || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="issue-modal-row">
                <label className="issue-modal-label">Статус:</label>
                <TextField
                    className="issue-modal-textfield"
                    value={issueData?.status || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="issue-modal-row">
                <label className="issue-modal-label">Комменатрий:</label>
                <TextField
                    className="issue-modal-textfield"
                    value={issueData?.comment || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default ViewIssueModal;