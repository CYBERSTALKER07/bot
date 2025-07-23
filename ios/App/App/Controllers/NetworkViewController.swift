import UIKit

class NetworkViewController: UIViewController {
    
    private let searchController = UISearchController(searchResultsController: nil)
    private let segmentedControl = UISegmentedControl(items: ["Discover", "Connections", "Requests"])
    private let tableView = UITableView()
    
    private var allUsers: [User] = []
    private var filteredUsers: [User] = []
    private var connections: [User] = []
    private var pendingRequests: [User] = []
    private var currentSegment: Int = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupSearchController()
        setupTableView()
        loadSampleUsers()
        filterUsersBySegment()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.systemBackground
        title = "Network"
        
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Segmented control setup
        segmentedControl.selectedSegmentIndex = 0
        segmentedControl.addTarget(self, action: #selector(segmentChanged), for: .valueChanged)
        segmentedControl.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(segmentedControl)
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            segmentedControl.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            segmentedControl.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            segmentedControl.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            segmentedControl.heightAnchor.constraint(equalToConstant: 32)
        ])
    }
    
    private func setupSearchController() {
        searchController.searchResultsUpdater = self
        searchController.obscuresBackgroundDuringPresentation = false
        searchController.searchBar.placeholder = "Search people..."
        navigationItem.searchController = searchController
        definesPresentationContext = true
    }
    
    private func setupTableView() {
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(NetworkTableViewCell.self, forCellReuseIdentifier: "NetworkCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = UIColor.systemBackground
        
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: segmentedControl.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func loadSampleUsers() {
        allUsers = [
            User(id: "1", name: "Sarah Johnson", email: "sarah.j@aut.ac.nz", userType: .student, major: "Computer Science", graduationYear: 2025, skills: ["Swift", "Python", "UI/UX"], interests: ["iOS Development", "Machine Learning"]),
            User(id: "2", name: "Michael Chen", email: "m.chen@techcorp.com", userType: .graduate, major: "Software Engineering", graduationYear: 2023, company: "TechCorp", position: "Software Developer", skills: ["Java", "React", "AWS"], interests: ["Cloud Computing", "Startups"]),
            User(id: "3", name: "Emma Wilson", email: "emma.wilson@design.co.nz", userType: .graduate, major: "Design", graduationYear: 2022, company: "Creative Solutions", position: "UX Designer", skills: ["Figma", "Adobe XD", "User Research"], interests: ["Design Thinking", "Product Design"]),
            User(id: "4", name: "David Rodriguez", email: "d.rodriguez@innovate.co.nz", userType: .employer, company: "Innovation Labs", position: "Hiring Manager", skills: ["Talent Acquisition", "Leadership"], interests: ["Emerging Technologies", "Team Building"]),
            User(id: "5", name: "Lisa Kim", email: "lisa.k@aut.ac.nz", userType: .student, major: "Business Analytics", graduationYear: 2026, skills: ["Data Analysis", "SQL", "Tableau"], interests: ["Data Science", "Business Intelligence"])
        ]
        
        // Simulate some connections and pending requests
        connections = Array(allUsers.prefix(2))
        pendingRequests = Array(allUsers.suffix(1))
        
        filterUsersBySegment()
    }
    
    @objc private func segmentChanged() {
        currentSegment = segmentedControl.selectedSegmentIndex
        filterUsersBySegment()
    }
    
    private func filterUsersBySegment() {
        let searchText = searchController.searchBar.text?.lowercased() ?? ""
        
        var usersToShow: [User] = []
        
        switch currentSegment {
        case 0: // Discover
            usersToShow = allUsers.filter { user in
                !connections.contains { $0.id == user.id } &&
                !pendingRequests.contains { $0.id == user.id }
            }
        case 1: // Connections
            usersToShow = connections
        case 2: // Requests
            usersToShow = pendingRequests
        default:
            usersToShow = allUsers
        }
        
        if !searchText.isEmpty {
            usersToShow = usersToShow.filter { user in
                user.name.lowercased().contains(searchText) ||
                user.company?.lowercased().contains(searchText) ?? false ||
                user.major?.lowercased().contains(searchText) ?? false ||
                user.skills.joined(separator: " ").lowercased().contains(searchText)
            }
        }
        
        filteredUsers = usersToShow
        tableView.reloadData()
    }
}

extension NetworkViewController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) {
        filterUsersBySegment()
    }
}

extension NetworkViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredUsers.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "NetworkCell", for: indexPath) as! NetworkTableViewCell
        cell.configure(with: filteredUsers[indexPath.row], segment: currentSegment)
        cell.delegate = self
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let user = filteredUsers[indexPath.row]
        let profileVC = UserProfileViewController(user: user)
        navigationController?.pushViewController(profileVC, animated: true)
    }
}

