// components/ChatModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const ChatModal = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    if (visible) {
      console.log('=== DEBUG LOAD KEY (GEMINI) ===');
      console.log('GEMINI_API_KEY loaded:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT LOADED');
      console.log('Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
      console.log('=== END DEBUG LOAD KEY ===');
    }
  }, [visible]);

  const sendMessage = async () => {
    console.log('=== DEBUG SEND MESSAGE (GEMINI) ===');
    console.log('Input text:', inputText);
    console.log('API Key exists?', !!GEMINI_API_KEY);
    console.log('Trimmed input:', inputText.trim());

    if (!inputText.trim() || !GEMINI_API_KEY) {
      console.log('Blocked: Input empty or no API key');
      return;
    }

    const userMessage = { role: 'user', content: inputText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);
    console.log('User message added, sending to Gemini...');

    try {
      const history = updatedMessages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: history }),
      });

      console.log('Response status:', response.status);
      console.log('Full response URL (for debug):', response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error body:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini data received (first 200 chars):', JSON.stringify(data).substring(0, 200));

      const botContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ Gemini.';
      const botMessage = { role: 'assistant', content: botContent };
      setMessages((prev) => [...prev, botMessage]);
      console.log('Bot message added!');
    } catch (error) {
      console.error('Lỗi chat chi tiết:', error.message);
      setMessages((prev) => [...prev, { role: 'assistant', content: `Lỗi khi gọi Gemini API: ${error.message}` }]);
    } finally {
      setLoading(false);
      console.log('=== END SEND MESSAGE ===');
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    const safeContent = (item.content || '').toString();
    return (
      <View style={[
        styles.messageWrapper,
        { alignItems: isUser ? 'flex-end' : 'flex-start' }
      ]}>
        <View style={[
          styles.message, 
          isUser ? styles.userMessage : styles.botMessage
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? '#FFFFFF' : '#1F2937' }
          ]} numberOfLines={10}>
            {safeContent}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.aiIndicator}>
              <View style={styles.aiDot} />
              <Text style={styles.headerTitle}>AI Hỗ trợ</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>💬</Text>
              </View>
              <Text style={styles.emptyTitle}>Bắt đầu cuộc trò chuyện</Text>
              <Text style={styles.emptyText}>Gửi tin nhắn để chat với AI</Text>
            </View>
          }
        />

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color="#6366F1" />
              <Text style={styles.loadingText}>Đang suy nghĩ...</Text>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#9CA3AF"
              multiline
              editable={!loading}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                { opacity: loading || !inputText.trim() ? 0.5 : 1 }
              ]} 
              onPress={sendMessage}
              disabled={loading || !inputText.trim()}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#F9FAFB',
  },
  
  // Header Styles
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Messages Styles
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  messageWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  message: { 
    maxWidth: '80%', 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Loading
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingText: {
    marginLeft: 10,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },

  // Input Area
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  input: { 
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    color: '#111827',
  },
  sendButton: { 
    width: 44,
    height: 44,
    backgroundColor: '#6366F1',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ChatModal;