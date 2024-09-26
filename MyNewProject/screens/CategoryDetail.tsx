// screens/CategoryDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://192.168.243.181:3000/api';

const CategoryDetail: React.FC<{ route: any }> = ({ route }) => {
  const { id } = route.params; // Get the category ID from params
  const [category, setCategory] = useState<any>(null);

  const fetchCategoryDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/${id}`);
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching category detail:", error);
    }
  };

  useEffect(() => {
    fetchCategoryDetail();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {category ? (
        <>
          <Text style={styles.title}>{category.name}</Text>
          <Image source={{ uri: `http://192.168.0.101:3000/uploads/${category.imageUrl}` }} style={styles.image} />
          <Text style={styles.description}>{category.description}</Text>
          {/* Add more details as needed */}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
});

export default CategoryDetail;
