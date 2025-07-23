import UIKit

class ProfileViewController: UIViewController {
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let profileImageView = UIImageView()
    private let nameLabel = UILabel()
    private let titleLabel = UILabel()
    private let companyLabel = UILabel()
    private let bioLabel = UILabel()
    private let skillsHeaderLabel = UILabel()
    private let skillsStackView = UIStackView()
    private let interestsHeaderLabel = UILabel()
    private let interestsStackView = UIStackView()
    private let editButton = UIBarButtonItem()
    private let settingsButton = UIBarButtonItem()
    
    // Sample user data (in a real app, this would come from authentication/user service)
    private let currentUser = User(
        id: "current_user",
        name: "Alex Thompson",
        email: "alex.thompson@aut.ac.nz",
        userType: .student,
        major: "Computer Science",
        graduationYear: 2025,
        bio: "Passionate computer science student interested in mobile app development and artificial intelligence. Looking to connect with industry professionals and explore internship opportunities.",
        skills: ["Swift", "Python", "JavaScript", "React", "Git", "SQL", "Machine Learning"],
        interests: ["iOS Development", "AI/ML", "Startups", "Tech Innovation", "Open Source"]
    )
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLayout()
        loadUserData()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.systemBackground
        title = "Profile"
        
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Navigation bar buttons
        editButton.image = UIImage(systemName: "pencil")
        editButton.target = self
        editButton.action = #selector(editButtonTapped)
        
        settingsButton.image = UIImage(systemName: "gearshape")
        settingsButton.target = self
        settingsButton.action = #selector(settingsButtonTapped)
        
        navigationItem.rightBarButtonItems = [settingsButton, editButton]
        
        // Profile image
        profileImageView.backgroundColor = UIColor.systemGray5
        profileImageView.layer.cornerRadius = 60
        profileImageView.clipsToBounds = true
        profileImageView.contentMode = .scaleAspectFill
        profileImageView.image = UIImage(systemName: "person.circle.fill")
        profileImageView.tintColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        
        // Labels
        nameLabel.font = UIFont.systemFont(ofSize: 28, weight: .bold)
        nameLabel.textColor = UIColor.label
        nameLabel.textAlignment = .center
        
        titleLabel.font = UIFont.systemFont(ofSize: 18, weight: .medium)
        titleLabel.textColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        titleLabel.textAlignment = .center
        
        companyLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
        companyLabel.textColor = UIColor.secondaryLabel
        companyLabel.textAlignment = .center
        
        bioLabel.font = UIFont.systemFont(ofSize: 15, weight: .regular)
        bioLabel.textColor = UIColor.label
        bioLabel.numberOfLines = 0
        bioLabel.textAlignment = .center
        
        skillsHeaderLabel.text = "Skills"
        skillsHeaderLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        skillsHeaderLabel.textColor = UIColor.label
        
        skillsStackView.axis = .vertical
        skillsStackView.spacing = 8
        skillsStackView.alignment = .leading
        
        interestsHeaderLabel.text = "Interests"
        interestsHeaderLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        interestsHeaderLabel.textColor = UIColor.label
        
        interestsStackView.axis = .vertical
        interestsStackView.spacing = 8
        interestsStackView.alignment = .leading
        
