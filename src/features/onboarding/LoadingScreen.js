import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#28a745" />
      <Text style={styles.text}>Đang tải dữ liệu...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#28a745",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
  },
});
