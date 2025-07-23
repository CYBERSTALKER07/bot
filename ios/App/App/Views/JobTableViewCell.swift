import UIKit
import Foundation

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
    
    func configure(with job: JobListing) {
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