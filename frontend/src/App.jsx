import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import RegistrationPage from './components/registration/RegistrationPage';
import AuthorizationPage from './components/authorization/AuthorizationPage';
import MainPage from './components/pages/MainPage';
import IssuePage from './components/pages/IssuePage';
import BooksPage from './components/pages/BooksPage';
import ReadersPage from './components/pages/ReadersPage';
import HallsPage from './components/pages/HallsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/auth" element={<AuthorizationPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/issues' element={<IssuePage />} />
        <Route path='/books' element={<BooksPage />} />
        <Route path='/readers' element={<ReadersPage />} />
        <Route path='/halls' element={<HallsPage />} />
      </Routes>
    </Router>
  );
}

export default App;