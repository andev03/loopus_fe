// Payout.styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fcff", // nền xanh nhạt nhẹ
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    color: "#34495E",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D6EAF8",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#2C3E50",
    backgroundColor: "#fff",
  },
  bankInfoLabel: {
    fontSize: 15,
    color: "#2C3E50",
    marginBottom: 5,
  },
  depositButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498DB",
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#3498DB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  depositText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#95A5A6",
    paddingVertical: 12,
    borderRadius: 10,
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 6,
  },
});

export default styles;
