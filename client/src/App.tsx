import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
