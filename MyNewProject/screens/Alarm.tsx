import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Share } from 'react-native';
import { fetchNotifications } from '../Services/authService'; // Import your fetchNotifications service

const Alarm: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  const renderNotification = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>It's time to take this:</Text>
      <Text style={styles.recipeName}>{item.recipeName}</Text>
      <Text style={styles.scheduledTime}>
        Scheduled Time: {new Date(item.scheduledTime).toLocaleString()}
      </Text>
      <Button color="#FFA500" title="Share" onPress={() => shareScheduledTime(item)} />
    </View>
  );

  const shareScheduledTime = async (item: any) => {
    try {
      const result = await Share.share({
        message: `It's time to cook ${item.recipeName}! Scheduled at: ${new Date(item.scheduledTime).toLocaleString()}`,
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()} // Assuming notifications have a unique `id`
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduledTime: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Alarm;
