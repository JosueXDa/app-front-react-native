import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: process.env.EXPO_PUBLIC_BACK_URL,
    storage: {
        getItem: async (key: string) => {
            return await SecureStore.getItemAsync(key);
        },
        setItem: async (key: string, value: string) => {
            await SecureStore.setItemAsync(key, value);
        },
        removeItem: async (key: string) => {
            await SecureStore.deleteItemAsync(key);
        },
    },
});
