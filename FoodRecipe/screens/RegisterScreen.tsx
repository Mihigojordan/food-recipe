import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
 // Import CheckBox here
// import CheckBox from 'expo-checkbox';


const apiUrl = 'http://192.168.1.73:3000/api/register'; // Use your local IP address here

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post(apiUrl, {
        username,
        email,
        password,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
        topOffset: 20,
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        // text2: error.response ? error.response.data.error : 'Something went wrong',
        topOffset: 20,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Toast />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.helloText}>Hello</Text>
        <Text style={styles.helloText}>There</Text>
        <Text style={styles.subText}>
          Welcome! Let's get you all set up so you can start using the app.
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={24} color="#D32F2F" style={styles.inputIcon} />
          <TextInput
            placeholder="Username"
            style={styles.input}
            placeholderTextColor="#D32F2F"
            onChangeText={setUsername}
            value={username}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={24} color="#D32F2F" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#D32F2F"
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={24} color="#D32F2F" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor="#D32F2F"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        {/* Terms & Conditions */}
        <View style={styles.checkboxContainer}>
        
          <Text style={styles.checkboxText}>I accept the terms and conditions</Text>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={!isChecked}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Divider with "Sign Up with" */}
        <View style={styles.signUpSection}>
          <View style={styles.line} />
          <Text style={styles.signUpText}>Or sign up with</Text>
          <View style={styles.line} />
        </View>

        {/* Social Media Icons */}
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="google" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="apple" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <MaterialCommunityIcons name="facebook" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  helloText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D32F2F',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#666',
  },
  registerButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  signUpText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  socialIcon: {
    backgroundColor: '#D32F2F',
    borderRadius: 25,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 16,
  },
  loginLink: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
