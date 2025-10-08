import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2ECC71",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerBtn: {
    padding: 6,
  },
  avatarBox: {
    alignItems: "center",
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  groupName: { fontSize: 18, fontWeight: "bold" },
  totalText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  memberText: { textAlign: "center", fontSize: 13, color: "#444" },
  tabRow: {
    flexDirection: "row",
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    fontWeight: "500",
    color: "#888",
  },
  tabActive: {
    color: "#2ECC71",
    borderBottomWidth: 2,
    borderBottomColor: "#2ECC71",
  },
  history: { marginTop: 16, paddingHorizontal: 12 },
  monthTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  paymentTitle: { fontSize: 15, fontWeight: "500" },
  paymentSub: { fontSize: 12, color: "#777" },
  paymentReceive: {
    color: "#2ECC71",
    fontWeight: "600",
    fontSize: 13,
  },
});

export default styles;
