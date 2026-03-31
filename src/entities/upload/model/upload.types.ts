export interface UploadResult {
  fileKey: string;
  publicUrl: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface UploadResponse<T = UploadResult> {
  success: boolean;
  data: T;
}

export interface LimitConfig {
  maxSize: number;
  maxSizeMB: number;
  allowedTypes: string[];
}

export interface UploadLimits {
  limits: {
    image: LimitConfig;
    document: LimitConfig;
    profile: LimitConfig;
    attachment: LimitConfig;
  };
  maxFilesPerRequest: number;
}

export interface ValidateUploadDto {
  fileKey: string;
  publicUrl: string;
}
