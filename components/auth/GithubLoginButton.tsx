import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Pressable } from 'react-native';
import { authClient } from '../../lib/auth-client';

WebBrowser.maybeCompleteAuthSession();

export const GithubLoginButton = () => {
    const handleGithubLogin = async () => {
        try {
            // 1. Definimos a dónde debe volver la app después del login
            // Esto genera algo como "exp://192.168.1.5:8081" en desarrollo
            const callbackURL = Linking.createURL('/');

            // 2. Usamos el cliente para iniciar el proceso
            // El cliente se encarga de generar la URL correcta del backend
            const { data, error } = await authClient.signIn.social({
                provider: "github",
                callbackURL: callbackURL,
            });

            // 3. Abrimos el navegador del sistema con la URL que nos dio Better Auth
            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    callbackURL
                );

                if (result.type === 'success') {
                    // El usuario volvió exitosamente. 
                    // Recargamos la sesión para obtener los datos del usuario
                    await authClient.getSession();
                    console.log("Login exitoso");
                }
            } else if (error) {
                Alert.alert("Error", error.message);
            }

        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo iniciar sesión");
        }
    };

    return (
        <Pressable
            onPress={handleGithubLogin}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex-1 items-center"
        >
            <Ionicons name="logo-github" size={24} color="#ffff" />
        </Pressable>
    );
};
