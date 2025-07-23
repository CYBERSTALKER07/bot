import Foundation

struct Event {
    let id: String
    let title: String
    let description: String
    let organizer: String
    let location: String
    let startDate: Date
    let endDate: Date
    let imageURL: String?
    let registrationURL: String?
    let capacity: Int?
    let currentAttendees: Int
    let tags: [String]
    let eventType: EventType
    let isVirtual: Bool
    
    enum EventType: String, CaseIterable {
        case workshop = "Workshop"
        case seminar = "Seminar"
        case networking = "Networking"
        case careerFair = "Career Fair"
        case webinar = "Webinar"
        case conference = "Conference"
        case graduation = "Graduation"
    }
    
    var isUpcoming: Bool {
        return startDate > Date()
    }
    
    var formattedDateRange: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        
        if Calendar.current.isDate(startDate, inSameDayAs: endDate) {
            return formatter.string(from: startDate)
        } else {
            return "\(formatter.string(from: startDate)) - \(formatter.string(from: endDate))"
        }
    }
}