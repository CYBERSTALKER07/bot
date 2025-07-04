import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Search, 
  CheckCircle, 
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Target,
  Globe,
  Zap,
  Heart,
  Shield,
  Briefcase,
  Calendar,
  MessageSquare,
  Play,
  ChevronDown,
  User,
  Sparkles,
  BookOpen,
  Code,
  Laptop,
  Trophy
} from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const companyLogos = [
  { 
    name: 'Google', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    color: '#4285F4'
  },
  { 
    name: 'Microsoft', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg',
    color: '#00A4EF'
  },
  { 
    name: 'Apple', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
    color: '#000000'
  },
  { 
    name: 'Amazon', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    color: '#FF9900'
  },
  { 
    name: 'Meta', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
    color: '#1877F2'
  },
  { 
    name: 'Netflix', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMzk4IDBoLS43OTZBMSAxIDAgMCAwIDQgMXYyMmExIDEgMCAwIDAgLjYwMi45MmwxMS4yIDIuOGMuMzA4LjA3Ny42MTgtLjEyNi42MjItLjQ0NEwyMCAzLjIzNmMwLS4zLS4yNDgtLjU0LS41NDgtLjQ5OGwtOC4wNSAxLjEwNkE1LjM5OCA1LjM5OCAwIDAgMCA1LjM5OCAwWiIgZmlsbD0iI0UyMDYxNCIvPgo8L3N2Zz4K',
    color: '#E20614'
  },
  { 
    name: 'Adobe', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/adobe/adobe-original.svg',
    color: '#FF0000'
  },
  { 
    name: 'Tesla', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEuNUw4LjkgNC43NkM5LjYgNC4zNSAxMC40IDQuMDUgMTEuMzMgMy45MmMuNjctLjEzIDEuMzMtLjEzIDIgDBjLjkzLjEzIDEuNzMuNDMgMi40My44NGwtMy4xLTMuMjZaIiBmaWxsPSIjQ0MwMDAwIi8+CjxwYXRoIGQ9Ik0xMiAyMi41TDE1LjEgMTkuMjRDMTQuNDUgMTkuNjYgMTMuNjUgMTkuOTYgMTIuNjcgMjAuMDhjLS42Ny4xMy0xLjMzLjEzLTIgMGMtLjkzLS4xMy0xLjczLS40My0yLjQzLS44NGwzLjEgMy4yNloiIGZpbGw9IiNDQzAwMDAiLz4KPC9zdmc+',
    color: '#CC0000'
  },
  { 
    name: 'Spotify', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spotify/spotify-original.svg',
    color: '#1DB954'
  },
  { 
    name: 'Uber', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCAxMkMyNCA1LjM3MjU4IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTggMCAwIDUuMzcyNTggMCAxMkMwIDE4LjYyNzQgNS4zNzI1OCAyNCAxMiAyNFoiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTEyIDIwQzE2LjQxODMgMjAgMjAgMTYuNDE4MyAyMCAxMkMyMCA3LjU4MTcyIDE2LjQxODMgNCAxMiA0QzcuNTgxNzIgNCA0IDcuNTgxNzIgNCAxMkM0IDE2LjQxODMgNy41ODE3MiAyMCAxMiAyMFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
    color: '#000000'
  },
  { 
    name: 'Intel', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intel/intel-original.svg',
    color: '#0071C5'
  },
  { 
    name: 'Airbnb', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0YzAgMC0xLjItLjctMi40LTJDNy4yIDIwIDQgMTYgNCAxMi44IDQgOC4yIDcuNiA0LjQgMTIgNC40czggMy44IDggOC40YzAgMy4yLTMuMiA3LjItNS42IDkuNkMxMy4yIDIzLjMgMTIgMjQgMTIgMjRaIiBmaWxsPSIjRkY1QTVGIi8+Cjwvc3ZnPg==',
    color: '#FF5A5F'
  }
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced Hero Section Animations
      const heroTl = gsap.timeline();
      
      heroTl.from('.hero-title', {
        duration: 1.5,
        y: 120,
        opacity: 0,
        ease: 'power4.out',
        rotation: 5
      })
      .from('.hero-subtitle', {
        duration: 1.2,
        y: 60,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.8')
      .from('.hero-buttons', {
        duration: 1,
        y: 40,
        opacity: 0,
        scale: 0.9,
        ease: 'back.out(1.7)'
      }, '-=0.6')
      .from('.hero-mockup', {
        duration: 2,
        scale: 0.7,
        opacity: 0,
        rotation: -10,
        ease: 'power3.out'
      }, '-=1.2')
      .from('.hero-stats-card', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.5')
      .from('.success-metric', {
        duration: 1.2,
        scale: 0.3,
        opacity: 0,
        ease: 'back.out(1.7)',
        stagger: 0.15
      }, '-=0.3')
      .to('.success-metric', {
        duration: 0.6,
        scale: 1.1,
        ease: 'power2.out'
      })
      .from('.floating-element', {
        duration: 1.5,
        scale: 0,
        opacity: 0,
        ease: 'elastic.out(1, 0.3)',
        stagger: 0.2
      }, '-=1');

      // Enhanced floating animations
      gsap.to('.float-1', {
        y: -30,
        x: 20,
        rotation: 360,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

      gsap.to('.float-2', {
        y: -25,
        x: -15,
        rotation: -180,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 0.7
      });

      gsap.to('.float-3', {
        y: -35,
        x: 10,
        rotation: 270,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1.2
      });

      // Sparkle animations
      gsap.to('.sparkle', {
        scale: 1.5,
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.3
      });

      // Enhanced company logos animation
      gsap.to('.company-scroll', {
        x: '-50%',
        duration: 30,
        repeat: -1,
        ease: 'none'
      });

      // Company logo hover effects
      gsap.utils.toArray('.company-logo').forEach((logo: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(logo, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: 'power2.out'
        });

        logo.addEventListener('mouseenter', () => tl.play());
        logo.addEventListener('mouseleave', () => tl.reverse());
      });

      // Enhanced stats counter animation - only numbers change
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          // Only animate the numbers, not the entire cards
          gsap.fromTo('.stat-number', 
            { textContent: 0, scale: 0.8 },
            {
              duration: 2.5,
              textContent: (index: any, target: any) => target.getAttribute('data-target'),
              scale: 1,
              snap: { textContent: 1 },
              ease: 'power2.out',
              stagger: 0.3
            }
          );

          // Animate labels independently
          gsap.fromTo('.stat-label', 
            { opacity: 0, y: 10 },
            {
              duration: 1,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.2,
              delay: 0.5
            }
          );

          // Add a subtle glow effect to active stat
          gsap.fromTo('.stat-glow',
            { opacity: 0, scale: 0 },
            {
              duration: 1.5,
              opacity: 0.3,
              scale: 1,
              ease: 'power2.out',
              stagger: 0.3,
              delay: 1
            }
          );
        }
      });

      // Company logos - only logos change position/scale
      ScrollTrigger.create({
        trigger: companiesRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate individual logo elements
          gsap.fromTo('.company-logo img',
            { scale: 0, rotation: 180, opacity: 0 },
            {
              duration: 1,
              scale: 1,
              rotation: 0,
              opacity: 1,
              ease: 'back.out(1.7)',
              stagger: 0.1
            }
          );

          // Animate company names separately
          gsap.fromTo('.company-name',
            { x: -20, opacity: 0 },
            {
              duration: 0.8,
              x: 0,
              opacity: 1,
              ease: 'power2.out',
              stagger: 0.1,
              delay: 0.3
            }
          );
        }
      });

      // Features section - Pinterest-style masonry animations
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate feature icons independently with different timings
          gsap.fromTo('.feature-icon', 
            { scale: 0, rotation: 360, opacity: 0 },
            {
              duration: 1.2,
              scale: 1.1,
              rotation: 0,
              opacity: 1,
              ease: 'elastic.out(1, 0.3)',
              stagger: {
                amount: 1.5,
                grid: [2, 3],
                from: "random"
              }
            }
          );

          // Animate feature titles with typewriter effect
          gsap.fromTo('.feature-title',
            { opacity: 0, y: 20 },
            {
              duration: 0.8,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.2,
              delay: 0.5
            }
          );

          // Animate feature descriptions
          gsap.fromTo('.feature-description',
            { opacity: 0, height: 0 },
            {
              duration: 1,
              opacity: 1,
              height: 'auto',
              ease: 'power2.out',
              stagger: 0.15,
              delay: 0.8
            }
          );

          // Animate feature list items individually
          gsap.fromTo('.feature-item',
            { x: -20, opacity: 0 },
            {
              duration: 0.6,
              x: 0,
              opacity: 1,
              ease: 'power2.out',
              stagger: 0.1,
              delay: 1.2
            }
          );

          // Animate benefit icons in additional section
          gsap.fromTo('.benefit-icon',
            { scale: 0, rotation: -180 },
            {
              duration: 1,
              scale: 1,
              rotation: 0,
              ease: 'back.out(1.7)',
              stagger: 0.2,
              delay: 1.5
            }
          );
        }
      });

      // How it works - animate step elements individually
      ScrollTrigger.create({
        trigger: howItWorksRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate step numbers with bounce
          gsap.fromTo('.step-number', 
            { scale: 0, y: -50, opacity: 0 },
            {
              duration: 1,
              scale: 1.05,
              y: 0,
              opacity: 1,
              ease: 'bounce.out',
              stagger: 0.3
            }
          );

          // Animate step icons separately
          gsap.fromTo('.step-icon',
            { scale: 0, rotation: 180 },
            {
              duration: 1.2,
              scale: 1.1,
              rotation: 0,
              ease: 'elastic.out(1, 0.3)',
              stagger: 0.2,
              delay: 0.5
            }
          );

          // Animate step titles
          gsap.fromTo('.step-title',
            { opacity: 0, x: -30 },
            {
              duration: 0.8,
              opacity: 1,
              x: 0,
              ease: 'power2.out',
              stagger: 0.3,
              delay: 0.8
            }
          );

          // Animate step descriptions
          gsap.fromTo('.step-description',
            { opacity: 0, y: 20 },
            {
              duration: 1,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.3,
              delay: 1.2
            }
          );

          // Animate connection lines
          gsap.fromTo('.connection-line',
            { scaleX: 0, opacity: 0 },
            {
              duration: 1.5,
              scaleX: 1,
              opacity: 1,
              ease: 'power2.out',
              stagger: 0.5,
              delay: 1.8
            }
          );
        }
      });

      // Testimonials - animate individual elements
      ScrollTrigger.create({
        trigger: testimonialsRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate testimonial avatars/emojis
          gsap.fromTo('.testimonial-avatar',
            { scale: 0, rotation: 360 },
            {
              duration: 1,
              scale: 1,
              rotation: 0,
              ease: 'back.out(1.7)',
              stagger: 0.2
            }
          );

          // Animate stars individually
          gsap.fromTo('.testimonial-stars', 
            { scale: 0, rotation: 180, opacity: 0 },
            {
              duration: 0.8,
              scale: 1,
              rotation: 0,
              opacity: 1,
              ease: 'elastic.out(1, 0.3)',
              stagger: 0.05,
              delay: 0.5
            }
          );

          // Animate quote text with typewriter effect
          gsap.fromTo('.testimonial-quote',
            { opacity: 0, width: 0 },
            {
              duration: 1.5,
              opacity: 1,
              width: '100%',
              ease: 'power2.out',
              stagger: 0.3,
              delay: 1
            }
          );

          // Animate author info
          gsap.fromTo('.testimonial-author',
            { opacity: 0, y: 20 },
            {
              duration: 0.8,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.2,
              delay: 1.8
            }
          );
        }
      });

      // Enhanced demo section with parallax
      ScrollTrigger.create({
        trigger: demoRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
        onUpdate: (self) => {
          gsap.to('.demo-bg', {
            y: self.progress * 150,
            rotation: self.progress * 10,
            ease: 'none'
          });
        }
      });

      // Enhanced text reveal animations
      gsap.utils.toArray('.text-reveal').forEach((element: any) => {
        ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          onEnter: () => {
            gsap.from(element, {
              duration: 1.2,
              y: 60,
              opacity: 0,
              scale: 0.95,
              ease: 'power3.out'
            });
          }
        });
      });

      // Enhanced CTA section
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.cta-content', {
            duration: 1.5,
            y: 80,
            opacity: 0,
            scale: 0.9,
            ease: 'power3.out'
          });

          // gsap.from('.cta-button', {
          //   duration: 1,
          //   scale: 0.8,
          //   opacity: 0,
          //   ease: 'elastic.out(1, 0.3)',
          //   stagger: 0.2,
          //   delay: 0.5
          // });
        }
      });

      // Mouse follower effect for hero section
      const heroSection = heroRef.current;
      if (heroSection) {
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { offsetWidth, offsetHeight } = heroSection;
          const xPos = (clientX / offsetWidth - 0.5) * 20;
          const yPos = (clientY / offsetHeight - 0.5) * 20;

          gsap.to('.hero-mockup', {
            duration: 1,
            x: xPos,
            y: yPos,
            ease: 'power2.out'
          });
        };

        heroSection.addEventListener('mousemove', handleMouseMove);
      }

    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-asu-maroon" />
                <Sparkles className="sparkle absolute -top-1 -right-1 h-4 w-4 text-asu-gold" />
              </div>
              <span className="font-bold text-xl text-gray-900">ASU Handshake</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection(featuresRef)} className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105">Features</button>
              <button onClick={() => scrollToSection(howItWorksRef)} className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105">How it Works</button>
              <button onClick={() => scrollToSection(demoRef)} className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105">Demo</button>
              <Link to="/login" className="text-gray-600 hover:text-asu-maroon transition-all duration-300 hover:scale-105">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-6 py-2 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-gray-900 overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0">
          <div className="float-1 floating-element absolute top-20 left-10 w-24 h-24 bg-asu-gold/20 rounded-full blur-xl"></div>
          <div className="float-2 floating-element absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="float-3 floating-element absolute bottom-20 left-1/4 w-28 h-28 bg-asu-gold/30 rounded-full blur-xl"></div>
          <Sparkles className="sparkle absolute top-1/4 left-1/3 h-6 w-6 text-asu-gold/50" />
          <Sparkles className="sparkle absolute top-3/4 right-1/4 h-8 w-8 text-white/30" />
          <Sparkles className="sparkle absolute top-1/2 left-1/5 h-4 w-4 text-asu-gold/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your Career
                <span className="block bg-gradient-to-r from-asu-gold via-yellow-300 to-asu-gold bg-clip-text text-transparent animate-pulse">
                  Starts Here
                </span>
              </h1>
              <p className="hero-subtitle text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Connect with top employers, find your dream internship, and launch your career at Arizona State University's premier job platform.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Link to="/register?role=student" className="group bg-gradient-to-r from-asu-gold to-yellow-300 text-asu-maroon px-8 py-4 rounded-full font-semibold text-lg hover:from-yellow-300 hover:to-asu-gold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl flex items-center justify-center relative overflow-hidden">
                  <span className="relative z-10">Find Opportunities</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link to="/register?role=employer" className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-asu-maroon transition-all duration-500 transform hover:scale-110 hover:shadow-2xl flex items-center justify-center relative overflow-hidden">
                  <span className="relative z-10">Post Jobs</span>
                  <Building2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
            
            {/* Simplified Hero Image with Student */}
            <div className="hero-mockup relative">
              {/* Student Success Image */}
              <div className="relative z-10 bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Student Image Container */}
                <div className="relative w-full h-96 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                  {/* Student Illustration */}
                  <div className="text-center">
                    <div className="text-9xl mb-4 animate-pulse">🎓</div>
                    <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
                      <h3 className="text-2xl font-bold text-asu-maroon mb-2">Your Success Story</h3>
                      <p className="text-gray-600 text-lg">Starts Here at ASU</p>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Badges */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg animate-bounce">
                  <Trophy className="h-6 w-6 text-asu-maroon" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-asu-maroon p-3 rounded-full shadow-lg animate-pulse">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-1/2 -right-6 bg-white p-2 rounded-full shadow-lg">
                  <TrendingUp className="h-5 w-5 text-asu-maroon" />
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-t from-asu-maroon/20 to-transparent rounded-3xl transform rotate-3 scale-105 blur-sm"></div>
              
              {/* Success Metrics Overlay */}
              <div className="absolute bottom-4 left-4 success-metric bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-800">95%</div>
                  <div className="text-xs text-gray-600 font-medium">Success Rate</div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 success-metric bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-800">2.5k+</div>
                  <div className="text-xs text-gray-600 font-medium">Jobs Posted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium">Scroll to explore</span>
            <ChevronDown className="h-8 w-8" />
          </div>
        </div>
      </section>

      {/* Enhanced Company Logos Section */}
      <section ref={companiesRef} className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-reveal text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trusted by Industry Leaders</h2>
          <p className="text-reveal text-xl text-gray-600 max-w-2xl mx-auto">Join thousands of students who've found their dream jobs with top companies</p>
        </div>
        <div className="relative">
          <div className="company-scroll flex space-x-16 items-center">
            {[...companyLogos, ...companyLogos].map((company, index) => (
              <div key={index} className="company-logo flex-shrink-0 bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="w-12 h-12 object-contain filter hover:saturate-150 transition-all duration-300"
                    style={{ filter: `drop-shadow(0 4px 6px ${company.color}20)` }}
                  />
                  <span className="font-bold text-xl text-gray-800">{company.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 bg-gradient-to-r from-asu-maroon via-asu-maroon-dark to-asu-maroon relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-4 transform hover:scale-105 transition-transform duration-300">
              <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="15000">0</div>
              <div className="stat-label text-asu-gold font-bold text-lg">Active Students</div>
            </div>
            <div className="space-y-4 transform hover:scale-105 transition-transform duration-300">
              <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="500">0</div>
              <div className="stat-label text-asu-gold font-bold text-lg">Partner Companies</div>
            </div>
            <div className="space-y-4 transform hover:scale-105 transition-transform duration-300">
              <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="2000">0</div>
              <div className="stat-label text-asu-gold font-bold text-lg">Job Postings</div>
            </div>
            <div className="space-y-4 transform hover:scale-105 transition-transform duration-300">
              <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-asu-gold bg-clip-text text-transparent" data-target="95">0</div>
              <div className="stat-label text-asu-gold font-bold text-lg">% Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section ref={featuresRef} className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-reveal text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-reveal text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools, resources, and connections you need to launch your dream career at ASU.
            </p>
          </div>
          
          {/* Pinterest-style Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mb-16 space-y-6">
            {[
              {
                icon: <Search className="h-12 w-12 text-white" />,
                title: "AI-Powered Job Matching",
                description: "Advanced algorithms analyze your skills, interests, and career goals to match you with the perfect opportunities from our network of 500+ employers.",
                gradient: "from-asu-maroon to-asu-maroon-dark",
                features: ["Personalized recommendations", "Skills assessment", "Career path guidance"],
                size: "large"
              },
              {
                icon: <Users className="h-10 w-10 text-white" />,
                title: "Direct Employer Network", 
                description: "Skip the middleman and connect directly with hiring managers from Fortune 500 companies.",
                gradient: "from-asu-maroon to-asu-maroon-dark",
                features: ["Real-time messaging", "Video interviews"],
                size: "medium"
              },
              {
                icon: <Award className="h-14 w-14 text-asu-maroon" />,
                title: "Career Development Hub",
                description: "Access exclusive workshops, mentorship programs, resume reviews, and interview preparation resources designed for ASU students.",
                gradient: "from-white to-gray-100", 
                features: ["1-on-1 mentoring", "Skill workshops", "Mock interviews", "Resume optimization"],
                size: "large"
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-white" />,
                title: "Integrated Communication",
                description: "Seamless messaging system with read receipts and file sharing.",
                gradient: "from-asu-maroon to-asu-maroon-dark",
                features: ["Instant notifications", "File attachments"],
                size: "small"
              },
              {
                icon: <Shield className="h-12 w-12 text-asu-maroon" />,
                title: "Verified Opportunities Only",
                description: "Every job posting is manually reviewed and verified by our team to ensure legitimacy, competitive compensation, and growth potential.",
                gradient: "from-white to-gray-100",
                features: ["Background checks", "Salary transparency", "Company ratings"],
                size: "medium"
              },
              {
                icon: <TrendingUp className="h-11 w-11 text-white" />,
                title: "Success Analytics Dashboard", 
                description: "Track your application progress, view response rates, and get actionable insights.",
                gradient: "from-asu-maroon to-asu-maroon-dark",
                features: ["Application tracking", "Performance metrics"],
                size: "medium"
              }
            ].map((feature, index) => (
              <div key={index} className={`feature-card group relative bg-white rounded-2xl p-6 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-asu-maroon/20 break-inside-avoid mb-6 ${feature.size === 'large' ? 'lg:p-8' : feature.size === 'medium' ? 'lg:p-7' : 'lg:p-6'}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`feature-icon mb-4 w-16 h-16 bg-gradient-to-br ${feature.gradient === "from-white to-gray-100" ? "from-asu-maroon to-asu-maroon-dark" : feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="feature-description text-gray-600 leading-relaxed mb-4 text-sm">{feature.description}</p>
                  <ul className="space-y-1">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="feature-item flex items-center text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Benefits Section */}
          <div className="bg-gradient-to-r from-asu-maroon/5 to-asu-gold/5 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Plus So Much More</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <Calendar className="h-8 w-8" />, title: "Career Events", desc: "Exclusive networking events" },
                { icon: <BookOpen className="h-8 w-8" />, title: "Resource Library", desc: "Templates & guides" },
                { icon: <Globe className="h-8 w-8" />, title: "Global Opportunities", desc: "International placements" },
                { icon: <Zap className="h-8 w-8" />, title: "Quick Apply", desc: "One-click applications" }
              ].map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-asu-maroon/20">
                    <div className="text-asu-maroon">{benefit.icon}</div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section ref={howItWorksRef} className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-asu-maroon/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-asu-gold/5 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-reveal text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-reveal text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and find your perfect opportunity with our streamlined process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Build a comprehensive profile showcasing your skills, experience, and career aspirations. Upload your resume and let AI optimize it.",
                icon: <User className="h-20 w-20 text-white" />,
                gradient: "from-asu-maroon to-asu-maroon-dark",
                delay: 0
              },
              {
                step: "02", 
                title: "Discover Opportunities",
                description: "Browse through thousands of verified job postings and internships from top employers. Get personalized recommendations.",
                icon: <Search className="h-20 w-20 text-white" />,
                gradient: "from-asu-maroon to-asu-maroon-dark",
                delay: 0.2
              },
              {
                step: "03",
                title: "Apply & Connect",
                description: "Apply with one click and connect directly with hiring managers. Track your progress and get real-time updates.",
                icon: <Target className="h-20 w-20 text-white" />,
                gradient: "from-asu-maroon to-asu-maroon-dark",
                delay: 0.4
              }
            ].map((step, index) => (
              <div key={index} className="step-card text-center group relative">
                <div className="relative mb-10">
                  <div className={`step-number mx-auto w-40 h-40 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-6 -right-6 bg-white border-4 border-asu-gold text-asu-maroon w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  {/* Connection line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-asu-maroon to-transparent"></div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Career Path Section */}
      <section className="py-24 bg-gradient-to-br from-asu-maroon/5 to-asu-gold/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Career <span className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Follow the path from ASU student to industry professional with our comprehensive career support system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Career Path Visualization */}
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-gray-200"></div>
                    ))}
                  </div>
                </div>
                
                {/* Career Path Steps */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Step 4: Career Success */}
                  <div className="flex items-center justify-center">
                    <div className="bg-gradient-to-r from-asu-gold to-yellow-300 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Award className="h-7 w-7 text-asu-maroon" />
                        </div>
                        <div className="text-asu-maroon">
                          <p className="font-bold text-lg">Dream Job</p>
                          <p className="text-sm opacity-80">Achieved!</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Interview & Offer */}
                  <div className="flex items-center justify-end">
                    <div className="bg-white rounded-xl p-3 shadow-lg max-w-xs border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Interview Success</p>
                          <p className="text-xs text-gray-600">Job Offer Received</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Application Submitted */}
                  <div className="flex items-center justify-start">
                    <div className="bg-white rounded-xl p-3 shadow-lg max-w-xs border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Applied to Google</p>
                          <p className="text-xs text-gray-600">Software Engineer Intern</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 1: Profile Created */}
                  <div className="flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-asu-maroon rounded-full flex items-center justify-center">
                          <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <div className="text-asu-maroon">
                          <p className="font-bold text-lg">ASU Student</p>
                          <p className="text-sm opacity-80">Your journey starts here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFC627" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8C1D40" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 150 280 Q 100 220 150 180 Q 200 140 150 100 Q 100 60 150 20"
                      stroke="url(#pathGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Career Path Benefits */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
                  <p className="text-gray-600 text-lg">Build a comprehensive profile that showcases your skills, experiences, and aspirations to attract top employers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white border-2 border-asu-maroon rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search className="h-6 w-6 text-asu-maroon" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Perfect Matches</h3>
                  <p className="text-gray-600 text-lg">Our AI-powered matching system connects you with opportunities that align with your skills and career goals.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply with Confidence</h3>
                  <p className="text-gray-600 text-lg">Submit applications directly to employers and track your progress through our integrated dashboard.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white border-2 border-asu-maroon rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-asu-maroon" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Land Your Dream Job</h3>
                  <p className="text-gray-600 text-lg">Join thousands of ASU students who have successfully launched their careers through our platform.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section ref={testimonialsRef} className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-reveal text-5xl md:text-6xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-reveal text-xl text-gray-300 max-w-2xl mx-auto">
              Hear from students who found their dream careers through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer at Google",
                image: "👩‍💻",
                quote: "ASU Handshake helped me land my dream job at Google. The AI matching was incredibly accurate and the direct connection with recruiters made all the difference!",
                rating: 5,
                gradient: "from-blue-500 to-purple-600"
              },
              {
                name: "Michael Chen",
                role: "Data Analyst at Microsoft", 
                image: "👨‍💼",
                quote: "The career resources and direct employer connections were game-changers for my job search. I got my offer within 2 weeks of signing up!",
                rating: 5,
                gradient: "from-green-500 to-teal-600"
              },
              {
                name: "Emma Rodriguez",
                role: "Marketing Manager at Adobe",
                image: "👩‍🎨", 
                quote: "I found my internship and full-time offer through this platform. The process was seamless and professional. Highly recommend to all ASU students!",
                rating: 5,
                gradient: "from-pink-500 to-red-600"
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card group relative bg-white rounded-3xl p-10 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{testimonial.image}</div>
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="testimonial-stars h-6 w-6 text-yellow-400 fill-current mx-1" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-8 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-xl text-gray-900">{testimonial.name}</h4>
                    <p className="text-asu-maroon font-semibold text-lg">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Demo Section with Real Image */}
      <section ref={demoRef} className="relative py-24 bg-gradient-to-r from-asu-maroon via-asu-maroon-dark to-asu-maroon overflow-hidden">
        <div className="demo-bg absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-asu-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white mb-16">
            <h2 className="text-reveal text-5xl md:text-6xl font-bold mb-8">
              See ASU Handshake in Action
            </h2>
            <p className="text-reveal text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Experience our intuitive platform designed specifically for ASU students and employers
            </p>
          </div>

          {/* Demo Image/Screenshot */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
              {/* Browser Chrome */}
              <div className="flex items-center space-x-2 mb-4 p-4 bg-white/20 rounded-t-2xl">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white/20 rounded-full px-4 py-1 ml-4">
                  <span className="text-white/70 text-sm">asu-handshake.com/dashboard</span>
                </div>
              </div>

              {/* Demo Dashboard Content */}
              <div className="bg-white rounded-2xl p-8 min-h-[500px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-8 w-8 text-asu-maroon" />
                    <span className="font-bold text-xl text-gray-900">ASU Handshake</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-asu-maroon rounded-full"></div>
                    <span className="text-gray-700 font-medium">Sarah Johnson</span>
                  </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Job Listings */}
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
                    <div className="space-y-4">
                      {/* Job Card 1 */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">Software Engineering Intern</h3>
                            <p className="text-asu-maroon font-medium">Google</p>
                            <p className="text-gray-600 text-sm">Mountain View, CA</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            98% Match
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Python</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Machine Learning</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Posted 2 days ago</span>
                          <button className="bg-asu-maroon text-white px-4 py-2 rounded-lg text-sm font-medium">
                            Quick Apply
                          </button>
                        </div>
                      </div>

                      {/* Job Card 2 */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">Data Science Intern</h3>
                            <p className="text-asu-maroon font-medium">Microsoft</p>
                            <p className="text-gray-600 text-sm">Seattle, WA</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            95% Match
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Python</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">SQL</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Statistics</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Posted 1 week ago</span>
                          <button className="border border-asu-maroon text-asu-maroon px-4 py-2 rounded-lg text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Profile Completion */}
                    <div className="bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-xl p-6 text-white">
                      <h3 className="font-bold mb-3">Profile Strength</h3>
                      <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                        <div className="bg-asu-gold h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-sm text-gray-200 mb-4">85% Complete - Add portfolio to boost visibility</p>
                      <button className="bg-white text-asu-maroon px-4 py-2 rounded-lg text-sm font-medium w-full">
                        Complete Profile
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Your Activity</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Applications Sent</span>
                          <span className="font-bold text-asu-maroon">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profile Views</span>
                          <span className="font-bold text-asu-maroon">47</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Messages</span>
                          <span className="font-bold text-asu-maroon">3</span>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-asu-maroon rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Tech Career Fair</p>
                            <p className="text-xs text-gray-600">Tomorrow, 10 AM</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-asu-gold rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Resume Workshop</p>
                            <p className="text-xs text-gray-600">Friday, 2 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements around demo */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-asu-gold/20 rounded-full blur-lg animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-lg animate-pulse"></div>
            <div className="absolute top-1/2 -left-12 w-12 h-12 bg-asu-maroon/20 rounded-full blur-lg animate-pulse"></div>
          </div>

          {/* Demo Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-asu-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-asu-maroon" />
              </div>
              <h3 className="font-bold text-white mb-2">Instant Matching</h3>
              <p className="text-gray-200 text-sm">AI algorithms match you with relevant opportunities in real-time</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-asu-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-asu-maroon" />
              </div>
              <h3 className="font-bold text-white mb-2">Direct Communication</h3>
              <p className="text-gray-200 text-sm">Message employers directly without intermediaries</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-asu-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-asu-maroon" />
              </div>
              <h3 className="font-bold text-white mb-2">Track Progress</h3>
              <p className="text-gray-200 text-sm">Monitor your applications and optimize your success rate</p>
            </div>
          </div>

          {/* CTA for Demo */}
          <div className="text-center mt-12">
            <Link to="/register?role=student" className="inline-flex items-center bg-asu-gold text-asu-maroon px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              Try It Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-gray-300 mt-4 text-sm">No credit card required • Setup in under 2 minutes</p>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section ref={ctaRef} className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-asu-maroon to-transparent"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="cta-content">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Ready to Launch Your
              <span className="block bg-gradient-to-r from-asu-maroon to-asu-maroon-dark bg-clip-text text-transparent">
                Dream Career?
              </span>
            </h2>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of ASU students who have already found their dream jobs with top companies worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/register?role=student" className="cta-button group bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 flex items-center justify-center relative overflow-hidden">
                <span className="relative z-10">Start as Student</span>
                <GraduationCap className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-asu-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/register?role=employer" className="cta-button group border-3 border-asu-maroon text-asu-maroon px-10 py-5 rounded-full font-bold text-xl hover:bg-asu-maroon hover:text-white hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 flex items-center justify-center relative overflow-hidden">
                Post Jobs
                <GraduationCap className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-asu-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/register?role=employer" className="cta-button group border-3 border-asu-maroon text-asu-maroon px-10 py-5 rounded-full font-bold text-xl hover:bg-asu-maroon hover:text-white hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 flex items-center justify-center">
                Post Jobs
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              No credit card required • Setup in under 2 minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};