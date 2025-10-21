import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useScrollTrigger, useScrollTriggerStagger } from '../hooks/useScrollTrigger';
import { 
  Smartphone, 
  Download, 
  Star, 
  Users, 
  Bell, 
  MessageCircle, 
  Calendar, 
  Search,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Heart,
  Share2,
  Sparkles,
  Coffee,
  Award,
  Target,
  Eye,
  Layers,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

// UI Components
import { Card } from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Badge from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

export default function MobileAppPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // Refs for different sections
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const screenshotsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic scroll animations using custom hooks
  useScrollTrigger(heroRef, (element, progress) => {
    gsap.set(element, {
      opacity: 1,
      y: progress * -50,
      scale: 1 + (progress * 0.05),
      ease: 'none'
    });
  }, { start: 'top 80%', end: 'bottom 20%', scrub: 1 });

  useScrollTriggerStagger(featuresRef, '.feature-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.1;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 60,
        rotationX: (1 - elementProgress) * 45,
        transformOrigin: 'center bottom',
        ease: 'none'
      });
    });
  }, { start: 'top 70%', end: 'bottom 30%', scrub: 2 });

  useScrollTriggerStagger(screenshotsRef, '.screenshot-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.15;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      gsap.set(element, {
        opacity: elementProgress,
        scale: 0.8 + (elementProgress * 0.2),
        rotation: (1 - elementProgress) * (index % 2 === 0 ? 10 : -10),
        ease: 'none'
      });
    });
  }, { start: 'top 60%', end: 'bottom 40%', scrub: 1.5 });

  // Enhanced entrance animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero section entrance
      gsap.fromTo('.hero-content', {
        opacity: 0,
        y: 100,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.2
      });

      // Phone mockup animation
      gsap.fromTo('.phone-mockup', {
        opacity: 0,
        scale: 0.5,
        rotation: -15,
        y: 50
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 1.8,
        ease: 'elastic.out(1, 0.8)',
        delay: 0.5
      });

      // Floating elements
      gsap.to('.floating-element', {
        y: -20,
        x: 10,
        rotation: 360,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
      });

      // Benefits section with stagger
      gsap.fromTo('.benefit-item', {
        opacity: 0,
        x: -50,
        scale: 0.8
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      // Testimonials carousel effect
      gsap.to('.testimonial-card', {
        x: '-100%',
        duration: 20,
        repeat: -1,
        ease: 'none',
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % 100)
        }
      });

      // Download section with bounce
      gsap.fromTo('.download-section', {
        opacity: 0,
        y: 50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: downloadRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Job Search",
      description: "AI-powered job matching that learns your preferences and suggests the perfect opportunities for your career path.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Instant Notifications",
      description: "Never miss an opportunity with real-time alerts for new job postings, application updates, and interview invitations.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Direct Messaging",
      description: "Connect directly with recruiters and hiring managers through our secure in-app messaging system.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Event Management",
      description: "Discover and register for career fairs, networking events, and workshops right from your phone.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Career Analytics",
      description: "Track your application progress and get insights on your career journey with detailed analytics.",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls you can trust.",
      color: "from-gray-500 to-gray-700"
    }
  ];

  const screenshots = [
    {
      title: "Dashboard",
      description: "Your personalized career hub",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop&crop=center"
    },
    {
      title: "Job Search",
      description: "Find your perfect match",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=600&fit=crop&crop=center"
    },
    {
      title: "Applications",
      description: "Track your progress",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=600&fit=crop&crop=center"
    },
    {
      title: "Messages",
      description: "Connect with recruiters",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=300&h=600&fit=crop&crop=center"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      content: "The mobile app made job hunting so much easier! I found my dream job in just 2 weeks.",
      rating: 5,
      // Remove avatar to use initials fallback
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Digital Agency",
      content: "The notification system is amazing. I never missed an important update about my applications.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Analytics Co",
      content: "The career analytics feature helped me understand my strengths and improve my applications.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ];

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-xl z-50 border-b shadow-lg transition-colors duration-300 ${
        isDark ? 'bg-dark-surface/90 border-lime/20' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Smartphone className={`h-8 w-8 ${isDark ? 'text-lime' : 'text-asu-maroon'}`} />
              <span className={`font-bold text-xl ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                ASU Mobile
              </span>
            </div>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              className="hover:scale-105 transition-transform duration-200"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className={`pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-dark-surface to-dark-bg' : 'bg-gradient-to-br from-white to-gray-50'
      }`}>
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`floating-element absolute top-20 left-10 w-4 h-4 rounded-full ${
            isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
          }`} />
          <div className={`floating-element absolute top-40 right-20 w-6 h-6 rounded-full ${
            isDark ? 'bg-dark-accent/30' : 'bg-asu-gold/30'
          }`} />
          <div className={`floating-element absolute bottom-20 left-1/4 w-3 h-3 rounded-full ${
            isDark ? 'bg-lime/25' : 'bg-asu-maroon/25'
          }`} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="hero-content text-center lg:text-left">
              <Badge variant="outline" className="mb-4 sm:mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Now Available
              </Badge>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                Your Career
                <span className={`block bg-clip-text text-transparent ${
                  isDark 
                    ? 'bg-gradient-to-r from-lime to-dark-accent' 
                    : 'bg-gradient-to-r from-asu-maroon to-asu-gold'
                }`}>
                  In Your Pocket
                </span>
              </h1>
              <p className={`text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Take control of your career journey with the ASU Handshake mobile app. 
                Search jobs, track applications, and connect with employers - all on the go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8 justify-center lg:justify-start">
                <Button
                  variant="contained"
                  size="large"
                  className="group transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  <Download className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Download Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className="group transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-6">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className={`ml-2 text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    4.9 (2,847 reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2" />
                  <span className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    50K+ downloads
                  </span>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="phone-mockup relative">
                <div className={`w-72 sm:w-80 h-[500px] sm:h-96 rounded-3xl shadow-2xl overflow-hidden border-8 ${
                  isDark ? 'border-dark-surface bg-dark-bg' : 'border-gray-200 bg-white'
                }`}>
                  {/* Phone status bar */}
                  <div className={`h-6 flex items-center justify-between px-4 text-xs ${
                    isDark ? 'bg-dark-surface text-dark-text' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <Signal className="h-3 w-3" />
                      <Wifi className="h-3 w-3" />
                      <Battery className="h-3 w-3" />
                    </div>
                  </div>
                  
                  {/* App interface */}
                  <div className="p-4 sm:p-6 h-full">
                    <div className="mb-4">
                      <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                        Good morning, Sarah!
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                        3 new job matches
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-3 rounded-lg border ${
                          isDark ? 'bg-dark-surface border-lime/20' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-semibold text-sm ${
                                isDark ? 'text-dark-text' : 'text-gray-900'
                              }`}>
                                Software Engineer
                              </p>
                              <p className={`text-xs ${
                                isDark ? 'text-dark-muted' : 'text-gray-600'
                              }`}>
                                Tech Company
                              </p>
                            </div>
                            <div className={`w-8 h-8 rounded-full ${
                              isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Everything you need to accelerate your career journey, right in your pocket
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section ref={screenshotsRef} className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              See It In Action
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Explore the intuitive interface designed for modern job seekers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="screenshot-card group">
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-w-9 aspect-h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    <img 
                      src={screenshot.image} 
                      alt={screenshot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-bold mb-2 ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>
                      {screenshot.title}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      {screenshot.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-dark-surface' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                Why Choose Our Mobile App?
              </h2>
              <div className="space-y-4">
                {[
                  'Apply to jobs with one tap',
                  'Get notifications for new opportunities',
                  'Track application status in real-time',
                  'Connect with recruiters instantly',
                  'Access career resources offline',
                  'Sync across all your devices'
                ].map((benefit, index) => (
                  <div key={index} className="benefit-item flex items-center space-x-3">
                    <CheckCircle className={`h-6 w-6 ${
                      isDark ? 'text-lime' : 'text-green-500'
                    }`} />
                    <span className={`text-lg ${
                      isDark ? 'text-dark-text' : 'text-gray-700'
                    }`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className={`w-72 h-96 rounded-3xl shadow-2xl overflow-hidden border-8 ${
                  isDark ? 'border-dark-surface bg-dark-bg' : 'border-gray-200 bg-white'
                }`}>
                  <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                    <Target className={`h-16 w-16 mb-4 ${
                      isDark ? 'text-lime' : 'text-asu-maroon'
                    }`} />
                    <h3 className={`text-xl font-bold mb-2 ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>
                      Career Success
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-dark-muted' : 'text-gray-600'
                    }`}>
                      Everything you need to land your dream job
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className={`py-20 px-4 sm:px-6 lg:px-8 overflow-hidden ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              What Students Say
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Join thousands of successful students who found their dream jobs
            </p>
          </div>

          <div className="relative">
            <div className="flex space-x-8 testimonial-carousel">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card key={index} className="testimonial-card flex-shrink-0 w-96">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className={`font-bold ${
                          isDark ? 'text-dark-text' : 'text-gray-900'
                        }`}>
                          {testimonial.name}
                        </h4>
                        <p className={`text-sm ${
                          isDark ? 'text-dark-muted' : 'text-gray-600'
                        }`}>
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className={`${isDark ? 'text-dark-muted' : 'text-gray-600'}`}>
                      "{testimonial.content}"
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section ref={downloadRef} className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-gradient-to-br from-dark-surface to-dark-bg' : 'bg-gradient-to-br from-white to-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="download-section">
            <h2 className={`text-4xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Ready to Start Your Journey?
            </h2>
            <p className={`text-xl mb-8 ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Download the ASU Handshake mobile app today and take the first step towards your dream career
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                variant="contained"
                size="large"
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Download for iOS
              </Button>
              <Button
                variant="contained"
                size="large"
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Download for Android
              </Button>
            </div>
            <p className={`text-sm ${isDark ? 'text-dark-muted' : 'text-gray-500'}`}>
              Free download • No credit card required • Available worldwide
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}