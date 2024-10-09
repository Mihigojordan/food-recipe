import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import AuthService from '../Services/authService'; // Import the AuthService
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
    const [step, setStep] = useState(1); // Track the current step (1 for email, 2 for OTP, 3 for new password)
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']); // For OTP input
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();

    // Create an array of refs for OTP inputs
    const otpRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        const validValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
        newOtp[index] = validValue.slice(-1); // Allow only one character
        setOtp(newOtp);

        // Move focus to the next input if available
        if (validValue && index < 4) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleEmailSubmit = async () => {
        try {
            await AuthService.sendOtp(email); // Use the service to send OTP
            Alert.alert('Success', 'OTP sent to your email.');
            setStep(2); // Move to OTP input step
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP. Please check your email.');
            console.error(error);
        }
    };

    const handleOtpVerify = async () => {
        const otpString = otp.join('');
        console.log("OTP provided for verification:", otpString); // Log the OTP string

        try {
            await AuthService.verifyOtp(email, otpString); // Use the service to verify OTP
            Alert.alert('Success', 'OTP verified. Please set a new password.');
            setStep(3); // Move to new password input step
        } catch (error) {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
            console.error("Error verifying OTP:", error);
        }
    };

    const handleResetPassword = async () => {
        try {
            await AuthService.resetPassword(email, newPassword); // Use the service to reset password
            Alert.alert('Success', 'Password reset successful. You can now log in.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', 'Failed to reset password. Please try again.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {step === 1 ? 'Reset Your Password' : step === 2 ? 'Enter OTP' : 'Set New Password'}
                </Text>
                <Text style={styles.description}>
                    {step === 1 ? 'Enter your email to receive an OTP.' : step === 2 ? 'Please enter the OTP sent to your email.' : 'Please set your new password.'}
                </Text>

                {/* Email Input */}
                {step === 1 && (
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        required
                    />
                )}

                {/* OTP Inputs */}
                {step === 2 && (
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => otpRefs.current[index] = ref} // Assign ref to each input
                                style={styles.otpInput}
                                maxLength={1}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(index, value)}
                                keyboardType="numeric"
                            />
                        ))}
                    </View>
                )}

                {/* New Password Input */}
                {step === 3 && (
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New Password"
                        secureTextEntry
                        required
                    />
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpVerify : handleResetPassword}
                >
                    <Text style={styles.buttonText}>
                        {step === 1 ? 'Send OTP' : step === 2 ? 'Next' : 'Reset Password'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>
                        Remember your password? Log in here
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    card: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        textAlign: 'center',
        marginBottom: 16,
        color: '#666',
    },
    input: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        marginHorizontal: 10,
        backgroundColor: '#F7F7F7',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    otpInput: {
        width: '18%', // Adjust width for five inputs
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F7F7F7',
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5, // Add margin between OTP inputs
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        backgroundColor: '#FF8C00', // Orange color
        borderRadius: 8,
        paddingVertical: 12,
        marginVertical: 16,
        alignItems: 'center',
        elevation: 3, // Elevation for Android shadow
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        textAlign: 'center',
        color: '#007BFF',
        marginTop: 16,
    },
});

export default ForgotPasswordScreen;
