import { StyleSheet } from "react-native";  

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  transferBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  iconRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 16 },
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
    marginBottom: 20,
  },
  currency: { fontSize: 16, color: "#555", marginRight: 8 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: "600", color: "#2ECC71" },
  payBtn: {
    backgroundColor: "#2ECC71",
    margin: 20,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default styles;