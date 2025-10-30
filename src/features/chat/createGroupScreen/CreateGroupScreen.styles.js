import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },

  groupInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  groupNameInput: {
    flex: 1,
    fontSize: 15,
    marginHorizontal: 10,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 12,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
    color: "#333",
  },

  counterContainer: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  backgroundColor: "#f0f0f0",
  borderBottomWidth: 1,
  borderColor: "#ddd",
},
counterText: {
  fontSize: 14,
  color: "#555",
  fontWeight: "500",
},
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    marginRight: 12,
  },
  avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 12 },
  textContainer: { flex: 1 },
  name: { fontSize: 15, fontWeight: "500" },
  time: { fontSize: 12, color: "#888" },

  separator: { height: 1, backgroundColor: "#f0f0f0", marginLeft: 70 },

  sendButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2ECC71",
    padding: 16,
    borderRadius: 30,
    elevation: 3,
  },
});

export default styles;
