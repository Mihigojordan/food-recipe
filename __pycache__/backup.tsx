import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';

type RecipeDetailScreenProps = StackScreenProps<RootStackParamList, 'RecipeDetail'>;

export type Recipe = {
  imageUrl: string;
  name: string;
  description: string;
  cookingTime: string;
  culturalOrigin: string;
  tags: string;
  ingredients: string[];
  balancedDiet: {
    carbsPercentage: string;
    fatPercentage: string;
    proteinPercentage: string;
  };
  totalCalories: string;
  dietCategories: {
    energyGiving: string;
    bodyBuilding: string;
    bodyProtective: string;
  };
};

const RecipeDetail: React.FC<RecipeDetailScreenProps> = ({ route }) => {
  const { recipe } = route.params;

  // State for notification scheduling
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'You need to enable notifications for this feature.');
      }
    };

    const getPushToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    };

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // Handle notification when the app is open
      Alert.alert(
        notification.request.content.title ?? '',
        notification.request.content.body ?? ''
      );
    });

    requestNotificationPermissions();
    getPushToken();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(recipe.imageUrl, {
        dialogTitle: `Share ${recipe.name}`,
        mimeType: 'text/plain',
        UTI: 'public.image',
      });
    } catch (error) {
      console.log('Error sharing recipe:', error);
    }
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, date) => {
        if (date) {
          setSelectedDate(date);
          openTimePicker();
        }
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, time) => {
        if (time) {
          setSelectedTime(time);
          handleScheduleNotification(time);
        }
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const combineDateAndTime = () => {
    if (selectedDate && selectedTime) {
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      return combinedDate;
    }
    return null;
  };

  const handleScheduleNotification = async (time: Date) => {
    const scheduledDate = combineDateAndTime();
    if (scheduledDate) {
      try {
        setLoading(true);
        const response = await axios.post('http://192.168.0.102:3000/api/alarm', {
          title: 'Recipe Reminder',
          body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
          scheduleTime: scheduledDate.toISOString(),
          recipeName: recipe.name,
          recipeImage: recipe.imageUrl,
          expoPushToken: expoPushToken,
        });

        if (response.status === 200) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recipe Reminder',
              body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
              sound: 'default',
            },
            trigger: scheduledDate,
          });
          
          setScheduleModalVisible(false);
          Alert.alert('Success', 'You have successfully scheduled a reminder!');
        } else {
          Alert.alert('Error', 'Failed to schedule the notification.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to schedule the notification in the database.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please select a date and time.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.culturalOrigin}>Origin: {recipe.culturalOrigin}</Text>
          <Text style={styles.tags}>Tags: {recipe.tags}</Text>
          <Text style={styles.cookingTime}>Cooking Time: {recipe.cookingTime}</Text>

          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient}
            </Text>
          ))}

          {/* Nutritional Information Section */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>Nutritional Information:</Text>
            <Text>Balanced Diet:</Text>
            <Text>Carbs: {recipe.balancedDiet.carbsPercentage}</Text>
            <Text>Fat: {recipe.balancedDiet.fatPercentage}</Text>
            <Text>Protein: {recipe.balancedDiet.proteinPercentage}</Text>
            <Text>Total Calories: {recipe.totalCalories}</Text>
            <Text>Diet Categories:</Text>
            <Text>Energy Giving: {recipe.dietCategories.energyGiving}</Text>
            <Text>Body Building: {recipe.dietCategories.bodyBuilding}</Text>
            <Text>Body Protective: {recipe.dietCategories.bodyProtective}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <AntDesign name="sharealt" size={24} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setScheduleModalVisible(true)}>
              <AntDesign name="clockcircleo" size={24} color="white" />
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>

          <Modal
            transparent={true}
            visible={scheduleModalVisible}
            onRequestClose={() => setScheduleModalVisible(false)}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Date and Time</Text>
                <TouchableOpacity style={styles.modalButton} onPress={openDatePicker}>
                  <Text style={styles.modalButtonText}>Pick Date & Time</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setScheduleModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  culturalOrigin: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  tags: {
    fontSize: 14,
    marginBottom: 10,
  },
  cookingTime: {
    fontSize: 14,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginLeft: 10,
  },
  nutritionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#ff6347',
  },
});

