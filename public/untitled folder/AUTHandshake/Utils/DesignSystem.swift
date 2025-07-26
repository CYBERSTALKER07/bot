import SwiftUI

// MARK: - AUT Design System
/// Comprehensive design system for AUT Handshake iOS app
/// Based on AUT brand guidelines and professional design principles

struct AUTDesignSystem {
    // MARK: - Brand Colors
    struct Colors {
        // AUT Brand Colors - Refined
        static let autMaroon = Color(red: 140/255, green: 29/255, blue: 64/255)
        static let autGold = Color(red: 255/255, green: 198/255, blue: 39/255)
        static let autAccent = Color(red: 227/255, green: 255/255, blue: 112/255)
        
        // Primary Color System with Material Design depth
        struct Primary {
            static let primary = autMaroon
            static let primary50 = Color(red: 252/255, green: 248/255, blue: 250/255)
            static let primary100 = Color(red: 243/255, green: 229/255, blue: 236/255)
            static let primary200 = Color(red: 224/255, green: 187/255, blue: 202/255)
            static let primary300 = Color(red: 205/255, green: 144/255, blue: 169/255)
            static let primary400 = Color(red: 187/255, green: 102/255, blue: 135/255)
            static let primary500 = autMaroon // Main brand color
            static let primary600 = Color(red: 120/255, green: 9/255, blue: 44/255)
            static let primary700 = Color(red: 100/255, green: 0/255, blue: 30/255)
            static let primary800 = Color(red: 80/255, green: 0/255, blue: 20/255)
            static let primary900 = Color(red: 60/255, green: 0/255, blue: 15/255)
            
            static let primaryLight = primary300
            static let primaryDark = primary700
            static let primaryForeground = Color.white
            static let primaryContainer = primary100
            static let onPrimaryContainer = primary900
        }
        
        // Secondary Color System
        struct Secondary {
            static let secondary = autGold
            static let secondary50 = Color(red: 255/255, green: 253/255, blue: 247/255)
            static let secondary100 = Color(red: 255/255, green: 248/255, blue: 220/255)
            static let secondary200 = Color(red: 255/255, green: 238/255, blue: 181/255)
            static let secondary300 = Color(red: 255/255, green: 228/255, blue: 142/255)
            static let secondary400 = Color(red: 255/255, green: 218/255, blue: 103/255)
            static let secondary500 = autGold
            static let secondary600 = Color(red: 230/255, green: 178/255, blue: 19/255)
            static let secondary700 = Color(red: 195/255, green: 147/255, blue: 0/255)
            static let secondary800 = Color(red: 160/255, green: 117/255, blue: 0/255)
            static let secondary900 = Color(red: 125/255, green: 87/255, blue: 0/255)
            
            static let secondaryLight = secondary300
            static let secondaryDark = secondary700
            static let secondaryForeground = Color.black
            static let secondaryContainer = secondary100
            static let onSecondaryContainer = secondary900
        }
        
        // Semantic Color System with containers
        struct Semantic {
            static let success = Color(red: 16/255, green: 185/255, blue: 129/255)
            static let successContainer = Color(red: 240/255, green: 253/255, blue: 250/255)
            static let onSuccessContainer = Color(red: 2/255, green: 44/255, blue: 34/255)
            
            static let warning = Color(red: 245/255, green: 158/255, blue: 11/255)
            static let warningContainer = Color(red: 255/255, green: 251/255, blue: 235/255)
            static let onWarningContainer = Color(red: 69/255, green: 26/255, blue: 3/255)
            
            static let error = Color(red: 220/255, green: 38/255, blue: 127/255)
            static let errorContainer = Color(red: 255/255, green: 241/255, blue: 242/255)
            static let onErrorContainer = Color(red: 65/255, green: 14/255, blue: 33/255)
            
            static let info = Color(red: 59/255, green: 130/255, blue: 246/255)
            static let infoContainer = Color(red: 239/255, green: 246/255, blue: 255/255)
            static let onInfoContainer = Color(red: 30/255, green: 58/255, blue: 138/255)
        }
        
        // System Colors (alias for Semantic)
        struct System {
            static let success = Semantic.success
            static let warning = Semantic.warning
            static let error = Semantic.error
            static let info = Semantic.info
        }
        
        // Neutral Colors
        struct Neutral {
            static let background = Color(.systemBackground)
            static let foreground = Color(.label)
            
