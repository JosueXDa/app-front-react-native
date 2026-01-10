/**
 * Resultado de la subida de un archivo
 */
export interface UploadResult {
    /** Clave única del archivo en R2 */
    fileKey: string;
    /** URL pública para acceder al archivo */
    publicUrl: string;
    /** Nombre original del archivo (sanitizado) */
    filename: string;
    /** Tipo MIME del archivo */
    contentType: string;
    /** Tamaño del archivo en bytes */
    size: number;
}

/**
 * Respuesta estándar de la API de uploads
 */
export interface UploadResponse<T = UploadResult> {
    success: boolean;
    data: T;
}

/**
 * Configuración de límites de un tipo de archivo
 */
export interface LimitConfig {
    maxSize: number;
    maxSizeMB: number;
    allowedTypes: string[];
}

/**
 * Información sobre límites de uploads
 */
export interface UploadLimits {
    limits: {
        image: LimitConfig;
        document: LimitConfig;
        profile: LimitConfig;
        attachment: LimitConfig;
    };
    maxFilesPerRequest: number;
}

/**
 * DTO para validación de archivos existentes
 */
export interface ValidateUploadDto {
    fileKey: string;
    publicUrl: string;
}
