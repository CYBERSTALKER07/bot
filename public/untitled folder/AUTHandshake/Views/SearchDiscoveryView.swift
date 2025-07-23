import SwiftUI

struct SearchDiscoveryView: View {
    @State private var searchText = ""
    @State private var selectedScope: SearchScope = .all
    @State private var showingFilters = false
    @State private var selectedFilters = SearchFilters()
    @StateObject private var searchManager = SearchManager()
    @State private var recentSearches: [String] = []
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search Header
                searchHeader
                
                // Content based on search state
                if searchText.isEmpty {
                    emptySearchContent
                } else {
                    searchResultsContent
                }
            }
            .navigationTitle("Discover")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingFilters = true }) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.title2)
                    }
                }
            }
        }
        .sheet(isPresented: $showingFilters) {
            SearchFiltersView(filters: $selectedFilters)
        }
        .onAppear {
            loadRecentSearches()
        }
    }
    
    // MARK: - Search Header
    private var searchHeader: some View {
        VStack(spacing: 16) {
            // Search Bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                
                TextField("Search jobs, companies, people...", text: $searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                    .onChange(of: searchText) { newValue in
                        searchManager.performSearch(query: newValue, scope: selectedScope, filters: selectedFilters)
                    }
                
                if !searchText.isEmpty {
                    Button(action: { searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
            
            // Search Scope Picker
            Picker("Search Scope", selection: $selectedScope) {
                ForEach(SearchScope.allCases, id: \.self) { scope in
                    Text(scope.title).tag(scope)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            .onChange(of: selectedScope) { _ in
                if !searchText.isEmpty {
                    searchManager.performSearch(query: searchText, scope: selectedScope, filters: selectedFilters)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
    }
    
    // MARK: - Empty Search Content
    private var emptySearchContent: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Quick Actions
                quickActionsSection
                
                // Recent Searches
                if !recentSearches.isEmpty {
                    recentSearchesSection
                }
                
                // Trending Topics
                trendingTopicsSection
                
                // Featured Companies
                featuredCompaniesSection
                
                // Career Resources
                careerResourcesSection
            }
            .padding()
        }
    }
    
    // MARK: - Search Results Content
    private var searchResultsContent: some View {
        VStack(spacing: 0) {
            // Results Summary
            if !searchManager.isLoading {
                HStack {
                    Text("\(searchManager.totalResults) results for \"\(searchText)\"")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Spacer()
                    
                    if selectedFilters.hasActiveFilters {
                        Button("Clear Filters") {
                            selectedFilters = SearchFilters()
                            searchManager.performSearch(query: searchText, scope: selectedScope, filters: selectedFilters)
                        }
                        .font(.caption)
                        .foregroundColor(.accentColor)
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 8)
            }
            
            // Results List
            if searchManager.isLoading {
                ProgressView("Searching...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List {
                    ForEach(searchManager.searchResults, id: \.id) { result in
                        SearchResultRowView(result: result)
                            .onTapGesture {
                                handleResultTap(result)
                            }
                    }
                }
                .listStyle(PlainListStyle())
            }
        }
    }
    
    // MARK: - Quick Actions Section
    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Quick Actions")
                .font(.headline)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                QuickSearchCard(
                    title: "Find Jobs",
                    subtitle: "Browse latest opportunities",
                    icon: "briefcase.fill",
                    color: .blue
                ) {
                    selectedScope = .jobs
                    searchText = ""
                }
                
                QuickSearchCard(
                    title: "Explore Companies",
                    subtitle: "Discover top employers",
                    icon: "building.2.fill",
                    color: .green
                ) {
                    selectedScope = .companies
                    searchText = ""
                }
                
                QuickSearchCard(
                    title: "Connect",
                    subtitle: "Find professionals",
                    icon: "person.2.fill",
                    color: .orange
                ) {
                    selectedScope = .people
                    searchText = ""
                }
                
                QuickSearchCard(
                    title: "Events",
                    subtitle: "Career events & workshops",
                    icon: "calendar.circle.fill",
                    color: .purple
                ) {
                    selectedScope = .events
                    searchText = ""
                }
            }
        }
    }
    
    // MARK: - Recent Searches Section
    private var recentSearchesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recent Searches")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button("Clear") {
                    recentSearches.removeAll()
                    saveRecentSearches()
                }
                .font(.caption)
                .foregroundColor(.accentColor)
            }
            
            VStack(spacing: 8) {
                ForEach(recentSearches.prefix(5), id: \.self) { search in
                    HStack {
                        Image(systemName: "clock")
                            .foregroundColor(.secondary)
                            .font(.caption)
                        
                        Text(search)
                            .font(.subheadline)
                        
                        Spacer()
                        
                        Button(action: {
                            searchText = search
                        }) {
                            Image(systemName: "arrow.up.left")
                                .font(.caption)
                                .foregroundColor(.accentColor)
                        }
                    }
                    .padding(.vertical, 4)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        searchText = search
                    }
                }
            }
        }
    }
    
    // MARK: - Trending Topics Section
    private var trendingTopicsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Trending")
                .font(.headline)
                .fontWeight(.semibold)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(searchManager.trendingTopics, id: \.self) { topic in
                        Button(action: {
                            searchText = topic
                        }) {
                            Text(topic)
                                .font(.subheadline)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color.accentColor.opacity(0.1))
                                .foregroundColor(.accentColor)
                                .cornerRadius(20)
                        }
                    }
                }
                .padding(.horizontal, 1)
            }
        }
    }
    
    // MARK: - Featured Companies Section
    private var featuredCompaniesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Featured Companies")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button("View All") {
                    selectedScope = .companies
                    searchText = ""
                }
                .font(.caption)
                .foregroundColor(.accentColor)
            }
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(searchManager.featuredCompanies) { company in
                        FeaturedCompanyCard(company: company)
                    }
                }
                .padding(.horizontal, 1)
            }
        }
    }
    
    // MARK: - Career Resources Section
    private var careerResourcesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Career Resources")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                CareerResourceCard(
                    title: "Resume Builder",
                    description: "Create a professional resume",
                    icon: "doc.text.fill",
                    color: .blue
                ) {
                    // Navigate to resume builder
                }
                
                CareerResourceCard(
                    title: "Interview Prep",
                    description: "Practice common interview questions",
                    icon: "video.fill",
                    color: .purple
                ) {
                    // Navigate to interview prep
                }
                
                CareerResourceCard(
                    title: "Salary Guide",
                    description: "Research salary ranges",
                    icon: "dollarsign.circle.fill",
                    color: .green
                ) {
                    // Navigate to salary guide
                }
            }
        }
    }
    
    // MARK: - Helper Functions
    private func handleResultTap(_ result: SearchResult) {
        // Add to recent searches
        if !recentSearches.contains(searchText) {
            recentSearches.insert(searchText, at: 0)
            if recentSearches.count > 10 {
                recentSearches = Array(recentSearches.prefix(10))
            }
            saveRecentSearches()
        }
        
        // Navigate based on result type
        switch result.type {
        case .job:
            // Navigate to job detail
            break
        case .company:
            // Navigate to company profile
            break
        case .person:
            // Navigate to user profile
            break
        case .event:
            // Navigate to event detail
            break
        }
    }
    
    private func loadRecentSearches() {
        // Load from UserDefaults or Core Data
        recentSearches = UserDefaults.standard.stringArray(forKey: "recentSearches") ?? []
    }
    
    private func saveRecentSearches() {
        UserDefaults.standard.set(recentSearches, forKey: "recentSearches")
    }
}

