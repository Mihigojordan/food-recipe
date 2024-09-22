import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeList from '../screens/RecipeList'; // Create this component
import AddRecipe from '../screens/AddRecipe'; // Create this component for adding recipes
import SearchResults from '@/screens/SearchResults';

const Stack = createStackNavigator();

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  imageUrl: string; // Make sure this matches your backend response
}


const RecipeRouter = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="AllRecipes" component={RecipeList} />
      <Stack.Screen name="AddRecipe" component={AddRecipe} />
      <Stack.Screen name="SearchResults" component={SearchResults} options={{ title: 'Search Results' }} />
 
    </Stack.Navigator>
  );
};

export default RecipeRouter;
