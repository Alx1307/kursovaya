import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SearchPanel from '../search/SearchPanel';
import ViewBookModal from '../modals/ViewBookModal';
import IconButton from '@mui/material/IconButton';
import ConfirmDeleteBookModal from '../modals/ConfirmDeleteBookModal';
import EditBookModal from '../modals/EditBookModal';
import AddBookModal from '../modals/AddBookModal';
import AddIssueModal from '../modals/AddIssueModal';
import axios from 'axios';
import './Pages.css';

const BooksPage = () => {
  const [booksData, setBooksData] = useState([]);
  const [decodedRole, setDecodedRole] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [bookToIssue, setBookToIssue] = useState(null);

  const handleRowClick = (row) => {
    setSelectedBook(row);
    setModalOpen(true);
  };

  const handleDeleteClick = (bookId) => {
    setBookToDelete(bookId);
    setDeleteModalOpen(true);
  };

  const handleEditOpen = (bookId) => {
    setSelectedBook(bookId);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleOpenIssueModal = (bookId) => {
    console.log('ID: ', bookId);
    console.log('BookToIssue: ', bookToIssue);
    setBookToIssue(bookId);
    console.log('BookToIssue: ', bookToIssue);
    setIsIssueModalOpen(true);
  };

  const handleCloseIssueModal = () => {
    setBookToIssue(null)
    setIsIssueModalOpen(false);
  };

  const deleteBook = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:8080/books/delete/${bookToDelete}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        console.log('Книга успешно удалена');
        refreshBooks();
      }
    } catch (error) {
      console.error('Ошибка при удалении книги:', error);
    } finally {
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

  const fetchBooks = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:8080/books/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
  
        if (!response.ok) throw new Error(`Ошибка загрузки книг.`);
  
        const data = await response.json();
  
        const transformedData = data.map((item) => ({
          ...item,
          id: item.book_id,
        }));
  
        setBooksData(transformedData);
      } catch (err) {
        console.error("Ошибка загрузки книг:", err);
      }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return;

        const config = {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        };

        const response = await axios.get('http://localhost:8080/librarian/data', config);
        const userData = response.data;
        setDecodedRole(userData.role);
      } catch (err) {
        console.error('Ошибка при получении роли:', err.message);
      }
    };

    fetchUserRole();

    const fetchBooks = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:8080/books/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error('Ошибка загрузки книг.');

        const data = await response.json();

        console.log('Данные с сервера:', data);

        const processedData = data.map((item) => ({
            ...item,
            id: item.book_id,
        }));

        console.log('Обработанные данные:', processedData);

        setBooksData(processedData);
      } catch (err) {
        console.error('Ошибка загрузки книг:', err);
      }
    };

    fetchBooks();
  }, []);

  const refreshBooks = () => {
    fetchBooks();
  };

  const booksColumns = [
    { field: 'id', headerName: 'ID', flex: 0.05 },
    {
      field: 'title',
      headerName: 'Название',
      flex: 0.2,
      renderCell: (params) => (
        <div
          style={{
            display: 'inline-block',
            cursor: 'pointer'
          }}
          onClick={() => handleRowClick(params.row)}
        >
          {params.value}
        </div>
      )
    },
    { field: 'code', headerName: 'Шифр', flex: 0.15 },
    {
        field: 'authors',
        headerName: 'Авторы',
        flex: 0.2,
    },
    { field: 'isbn', headerName: 'ISBN', flex: 0.2 },
    {
      field: 'available_quantity',
      headerName: 'Доступно',
      flex: 0.1,
      renderCell: (params) => {
        const isLowStock = parseInt(params.row.available) < 3;
        return (
          <span style={{ fontWeight: isLowStock ? 'bold' : 'normal', color: isLowStock ? '#A44A3F' : 'black', fontSize: isLowStock ? '18px' : '' }}>
            {params.row.available}/{params.row.quantity}
          </span>
        );
      },
    },
  ];

  if (decodedRole == 'Библиограф') {
    booksColumns.push({
      field: 'actions',
      headerName: '', //decodedRole === 'Библиотекарь' ? 'Выдать' : '',
      flex: 0.1,
      renderCell: (params) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
          height: '100%',
        }}>
          {
            decodedRole === 'Библиограф' &&
            (<>
              <IconButton className="IconButton" onClick={() => handleEditOpen(params.row)}>
                  <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
              </IconButton>
              <IconButton className="IconButton" onClick={() => handleDeleteClick(params.row.id)}>
                  <DeleteIcon style={{ color: 'black', width: 25, height: 25 }} />
              </IconButton>
            </>)
          }
          {/* {
            decodedRole !== 'Библиограф' &&
            <IconButton className="IconButton" onClick={() => handleOpenIssueModal(params.row.id)}>
                  <ArrowCircleRightIcon style={{ color: 'black', width: 25, height: 25 }} />
            </IconButton>
          } */}
        </div>
      ),
    });
  }

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="Название, автор, шифр или ISBN" pageType="books" buttonText="Добавить" onAddClick={handleAddClick}/>
        <TableComponent columns={booksColumns} rows={booksData} />
        <ViewBookModal open={modalOpen} handleClose={() => setModalOpen(false)} bookData={selectedBook} />
        <AddBookModal open={showAddModal} handleClose={() => setShowAddModal(false)} onSuccess={refreshBooks} />
        <ConfirmDeleteBookModal open={deleteModalOpen} handleClose={() => setDeleteModalOpen(false)} handleConfirm={deleteBook} />
        <EditBookModal open={editModalOpen} handleClose={() => setEditModalOpen(false)} bookData={selectedBook} reloadBookData={refreshBooks}/>
        <AddIssueModal open={isIssueModalOpen} handleClose={handleCloseIssueModal} initialBookId={bookToIssue}/>
      </div>
    </div>
  );
};

export default BooksPage;