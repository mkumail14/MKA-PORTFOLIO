import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { fallbackProjects } from '../data/fallbackData';
import { ExternalLink, Github, Folder } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (db) {
          const querySnapshot = await getDocs(collection(db, "projects"));
          const projectsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          if (projectsData.length > 0) {
            setProjects(projectsData);
          } else {
            console.log("No projects in Firebase, using fallback");
            setProjects(fallbackProjects);
          }
        } else {
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error("Error fetching projects: ", error);
        setProjects(fallbackProjects); // Fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="section-padding">
        <div className="container text-center">
          <div className="loader pulse-dot mx-auto"></div>
          <p className="mt-4 text-secondary">Loading extraordinary projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding projects-section">
      <div className="container">
        <h2 className="section-title">
          Selected <span className="text-gradient">Projects</span>
        </h2>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card glass">
              <div className="project-card-inner">
                <div className="project-header">
                  <Folder className="folder-icon text-gradient" size={40} />
                  <div className="project-links">
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="Github">
                        <Github size={20} />
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="External Link">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                
                <h3 className="project-title">{project.title}</h3>
                
                <p className="project-description">
                  {project.description}
                </p>
                
                <div className="project-tech">
                  {project.technologies?.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
