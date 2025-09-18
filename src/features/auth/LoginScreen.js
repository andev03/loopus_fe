import { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { login } from "../../services/authService"; 

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      console.log("Login success:", data);

    

      Alert.alert("Thành công", "Đăng nhập thành công!");
      router.replace("/(tabs)/home"); 
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>Chào mừng bạn tới LOOPUS</Text>

      <TextInput
        style={styles.input}
        placeholder="Email hoặc số điện thoại"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  registerButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#2ECC71",
    padding: 14,
    borderRadius: 8,
  },
  registerText: { color: "#2ECC71", fontSize: 16, fontWeight: "600", textAlign: "center" },
});
