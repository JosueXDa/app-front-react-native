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
