import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Card, IconButton, Searchbar } from 'react-native-paper';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useProject } from '../context/ProjectContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DocsScreen = ({ navigation }) => {
    const { currentProject } = useProject();
    const [searchQuery, setSearchQuery] = useState('');
    const [artifacts, setArtifacts] = useState([]);

    useEffect(() => {
        if (currentProject) {
            fetchArtifacts();
        }
    }, [currentProject]);

    const fetchArtifacts = async () => {
        if (!currentProject) return;
        try {
            console.log(`📄 Fetching artifacts for project: ${currentProject._id}`);
            const res = await api.get(`/api/artifacts?projectId=${currentProject._id}`);
            console.log(`✅ Artifacts loaded: ${res.data.length}`);
            setArtifacts(res.data);
        } catch (err) {
            console.error('❌ Failed to fetch artifacts:', err.message);
            setArtifacts([]);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'requirements': return <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />;
            case 'db': return <Ionicons name="server-outline" size={20} color={COLORS.accent} />;
            case 'api': return <Ionicons name="flash-outline" size={20} color={COLORS.secondary} />;
            case 'ui': return <Ionicons name="layers-outline" size={20} color={COLORS.success} />;
            case 'security': return <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.error} />;
            default: return <Ionicons name="document-text-outline" size={20} color={COLORS.textSecondary} />;
        }
    };

    const renderArtifactItem = ({ item }) => (
        <Card style={styles.artifactCard}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.iconBox}>
                    {getTypeIcon(item.type)}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.artifactTitle}>{item.title}</Text>
                    <Text style={styles.artifactSubtitle}>Updated 2 days ago • v{item.version}</Text>
                </View>
                <IconButton icon="dots-vertical" iconColor={COLORS.textSecondary} size={20} />
            </Card.Content>
        </Card>
    );

    if (!currentProject) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="folder-outline" size={80} color={COLORS.textSecondary} />
                    <Text style={styles.emptyTitle}>No Project Selected</Text>
                    <Text style={styles.emptySubtitle}>Select a project to view its documentation and artifacts.</Text>
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => navigation.navigate('Projects')}
                    >
                        <Text style={styles.selectButtonText}>Go to Projects</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Artifacts</Text>
                        <Text style={styles.headerSubtitle}>{currentProject.title}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.searchSection}>
                <Searchbar
                    placeholder="Search artifacts..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={COLORS.textSecondary}
                    placeholderTextColor={COLORS.textSecondary}
                />
            </View>

            <View style={styles.filterSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
                    {['All', 'Requirements', 'API', 'Database', 'UI'].map((filter, index) => (
                        <TouchableOpacity key={index} style={[styles.filterTag, index === 0 && styles.activeFilter]}>
                            <Text style={[styles.filterText, index === 0 && styles.activeFilterText]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={artifacts}
                renderItem={renderArtifactItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const mockArtifacts = [
    { _id: '1', title: 'System Requirements', type: 'requirements', version: 1.2 },
    { _id: '2', title: 'Database Schema', type: 'db', version: 2.0 },
    { _id: '3', title: 'API Documentation', type: 'api', version: 0.8 },
    { _id: '4', title: 'UI Design Specs', type: 'ui', version: 1.5 },
];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { padding: SIZES.padding * 1.5, paddingTop: 40 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
    headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
    searchSection: { paddingHorizontal: SIZES.padding * 1.5, marginBottom: 16 },
    searchBar: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        elevation: 0,
        height: 48,
    },
    searchInput: { fontSize: 14, color: COLORS.white },
    filterSection: { marginBottom: 20 },
    filterList: { paddingHorizontal: SIZES.padding * 1.5 },
    filterTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeFilter: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
    activeFilterText: { color: COLORS.white },
    listContent: { paddingHorizontal: SIZES.padding, paddingBottom: 20 },
    artifactCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: { flex: 1 },
    artifactTitle: { color: COLORS.white, fontSize: 15, fontWeight: 'bold' },
    artifactSubtitle: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
    // Empty State Styles
    empt