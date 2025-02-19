import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import jsPDF from 'jspdf';
import './SignatureGenerator.css';

const SignatureGenerator = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: ''
  });

  const signatureRef = useRef(null);
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    // Load the template image
    const img = new Image();
    img.src = require('../assets/template.png');
    img.onload = () => {
      setTemplate(img);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const captureSignature = async () => {
    if (!signatureRef.current || !template) return null;

    // Set canvas size to match template dimensions but higher resolution
    const canvas = document.createElement('canvas');
    canvas.width = 2480;  // Increased width for better quality
    canvas.height = 560;  // Proportional height
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate template dimensions to maintain aspect ratio
    const templateAspectRatio = template.width / template.height;
    const targetHeight = canvas.height;
    const targetWidth = targetHeight * templateAspectRatio;
    const xOffset = (canvas.width - targetWidth) / 2;

    // Draw template at calculated size
    ctx.drawImage(template, xOffset, 0, targetWidth, targetHeight);

    // Set up text rendering with anti-aliasing
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.textRendering = 'optimizeLegibility';

    // Draw text content directly with adjusted positions
    const name = formData.fullName || 'Full Name';
    const position = formData.position || 'Designation';
    const phone = formData.phone || 'Contact Number';
    const email = formData.email || 'Work Email';

    // Adjusted x-position (moved slightly right)
    const textX = 1285;

    // Name
    ctx.font = '54px Canva Sans';
    ctx.fillText(name, textX, 128);

    // Position
    ctx.font = '48px Canva Sans';
    ctx.fillText(position, textX, 210);

    // Phone
    ctx.font = '38px Arial';
    ctx.fillText(phone, textX, 285);

    // Email
    ctx.font = '38px Arial';
    ctx.fillText(email, textX, 340);

    // Website
    ctx.font = '38px Arial';
    ctx.fillText('www.urbanebolt.com', textX, 395);

    return canvas;
  };

  const downloadAsPNG = async () => {
    const canvas = await captureSignature();
    if (canvas) {
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = 'urbanebolt-email-signature.png';
      link.click();
    }
  };

  const downloadAsPDF = async () => {
    const canvas = await captureSignature();
    if (canvas) {
      // Scale down the high-res canvas for PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1754, 397]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 1754, 397);
      
      // Add clickable link to the website text
      pdf.link(1285, 395, 400, 48, { url: 'https://www.urbanebolt.com' });
      
      pdf.save('urbanebolt-email-signature.pdf');
    }
  };

  return (
    <section className="signature-generator">
      <Typography variant="h2" className="section-title">
        Email Signature Generator
      </Typography>
      
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        {/* Form Section */}
        <Paper elevation={3} className="form-container">
          <Typography variant="h6" gutterBottom>
            Enter Your Details
          </Typography>
          <form>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
              placeholder="Full Name"
            />
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              margin="normal"
              placeholder="Designation"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              placeholder="Contact Number"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              placeholder="Work Email"
            />
          </form>
        </Paper>

        {/* Preview Section */}
        <Paper elevation={3} className="preview-container">
          <Typography variant="h6" gutterBottom>
            Preview
          </Typography>
          <div className="signature-preview" ref={signatureRef}>
            <div className="signature-content">
              <div className="contact-details">
                <h3 className="name">{formData.fullName || 'Full Name'}</h3>
                <p className="position">{formData.position || 'Designation'}</p>
                <p className="phone">{formData.phone || 'Contact Number'}</p>
                <p className="email">{formData.email || 'Work Email'}</p>
                <p className="website">
                  <a href="https://www.urbanebolt.com" target="_blank" rel="noopener noreferrer">
                    www.urbanebolt.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          <Box mt={2} className="download-buttons">
            <Button variant="contained" color="primary" onClick={downloadAsPNG} sx={{ mr: 2 }}>
              Download PNG
            </Button>
            <Button variant="contained" color="secondary" onClick={downloadAsPDF}>
              Download PDF
            </Button>
          </Box>
        </Paper>
      </Box>
    </section>
  );
};

export default SignatureGenerator; 