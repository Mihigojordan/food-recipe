import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopMenu from '../components/TopMenu';
import { fetchProfileData, fetchRecipes } from '../Services/authService'; // Import the services

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  imageUrl: string; // This should be a URL for remote images
  cookingTime: string;
}

const Dashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchProfileData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchRecipesData = async () => {
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
        Alert.alert('Error', 'Could not fetch recipes. Please try again later.');
      }
    };

    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

    fetchUserData();
    fetchRecipesData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Menu */}
      <TopMenu username={userData?.username || 'Guest'} greeting={greeting} />

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerText}>Find Your {'\n'} Recipe Easily</Text>
          <TouchableOpacity style={styles.getRecipeButton} onPress={() => navigation.navigate("Recipes")}>
            <Ionicons name="arrow-forward-outline" size={16} color="#fdb15a" />
            <Text style={styles.getRecipeButtonText}>get your recipe</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/images/removed.png')} // Use require for local images
          style={styles.bannerImage}
        />
      </View>

      {/* Recommendations Section */}
      <Text style={styles.recommendationHeader}>Recommendations</Text>
      <Text style={styles.recommendationSubText}>Based on food you like</Text>

      <ScrollView>
        <View style={styles.recommendationList}>
          {recipes.map((recipe,index) => (
            <View key={index} style={styles.recommendationCard}>
              <Image source={{ uri: recipe.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{recipe.name}</Text>
                <View style={styles.flexContainer}>
                  <TouchableOpacity
                    style={styles.watchButton}
                    onPress={() => navigation.navigate('RecipeDetail', { recipe: recipe })} // Pass the correct recipe object here
                  >
                    <Ionicons name="play-circle-outline" size={20} color="#fff" />
                    <Text style={styles.watchButtonText}>Watch</Text>
                  </TouchableOpacity>
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={20} color="#fdb15a" />
                    <Text style={styles.cookingTime}>
                      {recipe.cookingTime === 'N/A' ? 'N/A' : `${recipe.cookingTime} min`}
                    </Text>
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
    backgroundColor: '#faf9fb',
  },
  banner: {
    backgroundColor: '#fdb15a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    height: 220, // Increased height for the banner
    flexDirection: 'row', // Flex direction to align image and text
    alignItems: 'center', // Center content vertically
  },
  bannerImage: {
    width: 200, // Increased width for the banner image
    height: 220, // Increased height for the banner image
    marginRight: -20, // Space between image and text 
  },
  bannerTextContainer: {
    flex: 1, // Allow this to take the remaining space
  },
  bannerText: {
    fontSize: 28, // Bigger font size for the banner title
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold', // Making the banner title bold
  },
  getRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    marginTop: 10,
    borderRadius: 25,
    width: '60%',
    textTransform: 'capitalize',
  },
  getRecipeButtonText: {
    color: '#fdb15a',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 14, // Slightly larger text
    textTransform: 'capitalize',
  },
  recommendationHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fdb15a',
  },
  recommendationSubText: {
    color: '#666',
    marginBottom: 18,
    fontSize: 17,
  },
  recommendationList: {
    marginBottom: 20,
  },
  recommendationCard: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000', // Changed shadow color to white
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '95%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out the button and time
    alignItems: 'center', // Center vertically
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdb15a',
    padding: 10,
    width: 130,
    borderRadius: 25,
    justifyContent: 'center',
  },
  watchButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cookingTime: {
    color: '#fdb15a',
    marginLeft: 5,
  },
});

export default Dashboard;