            // Google-inspired neutral grays
            static let gray50 = Color(red: 249/255, green: 250/255, blue: 251/255)
            static let gray100 = Color(red: 243/255, green: 244/255, blue: 246/255)
            static let gray200 = Color(red: 229/255, green: 231/255, blue: 235/255)
            static let gray300 = Color(red: 209/255, green: 213/255, blue: 219/255)
            static let gray400 = Color(red: 156/255, green: 163/255, blue: 175/255)
            static let gray500 = Color(red: 107/255, green: 114/255, blue: 128/255)
            static let gray600 = Color(red: 75/255, green: 85/255, blue: 99/255)
            static let gray700 = Color(red: 55/255, green: 65/255, blue: 81/255)
            static let gray800 = Color(red: 31/255, green: 41/255, blue: 55/255)
            static let gray900 = Color(red: 17/255, green: 24/255, blue: 39/255)
            
            static let muted = gray500
            static let mutedBackground = gray50
            static let border = gray200
            static let cardBackground = Color(.systemBackground)
            static let surface = gray50
            static let surfaceVariant = gray100
            static let outline = gray300
            static let outlineVariant = gray200
        }
        
        // Status Colors
        struct Status {
            static let submitted = Semantic.info
            static let reviewed = Semantic.warning
            static let interview = Primary.primary
            static let accepted = Semantic.success
            static let rejected = Semantic.error
            static let withdrawn = Neutral.muted
        }
    }
    
    // MARK: - Typography
    struct Typography {
        // Google Material Design Typography Scale
        static let displayLarge = Font.system(size: 57, weight: .light, design: .default)
        static let displayMedium = Font.system(size: 45, weight: .light, design: .default)
        static let displaySmall = Font.system(size: 36, weight: .regular, design: .default)
        
        static let headlineLarge = Font.system(size: 32, weight: .semibold, design: .default)
        static let headlineMedium = Font.system(size: 28, weight: .semibold, design: .default)
        static let headlineSmall = Font.system(size: 24, weight: .semibold, design: .default)
        
        static let titleLarge = Font.system(size: 22, weight: .medium, design: .default)
        static let titleMedium = Font.system(size: 16, weight: .medium, design: .default)
        static let titleSmall = Font.system(size: 14, weight: .medium, design: .default)
        
        static let bodyLarge = Font.system(size: 16, weight: .regular, design: .default)
        static let bodyMedium = Font.system(size: 14, weight: .regular, design: .default)
        static let bodySmall = Font.system(size: 12, weight: .regular, design: .default)
        
        static let labelLarge = Font.system(size: 14, weight: .medium, design: .default)
        static let labelMedium = Font.system(size: 12, weight: .medium, design: .default)
        static let labelSmall = Font.system(size: 11, weight: .medium, design: .default)
        
        // Legacy support for existing components
        static let largeTitle = displaySmall
        static let title1 = headlineLarge
        static let title2 = headlineMedium
        static let title3 = headlineSmall
        static let headline = titleLarge
        static let body = bodyLarge
        static let callout = bodyMedium
        static let subheadline = titleSmall
        static let subtitle = titleMedium
        static let caption = bodySmall
        static let caption2 = labelSmall
        static let footnote = labelMedium
        
        // Custom app-specific typography
        static let heroTitle = displayMedium
        static let pageTitle = headlineMedium
        static let cardTitle = titleLarge
        static let buttonText = labelLarge
        static let badgeText = labelSmall
    }
    
    // MARK: - Spacing
    struct Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 24
        static let xxxl: CGFloat = 32
        
