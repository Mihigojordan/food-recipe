import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from @expo/vector-icons
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import RecipeRouter from '@/navigation/RecipeRouter';
import Alarm from '../screens/Alarm';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }:any) => ({
        tabBarIcon: ({ color, size }:any) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline'; // Use outline variants or solid variants based on preference
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'Recipes') {
            iconName = 'fast-food-outline';
          } else if (route.name === 'Alarm') {
            iconName = 'alarm-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} style={{ marginHorizontal: 10 }} />;
        },
        tabBarStyle: {
          paddingBottom: 10, // Increase bottom padding
          paddingTop: 10, // Increase top padding
          height: 70, // Increase height if needed
          backgroundColor: '#ffffff', // Set background color
        },
        tabBarActiveTintColor: '#fdb15a', // Change active tint color to orange
        tabBarInactiveTintColor: 'lightgray', // Set inactive tint color
        tabBarLabelStyle: {
          padding: 5, // Add padding to labels for better spacing
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Recipes" component={RecipeRouter} />
      <Tab.Screen name="Alarm" component={Alarm} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
