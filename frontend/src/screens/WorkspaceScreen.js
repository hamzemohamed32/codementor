import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Avatar, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const WorkspaceScreen = () => {
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetchProjectDetails();
    }, []);

    const fetchProjectDetails = async () => {
        try {
            // Mocking dynamic fetch
            const res = await api.get('/projects/mock-id');
            setProject(res.data);
        } catch (err) {
            setProject(mockProject);
        }
    };

    const FeatureCard = ({ icon, title, subtitle, color }) => (
        <TouchableOpacity style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureSubtitle}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={COLORS.gradient} style={styles.header}>
                    <View style={styles.headerTop}>
                        <IconButton icon="arrow-left" iconColor={COLORS.white} size={24} />
                        <View style={styles.headerActions}>
                            <IconButton icon="share-variant" iconColor={COLORS.white} size={20} />
                            <IconButton icon="cog" iconColor={COLORS.white} size={20} />
                        </View>
                    </View>

                    <View style={styles.projectInfo}>
                        <View style={styles.projectIconLarge}>
                            <Ionicons name="code-slash-outline" size={40} color={COLORS.white} />
                        </View>
                        <Text style={styles.projectTitle}>{project?.title || 'E-commerce App'}</Text>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>In Development</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <Text style={styles.description}>
                            {project?.description || 'Building a comprehensive e-commerce platform with real-time inventory management and secure payment integration.'}
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNum}>24</Text>
                            <Text style={styles.statLabel}>Days in</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNum}>86</Text>
                            <Text style={styles.statLabel}>Commits</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNum}>12</Text>
                            <Text style={styles.statLabel}>Tasks</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Resources</Text>
                    <View style={styles.featuresGrid}>
                        <FeatureCard icon="server-outline" title="Database" subtitle="MongoDB Atlas" color={COLORS.success} />
                        <FeatureCard icon="rocket-outline" title="Deployment" subtitle="Vercel" color={COLORS.secondary} />
                        <FeatureCard icon="people-outline" title="Team" subtitle="3 Collaborators" color={COLORS.accent} />
                        <FeatureCard icon="open-outline" title="Public URL" subtitle="shop.dev/live" color={COLORS.primary} />
                    </View>

                    <Button
                        mode="contained"
                        style={styles.openChatButton}
                        contentStyle={styles.buttonContent}
                        onPress={() => { }}
                    >
                        Open AI Workspace
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const mockProject = {
    title: 'E-commerce Platform',
    description: 'A full-stack mobile application for online shopping, featuring nested navigation, cart state management, and Stripe integration.',
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 10 },
    headerActions: { flexDirection: 'row' },
    projectInfo: { alignItems: 'center', marginTop: 10 },
    projectIconLarge: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    projectTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 8 },
    statusText: { color: COLORS.success, fontSize: 12, fontWeight: 'bold' },
    content: { padding: SIZES.padding * 1.5 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 12 },
    description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surface,
        marginHorizontal: 5,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statNum: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
    statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
    featureCard: {
        width: '48%',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    featureTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.white },
    featureSubtitle: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
    openChatButton: { marginTop: 10, borderRadius: 16, backgroundColor: COLORS.primary },
    buttonContent: { height: 56 },
});

export default WorkspaceScreen;
