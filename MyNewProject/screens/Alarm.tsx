import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Share, Alert } from 'react-native';
import { fetchNotifications, deleteNotification } from '../Services/authService'; // Import delete service

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

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await deleteNotification(id); // Call delete service
              setNotifications((prevNotifications) =>
                prevNotifications.filter((notification) => notification.id !== id)
              ); // Update UI
              console.log('Notification deleted successfully');
              Alert.alert(
                'notification deleted successfully',
              )

            } catch (error) {
              console.error('Error deleting notification:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderNotification = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>It's time to prepare your meal :</Text>
      <Text style={styles.recipeName}>{item.recipeName}</Text>
      <Text style={styles.scheduledTime}>
        Scheduled Time: {new Date(item.scheduledTime).toLocaleString()}
      </Text>
      <View style={styles.buttonGroup}>
        <Button color="#FFA500" title="Share" onPress={() => shareScheduledTime(item)} />
        <Button color="#FF0000" title="Delete" onPress={() => handleDelete(item.id)} />
      </View>
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
      width: 4,
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {

    // backgroundColor: '#1e90ff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    minWidth: 100,
  }
});

export default Alarm;
