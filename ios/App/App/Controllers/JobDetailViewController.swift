import UIKit

class JobDetailViewController: UIViewController {
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let job: Job
    
    private let titleLabel = UILabel()
    private let companyLabel = UILabel()
    private let locationLabel = UILabel()
    private let typeLabel = UILabel()
    private let salaryLabel = UILabel()
    private let postedLabel = UILabel()
    private let deadlineLabel = UILabel()
    private let descriptionHeaderLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let requirementsHeaderLabel = UILabel()
    private let requirementsStackView = UIStackView()
    private let benefitsHeaderLabel = UILabel()
    private let benefitsStackView = UIStackView()
    private let applyButton = UIButton(type: .system)
    
    init(job: Job) {
        self.job = job
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLayout()
        loadJobData()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.systemBackground
        title = "Job Details"
        
        // Share button
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .action,
            target: self,
            action: #selector(shareButtonTapped)
        )
        
        // Setup labels
        titleLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        titleLabel.textColor = UIColor.label
        titleLabel.numberOfLines = 0
        
        companyLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        companyLabel.textColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        
        locationLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
        locationLabel.textColor = UIColor.secondaryLabel
        
        typeLabel.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        typeLabel.textColor = UIColor.white
        typeLabel.backgroundColor = UIColor.systemBlue
        typeLabel.layer.cornerRadius = 12
        typeLabel.clipsToBounds = true
        typeLabel.textAlignment = .center
        
        salaryLabel.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        salaryLabel.textColor = UIColor.systemGreen
        
        postedLabel.font = UIFont.systemFont(ofSize: 14, weight: .regular)
        postedLabel.textColor = UIColor.tertiaryLabel
        
        deadlineLabel.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        deadlineLabel.textColor = UIColor.systemRed
        
        descriptionHeaderLabel.text = "Description"
        descriptionHeaderLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        descriptionHeaderLabel.textColor = UIColor.label
        
        descriptionLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
        descriptionLabel.textColor = UIColor.label
        descriptionLabel.numberOfLines = 0
        
        requirementsHeaderLabel.text = "Requirements"
        requirementsHeaderLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        requirementsHeaderLabel.textColor = UIColor.label
        
        requirementsStackView.axis = .vertical
        requirementsStackView.spacing = 8
        
        benefitsHeaderLabel.text = "Benefits"
        benefitsHeaderLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        benefitsHeaderLabel.textColor = UIColor.label
        
        benefitsStackView.axis = .vertical
        benefitsStackView.spacing = 8
        
        applyButton.setTitle("Apply Now", for: .normal)
        applyButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        applyButton.backgroundColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        applyButton.setTitleColor(.white, for: .normal)
        applyButton.layer.cornerRadius = 12
        applyButton.addTarget(self, action: #selector(applyButtonTapped), for: .touchUpInside)
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        [titleLabel, companyLabel, locationLabel, typeLabel, salaryLabel, postedLabel, deadlineLabel,
         descriptionHeaderLabel, descriptionLabel, requirementsHeaderLabel, requirementsStackView,
         benefitsHeaderLabel, benefitsStackView, applyButton].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
    }
    
    private func setupLayout() {
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        contentView.addSubview(titleLabel)
        contentView.addSubview(companyLabel)
        contentView.addSubview(locationLabel)
        contentView.addSubview(typeLabel)
        contentView.addSubview(salaryLabel)
        contentView.addSubview(postedLabel)
        contentView.addSubview(deadlineLabel)
        contentView.addSubview(descriptionHeaderLabel)
        contentView.addSubview(descriptionLabel)
        contentView.addSubview(requirementsHeaderLabel)
        contentView.addSubview(requirementsStackView)
        contentView.addSubview(benefitsHeaderLabel)
        contentView.addSubview(benefitsStackView)
        contentView.addSubview(applyButton)
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: typeLabel.leadingAnchor, constant: -12),
            
            typeLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            typeLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            typeLabel.widthAnchor.constraint(equalToConstant: 100),
            typeLabel.heightAnchor.constraint(equalToConstant: 32),
            
            companyLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 12),
            companyLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            companyLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            locationLabel.topAnchor.constraint(equalTo: companyLabel.bottomAnchor, constant: 8),
            locationLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            locationLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            salaryLabel.topAnchor.constraint(equalTo: locationLabel.bottomAnchor, constant: 16),
            salaryLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            salaryLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            postedLabel.topAnchor.constraint(equalTo: salaryLabel.bottomAnchor, constant: 8),
            postedLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            
            deadlineLabel.topAnchor.constraint(equalTo: salaryLabel.bottomAnchor, constant: 8),
            deadlineLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            descriptionHeaderLabel.topAnchor.constraint(equalTo: postedLabel.bottomAnchor, constant: 32),
            descriptionHeaderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionHeaderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            descriptionLabel.topAnchor.constraint(equalTo: descriptionHeaderLabel.bottomAnchor, constant: 12),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            requirementsHeaderLabel.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 32),
            requirementsHeaderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            requirementsHeaderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            requirementsStackView.topAnchor.constraint(equalTo: requirementsHeaderLabel.bottomAnchor, constant: 12),
            requirementsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            requirementsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            benefitsHeaderLabel.topAnchor.constraint(equalTo: requirementsStackView.bottomAnchor, constant: 32),
            benefitsHeaderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            benefitsHeaderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            benefitsStackView.topAnchor.constraint(equalTo: benefitsHeaderLabel.bottomAnchor, constant: 12),
            benefitsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            benefitsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            applyButton.topAnchor.constraint(equalTo: benefitsStackView.bottomAnchor, constant: 40),
            applyButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            applyButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            applyButton.heightAnchor.constraint(equalToConstant: 54),
            applyButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -40)
        ])
    }
    
    private func loadJobData() {
        titleLabel.text = job.title
        companyLabel.text = job.company
        locationLabel.text = "\(job.location) • \(job.experienceLevel.rawValue)"
        typeLabel.text = job.type.rawValue
        salaryLabel.text = job.salary ?? "Salary not specified"
        
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        postedLabel.text = "Posted: \(formatter.string(from: job.postedDate))"
        
        if let deadline = job.applicationDeadline {
            deadlineLabel.text = "Deadline: \(formatter.string(from: deadline))"
        } else {
            deadlineLabel.text = "No deadline specified"
        }
        
        descriptionLabel.text = job.description
        
        // Add requirements
        for requirement in job.requirements {
            let bulletLabel = UILabel()
            bulletLabel.text = "• \(requirement)"
            bulletLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
            bulletLabel.textColor = UIColor.label
            bulletLabel.numberOfLines = 0
            requirementsStackView.addArrangedSubview(bulletLabel)
        }
        
        // Add benefits
        for benefit in job.benefits {
            let bulletLabel = UILabel()
            bulletLabel.text = "• \(benefit)"
            bulletLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
            bulletLabel.textColor = UIColor.label
            bulletLabel.numberOfLines = 0
            benefitsStackView.addArrangedSubview(bulletLabel)
        }
        
        // Color coding for job type
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
    
    @objc private func shareButtonTapped() {
        let shareText = "Check out this job opportunity: \(job.title) at \(job.company)"
        let activityViewController = UIActivityViewController(activityItems: [shareText], applicationActivities: nil)
        
        if let popover = activityViewController.popoverPresentationController {
            popover.barButtonItem = navigationItem.rightBarButtonItem
        }
        
        present(activityViewController, animated: true)
    }
    
    @objc private func applyButtonTapped() {
        let alert = UIAlertController(
            title: "Apply for \(job.title)",
            message: "This will open your email app to send your application to \(job.contactEmail)",
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "Send Email", style: .default) { _ in
            self.openEmailApp()
        })
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        present(alert, animated: true)
    }
    
    private func openEmailApp() {
        let subject = "Application for \(job.title) position"
        let body = "Dear Hiring Manager,\n\nI am interested in applying for the \(job.title) position at \(job.company).\n\nBest regards"
        
        let emailString = "mailto:\(job.contactEmail)?subject=\(subject)&body=\(body)"
        
        if let emailURL = URL(string: emailString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""),
           UIApplication.shared.canOpenURL(emailURL) {
            UIApplication.shared.open(emailURL)
        } else {
            let alert = UIAlertController(
                title: "Email Not Available",
                message: "Please email your application to: \(job.contactEmail)",
                preferredStyle: .alert
            )
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
        }
    }
}
