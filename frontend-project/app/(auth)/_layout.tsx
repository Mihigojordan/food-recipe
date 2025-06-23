import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Add your auth screens here */}
            <Stack.Screen name="welcome" />
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="preferences" />
            {/* <Stack.Screen name="forgot-password" options={{ headerShown: false }} /> */}
        </Stack>
    );
} 