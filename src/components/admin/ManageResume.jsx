import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Check, FileText, Link as LinkIcon } from 'lucide-react';

const ManageResume = () => {
  const [formData, setFormData] = useState({ resumeUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchResume = async () => {
    setLoading(true);
    try {
      if (db) {
        const docRef = doc(db, "portfolio", "resume");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          setFormData({ resumeUrl: '' });
        }
      }
    } catch (error) {
      console.error("Error fetching resume info: ", error);
      setFormData({ resumeUrl: '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) {
      setMessage("Firebase not configured. Cannot save.");
      return;
    }

    setSaving(true);
    setMessage('');
    
    try {
      await setDoc(doc(db, "portfolio", "resume"), formData);
      setMessage("Resume URL updated successfully!");
    } catch (error) {
      console.error("Error saving document: ", error);
      setMessage("Failed to save changes.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="text-center py-8"><div className="loader pulse-dot mx-auto"></div></div>;

  return (
    <div className="manage-container max-w-3xl mx-auto">
      <div className="glass p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-accent-primary" size={24} />
          <h2 className="text-2xl font-bold">Manage Resume</h2>
        </div>
        
        <p className="text-secondary mb-6">
          Update the link to your resume (e.g., a Google Drive link, Dropbox link, or a direct PDF URL). This will be fetched on the public site and shown to visitors.
        </p>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-group-login mb-6">
            <label className="flex items-center gap-2 mb-2 text-secondary">
              <LinkIcon size={18} /> Resume URL
            </label>
            <input 
              type="url" 
              name="resumeUrl" 
              value={formData.resumeUrl} 
              onChange={handleInputChange} 
              placeholder="https://example.com/my-resume.pdf" 
              className="w-full"
              required
            />
            {formData.resumeUrl && (
              <div className="mt-4">
                <a href={formData.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-2">
                  Test Link <LinkIcon size={14} />
                </a>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : <><Check size={18}/> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageResume;
