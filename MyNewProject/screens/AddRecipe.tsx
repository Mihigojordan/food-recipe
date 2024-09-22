import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For image picking
import { Ionicons } from '@expo/vector-icons'; // Icon for image picker

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    culturalOrigin: '',
    tags: '',
    ingredients: [''],
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle ingredient input changes
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  // Add more ingredients
  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  // Image picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Submit recipe function
  const handleSubmit = async () => {
    try {
      // Create a new FormData object to send text and image data
      const formData = new FormData();

      // Add recipe data
      formData.append('name', recipe.name);
      formData.append('description', recipe.description);
      formData.append('culturalOrigin', recipe.culturalOrigin);
      formData.append('tags', recipe.tags);
      formData.append('ingredients', JSON.stringify(recipe.ingredients)); // Send ingredients as JSON

      // Add selected image if any
      if (selectedImage) {
        const imageName = selectedImage.split('/').pop(); // Get the image name from the URI
        const image = {
          uri: selectedImage,
          name: imageName,
          type: 'image/jpeg', // You can adjust this if you want to support other formats
        };
        formData.append('image', image as any);
      }

      // Sending data to backend using fetch (You can replace fetch with axios if needed)
      const response = await fetch('https://your-backend-api.com/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Recipe added successfully!');
        // Clear the form after successful submission
        setRecipe({
          name: '',
          description: '',
          culturalOrigin: '',
          tags: '',
          ingredients: [''],
        });
        setSelectedImage(null);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit recipe.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add New Recipe</Text>

        {/* Image Upload */}
        <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.recipeImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color="#ccc" />
              <Text style={styles.imagePlaceholderText}>Upload Recipe Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Recipe Form */}
        <TextInput
          placeholder="Recipe Name"
          value={recipe.name}
          onChangeText={(text) => setRecipe({ ...recipe, name: text })}
          style={styles.input}
        />
        
        {/* Description as TextArea */}
        <TextInput
          placeholder="Description"
          value={recipe.description}
          onChangeText={(text) => setRecipe({ ...recipe, description: text })}
          style={[styles.input, styles.textArea]} // Add textArea style
          multiline={true}
          numberOfLines={4} // Number of lines in the text area
        />
        
        <TextInput
          placeholder="Cultural Origin"
          value={recipe.culturalOrigin}
          onChangeText={(text) => setRecipe({ ...recipe, culturalOrigin: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Tags (comma separated)"
          value={recipe.tags}
          onChangeText={(text) => setRecipe({ ...recipe, tags: text })}
          style={styles.input}
        />

        <Text style={styles.label}>Ingredients</Text>

        {/* Ingredients List */}
        {recipe.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChangeText={(text) => handleIngredientChange(index, text)}
              style={styles.input}
            />
          </View>
        ))}

        {/* Add Ingredient Button */}
        <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Ingredient</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <Button title="Submit Recipe" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Ensure extra space at the bottom
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100, // Text area height
    textAlignVertical: 'top', // Ensures text starts from the top in the multiline input
  },
  imageUploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  recipeImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  imagePlaceholderText: {
    color: '#777',
    fontSize: 16,
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  ingredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AddRecipe;
