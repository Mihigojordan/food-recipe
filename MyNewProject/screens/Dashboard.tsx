import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import TopMenu from '../components/TopMenu';
import RecipeCard from '../screens/RecipeCard';
import CategoryCard from '../screens/CategoryCard';

const BASE_URL = 'http://192.168.243.181:3000/api';

const Dashboard: React.FC = ({ navigation }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      throw new Error("Failed to fetch profile data");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchProfileData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchData = async () => {
      try {
        const recipeResponse = await fetch(`${BASE_URL}/recipes`);
        const recipesData = await recipeResponse.json();
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

    fetchUserData();
    fetchData();
    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery });
    }
  };

  const handleCategoryPress = (category: any) => {
    navigation.navigate('CategoryDetail', { id: category.id }); // Pass the category ID
  };

  const handleSeeAllCategories = () => {
    navigation.navigate('AllCategories');
  };

  // Select only three categories to display
  const displayedCategories = categories.slice(0, 3);

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

      <View style={styles.categoryHeaderContainer}>
        <Text style={styles.categoryHeader}>Meal Categories</Text>
        <TouchableOpacity onPress={handleSeeAllCategories}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoryList}>
        {displayedCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category)}
            style={styles.categoryCardContainer}
          >
            <CategoryCard 
              title={category.name} 
              imageUrl={`http://192.168.0.101:3000/uploads/${category.imageUrl}`} 
            />
          </TouchableOpacity>
        ))}
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
  categoryCardContainer: {
    height: 120, // Height for the category card
    width:'30%',  // Width for the category card to make it square
    borderRadius: 10,
    margin:2,
    borderColor:'red',
    textAlign:'center',
    overflow: 'hidden',
    marginBottom:10,
    marginHorizontal: 5, // Margin for spacing between cards
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
  categoryHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#007BFF',
    fontSize: 16,
  },
  categoryList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  recommendationHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical:15,
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
    height: 150,
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
