import SwiftUI
import Charts

struct DashboardView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var jobManager: JobManager
    @StateObject private var dashboardManager = DashboardManager()
    @State private var selectedTimeframe: TimeframeFilter = .week
    @State private var showingJobRecommendations = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 20) {
                    // Welcome Header
                    welcomeHeader
                    
                    // Quick Stats Cards
                    quickStatsGrid
                    
                    // Activity Chart
                    activityChart
                    
                    // Quick Actions
                    quickActionsSection
                    
                    // Recent Activity
                    recentActivitySection
                    
                    // Job Recommendations
                    jobRecommendationsSection
                    
                    // Upcoming Events
                    upcomingEventsSection
                }
                .padding(.horizontal)
                .padding(.bottom, 100) // Extra space for tab bar
            }
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .refreshable {
                await dashboardManager.refreshData()
            }
        }
        .onAppear {
            dashboardManager.loadDashboardData()
        }
    }
    
    // MARK: - Welcome Header
    private var welcomeHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(greetingMessage)
                        .font(.title2)
                        .fontWeight(.semibold)
                    
                    if let user = authManager.currentUser {
                        Text(user.fullName)
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.accentColor)
                    }
                    
                    Text("Let's find your next opportunity")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // Profile Image
                Circle()
                    .fill(Color.blue.opacity(0.2))
                    .frame(width: 60, height: 60)
                    .overlay(
                        Text(authManager.currentUser?.firstName.prefix(1) ?? "U")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(.blue)
                    )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }
    
    // MARK: - Quick Stats Grid
    private var quickStatsGrid: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
            StatCard(
                title: "Applications",
                value: "\(dashboardManager.totalApplications)",
                subtitle: "+\(dashboardManager.newApplicationsThisWeek) this week",
                icon: "doc.text.fill",
                color: .blue
            )
            
            StatCard(
                title: "Job Matches",
                value: "\(dashboardManager.jobMatches)",
                subtitle: "+\(dashboardManager.newMatchesToday) today",
                icon: "briefcase.fill",
                color: .green
            )
            
            StatCard(
                title: "Messages",
                value: "\(dashboardManager.unreadMessages)",
                subtitle: "unread",
                icon: "message.fill",
                color: .purple
            )
            
            StatCard(
                title: "Events",
                value: "\(dashboardManager.upcomingEvents)",
                subtitle: "upcoming",
                icon: "calendar.fill",
                color: .orange
            )
        }
    }
    
    // MARK: - Activity Chart
    private var activityChart: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Activity")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Picker("Timeframe", selection: $selectedTimeframe) {
                    ForEach(TimeframeFilter.allCases, id: \.self) { timeframe in
                        Text(timeframe.title).tag(timeframe)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                .frame(width: 150)
            }
            
            if #available(iOS 16.0, *) {
                Chart(dashboardManager.activityData(for: selectedTimeframe)) { item in
                    LineMark(
                        x: .value("Date", item.date),
                        y: .value("Applications", item.applications)
                    )
                    .foregroundStyle(.blue)
                    
                    AreaMark(
                        x: .value("Date", item.date),
                        y: .value("Applications", item.applications)
                    )
                    .foregroundStyle(.blue.opacity(0.1))
                }
                .frame(height: 200)
                .chartXAxis {
                    AxisMarks(values: .automatic) { _ in
                        AxisGridLine()
                        AxisTick()
                        AxisValueLabel(format: .dateTime.month(.abbreviated).day())
                    }
                }
                .chartYAxis {
                    AxisMarks(position: .leading)
                }
            } else {
                // Fallback for iOS 15
                Text("Activity chart requires iOS 16+")
                    .frame(height: 200)
                    .frame(maxWidth: .infinity)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
    
    // MARK: - Quick Actions
    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Quick Actions")
                .font(.headline)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                QuickActionCard(
                    title: "Find Jobs",
                    subtitle: "Browse new opportunities",
                    icon: "magnifyingglass.circle.fill",
                    color: .blue
                ) {
                    // Navigate to Jobs tab
                }
                
                QuickActionCard(
                    title: "Upload Resume",
                    subtitle: "Update your profile",
                    icon: "doc.circle.fill",
                    color: .green
                ) {
                    // Open file picker
                }
                
                QuickActionCard(
                    title: "Practice Interview",
                    subtitle: "Prepare for success",
                    icon: "video.circle.fill",
                    color: .purple
                ) {
                    // Open interview practice
                }
                
                QuickActionCard(
                    title: "Network",
                    subtitle: "Connect with professionals",
                    icon: "person.2.circle.fill",
                    color: .orange
                ) {
                    // Navigate to Network tab
                }
            }
        }
    }
    
    // MARK: - Recent Activity
    private var recentActivitySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recent Activity")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button("View All") {
                    // Navigate to full activity view
                }
                .font(.subheadline)
                .foregroundColor(.accentColor)
            }
            
            VStack(spacing: 12) {
                ForEach(dashboardManager.recentActivities.prefix(3)) { activity in
                    ActivityRowView(activity: activity)
                }
            }
        }
    }
    
    // MARK: - Job Recommendations
    private var jobRecommendationsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recommended for You")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button("See All") {
                    showingJobRecommendations = true
                }
                .font(.subheadline)
                .foregroundColor(.accentColor)
            }
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(dashboardManager.recommendedJobs.prefix(3)) { job in
                        JobRecommendationCard(job: job)
                    }
                }
                .padding(.horizontal, 1)
            }
        }
        .sheet(isPresented: $showingJobRecommendations) {
            JobRecommendationsView()
        }
    }
    
    // MARK: - Upcoming Events
    private var upcomingEventsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Upcoming Events")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                NavigationLink("View All", destination: EventsView())
                    .font(.subheadline)
                    .foregroundColor(.accentColor)
            }
            
            VStack(spacing: 8) {
                ForEach(dashboardManager.upcomingEventsList.prefix(2)) { event in
                    EventRowView(event: event)
                }
            }
        }
    }
    
    private var greetingMessage: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12:
            return "Good morning,"
        case 12..<17:
            return "Good afternoon,"
        case 17..<22:
            return "Good evening,"
        default:
            return "Welcome back,"
        }
    }
}

