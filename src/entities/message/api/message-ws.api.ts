import { sessionStorage } from '@/src/entities/session';
import { Platform } from 'react-native';
import { MessageHandler } from '../model/ws.types';

const BASE_URL = process.env.EXPO_PUBLIC_BACK_URL || 'http://localhost:3000';
const WS_URL = BASE_URL.replace(/^http/, 'ws') + '/ws';

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<MessageHandler>> = new Map();
  private reconnectInterval: any | null = null;
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public async connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;

    this.isConnecting = true;
    if (Platform.OS === 'web') {
      this.ws = new WebSocket(WS_URL);
    } else {
      const token = await sessionStorage.getItem('session_token');
      // @ts-ignore React Native WebSocket supports headers in options object.
      this.ws = new WebSocket(WS_URL, [], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] Received:', data.type);

        if (data.type) {
          this.emit(data.type, data.payload);
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message', e);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error', error);
      this.isConnecting = false;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnecting = false;
      this.ws = null;
      this.scheduleReconnect();
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  public sendMessage(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Sending message:', { type, payload });
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not connected. Message not sent.', { type, payload });
    }
  }

  public on(type: string, handler: MessageHandler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(handler);
  }

  public off(type: string, handler: MessageHandler) {
    this.listeners.get(type)?.delete(handler);
  }

  private emit(type: string, data: any) {
    this.listeners.get(type)?.forEach((handler) => handler(data));
  }

  private scheduleReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect WebSocket...');
        this.connect();
      }, 5000);
    }
  }

  public joinThread(threadId: string) {
    this.sendMessage('JOIN_THREAD', { threadId });
  }

  public leaveThread(threadId: string) {
    this.sendMessage('LEAVE_THREAD', { threadId });
  }
}

export const wsManager = WebSocketManager.getInstance();
