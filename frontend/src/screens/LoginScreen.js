import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, UIButton, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput as PaperInput } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const cleanUsername = username.trim();
            const cleanPassword = password.trim();

            if (!cleanUsername || !cleanPassword) {
                alert('Please enter both username and password');
                return;
            }

            if (isLogin) {
                await login(cleanUsername, cleanPassword);
            } else {
                await register(cleanUsername, cleanPassword);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Authentication Failed';
            alert(message);
            console.log('Auth Error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="log-in" color={COLORS.primary} size={48} />
                    </View>
                    <Text style={styles.title}>CodeMentor AI</Text>
                    <Text style={styles.subtitle}>{isLogin ? 'Welcome back! Login to continue.' : 'Create an username to get started.'}</Text>
                </View>

                <View style={styles.form}>
                    <PaperInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        mode="outlined"
                        style={styles.input}
                        textColor={COLORS.text}
                        outlineColor={COLORS.surface}
                        activeOutlineColor={COLORS.primary}
                        theme={{ colors: { surfaceVariant: COLORS.surface } }}
                        left={<PaperInput.Icon icon={() => <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />} />}
                    />

                    <PaperInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        mode="outlined"
                        style={styles.input}
                        textColor={COLORS.text}
                        outlineColor={COLORS.surface}
                        activeOutlineColor={COLORS.primary}
                        theme={{ colors: { surfaceVariant: COLORS.surface } }}
                        left={<PaperInput.Icon icon="lock" />}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.loginButton}
                        contentStyle={styles.loginButtonContent}
                        buttonColor={COLORS.primary}
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Button>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <Button
                        mode="outlined"
                        onPress={() => { }}
                        style={styles.socialButton}
                        textColor={COLORS.text}
                        icon={() => <Ionicons name="logo-github" size={20} color={COLORS.text} />}
                    >
                        Continue with Github
                    </Button>

                    <TouchableOpacity style={styles.footerLink} onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.footerText}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Text style={styles.linkText}>{isLogin ? 'Sign Up' : 'Login'}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SIZES.padding * 2,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: SIZES.fontExtraLarge,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: SIZES.fontMedium,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
        backgroundColor: COLORS.background,
    },
    loginButton: {
        marginTop: 8,
        borderRadius: SIZES.radius,
    },
    loginButtonContent: {
        paddingVertical: 8,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.surface,
    },
    dividerText: {
        marginHorizontal: 16,
        color: COLORS.textSecondary,
        fontSize: SIZES.fontSmall,
    },
    socialButton: {
        borderRadius: SIZES.radius,
        borderColor: COLORS.surface,
        borderWidth: 1,
    },
    footerLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.fontSmall,
    },
    linkText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
