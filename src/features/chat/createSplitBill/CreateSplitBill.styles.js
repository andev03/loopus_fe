import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2ECC71",
    padding: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },

  body: { flex: 1, padding: 20, alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
    marginBottom: 12,
  },
  amount: {
    color: "#2ECC71",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: { fontSize: 14, color: "#000" },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2ECC71",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  dropdownText: { fontSize: 14, color: "#2ECC71", marginRight: 4 },

  createButton: {
    backgroundColor: "#2ECC71",
    margin: 20,
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default styles;