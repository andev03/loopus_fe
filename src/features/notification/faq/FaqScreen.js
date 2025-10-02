// app/notification/faq.js
import React, { useState } from "react";
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
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: "1",
      title: "Tạo & tham gia nhóm",
      desc: "Tôi có thể tạo hoặc tham gia bao nhiêu nhóm cùng lúc?",
      detail:
        "Bạn có thể tạo và tham gia nhiều nhóm không giới hạn. Tuy nhiên, để đảm bảo trải nghiệm, nên tham gia dưới 20 nhóm cùng lúc.",
    },
    {
      id: "2",
      title: "Chia tiền & nhắc nợ",
      desc: "Làm sao để chia tiền và nhắc nợ trong nhóm dễ dàng?",
      detail:
        "Bạn có thể dùng tính năng 'Chia tiền' trong nhóm để nhập số tiền, hệ thống sẽ tự động chia đều hoặc chia theo tỉ lệ bạn chọn. Sau đó có thể nhắc nợ trực tiếp cho từng thành viên.",
    },
    {
      id: "3",
      title: "Album ảnh nhóm",
      desc: "Làm sao để xóa ảnh hoặc tin nhắn cũ?",
      detail:
        "Vào mục Album ảnh trong nhóm, chọn ảnh cần xóa, giữ lâu rồi chọn 'Xóa'. Với tin nhắn, chỉ cần giữ tin nhắn và chọn 'Xóa cho tất cả'.",
    },
    {
      id: "4",
      title: "Quyền riêng tư & bảo mật",
      desc: "Dữ liệu và chỉ tiêu nhóm có được bảo mật không?",
      detail:
        "Tất cả dữ liệu của bạn được mã hóa và lưu trữ an toàn. Chúng tôi cam kết không chia sẻ dữ liệu cho bên thứ ba.",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          <View key={faq.id}>
            <TouchableOpacity
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.faqTitle}>{faq.title}</Text>
                <Text style={styles.faqDesc}>{faq.desc}</Text>
              </View>
              <Ionicons
                name={expandedId === faq.id ? "chevron-up" : "chevron-forward"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>

            {expandedId === faq.id && (
              <View style={styles.faqDetail}>
                <Text style={styles.faqDetailText}>{faq.detail}</Text>
              </View>
            )}
          </View>
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
  faqDetail: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  faqDetailText: {
    fontSize: 14,
    color: "#444",
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
