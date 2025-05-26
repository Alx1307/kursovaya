import React from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import './styles/ViewReaderModal.css';

const ViewReaderModal = ({ open, handleClose, readerData }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="reader-modal">
        <div className="reader-modal-header">
          <div className="reader-modal-icon-container">
            <LocalLibrary style={{ color: '#000', fontSize: '30px' }} />
          </div>
          <div style={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div" className="reader-modal-title">
              Читатель
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
          <div className="reader-modal-info-section">
            <div className="modal-row">
                <label className="modal-label">ID:</label>
                <TextField
                    className="modal-textfield"
                    value={readerData?.reader_id || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="modal-row">
                <label className="modal-label">ФИО:</label>
                <TextField
                    className="modal-textfield"
                    value={readerData?.name || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="modal-row">
                <label className="modal-label">№ читательского билета:</label>
                <TextField
                    className="modal-textfield"
                    value={readerData?.card_number || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="modal-row">
                <label className="modal-label">Дата рождения:</label>
                <TextField
                    className="modal-textfield"
                    value={
                    new Date(readerData?.birth_date).toLocaleDateString() ||
                    ""
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="modal-row">
                <label className="modal-label">Телефон:</label>
                <TextField
                    className="modal-textfield"
                    value={readerData?.phone || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="modal-row">
                <label className="modal-label">ID зала:</label>
                <TextField
                    className="modal-textfield"
                    value={readerData?.hall_id || ""}
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

export default ViewReaderModal;