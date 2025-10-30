import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2ECC71",
    padding: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerBtn: {
    padding: 8,
  },
  avatarBox: {
    alignItems: "center",
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  totalText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 12,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#2ECC71",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  history: {
    flex: 1,
    marginTop: 10,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  paymentSub: {
    color: "#777",
    fontSize: 13,
  },
  paymentReceive: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2ECC71",
  },
});
