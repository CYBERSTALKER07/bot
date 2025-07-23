import SwiftUI

struct SignUpView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @Environment(\.dismiss) var dismiss
    
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var studentId = ""
    @State private var major = ""
    @State private var graduationYear = ""
    @State private var isEmployer = false
    @State private var companyName = ""
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Create Account")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding(.top)
                    
                    VStack(spacing: 16) {
                        HStack(spacing: 12) {
                            TextField("First Name", text: $firstName)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                            
                            TextField("Last Name", text: $lastName)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                        
                        TextField("Email", text: $email)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                        
                        SecureField("Password", text: $password)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                        
                        SecureField("Confirm Password", text: $confirmPassword)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                        
                        Toggle("I am an employer", isOn: $isEmployer)
                            .padding(.horizontal)
                        
                        if isEmployer {
                            TextField("Company Name", text: $companyName)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        } else {
                            TextField("Student ID", text: $studentId)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                            
                            TextField("Major", text: $major)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                            
                            TextField("Graduation Year", text: $graduationYear)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .keyboardType(.numberPad)
                        }
                    }
                    
                    if let errorMessage = authManager.errorMessage {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                    
                    Button(action: createAccount) {
                        HStack {
                            if authManager.isLoading {
                                ProgressView()
                                    .scaleEffect(0.8)
                            }
                            Text("Create Account")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                    }
                    .disabled(authManager.isLoading || !isFormValid)
                }
                .padding(.horizontal, 40)
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private var isFormValid: Bool {
        !email.isEmpty && !password.isEmpty && password == confirmPassword &&
        !firstName.isEmpty && !lastName.isEmpty &&
        (isEmployer ? !companyName.isEmpty : !studentId.isEmpty)
    }
    
    private func createAccount() {
        let user = User(
            id: UUID().uuidString,
            email: email,
            firstName: firstName,
            lastName: lastName,
            studentId: isEmployer ? nil : studentId,
            university: "Auckland University of Technology",
            major: isEmployer ? nil : major,
            graduationYear: isEmployer ? nil : Int(graduationYear),
            profileImageURL: nil,
            bio: nil,
            skills: [],
            gpa: nil,
            isEmployer: isEmployer,
            companyName: isEmployer ? companyName : nil,
            position: nil,
            createdAt: Date(),
            updatedAt: Date()
        )
        
        authManager.signUp(user: user, password: password)
    }
}