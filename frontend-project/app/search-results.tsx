import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const BASE_URL = 'http://192.168.22.181:3000/api';

const SearchResultsScreen: React.FC = () => {
    const { query } = useLocalSearchParams();
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            console.log('Search Query:', query);
            try {
                const response = await axios.post(`${BASE_URL}/Recipes`, {
                    query: query,
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setError('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchRecipes();
        } else {
            setError('Query parameter is required');
            setLoading(false);
        }
    }, [query]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.resultsContainer}>
            {searchResults.length > 0 ? (
                searchResults.map((recipe, index) => (
                    <View key={index} style={styles.recipeCard}>
                        <Text>{recipe.name}</Text>
                        <Text>{recipe.description}</Text>
                        <Text>{recipe.culturalOrigin}</Text>
                        <Text>{recipe.tags}</Text>
                        <Text>Ingredients: {recipe.ingredients.join(', ')}</Text>
                        <Text>Cooking Time: {recipe.cookingTime}</Text>
                    </View>
                ))
            ) : (
                <Text>No results found for your search.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultsContainer: {
        padding: 20,
    },
    recipeCard: {
        marginBottom: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default SearchResultsScreen; 