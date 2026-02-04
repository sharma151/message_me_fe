import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3002'; // backend socket port

class SocketService {
  socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('🟢 Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('🔴 Socket disconnected');
      });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

export const socketService = new SocketService();