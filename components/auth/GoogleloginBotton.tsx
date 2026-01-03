import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { authClient } from '../../lib/auth-client';

export const GoogleLoginButton = () => {
    const [loading, setLoading] = useState(false);
    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            // El plugin expoClient de Better Auth maneja automáticamente
            // la conversión de la URL de callback a deep link
            const { data, error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "http://localhost:8081/(app)", // Se convertirá automáticamente a appfrontnativemessages://
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
            disabled={loading}
            className={`bg-background-50 border border-outline-200 p-4 rounded-xl flex-1 items-center ${loading ? 'opacity-70' : 'active:bg-background-100'}`}
        >
            <Ionicons name="logo-google" size={24} color="#ffff" />
        </Pressable>
    );
};
