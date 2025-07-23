import SwiftUI

struct CompanyProfileView: View {
    let company: Company
    @StateObject private var companyManager = CompanyManager()
    @State private var selectedTab: CompanyTab = .overview
    @State private var isFollowing = false
    @State private var showingJobApplicationSheet = false
    @State private var selectedJob: Job?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Company Header
                companyHeader
                
                // Tab Navigation
                companyTabs
                
                // Tab Content
                tabContent
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(isFollowing ? "Following" : "Follow") {
                    isFollowing.toggle()
                }
                .foregroundColor(isFollowing ? .secondary : .accentColor)
            }
        }
        .onAppear {
            companyManager.loadCompanyDetails(company.id)
        }
        .sheet(item: $selectedJob) { job in
            JobApplicationView(job: job, coverLetter: .constant("")) {
                // Handle application submission
            }
        }
    }
    
    // MARK: - Company Header
    private var companyHeader: some View {
        VStack(spacing: 20) {
            // Company Logo and Basic Info
            VStack(spacing: 16) {
                AsyncImage(url: URL(string: company.logoURL ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                } placeholder: {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.2))
                        .overlay(
                            Text(company.name.prefix(2))
                                .font(.title)
                                .fontWeight(.bold)
                                .foregroundColor(.gray)
                        )
                }
                .frame(width: 80, height: 80)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                
                VStack(spacing: 8) {
                    Text(company.name)
                        .font(.title2)
                        .fontWeight(.bold)
                        .multilineTextAlignment(.center)
                    
                    Text(company.industry)
                        .font(.subheadline)
                        .foregroundColor(.blue)
                    
                    HStack(spacing: 16) {
                        Label("\(company.employeeCount) employees", systemImage: "person.2")
                        Label(company.location, systemImage: "location")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
            }
            
            // Stats Row
            HStack(spacing: 40) {
                StatView(title: "Open Jobs", value: "\(companyManager.openJobsCount)")
                StatView(title: "Followers", value: "\(company.followerCount)")
                StatView(title: "Founded", value: "\(company.foundedYear)")
            }
        }
        .padding()
        .background(Color(.systemGray6))
    }
    
    // MARK: - Company Tabs
    private var companyTabs: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(CompanyTab.allCases, id: \.self) { tab in
                    Button(action: { selectedTab = tab }) {
                        VStack(spacing: 8) {
                            Text(tab.title)
                                .font(.subheadline)
                                .fontWeight(selectedTab == tab ? .semibold : .medium)
                                .foregroundColor(selectedTab == tab ? .accentColor : .secondary)
                            
                            Rectangle()
                                .fill(selectedTab == tab ? Color.accentColor : Color.clear)
                                .frame(height: 2)
                        }
                    }
                    .frame(minWidth: 80)
                    .padding(.horizontal, 16)
                }
            }
        }
        .padding(.top, 16)
    }
    
    // MARK: - Tab Content
    private var tabContent: some View {
        Group {
            switch selectedTab {
            case .overview:
                overviewContent
            case .jobs:
                jobsContent
            case .culture:
                cultureContent
            case .reviews:
                reviewsContent
            }
        }
        .padding()
    }
    
    // MARK: - Overview Content
    private var overviewContent: some View {
        VStack(alignment: .leading, spacing: 24) {
            // About Section
            if !company.description.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("About")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Text(company.description)
                        .font(.body)
                        .lineSpacing(4)
                }
            }
            
            // Key Information
            VStack(alignment: .leading, spacing: 16) {
                Text("Company Information")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                VStack(spacing: 12) {
                    InfoRow(title: "Industry", value: company.industry)
                    InfoRow(title: "Company Size", value: "\(company.employeeCount) employees")
                    InfoRow(title: "Headquarters", value: company.location)
                    InfoRow(title: "Founded", value: "\(company.foundedYear)")
                    
                    if let website = company.website {
                        InfoRow(title: "Website", value: website, isLink: true)
                    }
                }
            }
            
            // Specialties
            if !company.specialties.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Specialties")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                        ForEach(company.specialties, id: \.self) { specialty in
                            Text(specialty)
                                .font(.caption)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(Color.blue.opacity(0.1))
                                .foregroundColor(.blue)
                                .cornerRadius(16)
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Jobs Content
    private var jobsContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Open Positions")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Text("\(companyManager.jobs.count) jobs")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            if companyManager.isLoading {
                ProgressView("Loading jobs...")
                    .frame(maxWidth: .infinity, maxHeight: 200)
            } else if companyManager.jobs.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "briefcase")
                        .font(.system(size: 48))
                        .foregroundColor(.secondary)
                    
                    Text("No open positions")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    
                    Text("Check back later for new opportunities")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity, maxHeight: 200)
            } else {
                LazyVStack(spacing: 12) {
                    ForEach(companyManager.jobs) { job in
                        CompanyJobRowView(job: job) {
                            selectedJob = job
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Culture Content
    private var cultureContent: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Company Values
            VStack(alignment: .leading, spacing: 16) {
                Text("Our Values")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                VStack(spacing: 12) {
                    ForEach(companyManager.companyValues, id: \.title) { value in
                        ValueCard(value: value)
                    }
                }
            }
            
            // Benefits
            VStack(alignment: .leading, spacing: 16) {
                Text("Benefits & Perks")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                    ForEach(companyManager.benefits, id: \.self) { benefit in
                        BenefitCard(benefit: benefit)
                    }
                }
            }
            
            // Work Environment
            VStack(alignment: .leading, spacing: 16) {
                Text("Work Environment")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Text(companyManager.workEnvironmentDescription)
                    .font(.body)
                    .lineSpacing(4)
            }
        }
    }
    
    // MARK: - Reviews Content
    private var reviewsContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Employee Reviews")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                HStack(spacing: 4) {
                    Image(systemName: "star.fill")
                        .foregroundColor(.yellow)
                    Text("4.2")
                        .fontWeight(.semibold)
                    Text("(89 reviews)")
                        .foregroundColor(.secondary)
                }
                .font(.subheadline)
            }
            
            VStack(spacing: 16) {
                ForEach(companyManager.reviews) { review in
                    ReviewCard(review: review)
                }
            }
        }
    }
}

