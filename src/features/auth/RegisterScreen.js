import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản mới</Text>
      <Text style={styles.subtitle}>Chào mừng bạn tới LOOPUS</Text>

      {/* Họ và Tên */}
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1, marginRight: 6 }]} placeholder="Họ" />
        <TextInput style={[styles.input, { flex: 1, marginLeft: 6 }]} placeholder="Tên" />
      </View>

      {/* Ngày sinh & Giới tính */}
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1, marginRight: 6 }]} placeholder="Ngày" keyboardType="numeric" />
        <TextInput style={[styles.input, { flex: 1, marginHorizontal: 6 }]} placeholder="Tháng" keyboardType="numeric" />
        <TextInput style={[styles.input, { flex: 1, marginLeft: 6 }]} placeholder="Năm" keyboardType="numeric" />
      </View>
      <TextInput style={styles.input} placeholder="Giới tính" />

      {/* Email / SĐT */}
      <TextInput style={styles.input} placeholder="Email hoặc số điện thoại" keyboardType="email-address" />

      {/* Mật khẩu */}
      <TextInput style={styles.input} placeholder="Nhập mật khẩu" secureTextEntry />
      <TextInput style={styles.input} placeholder="Nhập lại mật khẩu" secureTextEntry />

      {/* Điều khoản */}
      <View style={styles.checkboxRow}>
        <TouchableOpacity onPress={() => setChecked(!checked)} style={styles.checkbox}>
          {checked ? <View style={styles.checkboxChecked} /> : null}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Tôi đồng ý với Điều khoản sử dụng Loopus</Text>
      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Đã có tài khoản */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginLink}>Bạn đã có tài khoản</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: "row", width: "100%", marginBottom: 12 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "#2ECC71", marginRight: 8, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { width: 12, height: 12, backgroundColor: "#2ECC71" },
  checkboxLabel: { fontSize: 14, flex: 1 },
  registerButton: { width: "100%", backgroundColor: "#2ECC71", padding: 14, borderRadius: 8, marginBottom: 10 },
  registerText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  loginLink: { color: "#555", fontSize: 14, marginTop: 8 },
});