export default RecipeDetail;
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';

type RecipeDetailScreenProps = StackScreenProps<RootStackParamList, 'RecipeDetail'>;

export type Recipe = {
  imageUrl: string;
  name: string;
  description: string;
  cookingTime: string;
  culturalOrigin: string;
  tags: string;
  ingredients: string[];
  balancedDiet: {
    carbsPercentage: string;
    fatPercentage: string;
    proteinPercentage: string;
  };
  totalCalories: string;
  dietCategories: {
    energyGiving: string;
    bodyBuilding: string;
    bodyProtective: string;
  };
};

const RecipeDetail: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { recipe } = route.params;

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null); // New state for notification message

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'You need to enable notifications for this feature.');
      }
    };

    const getPushToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    };

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // Handle notification when the app is open
      const messageTitle = notification.request.content.title ?? '';
      const messageBody = notification.request.content.body ?? '';
      setNotificationMessage(`${messageTitle}: ${messageBody}`); // Set notification message
    });

    requestNotificationPermissions();
    getPushToken();

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(recipe.imageUrl, {
        dialogTitle: `Share ${recipe.name}`,
        mimeType: 'text/plain',
        UTI: 'public.image',
      });
    } catch (error) {
      console.log('Error sharing recipe:', error);
    }
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, date) => {
        if (date) {
          setSelectedDate(date);
          openTimePicker();
        }
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, time) => {
        if (time) {
          setSelectedTime(time);
          handleScheduleNotification(time);
        }
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const combineDateAndTime = () => {
    if (selectedDate && selectedTime) {
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      return combinedDate;
    }
    return null;
  };

  const handleScheduleNotification = async (time: Date) => {
    const scheduledDate = combineDateAndTime();
    if (scheduledDate) {
      try {
        setLoading(true);
        const response = await axios.post('http://192.168.0.102:3000/api/alarm', {
          title: 'Recipe Reminder',
          body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
          scheduleTime: scheduledDate.toISOString(),
          recipeName: recipe.name,
          recipeImage: recipe.imageUrl,
          expoPushToken: expoPushToken,
        });

        if (response.status === 200) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recipe Reminder',
              body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
              sound: 'default',
            },
            trigger: scheduledDate,
          });

          Alert.alert('Success', 'You have successfully scheduled a reminder!');
        } else {
          Alert.alert('Error', 'Failed to schedule the notification.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to schedule the notification in the database.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please select a date and time.');
    }
  };

  return (
    <View style={styles.container}>
      {notificationMessage && ( // Conditional rendering for the notification banner
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.culturalOrigin}>Origin: {recipe.culturalOrigin}</Text>
          <Text style={styles.tags}>Tags: {recipe.tags}</Text>
          <Text style={styles.cookingTime}>Cooking Time: {recipe.cookingTime}</Text>

          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient}
            </Text>
          ))}

          {/* Nutritional Information Section */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>Nutritional Information:</Text>
            <Text>Balanced Diet:</Text>
            <Text>Carbs: {recipe.balancedDiet.carbsPercentage}</Text>
            <Text>Fat: {recipe.balancedDiet.fatPercentage}</Text>
            <Text>Protein: {recipe.balancedDiet.proteinPercentage}</Text>
            <Text>Total Calories: {recipe.totalCalories}</Text>
            <Text>Diet Categories:</Text>
            <Text>Energy Giving: {recipe.dietCategories.energyGiving}</Text>
            <Text>Body Building: {recipe.dietCategories.bodyBuilding}</Text>
            <Text>Body Protective: {recipe.dietCategories.bodyProtective}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <AntDesign name="sharealt" size={24} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openDatePicker}>
              <AntDesign name="clockcircleo" size={24} color="white" />
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  notificationBanner: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  culturalOrigin: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  tags: {
    fontSize: 14,
    marginBottom: 10,
  },
  cookingTime: {
    fontSize: 14,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 14,
    marginBottom: 5,
  },
  nutritionContainer: {
    marginTop: 20,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default RecipeDetail;

import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useState, useEffect } from 'react';

