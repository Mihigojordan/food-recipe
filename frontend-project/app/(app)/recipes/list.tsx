import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Share, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, Layout, RotateInDownLeft } from 'react-native-reanimated'; // Import Animated and Layout

// Assuming Recipe interface is imported from types/index.ts
import { Recipe } from '../../../types/index';
// Import the context hook and necessary functions/types
import { useRecipe, DayPlan } from '../../../context/RecipeContext';
import { fetchRecipes } from '../../../Services/authService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2; // Adjust for padding and spacing

export default function RecipeListScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [likedRecipes, setLikedRecipes] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    // Destructure the necessary state and function from the context
    const { setSelectedRecipe, mealPlanTargetDay, mealPlanTargetMealType } = useRecipe();

    React.useEffect(() => {
        console.log('RecipeList mounted. Meal plan target:', { mealPlanTargetDay, mealPlanTargetMealType });
        return () => {
            console.log('RecipeList unmounted');
        };
    }, [mealPlanTargetDay, mealPlanTargetMealType]); // Add dependencies to log target changes

    useEffect(() => {
        console.log('Recipes tab useEffect running');
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        console.log('Attempting to fetch recipes...');
        try {
            setLoading(true);
            const data = await fetchRecipes();
            // console.log('Recipes fetched successfully:', data.length, 'items');
            setRecipes(data);
        } catch (error) {
            console.error('Error loading recipes:', error);
            Alert.alert('Error', 'Could not fetch recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = (id: number) => {
        setLikedRecipes((prev) => {
            const newLikes = new Set(prev);
            if (newLikes.has(id)) {
                newLikes.delete(id);
            } else {
                newLikes.add(id);
            }
            return newLikes;
        });
    };

    const handleShare = async (item: Recipe) => {
        try {
            await Share.share({
                message: `Check out this recipe: ${item.name}\n${item.imageUrl}`,
            });
        } catch (error) {
            console.error('Error sharing recipe:', error);
        }
    };

    const handleRecipePress = (recipe: Recipe) => {
        if (params.returnTo === 'weekly-plan') {
            // Set the selected recipe in the context directly
            setSelectedRecipe(recipe);

            // Get the start of the current week (Monday)
            const today = new Date();
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
            const monday = new Date(today.setDate(diff));
            const weekStart = monday.toISOString().split('T')[0];
            console.log('RecipeList: Navigating to weekly-plan with params (recipe via context):', {
                day: params.day,
                mealType: params.mealType,
                weekStartDate: weekStart
            });

            router.replace({
                pathname: '/weekly-plan',
                params: {
                    day: params.day,
                    mealType: params.mealType,
                    weekStartDate: weekStart
                }
            });
        } else {
            // Navigate to recipe details
            router.push(`/(app)/recipe/${recipe.id}`);
        }
    };

    const renderRecipeCard = ({ item, index }: { item: Recipe, index: number }) => {
        const isLiked = likedRecipes.has(Number(item.id));
        const isFromWeeklyPlan = params.returnTo === 'weekly-plan';

        return (
            <Animated.View
                entering={FadeIn.delay(index * 50)}
                layout={Layout.delay(100)}
                style={styles.card}
            >
                <TouchableOpacity onPress={() => handleRecipePress(item)}>
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.image}
                    />
                    <TouchableOpacity
                        style={styles.heartIcon}
                        onPress={() => handleLike(Number(item.id))}
                    >
                        <Animated.View
                            key={isLiked ? 'liked' : 'unliked'}
                            entering={isLiked ? RotateInDownLeft : undefined}
                        >
                            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? "#ff6347" : "#666"} />
                        </Animated.View>
                    </TouchableOpacity>

                    <View style={styles.textContainer}>
                        <Text style={styles.recipeName}>{item.name}</Text>
                        <View style={styles.cookingTimeContainer}>
                            <Ionicons name="timer-outline" size={18} color="#fdb15a" />
                            <Text style={styles.cookingTime}>{item.cookingTime === 'N/A' ? 'N/A' : `${item.cookingTime} min`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {isFromWeeklyPlan ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.chooseButton]}
                        onPress={() => handleRecipePress(item)}
                    >
                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Choose Recipe</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.shareButton]}
                        onPress={() => handleShare(item)}
                    >
                        <Ionicons name="share-social-outline" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {mealPlanTargetDay && mealPlanTargetMealType
                        ? `Choose Recipe for ${mealPlanTargetDay} ${mealPlanTargetMealType}`
                        : 'All Recipes'}
                </Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/add-recipe')}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>

            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fdb15a" />
                    <Text style={styles.loadingText}>Loading recipes...</Text>
                </View>
            ) : recipes.length > 0 ? (
                <FlatList
                    data={recipes}
                    renderItem={renderRecipeCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>No recipes found.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#faf9fb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',

    },
    addButton: {
        backgroundColor: '#fdb15a',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
    },
    listContent: {
        paddingHorizontal: 5,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        elevation: 8,
        shadowColor: '#fdb15a', // Theme-aligned shadow
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: CARD_WIDTH * 0.8, // Adjusted image height
        resizeMode: 'cover',
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 18,
        padding: 4,
        zIndex: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textContainer: {
        padding: 10,
    },
    recipeName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cookingTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    cookingTime: {
        fontSize: 14,
        color: '#555',
        marginLeft: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 5,
        marginHorizontal: 10,
    },
    chooseButton: {
        backgroundColor: '#28a745', // Green for Choose
    },
    shareButton: {
        backgroundColor: '#fdb15a', // Orange for Share
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
}); 