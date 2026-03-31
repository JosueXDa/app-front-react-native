import { axiosInstance } from '@/src/shared/api';
import {
    UploadLimits,
    UploadResponse,
    UploadResult,
    ValidateUploadDto,
} from '../model/upload.types';

const uploadFile = async (
  endpoint: string,
  fileUri: string,
  filename: string,
  contentType: string,
): Promise<UploadResult> => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, filename);

    const uploadResponse = await axiosInstance.post<UploadResponse>(
      `/api/uploads${endpoint}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return uploadResponse.data.data as UploadResult;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('Upload failed');
  }
};

const uploadMultipleFiles = async (
  endpoint: string,
  files: { uri: string; name: string; type: string }[],
): Promise<UploadResult[]> => {
  try {
    const formData = new FormData();

    for (const file of files) {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      formData.append('files', blob, file.name);
    }

    const uploadResponse = await axiosInstance.post<UploadResponse<UploadResult[]>>(
      `/api/uploads${endpoint}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return uploadResponse.data.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('Upload failed');
  }
};

export const uploadProfileAvatar = (fileUri: string, filename: string, contentType: string) =>
  uploadFile('/profile/avatar', fileUri, filename, contentType);

export const uploadUserAvatar = uploadProfileAvatar;

export const uploadProfileBanner = (fileUri: string, filename: string, contentType: string) =>
  uploadFile('/profile/banner', fileUri, filename, contentType);

export const uploadUserBanner = uploadProfileBanner;

export const uploadChannelIcon = (fileUri: string, filename: string, contentType: string) =>
  uploadFile('/channel/icon', fileUri, filename, contentType);

export const uploadChannelBanner = (fileUri: string, filename: string, contentType: string) =>
  uploadFile('/channel/banner', fileUri, filename, contentType);

export const uploadMessageImage = (fileUri: string, filename: string, contentType: string) =>
  uploadFile('/message/image', fileUri, filename, contentType);

export const uploadMessageAttachment = (
  fileUri: string,
  filename: string,
  contentType: string,
) => uploadFile('/message/attachment', fileUri, filename, contentType);

export const uploadMessageVideo = (fileUri: string, filename: string, contentType: string) =>
  uploadFile('/message/video', fileUri, filename, contentType);

export const uploadMessageAudio = (fileUri: string, filename: string, contentType: string) =>
  uploadFile('/message/audio', fileUri, filename, contentType);

export const uploadMessageImages = (files: { uri: string; name: string; type: string }[]) =>
  uploadMultipleFiles('/message/images', files);

export const uploadMessageAttachments = (
  files: { uri: string; name: string; type: string }[],
) => uploadMultipleFiles('/message/attachments', files);

export const uploadMessageVideos = (files: { uri: string; name: string; type: string }[]) =>
  uploadMultipleFiles('/message/videos', files);

export const uploadMessageAudios = (files: { uri: string; name: string; type: string }[]) =>
  uploadMultipleFiles('/message/audios', files);

export const getUploadLimits = async (): Promise<UploadLimits> => {
  const response = await axiosInstance.get<UploadLimits>('/api/uploads/info');
  return response.data;
};

export const validateUpload = async (
  data: ValidateUploadDto,
): Promise<{ valid: boolean }> => {
  const response = await axiosInstance.post<{ valid: boolean }>('/api/uploads/validate', data);
  return response.data;
};