const apiUrl = 'http://192.168.0.102:3000/api/register';
const preferencesUrl = 'http://192.168.0.102:3000/api/recipes'; // Ensure this returns cultural origins
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
          // Assuming response.data is an array of preferences
          const culturalOrigins = [...new Set(response.data.map((item: any) => item.culturalOrigin))]; // Remove duplicates
          setPreferencesList(culturalOrigins as string[]);
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Failed to load preferences' });
      }
    };

    fetchUserData();
    fetchPreferences();
  }, []);

  // Toggle selected preferences (distinct values only)
  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) => {
      if (prev.includes(preference)) {
        // Remove if already selected
        return prev.filter((item) => item !== preference);
      } else {
        // Add if not already selected, ensuring uniqueness
        return [...new Set([...prev, preference])];
      }
    });
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
          {recipes.map((recipe) => (
            <View key={recipe.id} style={styles.recommendationCard}>
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


import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Share } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

type RecipeDetailScreenProps = StackScreenProps<RootStackParamList, 'RecipeDetail'>;

export type Recipe = {
  imageUrl: string;
  name: string;
  description: string;
  cookingTime: string;
  culturalOrigin: string;
  tags: string;
  ingredients: string[];
  balancedDiet: {
    carbsPercentage: string;
    fatPercentage: string;
    proteinPercentage: string;
  };
  totalCalories: string;
  dietCategories: {
    energyGiving: string;
    bodyBuilding: string;
    bodyProtective: string;
  };
};

const RecipeDetail: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { recipe } = route.params;

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null); // New state for notification message

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'You need to enable notifications for this feature.');
      }
    };

    const getPushToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    };

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // Handle notification when the app is open
      const messageTitle = notification.request.content.title ?? '';
      const messageBody = notification.request.content.body ?? '';
      setNotificationMessage(`${messageTitle}: ${messageBody}`); // Set notification message
    });

    requestNotificationPermissions();
    getPushToken();

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const handleShare = async () => {
    try {
      // Create the message with the recipe name and image URL
      const message = `Check out this recipe: ${recipe.name}\nImage: ${recipe.imageUrl}`;

      // Share the message using the Share API
      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, date) => {
        if (date) {
          setSelectedDate(date);
          openTimePicker();
        }
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, time) => {
        if (time) {
          setSelectedTime(time);
          handleScheduleNotification(time);
        }
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const combineDateAndTime = () => {
    if (selectedDate && selectedTime) {
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      return combinedDate;
    }
    return null;
  };

  const handleScheduleNotification = async (time: Date) => {
    const scheduledDate = combineDateAndTime();
    if (scheduledDate) {
      try {
        setLoading(true);
        const response = await axios.post('http://192.168.22.181:3000/api/alarm', {
          title: 'Recipe Reminder',
          body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
          scheduleTime: scheduledDate.toISOString(),
          recipeName: recipe.name,
          recipeImage: recipe.imageUrl,
          expoPushToken: expoPushToken,
        });

        if (response.status === 200) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recipe Reminder',
              body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
              sound: 'default',
            },
            trigger: scheduledDate,
          });

          Alert.alert('Success', 'You have successfully scheduled a reminder!');
        } else {
          Alert.alert('Error', 'Failed to schedule the notification.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to schedule the notification in the database.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please select a date and time.');
    }
  };

  return (
    <View style={styles.container}>
      {notificationMessage && ( // Conditional rendering for the notification banner
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.culturalOrigin}>Origin: {recipe.culturalOrigin}</Text>
          <Text style={styles.tags}>Tags: {recipe.tags}</Text>
          <Text style={styles.cookingTime}>Cooking Time: {recipe.cookingTime}</Text>

          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient}
            </Text>
          ))}

          {/* Nutritional Information Section */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>Nutritional Information:</Text>
            <Text>Balanced Diet:</Text>
            <Text>Carbs: {recipe.balancedDiet.carbsPercentage}</Text>
            <Text>Fat: {recipe.balancedDiet.fatPercentage}</Text>
            <Text>Protein: {recipe.balancedDiet.proteinPercentage}</Text>
            <Text>Total Calories: {recipe.totalCalories}</Text>
            <Text>Diet Categories:</Text>
            <Text>Energy Giving: {recipe.dietCategories.energyGiving}</Text>
            <Text>Body Building: {recipe.dietCategories.bodyBuilding}</Text>
            <Text>Body Protective: {recipe.dietCategories.bodyProtective}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <AntDesign name="sharealt" size={24} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openDatePicker}>
              <AntDesign name="clockcircleo" size={24} color="white" />
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  notificationBanner: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  culturalOrigin: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  tags: {
    fontSize: 14,
    marginBottom: 10,
  },
  cookingTime: {
    fontSize: 14,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 14,
    marginBottom: 5,
  },
  nutritionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#ff8c00', // Orange color for the button
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default RecipeDetail;


