import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import AuthService from '../../Services/authService';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const router = useRouter();

    const otpRefs = useRef<Array<TextInput | null>>([]);

    const handleOtpChange = (index: number, value: string) => {
        const newOtp = [...otp];
        const validValue = value.replace(/[^0-9]/g, '');
        newOtp[index] = validValue.slice(-1);
        setOtp(newOtp);

        if (validValue && index < 4) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleEmailSubmit = async () => {
        try {
            await AuthService.sendOtp(email);
            Alert.alert('Success', 'OTP sent to your email.');
            setStep(2);
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP. Please check your email.');
            console.error(error);
        }
    };

    const handleOtpVerify = async () => {
        const otpString = otp.join('');
        console.log("OTP provided for verification:", otpString);

        try {
            await AuthService.verifyOtp(email, otpString);
            Alert.alert('Success', 'OTP verified. Please set a new password.');
            setStep(3);
        } catch (error) {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
            console.error("Error verifying OTP:", error);
        }
    };

    const handleResetPassword = async () => {
        try {
            await AuthService.resetPassword(email, newPassword);
            Alert.alert('Success', 'Password reset successful. You can now log in.');
            router.push('/login');
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
                    />
                )}

                {/* OTP Inputs */}
                {step === 2 && (
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref: TextInput | null) => otpRefs.current[index] = ref}
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

                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.link}>
                        Remember your password? Log in here
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
        width: '18%',
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F7F7F7',
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
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
        backgroundColor: '#FF8C00',
        borderRadius: 8,
        paddingVertical: 12,
        marginVertical: 16,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        textAlign: 'center',
        color: '#FF8C00',
        marginTop: 16,
    },
}); 