// MARK: - Supporting Views
struct StatView: View {
    let title: String
    let value: String
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

struct InfoRow: View {
    let title: String
    let value: String
    var isLink: Bool = false
    
    var body: some View {
        HStack {
            Text(title)
                .font(.subheadline)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(isLink ? .blue : .primary)
        }
    }
}

struct CompanyJobRowView: View {
    let job: Job
    let onApply: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(job.title)
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Text(job.location)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text(job.type.rawValue)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.blue.opacity(0.1))
                        .foregroundColor(.blue)
                        .cornerRadius(8)
                    
                    if let salary = job.salary {
                        Text(salary)
                            .font(.caption)
                            .foregroundColor(.green)
                            .fontWeight(.medium)
                    }
                }
            }
            
            Text(job.description)
                .font(.body)
                .lineLimit(2)
                .foregroundColor(.secondary)
            
            HStack {
                ForEach(job.requirements.prefix(3), id: \.self) { requirement in
                    Text(requirement)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                }
                
                Spacer()
                
                Button("Apply") {
                    onApply()
                }
                .font(.subheadline)
                .fontWeight(.semibold)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.accentColor)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct ValueCard: View {
    let value: CompanyValue
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: value.icon)
                .font(.title2)
                .foregroundColor(.accentColor)
                .frame(width: 30)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(value.title)
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Text(value.description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

struct BenefitCard: View {
    let benefit: String
    
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.green)
            
            Text(benefit)
                .font(.subheadline)
                .lineLimit(2)
            
            Spacer()
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

struct ReviewCard: View {
    let review: CompanyReview
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                HStack(spacing: 2) {
                    ForEach(0..<5) { index in
                        Image(systemName: index < review.rating ? "star.fill" : "star")
                            .foregroundColor(.yellow)
                            .font(.caption)
                    }
                }
                
                Spacer()
                
                Text(review.date, style: .date)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Text(review.title)
                .font(.headline)
                .fontWeight(.semibold)
            
            Text(review.content)
                .font(.body)
                .lineSpacing(4)
            
            HStack {
                Text(review.position)
                    .font(.caption)
                    .foregroundColor(.blue)
                
                Spacer()
                
                Text("• \(review.employmentType)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - Enums and Data Models
enum CompanyTab: CaseIterable {
    case overview, jobs, culture, reviews
    
    var title: String {
        switch self {
        case .overview: return "Overview"
        case .jobs: return "Jobs"
        case .culture: return "Culture"
        case .reviews: return "Reviews"
        }
    }
}

struct Company: Identifiable, Codable {
    let id: String
    let name: String
    let description: String
    let industry: String
    let location: String
    let employeeCount: Int
    let foundedYear: Int
    let website: String?
    let logoURL: String?
    let followerCount: Int
    let specialties: [String]
}

struct CompanyValue {
    let title: String
    let description: String
    let icon: String
}

struct CompanyReview: Identifiable {
    let id = UUID()
    let title: String
    let content: String
    let rating: Int
    let position: String
    let employmentType: String
    let date: Date
}

// MARK: - Company Manager
class CompanyManager: ObservableObject {
    @Published var jobs: [Job] = []
    @Published var companyValues: [CompanyValue] = []
    @Published var benefits: [String] = []
    @Published var reviews: [CompanyReview] = []
    @Published var workEnvironmentDescription = ""
    @Published var openJobsCount = 0
    @Published var isLoading = false
    
    func loadCompanyDetails(_ companyId: String) {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.loadMockData()
            self.isLoading = false
        }
    }
    
    private func loadMockData() {
        // Mock jobs
        jobs = [
            Job(
                id: UUID().uuidString,
                title: "Senior iOS Developer",
                company: "TechCorp",
                description: "Lead our mobile development team in creating innovative iOS applications.",
                requirements: ["Swift", "SwiftUI", "5+ years experience"],
                location: "Auckland, NZ",
                salary: "$90,000-120,000",
                type: .fullTime,
                category: .engineering,
                postedDate: Date(),
                deadline: Calendar.current.date(byAdding: .day, value: 30, to: Date()),
                employerId: UUID().uuidString,
                isActive: true,
                benefits: ["Health insurance", "Flexible hours"],
                experienceLevel: .senior
            )
        ]
        
        openJobsCount = jobs.count
        
        // Mock company values
        companyValues = [
            CompanyValue(title: "Innovation", description: "We constantly push boundaries to create cutting-edge solutions.", icon: "lightbulb.fill"),
            CompanyValue(title: "Collaboration", description: "We believe the best results come from working together.", icon: "person.2.fill"),
            CompanyValue(title: "Excellence", description: "We strive for the highest quality in everything we do.", icon: "star.fill")
        ]
        
        // Mock benefits
        benefits = [
            "Health & Dental Insurance",
            "Flexible Working Hours",
            "Remote Work Options",
            "Professional Development",
            "Gym Membership",
            "Free Lunch",
            "Stock Options",
            "Paid Time Off"
        ]
        
        // Mock reviews
        reviews = [
            CompanyReview(
                title: "Great place to grow your career",
                content: "Amazing team culture and plenty of opportunities to learn new technologies. Management is supportive and the work-life balance is excellent.",
                rating: 5,
                position: "Software Engineer",
                employmentType: "Full-time",
                date: Calendar.current.date(byAdding: .day, value: -30, to: Date()) ?? Date()
            ),
            CompanyReview(
                title: "Innovative and fast-paced environment",
                content: "Love the startup culture and the opportunity to work on cutting-edge projects. The team is very collaborative and supportive.",
                rating: 4,
                position: "Product Manager",
                employmentType: "Full-time",
                date: Calendar.current.date(byAdding: .day, value: -60, to: Date()) ?? Date()
            )
        ]
        
        workEnvironmentDescription = "Our open office environment fosters collaboration and creativity. We offer flexible working arrangements including remote work options and flexible hours to help our team maintain a healthy work-life balance."
    }
}

#Preview {
    NavigationView {
        CompanyProfileView(company: Company(
            id: "1",
            name: "TechCorp",
            description: "Leading technology company focused on innovative solutions.",
            industry: "Technology",
            location: "Auckland, New Zealand",
            employeeCount: 250,
            foundedYear: 2015,
            website: "https://techcorp.com",
            logoURL: nil,
            followerCount: 1200,
            specialties: ["iOS Development", "Web Development", "AI/ML", "Cloud Solutions"]
        ))
    }
}