import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState = { id: null, title: '', description: '', technologies: '', githubUrl: '', liveUrl: '' };
  const [formData, setFormData] = useState(initialFormState);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (db) {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Error fetching projects: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (project) => {
    setFormData({
      ...project,
      technologies: project.technologies ? project.technologies.join(', ') : ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        fetchProjects();
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
      description: formData.description,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
    };

    try {
      if (isEditing && formData.id) {
        await updateDoc(doc(db, "projects", formData.id), processedData);
      } else {
        await addDoc(collection(db, "projects"), processedData);
      }
      
      setFormData(initialFormState);
      setIsEditing(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  return (
    <div className="manage-container">
      <div className="glass p-6 mb-8 rounded-xl">
        <h3 className="text-xl mb-4 font-bold">{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Technologies (comma separated)</label>
              <input type="text" name="technologies" value={formData.technologies} onChange={handleInputChange} placeholder="React, Node.js" />
            </div>
          </div>
          
          <div className="form-group-login" style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>GitHub URL</label>
              <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} />
            </div>
            <div className="form-group-login" style={{ flex: 1 }}>
              <label>Live URL</label>
              <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? <><Check size={18}/> Update Project</> : <><Plus size={18}/> Add Project</>}
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
          <h3 className="text-xl font-bold">Current Projects</h3>
          <button onClick={fetchProjects} className="btn btn-secondary text-sm" style={{ padding: '0.5rem 1rem' }}>Refresh</button>
        </div>

        {loading ? (
          <div className="text-center py-8"><div className="loader pulse-dot mx-auto"></div></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tech Stack</th>
                <th>Links</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-secondary py-4">No projects found. Add one above.</td></tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id}>
                    <td className="font-bold">{proj.title}</td>
                    <td className="text-sm text-secondary">{proj.technologies?.join(', ')}</td>
                    <td className="text-sm">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">GitHub</a>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">Live</a>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(proj)} className="action-btn edit" title="Edit"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(proj.id)} className="action-btn delete" title="Delete"><Trash2 size={16}/></button>
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

export default ManageProjects;
