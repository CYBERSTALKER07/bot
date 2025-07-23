import Foundation
import Combine

// MARK: - Notification Service
class NotificationService {
    
    /// Fetches notifications for the current user
    /// - Returns: Publisher that emits an array of notifications
    func fetchNotifications() -> AnyPublisher<[NotificationModel], Error> {
        return Future<[NotificationModel], Error> { promise in
            // Simulate API call delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                let mockNotifications = self.generateMockNotifications()
                promise(.success(mockNotifications))
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Marks a specific notification as read
    /// - Parameter notificationId: The ID of the notification to mark as read
    /// - Returns: Publisher that emits success or failure
    func markNotificationAsRead(_ notificationId: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            // Simulate API call
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Marks all notifications as read for the current user
    /// - Returns: Publisher that emits success or failure
    func markAllNotificationsAsRead() -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            // Simulate API call
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Deletes a specific notification
    /// - Parameter notificationId: The ID of the notification to delete
    /// - Returns: Publisher that emits success or failure
    func deleteNotification(_ notificationId: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            // Simulate API call
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Registers the device for push notifications
    /// - Parameter deviceToken: The device token for push notifications
    /// - Returns: Publisher that emits success or failure
    func registerForPushNotifications(deviceToken: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            // Simulate API call
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    // MARK: - Private Methods
    
    /// Generates mock notifications for development and testing
    /// - Returns: Array of mock notification models
    private func generateMockNotifications() -> [NotificationModel] {
        let calendar = Calendar.current
        let now = Date()
        
        return [
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .jobMatch,
                title: "New Job Match Found!",
                message: "iOS Developer position at TechCorp matches your profile perfectly. Apply now!",
                data: ["jobId": "job_123", "companyName": "TechCorp"],
                isRead: false,
                createdAt: calendar.date(byAdding: .hour, value: -2, to: now) ?? now,
                actionURL: "/jobs/job_123"
            ),
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .applicationUpdate,
                title: "Application Status Update",
                message: "Your application for Software Engineer at InnovateLab has been reviewed and moved to the interview stage.",
                data: ["applicationId": "app_456", "status": "interview"],
                isRead: false,
                createdAt: calendar.date(byAdding: .hour, value: -4, to: now) ?? now,
                actionURL: "/applications/app_456"
            ),
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .messageReceived,
                title: "New Message from Sarah Wilson",
                message: "Thanks for connecting! I'd love to discuss the internship opportunity at our company.",
                data: ["senderId": "user_sarah", "conversationId": "conv_789"],
                isRead: false,
                createdAt: calendar.date(byAdding: .hour, value: -6, to: now) ?? now,
                actionURL: "/messages/conv_789"
            ),
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .connectionRequest,
                title: "New Connection Request",
                message: "John Smith wants to connect with you. He's a Product Manager at StartupXYZ.",
                data: ["requesterId": "user_john", "company": "StartupXYZ"],
                isRead: true,
                createdAt: calendar.date(byAdding: .day, value: -1, to: now) ?? now,
                actionURL: "/network/requests"
            ),
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .eventReminder,
                title: "Event Reminder: Tech Career Fair",
                message: "The AUT Tech Career Fair starts tomorrow at 10:00 AM. Don't forget to bring your resume!",
                data: ["eventId": "event_fair2025", "startTime": "2025-07-25T10:00:00Z"],
                isRead: false,
                createdAt: calendar.date(byAdding: .hour, value: -12, to: now) ?? now,
                actionURL: "/events/event_fair2025"
            ),
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .jobDeadline,
                title: "Application Deadline Approaching",
                message: "The application deadline for Frontend Developer at WebCorp is in 2 days. Apply before it's too late!",
                data: ["jobId": "job_frontend", "deadline": "2025-07-26T23:59:59Z"],
                isRead: true,
                createdAt: calendar.date(byAdding: .day, value: -2, to: now) ?? now,
                actionURL: "/jobs/job_frontend"
            ),
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .interviewScheduled,
                title: "Interview Scheduled",
                message: "Your interview with TechCorp for the iOS Developer position is scheduled for July 26th at 2:00 PM.",
                data: ["interviewId": "interview_123", "datetime": "2025-07-26T14:00:00Z", "type": "video"],
                isRead: true,
                createdAt: calendar.date(byAdding: .day, value: -3, to: now) ?? now,
                actionURL: "/interviews/interview_123"
            ),
            NotificationModel(
                id: UUID().uuidString,
                userId: "current_user",
                type: .systemUpdate,
                title: "AUT Handshake Update",
                message: "We've added new features to help you track your application progress. Check out the updated Applications tab!",
                data: ["version": "1.2.0", "feature": "application_tracking"],
                isRead: true,
                createdAt: calendar.date(byAdding: .day, value: -5, to: now) ?? now,
                actionURL: "/applications"
            )
        ]
    }
}

// MARK: - Event Service
class EventService {
    
