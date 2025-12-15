# 💬 Chat Application Backend - Real-time Messaging with Threads

> Backend moderno para aplicación de mensajería en tiempo real con arquitectura basada en **Canales**, **Threads** y **WebSockets**. Construido con Bun, Hono, Drizzle ORM y PostgreSQL.

[![Bun](https://img.shields.io/badge/Bun-1.2+-black?logo=bun)](https://bun.sh)
[![Hono](https://img.shields.io/badge/Hono-4.x-orange)](https://hono.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-green)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

## 📋 Tabla de Contenidos

- [🎯 Características](#-características)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [📡 API Endpoints](#-api-endpoints)
- [🔌 WebSocket](#-websocket)
- [💾 Base de Datos](#-base-de-datos)
- [📖 Documentación Adicional](#-documentación-adicional)

---

## 🎯 Características

### ✨ Core Features

- 🔐 **Autenticación Segura** con Better-Auth
- 📢 **Canales** organizados por categorías
- 🧵 **Threads** para conversaciones organizadas dentro de canales
- 💬 **Mensajería en Tiempo Real** con WebSockets
- 👥 **Sistema de Roles** (Admin, Moderator, Member)
- 🎭 **Canales Públicos y Privados**
- 📌 **Archivado de Threads**
- 🗑️ **Eliminación de Mensajes** con permisos
- 📊 **Server-Driven State Synchronization**

### 🏛️ Arquitectura

- 📦 **Clean Architecture** con separación de capas
- 🎯 **Domain-Driven Design** con tipos de dominio desacoplados
- 🔄 **Event-Driven** con MessageEventEmitter
- ✅ **Validación con Zod** en todos los endpoints
- 🔌 **WebSocket Gateway** para comunicación bidireccional
- 📊 **Servidor como fuente única de verdad**

---

## 🏗️ Arquitectura

### Modelo de Datos: Canales → Threads → Mensajes

```
┌─────────────┐
│   Channel   │  "General", "Tech Talk", etc.
│             │
│  - name     │
│  - owner    │
│  - members  │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│   Thread    │  "Project Alpha", "Bug Discussion"
│             │
│  - name     │
│  - channel  │
│  - archived │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│   Message   │  "Hello!", "Let's fix this"
│             │
│  - content  │
│  - sender   │
│  - thread   │
└─────────────┘
```

### Estructura del Proyecto

```
src/
├── index.ts                      # Punto de entrada, configuración WebSocket
├── lib/
│   └── auth.ts                   # Configuración de Better-Auth
├── db/
│   ├── index.ts                  # Configuración de Drizzle ORM
│   └── schema/                   # Entidades de base de datos
│       ├── users.entity.ts
│       ├── channels.entity.ts
│       ├── channel-members.entity.ts
│       ├── threads.entity.ts
│       └── messages.entity.ts
└── modules/
    └── chat/
        ├── chat.module.ts        # Módulo principal con DI
        ├── controllers/          # Capa de presentación (HTTP)
        │   ├── channel.controller.ts
        │   ├── channel-member.controller.ts
        │   ├── thread.controller.ts
        │   ├── message.controller.ts
        │   └── debug.controller.ts
        ├── services/             # Lógica de negocio
        │   ├── channel.service.ts
        │   ├── channel-member.service.ts
        │   ├── thread.service.ts
        │   ├── message.service.ts
        │   └── message-event.emitter.ts
        ├── repositories/         # Capa de acceso a datos
        │   ├── channel.repository.ts
        │   ├── channel-member.repository.ts
        │   ├── thread.repository.ts
        │   └── message.repository.ts
        ├── domain/               # Tipos e interfaces de dominio
        │   ├── channel.domain.ts
        │   ├── channel-member.domain.ts
        │   ├── thread.domain.ts
        │   ├── message.domain.ts
        │   └── index.ts
        ├── dtos/                 # Validación con Zod
        ├── gateway/              # WebSocket
        │   ├── chat.gateway.ts
        │   └── connection.manager.ts
        └── types/
            └── websocket-messages.ts
```

### Flujo de Datos

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────┐
│  Controllers    │ ◄── Validación con Zod
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │ ◄── Lógica de negocio
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Repositories   │ ◄── Acceso a datos
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
└─────────────────┘
```

### WebSocket Event Flow (Threads)

```
Cliente envía mensaje
         │
         ▼
POST /api/messages { threadId, content }
         │
         ▼
MessageController
         │
         ▼
MessageService.createMessage()
         │
         ├─> Guarda en BD
         │
         └─> MessageEventEmitter.emit(threadId)
                      │
                      ▼
              ChatGateway (listener)
                      │
                      ▼
         broadcastMessageToThread(threadId)
                      │
                      ▼
         Envía NEW_MESSAGE por WebSocket
                      │
                      ▼
       Solo a usuarios suscritos al thread
```

---

## 🚀 Inicio Rápido

### Requisitos

- **Bun** >= 1.2.13
- **PostgreSQL** >= 14
- **Node.js** >= 18 (opcional, para herramientas)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JosueXDa/back-chat-message.git
cd back-chat-message

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### Configuración de Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chat_db

# Auth (Better-Auth)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:8081
```

### Migraciones de Base de Datos

```bash
# Generar migraciones
bun run drizzle-kit generate

# Aplicar migraciones
bun run drizzle-kit migrate

# Abrir Drizzle Studio (GUI)
bun run drizzle-kit studio
```

### Ejecutar el Servidor

```bash
# Modo desarrollo con hot reload
bun run dev

# Servidor estará disponible en:
# HTTP: http://localhost:3000
# WebSocket: ws://localhost:3000/ws
```

---

## 📡 API Endpoints

### 🔐 Autenticación

Todos los endpoints (excepto `/api/auth/*`) requieren autenticación con Better-Auth.

**Headers requeridos:**
```http
Authorization: Bearer <token>
Cookie: session=<session-cookie>
```

---

### 📢 Channels

#### `GET /api/chats/channels`
Obtener todos los canales (paginado)

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "channel": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "General",
        "description": "Canal general",
        "isPrivate": false,
        "imageUrl": null,
        "category": "General",
        "ownerId": "user-uuid",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### `GET /api/chats/channels/:id`
Obtener un canal específico

**Response:** `200 OK`

#### `POST /api/chats/channels`
Crear un nuevo canal

**Request Body:**
```json
{
  "name": "Tech Talk",
  "description": "Discusiones sobre tecnología",
  "isPrivate": false,
  "category": "Technology",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Validación (Zod):**
- `name`: Requerido, 1-100 caracteres
- `description`: Opcional, máximo 500 caracteres
- `isPrivate`: Opcional, default `false`
- `category`: Opcional, default `"General"`
- `imageUrl`: Opcional, debe ser URL válida

**Response:** `200 OK`
```json
{
  "channel": {
    "id": "uuid",
    "name": "Tech Talk",
    "description": "Discusiones sobre tecnología",
    "isPrivate": false,
    "imageUrl": "https://example.com/image.jpg",
    "category": "Technology",
    "ownerId": "current-user-id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Errores:**
- `400 Bad Request`: Validación fallida
- `401 Unauthorized`: Sin autenticación
- `500 Internal Server Error`: Error del servidor

#### `PATCH /api/chats/channels/:id`
Actualizar un canal

**Request Body:**
```json
{
  "name": "Tech Talk Updated",
  "description": "Nueva descripción",
  "isPrivate": true
}
```

**Validación:** Al menos un campo debe ser proporcionado

**Response:** `200 OK`

#### `DELETE /api/chats/channels/:id`
Eliminar un canal (solo owner)

**Nota:** Esto eliminará en cascada:
- Todos los miembros del canal
- Todos los threads del canal
- Todos los mensajes de esos threads

**Response:** `200 OK`
```json
{
  "message": "Channel deleted"
}
```

---

### 👥 Channel Members

#### `GET /api/chats/members/joined`
Obtener canales del usuario actual

**Response:** `200 OK`
```json
[
  {
    "id": "channel-uuid",
    "name": "General",
    "description": "Canal general",
    "isPrivate": false,
    "imageUrl": null,
    "category": "General",
    "ownerId": "user-uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### `GET /api/chats/members/:channelId`
Obtener miembros de un canal

**Permisos:** Solo miembros del canal pueden ver la lista

**Response:** `200 OK`
```json
[
  {
    "channelId": "uuid",
    "userId": "user-uuid",
    "role": "admin",
    "joinedAt": "2024-01-01T00:00:00Z"
  },
  {
    "channelId": "uuid",
    "userId": "user-uuid-2",
    "role": "member",
    "joinedAt": "2024-01-02T00:00:00Z"
  }
]
```

#### `GET /api/chats/members/:channelId/role/:userId`
Obtener rol de un usuario en un canal

**Response:** `200 OK`
```json
{
  "role": "moderator"
}
```

**Errores:**
- `404 Not Found`: Miembro no encontrado

#### `POST /api/chats/members`
Agregar miembro a un canal (solo admins)

**Request Body:**
```json
{
  "channelId": "channel-uuid",
  "userId": "user-uuid",
  "role": "member"
}
```

**Roles disponibles:**
- `admin`: Puede agregar/remover miembros, cambiar roles, modificar canal
- `moderator`: Puede moderar contenido, archivar threads
- `member`: Usuario normal

**Response:** `201 Created`
```json
{
  "channelId": "uuid",
  "userId": "user-uuid",
  "role": "member",
  "joinedAt": "2024-01-01T00:00:00Z"
}
```

#### `PATCH /api/chats/members/:channelId/:userId/role`
Cambiar rol de un miembro (solo admins)

**Request Body:**
```json
{
  "role": "moderator"
}
```

**Response:** `200 OK`

#### `DELETE /api/chats/members/:channelId/:userId`
Eliminar miembro del canal

**Permisos:**
- Admins pueden eliminar a cualquiera
- Los usuarios pueden eliminarse a sí mismos (salir del canal)

**Response:** `200 OK`
```json
{
  "message": "Member removed successfully"
}
```

---

### 🧵 Threads

Los threads permiten organizar conversaciones dentro de un canal.

#### `GET /api/chats/threads/channel/:channelId`
Obtener todos los threads de un canal

**Response:** `200 OK`
```json
[
  {
    "id": "thread-uuid",
    "channelId": "channel-uuid",
    "name": "Project Alpha Discussion",
    "description": "Discussing the new project requirements",
    "createdBy": "user-uuid",
    "isArchived": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-05T10:30:00Z"
  }
]
```

#### `GET /api/chats/threads/channel/:channelId/active`
Obtener solo threads activos (no archivados)

**Response:** `200 OK`

#### `GET /api/chats/threads/:id`
Obtener un thread específico

**Permisos:** Usuario debe ser miembro del canal

**Response:** `200 OK`
```json
{
  "id": "thread-uuid",
  "channelId": "channel-uuid",
  "name": "Bug Discussion",
  "description": "Fixing critical bug in production",
  "createdBy": "user-uuid",
  "isArchived": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### `POST /api/chats/threads`
Crear un nuevo thread

**Request Body:**
```json
{
  "channelId": "channel-uuid",
  "name": "New Discussion Topic",
  "description": "Let's talk about the new feature"
}
```

**Validación:**
- `channelId`: Requerido, UUID válido
- `name`: Requerido, 1-100 caracteres
- `description`: Opcional, máximo 500 caracteres

**Permisos:** Usuario debe ser miembro del canal

**Response:** `201 Created`
```json
{
  "id": "thread-uuid",
  "channelId": "channel-uuid",
  "name": "New Discussion Topic",
  "description": "Let's talk about the new feature",
  "createdBy": "current-user-id",
  "isArchived": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### `PATCH /api/chats/threads/:id`
Actualizar un thread

**Permisos:** Creador del thread o moderator/admin

**Request Body:**
```json
{
  "name": "Updated Thread Name",
  "description": "Updated description",
  "isArchived": false
}
```

**Response:** `200 OK`

#### `POST /api/chats/threads/:id/archive`
Archivar un thread (solo admins)

**Response:** `200 OK`
```json
{
  "id": "thread-uuid",
  "isArchived": true,
  ...
}
```

#### `POST /api/chats/threads/:id/unarchive`
Desarchivar un thread (solo admins)

**Response:** `200 OK`

#### `DELETE /api/chats/threads/:id`
Eliminar un thread

**Permisos:** Creador del thread o admin

**Nota:** Esto eliminará todos los mensajes del thread

**Response:** `200 OK`
```json
{
  "message": "Thread deleted successfully"
}
```

---

### 💬 Messages

Los mensajes pertenecen a threads, no directamente a canales.

#### `GET /api/chats/messages/thread/:threadId`
Obtener mensajes de un thread

**Query Parameters:**
- `limit` (opcional): Número de mensajes (default: 50)
- `offset` (opcional): Offset para paginación (default: 0)

**Permisos:** Usuario debe ser miembro del canal que contiene el thread

**Response:** `200 OK`
```json
[
  {
    "id": "msg-uuid",
    "senderId": "user-uuid",
    "threadId": "thread-uuid",
    "content": "Hello everyone!",
    "createdAt": "2024-01-01T12:00:00Z"
  },
  {
    "id": "msg-uuid-2",
    "senderId": "user-uuid-2",
    "threadId": "thread-uuid",
    "content": "Hi! How are you?",
    "createdAt": "2024-01-01T12:01:00Z"
  }
]
```

#### `POST /api/chats/messages`
Crear un mensaje

**Request Body:**
```json
{
  "threadId": "thread-uuid",
  "content": "This is my message"
}
```

**Validación:**
- `threadId`: Requerido, UUID válido
- `content`: Requerido, mínimo 1 carácter

**Permisos:** Usuario debe ser miembro del canal que contiene el thread

**Response:** `201 Created`
```json
{
  "id": "msg-uuid",
  "senderId": "current-user-id",
  "threadId": "thread-uuid",
  "content": "This is my message",
  "createdAt": "2024-01-01T12:05:00Z"
}
```

**Flujo Completo:**
1. Cliente envía POST /api/messages
2. Servidor guarda en BD y retorna ID real (201 Created)
3. Servidor emite evento a MessageEventEmitter
4. ChatGateway detecta evento y hace broadcast por WebSocket
5. Todos los clientes suscritos al thread reciben `NEW_MESSAGE`

> **Importante:** Después de crear un mensaje por HTTP, el servidor automáticamente emitirá un evento `NEW_MESSAGE` por WebSocket a todos los usuarios suscritos al thread.

#### `DELETE /api/chats/messages/:id`
Eliminar un mensaje

**Permisos:**
- Autor del mensaje puede eliminarlo
- Moderators/admins pueden eliminar cualquier mensaje

**Response:** `200 OK`
```json
{
  "message": "Message deleted successfully"
}
```

**Flujo:** También emite evento `MESSAGE_DELETED` por WebSocket

---

## 🔌 WebSocket

### Conexión

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

// Autenticación: el token debe estar en las cookies
// Better-Auth maneja esto automáticamente
```

**Nota:** La sesión debe ser válida. El servidor verificará la cookie de sesión en la conexión inicial.

---

### Eventos Cliente → Servidor

#### JOIN_THREAD
Suscribirse a un thread para recibir mensajes en tiempo real

```json
{
  "type": "JOIN_THREAD",
  "payload": {
    "threadId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Nota:** El servidor verificará que el usuario sea miembro del canal antes de permitir la suscripción.

#### LEAVE_THREAD
Desuscribirse de un thread

```json
{
  "type": "LEAVE_THREAD",
  "payload": {
    "threadId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### SEND_MESSAGE
Enviar un mensaje por WebSocket (alternativa a POST /api/messages)

```json
{
  "type": "SEND_MESSAGE",
  "payload": {
    "threadId": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Hello from WebSocket!"
  }
}
```

**Recomendación:** Usar POST /api/messages en lugar de WebSocket para enviar mensajes, ya que proporciona mejor manejo de errores y validación.

---

### Eventos Servidor → Cliente

#### NEW_MESSAGE
Nuevo mensaje creado en un thread

```json
{
  "type": "NEW_MESSAGE",
  "payload": {
    "id": "msg-uuid",
    "content": "Hello!",
    "senderId": "user-uuid",
    "threadId": "thread-uuid",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "sender": {
      "id": "user-uuid",
      "name": "John Doe",
      "image": "https://avatar.url"
    }
  }
}
```

**Importante:** Este es el ÚNICO evento que debe usar el cliente para agregar/actualizar mensajes en la UI. El servidor es la fuente única de verdad.

#### MESSAGE_DELETED
Mensaje eliminado de un thread

```json
{
  "type": "MESSAGE_DELETED",
  "payload": {
    "id": "msg-uuid",
    "threadId": "thread-uuid"
  }
}
```

**Uso:** El cliente debe remover el mensaje con este ID de la UI.

#### ERROR
Error en el procesamiento

```json
{
  "type": "ERROR",
  "payload": {
    "message": "Cannot join thread: User is not a member of this channel",
    "code": "FORBIDDEN"
  }
}
```

---

### Ejemplo Completo de Integración WebSocket

```typescript
// Conexión
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('✅ Connected to WebSocket');
  
  // Unirse a un thread
  ws.send(JSON.stringify({
    type: 'JOIN_THREAD',
    payload: { threadId: 'thread-123' }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'NEW_MESSAGE':
      console.log('📩 New message:', data.payload);
      // Agregar mensaje a la UI
      addMessageToUI(data.payload);
      break;
      
    case 'MESSAGE_DELETED':
      console.log('🗑️ Message deleted:', data.payload.id);
      // Remover mensaje de la UI
      removeMessageFromUI(data.payload.id);
      break;
      
    case 'ERROR':
      console.error('❌ WebSocket error:', data.payload.message);
      // Mostrar error al usuario
      showError(data.payload.message);
      break;
      
    default:
      console.warn('⚠️ Unknown event type:', data.type);
  }
};

ws.onerror = (error) => {
  console.error('❌ WebSocket error:', error);
};

ws.onclose = () => {
  console.log('🔌 Disconnected from WebSocket');
  // Intentar reconectar
  setTimeout(() => reconnect(), 5000);
};

// Al cambiar de thread
function switchThread(newThreadId) {
  // Salir del thread actual
  ws.send(JSON.stringify({
    type: 'LEAVE_THREAD',
    payload: { threadId: currentThreadId }
  }));
  
  // Unirse al nuevo thread
  ws.send(JSON.stringify({
    type: 'JOIN_THREAD',
    payload: { threadId: newThreadId }
  }));
  
  currentThreadId = newThreadId;
}
```

---

## 💾 Base de Datos

### Schema

```sql
-- Users (manejado por Better-Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Channels
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  is_private BOOLEAN DEFAULT false,
  image_url TEXT,
  category VARCHAR(50) DEFAULT 'General',
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Channel Members (con sistema de roles)
CREATE TABLE channel_members (
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- admin, moderator, member
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (channel_id, user_id)
);

-- Threads (conversaciones dentro de canales)
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages (pertenecen a threads)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Índices

```sql
-- Para mejor performance en queries comunes
CREATE INDEX idx_channel_members_user ON channel_members(user_id);
CREATE INDEX idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX idx_threads_channel ON threads(channel_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

### Triggers

#### Auto-add Channel Owner as Admin
```sql
-- Cuando se crea un canal, automáticamente agrega al owner como admin
CREATE OR REPLACE FUNCTION add_owner_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO channel_members (channel_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_channel_owner_as_admin
  AFTER INSERT ON channels
  FOR EACH ROW
  EXECUTE FUNCTION add_owner_as_admin();
```

#### Update Thread Timestamp on New Message
```sql
-- Actualiza updated_at del thread cuando se crea un mensaje
CREATE OR REPLACE FUNCTION update_thread_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads
  SET updated_at = NOW()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_timestamp();
```

### Cascadas de Eliminación

```
Channel DELETE
  └─> channel_members DELETE (CASCADE)
  └─> threads DELETE (CASCADE)
      └─> messages DELETE (CASCADE)

Thread DELETE
  └─> messages DELETE (CASCADE)

User DELETE
  └─> channel_members DELETE (CASCADE)
  └─> channels.owner_id SET NULL
  └─> threads.created_by SET NULL
  └─> messages.sender_id SET NULL
```

---

## 📖 Documentación Adicional

- 📘 **[Guía de Implementación Frontend](./FRONTEND_IMPLEMENTATION_GUIDE.md)** - Guía detallada para integrar el frontend con threads
- 📗 **[Arquitectura Completa](./ARCHITECTURE_BEFORE_AFTER.md)** - Documentación de la evolución arquitectónica
- 📕 **[Implementación de Mensajería](./MESSAGING_IMPLEMENTATION.md)** - Detalles del sistema de mensajería
- 📙 **[Integración Frontend-Backend](./INTEGRATION_GUIDE_FRONTEND_BACKEND.md)** - Guía de integración completa

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **[Bun](https://bun.sh)** | 1.2+ | Runtime JavaScript ultra-rápido |
| **[Hono](https://hono.dev)** | 4.x | Framework web ultraligero |
| **[Drizzle ORM](https://orm.drizzle.team)** | Latest | TypeScript ORM type-safe |
| **[PostgreSQL](https://www.postgresql.org)** | 14+ | Base de datos relacional |
| **[Better-Auth](https://www.better-auth.com)** | Latest | Autenticación moderna |
| **[Zod](https://zod.dev)** | Latest | Validación de schemas |
| **WebSocket** | Nativo | Comunicación bidireccional en tiempo real |
| **TypeScript** | 5.x | Type-safety completo |

---

## 🚀 Despliegue

### Variables de Entorno para Producción

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/db

# Auth
BETTER_AUTH_SECRET=<strong-random-string>
BETTER_AUTH_URL=https://your-domain.com

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Node Environment
NODE_ENV=production
```

### Docker

```dockerfile
FROM oven/bun:1.2

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
```

```bash
# Build
docker build -t chat-backend .

# Run
docker run -p 3000:3000 --env-file .env chat-backend
```

---

## 📝 Licencia

MIT License - ver [LICENSE](./LICENSE) para más detalles.

---

## 👥 Contribución

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

JosueXDa - [@JosueXDa](https://github.com/JosueXDa)

Project Link: [https://github.com/JosueXDa/back-chat-message](https://github.com/JosueXDa/back-chat-message)

---

## 🎯 Roadmap

- [x] Autenticación con Better-Auth
- [x] Sistema de Canales
- [x] Sistema de Threads
- [x] Mensajería en Tiempo Real
- [x] Sistema de Roles
- [x] WebSocket con Threads
- [x] Archivado de Threads
- [x] Eliminación de Mensajes
- [ ] Indicadores de escritura (typing indicators)
- [ ] Confirmación de lectura (read receipts)
- [ ] Reacciones a mensajes
- [ ] Adjuntar archivos/imágenes
- [ ] Búsqueda de mensajes
- [ ] Notificaciones push
- [ ] Menciones (@user)
- [ ] Hilos de respuestas a mensajes
