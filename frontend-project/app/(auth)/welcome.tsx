import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter

const WelcomeScreen = () => {
    const router = useRouter(); // Initialize useRouter

    return (
        <ImageBackground
            source={require('../../assets/images/banner.jpeg')} // Adjust path
            style={styles.background}
        >
            <View style={styles.overlay} />
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to
                    Recipe App</Text>
                <Text style={styles.subtitle}>Your journey to delicious and healthy food starts here.</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/onboarding')} // Updated navigation path
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

// ... existing styles ...

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#fdb15a',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen; 