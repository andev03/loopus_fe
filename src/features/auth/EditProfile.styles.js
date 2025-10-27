import { StyleSheet } from "react-native";

const styles = {
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 4 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  scrollView: { paddingHorizontal: 16 },
  avatarContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#10b981",
  },
  overlay: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 13,
  },
  formContainer: { marginTop: 20 },
  inputGroup: { marginBottom: 16 },
  labelContainer: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { marginLeft: 6, color: "#374151", fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  inputDisabled: { backgroundColor: "#f3f4f6", color: "#9ca3af" },
  textArea: { height: 80, textAlignVertical: "top" },
  dateText: { color: "#111827", fontSize: 15 },
  datePlaceholder: { color: "#9ca3af", fontSize: 15 },
  button: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 6, fontWeight: "600" },
};


export default styles;