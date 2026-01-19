import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { Avatar, IconButton, ActivityIndicator } from 'react-native-paper';
import { COLORS, SIZES } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';
import { useProject } from '../context/ProjectContext';

const ChatScreen = ({ route, navigation }) => {
    const { currentProject } = useProject();

    // Support both route params (from stack) and context (from tabs)
    const activeProject = currentProject || (route?.params ? { _id: route.params.projectId, title: route.params.title } : null);
    const projectId = activeProject?._id;
    const title = activeProject?.title;

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState('Auto');
    const flatListRef = useRef(null);

    const modes = ['Auto', 'PM', 'Architect', 'Frontend', 'Backend', 'QA', 'DevOps', 'Security'];

    const quickActions = [
        { label: 'Generate MVP', prompt: 'Generate a complete MVP scope for this project with must-have and nice-to-have features' },
        { label: 'Design DB', prompt: 'Design a complete MongoDB schema for this project with all collections and relationships' },
        { label: 'Create API', prompt: 'Create a complete REST API specification with all endpoints, methods, and responses' },
        { label: 'Build UI', prompt: 'Design the UI screens and component structure for this project' },
        { label: 'Write Tests', prompt: 'Create a comprehensive test plan with test cases for this project' },
        { label: 'Deploy Guide', prompt: 'Provide a step-by-step deployment guide for this project' },
    ];

    useEffect(() => {
        if (projectId) {
            fetchChatHistory();
        }
    }, [projectId]);

    const fetchChatHistory = async () => {
        if (!projectId) return;
        try {
            console.log(`📂 Fetching chat history for project: ${projectId}`);
            const res = await api.get(`/api/chat/${projectId}`);
            console.log(`✅ Chat history loaded: ${res.data.length} messages`);
            setMessages(res.data);
        } catch (err) {
            console.error('❌ Error fetching chat history:', err.message);
            setMessages([]);
        }
    };

    const handleSendMessage = async (messageContent = null) => {
        const content = messageContent || inputText.trim();
        if (!content) return;

        const userMessage = {
            _id: Date.now().toString(),
            roleMode: 'user',
            content: content,
            createdAt: new Date(),
        };

        // Add user message immediately
        setMessages(prev => [...prev, userMessage]);
        if (!messageContent) setInputText(''); // Only clear if typing manually
        setLoading(true);

        try {
            console.log(`💬 Sending message for project: ${projectId} (Mode: ${selectedMode})`);
            const res = await api.post(`/api/chat/${projectId}`, {
                content: content,
                roleMode: selectedMode, // Use selected mode
            });
            console.log(`✅ AI response received`);
            setMessages(prev => [...prev, res.data.aiMessage]);
        } catch (err) {
            console.error('❌ Error sending message:', err.message);
            // Show error message in chat
            const errorMessage = {
                _id: Date.now().toString() + '_error',
                roleMode: 'system',
                content: 'Sorry, I couldn\'t process your message. Please try again.',
                createdAt: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (prompt) => {
        handleSendMessage(prompt);
    };

    const renderMessage = ({ item }) => {
        const isUser = item.roleMode === 'user';
        return (
            <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
                {!isUser && (
                    <View style={[styles.avatarBox, { backgroundColor: COLORS.surface }]}>
                        <MaterialCommunityIcons name="robot" size={20} color={COLORS.primary} />
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
                        {item.content}
                    </Text>
                </View>
                {isUser && (
                    <View style={[styles.avatarBox, { backgroundColor: COLORS.primary }]}>
                        <MaterialCommunityIcons name="account" size={20} color={COLORS.white} />
                    </View>
                )}
            </View>
        );
    };

    if (!activeProject) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="folder-outline" size={80} color={COLORS.textSecondary} />
                    <Text style={styles.emptyTitle}>No Project Selected</Text>
                    <Text style={styles.emptySubtitle}>Go to the Projects tab and select a project to start coding.</Text>
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" color={COLORS.text} size={28} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <Text style={styles.onlineStatus}>Active Mentor</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon="file-document-outline" iconColor={COLORS.textSecondary} onPress={() => navigation.navigate('Docs')} />
                    <IconButton icon="dots-vertical" iconColor={COLORS.textSecondary} onPress={() => { }} />
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} color={COLORS.primary} size="small" />
                    <Text style={styles.loadingText}>CodeMentor is thinking...</Text>
                </View>
            )}

            {/* Mode Selector */}
            <View style={styles.modeSelectorContainer}>
                <Text style={styles.modeSelectorLabel}>Mode:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeScroll}>
                    {modes.map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            style={[
                                styles.modeChip,
                                selectedMode === mode && styles.modeChipActive
                            ]}
                            onPress={() => setSelectedMode(mode)}
                        >
                            <Text style={[
                                styles.modeChipText,
                                selectedMode === mode && styles.modeChipTextActive
                            ]}>
                                {mode}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Quick Actions */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickActionsContainer}
                contentContainerStyle={styles.quickActionsContent}
            >
                {quickActions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.quickActionPill}
                        onPress={() => handleQuickAction(action.prompt)}
                        disabled={loading}
                    >
                        <MaterialCommunityIcons
                            name={
                                index === 0 ? 'rocket-launch' :
                                    index === 1 ? 'database' :
                                        index === 2 ? 'api' :
                                            index === 3 ? 'palette' :
                                                index === 4 ? 'test-tube' :
                                                    'cloud-upload'
                            }
                            size={14}
                            color={COLORS.primary}
                        />
                        <Text style={styles.quickActionText}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask CodeMentor anything..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <MaterialCommunityIcons name="send" color={COLORS.white} size={20} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surface,
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: SIZES.fontMedium,
        fontWeight: 'bold',
    },
    onlineStatus: {
        color: COLORS.success,
        fontSize: 10,
    },
    listContent: {
        padding: SIZES.padding,
        paddingBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    botRow: {
        justifyContent: 'flex-start',
    },
    avatarBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    bubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    botBubble: {
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#334155',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    userText: {
        color: COLORS.white,
    },
    botText: {
        color: COLORS.text,
    },
    inputArea: {
        flexDirection: 'row',
        padding: SIZES.padding,
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.surface,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.surface,
        color: COLORS.text,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
        fontSize: 14,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    loadingText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginLeft: 8,
    },
    // Mode Selector Styles
    modeSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.surface,
    },
    modeSelectorLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        marginRight: 8,
    },
    modeScroll: {
        flex: 1,
    },
    modeChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    modeChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    modeChipText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    modeChipTextActive: {
        color: COLORS.white,
    },
    // Quick Actions Styles
    quickActionsContainer: {
        backgroundColor: COLORS.background,
        paddingVertical: 8,
    },
    quickActionsContent: {
        paddingHorizontal: 16,
    },
    quickActionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.primary + '30',
    },
    quickActionText: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    // Empty State Styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: COLORS.background,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22,
    },
    selectButton: {
        marginTop: 30,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
    },
    selectButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChatScreen;
