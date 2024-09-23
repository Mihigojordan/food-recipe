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
    width: '30%', // Adjust width to fit three cards
    margin: 5, // Reduced margin for tighter spacing
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 80, // Adjust height for smaller cards
  },
  title: {
    padding: 5,
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CategoryCard;
