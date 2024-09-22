// RecipeList.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RecipeList = ({ navigation }:any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Recipes</Text>
      {/* Map through your recipes here */}
      <Button 
        title="Add Recipe"
        onPress={() => navigation.navigate('AddRecipe')} 
      />
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
    marginBottom: 20,
  },
});

export default RecipeList;
