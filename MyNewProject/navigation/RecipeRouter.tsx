import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeList from '../screens/RecipeList'; // Create this component
import AddRecipe from '../screens/AddRecipe'; // Create this component for adding recipes

const Stack = createStackNavigator();

const RecipeRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AllRecipes" component={RecipeList} />
      <Stack.Screen name="AddRecipe" component={AddRecipe} />
    </Stack.Navigator>
  );
};

export default RecipeRouter;
