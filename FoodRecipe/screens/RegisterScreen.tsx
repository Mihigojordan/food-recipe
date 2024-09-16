import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; // Import social media icons
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useState } from 'react';
const apiUrl = 'http://192.168.1.73:3000/api/register';
 // Use your local IP address here




const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }: any) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
          const response = await axios.post(apiUrl, {
            username,
            email,
            password
          });
          console.log('Registration response:', response.data); // Debugging response

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: response.data.message,
            topOffset:20,
          });
        //   navigation.navigate('Login');
        } catch (error) {
            console.log('Registration error:', error.response ? error.response.data : error.message); // Debugging error

          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            topOffset:20,
            // text2: error.response ? error.response.data.error : 'Something went wrong',
            // text2: error.response ? error.response.data.error : 'Something went wrong',

          });
        }
      };
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Toast />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Register</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          placeholderTextColor="#f6c559"
          onChangeText={setUsername}
          value={username}

        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#f6c559"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          placeholderTextColor="#f6c559"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.signUpSection}>
          <View style={styles.line} />
          <Text style={styles.signUpText}>Sign Up with</Text>
          <View style={styles.line} />
        </View>
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
        <Text style={styles.loginText}>
          If you already have an account,{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>login</Text>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  logo: {
    width: width * 0.5, // Reduced size
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    elevation: 4, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f6c559',
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#f6c559',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
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
    color: '#333',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  socialIcon: {
    backgroundColor: '#f6c559',
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
    color: '#f6c559',
    fontWeight: 'bold',
  },
});
