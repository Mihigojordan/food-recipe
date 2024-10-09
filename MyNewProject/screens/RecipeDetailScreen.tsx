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
import { setAlarm } from '../Services/authService'; // Adjust the path according to your file structure


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

        // Prepare the data to be sent to the service
        const alarmData = {
          title: 'Recipe Reminder',
          body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
          scheduleTime: scheduledDate.toISOString(),
          recipeName: recipe.name,
          recipeImage: recipe.imageUrl,
          expoPushToken: expoPushToken,
        };

        // Call the service function to set the alarm
        const response = await setAlarm(alarmData);

        if (response.status === 200) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recipe Reminder',
              body: `Time to cook: ${recipe.name} - ${recipe.cookingTime}`,
              sound: 'default',
            },
            trigger: {
              seconds: Math.floor((scheduledDate.getTime() - Date.now()) / 1000),
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
              {index + 1}. {ingredient} 
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
