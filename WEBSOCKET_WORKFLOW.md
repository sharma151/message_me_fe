# WebSocket Communication Workflow

This document explains how WebSocket communication works between the frontend (ChatsApp) and backend, including the architecture, event flows, benefits, and challenges.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Socket Service Implementation](#socket-service-implementation)
- [Communication Flow](#communication-flow)
  - [Connection Lifecycle](#connection-lifecycle)
  - [Room Management](#room-management)
  - [Message Flow](#message-flow)
  - [Typing Indicators](#typing-indicators)
- [Event Reference](#event-reference)
  - [Client → Server Events](#client--server-events)
  - [Server → Client Events](#server--client-events)
- [Benefits of WebSocket](#benefits-of-websocket)
- [Drawbacks & Challenges](#drawbacks--challenges)
- [Best Practices Implemented](#best-practices-implemented)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────┐                      ┌─────────────────┐
│   React Client  │                      │  Socket.IO      │
│   (Browser)     │◄────WebSocket──────► │  Server (BE)    │
│                 │      TCP Connection  │   Port: 3002    │
│ ┌─────────────┐ │                      │                 │
│ │SocketService│ │                      │  ┌───────────┐  │
│ │ (Singleton) │ │                      │  │  Chat     │  │
│ └──────┬──────┘ │                      │  │  Rooms    │  │
│        │        │                      │  └───────────┘  │
│ ┌──────▼──────┐ │                      │                 │
│ │ ChatRoomPage│ │                      │  ┌───────────┐  │
│ │ ChatInputBar│ │                      │  │  Message  │  │
│ └─────────────┘ │                      │  │  Handler  │  │
└─────────────────┘                      │  └───────────┘  │
                                         └─────────────────┘
```

### Key Architectural Decisions

1. **Singleton Pattern**: `SocketService` is a singleton to ensure single connection per client
2. **Room-Based Messaging**: Users join specific chat rooms to receive targeted messages
3. **Separation of Concerns**: HTTP for CRUD operations, WebSocket for real-time events

---

## Socket Service Implementation

### File: `src/socket/socket.ts`

```typescript
class SocketService {
  socket: Socket | null = null
  private currentChatId: number | null = null  // Track current room

  connect(chatId?: number) {
    // Initialize socket connection
    // Handle reconnection with room re-joining
    // Switch rooms when chat changes
  }

  private switchChatRoom(newChatId: number) {
    // Leave previous room
    // Join new room
  }

  emit(event: string, data?: any) { /* Send events */ }
  on(event: string, callback: (data: any) => void) { /* Listen to events */ }
  off(event: string) { /* Unsubscribe from events */ }
}

export const socketService = new SocketService()
```

### Key Features

| Feature | Implementation |
|---------|---------------|
| **Lazy Initialization** | Socket only connects when `connect()` is first called |
| **Auto Reconnection** | Socket.IO handles automatic reconnection with backoff |
| **Room Persistence** | Re-joins room automatically after reconnection |
| **Room Switching** | Leaves old room before joining new one |

---

## Communication Flow

### Connection Lifecycle

```
┌──────────────┐
│   User Logs  │
│    In        │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ AppLayout    │────►│ socketService│
│ Mounts       │     │ .connect()   │
└──────────────┘     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Socket.IO   │
                     │  Handshake   │
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │    Connected │
                     └──────────────┘

User Opens Chat:
┌──────────────┐
│ ChatRoomPage │
│   Mounts     │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ socketService│────►│   Emit       │────►│ Server       │
│ .connect(id) │     │ 'joinChat'   │     │ Joins Room   │
└──────────────┘     └──────────────┘     └──────────────┘

User Leaves Chat:
┌──────────────┐
│ ChatRoomPage │
│  Unmounts    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ socket.off() │     │ Cleanup      │
│ (unsubscribe)│     │ Listeners    │
└──────────────┘     └──────────────┘

User Logs Out:
┌──────────────┐     ┌──────────────┐
│ socketService│────►│  Disconnected│
│.disconnect() │     │              │
└──────────────┘     └──────────────┘
```

### Room Management

**Why Rooms?**
- Messages are scoped to specific chats
- Users only receive messages for chats they're viewing
- Prevents broadcast storms

**Room Flow:**

```
User switches from Chat A to Chat B:

┌─────────────────────────────────────────────────────┐
│ 1. User clicks Chat B                               │
└────────────┬────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────┐
│ 2. socketService.connect(B)                         │
│    - Detects chatId changed                         │
│    - Calls switchChatRoom(B)                        │
└────────────┬────────────────────────────────────────┘
             │
        ┌────┴────┐
        │         │
        ▼         ▼
┌──────────┐ ┌──────────┐
│  Emit    │ │  Emit    │
│'leaveChat'│ │'joinChat'│
│  {A}     │ │  {B}     │
└────┬─────┘ └────┬─────┘
     │            │
     └────────────┬┘
                  ▼
┌─────────────────────────────────────────────────────┐
│ 3. Server removes user from Room A, adds to Room B  │
└─────────────────────────────────────────────────────┘
```

### Message Flow

**Sending a Message:**

```
┌──────────────┐
│ User types   │
│ message      │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Press Enter  │────►│ socket.emit()│
│ or Click Send│     │'sendMessage' │
└──────────────┘     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   HTTP API   │
                     │   POST /msg  │ (Fallback/Storage)
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Server     │
                     │ Broadcasts   │
                     │ 'newMessage' │
                     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │ User A  │  │ User B  │  │ User C  │
        │ (Sender)│  │ Receiver│  │ Receiver│
        └─────────┘  └─────────┘  └─────────┘
```

**Receiving a Message:**

```typescript
// In ChatRoomPage.tsx
socketService.on('newMessage', (newMessage: Message) => {
  // Update React Query cache with new message
  queryClient.setQueryData(
    ['chats', parsedChatId],
    (oldData: Message[] | undefined) => {
      const history = oldData || []
      // Prevent duplicates
      if (history.find((m) => m.id === newMessage.id)) return history
      return [...history, newMessage]
    },
  )
})
```

### Typing Indicators

**Flow:**

```
User A typing:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Input Change │────►│ Debounce 1s  │────►│ Emit 'typing'│
│   Event      │     │ (clear prev) │     │ {chatId}     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐            │
│ Stop Typing  │◄────│ Set Timeout  │◄───────────┘
│ After 1s     │     │ (1 second)   │
└──────────────┘     └──────────────┘

User B sees:
┌──────────────┐
│ Server       │
│ Broadcasts   │
│ 'user_typing'│
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Set State    │────►│ Show "typing"│
│ isTyping=true│     │ indicator UI │
└──────────────┘     └──────────────┘
```

---

## Event Reference

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `joinChat` | `{ chatId: number }` | User joins a chat room |
| `leaveChat` | `{ chatId: number }` | User leaves a chat room |
| `sendMessage` | `{ chatId, senderId, content }` | Send a new message |
| `typing` | `{ chatId: string }` | User started typing |
| `stop_typing` | `{ chatId: string }` | User stopped typing |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `newMessage` | `Message` object | New message in room |
| `user_typing` | `{ userId: string }` | Another user is typing |
| `user_stop_typing` | `{}` | User stopped typing |
| `connect` | Socket ID | Connection established |
| `disconnect` | Reason | Connection closed |

---

## Benefits of WebSocket

### 1. Real-Time Communication
```
Polling vs WebSocket:

Polling:        WebSocket:
├──► Request    ┌────────────┐
◄──┤ Response   │ Persistent │
├──► Request    │ Connection │
◄──┤ Response   │            │
├──► Request    │ ◄───────►  │
◄──┤ Response   │ Bi-directional

Latency: ~500ms      Latency: ~50ms
(HTTP Roundtrip)     (Already Connected)
```

### 2. Reduced Server Load
- **Polling**: Constant HTTP requests even with no new data
- **WebSocket**: Only sends data when there's something new
- **Efficiency**: ~90% reduction in network overhead for active chats

### 3. Scalability Features
| Feature | Benefit |
|---------|---------|
| Rooms | Efficient message routing (not broadcast to all) |
| Namespaces | Separate concerns (chat vs notifications) |
| Binary Support | Can send images/media efficiently |

### 4. Better User Experience
- Instant message delivery
- Live typing indicators
- Online/offline status
- Real-time notifications

---

## Drawbacks & Challenges

### 1. Connection Management

**Challenge**: Connections drop and need recovery

```
Problem: Mobile networks, WiFi switching, browser sleep

Solution Implemented:
┌──────────────┐
│ Connection   │
│ Dropped      │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Auto-reconnect│────►│ Re-join Room │
│ (Socket.IO)  │     │ if had chatId│
└──────────────┘     └──────────────┘
```

**Code:**
```typescript
this.socket.on('connect', () => {
  if (this.currentChatId) {
    this.joinRoom(this.currentChatId)  // Re-join after reconnect
  }
})
```

### 2. State Synchronization

**Challenge**: HTTP state vs WebSocket state can diverge

```
Problem:
1. User sends message via WebSocket
2. Page refreshes before server saves to DB
3. Message appears in UI but not in DB
4. After refresh, message is "lost"

Solution:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Emit via     │────►│ Server saves │────►│ Broadcast    │
│ WebSocket    │     │ to Database  │     │ to room      │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                           │
       │         ┌─────────────────────────────────┘
       │         │
       ▼         ▼
┌──────────────┐
│ TanStack     │
│ Query Cache  │
│ (optimistic) │
└──────────────┘

On Refresh: Query fetches from DB (source of truth)
```

### 3. Memory Leaks

**Challenge**: Event listeners accumulate

```typescript
// Bad: Listeners never removed
useEffect(() => {
  socketService.on('newMessage', handler)
}, [chatId])  // Creates new listener on every change

// Good: Cleanup listeners
useEffect(() => {
  socketService.on('newMessage', handler)

  return () => {
    socketService.off('newMessage')  // Cleanup!
  }
}, [chatId])
```

### 4. Scalability Concerns

| Issue | Mitigation |
|-------|------------|
| Server Memory | Use Redis adapter for multi-server setup |
| Connection Limit | Use load balancers with sticky sessions |
| Broadcasting | Use rooms to avoid global broadcasts |

---

## Best Practices Implemented

### 1. Singleton Pattern
```typescript
// One socket instance across the app
export const socketService = new SocketService()

// Prevents multiple connections
// Centralizes connection logic
```

### 2. Cleanup on Unmount
```typescript
useEffect(() => {
  // Subscribe
  socketService.on('newMessage', handler)

  // Cleanup on unmount
  return () => {
    socketService.off('newMessage')
  }
}, [])
```

### 3. Room-Based Isolation
```typescript
// Only receive messages for current chat
private joinRoom(chatId: number) {
  this.socket?.emit('joinChat', { chatId })
}

// Leave room when switching
private switchChatRoom(newChatId: number) {
  if (this.currentChatId) {
    this.socket?.emit('leaveChat', { chatId: this.currentChatId })
  }
  this.joinRoom(newChatId)
}
```

### 4. Duplicate Prevention
```typescript
socketService.on('newMessage', (newMessage: Message) => {
  queryClient.setQueryData(['chats', chatId], (oldData) => {
    // Prevent duplicates from race conditions
    if (history.find((m) => m.id === newMessage.id)) return history
    return [...history, newMessage]
  })
})
```

### 5. Debouncing for Typing
```typescript
const handleInputChange = (e) => {
  socketService.emit('typing', { chatId })

  // Clear previous timeout
  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

  // Debounce stop_typing by 1 second
  typingTimeoutRef.current = setTimeout(() => {
    socketService.emit('stop_typing', { chatId })
  }, 1000)
}
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Messages not appearing | Listener not attached | Check component mount/unmount |
| Duplicate messages | Multiple listeners | Ensure `.off()` cleanup |
| Messages in wrong chat | Room not switched | Verify `leaveChat`/`joinChat` flow |
| Connection drops | Network issues | Implement reconnection logic |
| Typing flickering | Missing debounce | Use timeout for `stop_typing` |

### Debug Mode

Enable Socket.IO debug logging in browser console:

```javascript
// Run in browser console
localStorage.debug = 'socket.io-client:*'
```

### Connection Status Check

```typescript
const isConnected = socketService.socket?.connected
console.log('Socket connected:', isConnected)
```

---

## Summary

WebSocket communication in ChatsApp provides:

- **Real-time messaging** with minimal latency
- **Efficient resource usage** compared to polling
- **Room-based isolation** for privacy and performance
- **Automatic reconnection** handling
- **Typing indicators** for better UX

**Trade-offs:**
- Requires persistent connection management
- Need careful cleanup to prevent memory leaks
- Server must handle many concurrent connections

**When to Use WebSocket:**
- Real-time chat 
- Live notifications 
- Collaborative editing 

**When to Use HTTP:**
- One-time data fetching 
- Large file uploads 
- RESTful CRUD operations 
