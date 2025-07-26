import SwiftUI
import PhotosUI

// MARK: - Conversation Header View
struct ConversationHeaderView: View {
    let conversation: Conversation
    @State private var showingParticipants = false
    
    var body: some View {
        HStack {
            Button(action: {}) {
                Image(systemName: "chevron.left")
                    .font(.title2)
                    .foregroundColor(.accentColor)
            }
            
            AsyncImage(url: URL(string: conversation.participants.first?.profileImageURL ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Circle()
                    .fill(Color.gray.opacity(0.3))
                    .overlay(
                        Text(conversation.participants.first?.firstName.prefix(1) ?? "?")
                            .font(.title3)
                            .fontWeight(.medium)
                            .foregroundColor(.white)
                    )
            }
            .frame(width: 35, height: 35)
            .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 2) {
                Text(conversationTitle)
                    .font(.headline)
                    .fontWeight(.semibold)
                
                if conversation.isGroup {
                    Text("\(conversation.participantIds.count) participants")
                        .font(.caption)
                        .foregroundColor(.secondary)
                } else {
                    Text("Online")
                        .font(.caption)
                        .foregroundColor(.green)
                }
            }
            
            Spacer()
            
            Button(action: { showingParticipants = true }) {
                Image(systemName: "info.circle")
                    .font(.title2)
                    .foregroundColor(.accentColor)
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 12)
        .background(Color(.systemBackground))
        .sheet(isPresented: $showingParticipants) {
            ConversationInfoView(conversation: conversation)
        }
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
}

// MARK: - Message Input View
struct MessageInputView: View {
    @Binding var messageText: String
    @Binding var showingAttachmentPicker: Bool
    let onSend: () -> Void
    
    var body: some View {
        VStack(spacing: 0) {
            Divider()
            
            HStack(alignment: .bottom, spacing: 12) {
                Button(action: { showingAttachmentPicker = true }) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundColor(.accentColor)
                }
                
                HStack(alignment: .bottom, spacing: 8) {
                    TextField("Type a message...", text: $messageText, axis: .vertical)
                        .textFieldStyle(PlainTextFieldStyle())
                        .lineLimit(1...5)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color(.systemGray6))
                        .cornerRadius(20)
                    
                    Button(action: onSend) {
                        Image(systemName: "arrow.up.circle.fill")
                            .font(.title2)
                            .foregroundColor(messageText.isEmpty ? .gray : .accentColor)
                    }
                    .disabled(messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
            .background(Color(.systemBackground))
        }
    }
}

// MARK: - Attachment View
struct AttachmentView: View {
    let attachment: MessageAttachment
    
    var body: some View {
        Group {
            switch attachment.type {
            case .image:
                AsyncImage(url: URL(string: attachment.url)) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                        .overlay(
                            ProgressView()
                        )
                }
                .frame(maxWidth: 200, maxHeight: 200)
                .cornerRadius(12)
                
            case .document, .pdf, .resume:
                HStack {
                    Image(systemName: documentIcon)
                        .font(.title2)
                        .foregroundColor(.accentColor)
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(attachment.fileName)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .lineLimit(1)
                        
                        if let fileSize = attachment.fileSize {
                            Text(formatFileSize(fileSize))
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    Spacer()
                    
                    Button(action: {}) {
                        Image(systemName: "arrow.down.circle")
                            .foregroundColor(.accentColor)
                    }
                }
                .padding(12)
                .background(Color(.systemGray6))
                .cornerRadius(12)
                .frame(maxWidth: 250)
            }
        }
    }
    
    private var documentIcon: String {
        switch attachment.type {
        case .pdf:
            return "doc.fill"
        case .resume:
            return "person.text.rectangle.fill"
        default:
            return "doc.fill"
        }
    }
    
    private func formatFileSize(_ bytes: Int) -> String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(bytes))
    }
}

// MARK: - New Conversation View
struct NewConversationView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var messagesManager: MessagesManager
    @State private var searchText = ""
    @State private var selectedUsers: Set<String> = []
    @State private var isGroup = false
    @State private var groupName = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                SearchBar(text: $searchText)
                    .padding(.horizontal)
                    .padding(.top, 8)
                
                if isGroup {
                    VStack(spacing: 12) {
                        TextField("Group name", text: $groupName)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .padding(.horizontal)
                        
                        Toggle("Group Chat", isOn: $isGroup)
                            .padding(.horizontal)
                    }
                    .padding(.vertical, 8)
                    .background(Color(.systemGroupedBackground))
                }
                
