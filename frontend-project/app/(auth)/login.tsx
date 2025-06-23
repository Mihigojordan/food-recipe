import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ImageBackground, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Checkbox } from 'react-native-paper';
import { login } from '../../Services/authService';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        console.log('Login button pressed'); // Debug log

        // Input validation
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log('Attempting login with:', { email });
            const response = await login(email, password);
            console.log('Login successful:', response);

            // Store the token
            if (response.token) {
                await AsyncStorage.setItem('userToken', response.token);
                console.log('Token stored successfully');
            }

            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'Welcome back!',
            });

            // Navigate to the home tab
            router.replace('/(app)');
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message);
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Toast />
                <ImageBackground
                    source={require('../../assets/images/banner.jpeg')}
                    style={styles.headerContainer}
                    resizeMode="cover"
                >
                    <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} style={styles.headerTextContainer}>
                        <Text style={styles.helloText}>Welcome Back</Text>
                        <Text style={styles.subText}>
                            Login to continue using the app.
                        </Text>
                    </Animated.View>
                </ImageBackground>

                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={styles.formContainer}>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={24} color="#fdb15a" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Email address"
                            style={styles.input}
                            placeholderTextColor="#000"
                            onChangeText={setEmail}
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={24} color="#fdb15a" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            placeholderTextColor="black"
                            secureTextEntry
                            onChangeText={setPassword}
                            value={password}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} style={styles.checkboxContainer}>
                        <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(!checked)}
                            color={checked ? '#fdb15a' : '#666'}
                        />
                        <Text style={styles.checkboxText}>Remember Me</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()}>
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    <Animated.View entering={FadeInDown.delay(1200).duration(1000).springify()}>
                        <Text style={styles.forgotPasswordLink} onPress={() => router.push('/forgot-password')}>
                            Forgot Password?
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1400).duration(1000).springify()} style={styles.signUpSection}>
                        <View style={styles.line} />
                        <Text style={styles.signUpText}>Or login with</Text>
                        <View style={styles.line} />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1600).duration(1000).springify()} style={styles.socialIcons}>
                        <TouchableOpacity style={styles.socialIcon}>
                            <FontAwesome name="google" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <FontAwesome name="apple" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <MaterialCommunityIcons name="facebook" size={24} color="white" />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1800).duration(1000).springify()}>
                        <Text style={styles.registerText}>
                            Don't have an account?{' '}
                            <Text style={styles.registerLink} onPress={() => router.push('/register')}>
                                Register
                            </Text>
                        </Text>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        width: '100%',
        height: height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    helloText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    subText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    formContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#fdb15a',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginTop: 15,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'flex-start',
        paddingLeft: 5,
    },
    checkboxText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    loginButton: {
        backgroundColor: '#fdb15a',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#fdb15a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordLink: {
        color: '#fdb15a',
        textAlign: 'center',
        marginBottom: 20,
        textDecorationLine: 'underline',
    },
    signUpSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    signUpText: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#666',
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 30,
    },
    socialIcon: {
        backgroundColor: 'black',
        borderRadius: 25,
        padding: 12,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#fdb15a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    registerText: {
        fontSize: 15,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    registerLink: {
        color: '#fdb15a',
        fontWeight: 'bold',
        textDecorationLine: 'none',
    },
    disabledButton: {
        opacity: 0.7,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
}); 