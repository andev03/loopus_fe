import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    padding: 12,
  },
  headerBtn: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  amount: {
    fontSize: 18,
    color: "#2ECC71",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: {
    color: "#555",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "500",
  },
  participantSub: {
    color: "#777",
  },
  participantAmount: {
    fontWeight: "bold",
    color: "#E74C3C",
  },
});
