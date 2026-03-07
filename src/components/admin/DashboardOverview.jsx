import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { fallbackProjects, fallbackEducation, fallbackAbout, fallbackCertifications } from '../../data/fallbackData';
import { Database, AlertTriangle, CheckCircle } from 'lucide-react';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const seedDatabase = async () => {
    if (!db) {
      setStatus({ type: 'error', message: 'Firebase is not configured. Please check your .env file.' });
      return;
    }

    if (!window.confirm("WARNING: This will upload your CV fallback data to Firebase. Proceed?")) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const batch = writeBatch(db);

      // 1. Seed About Me
      const aboutRef = doc(db, 'portfolio', 'about');
      batch.set(aboutRef, fallbackAbout);

      // 2. Seed Projects
      fallbackProjects.forEach((proj) => {
        const projRef = doc(collection(db, 'projects'));
        // Exclude the hardcoded fallback ID so Firestore generates a new one safely
        const { id, ...projData } = proj; 
        batch.set(projRef, projData);
      });

      // 3. Seed Education
      fallbackEducation.forEach((edu) => {
        const eduRef = doc(collection(db, 'education'));
        const { id, ...eduData } = edu;
        batch.set(eduRef, eduData);
      });

      // 4. Seed Certifications
      fallbackCertifications.forEach((cert) => {
        const certRef = doc(collection(db, 'certifications'));
        const { id, ...certData } = cert;
        batch.set(certRef, certData);
      });

      await batch.commit();
      setStatus({ type: 'success', message: 'Successfully seeded Firebase with your CV data!' });

    } catch (error) {
      console.error('Error seeding database:', error);
      setStatus({ type: 'error', message: `Failed to seed database: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-container max-w-4xl mx-auto">
      <div className="glass p-8 rounded-xl text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to Admin Dashboard</h2>
        <p className="text-secondary text-lg mb-8">
          Select an option from the sidebar to manage your portfolio content, add new projects, or update your experience.
        </p>
      </div>

    </div>
  );
};

export default DashboardOverview;
