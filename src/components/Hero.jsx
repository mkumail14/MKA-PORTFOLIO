import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Terminal } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import './Hero.css';

const Hero = () => {
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (db) {
          const docRef = doc(db, "portfolio", "resume");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().resumeUrl) {
            setResumeUrl(docSnap.data().resumeUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    fetchResume();
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <div className="glass hero-badge">
            <span className="pulse-dot"></span>
            Available for New Opportunities
          </div>
          
          <h1 className="hero-title">
            Crafting Digital
            <br />
            <span className="text-gradient">Experiences</span>
          </h1>
          
          <p className="hero-description">
            I'm a Computer Science student who transforms complex problems into elegant, scalable web solutions. Let's build something extraordinary together.
          </p>
          
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View Work <ArrowRight size={18} />
            </a>
            <a href={resumeUrl || "#"} target={resumeUrl ? "_blank" : "_self"} rel="noreferrer" className="btn btn-secondary">
              Resume <Download size={18} />
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-card glass">
              <span className="stat-number text-gradient">3+</span>
              <span className="stat-label">Years Coding</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-number text-gradient">15+</span>
              <span className="stat-label">Projects Built</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-number text-gradient">3.8</span>
              <span className="stat-label">Major GPA</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="code-window glass">
            <div className="window-header">
              <div className="window-controls">
                <span></span><span></span><span></span>
              </div>
              <div className="window-title">
                <Terminal size={14} /> developer.js
              </div>
            </div>
            <div className="window-body">
              <pre>
                <code>
<span className="keyword">const</span> <span className="variable">developer</span> = {'{'}
<br/>  <span className="property">name</span>: <span className="string">'Computer Science Student'</span>,
<br/>  <span className="property">skills</span>: [<span className="string">'React'</span>, <span className="string">'Node.js'</span>, <span className="string">'Firebase'</span>],
<br/>  <span className="property">passion</span>: <span className="string">'Building AI & Web Apps'</span>,
<br/>  <span className="property">status</span>: <span className="string">'Ready to work'</span>
<br/>{'}'};
<br/><br/>
<span className="keyword">export default</span> <span className="variable">developer</span>;
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
