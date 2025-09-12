import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

const messages = [
  { 
    id: "1", 
    sender: "Đặng Lê Anh", 
    text: "Hôm trước mình ăn bao nhiêu vậy?", 
    type: "text",
    time: "9:41",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  { 
    id: "2", 
    sender: "Đặng Lê Anh", 
    text: "Ai là người ứng tiền vậy?", 
    type: "text",
    time: "9:41",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  { 
    id: "3", 
    sender: "Bạn", 
    type: "event",
    event: {
      title: "Họp bàn chia tiền",
      date: "Thứ 7, 12 tháng 7",
      time: "Lúc 15:30",
      day: "THG 7",
      dateNumber: "12"
    }
  },
];

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();

  const renderMessage = ({ item }) => {
    if (item.type === "text") {
      return (
        <View style={styles.messageRow}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.bubbleContainer}>
            <View style={styles.bubble}>
              <View style={styles.headerRow}>
                <Text style={styles.sender}>{item.sender}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (item.type === "event") {
      return (
        <View style={styles.eventCard}>
          <Text style={styles.eventHeader}>Bạn đã tạo một cuộc hẹn</Text>
          <View style={styles.eventBody}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>{item.event.day}</Text>
              <Text style={styles.eventDateNumber}>{item.event.dateNumber}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{item.event.title}</Text>
              <Text style={styles.eventTime}>
                {item.event.date}{"\n"}{item.event.time}
              </Text>
            </View>
          </View>
          <View style={styles.eventActions}>
            <Text style={styles.eventReject}>Từ chối</Text>
            <Text style={styles.eventAccept}>Tham gia</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
  onPress={() => router.push("/chat")} 
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color="#fff" />
</TouchableOpacity>
        <Text style={styles.title}>Nhóm Cơm Tấm</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

     
      <KeyboardAvoidingView 
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
        />

    
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={24} color="#666" />
            </TouchableOpacity>
            <TextInput 
              placeholder="Gửi tin nhắn" 
              style={styles.input} 
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={22} color="#2ECC71" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  flex1: { flex: 1 },


  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 12,
  },
  backButton: { padding: 4 },
  title: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold", 
    flex: 1,
    marginLeft: 12,
  },
  headerActions: { flexDirection: "row" },
  headerIcon: { padding: 4, marginLeft: 8 },


  messagesContainer: { padding: 12 },
  messageRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  bubbleContainer: { flex: 1 },
  bubble: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  sender: { fontWeight: "bold", fontSize: 12, color: "#2ECC71" },
  time: { fontSize: 11, color: "#999" },
  messageText: { fontSize: 14, lineHeight: 20, color: "#333" },


  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: { fontWeight: "bold", marginBottom: 8, textAlign: "center", color: "#2ECC71" },
  eventBody: { flexDirection: "row", marginBottom: 8 },
  eventDate: {
    alignItems: "center", 
    marginRight: 12,
    backgroundColor: "#f0f8ff",
    padding: 8,
    borderRadius: 8,
  },
  eventDay: { color: "#2ECC71", fontWeight: "bold", fontSize: 12 },
  eventDateNumber: { fontSize: 22, fontWeight: "bold", color: "#333" },
  eventTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  eventTime: { color: "#555", fontSize: 13 },
  eventActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  eventReject: { color: "#777", fontSize: 14 },
  eventAccept: { color: "#2ECC71", fontWeight: "600", fontSize: 14 },


  inputContainer: { 
    flexDirection: "row", 
    alignItems: "flex-end",
    padding: 12, 
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  attachButton: { marginRight: 12, padding: 8 },
  input: { 
    flex: 1, 
    backgroundColor: "#f1f1f1", 
    borderRadius: 20, 
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: { padding: 8 },
});
