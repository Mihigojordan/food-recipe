import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useRecipe, MealEntry } from '../context/RecipeContext';
import { Recipe } from '../types/index';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { fetchWeeklyPlan, addRecipeToWeeklyPlan, removeRecipeFromWeeklyPlan } from '../Services/authService';
import SetAlarmModal from '../components/SetAlarmModal';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner'] as const;

export default function WeeklyPlanScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { weeklyPlan, setMealPlanTarget, setWeeklyPlan, selectedRecipe, setSelectedRecipe } = useRecipe();
    const [loading, setLoading] = useState(true);
    const [showSetAlarmModal, setShowSetAlarmModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMealType, setSelectedMealType] = useState('');
    const [currentWeekStart, setCurrentWeekStart] = useState<string>('');

    useEffect(() => {
        // Get the start of the current week (Monday)
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        const monday = new Date(today.setDate(diff));
        const weekStart = monday.toISOString().split('T')[0];
        setCurrentWeekStart(weekStart);
        loadWeeklyPlan(weekStart);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            console.log('WeeklyPlanScreen: Screen focused. Params:', params);
            console.log('WeeklyPlanScreen: Selected Recipe from Context:', selectedRecipe);

            // Update local state from navigation params if they exist
            if (params.day && typeof params.day === 'string') {
                setSelectedDay(params.day);
            }
            if (params.mealType && typeof params.mealType === 'string') {
                setSelectedMealType(params.mealType);
            }

            // Use the potentially updated local state for modal logic
            if (selectedRecipe && (params.day || selectedDay) && (params.mealType || selectedMealType)) {
                setShowSetAlarmModal(true);
            } else {
                setShowSetAlarmModal(false);
            }

            // Clear params after processing, but only if a recipe was selected
            if (selectedRecipe) {
                router.setParams({});
            }

            return () => {
                // Cleanup when screen loses focus or unmounts
                // You might want to clear selectedRecipe here if the modal was dismissed
                // and no recipe was added, to prevent it from showing on next focus
                // if (showSetAlarmModal === false) { // Only clear if modal was actively dismissed
                //     setSelectedRecipe(null);
                // }
            };
        }, [selectedRecipe, params.day, params.mealType]) // Depend on selectedRecipe and direct params
    );

    const loadWeeklyPlan = async (weekStartDate?: string) => {
        try {
            setLoading(true);
            const data = await fetchWeeklyPlan(weekStartDate);
            console.log('Loaded weekly plan:', data);
            setWeeklyPlan(data);
        } catch (error) {
            console.error('Error loading weekly plan:', error);
            Alert.alert('Error', 'Failed to load weekly plan');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecipePress = useCallback((day: string, mealType: string) => {
        setSelectedDay(day);
        setSelectedMealType(mealType);
        router.push({
            pathname: '/(app)/recipes/list',
            params: {
                returnTo: 'weekly-plan',
                day,
                mealType
            }
        });
    }, [router]);

    const handleRecipeSelected = useCallback(async (recipe: Recipe) => {
        try {
            setSelectedRecipe(recipe);
            setShowSetAlarmModal(true);
        } catch (error) {
            console.error('Error selecting recipe:', error);
            Alert.alert('Error', 'Failed to select recipe');
        }
    }, []);

    const handleAlarmSet = async (reminderData: {
        reminderEnabled: boolean;
        reminderTime: string;
        expoPushToken: string | null;
    }) => {
        try {
            if (!selectedRecipe || !selectedDay || !selectedMealType) {
                throw new Error('Missing required data');
            }

            console.log('Adding recipe to plan:', {
                day: selectedDay,
                mealType: selectedMealType,
                recipeId: Number(selectedRecipe.id),
                weekStartDate: currentWeekStart,
                reminderEnabled: reminderData.reminderEnabled,
                reminderTime: reminderData.reminderTime,
                expoPushToken: reminderData.expoPushToken
            });

            await addRecipeToWeeklyPlan({
                day: selectedDay,
                mealType: selectedMealType,
                recipeId: Number(selectedRecipe.id),
                weekStartDate: currentWeekStart,
                reminderEnabled: reminderData.reminderEnabled,
                reminderTime: reminderData.reminderTime,
                expoPushToken: reminderData.expoPushToken
            });

            await loadWeeklyPlan(currentWeekStart);
            setShowSetAlarmModal(false);
            setSelectedRecipe(null);
            Alert.alert('Success', 'Recipe added to weekly plan');
            router.setParams({}); // Clear params AFTER successful addition and modal dismissal
        } catch (error) {
            console.error('Error adding recipe to plan:', error);
            Alert.alert('Error', 'Failed to add recipe to plan');
        }
    };

    const handleRemoveRecipePress = useCallback(async (day: string, mealType: string) => {
        try {
            await removeRecipeFromWeeklyPlan({
                day,
                mealType,
            });
            await loadWeeklyPlan();
        } catch (error) {
            console.error('Error removing recipe:', error);
            Alert.alert('Error', 'Failed to remove recipe from plan');
        }
    }, []);

    const handleShareWeeklyPlan = async () => {
        try {
            let shareMessage = 'Check out my weekly meal plan!';
            if (weeklyPlan) {
                Object.entries(weeklyPlan).forEach(([day, meals]: [string, any]) => {
                    shareMessage += `\n${day}:\n`;
                    mealTypes.forEach(mealType => {
                        const entry: MealEntry = meals[mealType];
                        if (entry && entry.recipe) {
                            shareMessage += `  ${mealType}: ${entry.recipe.name}\n`;
                        } else {
                            shareMessage += `  ${mealType}: (No recipe)\n`;
                        }
                    });
                });
            } else {
                shareMessage += 'It\'s currently empty, but I\'m filling it up with delicious recipes!';
            }

            await Share.share({
                message: shareMessage,
                title: 'My Weekly Meal Plan',
            });
        } catch (error) {
            console.error('Error sharing weekly plan:', error);
            Alert.alert('Error', 'Failed to share weekly plan.');
        }
    };

    const renderRecipeEntry = useCallback((day: string, mealType: string) => {
        const entry = (weeklyPlan as any)[day]?.[mealType];

        if (entry?.recipe) {
            return (
                <Animated.View
                    entering={FadeIn}
                    layout={Layout}
                    style={styles.recipeEntry}
                >
                    <Image
                        source={{ uri: entry.recipe.imageUrl }}
                        style={styles.recipeImage}
                    />
                    <View style={styles.recipeInfo}>
                        <Text style={styles.recipeName} numberOfLines={1}>
                            {entry.recipe.name}
                        </Text>
                        <View style={styles.cookingTimeContainer}>
                            <Ionicons name="timer-outline" size={14} color="#fdb15a" />
                            <Text style={styles.cookingTime}>
                                {entry.recipe.cookingTime === 'N/A'
                                    ? 'N/A'
                                    : `${entry.recipe.cookingTime} min`}
                            </Text>
                        </View>
                        {entry.reminderEnabled && (
                            <View style={styles.reminderBadge}>
                                <Ionicons name="alarm-outline" size={14} color="#4CAF50" />
                                <Text style={styles.reminderText}>
                                    {new Date(entry.reminderTime).toLocaleTimeString()}
                                </Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveRecipePress(day, mealType)}
                    >
                        <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </TouchableOpacity>
                </Animated.View>
            );
        }
        return (
            <TouchableOpacity
                style={styles.addRecipeButton}
                onPress={() => handleAddRecipePress(day, mealType)}
            >
                <Ionicons name="add-circle-outline" size={20} color="#fdb15a" />
                <Text style={styles.addRecipeButtonText}>Add Recipe</Text>
            </TouchableOpacity>
        );
    }, [weeklyPlan, handleRemoveRecipePress, handleAddRecipePress]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading weekly plan...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.push('/(app)')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Weekly Meal Plan</Text>
                <TouchableOpacity onPress={handleShareWeeklyPlan} style={styles.shareButton}>
                    <Ionicons name="share-social-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            {daysOfWeek.map(day => (
                <View key={day} style={styles.dayContainer}>
                    <Text style={styles.dayHeader}>{day}</Text>
                    {mealTypes.map(mealType => (
                        <View key={mealType} style={styles.mealSlot}>
                            <Text style={styles.mealTypeText}>{mealType}</Text>
                            {renderRecipeEntry(day, mealType)}
                        </View>
                    ))}
                </View>
            ))}

            <SetAlarmModal
                isVisible={showSetAlarmModal}
                onClose={() => {
                    setShowSetAlarmModal(false);
                    setSelectedRecipe(null);
                }}
                onAlarmSet={handleAlarmSet}
                recipe={selectedRecipe}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fdb15a',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 5,
    },
    shareButton: {
        padding: 5,
    },
    dayContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dayHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fdb15a',
    },
    mealSlot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    mealTypeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    recipeEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff8f0',
        borderRadius: 8,
        padding: 8,
        flex: 1,
        marginLeft: 10,
    },
    recipeImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    recipeInfo: {
        flex: 1,
        marginRight: 8,
    },
    recipeName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    cookingTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cookingTime: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    reminderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    reminderText: {
        fontSize: 12,
        color: '#4CAF50',
        marginLeft: 4,
    },
    removeButton: {
        padding: 4,
    },
    addRecipeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addRecipeButtonText: {
        marginLeft: 5,
        color: '#fdb15a',
        fontWeight: '600',
    }
});