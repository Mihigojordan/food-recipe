import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const BASE_URL = 'https://wide-socks-agree.loca.lt/api'; // API base URL

// Login Function
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    if (response.status === 200) {
      return response.data; // Return user data or token
    } else {
      throw new Error('Invalid response from the server');
    }
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Login failed' });
    throw new Error('Failed to login');
  }
};

// Retrieve User Data from AsyncStorage
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    if (data) {
      return JSON.parse(data); // Return parsed user data
    }
    return null;
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Failed to load user data' });
    throw error; // Re-throw to be handled by the caller
  }
};

// Fetch Preferences (e.g., cultural origins)
export const getPreferences = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes`);
    if (response.status === 200 && response.data) {
      const culturalOrigins = [...new Set(response.data.map((item: any) => item.culturalOrigin))];
      return culturalOrigins;
    } else {
      throw new Error('Failed to load preferences');
    }
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Failed to load preferences' });
    throw error; // Re-throw error to be handled by the caller
  }
};

// Submit Selected Preferences for User Registration
export const submitPreferences = async (userData: any, selectedPreferences: string[]) => {
  if (selectedPreferences.length < 4) {
    Toast.show({ type: 'error', text1: 'Please select at least 4 cultural origins.' });
    return;
  }

  if (!userData) {
    Toast.show({ type: 'error', text1: 'User data not found' });
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      ...userData,
      preferences: selectedPreferences,
    });

    if (response.status === 201) {
      Toast.show({ type: 'success', text1: 'Registration completed successfully!' });
    } else {
      throw new Error('Failed to complete registration');
    }
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Failed to complete registration' });
    throw error;
  }
};

// Fetch profile data with Axios
export const fetchProfileData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensures cookies are sent with the request
    });
    return response.data; // Axios returns data in the 'data' field
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

// Fetch recipes with Axios
export const fetchRecipes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes`);
    return response.data; // Axios returns data in the 'data' field
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// recipeService.ts
export interface Recipe {
  name: string;
  imageUrl: string;
  description: string;
  culturalOrigin: string;
  tags: string;
  cookingTime: string;
  ingredients: string[];
}

// Fetch recipes based on ingredients using Axios
export const retriveRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const response = await axios.post(`${BASE_URL}/recipes`, {
      ingredients,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Axios returns data in the 'data' field
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error('Failed to fetch recipes');
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications`);
    if (response.status === 200) {
      return response.data; // Return notifications data
    }
    throw new Error('Failed to load notifications');
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Failed to load notifications' });
    throw error; // Re-throw error to be handled in the Alarm component
  }
};

export const setAlarm = async (data: { title: string; body: string; scheduleTime: string; recipeName: string; recipeImage: string; expoPushToken: string | null; }) => {
  try {
    const response = await axios.post(`${BASE_URL}/alarm`, data);
    return response; // Return the response for further processing
  } catch (error) {
    throw error; // Re-throw the error for handling in the calling function
  }
};


export const logout = async () => {
  try {
    // Call the logout API
    const response = await axios.post(`${BASE_URL}/logout`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Include credentials for cookie handling
    });

    if (response.status === 200) {
      await clearUserData(); // Clear user data upon successful logout
      console.log('User logged out successfully');
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Toast.show({ type: 'error', text1: 'Logout failed', text2: error.message });
    throw error; // Rethrow the error to be handled in the component
  }
};

// Function to clear user data from AsyncStorage
const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userData'); // Adjust based on your storage mechanism
    // Remove any other relevant data
    console.log('User data cleared from storage');
  } catch (error) {
    console.error('Error clearing user data:', error);
    Toast.show({ type: 'error', text1: 'Failed to clear user data' });
  }
};

  const AuthService = {
    sendOtp: async (email: any) => {
      return await axios.post(`${BASE_URL}/forget-password`, { email });
    },
    verifyOtp: async (email: any, otpString: any) => { // Changed 'otp' to 'otpString'
      return await axios.post(`${BASE_URL}/verify-otp`, { email, otp: otpString }); // Use 'otpString' here
      console.log(otpString)
    },
    resetPassword: async (email: any, newPassword: any) => {
      return await axios.post(`${BASE_URL}/reset-password`, { email, newPassword });
    },
  };

export default AuthService;