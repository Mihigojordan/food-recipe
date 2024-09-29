import React, { useState } from 'react';
import { View, Text, Button, Image, FlatList, TextInput, StyleSheet } from 'react-native';

// Define the Recipe interface
interface Recipe {
  name: string;
  imageUrl: string;
  description: string;
  culturalOrigin: string;
  tags: string;
  cookingTime: string;
  ingredients: string[];
}

const RecipeScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // State for recipes
  const [ingredients, setIngredients] = useState(""); // State for ingredient input

  const handleGenerateRecipe = async () => {
    const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim());
    
    try {
      const response = await fetch('http://192.168.1.67:3000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredientArray,
        }),
      });

      const data: Recipe[] = await response.json(); // Specify the type of the fetched data
      setRecipes(data); // Update the recipes state with the fetched data
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  // Render each recipe item
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <Text style={styles.recipeName}>{item.name}</Text>
      <Text style={styles.recipeDescription}>{item.description}</Text>
      <Text style={styles.recipeOrigin}>Origin: {item.culturalOrigin}</Text>
      <Text style={styles.recipeTags}>Tags: {item.tags}</Text>
      <Text style={styles.recipeCookingTime}>Cooking Time: {item.cookingTime}</Text>
      <Text style={styles.recipeIngredients}>Ingredients:</Text>
      {item.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredient}>
          - {ingredient}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients separated by commas"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <Button title="Generate Recipe" onPress={handleGenerateRecipe} />
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.name}
        style={styles.recipeList}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  recipeList: {
    marginTop: 20,
  },
  recipeCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
  recipeOrigin: {
    fontSize: 12,
    color: '#999',
  },
  recipeTags: {
    fontSize: 12,
    color: '#999',
  },
  recipeCookingTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  recipeIngredients: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  ingredient: {
    fontSize: 12,
    color: '#555',
  },
});

export default RecipeScreen;