        // Scroll view setup
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        [profileImageView, nameLabel, titleLabel, companyLabel, bioLabel, skillsHeaderLabel, skillsStackView, interestsHeaderLabel, interestsStackView].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
    }
    
    private func setupLayout() {
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        contentView.addSubview(profileImageView)
        contentView.addSubview(nameLabel)
        contentView.addSubview(titleLabel)
        contentView.addSubview(companyLabel)
        contentView.addSubview(bioLabel)
        contentView.addSubview(skillsHeaderLabel)
        contentView.addSubview(skillsStackView)
        contentView.addSubview(interestsHeaderLabel)
        contentView.addSubview(interestsStackView)
        
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
            
            profileImageView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 32),
            profileImageView.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            profileImageView.widthAnchor.constraint(equalToConstant: 120),
            profileImageView.heightAnchor.constraint(equalToConstant: 120),
            
            nameLabel.topAnchor.constraint(equalTo: profileImageView.bottomAnchor, constant: 20),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            nameLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            titleLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 8),
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            companyLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            companyLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            companyLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            bioLabel.topAnchor.constraint(equalTo: companyLabel.bottomAnchor, constant: 24),
            bioLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            bioLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            skillsHeaderLabel.topAnchor.constraint(equalTo: bioLabel.bottomAnchor, constant: 32),
            skillsHeaderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            skillsHeaderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            skillsStackView.topAnchor.constraint(equalTo: skillsHeaderLabel.bottomAnchor, constant: 16),
            skillsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            skillsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            interestsHeaderLabel.topAnchor.constraint(equalTo: skillsStackView.bottomAnchor, constant: 32),
            interestsHeaderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            interestsHeaderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            interestsStackView.topAnchor.constraint(equalTo: interestsHeaderLabel.bottomAnchor, constant: 16),
            interestsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            interestsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            interestsStackView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    private func loadUserData() {
        nameLabel.text = currentUser.name
        
        switch currentUser.userType {
        case .student:
            titleLabel.text = "Student"
            companyLabel.text = "\(currentUser.major ?? ""), Class of \(currentUser.graduationYear ?? 0)"
        case .graduate:
            titleLabel.text = currentUser.position ?? "Graduate"
            companyLabel.text = currentUser.company ?? ""
        case .employer:
            titleLabel.text = currentUser.position ?? "Employer"
            companyLabel.text = currentUser.company ?? ""
        }
        
        bioLabel.text = currentUser.bio
        
        // Create skill tags
        createTagViews(for: currentUser.skills, in: skillsStackView, color: UIColor.systemBlue)
        
        // Create interest tags
        createTagViews(for: currentUser.interests, in: interestsStackView, color: UIColor.systemOrange)
    }
    
    private func createTagViews(for items: [String], in stackView: UIStackView, color: UIColor) {
        // Clear existing views
        stackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        let maxItemsPerRow = 3
        var currentRowStack: UIStackView?
        
        for (index, item) in items.enumerated() {
            if index % maxItemsPerRow == 0 {
                currentRowStack = UIStackView()
                currentRowStack?.axis = .horizontal
                currentRowStack?.spacing = 8
                currentRowStack?.alignment = .leading
                currentRowStack?.distribution = .fillProportionally
                stackView.addArrangedSubview(currentRowStack!)
            }
            
            let tagView = createTagView(text: item, color: color)
            currentRowStack?.addArrangedSubview(tagView)
        }
        
        // Add spacer to the last row if needed
        if let lastRow = stackView.arrangedSubviews.last as? UIStackView {
            let spacer = UIView()
            spacer.setContentHuggingPriority(.defaultLow, for: .horizontal)
            lastRow.addArrangedSubview(spacer)
        }
    }
    
    private func createTagView(text: String, color: UIColor) -> UIView {
        let containerView = UIView()
        containerView.backgroundColor = color.withAlphaComponent(0.1)
        containerView.layer.cornerRadius = 12
        containerView.layer.borderWidth = 1
        containerView.layer.borderColor = color.withAlphaComponent(0.3).cgColor
        
        let label = UILabel()
        label.text = text
        label.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        label.textColor = color
        label.translatesAutoresizingMaskIntoConstraints = false
        
        containerView.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 8),
            label.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            label.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12),
            label.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -8)
        ])
        
        return containerView
    }
    
    @objc private func editButtonTapped() {
        let alert = UIAlertController(title: "Edit Profile", message: "Profile editing functionality would be implemented here.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    @objc private func settingsButtonTapped() {
        let alert = UIAlertController(title: "Settings", message: "Settings menu would be implemented here.", preferredStyle: .actionSheet)
        
        alert.addAction(UIAlertAction(title: "Account Settings", style: .default))
        alert.addAction(UIAlertAction(title: "Privacy", style: .default))
        alert.addAction(UIAlertAction(title: "Notifications", style: .default))
        alert.addAction(UIAlertAction(title: "Help & Support", style: .default))
        alert.addAction(UIAlertAction(title: "Sign Out", style: .destructive))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        if let popover = alert.popoverPresentationController {
            popover.barButtonItem = settingsButton
        }
        
        present(alert, animated: true)
    }
}