import React from 'react';
import { Modal, Box, Typography, TextField, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import './styles/ViewBookModal.css';

const ViewBookModal = ({ open, handleClose, bookData }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="book-modal">
        <div className="book-modal-header">
          <div className="book-modal-icon-container">
            <BookIcon style={{ color: '#000', fontSize: '30px' }} />
          </div>
          <div style={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div" className="book-modal-title">
              Книга
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
          <div className="book-modal-info-section">
            <div className="book-modal-row">
                <label className="book-modal-label">ID:</label>
                <TextField
                    className="book-modal-textfield"
                    value={bookData?.book_id || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="book-modal-row">
                <label className="book-modal-label">Название:</label>
                <TextField
                    className="book-modal-textfield"
                    value={bookData?.title || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="book-modal-row">
                <label className="book-modal-label">Авторы:</label>
                <TextField
                    className="book-modal-textfield"
                    value={bookData?.authors || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="book-modal-row">
                <label className="book-modal-label">Год публикации:</label>
                <TextField
                    className="book-modal-textfield"
                    value={bookData?.publish_year || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="book-modal-row">
                <label className="book-modal-label">ISBN:</label>
                <TextField
                    className="book-modal-textfield"
                    value={bookData?.isbn || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="book-modal-row">
                <label className="book-modal-label">Шифр:</label>
                <TextField
                    className="book-modal-textfield"
                    value={bookData?.code || ""}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="book-modal-row">
                <label className="book-modal-label">Дата получения:</label>
                <TextField
                    className="book-modal-textfield"
                    value={new Date(bookData?.date_added).toLocaleDateString() ||
                    ""
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />
                </div>

                <div className="book-modal-row">
                <label className="book-modal-label">Количество свободных экземпляров:</label>
                <TextField
                    className="book-modal-textfield"
                    value={bookData?.available_quantity || ""}
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

export default ViewBookModal;