// MARK: - Supporting Views
struct StatCard: View {
    let title: String
    let value: String
    let subtitle: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                Spacer()
            }
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
            
            Text(title)
                .font(.headline)
                .foregroundColor(.primary)
            
            Text(subtitle)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
}

struct QuickActionCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title)
                    .foregroundColor(color)
                
                Text(title)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ActivityRowView: View {
    let activity: ActivityItem
    
    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(activity.color.opacity(0.1))
                .frame(width: 40, height: 40)
                .overlay(
                    Image(systemName: activity.icon)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(activity.color)
                )
            
            VStack(alignment: .leading, spacing: 2) {
                Text(activity.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text(activity.description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Text(activity.timeAgo)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}

struct JobRecommendationCard: View {
    let job: Job
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(job.title)
                .font(.headline)
                .fontWeight(.semibold)
                .lineLimit(2)
            
            Text(job.company)
                .font(.subheadline)
                .foregroundColor(.blue)
            
            Text(job.location)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Spacer()
            
            HStack {
                Text(job.type.rawValue)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.blue.opacity(0.1))
                    .foregroundColor(.blue)
                    .cornerRadius(8)
                
                Spacer()
            }
        }
        .padding()
        .frame(width: 200, height: 120)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
}

struct EventRowView: View {
    let event: Event
    
    var body: some View {
        HStack(spacing: 12) {
            VStack {
                Text("\(Calendar.current.component(.day, from: event.date))")
                    .font(.headline)
                    .fontWeight(.bold)
                
                Text(DateFormatter.monthFormatter.string(from: event.date))
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .frame(width: 40)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(event.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .lineLimit(1)
                
                Text(event.organizer)
                    .font(.caption)
                    .foregroundColor(.blue)
                
                Text(event.location)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - Data Models
struct ActivityItem: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let timeAgo: String
    let icon: String
    let color: Color
}

struct ActivityDataPoint: Identifiable {
    let id = UUID()
    let date: Date
    let applications: Int
}

enum TimeframeFilter: CaseIterable {
    case week, month, quarter
    
    var title: String {
        switch self {
        case .week: return "Week"
        case .month: return "Month"
        case .quarter: return "Quarter"
        }
    }
}

// MARK: - Dashboard Manager
class DashboardManager: ObservableObject {
    @Published var totalApplications = 0
    @Published var newApplicationsThisWeek = 0
    @Published var jobMatches = 0
    @Published var newMatchesToday = 0
    @Published var unreadMessages = 0
    @Published var upcomingEvents = 0
    @Published var recentActivities: [ActivityItem] = []
    @Published var recommendedJobs: [Job] = []
    @Published var upcomingEventsList: [Event] = []
    @Published var isLoading = false
    
    func loadDashboardData() {
        isLoading = true
        
        // Simulate API calls with mock data
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.totalApplications = 12
            self.newApplicationsThisWeek = 3
            self.jobMatches = 24
            self.newMatchesToday = 2
            self.unreadMessages = 5
            self.upcomingEvents = 3
            
            self.recentActivities = [
                ActivityItem(
                    title: "Applied to iOS Developer",
                    description: "at TechCorp",
                    timeAgo: "2 hours ago",
                    icon: "doc.text.fill",
                    color: .blue
                ),
                ActivityItem(
                    title: "New connection",
                    description: "with Sarah Wilson",
                    timeAgo: "1 day ago",
                    icon: "person.2.fill",
                    color: .orange
                ),
                ActivityItem(
                    title: "Registered for event",
                    description: "Career Fair 2025",
                    timeAgo: "2 days ago",
                    icon: "calendar.fill",
                    color: .purple
                )
            ]
            
            self.loadRecommendedJobs()
            self.loadUpcomingEvents()
            
            self.isLoading = false
        }
    }
    
    @MainActor
    func refreshData() async {
        isLoading = true
        
        // Simulate refresh
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        
        loadDashboardData()
    }
    
    func activityData(for timeframe: TimeframeFilter) -> [ActivityDataPoint] {
        let calendar = Calendar.current
        let now = Date()
        
        switch timeframe {
        case .week:
            return (0..<7).map { dayOffset in
                let date = calendar.date(byAdding: .day, value: -dayOffset, to: now) ?? now
                return ActivityDataPoint(date: date, applications: Int.random(in: 0...3))
            }.reversed()
            
        case .month:
            return (0..<30).compactMap { dayOffset in
                let date = calendar.date(byAdding: .day, value: -dayOffset, to: now) ?? now
                return ActivityDataPoint(date: date, applications: Int.random(in: 0...2))
            }.reversed()
            
        case .quarter:
            return (0..<90).compactMap { dayOffset in
                let date = calendar.date(byAdding: .day, value: -dayOffset, to: now) ?? now
                return ActivityDataPoint(date: date, applications: Int.random(in: 0...1))
            }.reversed()
        }
    }
    
    private func loadRecommendedJobs() {
        // Mock recommended jobs
        recommendedJobs = [
            Job(
                id: UUID().uuidString,
                title: "iOS Developer Intern",
                company: "TechStart",
                description: "Join our innovative team",
                requirements: ["Swift", "SwiftUI"],
                location: "Auckland, NZ",
                salary: "$25-30/hour",
                type: .internship,
                category: .engineering,
                postedDate: Date(),
                deadline: Calendar.current.date(byAdding: .day, value: 15, to: Date()),
                employerId: UUID().uuidString,
                isActive: true,
                benefits: ["Flexible hours"],
                experienceLevel: .entry
            )
        ]
    }
    
    private func loadUpcomingEvents() {
        // Mock upcoming events
        upcomingEventsList = [
            Event(
                id: UUID().uuidString,
                title: "Tech Career Fair",
                description: "Meet top employers",
                date: Calendar.current.date(byAdding: .day, value: 5, to: Date()) ?? Date(),
                endDate: nil,
                location: "AUT City Campus",
                organizer: "AUT Career Services",
                category: .careerFair,
                imageURL: nil,
                registrationRequired: true,
                maxAttendees: 500,
                currentAttendees: 200,
                isVirtual: false,
                meetingLink: nil
            )
        ]
    }
}

struct JobRecommendationsView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Text("Full Job Recommendations View")
                .navigationTitle("Recommended Jobs")
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

// MARK: - Extensions
extension DateFormatter {
    static let monthFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM"
        return formatter
    }()
}

#Preview {
    DashboardView()
        .environmentObject(AuthenticationManager())
        .environmentObject(JobManager())
}