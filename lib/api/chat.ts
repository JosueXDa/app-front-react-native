import { axiosInstance } from "./axios";

export interface Channel {
    id: string;
    name: string;
    description?: string | null;
    isPrivate: boolean;
    imageUrl?: string | null;
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
    category?: string;
    memberIds?: string[];
    ownerId?: string;
}

export interface UpdateChannelDto {
    name?: string;
    description?: string | null;
    isPrivate?: boolean;
    imageUrl?: string | null;
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

export const getChannels = async (page: number = 1, limit: number = 10): Promise<PaginatedChannelsResponse> => {
    const response = await axiosInstance.get<PaginatedChannelsResponse>(`/api/chats/channels?page=${page}&limit=${limit}`);
    return response.data;
};

export const getUserChannels = async (): Promise<Channel[]> => {
    const response = await axiosInstance.get<Channel[]>("/api/chats/members/joined");
    return response.data;
};

export const getChannelById = async (id: string): Promise<Channel> => {
    const response = await axiosInstance.get<{ channel: Channel }>(`/api/chats/channels/${id}`);
    return response.data.channel;
};

export const createChannel = async (data: CreateChannelDto): Promise<Channel> => {
    const response = await axiosInstance.post<{ channel: Channel }>("/api/chats/channels", data);
    return response.data.channel;
};

export const updateChannel = async (id: string, data: UpdateChannelDto): Promise<Channel> => {
    const response = await axiosInstance.patch<{ channel: Channel }>(`/api/chats/channels/${id}`, data);
    return response.data.channel;
};

export const deleteChannel = async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(`/api/chats/channels/${id}`);
    return response.data;
};

// Member Endpoints

export const getChannelMembers = async (channelId: string): Promise<ChannelMember[]> => {
    const response = await axiosInstance.get<ChannelMember[]>(`/api/chats/members/${channelId}`);
    return response.data;
};

export const getMemberRole = async (channelId: string, userId: string): Promise<string> => {
    const response = await axiosInstance.get<{ role: string }>(`/api/chats/members/${channelId}/role/${userId}`);
    return response.data.role;
};

export const joinChannel = async (channelId: string, userId?: string, role: string = 'member'): Promise<ChannelMember> => {
    const response = await axiosInstance.post<ChannelMember>("/api/chats/members", { 
        channelId, 
        userId,
        role 
    });
    return response.data;
};

export const updateMemberRole = async (channelId: string, userId: string, role: string): Promise<void> => {
    await axiosInstance.patch(`/api/chats/members/${channelId}/${userId}/role`, { role });
};

export const removeMember = async (channelId: string, userId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(`/api/chats/members/${channelId}/${userId}`);
    return response.data;
};

export const leaveChannel = async (channelId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(`/api/chats/members/${channelId}`);
    return response.data;
};

export const isJoined = async (channelId: string): Promise<boolean> => {
    const response = await axiosInstance.get<{ isJoined: boolean }>(`/api/chats/members/is-joined/${channelId}`);
    return response.data.isJoined;
};

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

// Thread API Functions
export const getThreadsByChannel = async (channelId: string): Promise<Thread[]> => {
    const response = await axiosInstance.get<Thread[]>(`/api/chats/threads/channel/${channelId}`);
    return response.data;
};

export const getActiveThreadsByChannel = async (channelId: string): Promise<Thread[]> => {
    const response = await axiosInstance.get<Thread[]>(`/api/chats/threads/channel/${channelId}/active`);
    return response.data;
};

export const getThreadById = async (threadId: string): Promise<Thread> => {
    const response = await axiosInstance.get<Thread>(`/api/chats/threads/${threadId}`);
    return response.data;
};

export const createThread = async (data: CreateThreadDto): Promise<Thread> => {
    const response = await axiosInstance.post<Thread>("/api/chats/threads", data);
    return response.data;
};

export const updateThread = async (threadId: string, data: UpdateThreadDto): Promise<Thread> => {
    const response = await axiosInstance.patch<Thread>(`/api/chats/threads/${threadId}`, data);
    return response.data;
};

export const archiveThread = async (threadId: string): Promise<Thread> => {
    const response = await axiosInstance.post<Thread>(`/api/chats/threads/${threadId}/archive`);
    return response.data;
};

export const unarchiveThread = async (threadId: string): Promise<Thread> => {
    const response = await axiosInstance.post<Thread>(`/api/chats/threads/${threadId}/unarchive`);
    return response.data;
};

export const deleteThread = async (threadId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(`/api/chats/threads/${threadId}`);
    return response.data;
};

// Message Interfaces
export interface Message {
    id: string;
    senderId: string;
    threadId?: string; // Changed from channelId to threadId
    content: string;
    createdAt: string;
    // ⚠️ DEPRECATED: Use 'threadId' instead. Kept for backward compatibility
    channelId?: string;
    sender?: {
        id: string;
        name: string;
        image?: string | null; // Changed from avatar to image
        // ⚠️ DEPRECATED: Use 'image' instead. Kept for backward compatibility
        avatar?: string;
    };
}

export interface CreateMessageDto {
    threadId?: string; // Changed from channelId to threadId
    content: string;
    // ⚠️ DEPRECATED: Use 'threadId' instead. Kept for backward compatibility
    channelId?: string;
}

// Message API Functions
export const getMessagesByThread = async (threadId: string, limit: number = 50, offset: number = 0): Promise<Message[]> => {
    const response = await axiosInstance.get<Message[]>(`/api/chats/messages/thread/${threadId}?limit=${limit}&offset=${offset}`);
    return response.data;
};

export const createMessage = async (data: CreateMessageDto): Promise<Message> => {
    // ⚠️ Backward compatibility: convert channelId to threadId if needed
    const threadId = data.threadId || data.channelId;
    if (!threadId) {
        throw new Error('Either threadId or channelId must be provided');
    }
    const payload = {
        threadId,
        content: data.content
    };
    const response = await axiosInstance.post<Message>("/api/chats/messages", payload);
    return response.data;
};

export const deleteMessage = async (messageId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(`/api/chats/messages/${messageId}`);
    return response.data;
};

// ⚠️ DEPRECATED: Use getMessagesByThread instead
// This is kept for backward compatibility with old components
// TODO: Remove this when all components are migrated to use threads
export const getMessages = getMessagesByThread;
