import SwiftUI
import Combine

struct NotificationsView: View {
    @StateObject private var notificationManager = NotificationManager()
    @State private var selectedFilter: NotificationFilter = .all
    @State private var showingSettings = false
    
    var filteredNotifications: [NotificationModel] {
        switch selectedFilter {
        case .all:
            return notificationManager.notifications
        case .unread:
            return notificationManager.notifications.filter { !$0.isRead }
        case .jobMatches:
            return notificationManager.notifications.filter { $0.type == .jobMatch }
        case .applications:
            return notificationManager.notifications.filter { $0.type == .applicationUpdate }
        case .messages:
            return notificationManager.notifications.filter { $0.type == .messageReceived }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Filter Tabs
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(NotificationFilter.allCases, id: \.self) { filter in
                            FilterChip(
                                title: filter.title,
                                count: filter.count(from: notificationManager.notifications),
                                isSelected: selectedFilter == filter
                            ) {
                                selectedFilter = filter
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical, 12)
                
                Divider()
                
                // Notifications List
                if notificationManager.isLoading {
                    VStack(spacing: 16) {
                        ProgressView()
                            .scaleEffect(1.2)
                        Text("Loading notifications...")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if filteredNotifications.isEmpty {
                    EmptyNotificationsView(filter: selectedFilter)
                } else {
                    List {
                        ForEach(filteredNotifications) { notification in
                            NotificationRowView(notification: notification) {
                                notificationManager.handleNotificationAction(notification)
                            }
                            .onTapGesture {
                                if !notification.isRead {
                                    notificationManager.markAsRead(notification.id)
                                }
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                Button("Delete") {
                                    notificationManager.deleteNotification(notification.id)
                                }
                                .tint(.red)
                                
                                if !notification.isRead {
                                    Button("Mark Read") {
                                        notificationManager.markAsRead(notification.id)
                                    }
                                    .tint(.blue)
                                }
                            }
                        }
                    }
                    .listStyle(PlainListStyle())
                    .refreshable {
                        await notificationManager.refreshNotifications()
                    }
                }
            }
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button("Mark All as Read") {
                            notificationManager.markAllAsRead()
                        }
                        
                        Button("Clear All") {
                            notificationManager.clearAllNotifications()
                        }
                        
                        Divider()
                        
                        Button("Settings") {
                            showingSettings = true
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.title2)
                    }
                }
            }
        }
        .onAppear {
            notificationManager.loadNotifications()
        }
        .sheet(isPresented: $showingSettings) {
            NotificationSettingsView()
        }
    }
}

// MARK: - Supporting Views
struct FilterChip: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                if count > 0 {
                    Text("\(count)")
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(isSelected ? Color.white.opacity(0.3) : Color.primary.opacity(0.1))
                        .cornerRadius(8)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(isSelected ? Color.accentColor : Color(.systemGray6))
            .foregroundColor(isSelected ? .white : .primary)
            .cornerRadius(20)
        }
    }
}

struct NotificationRowView: View {
    let notification: NotificationModel
    let onAction: () -> Void
    
    var body: some View {
        HStack(spacing: 12) {
            // Icon
            Circle()
                .fill(iconColor.opacity(0.1))
                .frame(width: 40, height: 40)
                .overlay(
                    Image(systemName: iconName)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(iconColor)
                )
            
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(notification.title)
                        .font(.headline)
                        .fontWeight(notification.isRead ? .medium : .semibold)
                        .lineLimit(1)
                    
                    Spacer()
                    
                    Text(timeAgoString(from: notification.createdAt))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Text(notification.message)
                    .font(.subheadline)
                    .foregroundColor(notification.isRead ? .secondary : .primary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                
                if notification.actionURL != nil {
                    Button("View Details") {
                        onAction()
                    }
                    .font(.caption)
                    .foregroundColor(.accentColor)
                    .padding(.top, 2)
                }
            }
            
            if !notification.isRead {
                Circle()
                    .fill(Color.accentColor)
                    .frame(width: 8, height: 8)
            }
        }
        .padding(.vertical, 8)
        .background(notification.isRead ? Color.clear : Color.accentColor.opacity(0.05))
    }
    
    private var iconName: String {
        switch notification.type {
        case .jobMatch:
            return "briefcase.fill"
        case .applicationUpdate:
            return "doc.text.fill"
        case .messageReceived:
            return "message.fill"
        case .connectionRequest:
            return "person.2.fill"
        case .eventReminder:
            return "calendar.circle.fill"
        case .jobDeadline:
            return "clock.fill"
        case .interviewScheduled:
            return "video.fill"
        case .systemUpdate:
            return "gear.circle.fill"
        }
    }
    
    private var iconColor: Color {
        switch notification.type {
        case .jobMatch:
            return .green
        case .applicationUpdate:
            return .blue
        case .messageReceived:
            return .purple
        case .connectionRequest:
            return .orange
        case .eventReminder:
            return .red
        case .jobDeadline:
            return .yellow
        case .interviewScheduled:
            return .indigo
        case .systemUpdate:
            return .gray
        }
    }
    
