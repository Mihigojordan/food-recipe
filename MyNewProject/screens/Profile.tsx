import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Alert } from 'react-native';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    avatar: string;
    bio: string;
    location: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from the API
  useEffect(() => {
            const fetchProfileData = async () => {
              try {
                const response = await fetch('http://192.168.243.181:3000/api/profile'); // Replace with your API endpoint
                if (!response.ok) {
                  throw new Error('Failed to fetch profile data');
                }
                const data = await response.json();
                setProfileData(data);
              } catch (err) {
                if (err instanceof Error) {
                  setError(err.message || 'Something went wrong');
                  Alert.alert('Error', err.message);
                } else {
                  setError('Something went wrong');
                  Alert.alert('Error', 'Something went wrong');
                }
              } finally {
                setLoading(false);
              }
            };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profileData && (
        <>
          {/* <Image source={{ uri: profileData.avatar }} style={styles.avatar} /> */}
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.email}>{profileData.email}</Text>
          {/* <Text style={styles.bio}>{profileData.bio}</Text> */}
          {/* <Text style={styles.location}>Location: {profileData.location}</Text> */}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default Profile;
