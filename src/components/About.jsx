import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { fallbackAbout, personalInfo } from '../data/fallbackData';
import { Code, Database, Layout, Server, Terminal, Smartphone } from 'lucide-react';
import './About.css';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        if (db) {
          const docRef = doc(db, "portfolio", "about");
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setAboutData(docSnap.data());
          } else {
            setAboutData(fallbackAbout);
          }
        } else {
          setAboutData(fallbackAbout);
        }
      } catch (error) {
        console.error("Error fetching about data: ", error);
        setAboutData(fallbackAbout);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const skills = [
    { name: 'Frontend', icon: <Layout size={24} />, items: ['React', 'Vue', 'Tailwind', 'Framer Motion'] },
    { name: 'Backend', icon: <Server size={24} />, items: ['Node.js', 'Express', 'Go', 'Python'] },
    { name: 'Database', icon: <Database size={24} />, items: ['MongoDB', 'PostgreSQL', 'Firebase'] },
    { name: 'Tools', icon: <Terminal size={24} />, items: ['Git', 'Docker', 'AWS', 'Linux'] }
  ];

  if (loading) {
    return (
      <section id="about" className="section-padding about-section">
        <div className="container text-center">
          <div className="loader pulse-dot mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="section-padding about-section">
      <div className="container">
        <h2 className="section-title">
          About <span className="text-gradient">Me</span>
        </h2>

        <div className="about-content" style={{ display: 'grid', gridTemplateColumns: aboutData?.imageUrl ? '1fr 2fr' : '1fr', gap: '3rem', alignItems: 'start' }}>
          
          {aboutData?.imageUrl && (
            <div className="about-image-container glass" style={{ padding: '1rem', borderRadius: '24px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={aboutData.imageUrl} 
                alt="Profile" 
                style={{ width: '100%', height: 'auto', borderRadius: '16px', objectFit: 'cover', aspectRatio: '1/1' }} 
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="about-bio glass">
              <h3 className="bio-title">
                Hi, I'm {personalInfo.name.split(' ')[0]} 👋
              </h3>
              <div className="bio-text" style={{ whiteSpace: 'pre-wrap' }}>
                {aboutData?.bio}
              </div>
            </div>

            <div className="skills-grid">
              {skills.map((skillGroup, index) => (
                <div key={index} className="skill-card glass" style={{ padding: '1.5rem' }}>
                  <div className="skill-header">
                    <span className="skill-icon text-gradient">{skillGroup.icon}</span>
                    <h4 className="skill-title">{skillGroup.name}</h4>
                  </div>
                  <div className="skill-tags">
                    {skillGroup.items.map((item, i) => (
                      <span key={i} className="skill-tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
