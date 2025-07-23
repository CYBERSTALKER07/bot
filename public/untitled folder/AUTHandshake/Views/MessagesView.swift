import SwiftUI
import Combine

struct MessagesView: View {
    @StateObject private var messagesManager = MessagesManager()
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var searchText = ""
    @State private var showingNewMessage = false
    @State private var selectedConversation: Conversation?
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search Bar
                SearchBar(text: $searchText)
                    .padding(.horizontal)
                    .padding(.top, 8)
                
                // Conversations List
                if messagesManager.isLoading && messagesManager.conversations.isEmpty {
                    LoadingView()
                } else if messagesManager.conversations.isEmpty {
                    EmptyMessagesView()
                } else {
                    conversationsList
                }
                
                Spacer()
            }
            .navigationTitle("Messages")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingNewMessage = true }) {
                        Image(systemName: "square.and.pencil")
                            .font(.title2)
                            .foregroundColor(.accentColor)
                    }
                }
            }
            .sheet(isPresented: $showingNewMessage) {
                NewConversationView()
                    .environmentObject(messagesManager)
            }
            .onAppear {
                messagesManager.loadConversations()
            }
            .refreshable {
                await messagesManager.refreshConversations()
            }
            
            // Detail View (iPad)
            if let conversation = selectedConversation {
                ConversationDetailView(conversation: conversation)
                    .environmentObject(messagesManager)
            } else {
                EmptyConversationDetailView()
            }
        }
        .navigationViewStyle(DoubleColumnNavigationViewStyle())
    }
    
    private var conversationsList: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(filteredConversations) { conversation in
                    ConversationRowView(
                        conversation: conversation,
                        isSelected: selectedConversation?.id == conversation.id
                    )
                    .onTapGesture {
                        selectedConversation = conversation
                        messagesManager.markConversationAsRead(conversation.id)
                    }
                    .contextMenu {
                        conversationContextMenu(for: conversation)
                    }
                    
                    Divider()
                        .padding(.leading, 72)
                }
            }
        }
    }
    
    private var filteredConversations: [Conversation] {
        if searchText.isEmpty {
            return messagesManager.conversations
        } else {
            return messagesManager.conversations.filter { conversation in
                conversation.title?.localizedCaseInsensitiveContains(searchText) == true ||
                conversation.lastMessage?.content.localizedCaseInsensitiveContains(searchText) == true
            }
        }
    }
    
    @ViewBuilder
    private func conversationContextMenu(for conversation: Conversation) -> some View {
        Button(action: {
            messagesManager.markConversationAsRead(conversation.id)
        }) {
            Label("Mark as Read", systemImage: "envelope.open")
        }
        
        Button(action: {
            messagesManager.muteConversation(conversation.id)
        }) {
            Label("Mute", systemImage: "bell.slash")
        }
        
        Button(role: .destructive, action: {
            messagesManager.deleteConversation(conversation.id)
        }) {
            Label("Delete", systemImage: "trash")
        }
    }
}

// MARK: - Conversation Row View
struct ConversationRowView: View {
    let conversation: Conversation
    let isSelected: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            AsyncImage(url: URL(string: conversation.participants.first?.profileImageURL ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Circle()
                    .fill(Color.gray.opacity(0.3))
                    .overlay(
                        Text(conversation.participants.first?.firstName.prefix(1) ?? "?")
                            .font(.title2)
                            .fontWeight(.medium)
                            .foregroundColor(.white)
                    )
            }
            .frame(width: 50, height: 50)
            .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(conversationTitle)
                        .font(.headline)
                        .fontWeight(conversation.unreadCount > 0 ? .semibold : .medium)
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    Text(timeAgo)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                if let lastMessage = conversation.lastMessage {
                    HStack {
                        Text(lastMessage.content)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                        
                        Spacer()
                        
                        if conversation.unreadCount > 0 {
                            Text("\(conversation.unreadCount)")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.accentColor)
                                .clipShape(Capsule())
                        }
                    }
                }
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 12)
        .background(isSelected ? Color.accentColor.opacity(0.1) : Color.clear)
        .contentShape(Rectangle())
    }
    
    private var conversationTitle: String {
        if let title = conversation.title {
            return title
        } else if conversation.isGroup {
            return "Group Chat"
        } else {
            return conversation.participants.first?.fullName ?? "Unknown"
        }
    }
    
    private var timeAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: conversation.lastActivity, relativeTo: Date())
    }
}

