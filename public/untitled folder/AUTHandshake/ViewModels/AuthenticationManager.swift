import Foundation
import Combine

class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    private let authService = AuthService()
    
    init() {
        checkAuthenticationStatus()
    }
    
    func checkAuthenticationStatus() {
        isLoading = true
        
        // Check if user is already logged in (e.g., token exists)
        if let savedUser = loadUserFromStorage() {
            currentUser = savedUser
            isAuthenticated = true
        }
        
        isLoading = false
    }
    
    func signIn(email: String, password: String) {
        isLoading = true
        errorMessage = nil
        
        authService.signIn(email: email, password: password)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] user in
                    self?.currentUser = user
                    self?.isAuthenticated = true
                    self?.saveUserToStorage(user)
                }
            )
            .store(in: &cancellables)
    }
    
    func signUp(user: User, password: String) {
        isLoading = true
        errorMessage = nil
        
        authService.signUp(user: user, password: password)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] user in
                    self?.currentUser = user
                    self?.isAuthenticated = true
                    self?.saveUserToStorage(user)
                }
            )
            .store(in: &cancellables)
    }
    
    func signOut() {
        currentUser = nil
        isAuthenticated = false
        clearUserFromStorage()
    }
    
    private func loadUserFromStorage() -> User? {
        // Implement secure storage retrieval
        return nil
    }
    
    private func saveUserToStorage(_ user: User) {
        // Implement secure storage saving
    }
    
    private func clearUserFromStorage() {
        // Implement secure storage clearing
    }
}

class JobManager: ObservableObject {
    @Published var jobs: [Job] = []
    @Published var applications: [Application] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    private let jobService = JobService()
    
    func loadJobs() {
        isLoading = true
        
        jobService.fetchJobs()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] jobs in
                    self?.jobs = jobs
                }
            )
            .store(in: &cancellables)
    }
    
    func applyToJob(_ job: Job, coverLetter: String?) {
        jobService.applyToJob(jobId: job.id, coverLetter: coverLetter)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] application in
                    self?.applications.append(application)
                }
            )
            .store(in: &cancellables)
    }
    
    func loadApplications() {
        jobService.fetchApplications()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] applications in
                    self?.applications = applications
                }
            )
            .store(in: &cancellables)
    }
}

// MARK: - Messages Manager
class MessagesManager: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var messages: [Message] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var currentUserId: String = ""
    
    private var cancellables = Set<AnyCancellable>()
    private let messageService = MessageService()
    
    init() {
        // In a real app, get this from authentication
        currentUserId = "current_user_id"
        loadMockData()
    }
    
    func loadConversations() {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.isLoading = false
        }
    }
    
    @MainActor
    func refreshConversations() async {
        isLoading = true
        
        // Simulate refresh
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        
        isLoading = false
    }
    
    func loadMessages(for conversationId: String) {
        // Load messages for specific conversation
        messages = mockMessages.filter { $0.conversationId == conversationId }
    }
    
    func sendMessage(_ content: String, to conversationId: String) {
        let newMessage = Message(
            id: UUID().uuidString,
            conversationId: conversationId,
            senderId: currentUserId,
            content: content,
            type: .text,
            timestamp: Date(),
            isRead: false,
            attachments: nil,
            replyToMessageId: nil
        )
        
        messages.append(newMessage)
        updateConversationLastMessage(conversationId: conversationId, message: newMessage)
    }
    
    func sendAttachment(_ attachment: MessageAttachment, to conversationId: String) {
        let newMessage = Message(
            id: UUID().uuidString,
            conversationId: conversationId,
            senderId: currentUserId,
            content: "",
            type: .document,
            timestamp: Date(),
            isRead: false,
            attachments: [attachment],
            replyToMessageId: nil
        )
        
        messages.append(newMessage)
        updateConversationLastMessage(conversationId: conversationId, message: newMessage)
    }
    
    func markConversationAsRead(_ conversationId: String) {
        if let index = conversations.firstIndex(where: { $0.id == conversationId }) {
            let updatedConversation = Conversation(
                id: conversations[index].id,
                participantIds: conversations[index].participantIds,
                title: conversations[index].title,
                lastMessage: conversations[index].lastMessage,
                lastActivity: conversations[index].lastActivity,
                isGroup: conversations[index].isGroup,
                unreadCount: 0,
                createdAt: conversations[index].createdAt
            )
            conversations[index] = updatedConversation
        }
    }
    
    func muteConversation(_ conversationId: String) {
        // Implementation for muting conversation
    }
    
    func deleteConversation(_ conversationId: String) {
        conversations.removeAll { $0.id == conversationId }
    }
    
    private func updateConversationLastMessage(conversationId: String, message: Message) {
        if let index = conversations.firstIndex(where: { $0.id == conversationId }) {
            let updatedConversation = Conversation(
                id: conversations[index].id,
                participantIds: conversations[index].participantIds,
                title: conversations[index].title,
                lastMessage: message,
                lastActivity: Date(),
                isGroup: conversations[index].isGroup,
                unreadCount: conversations[index].unreadCount,
                createdAt: conversations[index].createdAt
            )
            conversations[index] = updatedConversation
        }
    }
    
    // MARK: - Mock Data
    private func loadMockData() {
        conversations = mockConversations
        messages = mockMessages
    }
    
    private var mockConversations: [Conversation] {
        [
            Conversation(
                id: "conv_1",
                participantIds: ["user_1", "current_user"],
                title: nil,
                lastMessage: Message(
                    id: "msg_1",
                    conversationId: "conv_1",
                    senderId: "user_1",
                    content: "Hi! I saw your profile and would love to connect about the software engineering role.",
                    type: .text,
                    timestamp: Date().addingTimeInterval(-3600),
                    isRead: false,
                    attachments: nil,
                    replyToMessageId: nil
                ),
                lastActivity: Date().addingTimeInterval(-3600),
                isGroup: false,
                unreadCount: 2,
                createdAt: Date().addingTimeInterval(-86400)
            ),
            Conversation(
                id: "conv_2",
                participantIds: ["user_2", "current_user"],
                title: nil,
                lastMessage: Message(
                    id: "msg_2",
                    conversationId: "conv_2",
                    senderId: "current_user",
                    content: "Thanks for the interview opportunity! Looking forward to hearing back.",
                    type: .text,
                    timestamp: Date().addingTimeInterval(-7200),
                    isRead: true,
                    attachments: nil,
                    replyToMessageId: nil
                ),
                lastActivity: Date().addingTimeInterval(-7200),
                isGroup: false,
                unreadCount: 0,
                createdAt: Date().addingTimeInterval(-172800)
            ),
            Conversation(
                id: "conv_3",
                participantIds: ["user_3", "user_4", "current_user"],
                title: "Engineering Team Chat",
                lastMessage: Message(
                    id: "msg_3",
                    conversationId: "conv_3",
                    senderId: "user_3",
                    content: "Great work on the project presentation everyone!",
                    type: .text,
                    timestamp: Date().addingTimeInterval(-14400),
                    isRead: true,
                    attachments: nil,
                    replyToMessageId: nil
                ),
                lastActivity: Date().addingTimeInterval(-14400),
                isGroup: true,
                unreadCount: 0,
                createdAt: Date().addingTimeInterval(-259200)
            )
        ]
    }
    
    private var mockMessages: [Message] {
        [
            Message(
                id: "msg_1_1",
                conversationId: "conv_1",
                senderId: "user_1",
                content: "Hi! I saw your profile and would love to connect about the software engineering role.",
                type: .text,
                timestamp: Date().addingTimeInterval(-7200),
                isRead: true,
                attachments: nil,
                replyToMessageId: nil
            ),
            Message(
                id: "msg_1_2",
                conversationId: "conv_1",
                senderId: "user_1",
                content: "I think your experience with Swift and iOS development would be a great fit for our team.",
                type: .text,
                timestamp: Date().addingTimeInterval(-3600),
                isRead: false,
                attachments: nil,
                replyToMessageId: nil
            ),
            Message(
                id: "msg_2_1",
                conversationId: "conv_2",
                senderId: "user_2",
                content: "Thank you for applying to our iOS Developer position. We'd like to schedule an interview.",
                type: .text,
                timestamp: Date().addingTimeInterval(-10800),
                isRead: true,
                attachments: nil,
                replyToMessageId: nil
            ),
            Message(
                id: "msg_2_2",
                conversationId: "conv_2",
                senderId: "current_user",
                content: "Thanks for the interview opportunity! Looking forward to hearing back.",
                type: .text,
                timestamp: Date().addingTimeInterval(-7200),
                isRead: true,
                attachments: nil,
                replyToMessageId: nil
            )
        ]
    }
}

