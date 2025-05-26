import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SearchPanel from '../search/SearchPanel';
import ViewBookModal from '../modals/ViewBookModal';
import axios from 'axios';
import './Pages.css';

const BooksPage = () => {
  const [booksData, setBooksData] = useState([]);
  const [decodedRole, setDecodedRole] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (row) => {
    setSelectedBook(row);
    setModalOpen(true);
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
    { field: 'available_quantity', headerName: 'Доступно', flex: 0.1 },
  ];

  if (decodedRole !== 'Администратор') {
    booksColumns.push({
      field: 'actions',
      headerName: decodedRole === 'Библиотекарь' ? 'Выдать' : '',
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
              <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
              <DeleteIcon style={{ color: 'black', width: 25, height: 25 }} />
            </>)
          }
          {
            decodedRole !== 'Библиограф' &&
            <ArrowCircleRightIcon style={{ color: 'black', width: 25, height: 25 }} />
          }
        </div>
      ),
    });
  }

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="Название, автор, шифр или ISBN" pageType="books" buttonText="Добавить"/>
        <TableComponent columns={booksColumns} rows={booksData} />
        <ViewBookModal open={modalOpen} handleClose={() => setModalOpen(false)} bookData={selectedBook} />
      </div>
    </div>
  );
};

export default BooksPage;