import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Share } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { AntDesign } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import notifee, { AuthorizationStatus } from '@notifee/react-native'; // Import Notifee
import messaging from '@react-native-firebase/messaging'; // Firebase messaging



type RecipeDetailScreenProps = StackScreenProps<RootStackParamList, 'RecipeDetail'>;

export type Recipe = {
  imageUrl: string;
  name: string;
  description: string;
  cookingTime: string;
  culturalOrigin: string;
  tags: string;
  ingredients: string[];
  balancedDiet: {
    carbsPercentage: string;
    fatPercentage: string;
    proteinPercentage: string;
  };
  totalCalories: string;
  dietCategories: {
    energyGiving: string;
    bodyBuilding: string;
    bodyProtective: string;
  };
};

const RecipeDetail: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { recipe } = route.params;

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null); // New state for notification message

  // Request permissions and get token
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        Alert.alert('Permission not granted', 'You need to enable notifications for this feature.');
      } else {
        // Get the device token from Firebase Messaging for push notifications
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setExpoPushToken(token); // Save the FCM token
      }
    };

    const subscription = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 1 && detail.notification) { // Ensure notification is defined
        const messageTitle = detail.notification.title ?? '';
        const messageBody = detail.notification.body ?? '';
        setNotificationMessage(`${messageTitle}: ${messageBody}`);
      }
    });

    requestNotificationPermissions();

    return () => {
      subscription(); // Clean up the event listener
    };
  }, [navigation]);







  const handleShare = async () => {
    try {
      const message = `Check out this recipe: ${recipe.name}\nImage: ${recipe.imageUrl}`;

      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, date) => {
        if (date) {
          setSelectedDate(date);
          openTimePicker();
        }
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, time) => {
        if (time) {
          setSelectedTime(time);
          handleScheduleNotification(time);
        }
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const combineDateAndTime = () => {
    if (selectedDate && selectedTime) {
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      return combinedDate;
    }
    return null;
  };

  const handleScheduleNotification = async (time: Date) => {
    const scheduledDate = combineDateAndTime();
    if (scheduledDate) {
      try {
        setLoading(true);
        const response = await axios.post('http://192.168.22.181:3000/api/alarm', {
          title: 'Recipe Reminder',
          body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
          scheduleTime: scheduledDate.toISOString(),
          recipeName: recipe.name,
          recipeImage: recipe.imageUrl,
          expoPushToken: expoPushToken,
        });

        if (response.status === 200) {
          // Schedule a local notification using Notifee
          await notifee.createTriggerNotification(
            {
              title: 'Recipe Reminder',
              body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
              android: {
                channelId: 'default',
                sound: 'default',
              },
            },
            {
              type: 'timestamp',
              timestamp: scheduledDate.getTime(),
            }
          );

          Alert.alert('Success', 'You have successfully scheduled a reminder!');
        } else {
          Alert.alert('Error', 'Failed to schedule the notification.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to schedule the notification in the database.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please select a date and time.');
    }
  };

  return (
    <View style={styles.container}>
      {notificationMessage && (
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.culturalOrigin}>Origin: {recipe.culturalOrigin}</Text>
          <Text style={styles.tags}>Tags: {recipe.tags}</Text>
          <Text style={styles.cookingTime}>Cooking Time: {recipe.cookingTime}</Text>

          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient}
            </Text>
          ))}

          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>Nutritional Information:</Text>
            <Text>Carbs: {recipe.balancedDiet.carbsPercentage}</Text>
            <Text>Fat: {recipe.balancedDiet.fatPercentage}</Text>
            <Text>Protein: {recipe.balancedDiet.proteinPercentage}</Text>
            <Text>Total Calories: {recipe.totalCalories}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <AntDesign name="sharealt" size={24} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openDatePicker}>
              <AntDesign name="clockcircleo" size={24} color="white" />
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  notificationBanner: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  culturalOrigin: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  tags: {
    fontSize: 16,
    marginBottom: 10,
  },
  cookingTime: {
    fontSize: 16,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
  },
  nutritionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default RecipeDetail;


import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Share } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

