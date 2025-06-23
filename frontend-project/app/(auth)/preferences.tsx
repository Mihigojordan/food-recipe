import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getPreferences, submitPreferences } from '../../Services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PreferencesScreen() {
    const [preferences, setPreferences] = useState<string[]>([]);
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            console.log('Loading preferences...');
            const availablePreferences = await getPreferences();
            console.log('Available preferences:', availablePreferences);
            setPreferences(availablePreferences);
        } catch (error) {
            console.error('Error loading preferences:', error);
            Alert.alert('Error', 'Failed to load preferences. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePreference = (preference: string) => {
        setSelectedPreferences(prev => {
            if (prev.includes(preference)) {
                return prev.filter(p => p !== preference);
            } else {
                if (prev.length >= 4) {
                    Alert.alert('Maximum Selection', 'You can only select up to 4 preferences.');
                    return prev;
                }
                return [...prev, preference];
            }
        });
    };

    const handleSubmit = async () => {
        if (selectedPreferences.length < 4) {
            Alert.alert('Selection Required', 'Please select at least 4 preferences.');
            return;
        }

        try {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                Alert.alert('Error', 'User data not found. Please try registering again.');
                return;
            }

            await submitPreferences(JSON.parse(userData), selectedPreferences);

            // Clear temporary user data after successful preference submission
            await AsyncStorage.removeItem('userData');

            Alert.alert(
                'Success',
                'Preferences saved successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(app)/dashboard')
                    }
                ]
            );
        } catch (error: any) {
            console.error('Error submitting preferences:', error);
            Alert.alert('Error', error.message || 'Failed to save preferences. Please try again.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading preferences...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={styles.headerContainer}>
                    <Text style={styles.title}>Select Your Preferences</Text>
                    <Text style={styles.subtitle}>Choose at least 4 cultural origins you're interested in</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={styles.preferencesContainer}>
                    {preferences.map((preference, index) => (
                        <TouchableOpacity
                            key={preference}
                            style={[
                                styles.preferenceButton,
                                selectedPreferences.includes(preference) && styles.selectedPreference
                            ]}
                            onPress={() => togglePreference(preference)}
                        >
                            <Text style={[
                                styles.preferenceText,
                                selectedPreferences.includes(preference) && styles.selectedPreferenceText
                            ]}>
                                {preference}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={styles.footerContainer}>
                    <Text style={styles.selectionCount}>
                        Selected: {selectedPreferences.length}/4
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            selectedPreferences.length < 4 && styles.disabledButton
                        ]}
                        onPress={handleSubmit}
                        disabled={selectedPreferences.length < 4}
                    >
                        <Text style={styles.submitButtonText}>Continue</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    headerContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    preferencesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    preferenceButton: {
        width: '48%',
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedPreference: {
        backgroundColor: '#fdb15a',
        borderColor: '#fdb15a',
    },
    preferenceText: {
        fontSize: 16,
        color: '#333',
    },
    selectedPreferenceText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    footerContainer: {
        marginTop: 'auto',
        paddingTop: 20,
    },
    selectionCount: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#fdb15a',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 