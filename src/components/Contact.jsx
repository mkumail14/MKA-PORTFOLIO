import React from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { personalInfo } from '../data/fallbackData';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section-padding contact-section">
      <div className="container">
        <h2 className="section-title">
          Get In <span className="text-gradient">Touch</span>
        </h2>

        <div className="contact-content">
          <div className="contact-info glass">
            <h3 className="contact-subtitle">Let's Connect</h3>
            <p className="contact-description">
              Whether you have a question about my work, want to discuss a potential project, or just want to say hi, my inbox is always open.
            </p>

            <div className="contact-methods">
              <a href={`mailto:${personalInfo.email}`} className="contact-method glass">
                <div className="method-icon">
                  <Mail size={24} className="text-gradient" />
                </div>
                <div className="method-details">
                  <h4>Email Me</h4>
                  <p>{personalInfo.email}</p>
                </div>
              </a>

              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="contact-method glass">
                <div className="method-icon">
                  <MessageSquare size={24} className="text-gradient" />
                </div>
                <div className="method-details">
                  <h4>LinkedIn</h4>
                  <p>Send a message</p>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-form-container glass">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="John Doe" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="john@example.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Your message here..." required></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary w-full">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
