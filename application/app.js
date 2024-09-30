// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for drawing data from clients
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data); // Broadcast to other clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
