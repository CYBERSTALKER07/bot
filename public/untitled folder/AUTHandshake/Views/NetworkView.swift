import SwiftUI

struct NetworkView: View {
    @State private var searchText = ""
    @State private var connections: [User] = []
    @State private var suggestedConnections: [User] = []
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            VStack {
                // Search Bar
                SearchBar(text: $searchText)
                
                if isLoading {
                    ProgressView("Loading network...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List {
                        if !connections.isEmpty {
                            Section("Your Connections") {
                                ForEach(connections) { user in
                                    UserRowView(user: user, showConnectButton: false)
                                }
                            }
                        }
                        
                        if !suggestedConnections.isEmpty {
                            Section("Suggested Connections") {
                                ForEach(suggestedConnections) { user in
                                    UserRowView(user: user, showConnectButton: true) {
                                        connectToUser(user)
                                    }
                                }
                            }
                        }
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Network")
            .onAppear {
                loadNetworkData()
            }
        }
    }
    
    private func loadNetworkData() {
        isLoading = true
        
        // Mock data - replace with actual API calls
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.connections = [
                User(
                    id: UUID().uuidString,
                    email: "jane.smith@aut.ac.nz",
                    firstName: "Jane",
                    lastName: "Smith",
                    studentId: "54321",
                    university: "Auckland University of Technology",
                    major: "Business Administration",
                    graduationYear: 2024,
                    profileImageURL: nil,
                    bio: "Business student interested in marketing",
                    skills: ["Marketing", "Analytics", "Communication"],
                    gpa: 3.9,
                    isEmployer: false,
                    companyName: nil,
                    position: nil,
                    createdAt: Date(),
                    updatedAt: Date()
                )
            ]
            
            self.suggestedConnections = [
                User(
                    id: UUID().uuidString,
                    email: "mike.wilson@techcorp.com",
                    firstName: "Mike",
                    lastName: "Wilson",
                    studentId: nil,
                    university: "Auckland University of Technology",
                    major: nil,
                    graduationYear: nil,
                    profileImageURL: nil,
                    bio: "Senior Developer at TechCorp",
                    skills: ["iOS", "Swift", "Leadership"],
                    gpa: nil,
                    isEmployer: true,
                    companyName: "TechCorp",
                    position: "Senior iOS Developer",
                    createdAt: Date(),
                    updatedAt: Date()
                )
            ]
            
            self.isLoading = false
        }
    }
    
    private func connectToUser(_ user: User) {
        // Add connection logic here
        connections.append(user)
        suggestedConnections.removeAll { $0.id == user.id }
    }
}

struct UserRowView: View {
    let user: User
    let showConnectButton: Bool
    var onConnect: (() -> Void)? = nil
    
    var body: some View {
        HStack(spacing: 12) {
            // Profile Image Placeholder
            Circle()
                .fill(Color.blue.opacity(0.2))
                .frame(width: 50, height: 50)
                .overlay(
                    Text(user.firstName.prefix(1) + user.lastName.prefix(1))
                        .font(.headline)
                        .foregroundColor(.blue)
                )
            
            VStack(alignment: .leading, spacing: 4) {
                Text(user.fullName)
                    .font(.headline)
                
                if user.isEmployer {
                    Text("\(user.position ?? "Employee") at \(user.companyName ?? "Company")")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                } else {
                    Text("\(user.major ?? "Student") • Class of \(user.graduationYear ?? 2025)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                if let bio = user.bio {
                    Text(bio)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }
            }
            
            Spacer()
            
            if showConnectButton {
                Button("Connect") {
                    onConnect?()
                }
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(16)
            }
        }
        .padding(.vertical, 4)
    }
}