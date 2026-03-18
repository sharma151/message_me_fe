import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3002' // backend socket port

// class SocketService {
//   socket: Socket | null = null

//   connect(chatId?: number) {    
//     if (!this.socket) {
//       this.socket = io(SOCKET_URL, {
//         transports: ['websocket'],
//       })

//       this.socket.on('connect', () => {
//         console.log('🟢 Socket connected:', this.socket?.id)
//       })
//       if (chatId) {
//         this.socket?.emit('joinChat', { chatId })
//       }

//       // this.socket.on('newMessage', (message) => {
//       //   console.log('Received new message:', message)
//       // })

//       this.socket.on('disconnect', () => {
//         console.log('🔴 Socket disconnected')
//       })
//     }
//   }

//   disconnect() {
//     this.socket?.disconnect()
//     this.socket = null
//   }

//   emit(event: string, data?: any) {
//     this.socket?.emit(event, data)
//   }

//   on(event: string, callback: (data: any) => void) {
//     this.socket?.on(event, callback)
//   }

//   off(event: string) {
//     this.socket?.off(event)
//   }
// }

// export const socketService = new SocketService()


class SocketService {
  socket: Socket | null = null
  private currentChatId: number | null = null; // Track the current room

  connect(chatId?: number) {
    // Initialize socket if it doesn't exist
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      })

      this.socket.on('connect', () => {
        console.log('🟢 Socket connected:', this.socket?.id)
        // Re-join room if we have a chatId upon reconnection
        if (this.currentChatId) {
          this.joinRoom(this.currentChatId);
        }
      })

      this.socket.on('disconnect', () => {
        console.log('🔴 Socket disconnected')
      })
    }

    // Room Switching Logic
    if (chatId && chatId !== this.currentChatId) {
      this.switchChatRoom(chatId);
    }
  }

  private switchChatRoom(newChatId: number) {
    // Leave previous room to stop receiving messages for the old user
    if (this.currentChatId) {
      this.socket?.emit('leaveChat', { chatId: this.currentChatId });
    }
    
    this.joinRoom(newChatId);
  }

  private joinRoom(chatId: number) {
    this.currentChatId = chatId;
    this.socket?.emit('joinChat', { chatId });
    console.log(`➡️ Joined room: ${chatId}`);
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data)
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback)
  }

  off(event: string) {
    this.socket?.off(event)
  }
}

export const socketService = new SocketService()