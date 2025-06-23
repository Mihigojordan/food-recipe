import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface CategorySliderProps {
  categories: Array<{ id: string; name: string }>;
  onCategoryPress: (id: string) => void;
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories, onCategoryPress }) => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.categoryButton} onPress={() => onCategoryPress(item.id)}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    backgroundColor: '#70b9be',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategorySlider;
