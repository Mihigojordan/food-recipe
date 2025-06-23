import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, Alert, Image, ScrollView } from 'react-native';
import { fetchNotifications, deleteNotification } from '../../Services/authService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SetAlarmModal from '../../components/SetAlarmModal';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other', 'All'];
const statusFilters = ['pending', 'sent', 'failed', 'All'];

const AlarmScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showSetAlarmModal, setShowSetAlarmModal] = useState(false);
    const [selectedMealTypeFilter, setSelectedMealTypeFilter] = useState('All');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
    const router = useRouter();

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            Alert.alert("Error", "Failed to load notifications.");
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const filteredNotifications = React.useMemo(() => {
        return notifications.filter((notification) => {
            const matchesMealType = selectedMealTypeFilter === 'All' || notification.mealType === selectedMealTypeFilter;
            const matchesStatus = selectedStatusFilter === 'All' || notification.status === selectedStatusFilter;
            return matchesMealType && matchesStatus;
        });
    }, [notifications, selectedMealTypeFilter, selectedStatusFilter]);

    const handleAlarmSet = async (reminderData: {
        reminderEnabled: boolean;
        reminderTime: string;
        expoPushToken: string | null;
    }) => {
        await loadNotifications();
    };

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
                            await deleteNotification(id);
                            setNotifications((prevNotifications) =>
                                prevNotifications.filter((notification) => notification.id !== id)
                            );
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

    const renderNotification = ({ item }: { item: any }) => {
        // console.log('Notification item:', item);
        //  console.log('Recipe image URL:', item.recipeImage);

        return (
            <View style={styles.card}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="close-circle" size={24} color="#ff6b6b" />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.recipeImage || 'https://via.placeholder.com/100/FFD700/FFFFFF?text=Recipe' }}
                        style={styles.recipeImage}
                        resizeMode="cover"
                        onError={(e) => {
                            console.error('Image loading error:', e.nativeEvent.error);
                            console.log('Failed image URL:', item.recipeImage);
                        }}
                    />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Meal Reminder:</Text>
                    <Text style={styles.recipeName}>{item.recipeName}</Text>
                    <Text style={styles.mealTypeBadge}>{item.mealType}</Text>
                    <Text style={styles.scheduledTime}>
                        <Ionicons name="time-outline" size={16} color="#666" /> {new Date(item.scheduledTime).toLocaleString()}
                    </Text>
                    <Text style={[styles.statusBadge, item.status === 'pending' ? styles.statusPending : item.status === 'sent' ? styles.statusSent : styles.statusFailed]}>
                        Status: {item.status}
                    </Text>
                </View>
                <TouchableOpacity style={styles.shareButton} onPress={() => shareScheduledTime(item)}>
                    <Ionicons name="share-outline" size={24} color="#fdb15a" />
                    <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const shareScheduledTime = async (item: any) => {
        try {
            const result = await Share.share({
                message: `It\'s time to cook ${item.recipeName}! Scheduled at: ${new Date(item.scheduledTime).toLocaleString()}`,
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
            <Text style={styles.header}>Your Meal Alarms</Text>

            <TouchableOpacity style={styles.setAlarmButton} onPress={() => setShowSetAlarmModal(true)}>
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.setAlarmButtonText}>Set New Alarm</Text>
            </TouchableOpacity>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
                    {mealTypes.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterButton, selectedMealTypeFilter === type && styles.selectedFilterButton]}
                            onPress={() => setSelectedMealTypeFilter(type)}
                        >
                            <Text style={[styles.filterButtonText, selectedMealTypeFilter === type && styles.selectedFilterButtonText]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
                    {statusFilters.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[styles.filterButton, selectedStatusFilter === status && styles.selectedFilterButton]}
                            onPress={() => setSelectedStatusFilter(status)}
                        >
                            <Text style={[styles.filterButtonText, selectedStatusFilter === status && styles.selectedFilterButtonText]}>{status}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {filteredNotifications.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <Ionicons name="notifications-off-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyStateText}>No alarms found matching your filters!</Text>
                    <Text style={styles.emptyStateSubText}>Try adjusting your filter settings or setting a new alarm.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredNotifications}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContentContainer}
                />
            )}

            <SetAlarmModal
                isVisible={showSetAlarmModal}
                onClose={() => setShowSetAlarmModal(false)}
                onAlarmSet={handleAlarmSet}
                recipe={null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 50,
        marginBottom: 25,
        textAlign: 'center',
    },
    setAlarmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    setAlarmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    filterContainer: {
        marginBottom: 15,
    },
    filterScrollView: {
        paddingVertical: 5,
    },
    filterButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
    },
    selectedFilterButton: {
        backgroundColor: '#fdb15a',
    },
    filterButtonText: {
        color: '#555',
        fontWeight: '600',
    },
    selectedFilterButtonText: {
        color: '#fff',
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        position: 'relative',
        overflow: 'hidden',
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        padding: 5,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    recipeImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2,
    },
    recipeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    mealTypeBadge: {
        backgroundColor: '#fdb15a',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    scheduledTime: {
        fontSize: 13,
        color: '#666',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    statusBadge: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    statusPending: {
        backgroundColor: '#ffe0b2',
        color: '#fb8c00',
    },
    statusSent: {
        backgroundColor: '#c8e6c9',
        color: '#43a047',
    },
    statusFailed: {
        backgroundColor: '#ffcdd2',
        color: '#e53935',
    },
    shareButton: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 5,
        marginLeft: 10,
    },
    shareButtonText: {
        fontSize: 12,
        color: '#fdb15a',
        marginTop: 3,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateSubText: {
        fontSize: 15,
        color: '#777',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default AlarmScreen; 