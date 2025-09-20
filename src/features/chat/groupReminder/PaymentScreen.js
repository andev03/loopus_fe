import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const [amount, setAmount] = useState("");

  const member = {
    id: "1",
    name: "Đặng Lê Anh",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <TouchableOpacity onPress={() => {}}>
          <TouchableOpacity
            onPress={() => {
              router.replace({
                pathname: "/chat/member-debt-detail",
                params: { id: member.id, paid: amount },
              });
            }}
          >
            <Text style={styles.saveBtn}>Lưu</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Thông tin chuyển tiền */}
      <View style={styles.transferBox}>
        <Image source={{ uri: member.avatar }} style={styles.avatar} />

        <View style={styles.iconRow}>
          <Ionicons name="cash-outline" size={28} color="#2ECC71" />
          <Ionicons
            name="arrow-forward-outline"
            size={24}
            color="#2ECC71"
            style={{ marginLeft: 4 }}
          />
        </View>

        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/2.jpg" }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.name}>Bạn</Text>
      </View>

      {/* Input số tiền */}
      <View style={styles.amountBox}>
        <Text style={styles.currency}>VND</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0.000"
          keyboardType="numeric"
          style={styles.amountInput}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2ECC71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerBtn: { padding: 4 },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  saveBtn: { color: "#fff", fontWeight: "600" },
  transferBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  name: { fontSize: 14, fontWeight: "500" },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  currency: { fontSize: 16, color: "#555", marginRight: 8 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: "600", color: "#2ECC71" },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
});
