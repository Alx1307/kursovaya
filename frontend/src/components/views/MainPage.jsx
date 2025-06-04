import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookIcon from '@mui/icons-material/Book';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import api from '../../api/index';
import './Pages.css';

const MainPage = () => {
    const [statisticsData, setStatisticsData] = useState([]);

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

            const data = [
                { id: 1, label: 'Книги', value: booksData.totalBooks },
                { id: 2, label: 'Читатели', value: readersData.totalReaders },
                { id: 3, label: 'Сотрудники', value: librariansData.totalLibrarians },
                { id: 4, label: 'Залы', value: hallsData.totalHalls },
                { id: 5, label: 'Выдачи', value: issuesData.totalIssues },
            ];

            setStatisticsData(data);
        } catch (err) {
            console.error('Ошибка загрузки статистики:', err);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const statisticsColumns = [
        {
            field: 'icon',
            headerName: '',
            flex: 0.2,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, height: '100%' }}>
                    {getIcon(params.row.label)}
                </div>
            ),
        },
        { 
            field: 'label',
            headerName: '',
            flex: 0.4,
            renderCell: (params) => (
                <span style={{ fontWeight: 'bold', color: '#618d4a', fontSize: '16px' }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'value',
            headerName: '',
            flex: 0.4,
            renderCell: (params) => (
                <span style={{ fontWeight: 'bold', color: '#A44A3F', fontSize: '16px' }}>
                    {params.value}
                </span>
            ),
        },
    ];

    const getIcon = (label) => {
        switch (label) {
            case 'Выдачи':
                return <LibraryBooksIcon />;
            case 'Сотрудники':
                return <PeopleAltIcon />;
            case 'Читатели':
                return <LocalLibrary />;
            case 'Залы':
                return <MeetingRoomIcon />;
            case 'Книги':
                return <BookIcon />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Sidebar />
            <div className="content-container">
                <Header />
                <h3 className="table-header">Статистика</h3>
                <TableComponent columns={statisticsColumns} rows={statisticsData} height='45vh' />
            </div>
        </div>
    );
};

export default MainPage;