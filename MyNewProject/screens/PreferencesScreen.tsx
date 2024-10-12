import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { getUserData, getPreferences, submitPreferences } from '../Services/authService';
import { NavigationProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function PreferencesScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [preferencesList, setPreferencesList] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userData = await getUserData();
        setUserData(userData);
        const preferences = await getPreferences();
        setPreferencesList(preferences as string[]);
      } catch (error) {
        // Error handling is already done in the service layer
      }
    };

    fetchInitialData();
  }, []);

  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((item) => item !== preference)
        : [...new Set([...prev, preference])]
    );
  };

  const handleSubmitPreferences = async () => {
    try {
      await submitPreferences(userData, selectedPreferences);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
    } catch (error) {
      // Error handling is already done in the service layer
    }
  };

  const renderPreferenceItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.preferenceButton,
        selectedPreferences.includes(item) && styles.selectedButton,
      ]}
      onPress={() => togglePreference(item)}
    >
      <Text
        style={[
          styles.preferenceText,
          selectedPreferences.includes(item) && styles.selectedText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Choose 4  Your Cultural Origins</Text>
      
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
