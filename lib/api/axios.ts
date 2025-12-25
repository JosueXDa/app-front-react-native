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


