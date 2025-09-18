import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CreateSplitBillScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("0.000");
  const [payer, setPayer] = useState("Tôi");
  const [target, setTarget] = useState("Cả nhóm");

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
          <Text style={styles.amount}>VND {amount}</Text>

          {/* Trả bởi */}
          <View style={styles.row}>
            <Text style={styles.label}>Trả bởi</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{payer}</Text>
              <Ionicons name="chevron-down" size={18} color="#2ECC71" />
            </TouchableOpacity>
          </View>

          {/* Được chia cho */}
          <View style={styles.row}>
            <Text style={styles.label}>Được chia cho</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{target}</Text>
              <Ionicons name="chevron-down" size={18} color="#2ECC71" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Chia tiền</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

   header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2ECC71",
    padding: 12,
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center", 
    flex: 1 
  },

  body: { flex: 1, padding: 20, alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
    marginBottom: 12,
  },
  amount: {
    color: "#2ECC71",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: { fontSize: 14, color: "#000" },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2ECC71",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  dropdownText: { fontSize: 14, color: "#2ECC71", marginRight: 4 },

  createButton: {
    backgroundColor: "#2ECC71",
    margin: 20,
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
