// Mock data for companies
export const mockCompanies = [
  {
    id: '1',
    name: 'Google',
    logo_url: 'https://logo.clearbit.com/google.com',
    cover_image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=400&fit=crop',
    description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.',
    mission_statement: 'To organize the world\'s information and make it universally accessible and useful.',
    industry: 'Technology',
    company_size: '10,000+ employees',
    founded_year: 1998,
    location: 'Mountain View, CA',
    website_url: 'https://google.com',
    linkedin_url: 'https://linkedin.com/company/google',
    twitter_url: 'https://twitter.com/google',
    culture_videos: ['https://youtube.com/watch?v=example1', 'https://youtube.com/watch?v=example2'],
    employee_count: 156500,
    rating: 4.5,
    reviews_count: 12847,
    is_following: false,
    is_verified: true,
    is_hiring: true,
    featured_benefits: ['Healthcare', 'Stock Options', 'Free Meals', 'Learning Budget'],
    growth_rate: 15,
    benefits: [
      {
        id: '1',
        category: 'health',
        title: 'Comprehensive Healthcare',
        description: 'Full medical, dental, and vision coverage for you and your family',
        icon: 'health'
      },
      {
        id: '2',
        category: 'financial',
        title: 'Competitive Salary + Equity',
        description: 'Industry-leading compensation with stock options and bonuses',
        icon: 'money'
      },
      {
        id: '3',
        category: 'time-off',
        title: 'Unlimited PTO',
        description: 'Take the time you need to recharge and spend with family',
        icon: 'vacation'
      },
      {
        id: '4',
        category: 'learning',
        title: 'Learning & Development',
        description: '$5,000 annual budget for courses, conferences, and certifications',
        icon: 'education'
      },
      {
        id: '5',
        category: 'perks',
        title: 'Free Meals & Snacks',
        description: 'Gourmet cafeterias and micro-kitchens on every floor',
        icon: 'food'
      },
      {
        id: '6',
        category: 'family',
        title: 'Parental Leave',
        description: '24 weeks paid leave for new parents and adoption support',
        icon: 'family'
      }
    ],
    values: [
      {
        id: '1',
        title: 'Focus on the user',
        description: 'Everything we do starts with the user experience in mind',
        icon: 'user-focus'
      },
      {
        id: '2',
        title: 'Innovation',
        description: 'We push boundaries and think differently to solve big problems',
        icon: 'innovation'
      },
      {
        id: '3',
        title: 'Diversity & Inclusion',
        description: 'Building products for everyone means including everyone',
        icon: 'diversity'
      },
      {
        id: '4',
        title: 'Excellence',
        description: 'We set high standards and continuously raise the bar',
        icon: 'excellence'
      }
    ],
    offices: [
      {
        id: '1',
        name: 'Googleplex',
        address: '1600 Amphitheatre Parkway',
        city: 'Mountain View',
        country: 'USA',
        is_headquarters: true,
        employee_count: 25000,
        image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop'
      }
    ],
    stats: {
      total_employees: 156500,
      avg_tenure: '3.8 years',
      employee_satisfaction: 92,
      glassdoor_rating: 4.5,
      total_jobs_posted: 2847,
      successful_hires: 15600
    },
    recent_jobs: [
      {
        id: '1',
        title: 'Software Engineer',
        department: 'Engineering',
        location: 'Mountain View, CA',
        type: 'full-time',
        posted_date: '2025-07-08',
        application_count: 234
      },
      {
        id: '2',
        title: 'Product Manager',
        department: 'Product',
        location: 'New York, NY',
        type: 'full-time',
        posted_date: '2025-07-06',
        application_count: 156
      },
      {
        id: '3',
        title: 'UX Designer',
        department: 'Design',
        location: 'San Francisco, CA',
        type: 'full-time',
        posted_date: '2025-07-05',
        application_count: 89
      }
    ],
    employee_testimonials: [
      {
        id: '1',
        employee_name: 'Sarah Chen',
        employee_title: 'Senior Software Engineer',
        employee_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
        content: 'Google has been an incredible place to grow my career. The learning opportunities are endless, and I work with some of the brightest minds in tech.',
        rating: 5,
        tenure: '4 years',
        department: 'Engineering'
      },
      {
        id: '2',
        employee_name: 'Marcus Johnson',
        employee_title: 'Product Design Lead',
        employee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        content: 'The culture here truly embraces innovation and creativity. I feel empowered to take risks and think big about solving user problems.',
        rating: 5,
        tenure: '2 years',
        department: 'Design'
      }
    ],
    diversity_data: {
      gender_diversity: { male: 68, female: 30, other: 2 },
      age_diversity: { under_25: 15, age_25_34: 45, age_35_44: 25, over_45: 15 },
      ethnicity_diversity: { 'White': 48, 'Asian': 35, 'Hispanic': 8, 'Black': 5, 'Other': 4 },
      leadership_diversity: 35
    },
    sustainability_initiatives: [
      {
        id: '1',
        title: 'Carbon Neutral by 2030',
        description: 'Committed to operating on 24/7 carbon-free energy by 2030',
        category: 'environmental',
        impact_metric: '100% renewable energy'
      },
      {
        id: '2',
        title: 'AI for Social Good',
        description: 'Using AI to address humanitarian and environmental challenges',
        category: 'social',
        impact_metric: '50+ projects launched'
      }
    ]
  },
  {
    id: '2',
    name: 'Microsoft',
    logo_url: 'https://logo.clearbit.com/microsoft.com',
    cover_image_url: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=400&fit=crop',
    description: 'Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services.',
    mission_statement: 'To empower every person and every organization on the planet to achieve more.',
    industry: 'Technology',
    company_size: '10,000+ employees',
    founded_year: 1975,
    location: 'Redmond, WA',
    website_url: 'https://microsoft.com',
    linkedin_url: 'https://linkedin.com/company/microsoft',
    twitter_url: 'https://twitter.com/microsoft',
    culture_videos: ['https://youtube.com/watch?v=microsoft1'],
    employee_count: 221000,
    rating: 4.4,
    reviews_count: 9876,
    is_following: false,
    is_verified: true,
    is_hiring: true,
    featured_benefits: ['Healthcare', 'Retirement Plans', 'Learning Budget', 'Flexible Work'],
    growth_rate: 12,
    benefits: [
      {
        id: '1',
        category: 'health',
        title: 'Premium Healthcare',
        description: 'Comprehensive medical, dental, vision, and mental health coverage',
        icon: 'health'
      },
      {
        id: '2',
        category: 'financial',
        title: '401(k) Match',
        description: 'Company matching up to 50% of your contributions',
        icon: 'money'
      },
      {
        id: '3',
        category: 'learning',
        title: 'Learning Credits',
        description: '$3,000 annual learning and development budget',
        icon: 'education'
      },
      {
        id: '4',
        category: 'time-off',
        title: 'Flexible Time Off',
        description: 'Generous PTO policy with flexible scheduling options',
        icon: 'vacation'
      }
    ],
    values: [
      {
        id: '1',
        title: 'Respect',
        description: 'We each have different backgrounds and perspectives, and this diversity makes us stronger',
        icon: 'diversity'
      },
      {
        id: '2',
        title: 'Integrity',
        description: 'We are each responsible for creating an inclusive culture',
        icon: 'excellence'
      },
      {
        id: '3',
        title: 'Accountability',
        description: 'We are committed to our customers and partners and have a passion to help them achieve their goals',
        icon: 'user-focus'
      }
    ],
    offices: [
      {
        id: '1',
        name: 'Microsoft Campus',
        address: 'One Microsoft Way',
        city: 'Redmond',
        country: 'USA',
        is_headquarters: true,
        employee_count: 50000,
        image_url: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop'
      }
    ],
    stats: {
      total_employees: 221000,
      avg_tenure: '4.2 years',
      employee_satisfaction: 89,
      glassdoor_rating: 4.4,
      total_jobs_posted: 1847,
      successful_hires: 12400
    },
    recent_jobs: [
      {
        id: '4',
        title: 'Cloud Solutions Architect',
        department: 'Azure',
        location: 'Seattle, WA',
        type: 'full-time',
        posted_date: '2025-07-09',
        application_count: 178
      },
      {
        id: '5',
        title: 'Data Scientist',
        department: 'AI & Research',
        location: 'Redmond, WA',
        type: 'full-time',
        posted_date: '2025-07-07',
        application_count: 203
      }
    ],
    employee_testimonials: [
      {
        id: '3',
        employee_name: 'Alex Rodriguez',
        employee_title: 'Principal Program Manager',
        employee_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        content: 'Microsoft truly lives up to its mission of empowering people. The support for professional growth and work-life balance is exceptional.',
        rating: 5,
        tenure: '6 years',
        department: 'Azure'
      }
    ],
    diversity_data: {
      gender_diversity: { male: 70, female: 28, other: 2 },
      age_diversity: { under_25: 12, age_25_34: 42, age_35_44: 28, over_45: 18 },
      ethnicity_diversity: { 'White': 52, 'Asian': 31, 'Hispanic': 7, 'Black': 6, 'Other': 4 },
      leadership_diversity: 32
    },
    sustainability_initiatives: [
      {
        id: '3',
        title: 'Carbon Negative by 2030',
        description: 'Going beyond carbon neutral to be carbon negative by 2030',
        category: 'environmental',
        impact_metric: 'Remove all carbon emitted since 1975'
      }
    ]
  },
  {
    id: '3',
    name: 'Apple',
    logo_url: 'https://logo.clearbit.com/apple.com',
    cover_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.',
    mission_statement: 'To bring the best user experience to customers through innovative hardware, software, and services.',
    industry: 'Technology',
    company_size: '10,000+ employees',
    founded_year: 1976,
    location: 'Cupertino, CA',
    website_url: 'https://apple.com',
    linkedin_url: 'https://linkedin.com/company/apple',
    twitter_url: 'https://twitter.com/apple',
    employee_count: 164000,
    rating: 4.3,
    reviews_count: 8234,
    is_following: false,
    is_verified: true,
    is_hiring: true,
    featured_benefits: ['Healthcare', 'Employee Discounts', 'Wellness Programs', 'Stock Purchase'],
    growth_rate: 8,
    benefits: [
      {
        id: '1',
        category: 'health',
        title: 'Apple Health',
        description: 'Comprehensive health and wellness programs including on-site fitness centers',
        icon: 'health'
      },
      {
        id: '2',
        category: 'perks',
        title: 'Product Discounts',
        description: 'Generous discounts on Apple products for employees and family',
        icon: 'discount'
      },
      {
        id: '3',
        category: 'financial',
        title: 'Stock Purchase Plan',
        description: 'Employee stock purchase plan with company matching',
        icon: 'money'
      }
    ],
    values: [
      {
        id: '1',
        title: 'Innovation',
        description: 'We believe in the power of innovation to enrich lives',
        icon: 'innovation'
      },
      {
        id: '2',
        title: 'Quality',
        description: 'We are committed to creating products of the highest quality',
        icon: 'excellence'
      },
      {
        id: '3',
        title: 'Privacy',
        description: 'Privacy is a fundamental human right',
        icon: 'privacy'
      }
    ],
    offices: [
      {
        id: '1',
        name: 'Apple Park',
        address: 'One Apple Park Way',
        city: 'Cupertino',
        country: 'USA',
        is_headquarters: true,
        employee_count: 12000,
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
      }
    ],
    stats: {
      total_employees: 164000,
      avg_tenure: '4.1 years',
      employee_satisfaction: 87,
      glassdoor_rating: 4.3,
      total_jobs_posted: 956,
      successful_hires: 8900
    },
    recent_jobs: [
      {
        id: '6',
        title: 'iOS Developer',
        department: 'Software Engineering',
        location: 'Cupertino, CA',
        type: 'full-time',
        posted_date: '2025-07-08',
        application_count: 145
      }
    ],
    employee_testimonials: [
      {
        id: '4',
        employee_name: 'Emily Zhang',
        employee_title: 'Hardware Engineer',
        employee_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        content: 'Working at Apple means being part of something bigger. Every day I get to work on products that millions of people will use and love.',
        rating: 4,
        tenure: '3 years',
        department: 'Hardware'
      }
    ],
    diversity_data: {
      gender_diversity: { male: 65, female: 33, other: 2 },
      age_diversity: { under_25: 18, age_25_34: 48, age_35_44: 22, over_45: 12 },
      ethnicity_diversity: { 'White': 56, 'Asian': 24, 'Hispanic': 13, 'Black': 4, 'Other': 3 },
      leadership_diversity: 28
    },
    sustainability_initiatives: [
      {
        id: '4',
        title: 'Carbon Neutral Products',
        description: 'All Apple products will be carbon neutral by 2030',
        category: 'environmental',
        impact_metric: '75% reduction in emissions'
      }
    ]
  },
  {
    id: '4',
    name: 'Tesla',
    logo_url: 'https://logo.clearbit.com/tesla.com',
    cover_image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=400&fit=crop',
    description: 'Tesla, Inc. is an American electric vehicle and clean energy company based in Austin, Texas. Tesla designs and manufactures electric vehicles, energy storage systems, and solar panels.',
    mission_statement: 'To accelerate the world\'s transition to sustainable energy.',
    industry: 'Automotive',
    company_size: '1,000-10,000 employees',
    founded_year: 2003,
    location: 'Austin, TX',
    website_url: 'https://tesla.com',
    linkedin_url: 'https://linkedin.com/company/tesla-motors',
    employee_count: 127855,
    rating: 4.1,
    reviews_count: 5432,
    is_following: false,
    is_verified: true,
    is_hiring: true,
    featured_benefits: ['Stock Options', 'Healthcare', 'Innovation Time', 'Free Charging'],
    growth_rate: 25,
    benefits: [
      {
        id: '1',
        category: 'financial',
        title: 'Stock Options',
        description: 'Equity participation in Tesla\'s mission to accelerate sustainable energy',
        icon: 'money'
      },
      {
        id: '2',
        category: 'perks',
        title: 'Free Supercharging',
        description: 'Free use of Tesla Supercharger network for all employees',
        icon: 'charging'
      },
      {
        id: '3',
        category: 'learning',
        title: 'Innovation Time',
        description: 'Dedicated time for personal projects and innovation',
        icon: 'innovation'
      }
    ],
    values: [
      {
        id: '1',
        title: 'Sustainability',
        description: 'Accelerating the world\'s transition to sustainable energy',
        icon: 'sustainability'
      },
      {
        id: '2',
        title: 'Innovation',
        description: 'Pushing the boundaries of what\'s possible',
        icon: 'innovation'
      },
      {
        id: '3',
        title: 'Excellence',
        description: 'Delivering the best products in the world',
        icon: 'excellence'
      }
    ],
    offices: [
      {
        id: '1',
        name: 'Gigafactory Texas',
        address: '13101 Harold Green Rd',
        city: 'Austin',
        country: 'USA',
        is_headquarters: true,
        employee_count: 20000,
        image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'
      }
    ],
    stats: {
      total_employees: 127855,
      avg_tenure: '2.8 years',
      employee_satisfaction: 83,
      glassdoor_rating: 4.1,
      total_jobs_posted: 1287,
      successful_hires: 18500
    },
    recent_jobs: [
      {
        id: '7',
        title: 'Manufacturing Engineer',
        department: 'Manufacturing',
        location: 'Austin, TX',
        type: 'full-time',
        posted_date: '2025-07-09',
        application_count: 287
      },
      {
        id: '8',
        title: 'Autopilot Software Engineer',
        department: 'Autopilot',
        location: 'Palo Alto, CA',
        type: 'full-time',
        posted_date: '2025-07-08',
        application_count: 412
      }
    ],
    employee_testimonials: [
      {
        id: '5',
        employee_name: 'David Kim',
        employee_title: 'Battery Engineer',
        employee_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        content: 'Tesla is more than a job - it\'s a mission. Every day I work on technology that will help save the planet. The pace is intense but incredibly rewarding.',
        rating: 4,
        tenure: '2 years',
        department: 'Energy'
      }
    ],
    diversity_data: {
      gender_diversity: { male: 75, female: 23, other: 2 },
      age_diversity: { under_25: 22, age_25_34: 52, age_35_44: 18, over_45: 8 },
      ethnicity_diversity: { 'White': 45, 'Asian': 28, 'Hispanic': 18, 'Black': 6, 'Other': 3 },
      leadership_diversity: 25
    },
    sustainability_initiatives: [
      {
        id: '5',
        title: 'Sustainable Manufacturing',
        description: 'Zero waste to landfill in all Tesla factories',
        category: 'environmental',
        impact_metric: '100% renewable energy in factories'
      }
    ]
  },
  {
    id: '5',
    name: 'Netflix',
    logo_url: 'https://logo.clearbit.com/netflix.com',
    cover_image_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&h=400&fit=crop',
    description: 'Netflix is the world\'s leading streaming entertainment service with over 230 million paid memberships in more than 190 countries enjoying TV series, documentaries and feature films.',
    mission_statement: 'To entertain the world.',
    industry: 'Entertainment',
    company_size: '1,000-10,000 employees',
    founded_year: 1997,
    location: 'Los Gatos, CA',
    website_url: 'https://netflix.com',
    linkedin_url: 'https://linkedin.com/company/netflix',
    employee_count: 11300,
    rating: 4.2,
    reviews_count: 3456,
    is_following: false,
    is_verified: true,
    is_hiring: true,
    featured_benefits: ['Unlimited PTO', 'Parental Leave', 'Learning Budget', 'Content Access'],
    growth_rate: 18,
    benefits: [
      {
        id: '1',
        category: 'time-off',
        title: 'Unlimited PTO',
        description: 'Take time off when you need it to do your best work',
        icon: 'vacation'
      },
      {
        id: '2',
        category: 'family',
        title: 'Parental Leave',
        description: 'Up to 52 weeks of paid parental leave',
        icon: 'family'
      },
      {
        id: '3',
        category: 'learning',
        title: 'Learning & Development',
        description: 'Annual budget for professional development and courses',
        icon: 'education'
      },
      {
        id: '4',
        category: 'perks',
        title: 'Netflix Access',
        description: 'Free Netflix subscription and early access to content',
        icon: 'entertainment'
      }
    ],
    values: [
      {
        id: '1',
        title: 'Judgment',
        description: 'You make wise decisions despite ambiguity',
        icon: 'judgment'
      },
      {
        id: '2',
        title: 'Communication',
        description: 'You are concise and articulate in speech and writing',
        icon: 'communication'
      },
      {
        id: '3',
        title: 'Curiosity',
        description: 'You learn rapidly and eagerly',
        icon: 'curiosity'
      }
    ],
    offices: [
      {
        id: '1',
        name: 'Netflix HQ',
        address: '100 Winchester Cir',
        city: 'Los Gatos',
        country: 'USA',
        is_headquarters: true,
        employee_count: 2000,
        image_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop'
      }
    ],
    stats: {
      total_employees: 11300,
      avg_tenure: '3.2 years',
      employee_satisfaction: 91,
      glassdoor_rating: 4.2,
      total_jobs_posted: 287,
      successful_hires: 1200
    },
    recent_jobs: [
      {
        id: '9',
        title: 'Content Strategy Manager',
        department: 'Content',
        location: 'Los Angeles, CA',
        type: 'full-time',
        posted_date: '2025-07-07',
        application_count: 78
      },
      {
        id: '10',
        title: 'Data Scientist',
        department: 'Analytics',
        location: 'Los Gatos, CA',
        type: 'full-time',
        posted_date: '2025-07-06',
        application_count: 134
      }
    ],
    employee_testimonials: [
      {
        id: '6',
        employee_name: 'Maria Santos',
        employee_title: 'Senior Data Scientist',
        employee_avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        content: 'Netflix gives you the freedom to do your best work. The culture of trust and autonomy is unlike anywhere else I\'ve worked.',
        rating: 5,
        tenure: '4 years',
        department: 'Data Science'
      }
    ],
    diversity_data: {
      gender_diversity: { male: 58, female: 40, other: 2 },
      age_diversity: { under_25: 15, age_25_34: 50, age_35_44: 25, over_45: 10 },
      ethnicity_diversity: { 'White': 42, 'Asian': 32, 'Hispanic': 15, 'Black': 8, 'Other': 3 },
      leadership_diversity: 45
    },
    sustainability_initiatives: [
      {
        id: '6',
        title: 'Net Zero Emissions',
        description: 'Achieving net zero greenhouse gas emissions by 2022',
        category: 'environmental',
        impact_metric: 'Carbon neutral since 2017'
      }
    ]
  },
  {
    id: '6',
    name: 'Airbnb',
    logo_url: 'https://logo.clearbit.com/airbnb.com',
    cover_image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop',
    description: 'Airbnb is a global platform that connects millions of hosts and travelers to create unique, personalized travel experiences.',
    mission_statement: 'To create a world where anyone can belong anywhere.',
    industry: 'Travel',
    company_size: '1,000-10,000 employees',
    founded_year: 2008,
    location: 'San Francisco, CA',
    website_url: 'https://airbnb.com',
    linkedin_url: 'https://linkedin.com/company/airbnb',
    employee_count: 6407,
    rating: 4.0,
    reviews_count: 2789,
    is_following: false,
    is_verified: true,
    is_hiring: true,
    featured_benefits: ['Travel Credits', 'Healthcare', 'Flexible Work', 'Sabbatical'],
    growth_rate: 22,
    benefits: [
      {
        id: '1',
        category: 'perks',
        title: 'Annual Travel Credit',
        description: '$2,000 annual credit to travel and experience Airbnb',
        icon: 'travel'
      },
      {
        id: '2',
        category: 'time-off',
        title: 'Flexible Work',
        description: 'Work from anywhere with quarterly team gatherings',
        icon: 'remote'
      },
      {
        id: '3',
        category: 'time-off',
        title: 'Sabbatical Program',
        description: 'Take a sabbatical after 7 years with full benefits',
        icon: 'sabbatical'
      }
    ],
    values: [
      {
        id: '1',
        title: 'Belong Anywhere',
        description: 'Champion the mission and be an ambassador of belonging',
        icon: 'belonging'
      },
      {
        id: '2',
        title: 'Be a Cereal Entrepreneur',
        description: 'Show resourcefulness and grit in the face of any challenge',
        icon: 'entrepreneurship'
      },
      {
        id: '3',
        title: 'Be a Host',
        description: 'Take ownership and champion your guests\' success',
        icon: 'host'
      }
    ],
    offices: [
      {
        id: '1',
        name: 'Airbnb HQ',
        address: '888 Brannan Street',
        city: 'San Francisco',
        country: 'USA',
        is_headquarters: true,
        employee_count: 1500,
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
      }
    ],
    stats: {
      total_employees: 6407,
      avg_tenure: '2.9 years',
      employee_satisfaction: 85,
      glassdoor_rating: 4.0,
      total_jobs_posted: 156,
      successful_hires: 890
    },
    recent_jobs: [
      {
        id: '11',
        title: 'Trust & Safety Specialist',
        department: 'Trust & Safety',
        location: 'San Francisco, CA',
        type: 'full-time',
        posted_date: '2025-07-08',
        application_count: 95
      }
    ],
    employee_testimonials: [
      {
        id: '7',
        employee_name: 'James Park',
        employee_title: 'Product Manager',
        employee_avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
        content: 'Airbnb truly lives its mission. The sense of belonging and community here is incredible, and the impact we have on travelers worldwide is meaningful.',
        rating: 4,
        tenure: '3 years',
        department: 'Product'
      }
    ],
    diversity_data: {
      gender_diversity: { male: 54, female: 44, other: 2 },
      age_diversity: { under_25: 20, age_25_34: 55, age_35_44: 20, over_45: 5 },
      ethnicity_diversity: { 'White': 38, 'Asian': 35, 'Hispanic': 12, 'Black': 8, 'Other': 7 },
      leadership_diversity: 52
    },
    sustainability_initiatives: [
      {
        id: '7',
        title: 'Sustainable Travel',
        description: 'Promoting sustainable travel practices and eco-friendly accommodations',
        category: 'environmental',
        impact_metric: '50% reduction in travel emissions'
      }
    ]
  }
];

