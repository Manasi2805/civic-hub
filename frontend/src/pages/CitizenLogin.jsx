import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitizenLogin.css';

export default function CitizenLogin() {
    const [formData, setFormData] = useState({ fullName: '', contact: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const contact = formData.contact.trim();
        if (!contact) {
            setError('Please provide a mobile number or email address.');
            return;
        }

        const citizenUser = {
            fullName: formData.fullName.trim() || 'Citizen',
            contact: contact,
            isAuthenticated: true
        };

        // Store in localStorage for session persistence & auto-filling ReportIssue
        localStorage.setItem('civic_citizen_user', JSON.stringify(citizenUser));
        setError('');
        navigate('/report');
    };

    return (
        <div className="citizen-login-wrapper">
            <div className="citizen-login-box">
                <h2>Citizen Sign In</h2>
                <p>Access your reported complaints and quickly lodge issues</p>

                {error && <div className="citizen-auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="citizen-login-form">
                    <div className="citizen-login-field">
                        <label htmlFor="full-name-input">Full Name</label>
                        <input
                            id="full-name-input"
                            type="text"
                            placeholder="e.g. Sam / Dhanush"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div className="citizen-login-field">
                        <label htmlFor="contact-input">Mobile Number or Email *</label>
                        <input
                            id="contact-input"
                            type="text"
                            required
                            placeholder="9876543210 or name@example.com"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="citizen-login-btn">
                        Sign In & Continue
                    </button>
                </form>
            </div>
        </div>
    );
}