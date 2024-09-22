import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from '../../navigation/StackNavigator'; // Ensure this is correctly pointing to your StackNavigator

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <StackNavigator /> 
    </SafeAreaProvider>
  );
}
