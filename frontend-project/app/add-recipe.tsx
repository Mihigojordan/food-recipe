import React, { useState } from 'react';
import { View, Text, Image, FlatList, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { retriveRecipes } from '../Services/authService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipe } from '../context/RecipeContext';
import { Recipe } from '../types/index';

export default function AddRecipeScreen() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [ingredients, setIngredients] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Generate Recipe");
    const router = useRouter();
    const { setSelectedRecipe } = useRecipe();

    const handleGenerateRecipe = async () => {
        const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim()).filter(ingredient => ingredient.length > 0);

        if (ingredientArray.length === 0) {
            // Optional: show a warning if no ingredients are entered
            return;
        }

        setLoading(true);
        setButtonText("Generating...");

        try {
            const data: Recipe[] = await retriveRecipes(ingredientArray);
            console.log('Fetched Recipes:', data);
            setRecipes(data);
            setButtonText("Recipe Generated");
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setButtonText("Generate Recipe");
        } finally {
            setLoading(false);
        }
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                setSelectedRecipe(item);
                // Navigate to the details screen
                router.push('/recipe/details');
            }}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View>
                <Text style={styles.recipeName}>{item.name}</Text>
                {/* <Text style={styles.recipeDescription}>{item.description}</Text> // Description might be too long for card */}
                <View style={styles.cookingTimeContainer}>
                    <Text style={styles.cookingTime}>{item.cookingTime === 'N/A' ? 'N/A' : `${item.cookingTime} min`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.headerTitle}>Generate Recipes</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter ingredients separated by commas (e.g., chicken, rice, broccoli)"
                            placeholderTextColor="#a0a0a0"
                            value={ingredients}
                            onChangeText={text => {
                                setIngredients(text);
                                if (buttonText === "Recipe Generated" && text) {
                                    setButtonText("Generate Recipe");
                                }
                            }}
                            onSubmitEditing={handleGenerateRecipe}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleGenerateRecipe}
                            disabled={loading || ingredients.trim().length === 0}
                        >
                            {loading ? (
                                <Text style={styles.buttonText}>{buttonText}</Text>
                            ) : (
                                <>
                                    <Text style={styles.buttonText}>{buttonText}</Text>
                                    {buttonText === "Recipe Generated" && (
                                        <AntDesign name="checkcircleo" size={20} color="#fff" style={{ marginLeft: 10 }} />
                                    )}
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {recipes.length > 0 && (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.resultsTitle}>Generated Recipes:</Text>
                            <FlatList
                                data={recipes}
                                renderItem={renderRecipeItem}
                                keyExtractor={(item, index) => item.id || index.toString()}
                                numColumns={2}
                                columnWrapperStyle={styles.columnWrapper}
                                contentContainerStyle={styles.recipeListContent}
                                scrollEnabled={false}
                            />
                        </View>
                    )}

                    {recipes.length === 0 && !loading && (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="restaurant-outline" size={80} color="#d3d3d3" />
                            <Text style={styles.placeholderText}>
                                Enter ingredients above and tap 'Generate' to discover new recipes!
                            </Text>
                        </View>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9', // Light background for the whole screen
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 15, // Add padding here instead of the main container
        backgroundColor: '#f9f9f9',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 25,
        marginTop: 10, // Space from the top of the safe area
    },
    inputContainer: {
        backgroundColor: '#ffffff', // White background for the input section
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        height: 50, // Slightly taller input
        borderColor: '#fdb15a', // Theme color border
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15, // Space before the button
        fontSize: 16,
    },
    button: {
        backgroundColor: '#fdb15a', // Theme color button
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    recipeListContent: {
        // No top margin here, it's handled by resultsContainer padding
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: { // Existing card styles - kept as requested
        width: '48%',
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        padding: 10,
    },
    image: { // Existing image styles - kept
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    recipeName: { // Existing recipe name styles - kept
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 5,
    },
    recipeDescription: { // Existing description styles - commented out, likely too long
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    cookingTimeContainer: { // Existing cooking time container styles - kept
        marginTop: 10,
        alignItems: 'center',
    },
    cookingTime: { // Existing cooking time styles - kept
        fontSize: 12,
        color: '#666',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    placeholderText: {
        fontSize: 18,
        color: '#a0a0a0',
        textAlign: 'center',
        marginTop: 10,
    }
}); 