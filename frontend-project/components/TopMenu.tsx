import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use Ionicons for the icons
import { useRouter } from 'expo-router';

const TopMenu = ({ username, greeting, hasNotifications }: any) => {
  const router = useRouter();
  const hour = new Date().getHours();
  const iconName = hour < 12 ? 'sunny-outline' : 'moon-outline'; // Sun for morning, moon for night
  const iconColor = hour < 12 ? '#fdb15a' : '#fdb15a'; // Orange for day, blue for night

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.greetingContainer}>
          <Ionicons name={iconName} size={20} color={iconColor} />
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.weeklyPlanButton}
        onPress={() => router.push('/weekly-plan')}
      >
        <Ionicons name="calendar-outline" size={16} color="#fff" />
        <Text style={styles.weeklyPlanText}>Weekly Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftSection: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  greetingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333', // A darker grey for better contrast
  },
  username: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fdb15a', // Use blue for the username
  },
  weeklyPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdb15a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  weeklyPlanText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  notificationContainer: {
    position: 'relative', // To position the notification dot
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'yellow', // Yellow dot for notifications
  },
});

export default TopMenu;
