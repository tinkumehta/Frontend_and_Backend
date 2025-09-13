const socket = io();

// DOM elements
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const usersList = document.getElementById('users-list');
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const usernameInput = document.getElementById('username-input');
const joinButton = document.getElementById('join-button');

let username = '';

// Join chat
joinButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        loginPage.style.display = 'none';
        chatPage.style.display = 'block';
        socket.emit('new-user-joined', username);
    }
});

// Send message
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('send-message', { message });
        addMessage(username, message, 'outgoing');
        messageInput.value = '';
    }
});

// Handle incoming messages
socket.on('receive-message', (data) => {
    addMessage(data.username, data.message, 'incoming');
});

// Update users list
socket.on('update-users', (users) => {
    updateUsersList(users);
});

// Handle user joined
socket.on('user-joined', (name) => {
    addSystemMessage(`${name} joined the chat`);
});

// Handle user left
socket.on('user-left', (name) => {
    addSystemMessage(`${name} left the chat`);
});

// Add message to UI
function addMessage(sender, text, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    
    const timestamp = new Date().toLocaleTimeString();
    
    messageElement.innerHTML = `
        <div class="message-sender">${sender}</div>
        <div class="message-text">${text}</div>
        <div class="message-time">${timestamp}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add system message
function addSystemMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Update users list
function updateUsersList(users) {
    usersList.innerHTML = '';
    for (const id in users) {
        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.textContent = users[id];
        usersList.appendChild(userElement);
    }
}

// Typing indicators (optional enhancement)
messageInput.addEventListener('input', () => {
    socket.emit('typing');
});

messageInput.addEventListener('blur', () => {
    socket.emit('stop-typing');
});

socket.on('user-typing', (username) => {
    // Display typing indicator
});

socket.on('user-stop-typing', () => {
    // Remove typing indicator
});