    private func timeAgoString(from date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.dateTimeStyle = .named
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct EmptyNotificationsView: View {
    let filter: NotificationFilter
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: emptyIconName)
                .font(.system(size: 64))
                .foregroundColor(.secondary)
            
            Text(emptyTitle)
                .font(.title2)
                .fontWeight(.semibold)
            
            Text(emptyMessage)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyIconName: String {
        switch filter {
        case .all:
            return "bell.slash"
        case .unread:
            return "bell.badge"
        case .jobMatches:
            return "briefcase"
        case .applications:
            return "doc.text"
        case .messages:
            return "message"
        }
    }
    
    private var emptyTitle: String {
        switch filter {
        case .all:
            return "No Notifications"
        case .unread:
            return "All Caught Up!"
        case .jobMatches:
            return "No Job Matches"
        case .applications:
            return "No Application Updates"
        case .messages:
            return "No Message Notifications"
        }
    }
    
    private var emptyMessage: String {
        switch filter {
        case .all:
            return "You'll see notifications about job matches, application updates, and messages here."
        case .unread:
            return "You've read all your notifications. Great job staying on top of things!"
        case .jobMatches:
            return "We'll notify you when we find jobs that match your profile and preferences."
        case .applications:
            return "You'll see updates about your job applications here."
        case .messages:
            return "Message notifications will appear here when you receive new messages."
        }
    }
}

// MARK: - Notification Filter Enum
enum NotificationFilter: CaseIterable {
    case all, unread, jobMatches, applications, messages
    
    var title: String {
        switch self {
        case .all: return "All"
        case .unread: return "Unread"
        case .jobMatches: return "Jobs"
        case .applications: return "Applications"
        case .messages: return "Messages"
        }
    }
    
    func count(from notifications: [NotificationModel]) -> Int {
        switch self {
        case .all:
            return notifications.count
        case .unread:
            return notifications.filter { !$0.isRead }.count
        case .jobMatches:
            return notifications.filter { $0.type == .jobMatch }.count
        case .applications:
            return notifications.filter { $0.type == .applicationUpdate }.count
        case .messages:
            return notifications.filter { $0.type == .messageReceived }.count
        }
    }
}

// MARK: - Notification Manager
class NotificationManager: ObservableObject {
    @Published var notifications: [NotificationModel] = []
    @Published var isLoading = false
    @Published var unreadCount = 0
    
    private var cancellables = Set<AnyCancellable>()
    private let notificationService = NotificationService()
    
    func loadNotifications() {
        isLoading = true
        
        notificationService.fetchNotifications()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] _ in
                    self?.isLoading = false
                },
                receiveValue: { [weak self] notifications in
                    self?.notifications = notifications.sorted { $0.createdAt > $1.createdAt }
                    self?.updateUnreadCount()
                }
            )
            .store(in: &cancellables)
    }
    
    @MainActor
    func refreshNotifications() async {
        isLoading = true
        
        // Simulate network refresh
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        
        loadNotifications()
    }
    
    func markAsRead(_ notificationId: String) {
        if let index = notifications.firstIndex(where: { $0.id == notificationId }) {
            let updatedNotification = NotificationModel(
                id: notifications[index].id,
                userId: notifications[index].userId,
                type: notifications[index].type,
                title: notifications[index].title,
                message: notifications[index].message,
                data: notifications[index].data,
                isRead: true,
                createdAt: notifications[index].createdAt,
                actionURL: notifications[index].actionURL
            )
            notifications[index] = updatedNotification
            updateUnreadCount()
        }
        
        notificationService.markNotificationAsRead(notificationId)
            .sink(receiveCompletion: { _ in }, receiveValue: { _ in })
            .store(in: &cancellables)
    }
    
    func markAllAsRead() {
        for i in notifications.indices {
            if !notifications[i].isRead {
                let updatedNotification = NotificationModel(
                    id: notifications[i].id,
                    userId: notifications[i].userId,
                    type: notifications[i].type,
                    title: notifications[i].title,
                    message: notifications[i].message,
                    data: notifications[i].data,
                    isRead: true,
                    createdAt: notifications[i].createdAt,
                    actionURL: notifications[i].actionURL
                )
                notifications[i] = updatedNotification
            }
        }
        updateUnreadCount()
    }
    
    func deleteNotification(_ notificationId: String) {
        notifications.removeAll { $0.id == notificationId }
        updateUnreadCount()
    }
    
    func clearAllNotifications() {
        notifications.removeAll()
        updateUnreadCount()
    }
    
    func handleNotificationAction(_ notification: NotificationModel) {
        // Handle notification-specific actions
        guard let actionURL = notification.actionURL else { return }
        
        // In a real app, this would handle deep linking
        print("Handling action for notification: \(actionURL)")
    }
    
    private func updateUnreadCount() {
        unreadCount = notifications.filter { !$0.isRead }.count
    }
}

struct NotificationSettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var pushNotifications = true
    @State private var emailNotifications = true
    @State private var jobMatchNotifications = true
    @State private var applicationUpdates = true
    @State private var messageNotifications = true
    @State private var eventReminders = true
    
    var body: some View {
        NavigationView {
            Form {
                Section("Delivery Methods") {
                    Toggle("Push Notifications", isOn: $pushNotifications)
                    Toggle("Email Notifications", isOn: $emailNotifications)
                }
                
                Section("Notification Types") {
                    Toggle("Job Matches", isOn: $jobMatchNotifications)
                    Toggle("Application Updates", isOn: $applicationUpdates)
                    Toggle("Messages", isOn: $messageNotifications)
                    Toggle("Event Reminders", isOn: $eventReminders)
                }
                
                Section("Quiet Hours") {
                    HStack {
                        Text("Do Not Disturb")
                        Spacer()
                        Text("10:00 PM - 8:00 AM")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Notification Settings")
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
}

#Preview {
    NotificationsView()
}