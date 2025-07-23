import UIKit
import Foundation

// MARK: - JobsViewController

class JobsViewController: UIViewController {
    
    private let searchController = UISearchController(searchResultsController: nil)
    private let tableView = UITableView()
    private let filterButton = UIBarButtonItem()
    
    private var jobs: [JobListing] = []
    private var filteredJobs: [JobListing] = []
    private var selectedJobTypes: Set<JobListing.JobType> = Set(JobListing.JobType.allCases)
    private var selectedExperienceLevels: Set<JobListing.ExperienceLevel> = Set(JobListing.ExperienceLevel.allCases)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupSearchController()
        setupTableView()
        loadSampleJobs()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.systemBackground
        title = "Job Opportunities"
        
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Filter button
        filterButton.image = UIImage(systemName: "line.3.horizontal.decrease.circle")
        filterButton.target = self
        filterButton.action = #selector(filterButtonTapped)
        navigationItem.rightBarButtonItem = filterButton
    }
    
    private func setupSearchController() {
        searchController.searchResultsUpdater = self
        searchController.obscuresBackgroundDuringPresentation = false
        searchController.searchBar.placeholder = "Search jobs, companies, skills..."
        navigationItem.searchController = searchController
        definesPresentationContext = true
    }
    
    private func setupTableView() {
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(JobTableViewCell.self, forCellReuseIdentifier: "JobCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = UIColor.systemBackground
        
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func loadSampleJobs() {
        jobs = [
            JobListing(
                id: "1",
                title: "iOS Developer",
                company: "Tech Solutions Ltd",
                location: "Auckland, NZ",
                type: .fullTime,
                description: "We're looking for a passionate iOS developer to join our growing team...",
                requirements: ["Swift", "UIKit", "Core Data", "Git"],
                salary: "$70,000 - $90,000",
                postedDate: Date(),
                applicationDeadline: Calendar.current.date(byAdding: .day, value: 30, to: Date()),
                contactEmail: "careers@techsolutions.co.nz",
                isRemote: false,
                experienceLevel: .junior,
                benefits: ["Health Insurance", "Flexible Hours", "Professional Development"]
            ),
            JobListing(
                id: "2",
                title: "Graduate Software Engineer",
                company: "Innovation Corp",
                location: "Wellington, NZ",
                type: .graduate,
                description: "Join our graduate program and kickstart your career in software development...",
                requirements: ["Programming fundamentals", "Problem solving", "Team collaboration"],
                salary: "$55,000 - $65,000",
                postedDate: Calendar.current.date(byAdding: .day, value: -2, to: Date()) ?? Date(),
                applicationDeadline: Calendar.current.date(byAdding: .day, value: 45, to: Date()),
                contactEmail: "graduates@innovationcorp.co.nz",
                isRemote: true,
                experienceLevel: .entry,
                benefits: ["Mentorship Program", "Training Budget", "Remote Work"]
            ),
            JobListing(
                id: "3",
                title: "UX/UI Designer Intern",
                company: "Creative Agency",
                location: "Auckland, NZ",
                type: .internship,
                description: "Summer internship opportunity for design students...",
                requirements: ["Figma", "Adobe Creative Suite", "Design thinking"],
                salary: "$25/hour",
                postedDate: Calendar.current.date(byAdding: .day, value: -5, to: Date()) ?? Date(),
                applicationDeadline: Calendar.current.date(byAdding: .day, value: 20, to: Date()),
                contactEmail: "internships@creativeagency.co.nz",
                isRemote: false,
                experienceLevel: .entry,
                benefits: ["Portfolio Development", "Industry Exposure", "Networking"]
            )
        ]
        
        filteredJobs = jobs
        tableView.reloadData()
    }
    
    private func filterJobs() {
        let searchText = searchController.searchBar.text?.lowercased() ?? ""
        
        filteredJobs = jobs.filter { job in
            let matchesSearch = searchText.isEmpty ||
                job.title.lowercased().contains(searchText) ||
                job.company.lowercased().contains(searchText) ||
                job.requirements.joined(separator: " ").lowercased().contains(searchText)
            
            let matchesJobType = selectedJobTypes.contains(job.type)
            let matchesExperience = selectedExperienceLevels.contains(job.experienceLevel)
            
            return matchesSearch && matchesJobType && matchesExperience
        }
        
        tableView.reloadData()
    }
    
    @objc private func filterButtonTapped() {
        let alert = UIAlertController(title: "Filter Jobs", message: nil, preferredStyle: .actionSheet)
        
        alert.addAction(UIAlertAction(title: "Job Types", style: .default) { _ in
            self.showJobTypeFilter()
        })
        
        alert.addAction(UIAlertAction(title: "Experience Level", style: .default) { _ in
            self.showExperienceLevelFilter()
        })
        
        alert.addAction(UIAlertAction(title: "Reset Filters", style: .destructive) { _ in
            self.resetFilters()
        })
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        if let popover = alert.popoverPresentationController {
            popover.barButtonItem = filterButton
        }
        
        present(alert, animated: true)
    }
    
    private func showJobTypeFilter() {
        let alert = UIAlertController(title: "Select Job Types", message: nil, preferredStyle: .actionSheet)
        
        for jobType in JobListing.JobType.allCases {
            let isSelected = selectedJobTypes.contains(jobType)
            let action = UIAlertAction(title: "\(isSelected ? "✓ " : "")\(jobType.rawValue)", style: .default) { _ in
                if isSelected {
                    self.selectedJobTypes.remove(jobType)
                } else {
                    self.selectedJobTypes.insert(jobType)
                }
                self.filterJobs()
            }
            alert.addAction(action)
        }
        
        alert.addAction(UIAlertAction(title: "Done", style: .cancel))
        
        if let popover = alert.popoverPresentationController {
            popover.barButtonItem = filterButton
        }
        
        present(alert, animated: true)
    }
    
    private func showExperienceLevelFilter() {
        let alert = UIAlertController(title: "Select Experience Levels", message: nil, preferredStyle: .actionSheet)
        
        for level in JobListing.ExperienceLevel.allCases {
            let isSelected = selectedExperienceLevels.contains(level)
            let action = UIAlertAction(title: "\(isSelected ? "✓ " : "")\(level.rawValue)", style: .default) { _ in
                if isSelected {
                    self.selectedExperienceLevels.remove(level)
                } else {
                    self.selectedExperienceLevels.insert(level)
                }
                self.filterJobs()
            }
            alert.addAction(action)
        }
        
        alert.addAction(UIAlertAction(title: "Done", style: .cancel))
        
        if let popover = alert.popoverPresentationController {
            popover.barButtonItem = filterButton
        }
        
        present(alert, animated: true)
    }
    
    private func resetFilters() {
        selectedJobTypes = Set(JobListing.JobType.allCases)
        selectedExperienceLevels = Set(JobListing.ExperienceLevel.allCases)
        searchController.searchBar.text = ""
        filterJobs()
    }
}

// MARK: - Search Results Updating
extension JobsViewController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) {
        filterJobs()
    }
}

// MARK: - Table View Data Source & Delegate
extension JobsViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredJobs.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "JobCell", for: indexPath) as! JobTableViewCell
        cell.configure(with: filteredJobs[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let job = filteredJobs[indexPath.row]
        let detailVC = JobDetailViewController(job: job)
        navigationController?.pushViewController(detailVC, animated: true)
    }
}