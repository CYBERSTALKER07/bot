import UIKit

class HomeViewController: UIViewController {
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let welcomeLabel = UILabel()
    private let statsStackView = UIStackView()
    private let quickActionsStackView = UIStackView()
    private let recentJobsLabel = UILabel()
    private let upcomingEventsLabel = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLayout()
        loadContent()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.systemBackground
        title = "AUT Handshake"
        
        // Navigation bar styling
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationController?.navigationBar.largeTitleTextAttributes = [
            .foregroundColor: UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        ]
        
        // Welcome label
        welcomeLabel.text = "Welcome back!"
        welcomeLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        welcomeLabel.textColor = UIColor.label
        
        // Stats stack view
        statsStackView.axis = .horizontal
        statsStackView.distribution = .fillEqually
        statsStackView.spacing = 16
        
        // Quick actions stack view
        quickActionsStackView.axis = .vertical
        quickActionsStackView.spacing = 12
        
        // Section labels
        recentJobsLabel.text = "Recent Job Opportunities"
        recentJobsLabel.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        
        upcomingEventsLabel.text = "Upcoming Events"
        upcomingEventsLabel.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        
        // Scroll view setup
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        welcomeLabel.translatesAutoresizingMaskIntoConstraints = false
        statsStackView.translatesAutoresizingMaskIntoConstraints = false
        quickActionsStackView.translatesAutoresizingMaskIntoConstraints = false
        recentJobsLabel.translatesAutoresizingMaskIntoConstraints = false
        upcomingEventsLabel.translatesAutoresizingMaskIntoConstraints = false
    }
    
    private func setupLayout() {
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        contentView.addSubview(welcomeLabel)
        contentView.addSubview(statsStackView)
        contentView.addSubview(quickActionsStackView)
        contentView.addSubview(recentJobsLabel)
        contentView.addSubview(upcomingEventsLabel)
        
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
            
            welcomeLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            welcomeLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            welcomeLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            statsStackView.topAnchor.constraint(equalTo: welcomeLabel.bottomAnchor, constant: 24),
            statsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            statsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            statsStackView.heightAnchor.constraint(equalToConstant: 100),
            
            quickActionsStackView.topAnchor.constraint(equalTo: statsStackView.bottomAnchor, constant: 24),
            quickActionsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            quickActionsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            recentJobsLabel.topAnchor.constraint(equalTo: quickActionsStackView.bottomAnchor, constant: 32),
            recentJobsLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            recentJobsLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            upcomingEventsLabel.topAnchor.constraint(equalTo: recentJobsLabel.bottomAnchor, constant: 200),
            upcomingEventsLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            upcomingEventsLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            upcomingEventsLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -100)
        ])
    }
    
    private func loadContent() {
        // Add stat cards
        let jobsCard = createStatCard(title: "Active Jobs", value: "150+", color: UIColor.systemBlue)
        let eventsCard = createStatCard(title: "This Month", value: "25", color: UIColor.systemGreen)
        let connectionsCard = createStatCard(title: "Your Network", value: "89", color: UIColor.systemOrange)
        
        statsStackView.addArrangedSubview(jobsCard)
        statsStackView.addArrangedSubview(eventsCard)
        statsStackView.addArrangedSubview(connectionsCard)
        
        // Add quick action buttons
        let searchJobsButton = createQuickActionButton(title: "Search Jobs", icon: "magnifyingglass", action: #selector(searchJobsTapped))
        let browseEventsButton = createQuickActionButton(title: "Browse Events", icon: "calendar", action: #selector(browseEventsTapped))
        let updateProfileButton = createQuickActionButton(title: "Update Profile", icon: "person.circle", action: #selector(updateProfileTapped))
        
        quickActionsStackView.addArrangedSubview(searchJobsButton)
        quickActionsStackView.addArrangedSubview(browseEventsButton)
        quickActionsStackView.addArrangedSubview(updateProfileButton)
    }
    
    private func createStatCard(title: String, value: String, color: UIColor) -> UIView {
        let cardView = UIView()
        cardView.backgroundColor = color.withAlphaComponent(0.1)
        cardView.layer.cornerRadius = 12
        cardView.layer.borderWidth = 1
        cardView.layer.borderColor = color.withAlphaComponent(0.3).cgColor
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        titleLabel.textColor = color
        titleLabel.textAlignment = .center
        
        let valueLabel = UILabel()
        valueLabel.text = value
        valueLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        valueLabel.textColor = color
        valueLabel.textAlignment = .center
        
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        cardView.addSubview(titleLabel)
        cardView.addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            valueLabel.centerXAnchor.constraint(equalTo: cardView.centerXAnchor),
            valueLabel.centerYAnchor.constraint(equalTo: cardView.centerYAnchor, constant: -8),
            
            titleLabel.centerXAnchor.constraint(equalTo: cardView.centerXAnchor),
            titleLabel.topAnchor.constraint(equalTo: valueLabel.bottomAnchor, constant: 4)
        ])
        
        return cardView
    }
    
    private func createQuickActionButton(title: String, icon: String, action: Selector) -> UIButton {
        let button = UIButton(type: .system)
        button.setTitle(title, for: .normal)
        button.setImage(UIImage(systemName: icon), for: .normal)
        button.backgroundColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        button.setTitleColor(.white, for: .normal)
        button.tintColor = .white
        button.layer.cornerRadius = 12
        button.titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: .medium)
        button.addTarget(self, action: action, for: .touchUpInside)
        
        button.translatesAutoresizingMaskIntoConstraints = false
        button.heightAnchor.constraint(equalToConstant: 50).isActive = true
        
        return button
    }
    
    @objc private func searchJobsTapped() {
        tabBarController?.selectedIndex = 1 // Switch to Jobs tab
    }
    
    @objc private func browseEventsTapped() {
        tabBarController?.selectedIndex = 2 // Switch to Events tab
    }
    
    @objc private func updateProfileTapped() {
        tabBarController?.selectedIndex = 4 // Switch to Profile tab
    }
}