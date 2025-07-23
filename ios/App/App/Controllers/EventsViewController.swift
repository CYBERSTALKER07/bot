import UIKit

class EventsViewController: UIViewController {
    
    private let segmentedControl = UISegmentedControl(items: ["Upcoming", "Past", "My Events"])
    private let tableView = UITableView()
    private let searchController = UISearchController(searchResultsController: nil)
    
    private var allEvents: [Event] = []
    private var filteredEvents: [Event] = []
    private var currentSegment: Int = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupSearchController()
        setupTableView()
        loadSampleEvents()
        filterEventsBySegment()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.systemBackground
        title = "Events"
        
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
        searchController.searchBar.placeholder = "Search events..."
        navigationItem.searchController = searchController
        definesPresentationContext = true
    }
    
    private func setupTableView() {
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(EventTableViewCell.self, forCellReuseIdentifier: "EventCell")
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
    
    private func loadSampleEvents() {
        let calendar = Calendar.current
        let now = Date()
        
        allEvents = [
            Event(
                id: "1",
                title: "Career Fair 2025",
                description: "Connect with top employers and explore career opportunities across various industries.",
                organizer: "AUT Career Services",
                location: "AUT City Campus - WZ Building",
                startDate: calendar.date(byAdding: .day, value: 7, to: now) ?? now,
                endDate: calendar.date(byAdding: .day, value: 7, to: now) ?? now,
                imageURL: nil,
                registrationURL: "https://authandshake.vercel.app/events/career-fair",
                capacity: 500,
                currentAttendees: 234,
                tags: ["Career", "Networking", "Employment"],
                eventType: .careerFair,
                isVirtual: false
            ),
            Event(
                id: "2",
                title: "iOS Development Workshop",
                description: "Learn the fundamentals of iOS app development with Swift and Xcode.",
                organizer: "AUT Computer Science Department",
                location: "Virtual Event",
                startDate: calendar.date(byAdding: .day, value: 3, to: now) ?? now,
                endDate: calendar.date(byAdding: .day, value: 3, to: now) ?? now,
                imageURL: nil,
                registrationURL: "https://authandshake.vercel.app/events/ios-workshop",
                capacity: 50,
                currentAttendees: 42,
                tags: ["Programming", "iOS", "Swift", "Mobile"],
                eventType: .workshop,
                isVirtual: true
            ),
            Event(
                id: "3",
                title: "Alumni Networking Night",
                description: "Connect with AUT alumni working in your field of interest.",
                organizer: "AUT Alumni Association",
                location: "AUT North Campus - Student Hub",
                startDate: calendar.date(byAdding: .day, value: 14, to: now) ?? now,
                endDate: calendar.date(byAdding: .day, value: 14, to: now) ?? now,
                imageURL: nil,
                registrationURL: "https://authandshake.vercel.app/events/alumni-night",
                capacity: 200,
                currentAttendees: 89,
                tags: ["Networking", "Alumni", "Professional"],
                eventType: .networking,
                isVirtual: false
            ),
            Event(
                id: "4",
                title: "Design Thinking Seminar",
                description: "Previous event: Learn design thinking methodologies used in modern product development.",
                organizer: "AUT Design School",
                location: "AUT South Campus - Design Building",
                startDate: calendar.date(byAdding: .day, value: -30, to: now) ?? now,
                endDate: calendar.date(byAdding: .day, value: -30, to: now) ?? now,
                imageURL: nil,
                registrationURL: nil,
                capacity: 80,
                currentAttendees: 75,
                tags: ["Design", "Innovation", "Product Development"],
                eventType: .seminar,
                isVirtual: false
            )
        ]
        
        filterEventsBySegment()
    }
    
    @objc private func segmentChanged() {
        currentSegment = segmentedControl.selectedSegmentIndex
        filterEventsBySegment()
    }
    
    private func filterEventsBySegment() {
        let searchText = searchController.searchBar.text?.lowercased() ?? ""
        
        var eventsToShow: [Event] = []
        
        switch currentSegment {
        case 0: // Upcoming
            eventsToShow = allEvents.filter { $0.isUpcoming }
        case 1: // Past
            eventsToShow = allEvents.filter { !$0.isUpcoming }
        case 2: // My Events (for demo, show registered events)
            eventsToShow = allEvents.filter { $0.currentAttendees > 0 }
        default:
            eventsToShow = allEvents
        }
        
        // Apply search filter
        if !searchText.isEmpty {
            eventsToShow = eventsToShow.filter { event in
                event.title.lowercased().contains(searchText) ||
                event.description.lowercased().contains(searchText) ||
                event.organizer.lowercased().contains(searchText) ||
                event.tags.joined(separator: " ").lowercased().contains(searchText)
            }
        }
        
        filteredEvents = eventsToShow.sorted { $0.startDate < $1.startDate }
        tableView.reloadData()
    }
}

// MARK: - Search Results Updating
extension EventsViewController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) {
        filterEventsBySegment()
    }
}

// MARK: - Table View Data Source and Delegate
extension EventsViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredEvents.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "EventCell", for: indexPath) as! EventTableViewCell
        cell.configure(with: filteredEvents[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let event = filteredEvents[indexPath.row]
        let detailVC = EventDetailViewController(event: event)
        navigationController?.pushViewController(detailVC, animated: true)
    }
}

