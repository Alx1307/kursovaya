import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SearchPanel from '../search/SearchPanel';


import './Pages.css';

const BooksPage = () => {
  const [booksData, setBooksData] = useState([]);

  useEffect(() => {
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
            fullAuthorNames: (item.Authors || []).map(({ surname, name, patronymic }) => {
              const fullName = `${surname ?? ''} ${name ?? ''} ${patronymic ?? ''}`.trim();
              console.log('Автор:', { surname, name, patronymic, fullName });
              return fullName;
            }),
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
    { field: 'title', headerName: 'Название', flex: 0.2 },
    { field: 'code', headerName: 'Шифр', flex: 0.15 },
    {
        field: 'fullAuthorNames',
        headerName: 'Авторы',
        flex: 0.2,
        valueGetter: (params) => {
            if (!params.row || !Array.isArray(params.row.fullAuthorNames)) {
              return '-';
            }
            const names = params.row.fullAuthorNames.filter(name => !!name);
            return names.length > 0 ? names.join(', ') : '-';
          },
    },
    { field: 'isbn', headerName: 'ISBN', flex: 0.2 },
    { field: 'available', headerName: 'Доступно', flex: 0.1 },
    {
        field: 'action',
        headerName: '',
        flex: 0.1,
        renderCell: (params) => (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            height: '100%',
          }}>
            <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
            <DeleteIcon style={{ color: 'black', width: 25, height: 25 }} />
            <ArrowCircleRightIcon style={{ color: 'black', width: 25, height: 25 }} />
          </div>
        ),
    },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="Название, автор, шифр или ISBN" pageType="books" buttonText="Добавить"/>
        <TableComponent columns={booksColumns} rows={booksData} />
      </div>
    </div>
  );
};

export default BooksPage;