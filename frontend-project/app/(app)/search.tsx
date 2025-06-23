import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Recipe } from '../../types';

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]); // This will be populated from your API

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        // TODO: Implement search logic here
        // For now, using mock data
        if (text.length > 2) {
            setRecipes([
                {
                    id: '1',
                    name: 'Pasta Carbonara',
                    description: 'Classic Italian pasta dish',
                    imageUrl: 'https://example.com/carbonara.jpg',
                    culturalOrigin: 'Italian',
                    tags: 'Pasta, Quick',
                    cookingTime: '20',
                    ingredients: ['Spaghetti', 'Eggs', 'Pecorino', 'Guanciale'],
                    balancedDiet: {
                        carbsPercentage: '50',
                        fatPercentage: '30',
                        proteinPercentage: '20'
                    },
                    totalCalories: '600',
                    dietCategories: {
                        energyGiving: 'High',
                        bodyBuilding: 'Medium',
                        bodyProtective: 'Low'
                    }
                },
                // Add more mock recipes as needed
            ]);
        } else {
            setRecipes([]);
        }
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => router.push(`/recipe/${item.id}`)}
        >
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.recipeImage}
            />
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{item.name}</Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>{item.cookingTime} min</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="flame-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>{item.totalCalories} cal</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setSearchQuery('');
                            setRecipes([]);
                        }}
                    >
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={recipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    searchQuery.length > 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recipes found</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        margin: 15,
        borderRadius: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    listContainer: {
        padding: 15,
    },
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recipeImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    recipeInfo: {
        flex: 1,
        padding: 10,
    },
    recipeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    recipeDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    recipeMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
}); 