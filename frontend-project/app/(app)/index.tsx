import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, Image, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu';
import { fetchProfileData, fetchRecipes } from '../../Services/authService';
import { useRouter } from 'expo-router';
import { useRecipe } from '../../context/RecipeContext';
import { Recipe } from '../../types/index';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Dashboard() {
    const [userData, setUserData] = useState<any>(null);
    const [greeting, setGreeting] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const router = useRouter();
    const { setSelectedRecipe } = useRecipe();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchProfileData();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        const fetchRecipesData = async () => {
            try {
                const data = await fetchRecipes();
                setRecipes(data);

                // console.log(`Recipes Data: ${JSON.stringify(data)}`);
            } catch (error) {
                console.error("Error fetching recipes: ", error);
                Alert.alert('Error', 'Could not fetch recipes. Please try again later.');
            }
        };

        const hour = new Date().getHours();
        setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

        fetchUserData();
        fetchRecipesData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Top Menu */}
            <TopMenu username={userData?.username || 'Guest'} greeting={greeting} />

            {/* Enhanced Banner Section */}
            <View style={styles.bannerContainer}>
                <LinearGradient
                    colors={['#fdb15a', '#ff9f43']}
                    style={styles.banner}
                >
                    <View style={styles.bannerContent}>
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTitle}>Discover Delicious Recipes</Text>
                            <Text style={styles.bannerSubtitle}>Find and cook amazing meals</Text>
                            <View style={styles.bannerButtons}>
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={() => router.push("recipes/list")}
                                >
                                    <Ionicons name="restaurant-outline" size={20} color="#000" />
                                    <Text style={styles.primaryButtonText}>Browse Recipes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={() => router.push("/add-recipe")}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                                    <Text style={styles.secondaryButtonText}>Create Recipe</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Image
                            source={require('../../assets/images/removed.png')}
                            style={styles.bannerImage}
                        />
                    </View>
                </LinearGradient>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="book-outline" size={24} color="#fdb15a" />
                        </View>
                        <Text style={styles.statValue}>{recipes.length}</Text>
                        <Text style={styles.statLabel}>Recipes</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="time-outline" size={24} color="#fdb15a" />
                        </View>
                        <Text style={styles.statValue}>30+</Text>
                        <Text style={styles.statLabel}>Minutes</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="heart-outline" size={24} color="#fdb15a" />
                        </View>
                        <Text style={styles.statValue}>100%</Text>
                        <Text style={styles.statLabel}>Tasty</Text>
                    </View>
                </View>
            </View>

            {/* Recommendations Section */}
            <Text style={styles.recommendationHeader}>Recommendations</Text>
            <Text style={styles.recommendationSubText}>Based on food you like</Text>

            <ScrollView>
                <View style={styles.recommendationList}>
                    {recipes.map((recipe, index) => (
                        <View key={index} style={styles.recommendationCard}>
                            <Image source={{ uri: recipe.imageUrl }} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{recipe.name}</Text>
                                <View style={styles.flexContainer}>
                                    <TouchableOpacity
                                        style={styles.watchButton}
                                        onPress={() => {
                                            setSelectedRecipe(recipe);
                                            router.push('/recipe/details');
                                        }}>
                                        <Ionicons name="play-circle-outline" size={20} color="#fff" />
                                        <Text style={styles.watchButtonText}>Watch</Text>
                                    </TouchableOpacity>
                                    <View style={styles.timeContainer}>
                                        <Ionicons name="time-outline" size={20} color="#fdb15a" />
                                        <Text style={styles.cookingTime}>
                                            {recipe.cookingTime === 'N/A' ? 'N/A' : `${recipe.cookingTime} min`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf9fb',
    },
    bannerContainer: {
        marginBottom: 5,
    },
    banner: {
        padding: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bannerTextContainer: {
        flex: 1,
        paddingRight: 20,
    },
    bannerTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 3,
    },
    bannerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 10,
    },
    bannerButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    primaryButtonText: {
        color: '#fdb15a',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    secondaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    bannerImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: -18,
        borderRadius: 15,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#fff5e6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#eee',
        marginHorizontal: 10,
    },
    recommendationHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20,
        color: '#fdb15a',
    },
    recommendationSubText: {
        color: '#444',
        marginHorizontal: 20,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    recommendationList: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    recommendationCard: {
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    flexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    watchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fdb15a',
        padding: 10,
        width: 130,
        borderRadius: 25,
        justifyContent: 'center',
    },
    watchButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: '600',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cookingTime: {
        color: '#fdb15a',
        marginLeft: 5,
        fontWeight: '500',
    },
}); 