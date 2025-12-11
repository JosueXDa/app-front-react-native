import { axiosInstance } from "./axios";

export interface Channel {
    id: string;
    name: string;
    description?: string | null;
    isPrivate: boolean;
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
    const response = await axiosInstance.get<Channel>(`/api/chats/channels/${id}`);
    return response.data;
};

export const createChannel = async (data: CreateChannelDto): Promise<Channel> => {
    const response = await axiosInstance.post<Channel>("/api/chats/channels", data);
    return response.data;
};

export const updateChannel = async (id: string, data: UpdateChannelDto): Promise<Channel> => {
    const response = await axiosInstance.patch<Channel>(`/api/chats/channels/${id}`, data);
    return response.data;
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

export const joinChannel = async (channelId: string): Promise<ChannelMember> => {
    const response = await axiosInstance.post<ChannelMember>("/api/chats/members", { channelId });
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

// Message Interfaces
export interface Message {
    id: string;
    senderId: string;
    channelId: string;
    content: string;
    createdAt: string;
    sender?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

export interface CreateMessageDto {
    channelId: string;
    content: string;
}

// Message API Functions
export const getMessages = async (channelId: string): Promise<Message[]> => {
    const response = await axiosInstance.get<Message[]>(`/api/chats/messages/${channelId}`);
    return response.data;
};

export const createMessage = async (data: CreateMessageDto): Promise<Message> => {
    const response = await axiosInstance.post<Message>("/api/chats/messages", data);
    return response.data;
};