// Additional mock data for job listings
export const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    company_id: '1',
    location: 'Mountain View, CA',
    type: 'full-time',
    salary_range: '$150,000 - $250,000',
    posted_date: '2025-07-08',
    description: 'Join our team to build next-generation software solutions that impact billions of users worldwide.',
    requirements: ['5+ years of software development experience', 'Proficiency in Java, Python, or C++', 'Experience with distributed systems'],
    benefits: ['Competitive salary', 'Stock options', 'Healthcare', 'Learning budget'],
    remote: false,
    experience_level: 'senior',
    department: 'Engineering'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Google',
    company_id: '1',
    location: 'New York, NY',
    type: 'full-time',
    salary_range: '$140,000 - $220,000',
    posted_date: '2025-07-06',
    description: 'Lead product strategy and development for consumer-facing applications.',
    requirements: ['3+ years of product management experience', 'Strong analytical skills', 'Experience with user research'],
    benefits: ['Competitive salary', 'Stock options', 'Healthcare', 'Learning budget'],
    remote: true,
    experience_level: 'mid',
    department: 'Product'
  },
  // Add more jobs for other companies...
];

// Mock data for industries
export const mockIndustries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Automotive',
  'Entertainment',
  'Travel',
  'Consulting',
  'Real Estate',
  'Food & Beverage'
];

// Mock data for locations
export const mockLocations = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Los Angeles, CA',
  'Chicago, IL',
  'Denver, CO',
  'Atlanta, GA',
  'Remote'
];

// Mock data for company sizes
export const mockCompanySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1,000 employees',
  '1,001-5,000 employees',
  '5,001-10,000 employees',
  '10,000+ employees'
];