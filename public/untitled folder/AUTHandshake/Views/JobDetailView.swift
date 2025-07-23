import SwiftUI

struct JobDetailView: View {
    let job: Job
    @EnvironmentObject var jobManager: JobManager
    @State private var showingApplicationSheet = false
    @State private var coverLetter = ""
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header Section
                VStack(alignment: .leading, spacing: 12) {
                    Text(job.title)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text(job.company)
                        .font(.title2)
                        .foregroundColor(.blue)
                    
                    HStack {
                        Label(job.location, systemImage: "location")
                        Spacer()
                        if let salary = job.salary {
                            Text(salary)
                                .font(.headline)
                                .foregroundColor(.green)
                        }
                    }
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                
                // Job Type and Category Tags
                HStack {
                    JobTagView(text: job.type.rawValue, color: .blue)
                    JobTagView(text: job.category.rawValue, color: .orange)
                    JobTagView(text: job.experienceLevel.rawValue, color: .purple)
                    Spacer()
                }
                .padding(.horizontal)
                
                Divider()
                
                // Job Description
                VStack(alignment: .leading, spacing: 12) {
                    Text("Description")
                        .font(.headline)
                    
                    Text(job.description)
                        .font(.body)
                        .lineSpacing(4)
                }
                .padding(.horizontal)
                
                // Requirements
                if !job.requirements.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Requirements")
                            .font(.headline)
                        
                        ForEach(job.requirements, id: \.self) { requirement in
                            HStack(alignment: .top) {
                                Text("•")
                                    .foregroundColor(.blue)
                                Text(requirement)
                                Spacer()
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Benefits
                if let benefits = job.benefits, !benefits.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Benefits")
                            .font(.headline)
                        
                        ForEach(benefits, id: \.self) { benefit in
                            HStack(alignment: .top) {
                                Text("✓")
                                    .foregroundColor(.green)
                                Text(benefit)
                                Spacer()
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Deadline
                if let deadline = job.deadline {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Application Deadline")
                            .font(.headline)
                        
                        Text(deadline, style: .date)
                            .foregroundColor(deadline < Date() ? .red : .secondary)
                    }
                    .padding(.horizontal)
                }
                
                Spacer(minLength: 100)
            }
            .padding(.vertical)
        }
        .navigationBarTitleDisplayMode(.inline)
        .safeAreaInset(edge: .bottom) {
            // Apply Button
            Button(action: { showingApplicationSheet = true }) {
                Text("Apply Now")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .padding()
            .background(.ultraThinMaterial)
        }
        .sheet(isPresented: $showingApplicationSheet) {
            JobApplicationView(job: job, coverLetter: $coverLetter) {
                jobManager.applyToJob(job, coverLetter: coverLetter.isEmpty ? nil : coverLetter)
                showingApplicationSheet = false
            }
        }
    }
}

struct JobTagView: View {
    let text: String
    let color: Color
    
    var body: some View {
        Text(text)
            .font(.caption)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(color.opacity(0.1))
            .foregroundColor(color)
            .cornerRadius(16)
    }
}

struct JobApplicationView: View {
    let job: Job
    @Binding var coverLetter: String
    let onSubmit: () -> Void
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Applying for")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Text(job.title)
                        .font(.title2)
                        .fontWeight(.semibold)
                    
                    Text("at \(job.company)")
                        .foregroundColor(.blue)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Cover Letter (Optional)")
                        .font(.headline)
                    
                    TextEditor(text: $coverLetter)
                        .frame(minHeight: 200)
                        .padding(12)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                }
                
                Spacer()
                
                Button(action: onSubmit) {
                    Text("Submit Application")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
            }
            .padding()
            .navigationTitle("Apply")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct JobFiltersView: View {
    @Binding var selectedCategory: JobCategory?
    @Binding var selectedJobType: JobType?
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section("Job Category") {
                    ForEach(JobCategory.allCases, id: \.self) { category in
                        HStack {
                            Text(category.rawValue)
                            Spacer()
                            if selectedCategory == category {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.blue)
                            }
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedCategory = selectedCategory == category ? nil : category
                        }
                    }
                }
                
                Section("Job Type") {
                    ForEach(JobType.allCases, id: \.self) { jobType in
                        HStack {
                            Text(jobType.rawValue)
                            Spacer()
                            if selectedJobType == jobType {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.blue)
                            }
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedJobType = selectedJobType == jobType ? nil : jobType
                        }
                    }
                }
            }
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Done") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Clear All") {
                        selectedCategory = nil
                        selectedJobType = nil
                    }
                }
            }
        }
    }
}