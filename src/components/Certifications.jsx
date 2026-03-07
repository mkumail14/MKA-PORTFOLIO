import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { fallbackCertifications } from '../data/fallbackData';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import './Certifications.css';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        if (db) {
          const querySnapshot = await getDocs(collection(db, "certifications"));
          const certData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          if (certData.length > 0) {
            setCertifications(certData);
          } else {
            setCertifications(fallbackCertifications);
          }
        } else {
          setCertifications(fallbackCertifications);
        }
      } catch (error) {
        console.error("Error fetching certifications: ", error);
        setCertifications(fallbackCertifications);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) return null; // Skip rendering if still loading to prevent jank
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-padding certifications-section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <h3 className="section-subtitle" style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          Licenses & <span className="text-gradient">Certifications</span>
        </h3>

        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <div key={cert.id || index} className="cert-card glass">
              <div className="cert-icon-wrapper">
                <Award size={24} className="text-gradient" />
              </div>
              <div className="cert-content">
                <h4 className="cert-title">{cert.title}</h4>
                <div className="cert-issuer">{cert.issuer}</div>
                <div className="cert-meta">
                  <Calendar size={14} /> <span>{cert.date}</span>
                </div>
              </div>
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noreferrer" className="cert-link" title="Verify Credential">
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
