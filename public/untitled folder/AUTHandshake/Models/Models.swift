import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let firstName: String
    let lastName: String
    let studentId: String?
    let university: String
    let major: String?
    let graduationYear: Int?
    let profileImageURL: String?
    let bio: String?
    let skills: [String]
    let gpa: Double?
    let isEmployer: Bool
    let companyName: String?
    let position: String?
    let createdAt: Date
    let updatedAt: Date
    
    var fullName: String {
        "\(firstName) \(lastName)"
    }
}

struct Job: Codable, Identifiable {
    let id: String
    let title: String
    let company: String
    let description: String
    let requirements: [String]
    let location: String
    let salary: String?
    let type: JobType
    let category: JobCategory
    let postedDate: Date
    let deadline: Date?
    let employerId: String
    let isActive: Bool
    let benefits: [String]?
    let experienceLevel: ExperienceLevel
}

enum JobType: String, CaseIterable, Codable {
    case fullTime = "Full-time"
    case partTime = "Part-time"
    case internship = "Internship"
    case contract = "Contract"
    case coop = "Co-op"
}

enum JobCategory: String, CaseIterable, Codable {
    case engineering = "Engineering"
    case business = "Business"
    case marketing = "Marketing"
    case design = "Design"
    case finance = "Finance"
    case healthcare = "Healthcare"
    case education = "Education"
    case other = "Other"
}

enum ExperienceLevel: String, CaseIterable, Codable {
    case entry = "Entry Level"
    case junior = "Junior"
    case mid = "Mid Level"
    case senior = "Senior"
    case executive = "Executive"
}

struct Application: Codable, Identifiable {
    let id: String
    let jobId: String
    let userId: String
    let coverLetter: String?
    let resumeURL: String?
    let status: ApplicationStatus
    let appliedDate: Date
    let lastUpdated: Date
    let feedback: String?
}

enum ApplicationStatus: String, CaseIterable, Codable {
    case submitted = "Submitted"
    case reviewed = "Under Review"
    case interview = "Interview Scheduled"
    case rejected = "Rejected"
    case accepted = "Accepted"
    case withdrawn = "Withdrawn"
    
    var displayName: String {
        return self.rawValue
    }
}

struct Event: Codable, Identifiable {
    let id: String
    let title: String
    let description: String
    let date: Date
    let endDate: Date?
    let location: String
    let organizer: String
    let category: EventCategory
    let imageURL: String?
    let registrationRequired: Bool
    let maxAttendees: Int?
    let currentAttendees: Int
    let isVirtual: Bool
    let meetingLink: String?
}

enum EventCategory: String, CaseIterable, Codable {
    case networking = "Networking"
    case workshop = "Workshop"
    case seminar = "Seminar"
    case careerFair = "Career Fair"
    case interview = "Interview"
    case social = "Social"
}

// MARK: - Message Models
struct Conversation: Codable, Identifiable {
    let id: String
    let participantIds: [String]
    let title: String?
    let lastMessage: Message?
    let lastActivity: Date
    let isGroup: Bool
    let unreadCount: Int
    let createdAt: Date
    
    var participants: [User] {
        // This would be populated from the participant IDs
        []
    }
}

struct Message: Codable, Identifiable {
    let id: String
    let conversationId: String
    let senderId: String
    let content: String
    let type: MessageType
    let timestamp: Date
    let isRead: Bool
    let attachments: [MessageAttachment]?
    let replyToMessageId: String?
    
    var sender: User? {
        // This would be populated from the sender ID
        nil
    }
}

enum MessageType: String, CaseIterable, Codable {
    case text = "text"
    case image = "image"
    case document = "document"
    case jobShare = "job_share"
    case eventShare = "event_share"
    case applicationUpdate = "application_update"
    case interviewSchedule = "interview_schedule"
}

struct MessageAttachment: Codable, Identifiable {
    let id: String
    let type: AttachmentType
    let url: String
    let fileName: String
    let fileSize: Int?
    let mimeType: String?
}

enum AttachmentType: String, CaseIterable, Codable {
    case image = "image"
    case document = "document"
    case pdf = "pdf"
    case resume = "resume"
}

// MARK: - Network Models
struct NetworkConnection: Codable, Identifiable {
    let id: String
    let userId: String
    let connectedUserId: String
    let status: ConnectionStatus
    let requestMessage: String?
    let connectedAt: Date
    let mutualConnections: Int
    
    var connectedUser: User? {
        // This would be populated from the connected user ID
        nil
    }
}

enum ConnectionStatus: String, CaseIterable, Codable {
    case pending = "pending"
    case accepted = "accepted"
    case declined = "declined"
    case blocked = "blocked"
}

// MARK: - Notification Models
struct NotificationModel: Codable, Identifiable {
    let id: String
    let userId: String
    let type: NotificationType
    let title: String
    let message: String
    let data: [String: String]?
    let isRead: Bool
    let createdAt: Date
    let actionURL: String?
}

enum NotificationType: String, CaseIterable, Codable {
    case jobMatch = "job_match"
    case applicationUpdate = "application_update"
    case messageReceived = "message_received"
    case connectionRequest = "connection_request"
    case eventReminder = "event_reminder"
    case jobDeadline = "job_deadline"
    case interviewScheduled = "interview_scheduled"
    case systemUpdate = "system_update"
}