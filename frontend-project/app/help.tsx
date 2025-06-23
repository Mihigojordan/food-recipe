import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpAndSupportScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
            </View>
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions (FAQs)</Text>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Q: How do I add a recipe to my weekly plan?</Text>
                    <Text style={styles.faqAnswer}>A: Navigate to the 'Weekly Plan' section, select a day and meal type, and then choose a recipe to add.</Text>
                </View>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Q: Can I share my recipes with friends?</Text>
                    <Text style={styles.faqAnswer}>A: Currently, recipe sharing is under development. Stay tuned for updates!</Text>
                </View>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Q: How do I reset my password?</Text>
                    <Text style={styles.faqAnswer}>A: You can reset your password from the login screen by tapping 'Forgot Password?', or from your Profile page by selecting 'Change Password'.</Text>
                </View>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <Text style={styles.contactText}>If you need further assistance, please reach out to us:</Text>
                <TouchableOpacity style={styles.contactButton} onPress={() => { /* Implement email functionality */ }}>
                    <Ionicons name="mail-outline" size={24} color="#fdb15a" />
                    <Text style={styles.contactButtonText}>Send us an Email</Text>
                </TouchableOpacity>
                <Text style={styles.contactText}>Or visit our website: www.yourrecipeapp.com</Text>

                <Text style={styles.sectionTitle}>Legal Information</Text>
                <TouchableOpacity onPress={() => { /* Navigate to Privacy Policy */ }}>
                    <Text style={styles.legalLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* Navigate to Terms of Service */ }}>
                    <Text style={styles.legalLink}>Terms of Service</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fdb15a',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 20,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fdb15a',
        marginBottom: 5,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#555',
    },
    contactText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fdb15a',
        marginBottom: 15,
        justifyContent: 'center',
    },
    contactButtonText: {
        color: '#fdb15a',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    legalLink: {
        fontSize: 15,
        color: '#fdb15a',
        marginBottom: 5,
        textDecorationLine: 'underline',
    },
});