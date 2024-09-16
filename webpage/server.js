const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get the list of files and directories in the local directory
app.get('/files', (req, res) => {
  const baseDirectory = path.join(__dirname, 'blackboard/assignment'); // Adjust this path
  fs.readdir(baseDirectory, { withFileTypes: true }, (err, files) => {
      if (err) {
          return res.status(500).send('Unable to scan directory');
      }
      const fileList = files.map(file => ({
          name: file.name,
          isDirectory: file.isDirectory()
      }));
      res.json(fileList);
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