import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable } from 'react-native';
import { authClient } from '../../lib/auth-client';

export const GoogleLoginButton = () => {

    const handleGoogleLogin = async () => {
        try {
            // El plugin expoClient de Better Auth maneja automáticamente
            // la conversión de la URL de callback a deep link
            const { data, error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "http://localhost:8081/login", // Se convertirá automáticamente a appfrontnativemessages://
            });

            if (error) {
                Alert.alert("Error", error.message || "No se pudo iniciar sesión con Google");
            }
            
            // El plugin maneja automáticamente el flujo OAuth
            // incluyendo la apertura del navegador y el callback
        } catch (e: any) {
            console.error("GitHub login error:", e);
            Alert.alert("Error", e.message || "No se pudo iniciar sesión");
        }
    };

    return (
        <Pressable
            onPress={handleGoogleLogin}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex-1 items-center"
        >
            <Ionicons name="logo-google" size={24} color="#ffff" />
        </Pressable>
    );
};
