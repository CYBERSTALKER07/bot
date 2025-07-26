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
                VStack(spacing: AUTDesignSystem.Spacing.xl) {
                    VStack(spacing: AUTDesignSystem.Spacing.md) {
                        Text("Create Account")
                            .font(AUTDesignSystem.Typography.pageTitle)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                        
                        Text("Join the AUT community")
                            .font(AUTDesignSystem.Typography.subtitle)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.muted)
                    }
                    .padding(.top, AUTDesignSystem.Spacing.lg)
                    
                    VStack(spacing: AUTDesignSystem.Spacing.lg) {
                        HStack(spacing: AUTDesignSystem.Spacing.md) {
                            AUTTextField(
                                text: $firstName,
                                placeholder: "First Name"
                            )
                            
                            AUTTextField(
                                text: $lastName,
                                placeholder: "Last Name"
                            )
                        }
                        
                        AUTTextField(
                            text: $email,
                            placeholder: "Email",
                            keyboardType: .emailAddress,
                            autocapitalization: .never
                        )
                        
                        AUTTextField(
                            text: $password,
                            placeholder: "Password",
                            isSecure: true
                        )
                        
                        AUTTextField(
                            text: $confirmPassword,
                            placeholder: "Confirm Password",
                            isSecure: true
                        )
                        
                        // Account Type Toggle
                        AUTCard {
                            VStack(spacing: AUTDesignSystem.Spacing.md) {
                                HStack {
                                    Text("Account Type")
                                        .font(AUTDesignSystem.Typography.cardTitle)
                                        .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                                    Spacer()
                                }
                                
                                HStack(spacing: AUTDesignSystem.Spacing.lg) {
                                    Button(action: { isEmployer = false }) {
                                        HStack(spacing: AUTDesignSystem.Spacing.sm) {
                                            Image(systemName: isEmployer ? "circle" : "checkmark.circle.fill")
                                                .foregroundColor(isEmployer ? AUTDesignSystem.Colors.Neutral.muted : AUTDesignSystem.Colors.Primary.primary)
                                            Text("Student")
                                                .font(AUTDesignSystem.Typography.body)
                                                .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                                        }
                                    }
                                    
                                    Spacer()
                                    
                                    Button(action: { isEmployer = true }) {
                                        HStack(spacing: AUTDesignSystem.Spacing.sm) {
                                            Image(systemName: isEmployer ? "checkmark.circle.fill" : "circle")
                                                .foregroundColor(isEmployer ? AUTDesignSystem.Colors.Primary.primary : AUTDesignSystem.Colors.Neutral.muted)
                                            Text("Employer")
                                                .font(AUTDesignSystem.Typography.body)
                                                .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                                        }
                                    }
                                }
                            }
                            .padding(AUTDesignSystem.Spacing.lg)
                        }
                        
                        if isEmployer {
                            AUTTextField(
                                text: $companyName,
                                placeholder: "Company Name"
                            )
                        } else {
                            VStack(spacing: AUTDesignSystem.Spacing.md) {
                                AUTTextField(
                                    text: $studentId,
                                    placeholder: "Student ID"
                                )
                                
                                AUTTextField(
                                    text: $major,
                                    placeholder: "Major"
                                )
                                
                                AUTTextField(
                                    text: $graduationYear,
                                    placeholder: "Graduation Year",
                                    keyboardType: .numberPad
                                )
                            }
                        }
                    }
                    
                    if let errorMessage = authManager.errorMessage {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(AUTDesignSystem.Colors.System.error)
                            Text(errorMessage)
                                .font(AUTDesignSystem.Typography.caption)
                                .foregroundColor(AUTDesignSystem.Colors.System.error)
                            Spacer()
                        }
                        .padding(.horizontal, AUTDesignSystem.Spacing.sm)
                    }
                    
                    AUTPrimaryButton(
                        title: "Create Account",
                        isLoading: authManager.isLoading,
                        isDisabled: !isFormValid
                    ) {
                        createAccount()
                    }
                }
                .padding(.horizontal, AUTDesignSystem.Spacing.xl)
                .padding(.bottom, AUTDesignSystem.Spacing.xl)
            }
            .background(AUTDesignSystem.Colors.Neutral.background)
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
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