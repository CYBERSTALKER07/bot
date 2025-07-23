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
            VStack {
                // Status Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
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
                    .padding(.horizontal)
                }
                .padding(.vertical, 8)
                
                // Applications List
                if jobManager.isLoading {
                    ProgressView("Loading applications...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if filteredApplications.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "doc.text")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("No applications found")
                            .font(.title2)
                            .foregroundColor(.secondary)
                        Text("Start applying to jobs to see them here")
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(filteredApplications) { application in
                        ApplicationRowView(application: application)
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Applications")
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
            HStack(spacing: 4) {
                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
                
                Text("(\(count))")
                    .font(.caption)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(isSelected ? Color.blue : Color(.systemGray6))
            .foregroundColor(isSelected ? .white : .primary)
            .cornerRadius(16)
        }
    }
}

struct ApplicationRowView: View {
    let application: Application
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Job Application")
                        .font(.headline)
                    
                    Text("Applied \(application.appliedDate, style: .date)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                StatusBadge(status: application.status)
            }
            
            if let coverLetter = application.coverLetter, !coverLetter.isEmpty {
                Text("Cover letter submitted")
                    .font(.caption)
                    .foregroundColor(.blue)
            }
            
            if let feedback = application.feedback {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Feedback:")
                        .font(.caption)
                        .fontWeight(.medium)
                    Text(feedback)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 4)
            }
        }
        .padding(.vertical, 8)
    }
}

struct StatusBadge: View {
    let status: ApplicationStatus
    
    var statusColor: Color {
        switch status {
        case .submitted:
            return .blue
        case .reviewed:
            return .orange
        case .interview:
            return .purple
        case .accepted:
            return .green
        case .rejected:
            return .red
        case .withdrawn:
            return .gray
        }
    }
    
    var body: some View {
        Text(status.rawValue)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(statusColor.opacity(0.1))
            .foregroundColor(statusColor)
            .cornerRadius(12)
    }
}