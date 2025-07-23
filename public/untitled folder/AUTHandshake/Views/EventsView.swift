import SwiftUI

struct EventsView: View {
    @State private var events: [Event] = []
    @State private var isLoading = false
    @State private var selectedCategory: EventCategory? = nil
    
    var filteredEvents: [Event] {
        if let category = selectedCategory {
            return events.filter { $0.category == category }
        }
        return events
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Category Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        CategoryFilterChip(
                            title: "All",
                            isSelected: selectedCategory == nil
                        ) {
                            selectedCategory = nil
                        }
                        
                        ForEach(EventCategory.allCases, id: \.self) { category in
                            CategoryFilterChip(
                                title: category.rawValue,
                                isSelected: selectedCategory == category
                            ) {
                                selectedCategory = category
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical, 8)
                
                // Events List
                if isLoading {
                    ProgressView("Loading events...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if filteredEvents.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "calendar")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("No events found")
                            .font(.title2)
                            .foregroundColor(.secondary)
                        Text("Check back later for upcoming events")
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(filteredEvents) { event in
                        EventRowView(event: event)
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Events")
            .onAppear {
                if events.isEmpty {
                    loadEvents()
                }
            }
            .refreshable {
                loadEvents()
            }
        }
    }
    
    private func loadEvents() {
        isLoading = true
        
        // Mock data - replace with EventService
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.events = [
                Event(
                    id: UUID().uuidString,
                    title: "AUT Career Fair 2025",
                    description: "Meet with top employers and explore career opportunities across various industries.",
                    date: Calendar.current.date(byAdding: .day, value: 14, to: Date()) ?? Date(),
                    endDate: Calendar.current.date(byAdding: .hour, value: 6, to: Calendar.current.date(byAdding: .day, value: 14, to: Date()) ?? Date()),
                    location: "AUT City Campus - WG Building",
                    organizer: "AUT Career Services",
                    category: .careerFair,
                    imageURL: nil,
                    registrationRequired: true,
                    maxAttendees: 500,
                    currentAttendees: 287,
                    isVirtual: false,
                    meetingLink: nil
                ),
                Event(
                    id: UUID().uuidString,
                    title: "iOS Development Workshop",
                    description: "Learn the fundamentals of iOS app development with Swift and SwiftUI.",
                    date: Calendar.current.date(byAdding: .day, value: 7, to: Date()) ?? Date(),
                    endDate: Calendar.current.date(byAdding: .hour, value: 3, to: Calendar.current.date(byAdding: .day, value: 7, to: Date()) ?? Date()),
                    location: "AUT North Campus - WZ Building",
                    organizer: "AUT Computer Science Department",
                    category: .workshop,
                    imageURL: nil,
                    registrationRequired: true,
                    maxAttendees: 30,
                    currentAttendees: 18,
                    isVirtual: false,
                    meetingLink: nil
                ),
                Event(
                    id: UUID().uuidString,
                    title: "Virtual Networking Night",
                    description: "Connect with industry professionals and fellow students in a relaxed virtual environment.",
                    date: Calendar.current.date(byAdding: .day, value: 3, to: Date()) ?? Date(),
                    endDate: Calendar.current.date(byAdding: .hour, value: 2, to: Calendar.current.date(byAdding: .day, value: 3, to: Date()) ?? Date()),
                    location: "Online",
                    organizer: "AUT Student Association",
                    category: .networking,
                    imageURL: nil,
                    registrationRequired: true,
                    maxAttendees: 100,
                    currentAttendees: 42,
                    isVirtual: true,
                    meetingLink: "https://zoom.us/j/example"
                )
            ]
            self.isLoading = false
        }
    }
}

struct CategoryFilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.blue : Color(.systemGray6))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(16)
        }
    }
}

struct EventRowView: View {
    let event: Event
    @State private var isRegistered = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(event.title)
                        .font(.headline)
                        .lineLimit(2)
                    
                    Text("by \(event.organizer)")
                        .font(.subheadline)
                        .foregroundColor(.blue)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text(event.category.rawValue)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.orange.opacity(0.1))
                        .foregroundColor(.orange)
                        .cornerRadius(12)
                    
                    if event.isVirtual {
                        Text("Virtual")
                            .font(.caption)
                            .foregroundColor(.purple)
                    }
                }
            }
            
            Text(event.description)
                .font(.body)
                .foregroundColor(.secondary)
                .lineLimit(3)
            
            HStack {
                Label(event.date.formatted(date: .abbreviated, time: .shortened), systemImage: "calendar")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if !event.isVirtual {
                    Label(event.location, systemImage: "location")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
            }
            
            HStack {
                if let maxAttendees = event.maxAttendees {
                    Text("\(event.currentAttendees)/\(maxAttendees) registered")
                        .font(.caption)
                        .foregroundColor(.secondary)
                } else {
                    Text("\(event.currentAttendees) registered")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if event.registrationRequired {
                    Button(isRegistered ? "Registered" : "Register") {
                        isRegistered.toggle()
                    }
                    .font(.caption)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(isRegistered ? Color.green : Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(16)
                }
            }
        }
        .padding(.vertical, 8)
    }
}