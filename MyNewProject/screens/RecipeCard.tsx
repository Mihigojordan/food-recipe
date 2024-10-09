import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RecipeCard = ({ recipe, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={require('@/assets/icon.png')} style={styles.icon} /> {/* Replace with your icon path */}
      </View>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.details}>Cooking Time: {recipe.cookingTime} mins</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 20, // Increased margin for better spacing
    borderRadius: 15, // Rounded corners
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 8, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOpacity: 0.1,
    shadowRadius: 10, // Slightly increased shadow radius
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  iconContainer: {
    position: 'absolute',
    top: 10, // Positioned at the top of the card
    left: 10, // Adjust this value to move it horizontally
    backgroundColor: '#fff', // White background
    borderRadius: 15, // Round the icon's background
    padding: 5, // Padding around the icon
    shadowColor: '#000', // Shadow for the icon
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  icon: {
    width: 30, // Reduced icon size
    height: 30,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15, // Rounded top corners
    borderTopRightRadius: 15,
  },
  textContainer: {
    padding: 15, // Increased padding for better spacing
  },
  title: {
    fontSize: 18, // Increased font size for better readability
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#555', // Darker color for better contrast
  },
});

export default RecipeCard;
