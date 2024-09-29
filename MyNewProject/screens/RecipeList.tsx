import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
}

const RecipeList = ({ navigation }: any) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<number>>(new Set());

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

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    const isLiked = likedRecipes.has(item.id);
    return (
      <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.heartIcon} 
            onPress={() => handleLike(item.id)}
          >
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? "#ff6347" : "#000"} />
          </TouchableOpacity>
          <Image 
            source={{ uri: `http://192.168.243.181:3000/uploads/${item.imageUrl}` }} 
            style={styles.image} 
          />
          <Text style={styles.recipeName}>{item.name}</Text>
          <View style={styles.cookingTimeContainer}>
          <Ionicons name="timer-outline" size={20} color="#666" />
          <Text style={styles.cookingTime}> 30 min</Text> 
            <TouchableOpacity onPress={() => handleShare(item)} style={styles.shareIcon}>
              <Ionicons name="share-social-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
           
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
      <View style={styles.cardContainer}>
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
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
  cardContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: 200, // Each card takes up nearly 50% to fit two in a row
    aspectRatio: 1, // Square card
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 5,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '60%', // Adjust image height
    resizeMode: 'cover',
  },
  recipeName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    marginTop:10,
    marginBottom:-5,
  },
  cookingTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop:15,
  },
  shareIcon: {
    marginLeft:95,
    marginTop:2,
  },
  cookingTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default RecipeList;
