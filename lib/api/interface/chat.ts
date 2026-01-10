/**
 * Tipo de attachment basado en el MIME type
 */
export type AttachmentType = 'image' | 'document' | 'video' | 'audio';

// ============ Channel Interfaces ============

export interface Channel {
    id: string;
    name: string;
    description?: string | null;
    isPrivate: boolean;
    imageUrl?: string | null;
    bannerUrl?: string | null;
    category?: string;
    ownerId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChannelMember {
    id: string;
    channelId: string;
    userId: string;
    joinedAt: string;
    role?: string; // Assuming role might be added later or exists
}

export interface CreateChannelDto {
    name: string;
    description?: string | null;
    isPrivate?: boolean;
    imageUrl?: string | null;
    bannerUrl?: string | null;
    category?: string;
    memberIds?: string[];
    ownerId?: string;
}

export interface UpdateChannelDto {
    name?: string;
    description?: string | null;
    isPrivate?: boolean;
    imageUrl?: string | null;
    bannerUrl?: string | null;
    category?: string;
}

// Channel Endpoints

export interface PaginatedChannelsResponse {
    data: { channel: Channel }[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Thread Interfaces
export interface Thread {
    id: string;
    channelId: string;
    name: string;
    description?: string | null;
    createdBy: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateThreadDto {
    channelId: string;
    name: string;
    description?: string;
}

export interface UpdateThreadDto {
    name?: string;
    description?: string;
    isArchived?: boolean;
}

// Message Interfaces

/**
 * Estructura de un attachment de mensaje
 */
export interface MessageAttachment {
    /** UUID único del attachment */
    id: string;
    /** URL pública del archivo */
    url: string;
    /** Nombre original del archivo */
    filename: string;
    /** Tipo MIME (image/png, application/pdf, etc.) */
    mimeType: string;
    /** Tamaño en bytes */
    size: number;
    /** Categoría para renderizado */
    type: AttachmentType;
}

export interface UserProfile {
    displayName: string;
    avatarUrl: string | null;
}

export interface MessageSender {
    id: string;
    name: string;
    profile: UserProfile;
}

/**
 * Mensaje con información del remitente (usado en GET y WebSocket)
 */
export interface Message {
    id: string;
    senderId: string;
    threadId: string;
    content: string;
    attachments: MessageAttachment[] | null;
    createdAt: string;
    sender: MessageSender;
    // ⚠️ DEPRECATED: Kept for backward compatibility
    channelId?: string;
}

/**
 * DTO para crear un mensaje nuevo
 */
export interface CreateMessageDto {
    threadId?: string; // Changed from channelId to threadId
    content: string;
    attachments?: MessageAttachment[];
    // ⚠️ DEPRECATED: Use 'threadId' instead. Kept for backward compatibility
    channelId?: string;
}
