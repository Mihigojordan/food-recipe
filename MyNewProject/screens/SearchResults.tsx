import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import RecipeCard from '../screens/RecipeCard';


const BASE_URL = 'http://192.168.243.181:3000/api'; // API base URL

const SearchResults: React.FC = ({ route }: any) => {
  const { query } = route.params; // Get the search query from navigation
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchRecipes = async () => {
      setLoading(true);
      console.log('Search Query:', query); // Log the query parameter
      try {
        const response = await axios.get(`${BASE_URL}/recipes/search`, {
          params: { query },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching recipes:', error);
        setError('Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    // Check if the query parameter exists and is valid
    if (query) {
      searchRecipes();
    } else {
      setError('Query parameter is required');
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.recipeList}>
          {searchResults.length > 0 ? (
            searchResults.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            <Text>No recipes found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  recipeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchResults;