// MARK: - EventTableViewCell
class EventTableViewCell: UITableViewCell {
    
    private let cardView = UIView()
    private let titleLabel = UILabel()
    private let organizerLabel = UILabel()
    private let dateLabel = UILabel()
    private let locationLabel = UILabel()
    private let typeLabel = UILabel()
    private let attendeesLabel = UILabel()
    private let tagsStackView = UIStackView()
    
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
        titleLabel.numberOfLines = 2
        
        organizerLabel.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        organizerLabel.textColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        
        dateLabel.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        dateLabel.textColor = UIColor.systemBlue
        
        locationLabel.font = UIFont.systemFont(ofSize: 14, weight: .regular)
        locationLabel.textColor = UIColor.secondaryLabel
        locationLabel.numberOfLines = 0
        
        typeLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        typeLabel.textColor = UIColor.white
        typeLabel.backgroundColor = UIColor.systemOrange
        typeLabel.layer.cornerRadius = 8
        typeLabel.clipsToBounds = true
        typeLabel.textAlignment = .center
        
        attendeesLabel.font = UIFont.systemFont(ofSize: 12, weight: .regular)
        attendeesLabel.textColor = UIColor.tertiaryLabel
        
        tagsStackView.axis = .horizontal
        tagsStackView.spacing = 6
        tagsStackView.distribution = .fillProportionally
        
        [cardView, titleLabel, organizerLabel, dateLabel, locationLabel, typeLabel, attendeesLabel, tagsStackView].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
        
        contentView.addSubview(cardView)
        cardView.addSubview(titleLabel)
        cardView.addSubview(organizerLabel)
        cardView.addSubview(dateLabel)
        cardView.addSubview(locationLabel)
        cardView.addSubview(typeLabel)
        cardView.addSubview(attendeesLabel)
        cardView.addSubview(tagsStackView)
        
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
            
            organizerLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            organizerLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            organizerLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            
            dateLabel.topAnchor.constraint(equalTo: organizerLabel.bottomAnchor, constant: 8),
            dateLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            dateLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            
            locationLabel.topAnchor.constraint(equalTo: dateLabel.bottomAnchor, constant: 4),
            locationLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            locationLabel.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            
            attendeesLabel.topAnchor.constraint(equalTo: locationLabel.bottomAnchor, constant: 8),
            attendeesLabel.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            
            tagsStackView.topAnchor.constraint(equalTo: attendeesLabel.bottomAnchor, constant: 8),
            tagsStackView.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 16),
            tagsStackView.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -16),
            tagsStackView.bottomAnchor.constraint(equalTo: cardView.bottomAnchor, constant: -16)
        ])
    }
    
    func configure(with event: Event) {
        titleLabel.text = event.title
        organizerLabel.text = "by \(event.organizer)"
        dateLabel.text = event.formattedDateRange
        locationLabel.text = event.isVirtual ? "🌐 Virtual Event" : "📍 \(event.location)"
        typeLabel.text = event.eventType.rawValue
        
        if let capacity = event.capacity {
            attendeesLabel.text = "\(event.currentAttendees)/\(capacity) attending"
        } else {
            attendeesLabel.text = "\(event.currentAttendees) attending"
        }
        
        // Color coding for event types
        switch event.eventType {
        case .workshop:
            typeLabel.backgroundColor = UIColor.systemPurple
        case .seminar:
            typeLabel.backgroundColor = UIColor.systemBlue
        case .networking:
            typeLabel.backgroundColor = UIColor.systemGreen
        case .careerFair:
            typeLabel.backgroundColor = UIColor.systemOrange
        case .webinar:
            typeLabel.backgroundColor = UIColor.systemTeal
        case .conference:
            typeLabel.backgroundColor = UIColor.systemRed
        case .graduation:
            typeLabel.backgroundColor = UIColor.systemIndigo
        }
        
        // Clear previous tags
        tagsStackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        // Add tag labels
        for tag in event.tags.prefix(3) { // Show max 3 tags
            let tagLabel = UILabel()
            tagLabel.text = "#\(tag)"
            tagLabel.font = UIFont.systemFont(ofSize: 11, weight: .medium)
            tagLabel.textColor = UIColor.systemBlue
            tagLabel.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.1)
            tagLabel.layer.cornerRadius = 8
            tagLabel.clipsToBounds = true
            tagLabel.textAlignment = .center
            tagLabel.translatesAutoresizingMaskIntoConstraints = false
            
            let paddingView = UIView()
            paddingView.addSubview(tagLabel)
            NSLayoutConstraint.activate([
                tagLabel.topAnchor.constraint(equalTo: paddingView.topAnchor, constant: 4),
                tagLabel.leadingAnchor.constraint(equalTo: paddingView.leadingAnchor, constant: 8),
                tagLabel.trailingAnchor.constraint(equalTo: paddingView.trailingAnchor, constant: -8),
                tagLabel.bottomAnchor.constraint(equalTo: paddingView.bottomAnchor, constant: -4)
            ])
            
            tagsStackView.addArrangedSubview(paddingView)
        }
    }
}
