import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  // Container
  container: { 
    flex: 1, 
    backgroundColor: "#f8f8f8" 
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
    letterSpacing: 2,
  },

  // Groups Section
  groupsSection: { 
    backgroundColor: "#b4f1d3",
    paddingBottom: 16,
  },
  groups: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    paddingHorizontal: 16,
    marginBottom: 16 
  },
  groupBox: { 
    alignItems: "center" 
  },
  groupImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginBottom: 6,
    borderWidth: 3,
    borderColor: "#fff",
  },

  // Action Container (Nhắc nợ & Thanh toán)
  actionContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  actionItem: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  leftItem: { 
    borderRightWidth: 1, 
    borderRightColor: "#eee" 
  },
  rightItem: {},
  actionText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  // Section Titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginVertical: 8,
    color: "#333",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
    marginVertical: 6,
    color: "#333",
  },

  // Travel & Deal Cards
  dealRow: { 
    paddingLeft: 16, 
    marginBottom: 12 
  },
  travelCard: {
    width: 280,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#fff",
  },
  travelImage: { 
    width: "100%", 
    height: "100%" 
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 12,
    alignItems: "center",
  },
  overlayText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16 
  },
  dealCard: {
    width: 180,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  dealImageFull: { 
    width: "100%", 
    height: "100%" 
  },

  // Floating Chat Button
  chatFAB: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2ECC71', 
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // Modal Group Item
  groupModalItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f8fdf9',
    borderWidth: 1.5,
    borderColor: '#e8f5e9',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupModalAvatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: 14,
    borderWidth: 2.5,
    borderColor: '#2ECC71',
  },
  groupModalName: { 
    fontSize: 16, 
    flex: 1,
    fontWeight: '600',
    color: '#1a5f3a',
    letterSpacing: 0.3,
  },

  // Modal Member Item
  memberModalItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  memberModalAvatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#81C784',
  },
  memberModalName: { 
    fontSize: 15.5, 
    flex: 1,
    fontWeight: '500',
    color: '#2d5f3f',
    letterSpacing: 0.2,
  },

  // Search Input
  searchInput: {
    backgroundColor: '#f1f8f4',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: '#c8e6c9',
    color: '#1a5f3a',
  },
});