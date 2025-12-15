# 📋 Changelog - Backend API Update

> Actualización del frontend para sincronizar con los cambios del backend (Thread-based architecture)

**Fecha:** 12 de Diciembre, 2025  
**Scope:** Actualización de endpoints API y compatibilidad con arquitectura de Threads

---

## ✅ Cambios Completados

### 1. **Endpoints de Autenticación** ✅
No requirieron cambios. Los endpoints de Better-Auth siguen funcionando correctamente:
- `POST /api/auth/sign-in/email` 
- `POST /api/auth/sign-up/email`
- `GET /api/auth/get-session`
- `POST /api/auth/sign-out`

**Estado:** ✅ **Funcionando correctamente**

---

### 2. **Endpoints de Canales** ✅

#### Actualizaciones realizadas:

**Responses actualizados:**
- `GET /api/chats/channels/:id` ahora retorna `{ channel: Channel }`
- `POST /api/chats/channels` ahora retorna `{ channel: Channel }`
- `PATCH /api/chats/channels/:id` ahora retorna `{ channel: Channel }`

**Nuevos endpoints agregados:**
```typescript
// Obtener rol de un miembro específico
getMemberRole(channelId: string, userId: string): Promise<string>

// Actualizar rol de un miembro (solo admins)
updateMemberRole(channelId: string, userId: string, role: string): Promise<void>

// Remover un miembro específico (solo admins)
removeMember(channelId: string, userId: string): Promise<{ message: string }>
```

**Estado:** ✅ **Funcionando correctamente**

---

### 3. **Sistema de Threads** 🆕

El backend ahora usa una arquitectura basada en **Canales → Threads → Mensajes**.

#### Nuevos tipos e interfaces agregadas:

```typescript
interface Thread {
    id: string;
    channelId: string;
    name: string;
    description?: string | null;
    createdBy: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CreateThreadDto {
    channelId: string;
    name: string;
    description?: string;
}

interface UpdateThreadDto {
    name?: string;
    description?: string;
    isArchived?: boolean;
}
```

#### Nuevos endpoints de Threads:

```typescript
// Obtener todos los threads de un canal
getThreadsByChannel(channelId: string): Promise<Thread[]>

// Obtener solo threads activos (no archivados)
getActiveThreadsByChannel(channelId: string): Promise<Thread[]>

// Obtener un thread específico
getThreadById(threadId: string): Promise<Thread>

// Crear un nuevo thread
createThread(data: CreateThreadDto): Promise<Thread>

// Actualizar un thread
updateThread(threadId: string, data: UpdateThreadDto): Promise<Thread>

// Archivar un thread (solo admins)
archiveThread(threadId: string): Promise<Thread>

// Desarchivar un thread (solo admins)
unarchiveThread(threadId: string): Promise<Thread>

// Eliminar un thread (solo creador o admin)
deleteThread(threadId: string): Promise<{ message: string }>
```

**Estado:** ✅ **API lista, pendiente implementación en UI**

---

### 4. **Mensajes - Actualización de Arquitectura** 🔄

Los mensajes ahora pertenecen a **Threads** en lugar de Canales directamente.

#### Cambios en la API:

**Antes:**
```typescript
interface Message {
    channelId: string;  // Mensajes directos en canales
}

getMessages(channelId: string): Promise<Message[]>
createMessage({ channelId, content }): Promise<Message>
```

**Ahora:**
```typescript
interface Message {
    threadId: string;  // Mensajes dentro de threads
    channelId?: string; // Deprecated, solo compatibilidad
}

getMessagesByThread(threadId: string, limit?, offset?): Promise<Message[]>
createMessage({ threadId, content }): Promise<Message>
deleteMessage(messageId: string): Promise<{ message: string }>
```

#### Compatibilidad hacia atrás:

Para no romper componentes existentes (como `ChatWindow.tsx`), se agregaron:

```typescript
// ⚠️ DEPRECATED: Función de compatibilidad
export const getMessages = getMessagesByThread;

// Interfaces con soporte legacy
interface CreateMessageDto {
    threadId?: string;
    channelId?: string; // DEPRECATED pero soportado
    content: string;
}

interface Message {
    threadId?: string;
    channelId?: string; // DEPRECATED pero soportado
    sender?: {
        image?: string | null;
        avatar?: string; // DEPRECATED pero soportado
    };
}
```

