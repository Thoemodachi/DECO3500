const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get the list of PDF files in the 'blackboard/assignment' directory
app.get('/files', (req, res) => {
  const pdfDirectory = path.join(__dirname, 'blackboard', 'assignment'); // Adjusted path
  fs.readdir(pdfDirectory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Unable to scan directory');
    }
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf');
    res.json(pdfFiles); // Send JSON response
  });
});

// Route to serve the selected PDF file
app.get('/pdf/:filename', (req, res) => {
  const pdfDirectory = path.join(__dirname, 'blackboard', 'assignment'); // Adjusted path
  const filePath = path.join(pdfDirectory, req.params.filename);
  res.sendFile(filePath);
});

// Route to serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the edit page
app.get('/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
