import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { UserData, AuthResponse, Recipe } from '../types/index';

// Update this to match your server's IP address
const BASE_URL = 'http://192.168.151.80:3005/api';

// Add axios interceptor for better error handling and token management
axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Handle token expiration
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

// Login Function
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  console.log('=== Login Attempt ===');
  console.log('Email:', email);
  console.log('API URL:', `${BASE_URL}/login`);

  try {
    console.log('Sending login request...');
    const response = await axios.post(`${BASE_URL}/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.token) {
      console.log('Login successful');
      // Store token and user data in AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.token);
      console.log('Stored user token:', response.data.token ? 'Token exists' : 'Token is null/undefined/empty');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      return response.data;
    } else {
      console.error('Invalid response:', response.data);
      throw new Error(response.data.error || 'Invalid response from the server');
    }
  } catch (error: any) {
    console.error('=== Login Error ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('User not found. Please check your email.');
      } else if (error.response.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response.data?.error || 'Login failed');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      console.error('Request setup error:', error.message);
      throw new Error('Failed to send login request: ' + error.message);
    }
  }
};

// Register Function
export const register = async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> => {
  console.log('=== Registration Attempt ===');
  console.log('User data:', { ...userData, password: '***' });
  console.log('API URL:', `${BASE_URL}/register`);

  try {
    console.log('Sending registration request...');
    const response = await axios.post(`${BASE_URL}/register`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.status === 201) {
      console.log('Registration successful');
      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      return response.data;
    } else {
      console.error('Invalid response status:', response.status);
      throw new Error('Invalid response from the server');
    }
  } catch (error: any) {
    console.error('=== Registration Error ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);

      if (error.response.data === 'Email already exists') {
        throw new Error('This email is already registered. Please use a different email or login.');
      } else if (error.response.status === 400) {
        throw new Error('Invalid registration data. Please check your input.');
      } else {
        throw new Error(error.response.data?.message || 'Registration failed');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      console.error('Request setup error:', error.message);
      throw new Error('Failed to send registration request: ' + error.message);
    }
  }
};

// Logout Function
export const logout = async () => {
  try {
    console.log('=== Logout Attempt ===');
    const response = await axios.post(`${BASE_URL}/logout`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      await clearUserData();
      console.log('User logged out successfully');

    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Function to clear user data from AsyncStorage
const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userToken');
    console.log('User data and token cleared from storage');
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

// Retrieve User Data from AsyncStorage
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const data = await AsyncStorage.getItem('userData');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Profile Management
export const updateProfile = async (userData: { username?: string; email?: string; profileImage?: string }): Promise<UserData> => {
  try {
    console.log('=== Updating Profile ===');
    const response = await axios.put(`${BASE_URL}/profile`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Update stored user data
    const currentData = await getUserData();
    if (currentData) {
      const updatedData = { ...currentData, ...userData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
    }

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Password Management
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    console.log('=== Changing Password ===');
    const response = await axios.put(`${BASE_URL}/profile/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      console.log('Password changed successfully');
    } else {
      throw new Error('Failed to change password');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Account Deletion
export const deleteAccount = async (): Promise<void> => {
  try {
    console.log('=== Deleting Account ===');
    const response = await axios.delete(`${BASE_URL}/delete-account`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      await clearUserData();
      console.log('Account deleted successfully');
    } else {
      throw new Error('Account deletion failed');
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// Password Reset Flow
export const sendOtp = async (email: string) => {
  try {
    console.log('=== Sending OTP ===');
    const response = await axios.post(`${BASE_URL}/forget-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOtp = async (email: string, otpString: string) => {
  try {
    console.log('=== Verifying OTP ===');
    const response = await axios.post(`${BASE_URL}/verify-otp`, { email, otp: otpString });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    console.log('=== Resetting Password ===');
    const response = await axios.post(`${BASE_URL}/reset-password`, { email, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Fetch Preferences
export const getPreferences = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/preferences`);
    if (response.status === 200 && response.data) {
      return response.data.map((pref: any) => pref.name);
    } else {
      throw new Error('Failed to load preferences');
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
};

// Submit Selected Preferences for User Registration
export const submitPreferences = async (userData: UserData, selectedPreferences: string[]): Promise<void> => {
  console.log('=== Submitting Preferences ===');
  console.log('User data:', { ...userData, password: '***' });
  console.log('Selected preferences:', selectedPreferences);

  if (selectedPreferences.length < 4) {
    throw new Error('Please select at least 4 cultural origins.');
  }

  try {
    console.log('Sending preferences to:', `${BASE_URL}/preferences`);
    const response = await axios.post(`${BASE_URL}/preferences`, {
      preferences: selectedPreferences
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 10000,
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.status === 201) {
      console.log('Preferences saved successfully');
      return;
    } else {
      throw new Error('Failed to save preferences');
    }
  } catch (error: any) {
    console.error('=== Preferences Submission Error ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);

      if (error.response.status === 400) {
        throw new Error('Invalid preferences data. Please try again.');
      } else if (error.response.status === 401) {
        throw new Error('Please login again to continue.');
      } else if (error.response.status === 404) {
        throw new Error('Preferences endpoint not found. Please check the API URL.');
      } else {
        throw new Error(error.response.data?.message || 'Failed to save preferences');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      console.error('Request setup error:', error.message);
      throw new Error('Failed to send preferences: ' + error.message);
    }
  }
};

// Fetch profile data with Axios
export const fetchProfileData = async (): Promise<UserData> => {
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
export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes`);
    //  console.log("Recipes fetched data:");
    console.log(`Recipes fetched data: ${JSON.stringify(response.data)}`);
    return response.data; // Axios returns data in the 'data' field
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

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
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      return response.data; // Return notifications data
    }
    throw new Error('Failed to load notifications');
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Failed to load notifications' });
    throw error; // Re-throw error to be handled in the Alarm component
  }
};

export const deleteNotification = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/notifications/${id}`);
  return response.data;
};

export const setAlarm = async (data: { recipeId: number; title: string; body: string; scheduleTime: string; recipeName: string; recipeImage: string; expoPushToken: string | null; mealType: string; }) => {
  try {
    const response = await axios.post(`${BASE_URL}/alarm`, data);
    return response; // Return the response for further processing
  } catch (error) {
    throw error; // Re-throw the error for handling in the calling function
  }
};

// Weekly Plan Functions with Reminder Support
export const fetchWeeklyPlan = async (weekStartDate?: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/weekly-plan`, {
      params: { weekStartDate },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly plan:', error);
    throw error;
  }
};

export const addRecipeToWeeklyPlan = async (data: {
  day: string;
  mealType: string;
  recipeId: number;
  weekStartDate?: string;
  reminderEnabled?: boolean;
  reminderTime?: string;
  reminderDays?: string[];
  expoPushToken?: string | null;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/weekly-plan`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error adding recipe to weekly plan:', error);
    throw error;
  }
};

export const updateReminderSettings = async (data: {
  day: string;
  mealType: string;
  weekStartDate?: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  reminderDays?: string[];
  expoPushToken?: string | null;
}) => {
  try {
    const response = await axios.put(`${BASE_URL}/weekly-plan/reminder`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    throw error;
  }
};

export const removeRecipeFromWeeklyPlan = async (data: {
  day: string;
  mealType: string;
  weekStartDate?: string;
}) => {
  try {
    const response = await axios.delete(`${BASE_URL}/weekly-plan`, {
      params: data,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error removing recipe from weekly plan:', error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  getUserData,
  updateProfile,
  changePassword,
  deleteAccount,
  sendOtp,
  verifyOtp,
  resetPassword,
  getPreferences,
  submitPreferences,
  fetchProfileData,
  fetchRecipes,
  retriveRecipes,
  fetchNotifications,
  deleteNotification,
  setAlarm,
  fetchWeeklyPlan,
  addRecipeToWeeklyPlan,
  updateReminderSettings,
  removeRecipeFromWeeklyPlan,
};