        // iOS-specific spacing
        static let safeArea: CGFloat = 16
        static let tabBarHeight: CGFloat = 83
        static let navigationHeight: CGFloat = 44
        static let touchTarget: CGFloat = 44
    }
    
    // MARK: - Corner Radius
    struct CornerRadius {
        static let xs: CGFloat = 4
        static let small: CGFloat = 6  // Added small
        static let sm: CGFloat = 6
        static let medium: CGFloat = 8  // Added medium (alias for md)
        static let md: CGFloat = 8
        static let lg: CGFloat = 12
        static let xl: CGFloat = 16
        static let full: CGFloat = 1000  // Added full (alias for round)
        static let round: CGFloat = 1000
    }
    
    // MARK: - Shadows
    struct Shadow {
        static let subtle = Color.black.opacity(0.05)
        static let light = Color.black.opacity(0.1)
        static let medium = Color.black.opacity(0.15)
        static let strong = Color.black.opacity(0.2)
        
        // Shadow configurations
        static let cardShadow = (color: light, radius: CGFloat(2), x: CGFloat(0), y: CGFloat(1))
        static let buttonShadow = (color: medium, radius: CGFloat(4), x: CGFloat(0), y: CGFloat(2))
        static let modalShadow = (color: strong, radius: CGFloat(10), x: CGFloat(0), y: CGFloat(5))
    }
    
    // MARK: - Animations
    struct Animation {
        static let quick = SwiftUI.Animation.easeOut(duration: 0.2)
        static let smooth = SwiftUI.Animation.easeInOut(duration: 0.3)
        static let bouncy = SwiftUI.Animation.spring(response: 0.5, dampingFraction: 0.7)
        static let gentle = SwiftUI.Animation.easeInOut(duration: 0.4)
    }
}

// MARK: - Design System Extensions
extension Color {
    // Quick access to design system colors
    static let autPrimary = AUTDesignSystem.Colors.Primary.primary
    static let autSecondary = AUTDesignSystem.Colors.Secondary.secondary
    static let autAccent = AUTDesignSystem.Colors.autAccent
    static let autSuccess = AUTDesignSystem.Colors.Semantic.success
    static let autWarning = AUTDesignSystem.Colors.Semantic.warning
    static let autError = AUTDesignSystem.Colors.Semantic.error
    static let autInfo = AUTDesignSystem.Colors.Semantic.info
}

extension Font {
    // Quick access to design system typography
    static let autHeroTitle = AUTDesignSystem.Typography.heroTitle
    static let autPageTitle = AUTDesignSystem.Typography.pageTitle
    static let autCardTitle = AUTDesignSystem.Typography.cardTitle
    static let autButtonText = AUTDesignSystem.Typography.buttonText
    static let autBadgeText = AUTDesignSystem.Typography.badgeText
}

// MARK: - View Modifiers
extension View {
    // Card styling
    func autCard() -> some View {
        self
            .background(AUTDesignSystem.Colors.Neutral.cardBackground)
            .cornerRadius(AUTDesignSystem.CornerRadius.lg)
            .shadow(
                color: AUTDesignSystem.Shadow.cardShadow.color,
                radius: AUTDesignSystem.Shadow.cardShadow.radius,
                x: AUTDesignSystem.Shadow.cardShadow.x,
                y: AUTDesignSystem.Shadow.cardShadow.y
            )
    }
    
    // Primary button styling
    func autPrimaryButton() -> some View {
        self
            .font(AUTDesignSystem.Typography.buttonText)
            .foregroundColor(AUTDesignSystem.Colors.Primary.primaryForeground)
            .padding(.horizontal, AUTDesignSystem.Spacing.xl)
            .padding(.vertical, AUTDesignSystem.Spacing.md)
            .background(AUTDesignSystem.Colors.Primary.primary)
            .cornerRadius(AUTDesignSystem.CornerRadius.lg)
            .shadow(
                color: AUTDesignSystem.Shadow.buttonShadow.color,
                radius: AUTDesignSystem.Shadow.buttonShadow.radius,
                x: AUTDesignSystem.Shadow.buttonShadow.x,
                y: AUTDesignSystem.Shadow.buttonShadow.y
            )
    }
    
    // Secondary button styling
    func autSecondaryButton() -> some View {
        self
            .font(AUTDesignSystem.Typography.buttonText)
            .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
            .padding(.horizontal, AUTDesignSystem.Spacing.xl)
            .padding(.vertical, AUTDesignSystem.Spacing.md)
            .background(Color.clear)
            .overlay(
                RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.lg)
                    .stroke(AUTDesignSystem.Colors.Primary.primary, lineWidth: 2)
            )
    }
    
    // Status badge styling
    func autStatusBadge(status: ApplicationStatus) -> some View {
        self
            .font(AUTDesignSystem.Typography.badgeText)
            .foregroundColor(statusColor(for: status))
            .padding(.horizontal, AUTDesignSystem.Spacing.sm)
            .padding(.vertical, AUTDesignSystem.Spacing.xs)
            .background(statusColor(for: status).opacity(0.1))
            .cornerRadius(AUTDesignSystem.CornerRadius.round)
    }
    
    // iOS safe area handling
    func iosSafeArea() -> some View {
        self
            .padding(.top, AUTDesignSystem.Spacing.safeArea)
            .padding(.bottom, AUTDesignSystem.Spacing.safeArea)
    }
    
    // Smooth animation
    func autAnimation() -> some View {
        self
            .animation(AUTDesignSystem.Animation.smooth, value: UUID())
    }
    
    private func statusColor(for status: ApplicationStatus) -> Color {
        switch status {
        case .submitted:
            return AUTDesignSystem.Colors.Status.submitted
        case .reviewed:
            return AUTDesignSystem.Colors.Status.reviewed
        case .interview:
            return AUTDesignSystem.Colors.Status.interview
        case .accepted:
            return AUTDesignSystem.Colors.Status.accepted
        case .rejected:
            return AUTDesignSystem.Colors.Status.rejected
        case .withdrawn:
            return AUTDesignSystem.Colors.Status.withdrawn
        }
    }
}

// MARK: - Input Field Component
struct AUTTextField: View {
    let title: String?
    @Binding var text: String
    let placeholder: String
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var autocapitalization: TextInputAutocapitalization = .words
    
    init(title: String? = nil, text: Binding<String>, placeholder: String, isSecure: Bool = false, keyboardType: UIKeyboardType = .default, autocapitalization: TextInputAutocapitalization = .words) {
        self.title = title
        self._text = text
        self.placeholder = placeholder
        self.isSecure = isSecure
        self.keyboardType = keyboardType
        self.autocapitalization = autocapitalization
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
            if let title = title {
                Text(title)
                    .font(AUTDesignSystem.Typography.subheadline)
                    .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                    .fontWeight(.medium)
            }
            
            Group {
                if isSecure {
                    SecureField(placeholder, text: $text)
                } else {
                    TextField(placeholder, text: $text)
                        .keyboardType(keyboardType)
                        .textInputAutocapitalization(autocapitalization)
                }
            }
            .font(AUTDesignSystem.Typography.body)
            .padding(AUTDesignSystem.Spacing.md)
            .background(AUTDesignSystem.Colors.Neutral.mutedBackground)
            .cornerRadius(AUTDesignSystem.CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.md)
                    .stroke(AUTDesignSystem.Colors.Neutral.border, lineWidth: 1)
            )
        }
    }
}

// MARK: - Primary Button Component
struct AUTPrimaryButton: View {
    let title: String
    let isLoading: Bool
    let isDisabled: Bool
    let action: () -> Void
    
    init(title: String, isLoading: Bool = false, isDisabled: Bool = false, action: @escaping () -> Void) {
        self.title = title
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.action = action
    }
    
    var body: some View {
        Button(action: action) {
            HStack {
                if isLoading {
                    ProgressView()
                        .scaleEffect(0.8)
                        .tint(AUTDesignSystem.Colors.Primary.primaryForeground)
                } else {
                    Text(title)
                        .font(AUTDesignSystem.Typography.buttonText)
                        .foregroundColor(AUTDesignSystem.Colors.Primary.primaryForeground)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, AUTDesignSystem.Spacing.xl)
            .padding(.vertical, AUTDesignSystem.Spacing.md)
            .background(isDisabled ? AUTDesignSystem.Colors.Neutral.muted : AUTDesignSystem.Colors.Primary.primary)
            .cornerRadius(AUTDesignSystem.CornerRadius.lg)
            .shadow(
                color: isDisabled ? Color.clear : AUTDesignSystem.Shadow.buttonShadow.color,
                radius: AUTDesignSystem.Shadow.buttonShadow.radius,
                x: AUTDesignSystem.Shadow.buttonShadow.x,
                y: AUTDesignSystem.Shadow.buttonShadow.y
            )
        }
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.6 : 1.0)
        .animation(AUTDesignSystem.Animation.quick, value: isDisabled)
        .animation(AUTDesignSystem.Animation.quick, value: isLoading)
    }
}

// MARK: - Secondary Button Component
struct AUTSecondaryButton: View {
    let title: String
    let action: () -> Void
    
