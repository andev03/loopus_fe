import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#2ECC71",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 8,
    paddingHorizontal: 6,
    height: 36,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
  },

  addButton: {
    marginLeft: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },

  textContainer: { flex: 1 },

  groupName: { fontWeight: "bold", fontSize: 16, marginBottom: 2 },

  lastMessage: { color: "#555", fontSize: 14 },

  time: { color: "#777", fontSize: 12 },

  separator: { height: 1, backgroundColor: "#eee", marginLeft: 78 },
});

export default styles;
