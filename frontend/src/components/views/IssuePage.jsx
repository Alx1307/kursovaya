import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import './Pages.css';

const IssuePage = () => {
  const [issueData, setIssueData] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:8080/issues/all', { 
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error('Ошибка загрузки выданных книг.');

        const data = await response.json();

        const transformedData = data.map(item => ({
          ...item,
          id: item.issue_id,
        }));

        setIssueData(transformedData);
      } catch (err) {
        console.error('Ошибка загрузки выданных книг:', err);
      }
    };

    fetchIssues();
  }, []); 

  const issueColumns = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    { field: 'book_code', headerName: 'Шифр книги', flex: 0.3 },
    { field: 'reader_card_number', headerName: 'Номер читательского билета', flex: 0.3 },
    {
        field: 'readers',
        headerName: 'Принять',
        renderCell: () => (<ArrowCircleLeftIcon style={{ color: 'black' }} />),
        flex: 0.15,
      },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <TableComponent columns={issueColumns} rows={issueData} />
      </div>
    </div>
  );
};

export default IssuePage;