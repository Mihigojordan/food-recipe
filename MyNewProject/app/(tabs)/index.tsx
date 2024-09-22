import React from 'react';
import { StatusBar } from 'react-native';
import StackNavigator from '../../navigation/StackNavigator'; // Ensure this is correctly pointing to your StackNavigator

export default function App() {
  return (
    <>
      {/* Hide the status bar for a full-screen experience */}
      <StatusBar hidden={true} />
      {/* Your StackNavigator or other components */}
      <StackNavigator />
    </>
  );
}
