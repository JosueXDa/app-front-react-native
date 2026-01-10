import { axiosInstance } from "./axios";
import {
    LimitConfig,
    UploadLimits,
    UploadResponse,
    UploadResult,
    ValidateUploadDto
} from "./interface/upload";

export * from "./interface/upload";


/**
 * Sube un archivo individual al backend
 * El backend se encarga de la subida a R2
 */
const uploadFile = async (
    endpoint: string,
    fileUri: string,
    filename: string,
    contentType: string
): Promise<UploadResult> => {
    try {
        // Obtener el archivo como blob
        const response = await fetch(fileUri);
        const blob = await response.blob();

        // Crear FormData
        const formData = new FormData();
        formData.append('file', blob, filename);

        // Enviar al backend usando axiosInstance para incluir cookies de autenticación
        const uploadResponse = await axiosInstance.post<UploadResponse>(
            `/api/uploads${endpoint}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
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

/**
 * Sube múltiples archivos al backend
 */
const uploadMultipleFiles = async (
    endpoint: string,
    files: { uri: string; name: string; type: string }[]
): Promise<UploadResult[]> => {
    try {
        const formData = new FormData();

        // Agregar todos los archivos al FormData
        for (const file of files) {
            const response = await fetch(file.uri);
            const blob = await response.blob();
            formData.append('files', blob, file.name);
        }

        // Enviar al backend
        const uploadResponse = await axiosInstance.post<UploadResponse<UploadResult[]>>(
            `/api/uploads${endpoint}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
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

// ============ Funciones específicas por tipo de upload ============

/**
 * Sube un avatar de perfil
 * Límite: 5MB, tipos: jpeg, png, webp, gif
 */
export const uploadProfileAvatar = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/profile/avatar', fileUri, filename, contentType);

/**
 * Alias para uploadProfileAvatar (compatibilidad)
 */
export const uploadUserAvatar = uploadProfileAvatar;

/**
 * Sube un banner de perfil
 * Límite: 5MB, tipos: jpeg, png, webp, gif
 */
export const uploadProfileBanner = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/profile/banner', fileUri, filename, contentType);

/**
 * Alias para uploadProfileBanner (compatibilidad)
 */
export const uploadUserBanner = uploadProfileBanner;

/**
 * Sube un icono de canal
 * Límite: 5MB, tipos: jpeg, png, webp, gif
 */
export const uploadChannelIcon = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/channel/icon', fileUri, filename, contentType);

/**
 * Sube un banner de canal
 * Límite: 5MB, tipos: jpeg, png, webp, gif
 */
export const uploadChannelBanner = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/channel/banner', fileUri, filename, contentType);

/**
 * Sube una imagen de mensaje
 * Límite: 10MB, tipos: jpeg, png, webp, gif
 */
export const uploadMessageImage = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/message/image', fileUri, filename, contentType);

/**
 * Sube un adjunto de mensaje
 * Límite: 25MB, tipos: imágenes, pdf, docx, doc, txt, csv
 */
export const uploadMessageAttachment = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/message/attachment', fileUri, filename, contentType);

export const uploadMessageVideo = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/message/video', fileUri, filename, contentType);

/**
 * Sube un audio de mensaje
 * Límite: 25MB, tipos: mp3, wav, ogg, m4a, etc.
 */
export const uploadMessageAudio = (fileUri: string, filename: string, contentType: string) =>
    uploadFile('/message/audio', fileUri, filename, contentType);

/**
 * Sube múltiples imágenes de mensaje
 * Límite: Hasta 10 imágenes de 10MB cada una
 */
export const uploadMessageImages = (files: { uri: string; name: string; type: string }[]) =>
    uploadMultipleFiles('/message/images', files);

/**
 * Sube múltiples adjuntos de mensaje
 * Límite: Hasta 10 archivos de 25MB cada uno
 */
export const uploadMessageAttachments = (files: { uri: string; name: string; type: string }[]) =>
    uploadMultipleFiles('/message/attachments', files);

export const uploadMessageVideos = (files: { uri: string; name: string; type: string }[]) =>
    uploadMultipleFiles('/message/videos', files);

/**
 * Sube múltiples audios de mensaje
 * Límite: Hasta 5 audios de 25MB cada uno
 */
export const uploadMessageAudios = (files: { uri: string; name: string; type: string }[]) =>
    uploadMultipleFiles('/message/audios', files);

// ============ Utilidades ============

/**
 * Obtiene información sobre los límites de subida
 */
export const getUploadLimits = async (): Promise<UploadLimits> => {
    const response = await axiosInstance.get<UploadLimits>('/api/uploads/info');
    return response.data;
};

/**
 * Valida si un archivo existe en R2
 */
export const validateUpload = async (data: ValidateUploadDto): Promise<{ valid: boolean }> => {
    const response = await axiosInstance.post<{ valid: boolean }>('/api/uploads/validate', data);
    return response.data;
};
