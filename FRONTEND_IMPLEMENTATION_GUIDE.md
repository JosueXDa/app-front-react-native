# 🎨 Frontend Implementation Guide - Chat with Threads

> Guía completa para implementar el frontend de la aplicación de chat con soporte para Canales, Threads y Mensajería en Tiempo Real.

---

## 📋 Tabla de Contenidos

- [Arquitectura General](#arquitectura-general)
- [Setup Inicial](#setup-inicial)
- [Autenticación](#autenticación)
- [Gestión de Estado](#gestión-de-estado)
- [WebSocket Integration](#websocket-integration)
- [Componentes Principales](#componentes-principales)
- [Flujos de Usuario](#flujos-de-usuario)
- [Ejemplos de Código](#ejemplos-de-código)
- [Best Practices](#best-practices)

---

## Arquitectura General

### Modelo de Datos del Frontend

```
┌──────────────┐
│   Channel    │ ← Lista de canales disponibles
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Threads    │ ← Threads dentro del canal actual
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Messages   │ ← Mensajes del thread seleccionado
└──────────────┘
```

### Estructura de Componentes Recomendada

```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx           # Navegación principal
│   │   ├── ChannelList.tsx       # Lista de canales
│   │   └── UserProfile.tsx       # Perfil del usuario
│   ├── Channel/
│   │   ├── ChannelHeader.tsx     # Header del canal
│   │   ├── ThreadList.tsx        # Lista de threads
│   │   └── CreateThreadModal.tsx # Modal para crear thread
│   ├── Thread/
│   │   ├── ThreadHeader.tsx      # Header del thread
│   │   ├── MessageList.tsx       # Lista de mensajes
│   │   ├── MessageItem.tsx       # Item individual de mensaje
│   │   └── MessageInput.tsx      # Input para enviar mensajes
│   └── Common/
│       ├── Avatar.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useAuth.ts                # Hook de autenticación
│   ├── useChannels.ts            # Hook para canales
│   ├── useThreads.ts             # Hook para threads
│   ├── useMessages.ts            # Hook para mensajes
│   └── useWebSocket.ts           # Hook para WebSocket
├── services/
│   ├── api.ts                    # Cliente HTTP (axios/fetch)
│   ├── websocket.ts              # Cliente WebSocket
│   └── auth.service.ts           # Servicio de autenticación
├── store/                        # Estado global (Zustand/Redux)
│   ├── channelStore.ts
│   ├── threadStore.ts
│   ├── messageStore.ts
│   └── authStore.ts
├── types/
│   ├── channel.types.ts
│   ├── thread.types.ts
│   ├── message.types.ts
│   └── websocket.types.ts
└── utils/
    ├── formatDate.ts
    └── constants.ts
```

---

## Setup Inicial

### Instalación de Dependencias

```bash
# Con npm
npm install axios zustand date-fns

# Con yarn
yarn add axios zustand date-fns

# Con pnpm
pnpm add axios zustand date-fns
```

### Configuración de Variables de Entorno

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
```

---

## Autenticación

### Tipos TypeScript

```typescript
// types/auth.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

### Servicio de Autenticación

```typescript
// services/auth.service.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export class AuthService {
  static async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    }, {
      withCredentials: true, // Importante para cookies
    });
    return response.data;
  }

  static async register(email: string, password: string, name: string) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name,
    }, {
      withCredentials: true,
    });
    return response.data;
  }

  static async logout() {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
  }

  static async getCurrentUser() {
    const response = await axios.get(`${API_URL}/auth/session`, {
      withCredentials: true,
    });
    return response.data;
  }
}
```

### Hook de Autenticación

```typescript
// hooks/useAuth.ts
import { create } from 'zustand';
import { AuthService } from '../services/auth.service';
import type { User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthService.login(email, password);
      set({ user: data.user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthService.register(email, password, name);
      set({ user: data.user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const data = await AuthService.getCurrentUser();
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
}));
```

---

## Gestión de Estado

### Store de Canales

```typescript
// store/channelStore.ts
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Channel {
  id: string;
  name: string;
  description: string | null;
  isPrivate: boolean;
  imageUrl: string | null;
  category: string;
  ownerId: string;
  createdAt: string;
}

interface ChannelStore {
  channels: Channel[];
  currentChannel: Channel | null;
  isLoading: boolean;
  
  fetchChannels: () => Promise<void>;
  fetchJoinedChannels: () => Promise<void>;
  setCurrentChannel: (channel: Channel) => void;
  createChannel: (data: Partial<Channel>) => Promise<Channel>;
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
  channels: [],
  currentChannel: null,
  isLoading: false,

  fetchChannels: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/chats/channels`, {
        withCredentials: true,
      });
      set({ channels: response.data.data.map((item: any) => item.channel), isLoading: false });
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      set({ isLoading: false });
    }
  },

  fetchJoinedChannels: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/chats/members/joined`, {
        withCredentials: true,
      });
      set({ channels: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch joined channels:', error);
      set({ isLoading: false });
    }
  },

  setCurrentChannel: (channel) => {
    set({ currentChannel: channel });
  },

  createChannel: async (data) => {
    const response = await axios.post(`${API_URL}/chats/channels`, data, {
      withCredentials: true,
    });
    const newChannel = response.data.channel;
    set((state) => ({ channels: [...state.channels, newChannel] }));
    return newChannel;
  },
}));
```

### Store de Threads

```typescript
// store/threadStore.ts
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Thread {
  id: string;
  channelId: string;
  name: string;
  description: string | null;
  createdBy: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ThreadStore {
  threads: Thread[];
  currentThread: Thread | null;
  isLoading: boolean;
  
  fetchThreadsByChannel: (channelId: string) => Promise<void>;
  setCurrentThread: (thread: Thread) => void;
  createThread: (data: { channelId: string; name: string; description?: string }) => Promise<Thread>;
}

export const useThreadStore = create<ThreadStore>((set) => ({
  threads: [],
  currentThread: null,
  isLoading: false,

  fetchThreadsByChannel: async (channelId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/chats/threads/channel/${channelId}/active`, {
        withCredentials: true,
      });
      set({ threads: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      set({ isLoading: false });
    }
  },

  setCurrentThread: (thread) => {
    set({ currentThread: thread });
  },

  createThread: async (data) => {
    const response = await axios.post(`${API_URL}/chats/threads`, data, {
      withCredentials: true,
    });
    const newThread = response.data;
    set((state) => ({ threads: [...state.threads, newThread] }));
    return newThread;
  },
}));
```

### Store de Mensajes

```typescript
// store/messageStore.ts
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Message {
  id: string;
  senderId: string;
  threadId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    image?: string | null;
  };
}

interface MessageStore {
  messages: Message[];
  isLoading: boolean;
  
  fetchMessages: (threadId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  sendMessage: (threadId: string, content: string) => Promise<Message>;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  isLoading: false,

  fetchMessages: async (threadId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/chats/messages/thread/${threadId}`, {
        withCredentials: true,
      });
      set({ messages: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ isLoading: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  removeMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    }));
  },

  sendMessage: async (threadId, content) => {
    const response = await axios.post(`${API_URL}/chats/messages`, {
      threadId,
      content,
    }, {
      withCredentials: true,
    });
    
    return response.data;
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
```

---

## WebSocket Integration

### Cliente WebSocket

```typescript
// services/websocket.ts
import type { Message } from '../store/messageStore';

export type WebSocketEventType = 'NEW_MESSAGE' | 'MESSAGE_DELETED' | 'ERROR';

export interface WebSocketMessage<T = any> {
  type: WebSocketEventType;
  payload: T;
}

export interface NewMessagePayload {
  id: string;
  content: string;
  senderId: string;
  threadId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export interface MessageDeletedPayload {
  id: string;
  threadId: string;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<WebSocketEventType, Set<(payload: any) => void>> = new Map();
  private readonly WS_URL = import.meta.env.VITE_WS_URL;

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return; // Ya conectado
    }

    this.ws = new WebSocket(this.WS_URL);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      // Reconectar después de 5 segundos
      this.reconnectTimeout = setTimeout(() => {
        console.log('🔄 Attempting to reconnect...');
        this.connect();
      }, 5000);
    };
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinThread(threadId: string) {
    this.send({
      type: 'JOIN_THREAD',
      payload: { threadId },
    });
  }

  leaveThread(threadId: string) {
    this.send({
      type: 'LEAVE_THREAD',
      payload: { threadId },
    });
  }

  on(eventType: WebSocketEventType, callback: (payload: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  off(eventType: WebSocketEventType, callback: (payload: any) => void) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(message.payload));
    }
  }
}

// Singleton instance
export const wsClient = new WebSocketClient();
```

### Hook de WebSocket

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { wsClient, type WebSocketEventType } from '../services/websocket';
import { useMessageStore } from '../store/messageStore';

export function useWebSocket() {
  const addMessage = useMessageStore((state) => state.addMessage);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const handlersRef = useRef<Map<WebSocketEventType, (payload: any) => void>>(new Map());

  useEffect(() => {
    // Conectar al montar
    wsClient.connect();

    // Handlers
    const onNewMessage = (payload: any) => {
      console.log('📩 New message received:', payload);
      addMessage({
        id: payload.id,
        senderId: payload.senderId,
        threadId: payload.threadId,
        content: payload.content,
        createdAt: payload.createdAt,
        sender: payload.sender,
      });
    };

    const onMessageDeleted = (payload: any) => {
      console.log('🗑️ Message deleted:', payload.id);
      removeMessage(payload.id);
    };

    const onError = (payload: any) => {
      console.error('❌ WebSocket error:', payload.message);
      // Mostrar notificación de error
    };

    // Registrar handlers
    handlersRef.current.set('NEW_MESSAGE', onNewMessage);
    handlersRef.current.set('MESSAGE_DELETED', onMessageDeleted);
    handlersRef.current.set('ERROR', onError);

    wsClient.on('NEW_MESSAGE', onNewMessage);
    wsClient.on('MESSAGE_DELETED', onMessageDeleted);
    wsClient.on('ERROR', onError);

    // Cleanup
    return () => {
      handlersRef.current.forEach((handler, eventType) => {
        wsClient.off(eventType, handler);
      });
      wsClient.disconnect();
    };
  }, [addMessage, removeMessage]);

  return {
    joinThread: (threadId: string) => wsClient.joinThread(threadId),
    leaveThread: (threadId: string) => wsClient.leaveThread(threadId),
  };
}
```

---

## Componentes Principales

### ChannelList Component

```typescript
// components/Channel/ChannelList.tsx
import { useEffect } from 'react';
import { useChannelStore } from '../../store/channelStore';
import { useThreadStore } from '../../store/threadStore';

export function ChannelList() {
  const { channels, currentChannel, fetchJoinedChannels, setCurrentChannel } = useChannelStore();
  const { fetchThreadsByChannel } = useThreadStore();

  useEffect(() => {
    fetchJoinedChannels();
  }, []);

  const handleChannelClick = (channel: any) => {
    setCurrentChannel(channel);
    fetchThreadsByChannel(channel.id);
  };

  return (
    <div className="channel-list">
      <h2>Channels</h2>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`channel-item ${currentChannel?.id === channel.id ? 'active' : ''}`}
          onClick={() => handleChannelClick(channel)}
        >
          <span className="channel-icon">#</span>
          <span className="channel-name">{channel.name}</span>
        </div>
      ))}
    </div>
  );
}
```

### ThreadList Component

```typescript
// components/Thread/ThreadList.tsx
import { useThreadStore } from '../../store/threadStore';
import { useMessageStore } from '../../store/messageStore';
import { useWebSocket } from '../../hooks/useWebSocket';

