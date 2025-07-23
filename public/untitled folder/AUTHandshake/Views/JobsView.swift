import SwiftUI

struct JobsView: View {
    @EnvironmentObject var jobManager: JobManager
    @State private var searchText = ""
    @State private var selectedCategory: JobCategory? = nil
    @State private var selectedJobType: JobType? = nil
    @State private var showingFilters = false
    
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
            VStack {
                // Search and Filter Bar
                VStack(spacing: 12) {
                    SearchBar(text: $searchText)
                    
                    HStack {
                        Button(action: { showingFilters.toggle() }) {
                            HStack {
                                Image(systemName: "slider.horizontal.3")
                                Text("Filters")
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(Color.blue.opacity(0.1))
                            .foregroundColor(.blue)
                            .cornerRadius(20)
                        }
                        
                        if selectedCategory != nil || selectedJobType != nil {
                            Button("Clear") {
                                selectedCategory = nil
                                selectedJobType = nil
                            }
                            .foregroundColor(.red)
                        }
                        
                        Spacer()
                        
                        Text("\(filteredJobs.count) jobs")
                            .foregroundColor(.secondary)
                            .font(.caption)
                    }
                    .padding(.horizontal)
                }
                
                // Jobs List
                if jobManager.isLoading {
                    ProgressView("Loading jobs...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if filteredJobs.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "briefcase")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("No jobs found")
                            .font(.title2)
                            .foregroundColor(.secondary)
                        Text("Try adjusting your search or filters")
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(filteredJobs) { job in
                        NavigationLink(destination: JobDetailView(job: job)) {
                            JobRowView(job: job)
                        }
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Jobs")
            .onAppear {
                if jobManager.jobs.isEmpty {
                    jobManager.loadJobs()
                }
            }
            .refreshable {
                jobManager.loadJobs()
            }
            .sheet(isPresented: $showingFilters) {
                JobFiltersView(
                    selectedCategory: $selectedCategory,
                    selectedJobType: $selectedJobType
                )
            }
        }
    }
}

struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
            
            TextField("Search jobs, companies...", text: $text)
            
            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.gray)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(Color(.systemGray6))
        .cornerRadius(10)
        .padding(.horizontal)
    }
}

struct JobRowView: View {
    let job: Job
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(job.title)
                        .font(.headline)
                        .lineLimit(2)
                    
                    Text(job.company)
                        .font(.subheadline)
                        .foregroundColor(.blue)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text(job.type.rawValue)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.blue.opacity(0.1))
                        .foregroundColor(.blue)
                        .cornerRadius(12)
                    
                    Text(timeAgoString(from: job.postedDate))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            HStack {
                Image(systemName: "location")
                    .foregroundColor(.gray)
                    .font(.caption)
                Text(job.location)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                if let salary = job.salary {
                    Spacer()
                    Text(salary)
                        .font(.caption)
                        .foregroundColor(.green)
                        .fontWeight(.medium)
                }
            }
            
            Text(job.description)
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(2)
        }
        .padding(.vertical, 8)
    }
    
    private func timeAgoString(from date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.dateTimeStyle = .named
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}