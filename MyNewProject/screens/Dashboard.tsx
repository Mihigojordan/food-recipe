import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import TopMenu from '../components/TopMenu';
import RecipeCard from '../screens/RecipeCard';
import CategoryCard from '../screens/CategoryCard';

const BASE_URL = 'http://192.168.1.64:3000/api';

const Dashboard: React.FC = ({ navigation }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch user data and recipes as in your original code...
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery });
    }
  };

  return (
    <View style={styles.container}>
      <TopMenu username={userData?.username || 'Guest'} greeting={greeting} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by category, origin, ingredient, or name"
          placeholderTextColor="#aaa"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.categoryHeader}>Meal Categories</Text>
      <Text style={styles.categorySubtitle}>All Categories</Text>
      
      <View style={styles.categoryList}>
        <CategoryCard title="Italian" imageUrl="path/to/italian.jpg" />
        <CategoryCard title="Indian" imageUrl="path/to/indian.jpg" />
        <CategoryCard title="Mexican" imageUrl="path/to/mexican.jpg" />
      </View>

      <Text style={styles.recommendationHeader}>Recommendations</Text>
      <ScrollView>
        <View style={styles.recommendationList}>
          {recipes.map((recipe) => (
            <View key={recipe.id} style={styles.recommendationCard}>
              <Image source={{ uri: recipe.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{recipe.name}</Text>
                <View style={styles.cardIcons}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="heart-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="share-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={20} color="#fff" />
                    <Text style={styles.cookingTime}>{recipe.cookingTime} min</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  
  categoryHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  categoryList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  recommendationHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  recommendationList: {
    marginBottom: 20,
  },
  recommendationCard: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  iconButton: {
    padding: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cookingTime: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default Dashboard;
