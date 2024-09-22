import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[] | null; // Ingredients should be an array of objects
  imageUrl: string;
}

const RecipeDetail = ({ route }: any) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  // Fetch the recipe details by ID
  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(`http://192.168.1.64:3000/api/recipes/${recipeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }
      const data: Recipe = await response.json();

      // Log the ingredients to confirm data structure
      console.log("Ingredients structure:", data.ingredients);

      // Check if ingredients are a string, and if so, parse them into an array
      if (typeof data.ingredients === 'string') {
        try {
          data.ingredients = JSON.parse(data.ingredients); // Parse the ingredients string
          console.log("Parsed ingredients:", data.ingredients);
        } catch (parseError) {
          console.error("Failed to parse ingredients", parseError);
          data.ingredients = null; // If parsing fails, set it to null
        }
      }

      // Ensure ingredients is an array before setting state
      if (Array.isArray(data.ingredients)) {
        setRecipe(data);
      } else {
        console.warn("Ingredients are not an array after parsing");
        setRecipe({ ...data, ingredients: null }); // Set to null if it's not an array
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch recipe details. Please try again later.');
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, []);

  const handleShare = async () => {
    if (recipe) {
      try {
        await Share.share({
          message: `Check out this recipe: ${recipe.name}\n${recipe.imageUrl}`,
        });
      } catch (error) {
        console.error('Error sharing recipe:', error);
      }
    }
  };

  if (!recipe) return null; // Show loading state or a spinner

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: `http://192.168.1.64/react_native/clone/food-recipe/server/uploads/${recipe.imageUrl}` }} 
        style={styles.banner} 
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        <Text style={styles.ingredientsTitle}>Ingredients:</Text>

        {/* Safely check if ingredients is an array */}
        {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientItem}>
              {`${ingredient.quantity} of ${ingredient.name}`}
            </Text>
          ))
        ) : (
          <Text>No ingredients available</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleShare} style={styles.button}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -30,
    flex: 1,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ingredientItem: {
    fontSize: 16,
    marginVertical: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default RecipeDetail;
