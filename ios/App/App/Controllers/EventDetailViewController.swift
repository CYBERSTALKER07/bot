import UIKit

class EventDetailViewController: UIViewController {
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let event: Event
    
    private let titleLabel = UILabel()
    private let organizerLabel = UILabel()
    private let dateLabel = UILabel()
    private let locationLabel = UILabel()
    private let typeLabel = UILabel()
    private let virtualBadge = UIView()
    private let virtualLabel = UILabel()
    private let attendeesLabel = UILabel()
    private let descriptionHeaderLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let tagsHeaderLabel = UILabel()
    private let tagsStackView = UIStackView()
    private let registerButton = UIButton(type: .system)
    
    init(event: Event) {
        self.event = event
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLayout()
        loadEventData()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.systemBackground
        title = "Event Details"
        
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
        
        organizerLabel.font = UIFont.systemFont(ofSize: 18, weight: .medium)
        organizerLabel.textColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        
        dateLabel.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        dateLabel.textColor = UIColor.label
        
        locationLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
        locationLabel.textColor = UIColor.secondaryLabel
        
        typeLabel.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        typeLabel.textColor = UIColor.white
        typeLabel.backgroundColor = UIColor.systemOrange
        typeLabel.layer.cornerRadius = 12
        typeLabel.clipsToBounds = true
        typeLabel.textAlignment = .center
        
        virtualBadge.backgroundColor = UIColor.systemBlue
        virtualBadge.layer.cornerRadius = 12
        virtualBadge.isHidden = true
        
        virtualLabel.text = "VIRTUAL EVENT"
        virtualLabel.font = UIFont.systemFont(ofSize: 12, weight: .bold)
        virtualLabel.textColor = UIColor.white
        virtualLabel.textAlignment = .center
        
        attendeesLabel.font = UIFont.systemFont(ofSize: 16, weight: .medium)
        attendeesLabel.textColor = UIColor.systemGreen
        
        descriptionHeaderLabel.text = "About This Event"
        descriptionHeaderLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        descriptionHeaderLabel.textColor = UIColor.label
        
        descriptionLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
        descriptionLabel.textColor = UIColor.label
        descriptionLabel.numberOfLines = 0
        
        tagsHeaderLabel.text = "Tags"
        tagsHeaderLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        tagsHeaderLabel.textColor = UIColor.label
        
        tagsStackView.axis = .horizontal
        tagsStackView.spacing = 8
        tagsStackView.alignment = .leading
        tagsStackView.distribution = .fillProportionally
        
        registerButton.setTitle("Register for Event", for: .normal)
        registerButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        registerButton.backgroundColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0)
        registerButton.setTitleColor(.white, for: .normal)
        registerButton.layer.cornerRadius = 12
        registerButton.addTarget(self, action: #selector(registerButtonTapped), for: .touchUpInside)
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        [titleLabel, organizerLabel, dateLabel, locationLabel, typeLabel, virtualBadge, virtualLabel,
         attendeesLabel, descriptionHeaderLabel, descriptionLabel, tagsHeaderLabel, tagsStackView,
         registerButton].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
    }
    
    private func setupLayout() {
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        contentView.addSubview(titleLabel)
        contentView.addSubview(organizerLabel)
        contentView.addSubview(dateLabel)
        contentView.addSubview(locationLabel)
        contentView.addSubview(typeLabel)
        contentView.addSubview(virtualBadge)
        virtualBadge.addSubview(virtualLabel)
        contentView.addSubview(attendeesLabel)
        contentView.addSubview(descriptionHeaderLabel)
        contentView.addSubview(descriptionLabel)
        contentView.addSubview(tagsHeaderLabel)
        contentView.addSubview(tagsStackView)
        contentView.addSubview(registerButton)
        
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
            
            organizerLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 12),
            organizerLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            organizerLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            dateLabel.topAnchor.constraint(equalTo: organizerLabel.bottomAnchor, constant: 16),
            dateLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            dateLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            locationLabel.topAnchor.constraint(equalTo: dateLabel.bottomAnchor, constant: 8),
            locationLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            locationLabel.trailingAnchor.constraint(equalTo: virtualBadge.leadingAnchor, constant: -12),
            
