# AUT Handshake iOS App

A comprehensive job search and career platform for students and employers at Auckland University of Technology, built natively for iOS using Swift and SwiftUI.

## 🚀 Features

### For Students
- **Job Discovery**: Browse and search through available positions with advanced filtering
- **Easy Applications**: Apply to jobs with optional cover letters
- **Application Tracking**: Monitor the status of your applications in real-time
- **Professional Networking**: Connect with industry professionals and fellow students
- **Event Registration**: Discover and register for career fairs, workshops, and networking events
- **Profile Management**: Showcase your skills, experience, and academic achievements

### For Employers
- **Job Posting**: Create and manage job listings
- **Candidate Management**: Review applications and manage the hiring process
- **University Integration**: Connect directly with AUT students and graduates
- **Event Hosting**: Organize recruitment events and workshops

## 📱 App Architecture

This app follows the **MVVM (Model-View-ViewModel)** architecture pattern with SwiftUI and Combine for reactive programming.

### Project Structure
```
AUTHandshake/
├── Models/                 # Core data models
│   └── Models.swift
├── Views/                  # SwiftUI views
│   ├── ContentView.swift
│   ├── LoginView.swift
│   ├── SignUpView.swift
│   ├── MainTabView.swift
│   ├── JobsView.swift
│   ├── JobDetailView.swift
│   ├── ApplicationsView.swift
│   ├── NetworkView.swift
│   ├── EventsView.swift
│   └── ProfileView.swift
├── ViewModels/            # State management
│   └── AuthenticationManager.swift
├── Services/              # API communication
│   └── NetworkService.swift
├── Utils/                 # Utility functions
└── Resources/             # Assets and resources
```

## 🛠 Technologies Used

- **Swift 5.0+**: Modern iOS development language
- **SwiftUI**: Declarative UI framework
- **Combine**: Reactive programming framework
- **iOS 17.5+**: Minimum deployment target
- **Xcode 15.4+**: Development environment

## 🏗 Key Components

### Models
- **User**: Student and employer profiles
- **Job**: Job listings with detailed information
- **Application**: Job application tracking
- **Event**: Career events and workshops

### Views
- **Authentication Flow**: Login and registration
- **Job Discovery**: Search, filter, and browse jobs
- **Application Management**: Track application status
- **Networking**: Connect with professionals
- **Events**: Discover and register for events
- **Profile**: Manage user information and settings

### Services
- **AuthService**: User authentication and management
- **JobService**: Job listings and applications
- **EventService**: Event discovery and registration

## 🎨 Design Features

- **Native iOS Experience**: Follows iOS Human Interface Guidelines
- **Accessibility**: Full VoiceOver and accessibility support
- **Dark Mode**: Automatic light/dark mode support
- **Responsive Design**: Optimized for iPhone and iPad
- **Smooth Animations**: Engaging user experience with SwiftUI animations

## 🔧 Development Setup

### Prerequisites
- Xcode 15.4 or later
- iOS 17.5+ deployment target
- macOS for iOS development

### Getting Started
1. Open `AUTHandshake.xcodeproj` in Xcode
2. Select your development team in the project settings
3. Choose a target device or simulator
4. Build and run the project (⌘+R)

### Development Guidelines
- Follow Swift naming conventions
- Use SwiftUI for all UI components
- Implement proper error handling
- Write descriptive comments for complex logic
- Use mock data for development (replace with real API calls)

## 📋 Current Status

This is a **development version** with the following implemented features:

✅ **Completed**
- User authentication flow (login/signup)
- Job browsing with search and filters
- Job detail view with application functionality
- Application status tracking
- Professional networking features
- Event discovery and registration
- User profile management
- Settings and preferences

🔄 **In Development**
- Real API integration (currently using mock data)
- Push notifications
- Advanced search algorithms
- Interview scheduling
- File upload for resumes
- Real-time messaging

## 🚀 Future Enhancements

- **AI-Powered Recommendations**: Job matching based on skills and preferences
- **Video Interviews**: Integrated video calling for remote interviews
- **Analytics Dashboard**: Career insights and application analytics
- **Integration with AUT Systems**: Direct integration with university databases
- **Offline Support**: Core functionality available offline
- **Apple Watch App**: Quick access to notifications and updates

## 📱 Screenshots

*Screenshots will be added once the app is running in the simulator*

## 🤝 Contributing

This project is part of the AUT Handshake platform. For contributions or suggestions, please follow the established development guidelines and coding standards.

## 📄 License

This project is developed for Auckland University of Technology. All rights reserved.

---

**Built with ❤️ for the AUT community**