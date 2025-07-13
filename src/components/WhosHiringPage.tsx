import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  GraduationCap,
  Search,
  Building2,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Filter,
  Briefcase,
  TrendingUp,
  Award,
  Globe,
  Heart,
  Smartphone,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

// Material Design UI Components
import { Card } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Badge from './ui/Badge';
import Input from './ui/Input';
import Select from './ui/Select';

gsap.registerPlugin(ScrollTrigger);

export default function WhosHiringPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const employersRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo('.hero-content', {
        opacity: 0,
        y: 80,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });

      // Category cards
      gsap.fromTo('.category-card', {
        opacity: 0,
        y: 60,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Employer cards
      gsap.fromTo('.employer-card', {
        opacity: 0,
        y: 40,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: employersRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    {
      name: 'Technology',
      count: 1200,
      companies: [
        { name: 'Google' },
        { name: 'Microsoft' },
        { name: 'Apple' },
        { name: 'Amazon' }
      ]
    },
    {
      name: 'Consulting',
      count: 950,
      companies: [
        { name: 'McKinsey & Company' },
        { name: 'Boston Consulting Group' },
        { name: 'Bain & Company' },
        { name: 'Deloitte' }
      ]
    },
    {
      name: 'Engineering',
      count: 800,
      companies: [
        { name: 'Tesla' },
        { name: 'SpaceX' },
        { name: 'Boeing' },
        { name: 'Lockheed Martin' }
      ]
    },
    {
      name: 'Data Science',
      count: 750,
      companies: [
        { name: 'Netflix' },
        { name: 'Spotify' },
        { name: 'Airbnb' },
        { name: 'Elastic' }
      ]
    },
    {
      name: 'Media',
      count: 450,
      companies: [
        { name: 'New York Times' },
        { name: 'Bloomberg' },
        { name: 'Verizon' },
        { name: 'Hearst' }
      ]
    },
    {
      name: 'Finance',
      count: 850,
      companies: [
        { name: 'Ernst & Young' },
        { name: 'Bank of America' },
        { name: 'Deutsche Bank' },
        { name: 'UBS' }
      ]
    },
    {
      name: 'Healthcare',
      count: 650,
      companies: [
        { name: 'Johnson & Johnson' },
        { name: 'Pfizer' },
        { name: 'Boston Scientific' },
        { name: 'FDA' }
      ]
    }
  ];

  const topEmployers = [
    { name: 'Under Armour', jobs: 45, locations: ['Baltimore', 'New York', 'Austin'] },
    { name: 'Google', jobs: 120, locations: ['San Francisco', 'New York', 'Austin'] },
    { name: 'Microsoft', jobs: 85, locations: ['Seattle', 'New York', 'Austin'] },
    { name: 'Apple', jobs: 92, locations: ['Cupertino', 'Austin', 'New York'] },
    { name: 'Amazon', jobs: 156, locations: ['Seattle', 'Austin', 'New York'] },
    { name: 'Meta', jobs: 78, locations: ['Menlo Park', 'Austin', 'New York'] }
  ];

  const cities = [
    { name: 'New York', count: 2500 },
    { name: 'San Francisco', count: 1800 },
    { name: 'Boston', count: 1200 },
    { name: 'Chicago', count: 1100 },
    { name: 'Washington DC', count: 900 },
    { name: 'Austin', count: 800 },
    { name: 'Seattle', count: 750 },
    { name: 'Los Angeles', count: 700 }
  ];

  const filteredEmployers = topEmployers.filter(employer => {
    const matchesSearch = employer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-xl z-50 bg-white/95 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Handshake
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/whos-hiring" className="text-purple-600 font-bold">
                Who's hiring
              </Link>
              <Link to="/career-tips" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Career tips
              </Link>
              <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-200 shadow-lg hover:shadow-xl">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="hero-content">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-orange-500 mb-8"
                style={{ 
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em'
                }}>
              In-demand employers
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-12">
              for every career path
            </h2>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-16 leading-relaxed">
              From startups to the Fortune 500, discover companies actively hiring students and new graduates
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 p-3 bg-white rounded-2xl shadow-2xl">
                <Input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 text-lg"
                  startIcon={<Search className="h-5 w-5 text-gray-400" />}
                />
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="md:w-48"
                >
                  <option value="all">All locations</option>
                  {cities.map(city => (
                    <option key={city.name} value={city.name.toLowerCase()}>
                      {city.name} ({city.count})
                    </option>
                  ))}
                </Select>
                <Button 
                  variant="contained" 
                  size="large"
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Explore by <span className="text-orange-500">industry</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover top employers across different sectors actively recruiting talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="category-card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                    <Badge className="bg-purple-100 text-purple-800">
                      {category.count} jobs
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {category.companies.map((company, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          {/* <img 
                            src={company.logo} 
                            alt={company.name}
                            className="w-6 h-6 object-contain"
                          /> */}
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">{company.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    endIcon={<ArrowRight className="h-4 w-4" />}
                    className="group-hover:bg-purple-600 group-hover:text-white transition-colors"
                  >
                    View all {category.name} jobs
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Employers Section */}
      <section ref={employersRef} className="py-24 px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              <span className="text-orange-500">100 top employers</span> hiring now
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check out companies recruiting students right now for paid internships and jobs in New York, Boston, Chicago, Washington DC, and more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((employer, index) => (
              <Card key={index} className="employer-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      {/* <img 
                        src={employer.logo} 
                        alt={employer.name}
                        className="w-10 h-10 object-contain"
                      /> */}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{employer.name}</h3>
                      <p className="text-purple-600 font-semibold">{employer.jobs} open positions</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>Top locations:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {employer.locations.map((location, idx) => (
                        <Badge key={idx} variant="outlined" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="contained" 
                      size="small" 
                      fullWidth
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      View jobs
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      endIcon={<ExternalLink className="h-4 w-4" />}
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="contained" 
              size="large"
              className="px-12 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg"
            >
              See the full list
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            
            <blockquote className="text-2xl md:text-3xl text-white font-medium mb-8 italic">
              "Using Handshake, my team at Under Armour engages talent as far as San Francisco, Atlanta, Chicago, and Detroit."
            </blockquote>
            
            <div className="text-white/80">
              <p className="font-bold text-lg">Bryan Kaminski</p>
              <p>Director of Talent Acquisition and Talent Programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-8">
            Find the right jobs for you. 
            <span className="text-orange-500"> Get hired.</span>
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl shadow-lg">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 border-0 bg-transparent rounded-xl focus:outline-none focus:ring-0"
              />
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Students</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find your next job</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Who's hiring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Employers</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hire top talent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Request demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Career centers</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support students</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing toolkit</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Join us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                ©2024 Handshake. All rights reserved
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}