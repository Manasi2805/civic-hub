import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EvidenceUpload from '../components/EvidenceUpload';
import LocationPicker from '../components/LocationPicker';
import VerificationCard from '../components/VerificationCard';
import RoutingResult from '../components/RoutingResult';
import { submitComplaint } from '../services/api';
import './ReportIssue.css';

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Reporter details (Step 1)
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  // Issue details (Step 2+)
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [coords, setCoords] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [procStep, setProcStep] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Load saved reporter info from citizen login session OR cached draft
  useEffect(() => {
    try {
      // 1. Priority: Read logged-in citizen session
      const citizen = JSON.parse(localStorage.getItem('civic_citizen_user') || '{}');
      if (citizen && citizen.contact) {
        if (citizen.fullName) setReporterName(citizen.fullName);
        if (citizen.contact.includes('@')) {
          setReporterEmail(citizen.contact);
        } else {
          setReporterPhone(citizen.contact.replace(/\D/g, '').slice(0, 10));
        }
        return;
      }

      // 2. Fallback: Read previous local draft if not explicitly logged in
      const saved = localStorage.getItem('civic_hub_reporter');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.name) setReporterName(data.name);
        if (data.phone) setReporterPhone(data.phone);
        if (data.email) setReporterEmail(data.email);
      }
    } catch (e) {
      /* ignore parse errors */
    }
  }, []);

  const saveReporterInfo = () => {
    localStorage.setItem(
      'civic_hub_reporter',
      JSON.stringify({
        name: reporterName,
        phone: reporterPhone,
        email: reporterEmail
      })
    );
  };

  const categories = [
    { id: 'garbage', icon: '🗑️', label: 'Garbage Dump' },
    { id: 'construction', icon: '🏗️', label: 'Construction Waste' },
    { id: 'bin', icon: '🗑️', label: 'Overflowing Bin' },
    { id: 'pothole', icon: '🕳️', label: 'Pothole' },
    { id: 'light', icon: '💡', label: 'Streetlight' },
    { id: 'other', icon: '❓', label: 'Other' }
  ];

  const isStep1Valid = reporterName.trim().length >= 2 && reporterPhone.trim().length >= 10;

  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError(null);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProcStep(current);
      if (current >= 4) {
        clearInterval(interval);
      }
    }, 500);

    const formData = new FormData();
    formData.append('issue_type', category);
    formData.append('description', description);
    formData.append('reporter_name', reporterName.trim());
    formData.append('reporter_phone', reporterPhone.trim());
    if (reporterEmail.trim()) formData.append('reporter_email', reporterEmail.trim());
    if (coords) {
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
    }
    if (file) formData.append('photo', file);

    saveReporterInfo();

    const { data, error } = await submitComplaint(formData);

    clearInterval(interval);
    setProcStep(5);

    if (error) {
      setApiError(error);
      setSubmitting(false);
    } else {
      setApiResponse(data);
      setTimeout(() => setStep(6), 500);
    }
  };

  return (
    <div className="report-container">
      <div className="r-header">
        <h2>Report an Issue</h2>
        {step <= totalSteps && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        )}
        {step <= totalSteps && (
          <p className="step-indicator">
            Step {step} of {totalSteps}
          </p>
        )}
      </div>

      <div className="r-content">
        {/* STEP 1: Reporter Details */}
        {step === 1 && (
          <div className="step-content fade-in">
            <h3>Step 1: Your Details</h3>
            <p className="step-subtitle">Help us keep you updated on your complaint's progress</p>

            <div className="reporter-form">
              <div className="form-group">
                <label htmlFor="reporter-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="reporter-name"
                  type="text"
                  className="r-input"
                  placeholder="Enter your full name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="reporter-phone">
                  Phone Number <span className="required">*</span>
                </label>
                <div className="phone-input-group">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="reporter-phone"
                    type="tel"
                    className="r-input phone-input"
                    placeholder="10-digit mobile number"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reporter-email">
                  Email <span className="optional-tag">optional</span>
                </label>
                <input
                  id="reporter-email"
                  type="email"
                  className="r-input"
                  placeholder="your.email@example.com"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                />
              </div>
            </div>

            <p className="r-note privacy-note">
              🔒 Your personal details are kept confidential and used only for complaint tracking.
            </p>
            <button
              className="r-btn-next"
              disabled={!isStep1Valid}
              onClick={() => {
                saveReporterInfo();
                setStep(2);
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 2: Category */}
        {step === 2 && (
          <div className="step-content fade-in">
            <h3>Step 2: What's the issue?</h3>
            <div className="category-grid">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className={`cat-card ${category === c.id ? 'selected' : ''}`}
                  onClick={() => setCategory(c.id)}
                >
                  <div className="cat-icon">{c.icon}</div>
                  <div className="cat-label">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="r-actions">
              <button className="r-btn-back" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="r-btn-next" disabled={!category} onClick={() => setStep(3)}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Description */}
        {step === 3 && (
          <div className="step-content fade-in">
            <h3>Step 3: Describe the issue</h3>
            <textarea
              className="r-textarea"
              placeholder="Provide any useful details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <p className="r-note">Optional if photo/video is provided</p>
            <div className="r-actions">
              <button className="r-btn-back" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="r-btn-next" onClick={() => setStep(4)}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Evidence */}
        {step === 4 && (
          <div className="step-content fade-in">
            <h3>Step 4: Provide Evidence</h3>
            <EvidenceUpload onFileSelect={setFile} />
            <div className="r-actions">
              <button className="r-btn-back" onClick={() => setStep(3)}>
                Back
              </button>
              <button className="r-btn-next" onClick={() => setStep(5)}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Location + Submit */}
        {step === 5 && !submitting && (
          <div className="step-content fade-in">
            <h3>Step 5: Pin Location</h3>
            <LocationPicker onLocationSelect={setCoords} />
            <p className="r-note">
              The responsible authority will be determined automatically based on coordinates.
            </p>

            {/* Summary card */}
            <div className="submission-summary">
              <h4>Submission Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Reporter</span>
                  <span className="summary-value">{reporterName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Phone</span>
                  <span className="summary-value">+91 {reporterPhone}</span>
                </div>
                {reporterEmail && (
                  <div className="summary-item">
                    <span className="summary-label">Email</span>
                    <span className="summary-value">{reporterEmail}</span>
                  </div>
                )}
                <div className="summary-item">
                  <span className="summary-label">Issue</span>
                  <span className="summary-value">
                    {categories.find((c) => c.id === category)?.label || category}
                  </span>
                </div>
                {coords && (
                  <div className="summary-item">
                    <span className="summary-label">Location</span>
                    <span className="summary-value">
                      {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {apiError && (
              <div className="r-error" style={{ color: 'var(--status-red)', marginTop: '1rem' }}>
                {apiError}
              </div>
            )}
            <div className="r-actions">
              <button className="r-btn-back" onClick={() => setStep(4)}>
                Back
              </button>
              <button className="r-btn-submit" onClick={handleSubmit}>
                SUBMIT REPORT
              </button>
            </div>
          </div>
        )}

        {/* Processing animation */}
        {submitting && step === 5 && (
          <div className="processing-overlay">
            <h3>Processing Submission...</h3>
            <ul className="proc-list">
              <li className={procStep >= 1 ? 'proc-done' : ''}>Evidence received</li>
              <li className={procStep >= 2 ? 'proc-done' : ''}>Issue identified</li>
              <li className={procStep >= 3 ? 'proc-done' : ''}>Location checked</li>
              <li className={procStep >= 4 ? 'proc-done' : ''}>Duplicate check completed</li>
              <li className={procStep >= 5 ? 'proc-done' : ''}>Jurisdiction determined</li>
            </ul>
          </div>
        )}

        {/* STEP 6: Success */}
        {step === 6 && apiResponse && (
          <div className="step-content result-card fade-in">
            <h2 className="success-title">Issue Reported Successfully</h2>
            <div className="r-id-display">{apiResponse.id}</div>
            <p className="r-type-display">
              {categories.find((c) => c.id === apiResponse.issue_type)?.label || apiResponse.issue_type} in{' '}
              {apiResponse.authority_name || apiResponse.area || 'Mysuru Zone'}
            </p>

            {apiResponse.reporter_name && (
              <div className="reporter-confirmation">
                <p>
                  Reported by <strong>{apiResponse.reporter_name}</strong>
                </p>
                {apiResponse.reporter_phone && (
                  <p className="r-note">Updates will be sent to +91 {apiResponse.reporter_phone}</p>
                )}
              </div>
            )}

            <div className="r-cards-grid">
              <VerificationCard analysis={apiResponse.verification} />
              <RoutingResult result={apiResponse.routing} />
            </div>

            <div className="r-final-actions">
              <Link to={`/track/${apiResponse.id}`} className="btn btn-primary">
                TRACK COMPLAINT
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}