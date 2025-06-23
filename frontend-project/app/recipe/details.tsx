import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRecipe } from '../../context/RecipeContext';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen() {
    const router = useRouter();
    const { selectedRecipe } = useRecipe();

    // console.log(`Selected Recipe balancedDiet: ${JSON.stringify(selectedRecipe?.balancedDiet)}`);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this amazing recipe: ${selectedRecipe?.name}! ${selectedRecipe?.description}`,
                title: selectedRecipe?.name,
            });
        } catch (error) {
            console.error('Error sharing recipe:', error);
        }
    };

    if (!selectedRecipe) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="restaurant-outline" size={80} color="#fdb15a" />
                <Text style={styles.loadingText}>No recipe selected</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Convert ingredients string to array
    const ingredientsList = ((selectedRecipe.ingredients as unknown) as string).split('\n');

    // Parse balancedDiet if it's a string
    const balancedDiet = typeof selectedRecipe.balancedDiet === 'string'
        ? JSON.parse(selectedRecipe.balancedDiet)
        : selectedRecipe.balancedDiet;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBackButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{selectedRecipe.name}</Text>
                <TouchableOpacity
                    style={styles.headerShareButton}
                    onPress={handleShare}
                >
                    <Ionicons name="share-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                <Image
                    source={{ uri: selectedRecipe.imageUrl }}
                    style={styles.recipeImage}
                />

                <View style={styles.content}>
                    <Text style={styles.title}>{selectedRecipe.name}</Text>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="time-outline" size={20} color="#fff" />
                            </View>
                            <Text style={styles.infoText}>{selectedRecipe.cookingTime} min</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="flame-outline" size={20} color="#fff" />
                            </View>
                            <Text style={styles.infoText}>{selectedRecipe.totalCalories} cal</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="restaurant-outline" size={20} color="#fff" />
                            </View>
                            <Text style={styles.infoText}>{selectedRecipe.culturalOrigin}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{selectedRecipe.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <View style={styles.ingredientsContainer}>
                            {ingredientsList.map((ingredient: string, index: number) => (
                                <View key={index} style={styles.ingredientItem}>
                                    <View style={styles.ingredientBullet} />
                                    <Text style={styles.ingredientText}>{ingredient}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nutritional Information</Text>
                        <View style={styles.nutritionContainer}>
                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionCircle, { backgroundColor: '#FF6B6B' }]}>
                                    <Text style={styles.nutritionValue}>
                                        {balancedDiet?.carbsPercentage || 'N/A'}
                                    </Text>
                                </View>
                                <Text style={styles.nutritionLabel}>Carbs</Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionCircle, { backgroundColor: '#4ECDC4' }]}>
                                    <Text style={styles.nutritionValue}>
                                        {balancedDiet?.proteinPercentage || 'N/A'}
                                    </Text>
                                </View>
                                <Text style={styles.nutritionLabel}>Proteins</Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionCircle, { backgroundColor: '#FFD93D' }]}>
                                    <Text style={styles.nutritionValue}>
                                        {balancedDiet?.fatPercentage || 'N/A'}
                                    </Text>
                                </View>
                                <Text style={styles.nutritionLabel}>Fats</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerShareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    scrollView: {
        flex: 1,
    },
    recipeImage: {
        width: width,
        height: 300,
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    infoItem: {
        alignItems: 'center',
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fdb15a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    infoText: {
        color: '#666',
        fontSize: 14,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    description: {
        color: '#666',
        lineHeight: 24,
        fontSize: 16,
    },
    ingredientsContainer: {
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        padding: 15,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ingredientBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fdb15a',
        marginRight: 10,
    },
    ingredientText: {
        color: '#666',
        fontSize: 16,
        flex: 1,
    },
    nutritionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    nutritionItem: {
        alignItems: 'center',
        flex: 1,
    },
    nutritionCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    nutritionValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    nutritionLabel: {
        color: '#666',
        fontSize: 14,
    },
    backButton: {
        backgroundColor: '#fdb15a',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginTop: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 