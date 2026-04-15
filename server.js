const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Разрешаем запросы с любого сайта (в том числе с твоего Render)
    methods: ["GET", "POST"]
  }
});

// Храним последние 100 сообщений в памяти сервера
const messages = [];
const MAX_MESSAGES = 100;

// Раздаём статическую HTML-страницу чата
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// WebSocket-соединение
io.on('connection', (socket) => {
  console.log('✅ Новый пользователь подключился');
  
  // Отправляем историю сообщений новому пользователю
  socket.emit('chat history', messages);
  
  // Обработка нового сообщения
  socket.on('chat message', (data) => {
    const msg = {
      nick: data.nick || 'Аноним',
      text: data.text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Сохраняем в памяти
    messages.push(msg);
    if (messages.length > MAX_MESSAGES) messages.shift();
    
    // Рассылаем всем подключённым
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('👋 Пользователь отключился');
  });
});

// Запускаем сервер на порту, который укажет Render (или 3000 локально)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Чат-сервер запущен на порту ${PORT}`);
});