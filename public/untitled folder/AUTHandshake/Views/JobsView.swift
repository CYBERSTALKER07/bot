import SwiftUI

struct JobsView: View {
    @EnvironmentObject var jobManager: JobManager
    @State private var searchText = ""
    @State private var selectedCategory: JobCategory? = nil
    @State private var selectedJobType: JobType? = nil
    @State private var showingFilters = false
    @State private var showingJobDetail = false
    @State private var selectedJob: Job? = nil
    
    var filteredJobs: [Job] {
        var jobs = jobManager.jobs
        
        if !searchText.isEmpty {
            jobs = jobs.filter { job in
                job.title.localizedCaseInsensitiveContains(searchText) ||
                job.company.localizedCaseInsensitiveContains(searchText) ||
                job.description.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        if let category = selectedCategory {
            jobs = jobs.filter { $0.category == category }
        }
        
        if let jobType = selectedJobType {
            jobs = jobs.filter { $0.type == jobType }
        }
        
        return jobs.sorted { $0.postedDate > $1.postedDate }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [
                        AUTDesignSystem.Colors.Neutral.gray50,
                        AUTDesignSystem.Colors.Neutral.background
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header Section
                    VStack(spacing: AUTDesignSystem.Spacing.lg) {
                        // Welcome Header
                        HStack {
                            VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
                                Text("Find Your Dream Job")
                                    .font(AUTDesignSystem.Typography.headlineSmall)
                                    .fontWeight(.bold)
                                    .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                                
                                Text("\(filteredJobs.count) opportunities waiting for you")
                                    .font(AUTDesignSystem.Typography.bodyMedium)
                                    .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                            }
                            
                            Spacer()
                            
                            Button(action: { showingFilters = true }) {
                                Image(systemName: "slider.horizontal.3")
                                    .font(.system(size: 20, weight: .medium))
                                    .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                                    .frame(width: 44, height: 44)
                                    .background(AUTDesignSystem.Colors.Primary.primaryContainer)
                                    .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                                    .shadow(
                                        color: AUTDesignSystem.Colors.Primary.primary.opacity(0.2),
                                        radius: 4,
                                        x: 0,
                                        y: 2
                                    )
                            }
                        }
                        .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                        
                        // Enhanced Search Bar
                        AUTSearchBar(
                            text: $searchText,
                            placeholder: "Search jobs, companies, skills...",
                            showFilters: false
                        )
                        .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                        
                        // Filter Chips
                        if selectedCategory != nil || selectedJobType != nil {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: AUTDesignSystem.Spacing.sm) {
                                    if let category = selectedCategory {
                                        AUTChip(
                                            title: category.rawValue,
                                            isSelected: true,
                                            showCloseButton: true,
                                            leadingIcon: "briefcase",
                                            action: {},
                                            onClose: { selectedCategory = nil }
                                        )
                                    }
                                    
                                    if let jobType = selectedJobType {
                                        AUTChip(
                                            title: jobType.rawValue,
                                            isSelected: true,
                                            showCloseButton: true,
                                            leadingIcon: "clock",
                                            action: {},
                                            onClose: { selectedJobType = nil }
                                        )
                                    }
                                }
                                .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                            }
                        }
                    }
                    .padding(.top, AUTDesignSystem.Spacing.sm)
                    .padding(.bottom, AUTDesignSystem.Spacing.md)
                    
                    // Jobs List
                    if jobManager.isLoading {
                        Spacer()
                        VStack(spacing: AUTDesignSystem.Spacing.lg) {
                            ProgressView()
                                .scaleEffect(1.2)
                                .tint(AUTDesignSystem.Colors.Primary.primary)
                            
                            Text("Finding the best opportunities...")
                                .font(AUTDesignSystem.Typography.bodyMedium)
                                .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                        }
                        Spacer()
                    } else if filteredJobs.isEmpty {
                        Spacer()
                        AUTEmptyState(
                            title: "No Jobs Found",
                            message: "Try adjusting your search criteria or check back later for new opportunities",
                            systemImage: "briefcase.badge.plus",
                            actionTitle: "Clear Filters",
                            action: {
                                selectedCategory = nil
                                selectedJobType = nil
                                searchText = ""
                            }
                        )
                        Spacer()
                    } else {
                        LazyVStack(spacing: AUTDesignSystem.Spacing.md) {
                            ForEach(filteredJobs) { job in
                                JobCard(job: job) {
                                    selectedJob = job
                                    showingJobDetail = true
                                }
                                .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                            }
                        }
                        .padding(.top, AUTDesignSystem.Spacing.sm)
                    }
                    
                    Spacer()
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showingFilters) {
                JobFiltersView(
                    selectedCategory: $selectedCategory,
                    selectedJobType: $selectedJobType
                )
            }
            .sheet(isPresented: $showingJobDetail) {
                if let job = selectedJob {
                    JobDetailView(job: job)
                }
            }
        }
        .onAppear {
            jobManager.loadJobs()
        }
    }
}

// MARK: - Enhanced Job Card Component
struct JobCard: View {
    let job: Job
    let action: () -> Void
    @State private var isPressed = false
    