// MARK: - Supporting Views
struct QuickSearchCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title)
                    .foregroundColor(color)
                
                VStack(spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct FeaturedCompanyCard: View {
    let company: Company
    
    var body: some View {
        VStack(spacing: 8) {
            AsyncImage(url: URL(string: company.logoURL ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } placeholder: {
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.gray.opacity(0.2))
                    .overlay(
                        Text(company.name.prefix(1))
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.gray)
                    )
            }
            .frame(width: 50, height: 50)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            
            Text(company.name)
                .font(.headline)
                .fontWeight(.semibold)
                .lineLimit(1)
            
            Text(company.industry)
                .font(.caption)
                .foregroundColor(.blue)
            
            Text("\(searchManager.getJobCount(for: company.id)) jobs")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(width: 120)
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
}

struct CareerResourceCard: View {
    let title: String
    let description: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                    .frame(width: 30)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Text(description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(8)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct SearchResultRowView: View {
    let result: SearchResult
    
    var body: some View {
        HStack(spacing: 12) {
            // Icon based on result type
            Circle()
                .fill(result.type.color.opacity(0.1))
                .frame(width: 40, height: 40)
                .overlay(
                    Image(systemName: result.type.iconName)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(result.type.color)
                )
            
            VStack(alignment: .leading, spacing: 4) {
                Text(result.title)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .lineLimit(1)
                
                Text(result.subtitle)
                    .font(.subheadline)
                    .foregroundColor(.blue)
                    .lineLimit(1)
                
                if !result.description.isEmpty {
                    Text(result.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }
            }
            
            Spacer()
            
            if let badge = result.badge {
                Text(badge)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(result.type.color.opacity(0.1))
                    .foregroundColor(result.type.color)
                    .cornerRadius(8)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Data Models
enum SearchScope: CaseIterable {
    case all, jobs, companies, people, events
    
    var title: String {
        switch self {
        case .all: return "All"
        case .jobs: return "Jobs"
        case .companies: return "Companies"
        case .people: return "People"
        case .events: return "Events"
        }
    }
}

enum SearchResultType {
    case job, company, person, event
    
    var iconName: String {
        switch self {
        case .job: return "briefcase.fill"
        case .company: return "building.2.fill"
        case .person: return "person.fill"
        case .event: return "calendar.circle.fill"
        }
    }
    
    var color: Color {
        switch self {
        case .job: return .blue
        case .company: return .green
        case .person: return .orange
        case .event: return .purple
        }
    }
}

struct SearchResult: Identifiable {
    let id = UUID()
    let type: SearchResultType
    let title: String
    let subtitle: String
    let description: String
    let badge: String?
    let objectId: String
}

struct SearchFilters {
    var location: String = ""
    var jobType: JobType?
    var experienceLevel: ExperienceLevel?
    var salary: SalaryRange?
    var companySize: CompanySize?
    var industry: String = ""
    
    var hasActiveFilters: Bool {
        !location.isEmpty || jobType != nil || experienceLevel != nil || 
        salary != nil || companySize != nil || !industry.isEmpty
    }
}

enum SalaryRange: String, CaseIterable {
    case under30k = "Under $30k"
    case range30to50k = "$30k - $50k"
    case range50to80k = "$50k - $80k"
    case range80to120k = "$80k - $120k"
    case over120k = "Over $120k"
}

enum CompanySize: String, CaseIterable {
    case startup = "1-10 employees"
    case small = "11-50 employees"
    case medium = "51-200 employees"
    case large = "201-1000 employees"
    case enterprise = "1000+ employees"
}

// MARK: - Search Manager
class SearchManager: ObservableObject {
    @Published var searchResults: [SearchResult] = []
    @Published var totalResults = 0
    @Published var isLoading = false
    @Published var trendingTopics = ["iOS Developer", "Data Science", "Marketing", "UX Design", "Project Manager"]
    @Published var featuredCompanies: [Company] = []
    
    init() {
        loadFeaturedCompanies()
    }
    
    func performSearch(query: String, scope: SearchScope, filters: SearchFilters) {
        guard !query.isEmpty else {
            searchResults = []
            totalResults = 0
            return
        }
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.searchResults = self.generateMockResults(for: query, scope: scope, filters: filters)
            self.totalResults = self.searchResults.count
            self.isLoading = false
        }
    }
    
    func getJobCount(for companyId: String) -> Int {
        // Mock job count for company
        return Int.random(in: 1...15)
    }
    
    private func generateMockResults(for query: String, scope: SearchScope, filters: SearchFilters) -> [SearchResult] {
        var results: [SearchResult] = []
        
        // Generate mock results based on scope
        switch scope {
        case .all:
            results.append(contentsOf: generateJobResults(query: query, count: 3))
            results.append(contentsOf: generateCompanyResults(query: query, count: 2))
            results.append(contentsOf: generatePeopleResults(query: query, count: 2))
            results.append(contentsOf: generateEventResults(query: query, count: 1))
        case .jobs:
            results = generateJobResults(query: query, count: 10)
        case .companies:
            results = generateCompanyResults(query: query, count: 8)
        case .people:
            results = generatePeopleResults(query: query, count: 12)
        case .events:
            results = generateEventResults(query: query, count: 5)
        }
        
        return results
    }
    
    private func generateJobResults(query: String, count: Int) -> [SearchResult] {
        return (0..<count).map { index in
            SearchResult(
                type: .job,
                title: "\(query) Developer",
                subtitle: "TechCorp \(index + 1)",
                description: "Exciting opportunity to work with cutting-edge technology...",
                badge: "Full-time",
                objectId: "job_\(index)"
            )
        }
    }
    
    private func generateCompanyResults(query: String, count: Int) -> [SearchResult] {
        return (0..<count).map { index in
            SearchResult(
                type: .company,
                title: "\(query) Solutions Ltd",
                subtitle: "Technology",
                description: "Leading provider of innovative technology solutions...",
                badge: "\(Int.random(in: 50...500)) employees",
                objectId: "company_\(index)"
            )
        }
    }
    
    private func generatePeopleResults(query: String, count: Int) -> [SearchResult] {
        return (0..<count).map { index in
            SearchResult(
                type: .person,
                title: "John \(query)",
                subtitle: "Senior Developer at TechCorp",
                description: "Experienced iOS developer with 5+ years...",
                badge: "2nd",
                objectId: "person_\(index)"
            )
        }
    }
    
    private func generateEventResults(query: String, count: Int) -> [SearchResult] {
        return (0..<count).map { index in
            SearchResult(
                type: .event,
                title: "\(query) Career Fair",
                subtitle: "AUT Career Services",
                description: "Meet top employers and explore opportunities...",
                badge: "Tomorrow",
                objectId: "event_\(index)"
            )
        }
    }
    
    private func loadFeaturedCompanies() {
        featuredCompanies = [
            Company(
                id: "1",
                name: "TechCorp",
                description: "Leading tech company",
                industry: "Technology",
                location: "Auckland, NZ",
                employeeCount: 250,
                foundedYear: 2015,
                website: "https://techcorp.com",
                logoURL: nil,
                followerCount: 1200,
                specialties: ["iOS", "Web", "AI"]
            ),
            Company(
                id: "2",
                name: "InnovateLab",
                description: "Innovation company",
                industry: "Research",
                location: "Wellington, NZ",
                employeeCount: 100,
                foundedYear: 2018,
                website: "https://innovatelab.com",
                logoURL: nil,
                followerCount: 800,
                specialties: ["R&D", "AI", "Robotics"]
            )
        ]
    }
}

struct SearchFiltersView: View {
    @Binding var filters: SearchFilters
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Form {
                Section("Location") {
                    TextField("City or region", text: $filters.location)
                }
                
                Section("Job Details") {
                    Picker("Job Type", selection: $filters.jobType) {
                        Text("Any").tag(JobType?.none)
                        ForEach(JobType.allCases, id: \.self) { type in
                            Text(type.rawValue).tag(type as JobType?)
                        }
                    }
                    
                    Picker("Experience Level", selection: $filters.experienceLevel) {
                        Text("Any").tag(ExperienceLevel?.none)
                        ForEach(ExperienceLevel.allCases, id: \.self) { level in
                            Text(level.rawValue).tag(level as ExperienceLevel?)
                        }
                    }
                    
                    Picker("Salary Range", selection: $filters.salary) {
                        Text("Any").tag(SalaryRange?.none)
                        ForEach(SalaryRange.allCases, id: \.self) { range in
                            Text(range.rawValue).tag(range as SalaryRange?)
                        }
                    }
                }
                
                Section("Company") {
                    TextField("Industry", text: $filters.industry)
                    
                    Picker("Company Size", selection: $filters.companySize) {
                        Text("Any").tag(CompanySize?.none)
                        ForEach(CompanySize.allCases, id: \.self) { size in
                            Text(size.rawValue).tag(size as CompanySize?)
                        }
                    }
                }
            }
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Clear All") {
                        filters = SearchFilters()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    SearchDiscoveryView()
}