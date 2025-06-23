import React, { useEffect, useState } from 'react'; // Ensure React is imported
import { Stack, SplashScreen } from 'expo-router'; // Redirect is not directly used here
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecipeProvider } from '../context/RecipeContext'; // Ensure RecipeProvider is imported

// Prevent the splash screen from auto-hiding until we've checked authentication status
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null means loading auth state
    const [isAppReady, setIsAppReady] = useState(false); // State to control when the app is ready to render

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                setIsLoggedIn(!!token); // Convert token presence to boolean
            } catch (error) {
                console.error('Failed to retrieve token:', error);
                setIsLoggedIn(false); // Assume not logged in on error
            } finally {
                setIsAppReady(true); // App is ready after auth check
                SplashScreen.hideAsync(); // Hide splash screen once ready
            }
        };

        checkLoginStatus();
    }, []); // Run only once on component mount

    // If the app is not yet ready (still checking auth status), return null to keep splash screen visible
    if (!isAppReady) {
        return null;
    }

    return (
        <RecipeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    // User is logged in, show app routes and make auth/onboarding routes redirect to app
                    <>
                        {/* Redirects auth and onboarding routes if already logged in */}
                        <Stack.Screen name="(auth)" redirect={true} />
                        <Stack.Screen name="onboarding" redirect={true} />
                        <Stack.Screen name="help" redirect={true} />

                        {/* Main app routes */}
                        <Stack.Screen name="(app)" />
                        <Stack.Screen
                            name="recipe/details"
                            options={{
                                presentation: 'modal',
                                headerShown: false,
                            }}
                        />
                    </>
                ) : (
                    // User is NOT logged in, show auth/onboarding routes and make app routes redirect to login
                    <>
                        {/* Auth and onboarding routes */}
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="onboarding" />

                        {/* Redirects app routes if not logged in */}
                        <Stack.Screen name="(app)" redirect={true} />
                        <Stack.Screen
                            name="recipe/details"
                            options={{
                                presentation: 'modal',
                                headerShown: false,
                            }}
                        />
                    </>
                )}
            </Stack>
        </RecipeProvider>
    );
}