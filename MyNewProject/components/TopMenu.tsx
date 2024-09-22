// TopMenu.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package if not already done

const TopMenu = ({ username, greeting }:any) => {
  const hour = new Date().getHours();
  const iconName = hour < 12 ? 'sunny-outline' : 'moon-outline'; // Sun icon for morning, moon for night

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Ionicons name={iconName} size={24} color="#000" />
        <Text style={styles.greetingText}>{greeting}</Text>
      </View>
      <View style={styles.usernameContainer}>
        <Text style={styles.username}>{username}</Text>
      </View>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    marginLeft: 5,
    fontSize: 18,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  username: {
    fontWeight: 'bold',
    color: '#007BFF', // Change color as needed
  },
  menuButton: {
    padding: 10,
  },
});

export default TopMenu;