            virtualBadge.topAnchor.constraint(equalTo: dateLabel.bottomAnchor, constant: 8),
            virtualBadge.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            virtualBadge.widthAnchor.constraint(equalToConstant: 120),
            virtualBadge.heightAnchor.constraint(equalToConstant: 24),
            
            virtualLabel.centerXAnchor.constraint(equalTo: virtualBadge.centerXAnchor),
            virtualLabel.centerYAnchor.constraint(equalTo: virtualBadge.centerYAnchor),
            
            attendeesLabel.topAnchor.constraint(equalTo: locationLabel.bottomAnchor, constant: 16),
            attendeesLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            attendeesLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            descriptionHeaderLabel.topAnchor.constraint(equalTo: attendeesLabel.bottomAnchor, constant: 24),
            descriptionHeaderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionHeaderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            descriptionLabel.topAnchor.constraint(equalTo: descriptionHeaderLabel.bottomAnchor, constant: 12),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            tagsHeaderLabel.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 24),
            tagsHeaderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            tagsHeaderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            tagsStackView.topAnchor.constraint(equalTo: tagsHeaderLabel.bottomAnchor, constant: 12),
            tagsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            tagsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            registerButton.topAnchor.constraint(equalTo: tagsStackView.bottomAnchor, constant: 32),
            registerButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            registerButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            registerButton.heightAnchor.constraint(equalToConstant: 50),
            registerButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    private func loadEventData() {
        titleLabel.text = event.title
        organizerLabel.text = "Organized by \(event.organizer)"
        
        let formatter = DateFormatter()
        formatter.dateStyle = .full
        formatter.timeStyle = .short
        dateLabel.text = "📅 \(formatter.string(from: event.startDate))"
        
        locationLabel.text = "📍 \(event.location)"
        typeLabel.text = event.eventType.rawValue
        
        virtualBadge.isHidden = !event.isVirtual
        
        if let capacity = event.capacity {
            attendeesLabel.text = "👥 \(event.currentAttendees)/\(capacity) attending"
        } else {
            attendeesLabel.text = "👥 \(event.currentAttendees) attending"
        }
        
        descriptionLabel.text = event.description
        
        // Add tags
        for tag in event.tags {
            let tagView = createTagView(text: tag)
            tagsStackView.addArrangedSubview(tagView)
        }
        
        // Update register button based on event status
        if !event.isUpcoming {
            registerButton.setTitle("Event Has Ended", for: .normal)
            registerButton.backgroundColor = UIColor.systemGray
            registerButton.isEnabled = false
        }
        
        // Color coding for event types
        switch event.eventType {
        case .workshop:
            typeLabel.backgroundColor = UIColor.systemPurple
        case .seminar:
            typeLabel.backgroundColor = UIColor.systemBlue
        case .networking:
            typeLabel.backgroundColor = UIColor.systemOrange
        case .careerFair:
            typeLabel.backgroundColor = UIColor.systemGreen
        case .webinar:
            typeLabel.backgroundColor = UIColor.systemTeal
        case .conference:
            typeLabel.backgroundColor = UIColor.systemRed
        case .graduation:
            typeLabel.backgroundColor = UIColor.systemIndigo
        }
    }
    
    private func createTagView(text: String) -> UIView {
        let containerView = UIView()
        containerView.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.1)
        containerView.layer.cornerRadius = 8
        containerView.layer.borderWidth = 1
        containerView.layer.borderColor = UIColor.systemBlue.withAlphaComponent(0.3).cgColor
        
        let label = UILabel()
        label.text = text
        label.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        label.textColor = UIColor.systemBlue
        label.translatesAutoresizingMaskIntoConstraints = false
        
        containerView.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 6),
            label.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 10),
            label.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -10),
            label.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -6)
        ])
        
        return containerView
    }
    
    @objc private func registerButtonTapped() {
        let alert = UIAlertController(title: "Register for Event", message: "This would open the registration process for \(event.title).", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    @objc private func shareButtonTapped() {
        let shareText = "Check out this event: \(event.title) organized by \(event.organizer)"
        let activityVC = UIActivityViewController(activityItems: [shareText], applicationActivities: nil)
        
        if let popover = activityVC.popoverPresentationController {
            popover.barButtonItem = navigationItem.rightBarButtonItem
        }
        
        present(activityVC, animated: true)
    }
}