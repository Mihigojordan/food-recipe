import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface CategoryCardProps {
  title: string;
  imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%', // Full width of the container
    aspectRatio: 1, // Maintains a square shape
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom:10,
    justifyContent: 'center', // Centers content vertically
  },
  image: {
    width: '100%',
    height: '60%', // Image takes up 80% of the card
    resizeMode: 'cover',
  },
  title: {
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CategoryCard;
