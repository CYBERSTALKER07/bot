import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var showingEditProfile = false
    @State private var showingSettings = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Profile Header
                    VStack(spacing: 16) {
                        // Profile Image
                        Circle()
                            .fill(Color.blue.opacity(0.2))
                            .frame(width: 120, height: 120)
                            .overlay(
                                Text(initials)
                                    .font(.system(size: 40, weight: .semibold))
                                    .foregroundColor(.blue)
                            )
                        
                        VStack(spacing: 8) {
                            Text(authManager.currentUser?.fullName ?? "User Name")
                                .font(.title2)
                                .fontWeight(.bold)
                            
                            if let user = authManager.currentUser {
                                if user.isEmployer {
                                    Text("\(user.position ?? "Employee") at \(user.companyName ?? "Company")")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                } else {
                                    Text("\(user.major ?? "Student") • Class of \(user.graduationYear ?? 2025)")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                    
                                    Text(user.university)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        
                        Button("Edit Profile") {
                            showingEditProfile = true
                        }
                        .font(.headline)
                        .foregroundColor(.blue)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 8)
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(20)
                    }
                    
                    // Bio Section
                    if let bio = authManager.currentUser?.bio, !bio.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("About")
                                .font(.headline)
                            Text(bio)
                                .font(.body)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal)
                    }
                    
                    // Skills Section
                    if let skills = authManager.currentUser?.skills, !skills.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Skills")
                                .font(.headline)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            
                            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                                ForEach(skills, id: \.self) { skill in
                                    Text(skill)
                                        .font(.caption)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Color.blue.opacity(0.1))
                                        .foregroundColor(.blue)
                                        .cornerRadius(16)
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Academic Info (for students)
                    if let user = authManager.currentUser, !user.isEmployer {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Academic Information")
                                .font(.headline)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            
                            VStack(spacing: 8) {
                                if let studentId = user.studentId {
                                    ProfileInfoRow(title: "Student ID", value: studentId)
                                }
                                
                                if let gpa = user.gpa {
                                    ProfileInfoRow(title: "GPA", value: String(format: "%.1f", gpa))
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Quick Actions
                    VStack(spacing: 16) {
                        Text("Quick Actions")
                            .font(.headline)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        
                        VStack(spacing: 12) {
                            ProfileActionRow(
                                icon: "doc.text",
                                title: "My Applications",
                                subtitle: "View your job applications"
                            )
                            
                            ProfileActionRow(
                                icon: "person.2",
                                title: "My Network",
                                subtitle: "Manage your connections"
                            )
                            
                            ProfileActionRow(
                                icon: "calendar",
                                title: "My Events",
                                subtitle: "View registered events"
                            )
                            
                            Button(action: { showingSettings = true }) {
                                ProfileActionRow(
                                    icon: "gear",
                                    title: "Settings",
                                    subtitle: "App preferences and privacy"
                                )
                            }
                            .foregroundColor(.primary)
                        }
                    }
                    .padding(.horizontal)
                    
                    // Sign Out Button
                    Button("Sign Out") {
                        authManager.signOut()
                    }
                    .font(.headline)
                    .foregroundColor(.red)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(12)
                    .padding(.top, 20)
                }
                .padding(.vertical)
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
        }
        .sheet(isPresented: $showingEditProfile) {
            EditProfileView()
        }
        .sheet(isPresented: $showingSettings) {
            SettingsView()
        }
    }
    
    private var initials: String {
        guard let user = authManager.currentUser else { return "U" }
        return String(user.firstName.prefix(1)) + String(user.lastName.prefix(1))
    }
}

struct ProfileInfoRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .font(.subheadline)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
        }
        .padding(.vertical, 4)
    }
}

struct ProfileActionRow: View {
    let icon: String
    let title: String
    let subtitle: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(.blue)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.headline)
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct EditProfileView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @Environment(\.dismiss) var dismiss
    
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var bio = ""
    @State private var skills: [String] = []
    @State private var newSkill = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section("Basic Information") {
                    TextField("First Name", text: $firstName)
                    TextField("Last Name", text: $lastName)
                }
                
                Section("About") {
                    TextEditor(text: $bio)
                        .frame(minHeight: 100)
                }
                
                Section("Skills") {
                    ForEach(skills, id: \.self) { skill in
                        HStack {
                            Text(skill)
                            Spacer()
                            Button("Remove") {
                                skills.removeAll { $0 == skill }
                            }
                            .foregroundColor(.red)
                        }
                    }
                    
                    HStack {
                        TextField("Add skill", text: $newSkill)
                        Button("Add") {
                            if !newSkill.isEmpty {
                                skills.append(newSkill)
                                newSkill = ""
                            }
                        }
                    }
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        // Save profile changes
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            loadCurrentProfile()
        }
    }
    
    private func loadCurrentProfile() {
        if let user = authManager.currentUser {
            firstName = user.firstName
            lastName = user.lastName
            bio = user.bio ?? ""
            skills = user.skills
        }
    }
}

struct SettingsView: View {
    @Environment(\.dismiss) var dismiss
    @State private var notificationsEnabled = true
    @State private var emailNotifications = true
    @State private var pushNotifications = true
    
    var body: some View {
        NavigationView {
            List {
                Section("Notifications") {
                    Toggle("Enable Notifications", isOn: $notificationsEnabled)
                    
                    if notificationsEnabled {
                        Toggle("Email Notifications", isOn: $emailNotifications)
                        Toggle("Push Notifications", isOn: $pushNotifications)
                    }
                }
                
                Section("Privacy") {
                    NavigationLink("Privacy Policy") {
                        // Privacy policy view
                        Text("Privacy Policy Content")
                    }
                    
                    NavigationLink("Terms of Service") {
                        // Terms of service view
                        Text("Terms of Service Content")
                    }
                }
                
                Section("Support") {
                    NavigationLink("Help Center") {
                        // Help center view
                        Text("Help Center Content")
                    }
                    
                    NavigationLink("Contact Us") {
                        // Contact view
                        Text("Contact Information")
                    }
                }
                
                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true)
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