import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Dashboard")
                }
            
            JobsView()
                .tabItem {
                    Image(systemName: "briefcase.fill")
                    Text("Jobs")
                }
            
            ApplicationsView()
                .tabItem {
                    Image(systemName: "doc.text.fill")
                    Text("Applications")
                }
            
            MessagesView()
                .tabItem {
                    Image(systemName: "message.fill")
                    Text("Messages")
                }
            
            NotificationsView()
                .tabItem {
                    Image(systemName: "bell.fill")
                    Text("Notifications")
                }
            
            NetworkView()
                .tabItem {
                    Image(systemName: "person.2.fill")
                    Text("Network")
                }
            
            EventsView()
                .tabItem {
                    Image(systemName: "calendar.circle.fill")
                    Text("Events")
                }
            
            ProfileView()
                .tabItem {
                    Image(systemName: "person.circle.fill")
                    Text("Profile")
                }
        }
        .accentColor(.blue)
    }
}