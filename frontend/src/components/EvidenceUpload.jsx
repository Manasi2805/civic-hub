import React, { useState } from 'react';
import './EvidenceUpload.css';

export default function EvidenceUpload({ onFileSelect }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (newFile) => {
    setFile(newFile);
    if (onFileSelect) onFileSelect(newFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="evidence-upload" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      {!file ? (
        <div className="eu-empty">
          <div className="eu-icons">📸 📹</div>
          <p>Drag & Drop evidence here</p>
          <div className="eu-actions">
            <label className="eu-btn"><input type="file" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />Upload Photo</label>
            <label className="eu-btn"><input type="file" hidden accept="video/*" onChange={e => handleFileChange(e.target.files[0])} />Upload Video</label>
          </div>
        </div>
      ) : (
        <div className="eu-file">
          <div className="eu-preview">📎 {file.name} ({(file.size/1024/1024).toFixed(2)} MB)</div>
          <button className="eu-remove" onClick={() => handleFileChange(null)}>Remove</button>
        </div>
      )}
    </div>
  );
}
