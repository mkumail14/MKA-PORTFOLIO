import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Briefcase, GraduationCap, Home, User, Award, FileText } from 'lucide-react';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import ManageProjects from './ManageProjects';
import ManageEducation from './ManageEducation';
import ManageAbout from './ManageAbout';
import ManageCertifications from './ManageCertifications';
import DashboardOverview from './DashboardOverview';
import ManageResume from './ManageResume';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/admin/about', icon: <User size={20} />, label: 'About Me' },
    { path: '/admin/projects', icon: <Briefcase size={20} />, label: 'Projects' },
    { path: '/admin/education', icon: <GraduationCap size={20} />, label: 'Experience' },
    { path: '/admin/certifications', icon: <Award size={20} />, label: 'Certifications' },
    { path: '/admin/resume', icon: <FileText size={20} />, label: 'Resume' }
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="sidebar-header">
          <h2 className="text-gradient">MKA.dev Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list-vertical">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link return-link">
            <Home size={20} />
            <span>View Public Site</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header glass">
          <h1 className="admin-page-title">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          <div className="admin-user-info">
            <span className="user-email">{auth?.currentUser?.email || 'Admin'}</span>
            <div className="user-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="about" element={<ManageAbout />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="certifications" element={<ManageCertifications />} />
            <Route path="resume" element={<ManageResume />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
