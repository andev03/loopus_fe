import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './ChatModal.styles'; 

const QUICK_QUESTIONS = [
  {
    question: "Ứng dụng này dùng để làm gì?",
    answer:
      "📱 Đây là ứng dụng Loopus — giúp bạn và bạn bè dễ dàng chia tiền khi đi ăn, du lịch hoặc sinh hoạt nhóm. Bạn có thể tạo nhóm, ghi lại các khoản chi tiêu, hệ thống sẽ tự động tính ai trả bao nhiêu, ai nợ bao nhiêu. Ngoài ra còn có tính năng chat nhóm, nhắc nhở sự kiện và theo dõi lịch sử giao dịch."
  },
  {
    question: "Các tính năng chính của app Loopus là gì?",
    answer:
      "✨ Các tính năng chính:\n- Tạo nhóm bạn bè hoặc sự kiện\n- Ghi lại các khoản chi tiêu\n- Tự động tính số tiền mỗi người cần trả\n- Chat nhóm\n- Nhắc nhở và quản lý lịch sử giao dịch"
  },
  {
    question: "Hướng dẫn cách chia tiền trong nhóm",
    answer:
      "💰 Để chia tiền:\n1️⃣ Tạo nhóm hoặc chọn nhóm có sẵn.\n2️⃣ Thêm khoản chi tiêu (ai trả, bao nhiêu, những ai tham gia).\n3️⃣ Ứng dụng sẽ tự động chia đều hoặc theo tỉ lệ tùy chọn.\n4️⃣ Mỗi thành viên sẽ thấy rõ mình cần trả hoặc nhận bao nhiêu."
  },
  {
    question: "Cách tính toán chia tiền giữa các thành viên?",
    answer:
      "🧮 Khi bạn thêm một khoản chi tiêu:\n- Nếu chia đều → tổng tiền chia đều cho số người tham gia.\n- Nếu chia tùy chỉnh → dựa trên phần bạn nhập.\n- Người trả sẽ nhận lại tiền từ những người còn lại.\n- Ứng dụng sẽ tính toán tự động số tiền nợ của từng người."
  },
    {
    question: "App này có miễn phí không?",
    answer:
      "💸 Ứng dụng Loopus  hoàn toàn **miễn phí**. Nhưng bạn có thể mua gói member của chúng tôi với mức giá cực rẻ để hưởng thêm nhiều quyền lợi từ ứng dụng."
  },
   {
    question: "Dữ liệu của tôi có được lưu trữ an toàn không?",
    answer:
      "🔐 Có. Tất cả dữ liệu của bạn được lưu trên server bảo mật. Mỗi nhóm và khoản chi tiêu chỉ thành viên có quyền mới có thể xem."
  },
  {
    question: "Nếu có nhiều người trả tiền thì sao?",
    answer:
      "🤝 Loopus hỗ trợ chọn **nhiều người trả**. Bạn chỉ cần nhập số tiền mỗi người trả, hệ thống sẽ tự động tính phần còn lại và chia đều phần nợ giữa các thành viên còn lại."
  },
  
];

const ChatModal = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    if (visible) {
      console.log('=== DEBUG LOAD KEY (GEMINI) ===');
      console.log('GEMINI_API_KEY loaded:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT LOADED');
      console.log('Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
      console.log('=== END DEBUG LOAD KEY ===');
    }
  }, [visible]);

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleQuickQuestion = (item) => {
    const userMsg = { from: 'user', text: item.question };
    setMessages((prev) => [...prev, userMsg]);
    
    // Delay để tạo cảm giác bot đang "suy nghĩ"
    setLoading(true);
    setTimeout(() => {
      const botMsg = { from: 'bot', text: item.answer };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 600);
  };

  const sendMessage = async (text) => {
  if (!text.trim()) return;
  const userMsg = { from: 'user', text };
  setMessages((prev) => [...prev, userMsg]);
  setInputText('');
  setLoading(true);

  try {
    // Nếu có câu hỏi trong QUICK_QUESTIONS → trả lời ngay không cần gọi API
    const matched = QUICK_QUESTIONS.find(
      q => q.question.toLowerCase() === text.toLowerCase()
    );
    if (matched) {
      setTimeout(() => {
        const botMsg = { from: 'bot', text: matched.answer };
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
      }, 500);
      return;
    }

    // ❇️ Gọi Gemini API khi không khớp câu hỏi có sẵn
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text }] }]
      })
    });

    const data = await response.json();
    const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 Mình không có câu trả lời phù hợp.";
    setMessages(prev => [...prev, { from: 'bot', text: botText }]);
  } catch (error) {
    console.error("Gemini API error:", error);
    setMessages(prev => [...prev, { from: 'bot', text: "❌ Có lỗi xảy ra khi gọi AI." }]);
  } finally {
    setLoading(false);
  }
};


  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>Xin chào!</Text>
      <Text style={styles.emptySubtitle}>
        Chọn một câu hỏi bên dưới hoặc nhập câu hỏi của bạn để bắt đầu trò chuyện
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.chatBox}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>💬 Trợ Lý Loopus</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <View style={styles.messagesContainer}>
              {messages.length === 0 ? (
                renderEmptyState()
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(_, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  onContentSizeChange={() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }}
                  renderItem={({ item }) => (
                    <View style={[
                      styles.messageBubble, 
                      item.from === 'user' ? styles.userBubble : styles.botBubble
                    ]}>
                      <Text style={item.from === 'user' ? styles.messageText : styles.botMessageText}>
                        {item.text}
                      </Text>
                    </View>
                  )}
                />
              )}

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#10B981" />
                  <Text style={styles.loadingText}>Đang trả lời...</Text>
                </View>
              )}
            </View>

            {/* Quick Questions */}
            <View style={styles.quickQuestionsSection}>
              <Text style={styles.quickQuestionsTitle}>Câu hỏi gợi ý</Text>
              <FlatList
                data={QUICK_QUESTIONS}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickQuestionsScroll}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.quickBtn} 
                    onPress={() => handleQuickQuestion(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickBtnText}>{item.question}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Input */}
            <View style={styles.inputSection}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Bạn muốn hỏi gì nào..."
                  placeholderTextColor="#999999"
                  value={inputText}
                  onChangeText={setInputText}
                  returnKeyType="send"
                  onSubmitEditing={() => sendMessage(inputText)}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity 
                  style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
                  onPress={() => sendMessage(inputText)}
                  disabled={!inputText.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sendBtnText}>➤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default ChatModal;