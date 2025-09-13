const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
const users = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    
    // Handle new user joining
    socket.on('new-user-joined', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
        io.emit('update-users', users);
    });
    
    // Handle incoming messages
    socket.on('send-message', (data) => {
        socket.broadcast.emit('receive-message', {
            username: users[socket.id],
            message: data.message,
            time: new Date().toLocaleTimeString()
        });
    });
    
    // Handle typing indicators
    socket.on('typing', () => {
        socket.broadcast.emit('user-typing', users[socket.id]);
    });
    
    socket.on('stop-typing', () => {
        socket.broadcast.emit('user-stop-typing');
    });
    
    // Handle user disconnect
    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('user-left', username);
        io.emit('update-users', users);
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});