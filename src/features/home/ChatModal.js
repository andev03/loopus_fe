// components/ChatModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';

const ChatModal = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Dùng process.env (đã work)
  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  // Log debug load key (khi modal mở)
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

    // Thêm user message vào state (như code web)
    const userMessage = { role: 'user', content: inputText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);
    console.log('User message added, sending to Gemini...');

    try {
      // SỬA: Model như code web "gemini-2.0-flash", body đơn giản như code web
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
        throw new Error(JSON.stringify({ status: response.status, error: errorText }));
      }

      const data = await response.json();
      console.log('Gemini data received (first 200 chars):', JSON.stringify(data).substring(0, 200));

      const botContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ Không có phản hồi từ Gemini.';
      const botMessage = { role: 'assistant', content: botContent };
      setMessages((prev) => [...prev, botMessage]);
      console.log('Bot message added!');
    } catch (error) {
      console.error('Lỗi chat chi tiết:', error.message);
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Lỗi khi gọi Gemini API.' }]);
    } finally {
      setLoading(false);
      console.log('=== END SEND MESSAGE ===');
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[
        styles.message, 
        { 
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          backgroundColor: isUser ? '#007AFF' : '#E5E5EA',
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: isUser ? '#fff' : '#000' }
        ]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Đóng</Text>
        </TouchableOpacity>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập tin nhắn..."
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { opacity: loading || !inputText.trim() ? 0.5 : 1 }
            ]} 
            onPress={sendMessage}
          >
            <Text style={styles.sendText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  closeButton: { alignItems: 'flex-end', marginBottom: 10 },
  closeText: { fontSize: 16, color: '#007AFF' },
  messagesList: { flex: 1, marginBottom: 10 },
  message: { 
    maxWidth: '80%', 
    padding: 10, 
    borderRadius: 10, 
    marginVertical: 5,
  },
  messageText: { },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end' },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 20, 
    padding: 10, 
    marginRight: 10, 
    maxHeight: 100 
  },
  sendButton: { 
    backgroundColor: '#007AFF', 
    padding: 10, 
    borderRadius: 20,
    minWidth: 60,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatModal;