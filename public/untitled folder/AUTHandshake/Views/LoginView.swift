import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var email = ""
    @State private var password = ""
    @State private var showingSignUp = false
    @State private var isEmailFocused = false
    @State private var isPasswordFocused = false
    
    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                VStack(spacing: 0) {
                    // Hero Section with Gradient Background
                    VStack(spacing: AUTDesignSystem.Spacing.xl) {
                        Spacer()
                        
                        // App Logo with Animation
                        VStack(spacing: AUTDesignSystem.Spacing.lg) {
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [
                                                AUTDesignSystem.Colors.Primary.primary,
                                                AUTDesignSystem.Colors.Primary.primaryLight
                                            ],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 120, height: 120)
                                    .shadow(
                                        color: AUTDesignSystem.Colors.Primary.primary.opacity(0.3),
                                        radius: 20,
                                        x: 0,
                                        y: 10
                                    )
                                
                                Image(systemName: "handshake.fill")
                                    .font(.system(size: 50, weight: .medium))
                                    .foregroundColor(.white)
                            }
                            
                            VStack(spacing: AUTDesignSystem.Spacing.sm) {
                                Text("AUT Handshake")
                                    .font(AUTDesignSystem.Typography.displaySmall)
                                    .fontWeight(.bold)
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [
                                                AUTDesignSystem.Colors.Primary.primary,
                                                AUTDesignSystem.Colors.Primary.primaryLight
                                            ],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                
                                Text("Connect • Apply • Succeed")
                                    .font(AUTDesignSystem.Typography.titleMedium)
                                    .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                                    .tracking(0.5)
                            }
                        }
                        
                        Spacer()
                    }
                    .frame(height: geometry.size.height * 0.45)
                    .frame(maxWidth: .infinity)
                    .background(
                        LinearGradient(
                            colors: [
                                AUTDesignSystem.Colors.Primary.primary50,
                                AUTDesignSystem.Colors.Neutral.background
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    
                    // Login Form Section
                    AUTMaterialCard(elevation: 3) {
                        VStack(spacing: AUTDesignSystem.Spacing.xl) {
                            VStack(spacing: AUTDesignSystem.Spacing.sm) {
                                Text("Welcome Back")
                                    .font(AUTDesignSystem.Typography.headlineSmall)
                                    .fontWeight(.semibold)
                                    .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                                
                                Text("Sign in to your account")
                                    .font(AUTDesignSystem.Typography.bodyMedium)
                                    .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                            }
                            .padding(.top, AUTDesignSystem.Spacing.md)
                            
                            VStack(spacing: AUTDesignSystem.Spacing.lg) {
                                // Email Field
                                VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
                                    Text("Email")
                                        .font(AUTDesignSystem.Typography.labelMedium)
                                        .foregroundColor(AUTDesignSystem.Colors.Neutral.gray700)
                                        .padding(.leading, AUTDesignSystem.Spacing.xs)
                                    
                                    HStack(spacing: AUTDesignSystem.Spacing.md) {
                                        Image(systemName: "envelope")
                                            .font(.system(size: 18))
                                            .foregroundColor(isEmailFocused ? AUTDesignSystem.Colors.Primary.primary : AUTDesignSystem.Colors.Neutral.gray400)
                                            .frame(width: 20)
                                        
                                        TextField("Enter your email", text: $email)
                                            .font(AUTDesignSystem.Typography.bodyLarge)
                                            .keyboardType(.emailAddress)
                                            .textInputAutocapitalization(.never)
                                            .onFocusChange { focused in
                                                withAnimation(.easeInOut(duration: 0.2)) {
                                                    isEmailFocused = focused
                                                }
                                            }
                                    }
                                    .padding(.horizontal, AUTDesignSystem.Spacing.md)
                                    .padding(.vertical, AUTDesignSystem.Spacing.lg)
                                    .background(AUTDesignSystem.Colors.Neutral.surfaceVariant)
                                    .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.lg)
                                            .stroke(
                                                isEmailFocused ? AUTDesignSystem.Colors.Primary.primary : Color.clear,
                                                lineWidth: 2
                                            )
                                    )
                                }
                                
                                // Password Field
                                VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
                                    Text("Password")
                                        .font(AUTDesignSystem.Typography.labelMedium)
                                        .foregroundColor(AUTDesignSystem.Colors.Neutral.gray700)
                                        .padding(.leading, AUTDesignSystem.Spacing.xs)
                                    
                                    HStack(spacing: AUTDesignSystem.Spacing.md) {
                                        Image(systemName: "lock")
                                            .font(.system(size: 18))
                                            .foregroundColor(isPasswordFocused ? AUTDesignSystem.Colors.Primary.primary : AUTDesignSystem.Colors.Neutral.gray400)
                                            .frame(width: 20)
                                        
                                        SecureField("Enter your password", text: $password)
                                            .font(AUTDesignSystem.Typography.bodyLarge)
                                            .onFocusChange { focused in
                                                withAnimation(.easeInOut(duration: 0.2)) {
                                                    isPasswordFocused = focused
                                                }
                                            }
                                    }
                                    .padding(.horizontal, AUTDesignSystem.Spacing.md)
                                    .padding(.vertical, AUTDesignSystem.Spacing.lg)
                                    .background(AUTDesignSystem.Colors.Neutral.surfaceVariant)
                                    .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.lg)
                                            .stroke(
                                                isPasswordFocused ? AUTDesignSystem.Colors.Primary.primary : Color.clear,
                                                lineWidth: 2
                                            )
                                    )
                                }
                            }
                            
                            // Error Message
                            if let errorMessage = authManager.errorMessage {
                                HStack(spacing: AUTDesignSystem.Spacing.sm) {
                                    Image(systemName: "exclamationmark.triangle.fill")
                                        .font(.system(size: 16))
                                        .foregroundColor(AUTDesignSystem.Colors.Semantic.error)
                                    
                                    Text(errorMessage)
                                        .font(AUTDesignSystem.Typography.bodySmall)
                                        .foregroundColor(AUTDesignSystem.Colors.Semantic.error)
                                    
                                    Spacer()
                                }
                                .padding(.horizontal, AUTDesignSystem.Spacing.md)
                                .padding(.vertical, AUTDesignSystem.Spacing.sm)
                                .background(AUTDesignSystem.Colors.Semantic.errorContainer)
                                .cornerRadius(AUTDesignSystem.CornerRadius.md)
                                .transition(.scale.combined(with: .opacity))
                            }
                            
                            // Sign In Button
                            Button(action: {
                                withAnimation(.easeInOut(duration: 0.2)) {
                                    authManager.signIn(email: email, password: password)
                                }
                            }) {
                                HStack(spacing: AUTDesignSystem.Spacing.sm) {
                                    if authManager.isLoading {
                                        ProgressView()
                                            .scaleEffect(0.9)
                                            .tint(.white)
                                    } else {
                                        Text("Sign In")
                                            .font(AUTDesignSystem.Typography.labelLarge)
                                            .fontWeight(.semibold)
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, AUTDesignSystem.Spacing.lg)
                                .foregroundColor(.white)
                                .background(
                                    Group {
                                        if isSignInDisabled {
                                            AUTDesignSystem.Colors.Neutral.gray300
                                        } else {
                                            LinearGradient(
                                                colors: [
                                                    AUTDesignSystem.Colors.Primary.primary,
                                                    AUTDesignSystem.Colors.Primary.primaryDark
                                                ],
                                                startPoint: .leading,
                                                endPoint: .trailing
                                            )
                                        }
                                    }
                                )
                                .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                                .shadow(
                                    color: isSignInDisabled ? Color.clear : AUTDesignSystem.Colors.Primary.primary.opacity(0.3),
                                    radius: 8,
                                    x: 0,
                                    y: 4
                                )
                            }
                            .disabled(isSignInDisabled)
                            .scaleEffect(isSignInDisabled ? 0.98 : 1.0)
                            .animation(.easeInOut(duration: 0.2), value: isSignInDisabled)
                            
                            // Sign Up Button
                            Button(action: { showingSignUp = true }) {
                                VStack(spacing: AUTDesignSystem.Spacing.xs) {
                                    Text("Don't have an account?")
                                        .font(AUTDesignSystem.Typography.bodySmall)
                                        .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                                    
                                    Text("Sign Up")
                                        .font(AUTDesignSystem.Typography.labelLarge)
                                        .fontWeight(.semibold)
                                        .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                                }
                            }
                            .padding(.bottom, AUTDesignSystem.Spacing.md)
                        }
                        .padding(.horizontal, AUTDesignSystem.Spacing.xl)
                        .padding(.vertical, AUTDesignSystem.Spacing.lg)
                    }
                    .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                    .offset(y: -AUTDesignSystem.Spacing.xxxl)
                }
            }
            .background(AUTDesignSystem.Colors.Neutral.background)
            .ignoresSafeArea(.container, edges: .top)
        }
        .sheet(isPresented: $showingSignUp) {
            SignUpView()
        }
    }
    
    private var isSignInDisabled: Bool {
        email.isEmpty || password.isEmpty || authManager.isLoading
    }
}

// Helper extension for focus change
extension View {
    func onFocusChange(_ action: @escaping (Bool) -> Void) -> some View {
        self.onReceive(NotificationCenter.default.publisher(for: UITextField.textDidBeginEditingNotification)) { _ in
            action(true)
        }
        .onReceive(NotificationCenter.default.publisher(for: UITextField.textDidEndEditingNotification)) { _ in
            action(false)
        }
    }
}