export function ThreadList() {
  const { threads, currentThread, setCurrentThread } = useThreadStore();
  const { fetchMessages, clearMessages } = useMessageStore();
  const { joinThread, leaveThread } = useWebSocket();

  const handleThreadClick = async (thread: any) => {
    // Salir del thread anterior si existe
    if (currentThread) {
      leaveThread(currentThread.id);
    }

    // Actualizar thread actual
    setCurrentThread(thread);
    
    // Limpiar mensajes anteriores
    clearMessages();
    
    // Cargar mensajes del nuevo thread
    await fetchMessages(thread.id);
    
    // Unirse al thread por WebSocket
    joinThread(thread.id);
  };

  return (
    <div className="thread-list">
      <h3>Threads</h3>
      {threads.map((thread) => (
        <div
          key={thread.id}
          className={`thread-item ${currentThread?.id === thread.id ? 'active' : ''}`}
          onClick={() => handleThreadClick(thread)}
        >
          <div className="thread-name">{thread.name}</div>
          {thread.description && (
            <div className="thread-description">{thread.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### MessageList Component

```typescript
// components/Thread/MessageList.tsx
import { useEffect, useRef } from 'react';
import { useMessageStore } from '../../store/messageStore';
import { formatDistanceToNow } from 'date-fns';

export function MessageList() {
  const messages = useMessageStore((state) => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className="message-item">
          <div className="message-header">
            <span className="message-sender">
              {message.sender?.name || 'Unknown'}
            </span>
            <span className="message-time">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
```

### MessageInput Component

```typescript
// components/Thread/MessageInput.tsx
import { useState } from 'react';
import { useThreadStore } from '../../store/threadStore';
import { useMessageStore } from '../../store/messageStore';

export function MessageInput() {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const currentThread = useThreadStore((state) => state.currentThread);
  const sendMessage = useMessageStore((state) => state.sendMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !currentThread || isSending) return;

    setIsSending(true);
    try {
      // Enviar por HTTP (el servidor hará broadcast por WebSocket)
      await sendMessage(currentThread.id, content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!currentThread) {
    return <div className="message-input-placeholder">Select a thread to start messaging</div>;
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Message #${currentThread.name}`}
        disabled={isSending}
      />
      <button type="submit" disabled={!content.trim() || isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

---

## Flujos de Usuario

### Diagrama de Flujo: Enviar Mensaje

```
Usuario escribe mensaje
         │
         ▼
Click "Send"
         │
         ▼
POST /api/messages
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Éxito     Error
    │         │
    │         └─> Mostrar error
    │
    ▼
Servidor guarda en BD
    │
    ▼
Servidor emite evento
    │
    ▼
Gateway broadcast por WebSocket
    │
    ▼
Cliente recibe NEW_MESSAGE
    │
    ▼
Agregar mensaje a la UI
```

### Diagrama de Secuencia: Cambiar de Thread

```
Usuario              Frontend              Backend              WebSocket
   │                    │                     │                     │
   │  Click Thread      │                     │                     │
   ├───────────────────>│                     │                     │
   │                    │ LEAVE_THREAD (old)  │                     │
   │                    ├────────────────────────────────────────>│
   │                    │                     │                     │
   │                    │ GET /messages/:id   │                     │
   │                    ├────────────────────>│                     │
   │                    │<────────────────────┤                     │
   │                    │   Mensajes          │                     │
   │                    │                     │                     │
   │                    │ JOIN_THREAD (new)   │                     │
   │                    ├────────────────────────────────────────>│
   │                    │                     │                     │
   │  Mostrar mensajes  │                     │                     │
   │<───────────────────┤                     │                     │
```

---

## Best Practices

### 1. Server-Driven State

✅ **SIEMPRE** confiar en los eventos del servidor
```typescript
// ❌ INCORRECTO
const sendMessage = (content) => {
  const tempMessage = { id: 'temp', content, ... };
  setMessages([...messages, tempMessage]); // Agregar inmediatamente
  api.sendMessage(content);
};

// ✅ CORRECTO
const sendMessage = async (content) => {
  await api.sendMessage(content);
  // NO agregar aquí, esperar evento WebSocket NEW_MESSAGE
};
```

### 2. Cleanup de Suscripciones

```typescript
useEffect(() => {
  if (currentThread) {
    wsClient.joinThread(currentThread.id);
  }

  return () => {
    if (currentThread) {
      wsClient.leaveThread(currentThread.id);
    }
  };
}, [currentThread?.id]);
```

### 3. Manejo de Errores

```typescript
try {
  await sendMessage(threadId, content);
} catch (error) {
  if (error.response?.status === 403) {
    alert('You do not have permission to send messages here');
  } else if (error.response?.status === 404) {
    alert('Thread not found');
  } else {
    alert('Failed to send message');
  }
}
```

### 4. Loading States

```typescript
const MessageList = () => {
  const { messages, isLoading } = useMessageStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (messages.length === 0) {
    return <EmptyState message="No messages yet" />;
  }

  return (
    <div>
      {messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </div>
  );
};
```

### 5. Optimistic Updates (Opcional)

Si quieres mostrar feedback inmediato:

```typescript
const sendMessage = async (content) => {
  const tempId = `temp-${Date.now()}`;
  const tempMessage = {
    id: tempId,
    content,
    senderId: currentUser.id,
    threadId: currentThread.id,
    createdAt: new Date().toISOString(),
    sender: currentUser,
  };

  // Agregar temporalmente
  addMessage(tempMessage);

  try {
    const realMessage = await api.sendMessage(threadId, content);
    // El WebSocket enviará el evento, que reemplazará el temp
  } catch (error) {
    // Remover el mensaje temporal si falla
    removeMessage(tempId);
    throw error;
  }
};

// En el handler de WebSocket
const onNewMessage = (payload) => {
  // Verificar si ya existe un mensaje temporal con el mismo contenido
  const existingTemp = messages.find(
    m => m.id.startsWith('temp-') && 
         m.content === payload.content &&
         m.senderId === payload.senderId
  );

  if (existingTemp) {
    // Reemplazar temp con real
    updateMessage(existingTemp.id, payload);
  } else {
    // Agregar nuevo mensaje
    addMessage(payload);
  }
};
```

### 6. Paginación de Mensajes

```typescript
const MessageList = () => {
  const loadMoreMessages = async () => {
    if (!hasMore || isLoadingMore) return;

    const oldest = messages[0];
    const response = await api.getMessages(threadId, {
      limit: 50,
      before: oldest.createdAt,
    });

    prependMessages(response.data);
  };

  return (
    <div onScroll={handleScroll}>
      {hasMore && <button onClick={loadMoreMessages}>Load More</button>}
      {messages.map(...)}
    </div>
  );
};
```

### 7. Typing Indicators (Futuro)

```typescript
// Cuando el usuario está escribiendo
const handleInputChange = (e) => {
  setContent(e.target.value);
  
  // Enviar indicador de "typing"
  wsClient.send({
    type: 'TYPING_START',
    payload: { threadId: currentThread.id }
  });

  // Cancelar después de 3 segundos
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    wsClient.send({
      type: 'TYPING_STOP',
      payload: { threadId: currentThread.id }
    });
  }, 3000);
};
```

---

## Troubleshooting

### WebSocket no conecta

1. Verificar que la URL sea correcta (`ws://` no `http://`)
2. Verificar que las cookies de sesión estén presentes
3. Revisar la consola del navegador para errores
4. Verificar CORS en el backend

### Mensajes duplicados

- ✅ NUNCA agregar mensajes en el cliente después de `POST /api/messages`
- ✅ SIEMPRE esperar el evento `NEW_MESSAGE` del WebSocket
- ✅ Verificar que no haya múltiples suscripciones al mismo thread

### Mensajes no se muestran

1. Verificar que el thread esté seleccionado
2. Verificar que se haya unido al thread (`JOIN_THREAD`)
3. Revisar la consola para errores de WebSocket
4. Verificar permisos del usuario en el canal

---

## Recursos Adicionales

- [Backend API Documentation](./README.md)
- [WebSocket Protocol](./README.md#-websocket)
- [Architecture Overview](./ARCHITECTURE_BEFORE_AFTER.md)

---

¡Feliz desarrollo! 🚀
