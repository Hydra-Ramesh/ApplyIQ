import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocketServer = (port: number) => {
  const server = http.createServer();
  io = new Server(server, {
    cors: {
      origin: '*', // Allows frontend to connect
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client Socket Connected:', socket.id);

    socket.on('join_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room user_${userId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client Socket Disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`Socket.IO Server running separately on port ${port}`);
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
