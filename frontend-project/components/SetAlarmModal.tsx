import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform, ScrollView, FlatList, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { setAlarm, fetchRecipes } from '../Services/authService';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Recipe } from '../types/index'; // Import Recipe from types

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

interface SetAlarmModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAlarmSet: (reminderData: {
        reminderEnabled: boolean;
        reminderTime: string;
        expoPushToken: string | null;
    }) => Promise<void>;
    recipe: Recipe | null;
}

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other'];

export default function SetAlarmModal({ isVisible, onClose, onAlarmSet, recipe }: SetAlarmModalProps) {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [scheduledDate, setScheduledDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const loadRecipes = async () => {
                try {
                    setLoadingRecipes(true);
                    const data = await fetchRecipes();
                    setRecipes(data);
                } catch (error) {
                    console.error("Error fetching recipes for alarm modal:", error);
                    Alert.alert("Error", "Failed to load recipes. Please try again.");
                } finally {
                    setLoadingRecipes(false);
                }
            };
            loadRecipes();
            // Reset form when modal opens
            setSelectedRecipe(null);
            setScheduledDate(new Date());
            setSelectedMealType(null);
        }
    }, [isVisible]);

    const onChangeDate = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || scheduledDate;
        setShowDatePicker(Platform.OS === 'ios');
        setScheduledDate(currentDate);
    };

    const onChangeTime = (event: any, selectedTime: Date | undefined) => {
        const currentTime = selectedTime || scheduledDate;
        setShowTimePicker(Platform.OS === 'ios');
        setScheduledDate(currentTime);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setShowTimePicker(true);
    };

    const handleSetAlarm = async () => {
        if (!selectedRecipe || !selectedMealType) {
            Alert.alert('Error', 'Please select a recipe and meal type.');
            return;
        }

        // Validate scheduled time
        const now = new Date();
        if (scheduledDate <= now) {
            Alert.alert('Error', 'Please select a future time for your alarm.');
            return;
        }

        setSubmitting(true);
        try {
            // Request notification permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('Permission required', 'Please grant notification permissions to set alarms.');
                setSubmitting(false);
                return;
            }

            // Get the project ID from app.json
            // console.log('Full Constants.expoConfig:', JSON.stringify(Constants.expoConfig, null, 2));
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            console.log('Project ID:', projectId); // Debug log

            if (!projectId) {
                console.error('Project ID not found in app configuration');
                throw new Error('Unable to set up notifications. Please try again later.');
            }

            let expoPushToken;
            try {
                expoPushToken = (await Notifications.getExpoPushTokenAsync({
                    projectId: projectId
                })).data;
                // console.log('Push token generated:', expoPushToken); // Debug log
            } catch (tokenError) {
                console.error('Error generating push token:', tokenError);
                throw new Error('Failed to set up notifications. Please try again.');
            }
            // console.log(`select image ${selectedRecipe.imageUrl}`)

            const alarmData = {
                recipeId: Number(selectedRecipe.id),
                title: 'Meal Reminder',
                body: `It's time to cook ${selectedRecipe.name}! Your ${selectedMealType} meal.`,
                recipeName: selectedRecipe.name,
                recipeImage: selectedRecipe.imageUrl,
                scheduleTime: scheduledDate.toISOString(),
                expoPushToken: expoPushToken,
                mealType: selectedMealType,
            };

            await setAlarm(alarmData);
            await onAlarmSet({
                reminderEnabled: true,
                reminderTime: scheduledDate.toISOString(),
                expoPushToken: expoPushToken,
            });
            Alert.alert(
                'Success',
                `Alarm set for ${selectedRecipe.name} - ${selectedMealType} at ${scheduledDate.toLocaleTimeString()}!`,
                [{
                    text: 'OK', onPress: () => {
                        onClose();
                    }
                }]
            );
        } catch (error: any) {
            console.error("Error setting alarm:", error);
            Alert.alert(
                "Error setting alarm",
                error.message || "Failed to set alarm. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={[styles.recipeItem, selectedRecipe?.id === item.id && styles.selectedRecipeItem]}
            onPress={() => setSelectedRecipe(item)}
        >
            <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/50' }} style={styles.recipeItemImage} />
            <Text style={styles.recipeItemText}>{item.name}</Text>
            {selectedRecipe?.id === item.id && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkmarkIcon} />}
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Set Meal Alarm</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.label}>Select Recipe:</Text>
                        {loadingRecipes ? (
                            <ActivityIndicator size="small" color="#fdb15a" />
                        ) : (
                            <FlatList
                                data={recipes}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderRecipeItem}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.recipeList}
                            />
                        )}

                        <Text style={styles.label}>Meal Type:</Text>
                        <View style={styles.mealTypeContainer}>
                            {mealTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.mealTypeButton, selectedMealType === type && styles.selectedMealTypeButton]}
                                    onPress={() => setSelectedMealType(type)}
                                >
                                    <Text style={[styles.mealTypeButtonText, selectedMealType === type && styles.selectedMealTypeButtonText]}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Scheduled Date & Time:</Text>
                        <View style={styles.dateTimeContainer}>
                            <TouchableOpacity onPress={showDatepicker} style={styles.dateTimeButton}>
                                <Ionicons name="calendar-outline" size={20} color="#fdb15a" />
                                <Text style={styles.dateTimeButtonText}>{scheduledDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showTimepicker} style={styles.dateTimeButton}>
                                <Ionicons name="time-outline" size={20} color="#fdb15a" />
                                <Text style={styles.dateTimeButtonText}>{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                testID="datePicker"
                                value={scheduledDate}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                        {showTimePicker && (
                            <DateTimePicker
                                testID="timePicker"
                                value={scheduledDate}
                                mode="time"
                                display="default"
                                onChange={onChangeTime}
                            />
                        )}

                        <TouchableOpacity
                            style={styles.setAlarmButton}
                            onPress={handleSetAlarm}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.setAlarmButtonText}>Set Alarm</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fdb15a',
        padding: 18,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 5,
    },
    scrollViewContent: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        fontWeight: 'bold',
        marginTop: 15,
    },
    recipeList: {
        paddingVertical: 5,
        marginBottom: 15,
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedRecipeItem: {
        borderColor: '#fdb15a',
    },
    recipeItemImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
    },
    recipeItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    checkmarkIcon: {
        marginLeft: 10,
    },
    mealTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    mealTypeButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    selectedMealTypeButton: {
        backgroundColor: '#fdb15a',
    },
    mealTypeButtonText: {
        color: '#555',
        fontWeight: '600',
    },
    selectedMealTypeButtonText: {
        color: '#fff',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    dateTimeButtonText: {
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    setAlarmButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    setAlarmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 