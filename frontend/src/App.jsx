import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import RegistrationPage from './components/registration/RegistrationPage';
import AuthorizationPage from './components/authorization/AuthorizationPage';
import MainPage from './components/views/MainPage';
import IssuePage from './components/views/IssuePage';
import BooksPage from './components/views/BooksPage';
import ReadersPage from './components/views/ReadersPage';
import HallsPage from './components/views/HallsPage';
import PrivateRoute from './routes/PrivateRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/auth" element={<AuthorizationPage />} />

        <Route path="/main" element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        } />
        <Route path="/issues" element={
          <PrivateRoute>
            <IssuePage />
          </PrivateRoute>
        } />
        <Route path="/books" element={
          <PrivateRoute>
            <BooksPage />
          </PrivateRoute>
        } />
        <Route path="/readers" element={
          <PrivateRoute>
            <ReadersPage />
          </PrivateRoute>
        } />
        <Route path="/halls" element={
          <PrivateRoute>
            <HallsPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;