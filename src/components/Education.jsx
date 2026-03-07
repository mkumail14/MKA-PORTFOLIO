import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { fallbackEducation } from '../data/fallbackData';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import './Education.css';

const Education = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        if (db) {
          const querySnapshot = await getDocs(collection(db, "education"));
          const eduData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          if (eduData.length > 0) {
            setEducationList(eduData);
          } else {
            setEducationList(fallbackEducation);
          }
        } else {
          setEducationList(fallbackEducation);
        }
      } catch (error) {
        console.error("Error fetching education: ", error);
        setEducationList(fallbackEducation);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section id="education" className="section-padding">
        <div className="container text-center">
          <div className="loader pulse-dot mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="section-padding education-section">
      <div className="container">
        <h2 className="section-title">
          Education <span className="text-gradient">Journey</span>
        </h2>

        <div className="timeline">
          {educationList.map((item, index) => (
            <div key={item.id || index} className="timeline-item">
              <div className="timeline-marker glass">
                <GraduationCap size={20} className="text-gradient" />
              </div>
              
              <div className="timeline-content glass">
                <h3 className="edu-degree">{item.degree}</h3>
                <h4 className="edu-institution">{item.institution}</h4>
                
                <div className="edu-meta">
                  <span className="meta-item">
                    <Calendar size={16} /> {item.year}
                  </span>
                  {item.location && (
                    <span className="meta-item">
                      <MapPin size={16} /> {item.location}
                    </span>
                  )}
                </div>
                
                <p className="edu-details">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
