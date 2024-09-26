import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const BASE_URL = 'http://192.168.243.181:3000/api'; // Your backend URL

const AddCategoryForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [image, setImage] = useState<any>(null); // Holds selected image

  // Handle image upload
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets) {
        setImage(response.assets[0]);
      }
    });
  };

  // Handle form submission
        const handleSubmit = async () => {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('description', description);
          formData.append('type', type);
          formData.append('dietaryPreferences', dietaryPreferences);

          // Append image if available
          if (image) {
            formData.append('image', {
              uri: image.uri,
              type: image.type,
              name: image.fileName,
            } as any);
          }

          try {
            const response = await axios.post(`${BASE_URL}/category`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('Category added successfully:', response.data);
          } catch (error) {
            console.error('Error adding category:', error);
          }
        };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter type (e.g., Cuisine)"
        value={type}
        onChangeText={setType}
      />

      <Text style={styles.label}>Dietary Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter dietary preferences (e.g., Vegan)"
        value={dietaryPreferences}
        onChangeText={setDietaryPreferences}
      />

      <Text style={styles.label}>Image</Text>
      {image ? (
        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
      ) : (
        <TouchableOpacity onPress={selectImage} style={styles.imageUploadButton}>
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>
      )}

      <Button title="Add Category" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  imageUploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadText: {
    color: '#fff',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default AddCategoryForm;
