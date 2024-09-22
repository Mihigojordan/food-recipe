import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/Onborading';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import RecipeDetail from '../screens/RecipeDetail';
import CategoryDetail from '../screens/CategoryDetail';
import BottomTabNavigator from '../components/BottomTabNavigator';
import SearchResults from '../screens/SearchResults';

// Define and export the RootStackParamList for navigation
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Preferences: undefined;
  Dashboard: undefined;
  RecipeDetail: { id: string };
  CategoryDetail: { id: string };
  SearchResults: { searchQuery: string }; // For SearchResults screen
  
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
        name="CategoryDetail"
        component={CategoryDetail}
        options={{ title: 'Category Detail' }} // Customize the header title
      />
            <Stack.Screen name="SearchResults" component={SearchResults} /> 
        
    </Stack.Navigator>
  );
}