    init(title: String, action: @escaping () -> Void) {
        self.title = title
        self.action = action
    }
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(AUTDesignSystem.Typography.buttonText)
                .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                .frame(maxWidth: .infinity)
                .padding(.horizontal, AUTDesignSystem.Spacing.xl)
                .padding(.vertical, AUTDesignSystem.Spacing.md)
                .background(Color.clear)
                .overlay(
                    RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.lg)
                        .stroke(AUTDesignSystem.Colors.Primary.primary, lineWidth: 2)
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Reusable Button Component
struct AUTButton: View {
    enum Style {
        case primary
        case secondary
        case ghost
    }
    
    let title: String
    let style: Style
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(AUTButtonStyle(style: style))
    }
}

struct AUTButtonStyle: ButtonStyle {
    let style: AUTButton.Style
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .modifier(ButtonStyleModifier(style: style))
            .animation(AUTDesignSystem.Animation.quick, value: configuration.isPressed)
    }
}

struct ButtonStyleModifier: ViewModifier {
    let style: AUTButton.Style
    
    func body(content: Content) -> some View {
        switch style {
        case .primary:
            content.autPrimaryButton()
        case .secondary:
            content.autSecondaryButton()
        case .ghost:
            content
                .font(AUTDesignSystem.Typography.buttonText)
                .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                .padding(.vertical, AUTDesignSystem.Spacing.md)
        }
    }
}

// MARK: - Card Component
struct AUTCard<Content: View>: View {
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        content
            .padding(AUTDesignSystem.Spacing.lg)
            .autCard()
    }
}

// MARK: - Status Badge Component
struct AUTStatusBadge: View {
    let status: ApplicationStatus
    
    var body: some View {
        Text(status.displayName)
            .autStatusBadge(status: status)
    }
}

// MARK: - Loading View Component
struct AUTLoadingView: View {
    var body: some View {
        VStack(spacing: AUTDesignSystem.Spacing.lg) {
            ProgressView()
                .scaleEffect(1.2)
                .tint(AUTDesignSystem.Colors.Primary.primary)
            
            Text("Loading...")
                .font(AUTDesignSystem.Typography.callout)
                .foregroundColor(AUTDesignSystem.Colors.Neutral.muted)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(AUTDesignSystem.Colors.Neutral.background)
    }
}

// MARK: - Empty State Component
struct AUTEmptyState: View {
    let title: String
    let message: String
    let systemImage: String
    let actionTitle: String?
    let action: (() -> Void)?
    
    init(title: String, message: String, systemImage: String, actionTitle: String? = nil, action: (() -> Void)? = nil) {
        self.title = title
        self.message = message
        self.systemImage = systemImage
        self.actionTitle = actionTitle
        self.action = action
    }
    
    var body: some View {
        VStack(spacing: AUTDesignSystem.Spacing.xl) {
            Image(systemName: systemImage)
                .font(.system(size: 48))
                .foregroundColor(AUTDesignSystem.Colors.Neutral.muted)
            
            VStack(spacing: AUTDesignSystem.Spacing.sm) {
                Text(title)
                    .font(AUTDesignSystem.Typography.title3)
                    .fontWeight(.semibold)
                    .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                
                Text(message)
                    .font(AUTDesignSystem.Typography.callout)
                    .foregroundColor(AUTDesignSystem.Colors.Neutral.muted)
                    .multilineTextAlignment(.center)
            }
            
            if let actionTitle = actionTitle, let action = action {
                AUTButton(title: actionTitle, style: .primary, action: action)
                    .frame(maxWidth: 200)
            }
        }
        .padding(AUTDesignSystem.Spacing.xxxl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(AUTDesignSystem.Colors.Neutral.background)
    }
}

// MARK: - Section Header Component
struct AUTSectionHeader: View {
    let title: String
    let subtitle: String?
    let actionTitle: String?
    let action: (() -> Void)?
    
    init(title: String, subtitle: String? = nil, actionTitle: String? = nil, action: (() -> Void)? = nil) {
        self.title = title
        self.subtitle = subtitle
        self.actionTitle = actionTitle
        self.action = action
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
            HStack {
                VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
                    Text(title)
                        .font(AUTDesignSystem.Typography.title3)
                        .fontWeight(.semibold)
                        .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                    
                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(AUTDesignSystem.Typography.callout)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.muted)
                    }
                }
                
                Spacer()
                
                if let actionTitle = actionTitle, let action = action {
                    Button(actionTitle, action: action)
                        .font(AUTDesignSystem.Typography.callout)
                        .fontWeight(.medium)
                        .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                }
            }
        }
        .padding(.horizontal, AUTDesignSystem.Spacing.lg)
        .padding(.vertical, AUTDesignSystem.Spacing.md)
    }
}

// MARK: - Google-Inspired Advanced Components

// MARK: - Material Design Floating Action Button
struct AUTFloatingActionButton: View {
    let icon: String
    let action: () -> Void
    var size: CGFloat = 56
    var extended: Bool = false
    var label: String? = nil
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: AUTDesignSystem.Spacing.sm) {
                Image(systemName: icon)
                    .font(.system(size: 24, weight: .medium))
                    .foregroundColor(AUTDesignSystem.Colors.Primary.primaryForeground)
                
                if extended, let label = label {
                    Text(label)
                        .font(AUTDesignSystem.Typography.labelLarge)
                        .foregroundColor(AUTDesignSystem.Colors.Primary.primaryForeground)
                }
            }
            .frame(width: extended ? nil : size, height: size)
            .padding(.horizontal, extended ? AUTDesignSystem.Spacing.lg : 0)
            .background(AUTDesignSystem.Colors.Primary.primary)
            .cornerRadius(extended ? AUTDesignSystem.CornerRadius.lg : size/2)
            .shadow(
                color: Color.black.opacity(0.25),
                radius: 8,
                x: 0,
                y: 4
            )
        }
        .scaleEffect(1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: extended)
    }
}

// MARK: - Material Design Card with Elevation
struct AUTMaterialCard<Content: View>: View {
    let content: Content
    var elevation: Int = 2
    var backgroundColor: Color = AUTDesignSystem.Colors.Neutral.cardBackground
    
    init(elevation: Int = 2, backgroundColor: Color = AUTDesignSystem.Colors.Neutral.cardBackground, @ViewBuilder content: () -> Content) {
        self.elevation = elevation
        self.backgroundColor = backgroundColor
        self.content = content()
    }
    
    var body: some View {
        content
            .background(backgroundColor)
            .cornerRadius(AUTDesignSystem.CornerRadius.lg)
            .shadow(
                color: shadowColor,
                radius: shadowRadius,
                x: 0,
                y: shadowOffset
            )
    }
    
    private var shadowColor: Color {
        Color.black.opacity(shadowOpacity)
    }
    
    private var shadowOpacity: Double {
        switch elevation {
        case 0: return 0
        case 1: return 0.12
        case 2: return 0.16
        case 3: return 0.19
        case 4: return 0.25
        case 5: return 0.30
        default: return 0.16
        }
    }
    
    private var shadowRadius: CGFloat {
        switch elevation {
        case 0: return 0
        case 1: return 1
        case 2: return 3
        case 3: return 10
        case 4: return 14
        case 5: return 25
        default: return 3
        }
    }
    
    private var shadowOffset: CGFloat {
        switch elevation {
        case 0: return 0
        case 1: return 1
        case 2: return 1
        case 3: return 4
        case 4: return 5
        case 5: return 8
        default: return 1
        }
    }
}

// MARK: - Advanced Search Bar
struct AUTSearchBar: View {
    @Binding var text: String
    var placeholder: String = "Search"
    var onSearchTapped: (() -> Void)? = nil
    var showFilters: Bool = false
    var onFilterTapped: (() -> Void)? = nil
    
    @FocusState private var isFocused: Bool
    
    var body: some View {
        HStack(spacing: AUTDesignSystem.Spacing.sm) {
            // Search field container
            HStack(spacing: AUTDesignSystem.Spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(AUTDesignSystem.Colors.Neutral.gray400)
                
                TextField(placeholder, text: $text)
                    .font(AUTDesignSystem.Typography.bodyLarge)
                    .focused($isFocused)
                    .onSubmit {
                        onSearchTapped?()
                    }
                
                if !text.isEmpty {
                    Button(action: { text = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.gray400)
                    }
                }
            }
            .padding(.horizontal, AUTDesignSystem.Spacing.md)
            .padding(.vertical, AUTDesignSystem.Spacing.sm)
            .background(AUTDesignSystem.Colors.Neutral.surfaceVariant)
            .cornerRadius(AUTDesignSystem.CornerRadius.lg)
            .overlay(
                RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.lg)
                    .stroke(isFocused ? AUTDesignSystem.Colors.Primary.primary : Color.clear, lineWidth: 2)
            )
            .animation(.easeInOut(duration: 0.2), value: isFocused)
            
            // Filter button
            if showFilters {
                Button(action: { onFilterTapped?() }) {
                    Image(systemName: "slider.horizontal.3")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                        .frame(width: 44, height: 44)
                        .background(AUTDesignSystem.Colors.Primary.primaryContainer)
                        .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                }
            }
        }
    }
}

