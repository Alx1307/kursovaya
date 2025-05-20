import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import RegistrationPage from './components/registration/RegistrationPage';
import AuthorizationPage from './components/authorization/AuthorizationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/auth" element={<AuthorizationPage />} />
      </Routes>
    </Router>
  );
}

export default App;