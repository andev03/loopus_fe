import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import styles from "./CreateSplitBill.styles";
import { getUser } from "../../../services/storageService"; 
import { expenseService } from "../../../services/expenseService"; 

export default function CreateSplitBillScreen() {
  const { groupId } = useLocalSearchParams(); 
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("0");
  const [payer, setPayer] = useState("Tôi"); 
  const [target, setTarget] = useState("Cả nhóm"); 
  const [loading, setLoading] = useState(false); 

 const handleCreateSplitBill = () => {
  if (!title.trim() || parseFloat(amount) <= 0) {
    Alert.alert("Lỗi", "Vui lòng nhập tên khoản phí và số tiền hợp lệ");
    return;
  }

  if (!groupId) {
    Alert.alert("Lỗi", "Không tìm thấy nhóm chat");
    return;
  }

  router.push({
    pathname: "/chat/select-payer",
    params: {
      groupId,
      title: title.trim(),
      amount: amount.trim(),
    },
  });
};

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chia tiền</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Ionicons
          name="cash-outline"
          size={64}
          color="#2ECC71"
          style={{ marginBottom: 16 }}
        />

        {/* Card */}
        <View style={styles.card}>
          {/* Tên khoản phí */}
          <TextInput
            placeholder="Tên khoản phí..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Amount */}
          <TextInput
  placeholder="Số tiền (VND)"
  placeholderTextColor="#999"
  value={amount}
  onChangeText={(text) => {
    const numeric = text.replace(/\D/g, "");
    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmount(formatted);
  }}
  keyboardType="numeric"
  style={[styles.input, { textAlign: "right" }]}
/>

          <View style={styles.row}>
            <Text style={styles.label}>Trả bởi</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => {
              Alert.alert("Chọn người trả", "Tạm thời chỉ hỗ trợ 'Tôi'");
            }}>
              <Text style={styles.dropdownText}>{payer}</Text>
              <Ionicons name="chevron-down" size={18} color="#2ECC71" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Được chia cho</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => {
              Alert.alert("Chọn người chia", "Tạm thời chỉ hỗ trợ 'Cả nhóm'");
            }}>
              <Text style={styles.dropdownText}>{target}</Text>
              <Ionicons name="chevron-down" size={18} color="#2ECC71" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.createButton, loading && { opacity: 0.7 }]}
        onPress={handleCreateSplitBill}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? "Đang tạo..." : "Chia tiền"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}