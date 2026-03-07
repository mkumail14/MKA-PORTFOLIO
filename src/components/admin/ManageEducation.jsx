import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const ManageEducation = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState = { id: null, degree: '', institution: '', year: '', details: '', location: '' };
  const [formData, setFormData] = useState(initialFormState);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      if (db) {
        const querySnapshot = await getDocs(collection(db, "education"));
        const eduData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEducationList(eduData);
      }
    } catch (error) {
      console.error("Error fetching education: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      try {
        await deleteDoc(doc(db, "education", id));
        fetchEducation();
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) return alert("Firebase missing or not configured.");

    const processedData = {
      degree: formData.degree,
      institution: formData.institution,
      year: formData.year,
      details: formData.details,
      location: formData.location || '',
    };

    try {
      if (isEditing && formData.id) {
        await updateDoc(doc(db, "education", formData.id), processedData);
      } else {
        await addDoc(collection(db, "education"), processedData);
      }
      
      setFormData(initialFormState);
      setIsEditing(false);
      fetchEducation();
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  return (
    <div className="manage-container">
      <div className="glass p-6 mb-8 rounded-xl">
        <h3 className="text-xl mb-4 font-bold">{isEditing ? 'Edit Education Entry' : 'Add New Experience'}</h3>
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Degree / Title</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleInputChange} required />
            </div>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Institution / Company</label>
              <input type="text" name="institution" value={formData.institution} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Year / Duration</label>
              <input type="text" name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g. 2019 - 2023" required />
            </div>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Location (Optional)</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
            </div>
          </div>
          
          <div className="form-group-login" style={{ marginBottom: '1.5rem' }}>
            <label>Details / Summary</label>
            <textarea name="details" value={formData.details} onChange={handleInputChange} rows="3" required />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? <><Check size={18}/> Update Entry</> : <><Plus size={18}/> Add Entry</>}
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
          <h3 className="text-xl font-bold">Education & Experience</h3>
          <button onClick={fetchEducation} className="btn btn-secondary text-sm" style={{ padding: '0.5rem 1rem' }}>Refresh</button>
        </div>

        {loading ? (
          <div className="text-center py-8"><div className="loader pulse-dot mx-auto"></div></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title & Institution</th>
                <th>Duration</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {educationList.length === 0 ? (
                <tr><td colSpan="3" className="text-center text-secondary py-4">No entries found. Add one above.</td></tr>
              ) : (
                educationList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-bold">{item.degree}</div>
                      <div className="text-sm text-secondary">{item.institution}</div>
                    </td>
                    <td className="text-sm">{item.year}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(item)} className="action-btn edit" title="Edit"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(item.id)} className="action-btn delete" title="Delete"><Trash2 size={16}/></button>
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

export default ManageEducation;
