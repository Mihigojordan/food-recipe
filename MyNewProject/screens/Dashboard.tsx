import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopMenu from '../components/TopMenu';
import BannerCarousel from '../components/BannerCarousel';
import CategorySlider from '../components/CategorySlider';
import RecipeCard from '../components/RecipeCard';
const BASE_URL = 'http://192.168.1.65:3000/api'; // Define your API base URL
import axios from 'axios';
import RecipeRouter from '@/navigation/RecipeRouter';
const Dashboard: React.FC = ({ navigation }:any) => {
  const [userData, setUserData] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

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
      throw new Error(
        // error.response?.data?.message || "Failed to fetch profile data"

      );
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchProfileData();  // Call the fetchProfileData function
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchData = async () => {
      try {
        const bannerResponse = await fetch(`${BASE_URL}/banners`);
        const bannersData = await bannerResponse.json();
        setBanners(bannersData);

        const categoryResponse = await fetch(`${BASE_URL}/categories`);
        const categoriesData = await categoryResponse.json();
        setCategories(categoriesData);

        const recipeResponse = await fetch(`${BASE_URL}/recipes`);
        const recipesData = await recipeResponse.json();
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Set greeting based on the current time
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

    // Fetch user and other data
    fetchUserData();
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
       <TopMenu username={userData?.username || 'Guest'} greeting={greeting} />
      <ScrollView>
        
        <View style={styles.sectionContainer}>
          <BannerCarousel banners={banners} />
        </View>
        <RecipeRouter />
      
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  recipeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default Dashboard;
