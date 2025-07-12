import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import './Product.css';

gsap.registerPlugin(ScrollTrigger);

const Product = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const featuresRef = useRef([]);
  const mockupRef = useRef(null);
  const imageRef = useRef(null);
  const specificationsRef = useRef([]);
  const benefitsRef = useRef([]);
  const ctaRef = useRef(null);

  const handleStartClick = () => {
    window.open('https://t.me/IELTSPEAK_bot', '_blank');
  };

  const productFeatures = [
    {
      icon: <PhoneAndroidIcon />,
      category: "mentorship",
      title: "Telegram Bot Integration",
      description: "Easy-to-use interface through Telegram bot with instant access and seamless user experience",
      details: "Available 24/7, supports multiple languages, and requires no additional app downloads"
    },
    {
      icon: <PsychologyIcon />,
      category: "job",
      title: "Advanced AI Technology",
      description: "Powered by cutting-edge AI that mimics real IELTS examiners for authentic practice sessions",
      details: "Machine learning algorithms trained on thousands of IELTS speaking samples"
    },
    {
      icon: <GpsFixedIcon />,
      category: "career-fair",
      title: "Comprehensive IELTS Testing",
      description: "Complete IELTS speaking test simulation covering all three parts with detailed scoring",
      details: "Includes Part 1 (Introduction), Part 2 (Long Turn), and Part 3 (Discussion)"
    },
    {
      icon: <AnalyticsIcon />,
      category: "networking",
      title: "Detailed Analytics",
      description: "In-depth performance analysis with personalized recommendations for improvement",
      details: "Track progress over time, identify weak areas, and monitor band score improvements"
    }
  ];

  const specifications = [
    { label: "Test Duration", value: "11-14 minutes" },
    { label: "Parts Covered", value: "All 3 Parts" },
    { label: "Scoring Criteria", value: "4 Band Descriptors" },
    { label: "Feedback Time", value: "1-2 minutes" },
    { label: "Languages", value: "Multiple Support" },
    { label: "Availability", value: "24/7 Access" }
  ];

  const benefits = [
    {
      title: "Instant Feedback",
      description: "Get immediate detailed feedback on your speaking performance with specific improvement suggestions",
      icon: <FlashOnIcon />
    },
    {
      title: "Convenient Practice",
      description: "Practice anytime, anywhere through Telegram without scheduling or travel requirements",
      icon: <HomeIcon />
    },
    {
      title: "Cost-Effective",
      description: "Affordable alternative to expensive private tutoring with unlimited practice sessions",
      icon: <AttachMoneyIcon />
    },
    {
      title: "Stress-Free Environment",
      description: "Practice in a comfortable setting without the pressure of face-to-face interactions",
      icon: <SelfImprovementIcon />
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    const features = featuresRef.current;
    const mockup = mockupRef.current;
    const image = imageRef.current;

    // Title animation
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      animation: gsap.fromTo(title,
        { opacity: 0, y: 50, rotationX: 30 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "power3.out" }
      )
    });

    // Content slide in from left
    ScrollTrigger.create({
      trigger: content,
      start: "top 75%",
      animation: gsap.fromTo(content,
        { opacity: 0, x: -80 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      )
    });

    // Features stagger animation
    ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      animation: gsap.fromTo(features,
        { opacity: 0, x: -50, scale: 0.8 },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)"
        }
      )
    });

    // Mockup animation from right
    ScrollTrigger.create({
      trigger: mockup,
      start: "top 70%",
      animation: gsap.fromTo(mockup,
        { opacity: 0, x: 80, rotationY: 45 },
        { opacity: 1, x: 0, rotationY: 0, duration: 1.2, ease: "power3.out" }
      )
    });

    // Floating animation for mockup
    gsap.to(mockup, {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Specifications animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      animation: gsap.fromTo(specificationsRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    });

    // Benefits animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 40%",
      animation: gsap.fromTo(benefitsRef.current,
        { opacity: 0, x: -40, rotationY: 20 },
        { 
          opacity: 1, 
          x: 0, 
          rotationY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        }
      )
    });

    // CTA animation
    ScrollTrigger.create({
      trigger: ctaRef.current,
      start: "top 80%",
      animation: gsap.fromTo(ctaRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
      )
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="product" className="product" ref={sectionRef}>
      <div className="container">
        <h2 ref={titleRef}>Product Overview</h2>
        
        {/* Main Product Description */}
        <div className="product-content">
          <div className="product-info" ref={contentRef}>
            <h3>What is IELTS Speak?</h3>
            <p>IELTS Speak is an innovative AI-based language practice platform, designed specifically to evaluate IELTS Speaking skills. It acts as a convenient virtual examiner to guide and judge full IELTS speaking mock tests with professional accuracy and detailed feedback.</p>
            
            <div className="features-grid">
              {productFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="feature material-card" 
                  ref={el => featuresRef.current[index] = el}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <div className={`category-badge category-${feature.category}`}>
                      {feature.category.replace('_', ' ')}
                    </div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    <small className="feature-details">{feature.details}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="product-visual" ref={mockupRef}>
            <div className="product-iphones-showcase">
              {/* Main Product iPhone */}
              <div className="product-iphone-mockup main-iphone">
                <div className="product-iphone-frame">
                  <div className="product-iphone-screen">
                    <div className="product-iphone-notch"></div>
                    <div className="product-iphone-content">
                      <img 
                        ref={imageRef}
                        src={`${process.env.PUBLIC_URL}/2025-07-12 18.08.55.jpg`}
                        alt="IELTS Speak Bot Features"
                        className="product-iphone-screenshot"
                      />
                    </div>
                    <div className="product-iphone-home-indicator"></div>
                  </div>
                  <div className="product-iphone-shadow"></div>
                </div>
             
              </div>

              {/* Secondary iPhone */}
              <div className="product-iphone-mockup secondary-iphone">
                <div className="product-iphone-frame">
                  <div className="product-iphone-screen">
                    <div className="product-iphone-notch"></div>
                    <div className="product-iphone-content">
                      <img 
                        src={`${process.env.PUBLIC_URL}/2025-07-12 18.06.23.jpg`}
                        alt="IELTS Speak Interface"
                        className="product-iphone-screenshot"
                      />
                    </div>
                    <div className="product-iphone-home-indicator"></div>
                  </div>
                  <div className="product-iphone-shadow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="specifications-section">
          <h3>Technical Specifications</h3>
          <div className="specifications-grid">
            {specifications.map((spec, index) => (
              <div 
                key={index}
                className="spec-item material-card"
                ref={el => specificationsRef.current[index] = el}
              >
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="benefits-section">
          <h3>Why Choose IELTS Speak?</h3>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="benefit-card material-card"
                ref={el => benefitsRef.current[index] = el}
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="product-cta" ref={ctaRef}>
          <h3>Ready to Improve Your IELTS Speaking Score?</h3>
          <p>Join thousands of students who have already improved their speaking skills with IELTS Speak</p>
          <button 
            className="cta-button ripple"
            onClick={handleStartClick}
          >
            Start Your Free Practice Session
          </button>
        </div>
      </div>
    </section>
  );
};

export default Product;