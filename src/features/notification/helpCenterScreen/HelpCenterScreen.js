import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HelpCenterScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trung tâm trợ giúp</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        {/* Icon + chào */}
        <View style={styles.greetingBox}>
          <Ionicons name="call-outline" size={70} color="#2ECC71" />
          <Text style={styles.hello}>Xin chào, Công Phát</Text>
          <Text style={styles.subHello}>
            Chúng tôi luôn luôn sẵn sàng hỗ trợ bạn!
          </Text>
        </View>

        {/* Chat với Loopus */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("notification/chat-loopus")} // 👈 điều hướng
        >
          <MaterialIcons name="chat-bubble-outline" size={24} color="#2ECC71" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuTitle}>Chat với Loopus</Text>
            <Text style={styles.menuDesc}>Hỗ trợ chính xác vấn đề của bạn</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Các vấn đề thường gặp */}
         <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("notification/faq")} // 👈 điều hướng
        >
          <Ionicons name="help-circle-outline" size={26} color="#2ECC71" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuTitle}>Các vấn đề thường gặp</Text>
            <Text style={styles.menuDesc}>
              Giải đáp nhanh các thắc mắc phổ biến
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
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
  greetingBox: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 8,
    borderColor: "#f2f2f2",
  },
  hello: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  subHello: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuDesc: {
    fontSize: 13,
    color: "#666",
  },
});