                List {
                    Section {
                        Toggle("Create Group Chat", isOn: $isGroup)
                    }
                    
                    Section("Contacts") {
                        ForEach(filteredUsers) { user in
                            MessageUserRowView(
                                user: user,
                                isSelected: selectedUsers.contains(user.id)
                            ) {
                                toggleUserSelection(user.id)
                            }
                        }
                    }
                }
            }
            .navigationTitle("New Message")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Start") {
                        createConversation()
                    }
                    .disabled(selectedUsers.isEmpty)
                }
            }
        }
    }
    
    private var filteredUsers: [User] {
        // Mock users for demonstration
        mockUsers.filter { user in
            searchText.isEmpty ||
            user.fullName.localizedCaseInsensitiveContains(searchText) ||
            user.email.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    private var mockUsers: [User] {
        [
            User(
                id: "user_1",
                email: "john.doe@aut.ac.nz",
                firstName: "John",
                lastName: "Doe",
                studentId: "19123456",
                university: "AUT",
                major: "Computer Science",
                graduationYear: 2025,
                profileImageURL: nil,
                bio: "Software Engineering Student",
                skills: ["Swift", "iOS", "Python"],
                gpa: 3.8,
                isEmployer: false,
                companyName: nil,
                position: nil,
                createdAt: Date(),
                updatedAt: Date()
            ),
            User(
                id: "user_2",
                email: "sarah.wilson@techcorp.com",
                firstName: "Sarah",
                lastName: "Wilson",
                studentId: nil,
                university: "AUT",
                major: nil,
                graduationYear: nil,
                profileImageURL: nil,
                bio: "Senior iOS Developer at TechCorp",
                skills: ["Swift", "iOS", "React Native"],
                gpa: nil,
                isEmployer: true,
                companyName: "TechCorp",
                position: "Senior iOS Developer",
                createdAt: Date(),
                updatedAt: Date()
            )
        ]
    }
    
    private func toggleUserSelection(_ userId: String) {
        if selectedUsers.contains(userId) {
            selectedUsers.remove(userId)
        } else {
            if isGroup {
                selectedUsers.insert(userId)
            } else {
                selectedUsers = [userId]
            }
        }
    }
    
    private func createConversation() {
        // Implementation to create new conversation
        dismiss()
    }
}

// MARK: - Conversation Info View
struct ConversationInfoView: View {
    let conversation: Conversation
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    VStack(spacing: 12) {
                        AsyncImage(url: URL(string: conversation.participants.first?.profileImageURL ?? "")) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Circle()
                                .fill(Color.gray.opacity(0.3))
                                .overlay(
                                    Text(conversation.participants.first?.firstName.prefix(1) ?? "?")
                                        .font(.largeTitle)
                                        .fontWeight(.medium)
                                        .foregroundColor(.white)
                                )
                        }
                        .frame(width: 80, height: 80)
                        .clipShape(Circle())
                        
                        Text(conversationTitle)
                            .font(.title2)
                            .fontWeight(.semibold)
                        
                        if conversation.isGroup {
                            Text("\(conversation.participantIds.count) participants")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical)
                }
                
                if conversation.isGroup {
                    Section("Participants") {
                        ForEach(conversation.participants) { participant in
                            MessageUserRowView(user: participant, isSelected: false) {}
                        }
                    }
                }
                
                Section("Actions") {
                    Button(action: {}) {
                        Label("Mute Notifications", systemImage: "bell.slash")
                    }
                    
                    Button(action: {}) {
                        Label("View Profile", systemImage: "person.circle")
                    }
                    
                    Button(role: .destructive, action: {}) {
                        Label("Delete Conversation", systemImage: "trash")
                    }
                }
            }
            .navigationTitle("Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
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
}

// MARK: - Attachment Picker View
struct AttachmentPickerView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var selectedItem: PhotosPickerItem?
    @State private var showingDocumentPicker = false
    let onAttachmentSelected: (MessageAttachment) -> Void
    
    var body: some View {
        NavigationView {
            List {
                Section("Media") {
                    PhotosPicker(
                        selection: $selectedItem,
                        matching: .images
                    ) {
                        Label("Photo Library", systemImage: "photo.on.rectangle")
                    }
                    
                    Button(action: {}) {
                        Label("Camera", systemImage: "camera")
                    }
                }
                
                Section("Documents") {
                    Button(action: { showingDocumentPicker = true }) {
                        Label("Browse Files", systemImage: "folder")
                    }
                    
                    Button(action: {}) {
                        Label("Scan Document", systemImage: "doc.viewfinder")
                    }
                }
            }
            .navigationTitle("Add Attachment")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
        .fileImporter(
            isPresented: $showingDocumentPicker,
            allowedContentTypes: [.pdf, .plainText, .data],
            allowsMultipleSelection: false
        ) { result in
            handleDocumentSelection(result)
        }
        .onChange(of: selectedItem) { _, newItem in
            handlePhotoSelection(for: newItem)
        }
    }
    
    private func handlePhotoSelection(for selectedItem: PhotosPickerItem?) {
        guard selectedItem != nil else { return }
        
        // Create mock attachment for photo
        let attachment = MessageAttachment(
            id: UUID().uuidString,
            type: .image,
            url: "mock_photo_url",
            fileName: "Photo.jpg",
            fileSize: 1024000,
            mimeType: "image/jpeg"
        )
        
        onAttachmentSelected(attachment)
        dismiss()
    }
    
    private func handleDocumentSelection(_ result: Result<[URL], Error>) {
        switch result {
        case .success(let urls):
            guard let url = urls.first else { return }
            
            let attachment = MessageAttachment(
                id: UUID().uuidString,
                type: .document,
                url: url.absoluteString,
                fileName: url.lastPathComponent,
                fileSize: nil,
                mimeType: nil
            )
            
            onAttachmentSelected(attachment)
            dismiss()
            
        case .failure(let error):
            print("Document selection failed: \(error)")
        }
    }
}

// MARK: - Message User Row View
struct MessageUserRowView: View {
    let user: User
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                AsyncImage(url: URL(string: user.profileImageURL ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                        .overlay(
                            Text(user.firstName.prefix(1))
                                .font(.subheadline)
                                .fontWeight(.medium)
                                .foregroundColor(.white)
                        )
                }
                .frame(width: 40, height: 40)
                .clipShape(Circle())
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(user.fullName)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                    
                    Text(user.email)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.accentColor)
                        .font(.title3)
                }
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    ConversationHeaderView(conversation: Conversation(
        id: "1",
        participantIds: ["user1"],
        title: "John Doe",
        lastMessage: nil,
        lastActivity: Date(),
        isGroup: false,
        unreadCount: 0,
        createdAt: Date()
    ))
}
