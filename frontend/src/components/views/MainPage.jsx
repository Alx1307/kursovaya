import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import api from '../../api/index';
import './Pages.css';

const MainPage = () => {
    const [issueData, setIssueData] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalReaders, setTotalReaders] = useState(0);
    const [totalLibrarians, setTotalLibrarians] = useState(0);
    const [totalHalls, setTotalHalls] = useState(0);
    const [totalIssues, setTotalIssues] = useState(0);

    const fetchIssues = async () => {
        try {
            const authToken = localStorage.getItem('authToken');

            const response = await fetch('http://localhost:8080/statistics/expired/issues', { 
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

    const fetchStatistics = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const [booksResponse, readersResponse, librariansResponse, hallsResponse, issuesResponse] = await Promise.all([
                fetch('http://localhost:8080/statistics/total/books', { headers: { Authorization: `Bearer ${authToken}` } }),
                fetch('http://localhost:8080/statistics/total/readers', { headers: { Authorization: `Bearer ${authToken}` } }),
                fetch('http://localhost:8080/statistics/total/librarians', { headers: { Authorization: `Bearer ${authToken}` } }),
                fetch('http://localhost:8080/statistics/total/halls', { headers: { Authorization: `Bearer ${authToken}` } }),
                fetch('http://localhost:8080/statistics/total/issues', { headers: { Authorization: `Bearer ${authToken}` } }),
            ]);
            if (!booksResponse.ok || !readersResponse.ok || !librariansResponse.ok || !hallsResponse.ok || !issuesResponse.ok) {
                throw new Error('Ошибка загрузки статистики.');
            }
            const booksData = await booksResponse.json();
            const readersData = await readersResponse.json();
            const librariansData = await librariansResponse.json();
            const hallsData = await hallsResponse.json();
            const issuesData = await issuesResponse.json();

            setTotalBooks(booksData.totalBooks);
            setTotalReaders(readersData.totalReaders);
            setTotalLibrarians(librariansData.totalLibrarians);
            setTotalHalls(hallsData.totalHalls);
            setTotalIssues(issuesData.totalIssues);
        } catch (err) {
            console.error('Ошибка загрузки статистики:', err);
        }
    };

    useEffect(() => {
        fetchIssues();
        fetchStatistics();
    }, []);

    const issueColumns = [
        {field: 'id', headerName: 'ID', flex: 0.05},
        {field: 'book_id', headerName: 'ID книги', flex: 0.1 },
        {field: 'reader_id', headerName: 'ID читателя', flex: 0.2 },
        {field: 'issue_date', headerName: 'Дата выдачи', flex: 0.15 },
        {field: 'return_date', headerName: 'Дата возврата', flex: 0.15},
        {
          field: 'status',
          headerName: 'Статус',
          flex: 0.15,
          renderCell: (params) => {
            let style = { fontWeight: 'bold', color: '#A44A3F', fontSize: '16px' };
            return (
              <span style={style}>
                {params.row.status}
              </span>
            );
          },
        },
    ];

    return (
        <div>
            <Sidebar />
            <div className="content-container">
                <Header />
                <h3 className="table-header">Просроченные выдачи</h3>
                <TableComponent columns={issueColumns} rows={issueData} height="20vh" width="100%"/>
                <h3 className="table-header">Статистика</h3>
                <div className="statistics-container">
                    <div>Всего книг: {totalBooks}</div>
                    <div>Всего читателей: {totalReaders}</div>
                    <div>Всего библиотекарей: {totalLibrarians}</div>
                    <div>Всего залов: {totalHalls}</div>
                    <div>Всего выдач: {totalIssues}</div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;