// MARK: - Event Manager
class EventManager: ObservableObject {
    @Published var events: [Event] = []
    @Published var registeredEvents: [Event] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    private let eventService = EventService()
    
    init() {
        loadMockEvents()
    }
    
    func loadEvents() {
        isLoading = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.isLoading = false
        }
    }
    
    func registerForEvent(_ event: Event) {
        if !registeredEvents.contains(where: { $0.id == event.id }) {
            registeredEvents.append(event)
        }
    }
    
    func unregisterFromEvent(_ event: Event) {
        registeredEvents.removeAll { $0.id == event.id }
    }
    
    func isRegistered(for event: Event) -> Bool {
        registeredEvents.contains { $0.id == event.id }
    }
    
    private func loadMockEvents() {
        events = [
            Event(
                id: "event_1",
                title: "Tech Career Fair 2025",
                description: "Connect with leading tech companies and explore exciting career opportunities in software development, data science, and engineering.",
                date: Date().addingTimeInterval(86400 * 7),
                endDate: Date().addingTimeInterval(86400 * 7 + 28800),
                location: "AUT City Campus, Level 3",
                organizer: "AUT Career Services",
                category: .careerFair,
                imageURL: nil,
                registrationRequired: true,
                maxAttendees: 200,
                currentAttendees: 156,
                isVirtual: false,
                meetingLink: nil
            ),
            Event(
                id: "event_2",
                title: "Resume Writing Workshop",
                description: "Learn how to craft a compelling resume that stands out to employers. Get personalized feedback from industry professionals.",
                date: Date().addingTimeInterval(86400 * 3),
                endDate: Date().addingTimeInterval(86400 * 3 + 7200),
                location: "Online via Zoom",
                organizer: "Career Development Team",
                category: .workshop,
                imageURL: nil,
                registrationRequired: true,
                maxAttendees: 50,
                currentAttendees: 32,
                isVirtual: true,
                meetingLink: "https://zoom.us/j/1234567890"
            ),
            Event(
                id: "event_3",
                title: "Networking Night: Young Professionals",
                description: "An evening of networking with recent graduates and young professionals across various industries.",
                date: Date().addingTimeInterval(86400 * 14),
                endDate: Date().addingTimeInterval(86400 * 14 + 10800),
                location: "AUT South Campus, Student Hub",
                organizer: "Alumni Association",
                category: .networking,
                imageURL: nil,
                registrationRequired: true,
                maxAttendees: 100,
                currentAttendees: 78,
                isVirtual: false,
                meetingLink: nil
            )
        ]
    }
}