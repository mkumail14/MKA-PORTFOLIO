import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Check, Award } from 'lucide-react';

const ManageCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState = { id: null, title: '', issuer: '', date: '', url: '' };
  const [formData, setFormData] = useState(initialFormState);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      if (db) {
        const querySnapshot = await getDocs(collection(db, "certifications"));
        const certData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCertifications(certData);
      }
    } catch (error) {
      console.error("Error fetching certifications: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (cert) => {
    setFormData(cert);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await deleteDoc(doc(db, "certifications", id));
        fetchCertifications();
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) return alert("Firebase missing or not configured.");

    const processedData = {
      title: formData.title,
      issuer: formData.issuer,
      date: formData.date,
      url: formData.url || '',
    };

    try {
      if (isEditing && formData.id) {
        await updateDoc(doc(db, "certifications", formData.id), processedData);
      } else {
        await addDoc(collection(db, "certifications"), processedData);
      }
      
      setFormData(initialFormState);
      setIsEditing(false);
      fetchCertifications();
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  return (
    <div className="manage-container">
      <div className="glass p-6 mb-8 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <Award className="text-accent-primary" size={24} />
          <h3 className="text-xl font-bold">{isEditing ? 'Edit Certification' : 'Add New Certification'}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Certification Name</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Issuing Organization</label>
              <input type="text" name="issuer" value={formData.issuer} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Date Earned / Expiration</label>
              <input type="text" name="date" value={formData.date} onChange={handleInputChange} placeholder="e.g. 2024 or Dec 2023 - Present" required />
            </div>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Credential URL (Optional)</label>
              <input type="url" name="url" value={formData.url} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? <><Check size={18}/> Update Certification</> : <><Plus size={18}/> Add Certification</>}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                <X size={18}/> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass p-6 rounded-xl admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="text-xl font-bold">Your Certifications</h3>
          <button onClick={fetchCertifications} className="btn btn-secondary text-sm" style={{ padding: '0.5rem 1rem' }}>Refresh</button>
        </div>

        {loading ? (
          <div className="text-center py-8"><div className="loader pulse-dot mx-auto"></div></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Certification</th>
                <th>Date</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certifications.length === 0 ? (
                <tr><td colSpan="3" className="text-center text-secondary py-4">No certifications found. Add one above.</td></tr>
              ) : (
                certifications.map((cert) => (
                  <tr key={cert.id}>
                    <td>
                      <div className="font-bold">{cert.title}</div>
                      <div className="text-sm text-secondary">{cert.issuer}</div>
                      {cert.url && <a href={cert.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-1 inline-block">View Credential</a>}
                    </td>
                    <td className="text-sm">{cert.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(cert)} className="action-btn edit" title="Edit"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(cert.id)} className="action-btn delete" title="Delete"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCertifications;
