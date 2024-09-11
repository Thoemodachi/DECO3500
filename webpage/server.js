const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html when accessing the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle drawing data
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  // Handle typing data
  socket.on('typing', (text) => {
    socket.broadcast.emit('typing', text);
  });

  // Handle chat messages
  socket.on('chat message', (message) => {
    io.emit('chat message', message); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
