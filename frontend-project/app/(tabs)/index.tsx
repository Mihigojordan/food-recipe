import React from 'react';
import { StatusBar } from 'react-native';
import { Redirect } from 'expo-router';

export default function Index() {
  return (
    <>
      {/* Hide the status bar for a full-screen experience */}
      <StatusBar hidden={true} />
      <Redirect href="/(app)/dashboard" />
    </>
  );
}
