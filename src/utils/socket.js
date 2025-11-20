// src/utils/socket.js
let io = null;

const setIO = (socketIO) => {
  io = socketIO;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO chưa được khởi tạo! Gọi setIO trước!');
  }
  return io;
};

module.exports = { setIO, getIO };