// MARK: - Material Design Chip
struct AUTChip: View {
    let title: String
    var isSelected: Bool = false
    var showCloseButton: Bool = false
    var leadingIcon: String? = nil
    let action: () -> Void
    var onClose: (() -> Void)? = nil
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: AUTDesignSystem.Spacing.xs) {
                if let icon = leadingIcon {
                    Image(systemName: icon)
                        .font(.system(size: 14, weight: .medium))
                }
                
                Text(title)
                    .font(AUTDesignSystem.Typography.labelMedium)
                    .lineLimit(1)
                
                if showCloseButton {
                    Button(action: { onClose?() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 12, weight: .medium))
                    }
                }
            }
            .padding(.horizontal, AUTDesignSystem.Spacing.md)
            .padding(.vertical, AUTDesignSystem.Spacing.xs)
            .background(
                isSelected ? 
                AUTDesignSystem.Colors.Primary.primaryContainer :
                AUTDesignSystem.Colors.Neutral.surfaceVariant
            )
            .foregroundColor(
                isSelected ?
                AUTDesignSystem.Colors.Primary.onPrimaryContainer :
                AUTDesignSystem.Colors.Neutral.foreground
            )
            .cornerRadius(AUTDesignSystem.CornerRadius.lg)
            .overlay(
                RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.lg)
                    .stroke(
                        isSelected ? 
                        AUTDesignSystem.Colors.Primary.primary : 
                        AUTDesignSystem.Colors.Neutral.outline,
                        lineWidth: 1
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
        .scaleEffect(isSelected ? 1.05 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isSelected)
    }
}

// MARK: - Advanced Progress Indicator
struct AUTProgressIndicator: View {
    var progress: Double = 0.0
    var showPercentage: Bool = false
    var height: CGFloat = 6
    
    var body: some View {
        VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
            if showPercentage {
                HStack {
                    Spacer()
                    Text("\(Int(progress * 100))%")
                        .font(AUTDesignSystem.Typography.labelSmall)
                        .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                }
            }
            
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: height/2)
                        .fill(AUTDesignSystem.Colors.Neutral.gray200)
                        .frame(height: height)
                    
                    RoundedRectangle(cornerRadius: height/2)
                        .fill(
                            LinearGradient(
                                colors: [
                                    AUTDesignSystem.Colors.Primary.primary,
                                    AUTDesignSystem.Colors.Primary.primaryLight
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width * progress, height: height)
                        .animation(.easeInOut(duration: 0.5), value: progress)
                }
            }
            .frame(height: height)
        }
    }
}

// MARK: - Material Design Bottom Sheet
struct AUTBottomSheet<Content: View>: View {
    @Binding var isPresented: Bool
    let content: Content
    var maxHeight: CGFloat = UIScreen.main.bounds.height * 0.7
    
    init(isPresented: Binding<Bool>, maxHeight: CGFloat = UIScreen.main.bounds.height * 0.7, @ViewBuilder content: () -> Content) {
        self._isPresented = isPresented
        self.maxHeight = maxHeight
        self.content = content()
    }
    
    var body: some View {
        ZStack {
            if isPresented {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            isPresented = false
                        }
                    }
                
                VStack {
                    Spacer()
                    
                    VStack(spacing: 0) {
                        // Handle
                        RoundedRectangle(cornerRadius: 3)
                            .fill(AUTDesignSystem.Colors.Neutral.gray300)
                            .frame(width: 40, height: 6)
                            .padding(.top, AUTDesignSystem.Spacing.md)
                        
                        // Content
                        content
                            .frame(maxHeight: maxHeight)
                    }
                    .background(AUTDesignSystem.Colors.Neutral.background)
                    .cornerRadius(AUTDesignSystem.CornerRadius.xl, corners: [.topLeft, .topRight])
                    .transition(.move(edge: .bottom))
                }
                .animation(.easeInOut(duration: 0.3), value: isPresented)
            }
        }
    }
}

// MARK: - Helper extension for corner radius
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}