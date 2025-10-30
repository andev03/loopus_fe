import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { alignItems: "center", paddingVertical: 20 },

  header: {
    backgroundColor: "#2ECC71",
    width: "100%",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  actionText: {
    color: "#333",
    fontWeight: "600",
  },

  menu: {
    width: "90%",
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },

  logoutButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Viền vàng cho avatar MEMBER
avatarPremium: {
  borderWidth: 3,
  borderColor: "#FFD700",
  borderRadius: 50,
  padding: 2,
},

// Badge Premium
premiumBadge: {
  backgroundColor: "#FFD700",
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 12,
  marginLeft: 8,
  flexDirection: "row",
  alignItems: "center",
},

premiumBadgeText: {
  color: "#1F2937",
  fontSize: 12,
  fontWeight: "bold",
},

// Banner Premium đã có
premiumActiveBanner: {
  backgroundColor: "#10b981",
  marginHorizontal: 16,
  marginTop: 20,
  marginBottom: 16,
  borderRadius: 16,
  padding: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 2,
  borderColor: "#34d399",
},
});

export default styles;
