import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fetchProfileData, logout, deleteAccount, fetchWeeklyPlan } from '../../Services/authService';
import EditProfileModal from '../../components/EditProfileModal';
import ChangePasswordModal from '../../components/ChangePasswordModal'; // Import the new password modal
import { WeeklyPlanData } from '../../context/RecipeContext'; // Import WeeklyPlanData

export default function ProfileScreen() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // State for password modal
    const [weeklyPlanRecipesCount, setWeeklyPlanRecipesCount] = useState(0);

    // Helper function to get the start of the current week (Monday)
    const getStartOfWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
        const monday = new Date(today.setDate(diff));
        // Format as YYYY-MM-DD
        return monday.toISOString().split('T')[0];
    };

    const loadProfileData = async () => {
        try {
            setLoading(true);
            const profileData = await fetchProfileData();
            setUserData(profileData);
            console.log('Profile of current user:', profileData);

            // Dynamically determine the start of the current week
            const currentWeekStartDate = getStartOfWeek();
            console.log('Fetching weekly plan for start date:', currentWeekStartDate);

            // Fetch and count recipes from weekly plan using the dynamic date
            const weeklyPlanData: WeeklyPlanData = await fetchWeeklyPlan(currentWeekStartDate);
            console.log('Weekly plan data:', weeklyPlanData);

            // Initialize count to 0
            let recipeCount = 0;

            // Only process if weeklyPlanData is not empty
            if (Object.keys(weeklyPlanData).length > 0) {
                const uniqueRecipeIds = new Set<number>();
                Object.values(weeklyPlanData).forEach(dayPlan => {
                    if (dayPlan) {
                        Object.values(dayPlan).forEach(mealEntry => {
                            if (mealEntry?.recipe?.id) {
                                uniqueRecipeIds.add(Number(mealEntry.recipe.id));
                            }
                        });
                    }
                });
                recipeCount = uniqueRecipeIds.size;
                console.log('Unique recipes found in weekly plan:', recipeCount);
            } else {
                console.log('No weekly plan data available for this week.');
            }

            setWeeklyPlanRecipesCount(recipeCount);

        } catch (err: any) {
            console.error("Failed to fetch profile data or weekly plan:", err);
            setError(err.message || "Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfileData();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await logout();
                            // router.push('/login')

                        } catch (err: any) {
                            console.error("Logout failed:", err);
                            Alert.alert("Logout Error", err.message || "Failed to log out.");
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    // Function to update user data after modal submission
    const handleProfileUpdated = (updatedUser: any) => {
        setUserData(updatedUser);
        setShowEditModal(false);
    };

    const menuItems = [
        {
            icon: 'heart-outline',
            title: 'Favorite Recipes',
            onPress: () => router.push('/favorites'),
        },
        {
            icon: 'time-outline',
            title: 'Cooking History',
            onPress: () => router.push('/history'),
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            onPress: () => router.push('/alarm'), // Assuming /alarm is for notifications
        },
        {
            icon: 'settings-outline',
            title: 'Settings',
            onPress: () => router.push('/settings'),
        },
        {
            icon: 'lock-closed-outline',
            title: 'Change Password',
            onPress: () => setShowChangePasswordModal(true), // Open password modal
        },
        {
            icon: 'help-circle-outline',
            title: 'Help & Support',
            onPress: () => router.push('/help'),
        },
        {
            icon: 'trash-outline',
            title: 'Delete Account',
            onPress: () => Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            try {
                                await deleteAccount();
                                Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                            } catch (err: any) {
                                console.error("Account deletion failed:", err);
                                Alert.alert("Deletion Error", err.message || "Failed to delete account.");
                            }
                        },
                    },
                ],
                { cancelable: true }
            ),
        },
    ];

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#fdb15a" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centeredContainer}>
                <Ionicons name="close-circle-outline" size={50} color="#ff4444" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <Image
                        source={{ uri: userData?.profileImage || 'https://via.placeholder.com/150/FFD700/FFFFFF?text=JD' }} // Placeholder image
                        style={styles.profileImage}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userData?.username || 'Guest User'}</Text>
                        <Text style={styles.userEmail}>{userData?.email || 'guest@example.com'}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setShowEditModal(true)} // Open edit profile modal
                >
                    <Ionicons name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Stats Container */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{weeklyPlanRecipesCount.toString()}</Text>
                    <Text style={styles.statLabel}>Plan Recipes</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{(userData?.favoritesCount || 0).toString()}</Text>
                    <Text style={styles.statLabel}>Favorites</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{(userData?.reviewsCount || 0).toString()}</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name={item.icon as any} size={24} color="#fdb15a" />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            {/* Modals */}
            {userData && (
                <EditProfileModal
                    isVisible={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    userData={userData}
                    onProfileUpdated={handleProfileUpdated}
                />
            )}
            <ChangePasswordModal
                isVisible={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: '#ff4444',
        textAlign: 'center',
        marginHorizontal: 20,
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#fdb15a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fdb15a',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginRight: 15,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    editButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        marginLeft: -35,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 30,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fdb15a',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    menuContainer: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff6b6b',
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 40,
        paddingVertical: 15,
        borderRadius: 15,
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    logoutText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'bold',
    },
}); 