import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import RecipeRouter from '@/navigation/RecipeRouter';
import Alarm from '../screens/Alarm';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Recipes') {
            iconName = 'fast-food';
          } else if (route.name === 'Alarm') {
            iconName = 'alarm';
          }
          return <Icon name={iconName} size={size} color={color} />;
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
