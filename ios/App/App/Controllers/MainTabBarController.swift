import UIKit

class MainTabBarController: UITabBarController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupTabBar()
        setupViewControllers()
    }
    
    private func setupTabBar() {
        tabBar.backgroundColor = UIColor.systemBackground
        tabBar.tintColor = UIColor(red: 140/255, green: 29/255, blue: 64/255, alpha: 1.0) // AUT brand color
        tabBar.unselectedItemTintColor = UIColor.systemGray
    }
    
    private func setupViewControllers() {
        let homeVC = HomeViewController()
        let homeNav = UINavigationController(rootViewController: homeVC)
        homeNav.tabBarItem = UITabBarItem(title: "Home", image: UIImage(systemName: "house"), tag: 0)
        
        let jobsVC = JobsViewController()
        let jobsNav = UINavigationController(rootViewController: jobsVC)
        jobsNav.tabBarItem = UITabBarItem(title: "Jobs", image: UIImage(systemName: "briefcase"), tag: 1)
        
        let eventsVC = EventsViewController()
        let eventsNav = UINavigationController(rootViewController: eventsVC)
        eventsNav.tabBarItem = UITabBarItem(title: "Events", image: UIImage(systemName: "calendar"), tag: 2)
        
        let networkVC = NetworkViewController()
        let networkNav = UINavigationController(rootViewController: networkVC)
        networkNav.tabBarItem = UITabBarItem(title: "Network", image: UIImage(systemName: "person.2"), tag: 3)
        
        let profileVC = ProfileViewController()
        let profileNav = UINavigationController(rootViewController: profileVC)
        profileNav.tabBarItem = UITabBarItem(title: "Profile", image: UIImage(systemName: "person.circle"), tag: 4)
        
        viewControllers = [homeNav, jobsNav, eventsNav, networkNav, profileNav]
    }
}