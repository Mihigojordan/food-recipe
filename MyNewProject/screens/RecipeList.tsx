import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  imageUrl: string; // Ensure this matches your backend response
}

const RecipeList = ({ navigation }: any) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<number>>(new Set());

  // Fetch recipes from the backend
  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://192.168.1.64:3000/api/recipes');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data: Recipe[] = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch recipes. Please try again later.');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Handle like functionality
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

  // Handle share functionality
  const handleShare = async (item: Recipe) => {
    try {
      await Share.share({
        message: `Check out this recipe: ${item.name}\n${item.imageUrl}`,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    const isLiked = likedRecipes.has(item.id);
    return (
      <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
        <View style={styles.card}>
          <Image 
            source={{ uri: `http://192.168.1.64/react_native/clone/food-recipe/server/uploads/${item.imageUrl}` }} 
            style={styles.image} 
          />
          <View style={styles.details}>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleLike(item.id)}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? "#ff6347" : "#000"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleShare(item)}>
              <Ionicons name="share-social-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.recipeName}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Recipes</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('AddRecipe')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  grid: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  details: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 10,
  },
  recipeName: {
    fontSize: 16,
    flex: 1,
  },
});

export default RecipeList;
