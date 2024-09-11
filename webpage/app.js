// Connect to the server using socket.io
const socket = io();

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Start drawing when the mouse is pressed down
const startDrawing = (e) => {
  drawing = true;
  draw(e);
};

// Stop drawing when the mouse is released
const endDrawing = () => {
  drawing = false;
  ctx.beginPath(); // Reset the path for the next drawing
};

// Draw on the canvas as the mouse moves
const draw = (e) => {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Drawing settings
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';

  // Draw the line
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  // Emit drawing data to the server
  socket.emit('drawing', { x, y });
};

// Mouse event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);

// Listen for drawing data from other clients and draw on the canvas
socket.on('drawing', (data) => {
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
});

// Text typing logic (for collaborative typing)
const textArea = document.getElementById('text-area');

textArea.addEventListener('input', () => {
  const text = textArea.value;
  socket.emit('typing', text);
});

socket.on('typing', (text) => {
  textArea.value = text;
});

// Chat functionality
const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');

const addMessageToChat = (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chat.appendChild(messageElement);
  chat.scrollTop = chat.scrollHeight; // Scroll to the bottom of the chat
};

// Send a message when the button is clicked or Enter key is pressed
const sendMessage = () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', message);
    messageInput.value = '';
  }
};

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Listen for chat messages from other clients
socket.on('chat message', (message) => {
  addMessageToChat(message);
});
