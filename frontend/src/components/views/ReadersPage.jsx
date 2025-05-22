import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import './Pages.css';

const ReadersPage = () => {
    return (
        <div>
            <Sidebar />
            <div className="content-container">
                <Header />
            </div>
        </div>
    );
};

export default ReadersPage;