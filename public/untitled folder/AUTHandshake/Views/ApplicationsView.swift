import SwiftUI

struct ApplicationsView: View {
    @EnvironmentObject var jobManager: JobManager
    @State private var selectedStatus: ApplicationStatus? = nil
    
    var filteredApplications: [Application] {
        if let status = selectedStatus {
            return jobManager.applications.filter { $0.status == status }
        }
        return jobManager.applications
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Status Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: AUTDesignSystem.Spacing.md) {
                        StatusFilterChip(
                            title: "All",
                            isSelected: selectedStatus == nil,
                            count: jobManager.applications.count
                        ) {
                            selectedStatus = nil
                        }
                        
                        ForEach(ApplicationStatus.allCases, id: \.self) { status in
                            let count = jobManager.applications.filter { $0.status == status }.count
                            if count > 0 {
                                StatusFilterChip(
                                    title: status.rawValue,
                                    isSelected: selectedStatus == status,
                                    count: count
                                ) {
                                    selectedStatus = status
                                }
                            }
                        }
                    }
                    .padding(.horizontal, AUTDesignSystem.Spacing.lg)
                }
                .padding(.vertical, AUTDesignSystem.Spacing.sm)
                .background(AUTDesignSystem.Colors.Neutral.background)
                
                // Applications List
                if jobManager.isLoading {
                    AUTLoadingView()
//                } else if filteredApplications.isEmpty {
//                    AUTEmptyStateView(
//                        title: "No Applications Found",
//                        message: selectedStatus == nil ? 
//                            "Start applying to jobs to see them here" : 
//                            "No applications found with \(selectedStatus?.rawValue ?? "") status",
//                        iconName: "doc.text",
//                        actionTitle: selectedStatus == nil ? nil : "Clear Filter",
//                        action: selectedStatus == nil ? nil : { selectedStatus = nil }
//                    )
                } else {
                    List(filteredApplications) { application in
                        ApplicationRowView(application: application)
                            .listRowInsets(EdgeInsets(
                                top: AUTDesignSystem.Spacing.sm,
                                leading: AUTDesignSystem.Spacing.lg,
                                bottom: AUTDesignSystem.Spacing.sm,
                                trailing: AUTDesignSystem.Spacing.lg
                            ))
                            .listRowSeparator(.hidden)
                    }
                    .listStyle(PlainListStyle())
                    .background(AUTDesignSystem.Colors.Neutral.background)
                }
            }
            .navigationTitle("Applications")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                if jobManager.applications.isEmpty {
                    jobManager.loadApplications()
                }
            }
            .refreshable {
                jobManager.loadApplications()
            }
        }
    }
}

struct StatusFilterChip: View {
    let title: String
    let isSelected: Bool
    let count: Int
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: AUTDesignSystem.Spacing.xs) {
                Text(title)
                    .font(AUTDesignSystem.Typography.badgeText)
                    .fontWeight(.semibold)
                
                Text("(\(count))")
                    .font(AUTDesignSystem.Typography.caption)
            }
            .padding(.horizontal, AUTDesignSystem.Spacing.md)
            .padding(.vertical, AUTDesignSystem.Spacing.sm)
            .background(
                isSelected ? 
                AUTDesignSystem.Colors.Primary.primary : 
                AUTDesignSystem.Colors.Neutral.mutedBackground
            )
            .foregroundColor(
                isSelected ? 
                AUTDesignSystem.Colors.Primary.primaryForeground : 
                AUTDesignSystem.Colors.Neutral.foreground
            )
            .cornerRadius(AUTDesignSystem.CornerRadius.round)
            .shadow(
                color: isSelected ? AUTDesignSystem.Shadow.light : Color.clear,
                radius: 2,
                x: 0,
                y: 1
            )
        }
        .scaleEffect(isSelected ? 1.02 : 1.0)
        .animation(AUTDesignSystem.Animation.quick, value: isSelected)
    }
}

struct ApplicationRowView: View {
    let application: Application
    
    var body: some View {
        AUTCard {
            VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.md) {
                HStack {
                    VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
                        Text("Job Application")
                            .font(AUTDesignSystem.Typography.cardTitle)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                        
                        Text("Applied \(application.appliedDate, style: .date)")
                            .font(AUTDesignSystem.Typography.caption)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.muted)
                    }
                    
                    Spacer()
                    
                    AUTStatusBadge(status: application.status)
                }
                
                if let coverLetter = application.coverLetter, !coverLetter.isEmpty {
                    HStack(spacing: AUTDesignSystem.Spacing.xs) {
                        Image(systemName: "doc.text.fill")
                            .font(.caption)
                            .foregroundColor(AUTDesignSystem.Colors.Secondary.secondary)
                        
                        Text("Cover letter submitted")
                            .font(AUTDesignSystem.Typography.caption)
                            .foregroundColor(AUTDesignSystem.Colors.Secondary.secondary)
                    }
                }
                
                if let feedback = application.feedback {
                    VStack(alignment: .leading, spacing: AUTDesignSystem.Spacing.xs) {
                        Text("Feedback:")
                            .font(AUTDesignSystem.Typography.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.foreground)
                        
                        Text(feedback)
                            .font(AUTDesignSystem.Typography.caption)
                            .foregroundColor(AUTDesignSystem.Colors.Neutral.muted)
                            .lineLimit(3)
                    }
                    .padding(.top, AUTDesignSystem.Spacing.xs)
                }
            }
            .padding(AUTDesignSystem.Spacing.lg)
        }
    }
}

// Remove the old StatusBadge since we're now using AUTStatusBadge from DesignSystem
