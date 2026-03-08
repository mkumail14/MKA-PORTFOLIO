import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="text-gradient">MKA.dev</h3>
            <p className="footer-bio">
              Building digital experiences that combine stunning design with robust engineering.
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#education">Education</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="#" aria-label="Github"><Github size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" aria-label="Email"><Mail size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            Designed & Built with <Heart size={14} className="heart-icon" /> by <span onClick={() => navigate('/admin/login')} style={{ cursor: 'default' }}>MKA</span>
          </p>
          <p className="copyright">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
