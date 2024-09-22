import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CategoryDetail = ({ route, navigation }: any) => {
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Detail for Category ID: {id}</Text>
      <Button title="Go Back to Dashboard" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',      // Center content horizontally
    backgroundColor: '#f5f5f5', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // Space below title
  },
});

export default CategoryDetail;