type RecipeDetailScreenProps = StackScreenProps<RootStackParamList, 'RecipeDetail'>;

export type Recipe = {
  imageUrl: string;
  name: string;
  description: string;
  cookingTime: string;
  culturalOrigin: string;
  tags: string;
  ingredients: string[];
  balancedDiet: {
    carbsPercentage: string;
    fatPercentage: string;
    proteinPercentage: string;
  };
  totalCalories: string;
  dietCategories: {
    energyGiving: string;
    bodyBuilding: string;
    bodyProtective: string;
  };
};

const RecipeDetail: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { recipe } = route.params;

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null); // New state for notification message

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'You need to enable notifications for this feature.');
      }
    };

    const getPushToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    };

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // Handle notification when the app is open
      const messageTitle = notification.request.content.title ?? '';
      const messageBody = notification.request.content.body ?? '';
      setNotificationMessage(`${messageTitle}: ${messageBody}`); // Set notification message
    });

    requestNotificationPermissions();
    getPushToken();

    // Register background notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const handleShare = async () => {
    try {
      const message = `Check out this recipe: ${recipe.name}\nImage: ${recipe.imageUrl}`;
      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, date) => {
        if (date) {
          setSelectedDate(date);
          openTimePicker();
        }
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, time) => {
        if (time) {
          setSelectedTime(time);
          handleScheduleNotification(time);
        }
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const combineDateAndTime = () => {
    if (selectedDate && selectedTime) {
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      return combinedDate;
    }
    return null;
  };

  const handleScheduleNotification = async (time: Date) => {
    const scheduledDate = combineDateAndTime();
    if (scheduledDate) {
      try {
        setLoading(true);
        const response = await axios.post('http://192.168.0.100:3000/api/alarm', {
          title: 'Recipe Reminder',
          body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
          scheduleTime: scheduledDate.toISOString(),
          recipeName: recipe.name,
          recipeImage: recipe.imageUrl,
          expoPushToken: expoPushToken,
        });

        if (response.status === 200) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recipe Reminder',
              body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
              sound: 'default',
            },
            trigger: {
              seconds: Math.floor((scheduledDate.getTime() - Date.now()) / 1000)
            },
          });

          Alert.alert('Success', 'You have successfully scheduled a reminder!');
        } else {
          Alert.alert('Error', 'Failed to schedule the notification.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to schedule the notification in the database.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please select a date and time.');
    }
  };

  return (
    <View style={styles.container}>
      {notificationMessage && ( // Conditional rendering for the notification banner
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
          <Text style={styles.culturalOrigin}>Origin: {recipe.culturalOrigin}</Text>
          <Text style={styles.tags}>Tags: {recipe.tags}</Text>
          <Text style={styles.cookingTime}>Cooking Time: {recipe.cookingTime}</Text>

          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient}
            </Text>
          ))}

          {/* Nutritional Information Section */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>Nutritional Information:</Text>
            <Text>Balanced Diet:</Text>
            <Text>Carbs: {recipe.balancedDiet.carbsPercentage}</Text>
            <Text>Fat: {recipe.balancedDiet.fatPercentage}</Text>
            <Text>Protein: {recipe.balancedDiet.proteinPercentage}</Text>
            <Text>Total Calories: {recipe.totalCalories}</Text>
            <Text>Diet Categories:</Text>
            <Text>Energy Giving: {recipe.dietCategories.energyGiving}</Text>
            <Text>Body Building: {recipe.dietCategories.bodyBuilding}</Text>
            <Text>Body Protective: {recipe.dietCategories.bodyProtective}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <AntDesign name="sharealt" size={24} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openDatePicker}>
              <AntDesign name="clockcircleo" size={24} color="white" />
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  notificationBanner: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  culturalOrigin: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  tags: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  cookingTime: {
    fontSize: 16,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
  },
  nutritionContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default RecipeDetail;
