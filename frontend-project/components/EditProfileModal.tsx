import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile } from '../Services/authService';
import { UserData } from '../types';

interface EditProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    userData: UserData;
    onProfileUpdated: (updatedUser: UserData) => void;
}

export default function EditProfileModal({ isVisible, onClose, userData, onProfileUpdated }: EditProfileModalProps) {
    const [editableUsername, setEditableUsername] = useState(userData.username || '');
    const [editableEmail, setEditableEmail] = useState(userData.email || '');
    const [submittingProfile, setSubmittingProfile] = useState(false);

    useEffect(() => {
        // Reset state when modal opens with new userData or closes
        if (isVisible) {
            setEditableUsername(userData.username || '');
            setEditableEmail(userData.email || '');
        }
    }, [isVisible, userData]);

    const handleUpdateProfile = async () => {
        if (editableUsername === userData.username && editableEmail === userData.email) {
            Alert.alert('No Changes', 'No changes detected for profile update.');
            onClose();
            return;
        }

        setSubmittingProfile(true);
        try {
            const updatedUser = await updateProfile({ username: editableUsername, email: editableEmail });
            onProfileUpdated(updatedUser); // Notify parent component to update
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (err: any) {
            console.error("Profile update failed:", err);
            Alert.alert("Update Error", err.message || "Failed to update profile.");
        } finally {
            setSubmittingProfile(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.centeredView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Edit Profile Information</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={editableUsername}
                            onChangeText={setEditableUsername}
                            placeholder="Enter new username"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={editableEmail}
                            onChangeText={setEditableEmail}
                            placeholder="Enter new email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleUpdateProfile}
                            disabled={submittingProfile}
                        >
                            {submittingProfile ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.updateButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        maxHeight: '60%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fdb15a',
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
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
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fefefe',
    },
    updateButton: {
        backgroundColor: '#fdb15a',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 