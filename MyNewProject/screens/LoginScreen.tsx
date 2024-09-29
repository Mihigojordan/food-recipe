import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ImageBackground, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { Checkbox } from 'react-native-paper';

const apiUrl = 'http://192.168.1.67:3000/api/login';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false); // Remember me checkbox

  // Handle login API request
  const handleLogin = async () => {
    try {
      const response = await axios.post(apiUrl, { email, password });

      Toast.show({
        type: 'success',
        text1: 'Login Successful'
      });

      if (response.status === 200) {
        setTimeout(() => navigation.navigate('Dashboard'), 2000); // Navigate to Home page after login
      }
      console.log('yes');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
      });
      
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          style={styles.headerContainer}
          resizeMode="cover"
        >
          <Text style={styles.helloText}>Welcome Back</Text>
          <Text style={styles.subText}>
            Login to continue using the app.
          </Text>
        </ImageBackground>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={24} color="#fdb15a" style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#fdb15a"
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={24} color="#fdb15a" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              style={styles.input}
              placeholderTextColor="#fdb15a"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              color={checked ? '#fdb15a' : '#666'}
            />
            <Text style={styles.checkboxText}>Remember Me</Text>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
            <Text style={styles.registerButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signUpSection}>
            <View style={styles.line} />
            <Text style={styles.signUpText}>Or login with</Text>
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
            Don't have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Register')}>
              Register
            </Text>
          </Text>
        </View>
        <Toast /> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    width: '100%',
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fdb15a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  helloText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    zIndex: 20,
    position: 'absolute',
    top: 220,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fdb15a',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 30,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#fdb15a',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  checkboxText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: '#fdb15a',
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
    backgroundColor: '#fdb15a',
  },
  signUpText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '95%',
    letterSpacing: 20,
  },
  socialIcon: {
    backgroundColor: '#fdb15a',
    borderRadius: 10,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  loginLink: {
    color: '#fdb15a',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
