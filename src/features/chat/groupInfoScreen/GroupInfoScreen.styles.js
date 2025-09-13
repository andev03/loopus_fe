import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    padding: 12,
  },
  backButton: { marginRight: 8 },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  groupHeader: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  groupName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  actionItem: { alignItems: "center", width: 70 },
  actionText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    color: "#333",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0e0e0", 
    justifyContent: "center",
    alignItems: "center",
  },

  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 8 },
  photo: {
  width: 70,
  height: 70,
  borderRadius: 8,
  marginRight: 8,
  backgroundColor: "#ddd",
},

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { marginLeft: 12, fontSize: 14, color: "#333", flex: 1 },
  arrow: { marginLeft: "auto" },

 photoRow: {
  paddingHorizontal: 16,
  paddingVertical: 12,
},
  photoContainer: {
  flexDirection: "row",
  paddingHorizontal: 16,
  paddingBottom: 12,
  backgroundColor: "#fff",
},
photoBlock: {
  backgroundColor: "#fff",
  marginBottom: 12, 
},
photoHeader: {
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
});

export default styles;