import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Avatar, IconButton, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const [autoSave, setAutoSave] = React.useState(true);

    const StatItem = (value, label) => (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const SettingItem = ({ icon, title, subtitle, value, isLast, color = COLORS.text, showSwitch, onToggle }) => (
        <View>
            <TouchableOpacity style={styles.settingRow} disabled={showSwitch}>
                <View style={styles.settingLeft}>
                    <View style={styles.iconBox}>
                        <Ionicons name={icon} size={20} color={COLORS.primary} />
                    </View>
                    <View>
                        <Text style={[styles.settingTitle, { color }]}>{title}</Text>
                        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                        {value && <Text style={styles.settingValueText}>{value}</Text>}
                    </View>
                </View>
                {showSwitch ? (
                    <Switch
                        value={autoSave}
                        onValueChange={onToggle}
                        trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                        thumbColor={COLORS.white}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                )}
            </TouchableOpacity>
            {!isLast && <Divider style={styles.divider} />}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={COLORS.gradient} style={styles.headerGradient}>
                    <Text style={styles.screenTitle}>Profile</Text>

                    <View style={styles.profileCard}>
                        <View style={styles.profileTop}>
                            <View style={styles.avatarContainer}>
                                <Avatar.Image
                                    size={64}
                                    source={{ uri: user?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' }}
                                />
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user?.name || 'Alex Rivera'}</Text>
                                <Text style={styles.userEmail}>{user?.email || 'alex.rivera@gmail.com'}</Text>
                                <View style={styles.proBadge}>
                                    <Ionicons name="ribbon" size={12} color="#fbbf24" style={{ marginRight: 4 }} />
                                    <Text style={styles.proText}>PRO</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.statsDivider} />

                        <View style={styles.statsRow}>
                            {StatItem("3", "Projects")}
                            {StatItem("12", "Tasks")}
                            {StatItem("6", "Artifacts")}
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.sectionCard}>
                        <SettingItem icon="sunny-outline" title="Theme" value="Light Mode" isLast={true} />
                    </View>

                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.sectionCard}>
                        <SettingItem icon="notifications-outline" title="Notifications" subtitle="Manage notification settings" />
                        <SettingItem icon="earth-outline" title="Language" value="English (US)" />
                        <SettingItem icon="color-palette-outline" title="App Accent Color" value="Purple gradient" />
                        <SettingItem icon="save-outline" title="Auto-Save" showSwitch={true} onToggle={() => setAutoSave(!autoSave)} isLast={true} />
                    </View>

                    <Text style={styles.sectionTitle}>Account & Security</Text>
                    <View style={styles.sectionCard}>
                        <SettingItem icon="shield-checkmark-outline" title="Security Settings" subtitle="Password, 2FA, sessions" />
                        <SettingItem icon="key-outline" title="API Keys" subtitle="Manage API access" />
                        <SettingItem icon="mail-outline" title="Email Preferences" subtitle="Communication settings" isLast={true} />
                    </View>

                    <Text style={styles.sectionTitle}>Data & Privacy</Text>
                    <View style={styles.sectionCard}>
                        <SettingItem icon="settings-outline" title="General Settings" subtitle="App preferences" />
                        <SettingItem icon="download-outline" title="Export Data" subtitle="Download your projects" />
                        <SettingItem icon="trash-outline" title="Delete Account" subtitle="Permanently remove account" color={COLORS.error} isLast={true} />
                    </View>

                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.sectionCard}>
                        <SettingItem icon="help-circle-outline" title="Help Center" isLast={true} />
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerGradient: {
        padding: SIZES.padding,
        paddingTop: 40,
        paddingBottom: 60,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 20,
    },
    profileCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        padding: 4,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    userEmail: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 2,
    },
    proBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.4)',
    },
    proText: {
        color: '#fbbf24',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    statsDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 4,
    },
    settingsSection: {
        padding: SIZES.padding,
        marginTop: -40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 24,
        marginBottom: 12,
        paddingLeft: 4,
    },
    sectionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    settingSubtitle: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    settingValueText: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    divider: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginHorizontal: 16,
    },
    logoutButton: {
        marginTop: 40,
        marginBottom: 60,
        alignItems: 'center',
    },
    logoutText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;
