import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container modal - Full screen
  modalContainer: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },

  // Chat box chính - Full screen
  chatBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#10B981',
    borderBottomWidth: 1,
    borderBottomColor: '#059669',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  closeBtn: {
    padding: 8,
  },

  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // Messages container
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // Message bubble
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#10B981',
    borderBottomRightRadius: 4,
  },

  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },

  botMessageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Loading indicator
  loadingContainer: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },

  // Quick questions section
  quickQuestionsSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },

  quickQuestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  quickQuestionsScroll: {
    paddingHorizontal: 16,
  },

  quickBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  quickBtnText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },

  // Input section
  inputSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    color: '#1F2937',
    maxHeight: 100,
  },

  sendBtn: {
    backgroundColor: '#10B981',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  sendBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },

  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default styles;