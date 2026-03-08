import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Public Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

// Admin Components
import Login from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import './index.css';

const PublicPortfolio = () => (
  <div className="app">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Projects />
      <Education />
      <Certifications />
      <Contact />
    </main>
    <Footer />
  </div>
);

const TitleUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.title = "MKA Portfolio-Admin";
    } else {
      document.title = "MKA Portfolio";
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <TitleUpdater />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<PublicPortfolio />} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
