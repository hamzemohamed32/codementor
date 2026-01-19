import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Card, Checkbox, IconButton, ProgressBar } from 'react-native-paper';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useProject } from '../context/ProjectContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TasksScreen = ({ navigation }) => {
    const { currentProject } = useProject();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentProject) {
            fetchTasks();
        }
    }, [currentProject]);

    const fetchTasks = async () => {
        if (!currentProject) return;
        try {
            setLoading(true);
            console.log(`📋 Fetching tasks for project: ${currentProject._id}`);
            const res = await api.get(`/api/tasks?projectId=${currentProject._id}`);
            console.log(`✅ Tasks loaded: ${res.data.length}`);
            setTasks(res.data);
        } catch (err) {
            console.error('❌ Failed to fetch tasks:', err.message);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const newStatus = task.status === 'Done' ? 'To do' : 'Done';

            console.log(`📝 Updating task ${id} to ${newStatus}`);

            // Optimistic update
            setTasks(tasks.map(t =>
                t._id === id ? { ...t, status: newStatus } : t
            ));

            // Update on server
            await api.patch(`/api/tasks/${id}`, { status: newStatus });
            console.log(`✅ Task updated`);
        } catch (err) {
            console.error('❌ Failed to update task:', err.message);
            // Revert on error
            fetchTasks();
        }
    };

    const renderTaskItem = ({ item }) => (
        <Card style={styles.taskCard}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.taskLeft}>
                    <Checkbox
                        status={item.status === 'Done' ? 'checked' : 'unchecked'}
                        onPress={() => toggleTask(item._id)}
                        color={COLORS.primary}
                    />
                    <View style={styles.taskTextContainer}>
                        <Text style={[
                            styles.taskTitle,
                            item.status === 'Done' && styles.completedText
                        ]}>
                            {item.title}
                        </Text>
                        <View style={styles.taskMeta}>
                            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                                <Text style={styles.priorityText}>{item.priority}</Text>
                            </View>
                            <Text style={styles.metaText}>Project A</Text>
                        </View>
                    </View>
                </View>
                <IconButton icon="dots-vertical" iconColor={COLORS.textSecondary} size={20} />
            </Card.Content>
        </Card>
    );

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return COLORS.error;
            case 'Medium': return COLORS.accent;
            case 'Low': return COLORS.success;
            default: return COLORS.textSecondary;
        }
    };

    const completedCount = tasks.filter(t => t.status === 'Done').length;
    const progress = tasks.length > 0 ? completedCount / tasks.length : 0;

    if (!currentProject) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="folder-outline" size={80} color={COLORS.textSecondary} />
                    <Text style={styles.emptyTitle}>No Project Selected</Text>
                    <Text style={styles.emptySubtitle}>Select a project to view and manage its tasks.</Text>
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
                <View>
                    <Text style={styles.headerTitle}>Tasks</Text>
                    <Text style={styles.headerSubtitle}>{currentProject.title}</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressTextRow}>
                    <Text style={styles.progressLabel}>Overall Progress</Text>
                    <Text style={styles.progressValue}>{Math.round(progress * 100)}%</Text>
                </View>
                <ProgressBar progress={progress} color={COLORS.primary} style={styles.progressBar} />
            </View>

            <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const mockTasks = [
    { _id: '1', title: 'Implement Authentication', status: 'Done', priority: 'High' },
    { _id: '2', title: 'Design Database Schema', status: 'Doing', priority: 'High' },
    { _id: '3', title: 'Create UI Mockups', status: 'To do', priority: 'Medium' },
    { _id: '4', title: 'API Documentation', status: 'To do', priority: 'Low' },
];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.padding * 1.5,
        paddingTop: 40,
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
    headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        paddingHorizontal: SIZES.padding * 1.5,
        marginBottom: 24,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progressLabel: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
    progressValue: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
    progressBar: { height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
    listContent: { paddingHorizontal: SIZES.padding, paddingBottom: 20 },
    taskCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
    },
    cardContent: {
   