// MARK: - Conversation Detail View
struct ConversationDetailView: View {
    let conversation: Conversation
    @EnvironmentObject var messagesManager: MessagesManager
    @State private var messageText = ""
    @State private var showingAttachmentPicker = false
    @FocusState private var isTextFieldFocused: Bool
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            ConversationHeaderView(conversation: conversation)
            
            Divider()
            
            // Messages
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach(messagesManager.messages) { message in
                            MessageBubbleView(
                                message: message,
                                isFromCurrentUser: message.senderId == messagesManager.currentUserId
                            )
                            .id(message.id)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.top)
                }
                .onAppear {
                    scrollToBottom(proxy: proxy)
                }
                .onChange(of: messagesManager.messages.count) { _ in
                    scrollToBottom(proxy: proxy)
                }
            }
            
            // Message Input
            MessageInputView(
                messageText: $messageText,
                showingAttachmentPicker: $showingAttachmentPicker,
                onSend: sendMessage
            )
            .focused($isTextFieldFocused)
        }
        .navigationBarHidden(true)
        .onAppear {
            messagesManager.loadMessages(for: conversation.id)
        }
        .sheet(isPresented: $showingAttachmentPicker) {
            AttachmentPickerView { attachment in
                messagesManager.sendAttachment(attachment, to: conversation.id)
            }
        }
    }
    
    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        
        messagesManager.sendMessage(messageText, to: conversation.id)
        messageText = ""
    }
    
    private func scrollToBottom(proxy: ScrollViewReader) {
        if let lastMessage = messagesManager.messages.last {
            withAnimation(.easeOut(duration: 0.3)) {
                proxy.scrollTo(lastMessage.id, anchor: .bottom)
            }
        }
    }
}

// MARK: - Message Bubble View
struct MessageBubbleView: View {
    let message: Message
    let isFromCurrentUser: Bool
    
    var body: some View {
        HStack {
            if isFromCurrentUser {
                Spacer(minLength: 50)
                messageBubble
            } else {
                messageBubble
                Spacer(minLength: 50)
            }
        }
    }
    
    private var messageBubble: some View {
        VStack(alignment: isFromCurrentUser ? .trailing : .leading, spacing: 4) {
            if !isFromCurrentUser, let sender = message.sender {
                Text(sender.fullName)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 4)
            }
            
            VStack(alignment: .leading, spacing: 8) {
                if let attachments = message.attachments, !attachments.isEmpty {
                    ForEach(attachments) { attachment in
                        AttachmentView(attachment: attachment)
                    }
                }
                
                if !message.content.isEmpty {
                    Text(message.content)
                        .font(.body)
                        .foregroundColor(isFromCurrentUser ? .white : .primary)
                        .multilineTextAlignment(.leading)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 18)
                    .fill(isFromCurrentUser ? Color.accentColor : Color(.systemGray5))
            )
            
            Text(timeFormatter.string(from: message.timestamp))
                .font(.caption2)
                .foregroundColor(.secondary)
                .padding(.horizontal, 4)
        }
    }
    
    private let timeFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter
    }()
}

// MARK: - Supporting Views
struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
            
            TextField("Search conversations", text: $text)
                .textFieldStyle(PlainTextFieldStyle())
            
            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct LoadingView: View {
    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.2)
            Text("Loading conversations...")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct EmptyMessagesView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "message.circle")
                .font(.system(size: 64))
                .foregroundColor(.secondary)
            
            Text("No Messages Yet")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("Start a conversation with your connections or employers")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct EmptyConversationDetailView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "bubble.left.and.bubble.right")
                .font(.system(size: 64))
                .foregroundColor(.secondary)
            
            Text("Select a Conversation")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("Choose a conversation from the sidebar to start messaging")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemGroupedBackground))
    }
}

#Preview {
    MessagesView()
        .environmentObject(AuthenticationManager())
}