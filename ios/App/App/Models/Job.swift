import Foundation

struct Job {
    let id: String
    let title: String
    let company: String
    let location: String
    let type: JobType
    let description: String
    let requirements: [String]
    let salary: String?
    let postedDate: Date
    let applicationDeadline: Date?
    let contactEmail: String
    let isRemote: Bool
    let experienceLevel: ExperienceLevel
    let benefits: [String]
    
    enum JobType: String, CaseIterable {
        case fullTime = "Full-time"
        case partTime = "Part-time"
        case internship = "Internship"
        case contract = "Contract"
        case graduate = "Graduate Program"
    }
    
    enum ExperienceLevel: String, CaseIterable {
        case entry = "Entry Level"
        case junior = "Junior (1-3 years)"
        case mid = "Mid Level (3-5 years)"
        case senior = "Senior (5+ years)"
        case executive = "Executive"
    }
}