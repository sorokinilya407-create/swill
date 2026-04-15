const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


const messages = [];
const MAX_MESSAGES = 100;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
  console.log('нови чел в беседе');ув
  
 
  socket.emit('chat history', messages);
  
  
  socket.on('chat message', (data) => {
    const msg = {
      nick: data.nick || 'Аноним',
      text: data.text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    
    messages.push(msg);
    if (messages.length > MAX_MESSAGES) messages.shift();
    
  
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('ушёл(');
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ну тип сервак запустился xd ${PORT}`);
});
