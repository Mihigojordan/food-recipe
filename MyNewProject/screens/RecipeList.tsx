import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Share, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
  cookingTime: string;
}

const RecipeList = ({ navigation }: any) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://192.168.22.181:3000/api/recipes');
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

  const handleLike = (name: string) => {
    setLikedRecipes((prev) => {
      const newLikes = new Set(prev);
      if (newLikes.has(name)) {
        newLikes.delete(name);
      } else {
        newLikes.add(name);
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
    const isLiked = likedRecipes.has(item.name);
    return (
      <TouchableOpacity onPress={() => {
        setSelectedRecipe(item);
        setModalVisible(true);
      }}>
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.heartIcon} 
            onPress={() => handleLike(item.name)}
          >
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? "#ff6347" : "#000"} />
          </TouchableOpacity>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.image} 
          />
          <Text style={styles.recipeName}>{item.name}</Text>
          <View style={styles.cookingTimeContainer}>
            <Ionicons name="timer-outline" size={20} color="#666" />
            <Text style={styles.cookingTime}>{item.cookingTime}</Text> 
            <TouchableOpacity onPress={() => handleShare(item)} style={styles.shareIcon}>
              <Ionicons name="share-social-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderIngredientModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
          <Text style={styles.modalDescription}>{selectedRecipe.description}</Text>
          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>{ingredient}</Text>
          ))}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
          keyExtractor={(item, index) => index.toString()} // Using index as the key
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
      {renderIngredientModal()}
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
    width: 205,
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    padding: 10,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 8,
    backgroundColor: '#fff',
    borderBottomLeftRadius:10,
    padding: 5,
    marginRight:0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1, // Ensure the heart icon is on top of the image
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  cookingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight:80,
    justifyContent: 'center',
    marginTop:20,
  },
  cookingTime: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  shareIcon: {
    marginLeft: 0,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 2,
  },
});

export default RecipeList;
