<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AUT Handshake iOS App - Copilot Instructions

This is a native iOS Swift application recreating the AUT Handshake platform - a comprehensive job search and career platform for students and employers at Auckland University of Technology.

## Project Structure
- **Models**: Core data models (User, Job, Application, Event)
- **Views**: SwiftUI views for all app screens
- **ViewModels**: ObservableObject classes for state management
- **Services**: Network service classes for API communication
- **Utils**: Utility functions and helpers

## Key Features
- User authentication (students and employers)
- Job browsing with search and filters
- Job application management
- Professional networking
- Event discovery and registration
- User profile management

## Development Guidelines
- Use SwiftUI for all UI components
- Follow MVVM architecture pattern
- Use Combine for reactive programming
- Implement proper error handling
- Use mock data for development (replace with real API calls)
- Follow iOS Human Interface Guidelines
- Ensure accessibility compliance

## Coding Standards
- Use descriptive variable and function names
- Follow Swift naming conventions
- Add proper documentation for complex functions
- Use @StateObject and @EnvironmentObject appropriately
- Implement proper navigation patterns
- Handle loading states and empty states gracefully