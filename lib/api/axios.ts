import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { storage } from "../storage";

const BASE_URL = process.env.EXPO_PUBLIC_BACK_URL || "http://localhost:3000";

if (!BASE_URL) {
    console.error("BASE_URL is not defined");
}

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await storage.getItem('session_token');
        if (token) {
            config.headers.Cookie = `better-auth.session_token=${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    async (response: AxiosResponse) => {
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            const cookieString = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;
            const match = cookieString.match(/better-auth\.session_token=([^;]+)/);
            if (match && match[1]) {
                await storage.setItem('session_token', match[1]);
            }
        }
        return response;
    },
    async (error: AxiosError) => {
        return Promise.reject(error);
    }
);