    var body: some View {
        Button(action: action) {
            AUTMaterialCard(elevation: isPressed ? 1 : 2) {
                VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.lg) {
                    // Header Row
                    HStack(alignment: .top, spacing: AUTDesignSystem.Spacing.md) {
                        // Company Logo Placeholder
                        RoundedRectangle(cornerRadius: AUTDesignSystem.CornerRadius.lg)
                            .fill(
                                LinearGradient(
                                    colors: [
                                        AUTDesignSystem.Colors.Primary.primaryContainer,
                                        AUTDesignSystem.Colors.Secondary.secondaryContainer
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 60, height: 60)
                            .overlay(
                                Text(String(job.company.prefix(1)))
                                    .font(AUTDesignSystem.Typography.titleLarge)
                                    .fontWeight(.bold)
                                    .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                            )
                        
                        // Job Info
                        VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
                            Text(job.title)
                                .font(AUTDesignSystem.Typography.titleMedium)
                                .fontWeight(.semibold)
                                .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                                .lineLimit(2)
                                .multilineTextAlignment(.leading)
                            
                            Text(job.company)
                                .font(AUTDesignSystem.Typography.bodyMedium)
                                .foregroundColor(AUTDesignSystem.Colors.Primary.primary)
                                .fontWeight(.medium)
                        }
                        
                        Spacer()
                        
                        // Job Type Badge
                        Text(job.type.rawValue)
                            .font(AUTDesignSystem.Typography.labelSmall)
                            .fontWeight(.medium)
                            .padding(.horizontal, AUTDesignSystem.Spacing.sm)
                            .padding(.vertical, AUTDesignSystem.Spacing.xs)
                            .background(jobTypeBadgeColor.opacity(0.15))
                            .foregroundColor(jobTypeBadgeColor)
                            .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                    }
                    
                    // Job Description
                    Text(job.description)
                        .font(AUTDesignSystem.Typography.bodyMedium)
                        .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                        .lineLimit(3)
                        .multilineTextAlignment(.leading)
                    
                    // Job Details Row
                    HStack(spacing: AUTDesignSystem.Spacing.lg) {
                        // Location
                        Label {
                            Text(job.location)
                                .font(AUTDesignSystem.Typography.bodySmall)
                                .foregroundColor(AUTDesignSystem.Colors.Neutral.gray600)
                        } icon: {
                            Image(systemName: "location")
                                .font(.system(size: 12))
                                .foregroundColor(AUTDesignSystem.Colors.Neutral.gray500)
                        }
                        
                        // Salary (if available)
                        if let salary = job.salary {
                            Label {
                                Text(salary)
                                    .font(AUTDesignSystem.Typography.bodySmall)
                                    .fontWeight(.semibold)
                                    .foregroundColor(AUTDesignSystem.Colors.Semantic.success)
                            } icon: {
                                Image(systemName: "dollarsign.circle")
                                    .font(.system(size: 12))
                                    .foregroundColor(AUTDesignSystem.Colors.Semantic.success)
                            }
                        }
                        
                        Spacer()
                        
                        // Posted Date
                        Text(timeAgoString(from: job.postedDate))
                            .font(AUTDesignSystem.Typography.labelSmall)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.gray500)
                    }
                    
                    // Action Row
                    HStack {
                        // Apply Button
                        HStack(spacing: AUTDesignSystem.Spacing.xs) {
                            Image(systemName: "paperplane.fill")
                                .font(.system(size: 14))
                            Text("Quick Apply")
                                .font(AUTDesignSystem.Typography.labelMedium)
                                .fontWeight(.semibold)
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                        .padding(.vertical, AUTDesignSystem.Spacing.sm)
                        .background(AUTDesignSystem.Colors.Primary.primary)
                        .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                        
                        Spacer()
                        
                        // Bookmark Button
                        Button(action: {}) {
                            Image(systemName: "bookmark")
                                .font(.system(size: 18))
                                .foregroundColor(AUTDesignSystem.Colors.Neutral.gray500)
                                .frame(width: 40, height: 40)
                                .background(AUTDesignSystem.Colors.Neutral.surfaceVariant)
                                .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                        }
                        
                        // Share Button
                        Button(action: {}) {
                            Image(systemName: "square.and.arrow.up")
                                .font(.system(size: 18))
                                .foregroundColor(AUTDesignSystem.Colors.Neutral.gray500)
                                .frame(width: 40, height: 40)
                                .background(AUTDesignSystem.Colors.Neutral.surfaceVariant)
                                .cornerRadius(AUTDesignSystem.CornerRadius.lg)
                        }
                    }
                }
                .padding(AUTDesignSystem.Spacing.xl)
            }
        }
        .buttonStyle(PlainButtonStyle())
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .onLongPressGesture(minimumDuration: 0) {
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = true
            }
        } onPressingChanged: { pressing in
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = pressing
            }
        }
    }
    
    private var jobTypeBadgeColor: Color {
        switch job.type {
        case .fullTime:
            return AUTDesignSystem.Colors.Primary.primary
        case .partTime:
            return AUTDesignSystem.Colors.Secondary.secondary600
        case .internship:
            return AUTDesignSystem.Colors.Semantic.info
        case .contract:
            return AUTDesignSystem.Colors.Semantic.warning
        case .coop:
            return AUTDesignSystem.Colors.Semantic.success
        }
    }
    
    private func timeAgoString(from date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.dateTimeStyle = .named
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}
