import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemTitle: { fontSize: 15, color: "#000" },

  section: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  settingTitle: { fontSize: 15, fontWeight: "500", color: "#000" },
  settingDesc: { fontSize: 13, color: "#666", marginTop: 2 },

  footerBtn: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: { color: "#2ECC71", fontSize: 15, fontWeight: "600" },
});

export default styles;