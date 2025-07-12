import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import './Pricing.css';

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeStory, setActiveStory] = useState(0);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const faqRef = useRef(null);
  const testimonialsRef = useRef(null);
  const statsRef = useRef(null);

  const pricingPlans = [
    {
      name: "Free Trial",
      price: "0",
      period: "1 test",
      description: "Perfect for trying out IELTS Speak",
      features: [
        "1 Complete IELTS Speaking Test",
        "Basic AI Feedback",
        "Score Breakdown",
        "Email Support"
      ],
      buttonText: "Start Free Trial",
      popular: false,
      icon: <FlashOnIcon />
    },
    {
      name: "Premium",
      price: "9.99",
      period: "month",
      description: "Best value for serious IELTS preparation",
      features: [
        "Unlimited IELTS Speaking Tests",
        "Advanced AI Feedback",
        "Detailed Score Analysis",
        "Progress Tracking",
        "Priority Support",
        "Speaking Tips & Strategies"
      ],
      buttonText: "Get Premium",
      popular: true,
      icon: <StarIcon />
    }
  ];

  const faqs = [
    {
      question: "How accurate is the AI evaluation?",
      answer: "Our AI has been trained on thousands of IELTS speaking tests and achieves 95% accuracy compared to human examiners. It evaluates all four criteria: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation."
    },
    {
      question: "Can I use this for other English proficiency tests?",
      answer: "Currently, our platform is specifically designed for IELTS speaking tests. However, we're working on expanding to TOEFL and other English proficiency tests in the near future."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not completely satisfied, contact our support team for a full refund."
    },
    {
      question: "How quickly do I get my results?",
      answer: "You'll receive your detailed evaluation report within 60 seconds of completing your speaking test. The report includes your band score, detailed feedback, and improvement suggestions."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use enterprise-grade encryption to protect your data. Your recordings and personal information are never shared with third parties and are automatically deleted after 30 days unless you choose to save them."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      score: "7.5 → 8.5",
      text: "The AI feedback was incredibly detailed. I improved my IELTS speaking score by a full band in just 3 weeks!",
      avatar: "👩‍🎓"
    },
    {
      name: "Ahmed Rahman", 
      score: "6.0 → 7.5",
      text: "Practice anytime, anywhere. The convenience and quality of feedback helped me achieve my target score.",
      avatar: "👨‍💼"
    },
    {
      name: "Maria Silva",
      score: "6.5 → 8.0", 
      text: "Better than expensive tutoring! The AI caught pronunciation issues I never knew I had.",
      avatar: "👩‍🔬"
    }
  ];

  const communityStats = [
    {
      number: "50,000+",
      label: "Students Helped",
      icon: "👥",
      description: "Learners who improved their scores"
    },
    {
      number: "4.9/5",
      label: "Rating",
      icon: "⭐",
      description: "Average user satisfaction score"
    },
    {
      number: "1.2M+",
      label: "Tests Completed",
      icon: "📊",
      description: "Speaking assessments delivered"
    },
    {
      number: "85%",
      label: "Score Improvement",
      icon: "📈",
      description: "Users who improved their band score"
    }
  ];

  const successStories = [
    {
      name: "Sarah Johnson",
      country: "🇺🇸 USA",
      before: "6.5",
      after: "8.5",
      story: "From struggling with confidence to mastering IELTS speaking in 3 months",
      image: "👩‍🎓",
      university: "Harvard University"
    },
    {
      name: "Ahmed Rahman",
      country: "🇪🇬 Egypt", 
      before: "6.0",
      after: "7.5",
      story: "Achieved target score for Canadian immigration",
      image: "👨‍💼",
      university: "University of Toronto"
    },
    {
      name: "Maria Silva",
      country: "🇧🇷 Brazil",
      before: "6.5",
      after: "8.0",
      story: "Secured scholarship to study in Australia",
      image: "👩‍🔬",
      university: "University of Melbourne"
    },
    {
      name: "Raj Patel",
      country: "🇮🇳 India",
      before: "5.5",
      after: "7.0",
      story: "Improved pronunciation and fluency dramatically",
      image: "👨‍💻",
      university: "University of Sydney"
    }
  ];

  const handleStartClick = (planType) => {
    if (planType === 'ENTERPRISE') {
      window.open('mailto:sales@ieltsspeak.com?subject=Enterprise Plan Inquiry', '_blank');
    } else {
      window.open('https://t.me/IELTSPEAK_bot', '_blank');
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Add intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isStatsVisible) {
          setIsStatsVisible(true);
          // Animate stats numbers
          const statNumbers = document.querySelectorAll('.stat-number');
          statNumbers.forEach((stat, index) => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            if (numericValue) {
              let current = 0;
              const increment = numericValue / 50;
              const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                  current = numericValue;
                  clearInterval(timer);
                }
                
                if (finalValue.includes('%')) {
                  stat.textContent = Math.floor(current) + '%';
                } else if (finalValue.includes('+')) {
                  stat.textContent = Math.floor(current).toLocaleString() + '+';
                } else if (finalValue.includes('/')) {
                  stat.textContent = (current / 10).toFixed(1) + '/5';
                } else {
                  stat.textContent = Math.floor(current).toLocaleString();
                }
              }, 50);
            }
          });
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isStatsVisible]);

  // Auto-rotate success stories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % successStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;
    const cta = ctaRef.current;
    const faq = faqRef.current;
    const testimonials = testimonialsRef.current;

    // Title animation
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      animation: gsap.fromTo(title,
        { opacity: 0, y: 50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
      )
    });

    // Cards animation with stagger
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      animation: gsap.fromTo(cards,
        { opacity: 0, y: 80, rotationX: 45 },
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }
      )
    });

    // FAQ animation
    if (faq) {
      ScrollTrigger.create({
        trigger: faq,
        start: "top 80%",
        animation: gsap.fromTo(faq,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        )
      });
    }

    // Testimonials animation
    if (testimonials) {
      ScrollTrigger.create({
        trigger: testimonials,
        start: "top 80%",
        animation: gsap.fromTo(testimonials.children,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
        )
      });
    }

    // CTA animation
    ScrollTrigger.create({
      trigger: cta,
      start: "top 80%",
      animation: gsap.fromTo(cta,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
      )
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="pricing" className="pricing" ref={sectionRef}>
      <div className="container">
        <div className="pricing-header">
          <h2 ref={titleRef}>Choose Your Perfect Plan</h2>
          <p className="pricing-subtitle">
            Start with our free trial and upgrade when you're ready. All plans include our core AI evaluation technology.
          </p>
          
          <div className="billing-toggle">
            <span className={!isAnnual ? 'active' : ''}>Monthly</span>
            <button 
              className={`toggle-switch ${isAnnual ? 'annual' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className="toggle-slider"></div>
            </button>
            <span className={isAnnual ? 'active' : ''}>
              Annual
              <span className="save-badge">Save up to 36%</span>
            </span>
          </div>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              ref={el => cardsRef.current[index] = el}
            >
              {plan.popular && <div className="popular-badge">🎉 Most Popular</div>}
              {plan.discount && <div className="discount-badge">{plan.discount}</div>}
              
              <div className="plan-header">
                <div className="plan-icon">
                  {plan.icon}
                </div>
                <h3>{plan.name}</h3>
                <div className="price-container">
                  <div className="price">
                    {plan.originalPrice && (
                      <span className="original-price">{plan.originalPrice} {plan.currency}</span>
                    )}
                    <span className="amount">{plan.price}</span>
                    <span className="currency">{plan.currency}</span>
                  </div>
                  <p className="period">{plan.period}</p>
                </div>
                <div className="guarantee">{plan.guarantee}</div>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircleIcon className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`pricing-btn ${plan.popular ? 'popular-btn' : ''}`}
                onClick={() => handleStartClick(plan.type)}
              >
                {plan.buttonText}
                {plan.type !== 'ENTERPRISE' && <span className="btn-subtitle">No credit card required</span>}
              </button>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section" ref={testimonialsRef}>
          <h3>What Our Users Say</h3>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <span className="avatar">{testimonial.avatar}</span>
                  <div className="user-info">
                    <strong>{testimonial.name}</strong>
                    <span className="score-improvement">{testimonial.score}</span>
                  </div>
                </div>
                <p>"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section" ref={faqRef}>
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cta-section" ref={ctaRef}>
          <div className="cta-content">
            <h3>Ready to Improve Your IELTS Speaking Score?</h3>
            <p>Join thousands of students who have improved their IELTS speaking scores with our AI-powered platform.</p>
            <div className="cta-buttons">
              <button 
                className="main-cta-btn"
                onClick={() => handleStartClick('PRO')}
              >
                Start Free Trial
                <span className="btn-subtitle">14 days free, then $150k/month</span>
              </button>
              <button 
                className="secondary-cta-btn"
                onClick={() => handleStartClick('STARTER')}
              >
                Try Single Test
              </button>
            </div>
          </div>
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>Instant Results</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💯</span>
              <span>95% Accuracy</span>
            </div>
          </div>
        </div>

        {/* Enhanced Community Section */}
        <div className="community-section">
          <div className="community-header">
            <h2>Join Our Community of Achievers</h2>
            <p className="community-subtitle">
              Thousands of students worldwide have transformed their IELTS speaking scores with our platform. 
              Be part of a global community that's redefining English language learning.
            </p>
          </div>

          <div className="stats-grid" ref={statsRef}>
            {communityStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            ))}
          </div>

          <div className="success-stories">
            <h3>Success Stories That Inspire</h3>
            <div className="stories-grid">
              {successStories.map((story, index) => (
                <div key={index} className="story-card">
                  <div className="story-header">
                    <div className="student-avatar">{story.image}</div>
                    <div className="student-info">
                      <h4>{story.name}</h4>
                      <span className="country">{story.country}</span>
                      <span className="university">{story.university}</span>
                    </div>
                  </div>
                  
                  <div className="score-improvement">
                    <div className="score-before">
                      <span className="score">{story.before}</span>
                      <span className="label">Before</span>
                    </div>
                    <div className="arrow">→</div>
                    <div className="score-after">
                      <span className="score">{story.after}</span>
                      <span className="label">After</span>
                    </div>
                  </div>
                  
                  <p className="story-text">"{story.story}"</p>
                  
                  <div className="achievement-badge">
                    <span>🎯 Goal Achieved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="community-features">
            <h3>Why Our Community Loves IELTS Speak</h3>
            <div className="features-showcase">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h4>Personalized Learning</h4>
                <p>AI adapts to your speaking patterns and provides targeted feedback</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <h4>Instant Results</h4>
                <p>Get detailed feedback within 60 seconds of completing your test</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <h4>Track Progress</h4>
                <p>Monitor your improvement with detailed analytics and insights</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌍</div>
                <h4>Global Community</h4>
                <p>Connect with learners from 150+ countries worldwide</p>
              </div>
            </div>
          </div>

          <div className="join-community-cta">
            <div className="cta-background">
              <h3>Ready to Join 50,000+ Successful Students?</h3>
              <p>Start your journey to IELTS speaking success today</p>
              <div className="cta-buttons">
                <button 
                  className="primary-join-btn"
                  onClick={() => handleStartClick('PRO')}
                >
                  🚀 Start Your Success Story
                  <span className="btn-description">Free trial • No credit card needed</span>
                </button>
                <button 
                  className="secondary-join-btn"
                  onClick={() => window.open('https://t.me/IELTSPEAK_bot', '_blank')}
                >
                  💬 Join Community Chat
                </button>
              </div>
              
              <div className="social-proof">
                <div className="proof-item">
                  <span className="proof-icon">✅</span>
                  <span>14-day money-back guarantee</span>
                </div>
                <div className="proof-item">
                  <span className="proof-icon">🔒</span>
                  <span>Your data is 100% secure</span>
                </div>
                <div className="proof-item">
                  <span className="proof-icon">⚡</span>
                  <span>Start practicing in under 2 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;