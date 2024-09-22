import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useState, useEffect } from 'react';

const apiUrl = 'http://192.168.1.64:3000/api/register'; 
const preferencesUrl = 'http://192.168.1.64:3000/api/recipes'; // Ensure this returns cultural origins
const { width } = Dimensions.get('window');

export default function PreferencesScreen({ navigation }: any) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [preferencesList, setPreferencesList] = useState<string[]>([]);
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

    const fetchPreferences = async () => {
      try {
        const response = await axios.get(preferencesUrl);
        if (response.data) {
          // Assuming response.data contains an array of cultural origins
          const culturalOrigins = response.data.map((item: any) => item.culturalOrigin); // Adjust based on your API structure
          setPreferencesList(culturalOrigins);
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Failed to load preferences' });
      }
    };

    fetchUserData();
    fetchPreferences();
  }, []);

  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference) ? prev.filter((item) => item !== preference) : [...prev, preference]
    );
  };

  const handleSubmitPreferences = async () => {
    if (selectedPreferences.length < 4) {
      Toast.show({ type: 'error', text1: 'Please select at least 4 cultural origins.' });
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
      <Text style={styles.title}>Choose Your Cultural Origins</Text>
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
    backgroundColor: '#fdb15a',
    borderColor: '#fdb15a',
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
    backgroundColor: '#fdb15a',
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
