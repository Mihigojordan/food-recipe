import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopMenu from '../components/TopMenu';
import RecipeCard from '../screens/RecipeCard';
import axios from 'axios';

const BASE_URL = 'http://192.168.1.64:3000/api'; // Define your API base URL

const Dashboard: React.FC = ({ navigation }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch profile data using axios
  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials if needed
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      throw new Error("Failed to fetch profile data");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchProfileData(); // Call the fetchProfileData function
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

    // Set greeting based on the current time
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

    // Fetch user and recipe data
    fetchUserData();
    fetchData();
  }, []);

  // Handle search action
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Route to a search results page (to be created) and pass searchQuery
      navigation.navigate('SearchResults', { query: searchQuery });
    }
  };

  return (
    <View style={styles.container}>
      <TopMenu username={userData?.username || 'Guest'} greeting={greeting} />

      {/* Search Input */}
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

      <ScrollView>
        <View style={styles.recipeList}>
          {/* Map over recipes and display RecipeCards */}
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
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
  recipeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default Dashboard;
