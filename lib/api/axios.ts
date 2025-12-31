import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BACK_URL || "http://localhost:3000";

if (!BASE_URL) {
    console.error("BASE_URL is not defined");
}

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * NOTA IMPORTANTE sobre interceptores:
 * 
 * Todos los archivos ahora se suben directamente al backend, que se encarga
 * de la subida a R2. No hay más subidas directas desde el frontend a R2.
 * 
 * Los interceptores para autorización son seguros de usar ya que todas las
 * peticiones van al backend. Las funciones de upload en lib/api/upload.ts
 * utilizan axiosInstance y requieren autenticación (cookies de sesión).
 * 
 * Ejemplo de interceptor:
 * 
 * axiosInstance.interceptors.request.use(async (config) => {
 *   const token = await storage.getItem('authToken');
 *   if (token) {
 *     config.headers.Authorization = `Bearer ${token}`;
 *   }
 *   return config;
 * });
 */

