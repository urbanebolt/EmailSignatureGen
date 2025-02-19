import React from 'react';
import './LandingPage.css';
import SignatureGenerator from './SignatureGenerator';
const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Email Signature Generator</h1>
        <p>Create beautiful, professional email signatures in minutes</p>
        
      </header>
      
      <SignatureGenerator />

     
    </div>
  );
};

export default LandingPage; 