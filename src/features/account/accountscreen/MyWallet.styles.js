import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2ECC71",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  balanceCard: {
    backgroundColor: "#E8F8F5",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  balanceLabel: { fontSize: 14, color: "#555" },
  balanceAmount: { fontSize: 26, fontWeight: "700", color: "#2ECC71", marginTop: 6 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 6,
  },
  actionText: { color: "#333", marginLeft: 6, fontWeight: "600" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 22,
    marginTop: 8,
    marginBottom: 6,
  },
  transactionList: { paddingHorizontal: 20 },
  transactionItem: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionType: { fontSize: 15, fontWeight: "500", color: "#333" },
  transactionDate: { fontSize: 13, color: "#888", marginTop: 2 },
  transactionAmount: { fontSize: 15, fontWeight: "600" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ECC71",
    marginHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  backText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  depositButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#2ECC71",
  padding: 12,
  marginVertical: 10,
  borderRadius: 8,
},
depositText: {
  color: "#fff",
  fontSize: 16,
  marginLeft: 8,
  fontWeight: "bold",
},

});

export default styles;