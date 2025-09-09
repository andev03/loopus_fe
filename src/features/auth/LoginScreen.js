import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>Chào mừng bạn tới LOOPUS</Text>

      <TextInput style={styles.input} placeholder="Email hoặc số điện thoại" />
      <TextInput style={styles.input} placeholder="Nhập mật khẩu" secureTextEntry />

      <View style={styles.row}>
        <Text>Nhớ mật khẩu</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

       <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => router.push("/register")}   
      >
        <Text style={styles.registerText}>Đăng Ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 },
  link: { color: "#2ECC71" },
  loginButton: { width: "100%", backgroundColor: "#2ECC71", padding: 14, borderRadius: 8, marginBottom: 10 },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  registerButton: { width: "100%", backgroundColor: "#fff", borderWidth: 1, borderColor: "#2ECC71", padding: 14, borderRadius: 8 },
  registerText: { color: "#2ECC71", fontSize: 16, fontWeight: "600", textAlign: "center" },
});
