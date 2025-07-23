import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        TabView {
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