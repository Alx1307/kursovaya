import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import EditIcon from '@mui/icons-material/Edit';
import SearchPanel from '../search/SearchPanel';
import './Pages.css';

const IssuePage = () => {
  const [issueData, setIssueData] = useState([]);
  const [decodedRole, setDecodedRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const decodedToken = JSON.parse(jsonPayload);
      setDecodedRole(decodedToken.role);
    }

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

        console.log(transformedData);

        setIssueData(transformedData);
      } catch (err) {
        console.error('Ошибка загрузки выданных книг:', err);
      }
    };

    fetchIssues();
  }, []); 

  const issueColumns = [
    { field: 'id', headerName: 'ID', flex: 0.05 },
    { field: 'book_code', headerName: 'Шифр книги', flex: 0.1 },
    { field: 'reader_card_number', headerName: 'Номер читательского билета', flex: 0.2 },
    { field: 'issue_date', headerName: 'Дата выдачи', flex: 0.15 },
    {
        field: 'return_date',
        headerName: 'Дата возврата',
        flex: 0.15,
        renderCell: (params) => (
          <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                height: '100%',
            }}>
            {params.value}
            <EditIcon style={{ color: 'black', width: 25, height: 25, marginLeft: '5' }} />
          </div>
        ),
    },
    { field: 'status', headerName: 'Статус', flex: 0.15 },
    {
        field: 'readers',
        headerName: 'Принять',
        renderCell: () => (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                height: '100%',
              }}>
                <ArrowCircleLeftIcon style={{ color: 'black', width: 25, height: 25 }} />
              </div>
        ),
        flex: 0.1,
      },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="Шифр книги или № читательского билета" pageType="issue" buttonText="Выдать"/>
        <TableComponent columns={issueColumns} rows={issueData} />
      </div>
    </div>
  );
};

export default IssuePage;