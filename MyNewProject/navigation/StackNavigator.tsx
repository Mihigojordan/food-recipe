import React, { ReactNode } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/Onborading'; // Corrected the import name
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import RecipeDetail from '../screens/RecipeDetailScreen'; // Corrected the import path
import CategoryDetail from '../screens/CategoryDetail';
import BottomTabNavigator from '../components/BottomTabNavigator';
import SearchResults from '../screens/SearchResults';
import AllCategories from '../screens/MoreCategories'; // Import the AllCategories screen
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; // Import the ForgotPasswordScreen screen

export type Recipe = {
  [x: string]: any;
  id: any;
  dietCategories: any;
  totalCalories: ReactNode;
  balancedDiet: any;
  tags: string;
  culturalOrigin: string;
  imageUrl: string;
  name: string;
  description: string;
  cookingTime: string;
  ingredients: string[];
};
// Define and export the RootStackParamList for navigation
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Preferences: undefined;
  Dashboard: undefined;
  RecipeDetail: { recipe: Recipe };  // Params for RecipeDetail screen
  CategoryDetail: { id: string }; // Params for CategoryDetail screen
  SearchResults: { searchQuery: string }; // Params for SearchResults screen
  AllCategories: undefined; // No params for AllCategories screen
  ForgotPassword: undefined; // No params for ForgotPassword screen
};

// Create the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// StackNavigator Component
export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }} // Hide header if needed
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen} // Add the Forgot Password screen here
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ headerShown: false }}
      />
      {/* Nest the BottomTabNavigator for Dashboard */}
      <Stack.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetail}
        options={{ title: 'Recipe Detail' }} // Customize the header title
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResults}
        options={{ title: 'Search Results' }} // Customize the header title if needed
      />
      <Stack.Screen
        name="AllCategories"
        component={AllCategories}
        options={{ title: 'All Categories' }} // Customize the header title
      />
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetail}
        options={{ title: 'Category Detail' }} // Customize the header title
      />
    </Stack.Navigator>
  );
}
