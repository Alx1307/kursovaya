import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import './Pages.css';
import Header from '../header/Header';

const BooksPage = () => {
    return (
        <div>
            <Sidebar />
            <div className="content-container">
                <Header />
            </div>
        </div>
    );
};

export default BooksPage;