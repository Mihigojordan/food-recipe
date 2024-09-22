import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const apiUrl = 'http://192.168.1.65:3000/api/register'; 
const { width } = Dimensions.get('window');

const preferencesList = [
  'Preference 1',
  'Preference 2',
  'Preference 3',
  'Preference 4',
  'Preference 5',
  'Preference 6',
  'Preference 7',
  'Preference 8',
  'Preference 9',
  'Preference 10',
];

export default function PreferencesScreen({ navigation }:any) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [userData, setUserData] = useState<{ username: string; email: string; password: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Failed to load user data' });
      }
    };
    fetchUserData();
  }, []);

  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference) ? prev.filter((item) => item !== preference) : [...prev, preference]
    );
  };

  const handleSubmitPreferences = async () => {
    if (selectedPreferences.length < 4) {
      Toast.show({ type: 'error', text1: 'Please select at least 4 preferences.' });
      return;
    }

    if (!userData) {
      Toast.show({ type: 'error', text1: 'User data not found' });
      return;
    }

    try {
      await axios.post(apiUrl, { ...userData, preferences: selectedPreferences });
      Toast.show({ type: 'success', text1: 'Registration completed successfully!' });
      setTimeout(() => {
        navigation.navigate('Login'); 
      }, 3000); 
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to complete registration' });
    }
  };

  const renderPreferenceItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.preferenceButton,
        selectedPreferences.includes(item) && styles.selectedButton
      ]}
      onPress={() => togglePreference(item)}
    >
      <Text
        style={[
          styles.preferenceText,
          selectedPreferences.includes(item) && styles.selectedText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Favorite Meal</Text>
      <FlatList
        data={preferencesList}
        renderItem={renderPreferenceItem}
        keyExtractor={(item) => item}
        numColumns={2} 
        contentContainerStyle={styles.gridContainer}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitPreferences}>
        <Text style={styles.submitButtonText}>Save Preferences</Text>
      </TouchableOpacity>
      <Toast /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  preferenceButton: {
    width: width * 0.4,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#70b9be',
    borderColor: '#70b9be',
  },
  preferenceText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#70b9be',
    borderRadius: 5,
    paddingVertical: 15,
    width: width * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
