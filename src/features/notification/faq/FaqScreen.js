
// app/notification/faq.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function FAQScreen() {
  const navigation = useNavigation();

  const faqs = [
    {
      id: "1",
      title: "Tạo & tham gia nhóm",
      desc: "Tôi có thể tạo hoặc tham gia bao nhiêu nhóm cùng lúc?",
    },
    {
      id: "2",
      title: "Chia tiền & nhắc nợ",
      desc: "Làm sao để chia tiền và nhắc nợ trong nhóm dễ dàng?",
    },
    {
      id: "3",
      title: "Album ảnh nhóm",
      desc: "Làm sao để xóa ảnh hoặc tin nhắn cũ?",
    },
    {
      id: "4",
      title: "Quyền riêng tư & bảo mật",
      desc: "Dữ liệu và chỉ tiêu nhóm có được bảo mật không?",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Các vấn đề thường gặp</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Danh sách FAQ */}
      <ScrollView style={styles.content}>
        {faqs.map((faq) => (
          <TouchableOpacity key={faq.id} style={styles.faqItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.faqTitle}>{faq.title}</Text>
              <Text style={styles.faqDesc}>{faq.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}

        {/* Nút Chat với Loopus */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("ChatLoopus")}
        >
          <Text style={styles.chatButtonText}>Chat với Loopus</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  faqDesc: {
    fontSize: 13,
    color: "#666",
  },
  chatButton: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#2ECC71",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
