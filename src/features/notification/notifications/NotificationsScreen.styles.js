import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    paddingRight: 12,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  list: { paddingVertical: 8 },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  icon: { marginRight: 12, marginTop: 2 },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: "500", color: "#000" },
  itemSub: { fontSize: 14, color: "#444", marginTop: 2 },
  itemTime: { fontSize: 12, color: "#999", marginTop: 4 },
});


export default styles;