extension NetworkViewController: NetworkTableViewCellDelegate {
    func didTapConnectButton(for user: User) {
        // Simulate sending connection request
        if let index = allUsers.firstIndex(where: { $0.id == user.id }) {
            pendingRequests.append(user)
            filterUsersBySegment()
            
            let alert = UIAlertController(title: "Connection Request Sent", message: "Your connection request has been sent to \(user.name).", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
        }
    }
    
    func didTapAcceptButton(for user: User) {
        // Simulate accepting connection request
        if let index = pendingRequests.firstIndex(where: { $0.id == user.id }) {
            pendingRequests.remove(at: index)
            connections.append(user)
            filterUsersBySegment()
            
            let alert = UIAlertController(title: "Connection Accepted", message: "You are now connected with \(user.name).", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
        }
    }
    
    func didTapMessageButton(for user: User) {
        let alert = UIAlertController(title: "Message", message: "Messaging feature would open here to chat with \(user.name).", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - NetworkTableViewCellDelegate
protocol NetworkTableViewCellDelegate: AnyObject {
    func didTapConnectButton(for user: User)
    func didTapAcceptButton(for user: User)
    func didTapMessageButton(for user: User)
}

// MARK: - NetworkTableViewCell
class NetworkTableViewCell: UITableViewCell {
    
    weak var delegate: NetworkTableViewCellDelegate?
    private var user: User?
    
    private let cardView = UIView()
    private let profileImageView = UIImageView()
    private let nameLabel = UILabel()
    private let titleLabel = UILabel()
    private let companyLabel = UILabel()
    private let skillsLabel = UILabel()
    private let actionButton = UIButton(type: .system)
    
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
        
        profileImageView.backgroundColor = UIColor.systemGray5
        profileImageView.layer.cornerRadius = 25
        profileImageView.clipsToBounds = true
        profileImageView.contentMode = .scaleAspectFill
        
        nameLabel.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        nameLabel.textColor = UIColor.label
        
        titleLabel.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        titleLabel.textColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        
        companyLabel.font = UIFont.systemFont(ofSize: 13, weight: .regular)
        companyLabel.textColor = UIColor.secondaryLabel
        
        skillsLabel.font = UIFont.systemFont(ofSize: 12, weight: .regular)
        skillsLabel.textColor = UIColor.tertiaryLabel
        skillsLabel.numberOfLines = 2
        
        actionButton.titleLabel?.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        actionButton.layer.cornerRadius = 8
        actionButton.addTarget(self, action: #selector(actionButtonTapped), for: .touchUpInside)
        
        [cardView, profileImageView, nameLabel, titleLabel, companyLabel, skillsLabel, actionButton].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
        
        contentView.addSubview(cardView)
        cardView.addSubview(profileImageView)
        cardView.addSubview(nameLabel)
        cardView.addSubview(titleLabel)
        cardView.addSubview(companyLabel)
        cardView.addSubview(skillsLabel)
        cardView.addSubview(actionButton)
        
        NSLayoutConstraint.activate([
            cardView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            cardView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            cardView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            cardView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            profileImageView.topAnchor.constraint(equalTo: cardView.topAnchor, constant: 16),
            profileImageView.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            profileImageView.widthAnchor.constraint(equalToConstant: 50),
            profileImageView.heightAnchor.constraint(equalToConstant: 50),
            
            nameLabel.topAnchor.constraint(equalTo: cardView.topAnchor, constant: 16),
            nameLabel.leadingAnchor.constraint(equalTo: profileImageView.trailingAnchor, constant: 12),
            nameLabel.trailingAnchor.constraint(equalTo: actionButton.leadingAnchor, constant: -8),
            
            titleLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            titleLabel.leadingAnchor.constraint(equalTo: profileImageView.trailingAnchor, constant: 12),
            titleLabel.trailingAnchor.constraint(equalTo: actionButton.leadingAnchor, constant: -8),
            
            companyLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 2),
            companyLabel.leadingAnchor.constraint(equalTo: profileImageView.trailingAnchor, constant: 12),
            companyLabel.trailingAnchor.constraint(equalTo: actionButton.leadingAnchor, constant: -8),
            
            skillsLabel.topAnchor.constraint(equalTo: profileImageView.bottomAnchor, constant: 12),
            skillsLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            skillsLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            skillsLabel.bottomAnchor.constraint(equalTo: cardView.bottomAnchor, constant: -16),
            
            actionButton.topAnchor.constraint(equalTo: cardView.topAnchor, constant: 16),
            actionButton.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            actionButton.widthAnchor.constraint(equalToConstant: 80),
            actionButton.heightAnchor.constraint(equalToConstant: 32)
        ])
    }
    
    func configure(with user: User, segment: Int) {
        self.user = user
        
        nameLabel.text = user.name
        
        switch user.userType {
        case .student:
            titleLabel.text = "Student"
            companyLabel.text = user.major ?? "AUT University"
        case .graduate:
            titleLabel.text = user.position ?? "Graduate"
            companyLabel.text = user.company ?? "AUT University"
        case .employer:
            titleLabel.text = user.position ?? "Employer"
            companyLabel.text = user.company ?? ""
        }
        
        skillsLabel.text = "Skills: " + user.skills.prefix(5).joined(separator: ", ")
        
        // Configure action button based on segment
        switch segment {
        case 0: // Discover
            actionButton.setTitle("Connect", for: .normal)
            actionButton.backgroundColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
            actionButton.setTitleColor(.white, for: .normal)
        case 1: // Connections
            actionButton.setTitle("Message", for: .normal)
            actionButton.backgroundColor = UIColor.systemBlue
            actionButton.setTitleColor(.white, for: .normal)
        case 2: // Requests
            actionButton.setTitle("Accept", for: .normal)
            actionButton.backgroundColor = UIColor.systemGreen
            actionButton.setTitleColor(.white, for: .normal)
        default:
            break
        }
        
        // Set placeholder profile image
        profileImageView.image = UIImage(systemName: "person.circle.fill")
        profileImageView.tintColor = UIColor.systemGray3
    }
    
    @objc private func actionButtonTapped() {
        guard let user = user else { return }
        
        let buttonTitle = actionButton.title(for: .normal)
        switch buttonTitle {
        case "Connect":
            delegate?.didTapConnectButton(for: user)
        case "Accept":
            delegate?.didTapAcceptButton(for: user)
        case "Message":
            delegate?.didTapMessageButton(for: user)
        default:
            break
        }
    }
}