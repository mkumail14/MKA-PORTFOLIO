import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Check, User, Image as ImageIcon } from 'lucide-react';
import { fallbackAbout } from '../../data/fallbackData';

const ManageAbout = () => {
  const [formData, setFormData] = useState({ bio: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAbout = async () => {
    setLoading(true);
    try {
      if (db) {
        const docRef = doc(db, "portfolio", "about");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          setFormData(fallbackAbout);
        }
      } else {
        setFormData(fallbackAbout);
      }
    } catch (error) {
      console.error("Error fetching about info: ", error);
      setFormData(fallbackAbout);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
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
      await setDoc(doc(db, "portfolio", "about"), formData);
      setMessage("Profile updated successfully!");
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
          <User className="text-accent-primary" size={24} />
          <h2 className="text-2xl font-bold">Manage About Me</h2>
        </div>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-group-login mb-6">
            <label className="flex items-center gap-2 mb-2 text-secondary">
              <ImageIcon size={18} /> Profile Picture URL
            </label>
            <input 
              type="url" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleInputChange} 
              placeholder="https://example.com/my-photo.jpg" 
              className="w-full"
            />
            {formData.imageUrl && (
              <div className="mt-4 flex justify-center">
                <img 
                  src={formData.imageUrl} 
                  alt="Profile Preview" 
                  className="rounded-xl object-cover border-2 border-glass"
                  style={{ width: '150px', height: '150px' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL' }}
                />
              </div>
            )}
          </div>
          
          <div className="form-group-login mb-6">
            <label className="flex items-center gap-2 mb-2 text-secondary">
              <User size={18} /> Biography
            </label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleInputChange} 
              rows="8" 
              required 
              style={{ minHeight: '200px' }}
              className="w-full"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : <><Check size={18}/> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAbout;
