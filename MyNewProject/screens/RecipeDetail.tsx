import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RecipeDetail = ({ route, navigation }: any) => {
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Detail for Recipe ID: {id}</Text>
      <Button title="Go Back to Dashboard" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RecipeDetail;
