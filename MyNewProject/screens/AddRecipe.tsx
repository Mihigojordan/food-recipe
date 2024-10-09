import React, { useState } from 'react';
import { View, Text, Image, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { AntDesign } from '@expo/vector-icons'; // Import icons
import { retriveRecipes } from '../Services/authService'; // Adjust the import path as needed

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
  const [loading, setLoading] = useState(false); // State for loading status
  const [buttonText, setButtonText] = useState("Generate Recipe"); // State for button text
  const navigation = useNavigation(); // Hook for navigation

  const handleGenerateRecipe = async () => {
    const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim());

    setLoading(true);
    setButtonText("Generating...");

    try {
      const data: Recipe[] = await retriveRecipes(ingredientArray); // Use the retriveRecipes function
      console.log('Fetched Recipes:', data); // Log the fetched data for debugging
      setRecipes(data); // Update the recipes state
      setButtonText("Recipe Generated");
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setButtonText("Generate Recipe");
    } finally {
      setLoading(false);
    }
  };

  // Render each recipe item
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })} // Pass the recipe to detail page
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeDescription}>{item.description}</Text>
        <View style={styles.cookingTimeContainer}>
          <Text style={styles.cookingTime}>{item.cookingTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients separated by commas"
        value={ingredients}
        onChangeText={text => {
          setIngredients(text);
          if (text) {
            setButtonText("Generate Recipe"); // Reset button text when typing
          }
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerateRecipe}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <Text style={styles.buttonText}>{buttonText}</Text>
        ) : (
          <>
            <Text style={styles.buttonText}>{buttonText}</Text>
            {buttonText === "Recipe Generated" && (
              <AntDesign name="checkcircle" size={20} color="#FF8C00" /> // Orange tick icon
            )}
          </>
        )}
      </TouchableOpacity>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item, index) => index.toString()} // Use index as the key extractor
        numColumns={2} // Display two cards per row
        columnWrapperStyle={styles.columnWrapper}
        style={styles.recipeList}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#d3d3d3', // Light gray border
    borderWidth: 1,
    borderRadius: 8, // Small radius
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF8C00', // Orange color
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeList: {
    marginTop: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Adjust width for two cards per row
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
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cookingTimeContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  cookingTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default RecipeScreen;
