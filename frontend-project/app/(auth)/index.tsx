import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const slides = [
    {
        id: 1,
        image: require('../../assets/images/image1_0.jpg'),
        heading: 'Welcome to Our Recipe App – A World of Healthy Meals',
        text: 'Discover a variety of nutritious and delicious recipes tailored for all lifestyles and preferences. Start your journey towards a healthier you today.',
    },
    {
        id: 2,
        image: require('../../assets/images/image1_0.jpg'),
        heading: 'Discover Nutritious Recipes – Crafted Just for You',
        text: 'Explore meals designed to suit your taste, lifestyle, and health needs. From breakfast to dinner, find recipes that are easy to cook and nutritious.',
    },
    {
        id: 3,
        image: require('../../assets/images/image2.jpg'),
        heading: 'Our Services – Helping You Live Healthier, One Meal at a Time',
        text: 'Use our app to plan meals, track ingredients, and save your favorite recipes. We make healthy eating easier, no matter your schedule.',
    },
    {
        id: 4,
        image: require('../../assets/images/preview.jpg'),
        heading: 'Complete Your Journey – You\'re Ready to Get Started!',
        text: '',
    }
];

export default function OnboardingScreen() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const renderSlide = ({ item }: { item: any }) => (
        <View
            style={[
                styles.slide,
                {
                    backgroundColor:
                        currentSlide === slides.length - 1 ? '#fdb15a' : '#ffffff',
                },
            ]}
        >
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.heading}>{item.heading}</Text>
                {item.text ? <Text style={styles.paragraph}>{item.text}</Text> : null}
            </View>

            {currentSlide !== slides.length - 1 ? (
                <>
                    <View style={styles.progressContainer}>
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepText}>Step</Text>
                            <Text style={styles.stepCount}>{`${currentSlide + 1} of ${slides.length}`}</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View
                                style={[styles.progress, { width: `${((currentSlide + 1) / slides.length) * 100}%` }]}
                            />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => setCurrentSlide(currentSlide + 1)} style={styles.bottomButton}>
                        <Ionicons name="arrow-forward-circle" size={32} color="white" />
                    </TouchableOpacity>
                </>
            ) : (
                <View style={styles.finalScreenContent}>
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        style={[styles.bottomButton, styles.finalLoginButton]}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.createAccountText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#fdb15a" />
            </View>
        );
    }

    return (
        <FlatList
            data={slides}
            renderItem={renderSlide}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            onMomentumScrollEnd={(event) => {
                const index = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
                setCurrentSlide(index);
            }}
        />
    );
}

const styles = StyleSheet.create({
    slide: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    imageContainer: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        borderWidth: 20,
        borderColor: '#fdb15a',
        overflow: 'hidden',
        marginBottom: 10,
        position: 'absolute',
        top: 100,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: width * 0.75,
        width: '80%',
        textTransform: 'capitalize',
        lineHeight: 10,
        marginBottom: 120,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 45,
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 25,
    },
    progressContainer: {
        position: 'absolute',
        bottom: 120,
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    progressBar: {
        height: 5,
        backgroundColor: '#ccc',
        width: '100%',
        marginTop: 10,
    },
    progress: {
        height: '100%',
        backgroundColor: '#fdb15a',
    },
    stepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    stepText: {
        color: '#333',
        fontSize: 16,
    },
    stepCount: {
        color: '#333',
        fontSize: 16,
    },
    bottomButton: {
        position: 'absolute',
        bottom: 30,
        backgroundColor: '#fdb15a',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        width: '80%',
    },
    finalScreenContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        width: '80%',
    },
    finalHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    finalLoginButton: {
        backgroundColor: 'white',
        width: '80%',
    },
    buttonText: {
        color: '#fdb15a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    createAccountText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 