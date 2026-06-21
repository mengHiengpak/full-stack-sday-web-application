'use client';

import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('sbay_token');
  if (!token) return null;

  if (socket) {
    if (socket.connected) return socket;
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
