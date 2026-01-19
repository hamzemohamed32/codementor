import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Card, IconButton, Searchbar, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useProject } from '../context/ProjectContext';

const HomeScreen = ({ navigation }) => {
    const { selectProject } = useProject();
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', stack: '' });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📂 Fetching projects...');
            const res = await api.get('/api/projects');
            console.log('✅ Projects fetched:', res.data.length);
            setProjects(res.data);
        } catch (err) {
            console.error('❌ Failed to fetch projects:', err.message);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.title.trim()) {
            Alert.alert('Error', 'Please enter a project title');
            return;
        }

        try {
            console.log('📝 Creating project:', newProject.title);
            const res = await api.post('/api/projects', newProject);
            console.log('✅ Project created:', res.data);

            // Add to local state immediately
            setProjects([...projects, res.data]);

            // Reset form
            setNewProject({ title: '', description: '', stack: '' });
            setCreateModalVisible(false);

            // Select the new project automatically
            selectProject(res.data);

            // Navigate to Workspace
            navigation.navigate('Workspace');

            Alert.alert('Success', 'Project created successfully! AI is initializing your workspace...');
        } catch (err) {
            console.error('❌ Failed to create project:', err.message);
            Alert.alert('Error', err.response?.data?.message || 'Failed to create project');
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Calculate real stats
    const stats = {
        active: projects.length,
        tasks: 12, // TODO: Calculate from actual tasks
        avgProgress: projects.length > 0 ? 68 : 0 // TODO: Calculate real progress
    };

    const renderStatCard = (icon, value, label) => (
        <View style={styles.statCard}>
            <View style={styles.statIconBox}>
                {icon}
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const renderProjectItem = ({ item }) => (
        <Card
            style={styles.projectCard}
            onPress={() => {
                selectProject(item);
                navigation.navigate('Workspace');
            }}
        >
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={styles.projectIconBox}>
                        <Ionicons name="code-slash" size={24} color={COLORS.white} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.projectTitle}>{item.title}</Text>
                        <Text style={styles.projectSubtitle}>{item.description || 'Full-stack platform'}</Text>
                    </View>
                </View>

                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressLabel}>Progress</Text>
                        <Text style={styles.progressValue}>68%</Text>
                    </View>
                    <ProgressBar progress={0.68} color={COLORS.accent} style={styles.progressBar} />
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.tagsRow}>
                        <View style={styles.tag}><Text style={styles.tagText}>React Native</Text></View>
                        <View style={styles.tag}><Text style={styles.tagText}>Node.js</Text></View>
                        <View style={styles.tagSmall}><Text style={styles.tagTextSmall}>+1</Text></View>
                    </View>
                    <View style={styles.timeInfo}>
                        <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
                        <Text style={styles.timeText}>743d ago</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={COLORS.gradient} style={styles.headerGradient}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerTitle}>Projects</Text>
                            <Text style={styles.headerSubtitle}>{stats.active} active {stats.active === 1 ? 'project' : 'projects'}</Text>
                        </View>
                        <View style={styles.headerIconButton}>
                            <Ionicons name="trending-up" size={20} color={COLORS.white} />
                        </View>
                    </View>

                    <Searchbar
                        placeholder="Search projects..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                        placeholderTextColor={COLORS.textSecondary}
                        iconColor={COLORS.textSecondary}
                    />
                </LinearGradient>

                <View style={styles.statsRow}>
                    {renderStatCard(<Ionicons name="code-slash" size={20} color={COLORS.accent} />, String(stats.active), "Active")}
                    {renderStatCard(<Ionicons name="server-outline" size={20} color={COLORS.accent} />, String(stats.tasks), "Tasks")}
                    {renderStatCard(<Ionicons name="flash" size={20} color={COLORS.secondary} />, `${stats.avgProgress}%`, "Avg.")}
                </View>

                {projects.length === 0 && !loading && (
                    <View style={styles.infoBox}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="flash" size={18} color={COLORS.white} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoTitle}>👋 Welcome! Create your first project</Text>
                            <Text style={styles.infoSubtitle}>Click "Create New Project" to get started</Text>
                        </View>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.createButtonContainer}
                    onPress={() => setCreateModalVisible(true)}
                >
                    <LinearGradient colors={COLORS.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.createButton}>
                        <View style={styles.plusIconBox}>
                            <Ionicons name="add" size={20} color={COLORS.white} />
                        </View>
                        <Text style={styles.createButtonText}>Create New Project</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading projects...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={48} color={COLORS.error} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchProjects}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.recentTitle}>
                                {searchQuery ? `SEARCH RESULTS (${filteredProjects.length})` : 'RECENT PROJECTS'}
                            </Text>
                        </View>

                        <FlatList
                            data={filteredProjects}
                            renderItem={renderProjectItem}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="folder-open-outline" size={64} color={COLORS.textSecondary} />
                                    <Text style={styles.emptyText}>
                                        {searchQuery ? 'No projects match your search' : 'No projects yet'}
                                    </Text>
                                </View>
                            }
                        />
                    </>
                )}

                {/* Create Project Modal */}
                <Modal
                    visible={createModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setCreateModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Create New Project</Text>
                                <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Project Title *"
                                placeholderTextColor={COLORS.textSecondary}
                                value={newProject.title}
                                onChangeText={(text) => setNewProject({ ...newProject, title: text })}
                            />

                            <TextInput
                                style={[styles.modalInput, styles.modalInputMultiline]}
                                placeholder="Description"
                                placeholderTextColor={COLORS.textSecondary}
                                value={newProject.description}
                                onChangeText={(text) => setNewProject({ ...newProject, description: text })}
                                multiline
                                numberOfLines={3}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Tech Stack (e.g., React Native, Node.js)"
                                placeholderTextColor={COLORS.textSecondary}
                                value={newProject.stack}
                                onChangeText={(text) => setNewProject({ ...newProject, stack: text })}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonCancel]}
                                    onPress={() => setCreateModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonCreate]}
                                    onPress={handleCreateProject}
                                >
                                    <LinearGradient
                                        colors={COLORS.gradient}
                                        style={styles.modalButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Text style={styles.modalButtonTextCreate}>Create Project</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const mockProjects = [
    { _id: '1', title: 'E-commerce Platform', description: 'Full-stack shopping app with cart, payments, and admin dashboard' },
    { _id: '2', title: 'Social Network API', description: 'Scalable backend for feed, likes, and real-time notifications' },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerGradient: {
        padding: SIZES.padding * 1.5,
        paddingTop: 40,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    headerIconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        elevation: 0,
        height: 45,
    },
    searchInput: {
        color: COLORS.white,
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SIZES.padding,
        marginTop: -10,
    },
    statCard: {
        width: '31%',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        margin: SIZES.padding,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(124, 58, 237, 0.3)',
        alignItems: 'center',
    },
    infoIconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    infoSubtitle: {
        fontSize: 11,
        color: COLORS.textSecondary,
        lineHeight: 14,
    },
    createButtonContainer: {
        marginHorizontal: SIZES.padding,
        marginBottom: 20,
    },
    createButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusIconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    sectionHeader: {
        paddingHorizontal: SIZES.padding,
        marginBottom: 12,
    },
    recentTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        letterSpacing: 1.2,
    },
    listContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 20,
    },
    projectCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    projectIconBox: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerText: {
        justifyContent: 'center',
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    projectSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    progressSection: {
        marginBottom: 16,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    progressValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.accent,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.surfaceLight,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tagsRow: {
        flexDirection: 'row',
    },
    tag: {
        backgroundColor: COLORS.surfaceLight,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 6,
    },
    tagSmall: {
        backgroundColor: COLORS.surfaceLight,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
    },
    tagText: {
        color: COLORS.accent,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tagTextSmall: {
        color: COLORS.textSecondary,
        fontSize: 10,
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        color: COLORS.textSecondary,
        fontSize: 10,
        marginLeft: 4,
    },
    // Loading, Error, Empty states
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: COLORS.textSecondary,
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: COLORS.error,
        marginTop: 12,
        fontSize: 14,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    retryButtonText: {
        color: COLORS.white,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: COLORS.textSecondary,
        marginTop: 16,
        fontSize: 14,
        textAlign: 'center',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    modalInput: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        color: COLORS.white,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#334155',
    },
    modalInputMultiline: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalButtonCancel: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: '#334155',
        padding: 16,
        alignItems: 'center',
    },
    modalButtonCreate: {
        // LinearGradient will fill this
    },
    modalButtonGradient: {
        padding: 16,
        alignItems: 'center',
        borderRadius: 12,
    },
    modalButtonTextCancel: {
        color: COLORS.text,
        fontWeight: '600',
        fontSize: 15,
    },
    modalButtonTextCreate: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 15,
    },
});

export default HomeScreen;
