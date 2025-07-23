import UIKit

class JobsViewController: UIViewController {
    
    private let searchController = UISearchController(searchResultsController: nil)
    private let tableView = UITableView()
    private let filterButton = UIBarButtonItem()
    
    private var jobs: [Job] = []
    private var filteredJobs: [Job] = []
    private var selectedJobTypes: Set<Job.JobType> = Set(Job.JobType.allCases)
    private var selectedExperienceLevels: Set<Job.ExperienceLevel> = Set(Job.ExperienceLevel.allCases)
    
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
            Job(
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
            Job(
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
            Job(
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
        
        for jobType in Job.JobType.allCases {
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
        
        for level in Job.ExperienceLevel.allCases {
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
        selectedJobTypes = Set(Job.JobType.allCases)
        selectedExperienceLevels = Set(Job.ExperienceLevel.allCases)
        searchController.searchBar.text = ""
        filterJobs()
    }
}

extension JobsViewController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) {
        filterJobs()
    }
}

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

// MARK: - JobTableViewCell
class JobTableViewCell: UITableViewCell {
    
    private let cardView = UIView()
    private let titleLabel = UILabel()
    private let companyLabel = UILabel()
    private let locationLabel = UILabel()
    private let typeLabel = UILabel()
    private let salaryLabel = UILabel()
    private let postedLabel = UILabel()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        backgroundColor = UIColor.clear
        selectionStyle = .none
        
        cardView.backgroundColor = UIColor.systemBackground
        cardView.layer.cornerRadius = 12
        cardView.layer.shadowColor = UIColor.black.cgColor
        cardView.layer.shadowOpacity = 0.1
        cardView.layer.shadowOffset = CGSize(width: 0, height: 2)
        cardView.layer.shadowRadius = 4
        
        titleLabel.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        titleLabel.textColor = UIColor.label
        
        companyLabel.font = UIFont.systemFont(ofSize: 16, weight: .medium)
        companyLabel.textColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        
        locationLabel.font = UIFont.systemFont(ofSize: 14, weight: .regular)
        locationLabel.textColor = UIColor.secondaryLabel
        
        typeLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        typeLabel.textColor = UIColor.white
        typeLabel.backgroundColor = UIColor.systemBlue
        typeLabel.layer.cornerRadius = 8
        typeLabel.clipsToBounds = true
        typeLabel.textAlignment = .center
        
        salaryLabel.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        salaryLabel.textColor = UIColor.systemGreen
        
        postedLabel.font = UIFont.systemFont(ofSize: 12, weight: .regular)
        postedLabel.textColor = UIColor.tertiaryLabel
        
        [cardView, titleLabel, companyLabel, locationLabel, typeLabel, salaryLabel, postedLabel].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
        
        contentView.addSubview(cardView)
        cardView.addSubview(titleLabel)
        cardView.addSubview(companyLabel)
        cardView.addSubview(locationLabel)
        cardView.addSubview(typeLabel)
        cardView.addSubview(salaryLabel)
        cardView.addSubview(postedLabel)
        
        NSLayoutConstraint.activate([
            cardView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            cardView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            cardView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            cardView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            titleLabel.topAnchor.constraint(equalTo: cardView.topAnchor, constant: 16),
            titleLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(equalTo: typeLabel.leadingAnchor, constant: -8),
            
            typeLabel.topAnchor.constraint(equalTo: cardView.topAnchor, constant: 16),
            typeLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            typeLabel.widthAnchor.constraint(equalToConstant: 80),
            typeLabel.heightAnchor.constraint(equalToConstant: 24),
            
            companyLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            companyLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            companyLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            
            locationLabel.topAnchor.constraint(equalTo: companyLabel.bottomAnchor, constant: 4),
            locationLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            locationLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            
            salaryLabel.topAnchor.constraint(equalTo: locationLabel.bottomAnchor, constant: 8),
            salaryLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            
            postedLabel.topAnchor.constraint(equalTo: locationLabel.bottomAnchor, constant: 8),
            postedLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            postedLabel.bottomAnchor.constraint(equalTo: cardView.bottomAnchor, constant: -16)
        ])
    }
    
    func configure(with job: Job) {
        titleLabel.text = job.title
        companyLabel.text = job.company
        locationLabel.text = "\(job.location) • \(job.experienceLevel.rawValue)"
        typeLabel.text = job.type.rawValue
        salaryLabel.text = job.salary ?? "Salary not specified"
        
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        postedLabel.text = "Posted \(formatter.string(from: job.postedDate))"
        
        // Color coding for job types
        switch job.type {
        case .fullTime:
            typeLabel.backgroundColor = UIColor.systemBlue
        case .partTime:
            typeLabel.backgroundColor = UIColor.systemOrange
        case .internship:
            typeLabel.backgroundColor = UIColor.systemPurple
        case .contract:
            typeLabel.backgroundColor = UIColor.systemTeal
        case .graduate:
            typeLabel.backgroundColor = UIColor.systemGreen
        }
    }
}