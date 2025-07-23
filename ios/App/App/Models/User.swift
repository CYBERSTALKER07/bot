import Foundation

enum UserType {
    case student
    case graduate
    case employer
}

struct User {
    let id: String
    let name: String
    let email: String
    let userType: UserType
    let profileImageURL: String?
    let university: String
    let major: String?
    let graduationYear: Int?
    let company: String?
    let position: String?
    let bio: String?
    let skills: [String]
    let interests: [String]
    
    init(id: String, name: String, email: String, userType: UserType, university: String = "AUT", profileImageURL: String? = nil, major: String? = nil, graduationYear: Int? = nil, company: String? = nil, position: String? = nil, bio: String? = nil, skills: [String] = [], interests: [String] = []) {
        self.id = id
        self.name = name
        self.email = email
        self.userType = userType
        self.university = university
        self.profileImageURL = profileImageURL
        self.major = major
        self.graduationYear = graduationYear
        self.company = company
        self.position = position
        self.bio = bio
        self.skills = skills
        self.interests = interests
    }
}