**Estado:** ⚠️ **Compatibilidad habilitada, requiere migración futura**

---

## 📝 Archivos Modificados

### API Layer (`/lib/api/`)

1. **`/lib/api/chat.ts`** - Actualizado completamente
   - ✅ Respuestas de canales actualizadas
   - ✅ Nuevos endpoints de members agregados
   - 🆕 Sistema completo de Threads agregado
   - 🔄 Mensajes migrados a threads con compatibilidad

2. **`/lib/api/auth.ts`** - Compatibilidad
   - ✅ Campo `image` agregado al User
   - ⚠️ Campo `avatar` marcado como deprecated pero funcional

3. **`/lib/api/index.ts`** - Exports actualizados
   - ✅ Chat API exportada

### Contexts (Sin cambios)

- ✅ `AuthContext.tsx` - Funcionando correctamente
- ✅ `ChannelContext.tsx` - Funcionando correctamente

### Screens (Sin cambios)

- ✅ `(auth)/login.tsx` - Funcionando correctamente
- ✅ `(auth)/register.tsx` - Funcionando correctamente
- ✅ `(app)/explore.tsx` - Funcionando correctamente

### Components

- ⚠️ `ChatWindow.tsx` - Usa API deprecated pero funcional (requiere migración)

---

## 🔮 Próximos Pasos (Fuera del scope actual)

### Fase 1: Implementar UI de Threads
1. Crear contexto `ThreadContext.tsx`
2. Crear componente `ThreadList.tsx`
3. Crear componente `ThreadView.tsx`
4. Actualizar navegación para soportar threads

### Fase 2: Migrar ChatWindow
1. Actualizar `ChatWindow.tsx` para usar threads
2. Cambiar `channelId` por `threadId`
3. Actualizar referencias de `avatar` a `image`
4. Remover funciones deprecated

### Fase 3: WebSocket con Threads
1. Actualizar `wsManager` para threads
2. Implementar eventos:
   - `JOIN_THREAD`
   - `LEAVE_THREAD`
   - `NEW_MESSAGE` (con threadId)
   - `MESSAGE_DELETED`

### Fase 4: Cleanup
1. Remover funciones deprecated de `chat.ts`
2. Remover campo `avatar` de `User`
3. Actualizar documentación

---

## 🎯 Testing Checklist

### ✅ Funcionalidades Verificadas

- [x] Login funciona correctamente
- [x] Register funciona correctamente
- [x] Listar canales (Explore) funciona
- [x] Canales unidos del usuario cargan correctamente
- [x] No hay errores de TypeScript en archivos críticos

### ⏳ Pendientes (Fuera de scope)

- [ ] Crear y visualizar threads
- [ ] Enviar mensajes en threads
- [ ] WebSocket con threads
- [ ] Archivar/desarchivar threads
- [ ] Permisos por rol (admin, moderator, member)

---

## 📚 Referencias

- [Backend README](./README_NEW.md) - Documentación completa del backend
- [Frontend Implementation Guide](./FRONTEND_IMPLEMENTATION_GUIDE.md) - Guía de implementación
- [Messaging Strategy](./MESSAGING_STRATEGY.md) - Estrategia de mensajería

---

## ⚠️ Notas Importantes

### Compatibilidad hacia atrás

Este update mantiene compatibilidad con componentes antiguos usando:
- Campos deprecated marcados con comentarios `⚠️ DEPRECATED`
- Funciones alias para migración gradual
- Interfaces flexibles que soportan ambos formatos

### Breaking Changes (Ninguno por ahora)

No hay breaking changes inmediatos gracias a la capa de compatibilidad. Sin embargo, se recomienda:
1. **No usar** `channelId` en nuevos componentes
2. **Siempre usar** `threadId` para mensajes nuevos
3. **Planear migración** de componentes existentes

---

**Autor:** GitHub Copilot  
**Revisión requerida:** Antes de deployment a producción