    /// Fetches upcoming events
    /// - Returns: Publisher that emits an array of events
    func fetchEvents() -> AnyPublisher<[Event], Error> {
        return Future<[Event], Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) {
                let mockEvents = self.generateMockEvents()
                promise(.success(mockEvents))
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Registers user for an event
    /// - Parameter eventId: The ID of the event to register for
    /// - Returns: Publisher that emits success or failure
    func registerForEvent(_ eventId: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Unregisters user from an event
    /// - Parameter eventId: The ID of the event to unregister from
    /// - Returns: Publisher that emits success or failure
    func unregisterFromEvent(_ eventId: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    // MARK: - Private Methods
    
    private func generateMockEvents() -> [Event] {
        let calendar = Calendar.current
        let now = Date()
        
        return [
            Event(
                id: "event_career_fair",
                title: "AUT Tech Career Fair 2025",
                description: "Connect with leading technology companies and explore exciting career opportunities. Meet recruiters from top tech firms, participate in workshops, and discover your next career move.",
                date: calendar.date(byAdding: .day, value: 7, to: now) ?? now,
                endDate: calendar.date(byAdding: .hour, value: 8, to: calendar.date(byAdding: .day, value: 7, to: now) ?? now),
                location: "AUT City Campus - WG Building, Level 3",
                organizer: "AUT Career Services",
                category: .careerFair,
                imageURL: nil,
                registrationRequired: true,
                maxAttendees: 500,
                currentAttendees: 287,
                isVirtual: false,
                meetingLink: nil
            ),
            Event(
                id: "event_resume_workshop",
                title: "Resume Writing Workshop",
                description: "Learn how to craft a compelling resume that stands out to employers. Get personalized feedback from industry professionals and career counselors.",
                date: calendar.date(byAdding: .day, value: 3, to: now) ?? now,
                endDate: calendar.date(byAdding: .hour, value: 2, to: calendar.date(byAdding: .day, value: 3, to: now) ?? now),
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
                id: "event_networking",
                title: "Young Professionals Networking Night",
                description: "An evening of networking with recent graduates and young professionals across various industries. Light refreshments provided.",
                date: calendar.date(byAdding: .day, value: 14, to: now) ?? now,
                endDate: calendar.date(byAdding: .hour, value: 3, to: calendar.date(byAdding: .day, value: 14, to: now) ?? now),
                location: "AUT Business School - Atrium",
                organizer: "Alumni Network",
                category: .networking,
                imageURL: nil,
                registrationRequired: true,
                maxAttendees: 100,
                currentAttendees: 67,
                isVirtual: false,
                meetingLink: nil
            )
        ]
    }
}

// MARK: - Auth Service
class AuthService {
    
    /// Authenticates user with email and password
    /// - Parameters:
    ///   - email: User's email address
    ///   - password: User's password
    /// - Returns: Publisher that emits authenticated user or error
    func signIn(email: String, password: String) -> AnyPublisher<User, Error> {
        return Future<User, Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                // Simulate authentication
                if email.contains("@") && password.count >= 6 {
                    let user = self.createMockUser(email: email)
                    promise(.success(user))
                } else {
                    promise(.failure(AuthError.invalidCredentials))
                }
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Creates a new user account
    /// - Parameters:
    ///   - user: User object with registration information
    ///   - password: User's chosen password
    /// - Returns: Publisher that emits created user or error
    func signUp(user: User, password: String) -> AnyPublisher<User, Error> {
        return Future<User, Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                // Simulate account creation
                if password.count >= 6 {
                    promise(.success(user))
                } else {
                    promise(.failure(AuthError.weakPassword))
                }
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Signs out the current user
    /// - Returns: Publisher that emits success or error
    func signOut() -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    /// Resets user's password
    /// - Parameter email: User's email address
    /// - Returns: Publisher that emits success or error
    func resetPassword(email: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                promise(.success(true))
            }
        }
        .eraseToAnyPublisher()
    }
    
    // MARK: - Private Methods
    
    private func createMockUser(email: String) -> User {
        let isEmployer = email.contains("@company") || email.contains("@corp")
        
        return User(
            id: UUID().uuidString,
            email: email,
            firstName: "John",
            lastName: "Doe",
            studentId: isEmployer ? nil : "19123456",
            university: "Auckland University of Technology",
            major: isEmployer ? nil : "Computer Science",
            graduationYear: isEmployer ? nil : 2025,
            profileImageURL: nil,
            bio: isEmployer ? "Senior recruiter with 5+ years of experience in tech hiring." : "Computer Science student passionate about iOS development and user experience design.",
            skills: isEmployer ? ["Recruiting", "Talent Acquisition"] : ["Swift", "SwiftUI", "iOS Development", "Python"],
            gpa: isEmployer ? nil : 3.7,
            isEmployer: isEmployer,
            companyName: isEmployer ? "TechCorp Limited" : nil,
            position: isEmployer ? "Senior Technical Recruiter" : nil,
            createdAt: Date(),
            updatedAt: Date()
        )
    }
}

// MARK: - Auth Errors
enum AuthError: LocalizedError {
    case invalidCredentials
    case weakPassword
    case userNotFound
    case networkError
    
    var errorDescription: String? {
        switch self {
        case .invalidCredentials:
            return "Invalid email or password. Please check your credentials and try again."
        case .weakPassword:
            return "Password must be at least 6 characters long."
        case .userNotFound:
            return "No account found with this email address."
        case .networkError:
            return "Network connection error. Please check your internet connection."
        }
    }
}