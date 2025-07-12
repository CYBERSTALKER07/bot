import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarIcon from '@mui/icons-material/Star';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import './Users.css';

gsap.registerPlugin(ScrollTrigger);

const Users = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef([]);
  const chartRef = useRef(null);
  const barsRef = useRef([]);
  const feedbackRef = useRef([]);
  const achievementsRef = useRef([]);
  const cardsRef = useRef([]);

  const stats = [
    { number: "50K+", label: "Total Users", icon: "👥", description: "IELTS candidates worldwide", color: "#1976D2" },
    { number: "45K+", label: "Monthly Active", icon: "🎯", description: "Engaged monthly learners", color: "#2E7D32" },
    { number: "7.2", label: "Avg Score", icon: "⭐", description: "Average user achievement", color: "#ED6C02" },
    { number: "94%", label: "Success Rate", icon: "🏆", description: "Users achieving target scores", color: "#9C27B0" }
  ];

  const chartData = [
    { month: "Jan", users: 25000, color: "#1976D2" },
    { month: "Mar", users: 32000, color: "#1E88E5" },
    { month: "May", users: 40000, color: "#2196F3" },
    { month: "Jul", users: 47000, color: "#42A5F5" },
    { month: "Sep", users: 50000, color: "#64B5F6" }
  ];

  const testimonials = [
    {
      rating: 5,
      text: "IELTS Speak transformed my preparation! The AI feedback was incredibly detailed and helped me achieve my dream score of 8.0. The practice sessions felt exactly like the real exam.",
      name: "Sarah Chen",
      score: "8.0",
      country: "🇺🇸 United States",
      improvement: "+2.0",
      beforeScore: "6.0"
    },
    {
      rating: 5,
      text: "As a non-native speaker, I struggled with pronunciation. IELTS Speak's AI caught every mistake and provided targeted feedback. Achieved 7.5 and got into my dream university!",
      name: "Ahmed Al-Rashid",
      score: "7.5",
      country: "🇸🇦 Saudi Arabia",
      improvement: "+1.5",
      beforeScore: "6.0"
    },
    {
      rating: 5,
      text: "The flexibility to practice anytime was perfect for my busy schedule. The bot feels like having a personal IELTS tutor available 24/7. Highly recommend!",
      name: "Priya Sharma",
      score: "7.0",
      country: "🇮🇳 India",
      improvement: "+1.0",
      beforeScore: "6.0"
    }
  ];

  const demographics = [
    { region: "Asia", percentage: 45, users: "22.5K", flag: "🌏" },
    { region: "Europe", percentage: 25, users: "12.5K", flag: "🇪🇺" },
    { region: "Middle East", percentage: 15, users: "7.5K", flag: "🕌" },
    { region: "Americas", percentage: 10, users: "5K", flag: "🌎" },
    { region: "Africa", percentage: 5, users: "2.5K", flag: "🌍" }
  ];

  const achievements = [
    { icon: "🌍", title: "Global Reach", value: "65+ Countries", description: "International user base", color: "#1976D2" },
    { icon: "📱", title: "Mobile Usage", value: "98%", description: "Users on mobile devices", color: "#2E7D32" },
    { icon: "⚡", title: "Response Time", value: "< 30 sec", description: "Average AI feedback speed", color: "#ED6C02" },
    { icon: "🎯", title: "Target Achievement", value: "87%", description: "Users reaching their goals", color: "#9C27B0" }
  ];

  const users = [
    {
      name: "John Doe",
      location: "New York, USA",
      rating: 4,
      review: "The AI feedback is quite helpful, but I wish there were more speaking topics.",
      improvement: "1.5",
      testsCompleted: 10,
      verified: true
    },
    {
      name: "Jane Smith",
      location: "London, UK",
      rating: 5,
      review: "Excellent platform! The real-time feedback helped me improve my speaking skills significantly.",
      improvement: "2.0",
      testsCompleted: 15,
      verified: true
    },
    {
      name: "Ali Veli",
      location: "Istanbul, Turkey",
      rating: 3,
      review: "Good for practice, but sometimes the AI feedback lacks depth.",
      improvement: "1.0",
      testsCompleted: 8,
      verified: false
    },
    {
      name: "Maria Garcia",
      location: "Barcelona, Spain",
      rating: 5,
      review: "Me encanta esta plataforma! La retroalimentación es muy detallada y útil.",
      improvement: "2.5",
      testsCompleted: 20,
      verified: true
    }
  ];

  useEffect(() => {
    const title = titleRef.current;
    const statsElements = statsRef.current;
    const chart = chartRef.current;
    const bars = barsRef.current;
    const feedbacks = feedbackRef.current;
    const achievementElements = achievementsRef.current;
    const userCards = cardsRef.current;

    // Title animation
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      animation: gsap.fromTo(title,
        { opacity: 0, y: 50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
      )
    });

    // Stats cards animation with counter
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      animation: gsap.fromTo(statsElements,
        { opacity: 0, y: 60, scale: 0.8, rotationY: 45 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.15,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Animate counters
            statsElements.forEach((stat, index) => {
              if (stat) {
                const numberElement = stat.querySelector('.stat-number');
                const targetValue = stats[index].number;
                
                if (targetValue.includes('K')) {
                  const numValue = parseInt(targetValue.replace('K+', ''));
                  gsap.to({}, {
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: function() {
                      const progress = this.progress();
                      const currentNumber = Math.floor(numValue * progress);
                      numberElement.textContent = currentNumber + 'K+';
                    }
                  });
                } else if (targetValue.includes('%')) {
                  const numValue = parseInt(targetValue.replace('%', ''));
                  gsap.to({}, {
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: function() {
                      const progress = this.progress();
                      const currentNumber = Math.floor(numValue * progress);
                      numberElement.textContent = currentNumber + '%';
                    }
                  });
                } else if (targetValue.includes('.')) {
                  const numValue = parseFloat(targetValue);
                  gsap.to({}, {
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: function() {
                      const progress = this.progress();
                      const currentNumber = (numValue * progress).toFixed(1);
                      numberElement.textContent = currentNumber;
                    }
                  });
                }
              }
            });
          }
        }
      )
    });

    // Chart bars animation
    ScrollTrigger.create({
      trigger: chart,
      start: "top 70%",
      animation: gsap.fromTo(bars,
        { height: 0, opacity: 0, scale: 0.8 },
        { 
          height: (i, el) => el.getAttribute('data-height'),
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "bounce.out"
        }
      )
    });

    // Testimonials animation
    ScrollTrigger.create({
      trigger: ".testimonials-grid",
      start: "top 70%",
      animation: gsap.fromTo(feedbacks,
        { opacity: 0, scale: 0.8, rotationY: 45 },
        { 
          opacity: 1, 
          scale: 1, 
          rotationY: 0, 
          duration: 1, 
          stagger: 0.2,
          ease: "power3.out" 
        }
      )
    });

    // Achievements animation
    ScrollTrigger.create({
      trigger: ".achievements-grid",
      start: "top 70%",
      animation: gsap.fromTo(achievementElements,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out" 
        }
      )
    });

    // User cards animation
    ScrollTrigger.create({
      trigger: ".users-list",
      start: "top 70%",
      animation: gsap.fromTo(userCards,
        { opacity: 0, y: 50, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out" 
        }
      )
    });

    // Hover animations
    statsElements.forEach((stat) => {
      if (stat) {
        stat.addEventListener('mouseenter', () => {
          gsap.to(stat, {
            scale: 1.05,
            y: -8,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        stat.addEventListener('mouseleave', () => {
          gsap.to(stat, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="users" className="users" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 ref={titleRef}>Our Global Community</h2>
          <p className="users-subtitle">Join over 50,000 IELTS candidates worldwide who've transformed their speaking skills with AI-powered feedback</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              ref={el => statsRef.current[index] = el}
            >
              <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
              <div className="stat-number" style={{ color: stat.color }}>{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="growth-section">
          <div className="chart-section">
            <h3>Exponential Growth</h3>
            <p className="chart-subtitle">Our user base has doubled in the past 9 months</p>
            <div className="chart-container" ref={chartRef}>
              <div className="chart">
                {chartData.map((data, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar" 
                      ref={el => barsRef.current[index] = el}
                      data-height={`${(data.users / 50000) * 200}px`}
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <span className="month-label">{data.month}</span>
                    <span className="value-label">{data.users.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="growth-metrics">
                <div className="metric">
                  <span className="metric-value">+100%</span>
                  <span className="metric-label">Growth in 9 months</span>
                </div>
                <div className="metric">
                  <span className="metric-value">5K+</span>
                  <span className="metric-label">New users monthly</span>
                </div>
              </div>
            </div>
          </div>

          <div className="demographics-section">
            <h3>Global Distribution</h3>
            <div className="demographics-chart">
              {demographics.map((demo, index) => (
                <div key={index} className="demo-item">
                  <div className="demo-header">
                    <span className="demo-flag">{demo.flag}</span>
                    <span className="demo-region">{demo.region}</span>
                    <span className="demo-percentage">{demo.percentage}%</span>
                  </div>
                  <div className="demo-bar">
                    <div 
                      className="demo-fill" 
                      style={{ width: `${demo.percentage}%`, backgroundColor: '#1976D2' }}
                    ></div>
                  </div>
                  <span className="demo-users">{demo.users} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="testimonials-section">
          <h3>Success Stories from Around the World</h3>
          <p className="testimonials-subtitle">Real results from real users who achieved their IELTS goals</p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card"
                ref={el => feedbackRef.current[index] = el}
              >
                <div className="testimonial-header">
                  <div className="stars">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                  <div className="score-improvement">
                    <span className="before-score">{testimonial.beforeScore}</span>
                    <span className="arrow">→</span>
                    <span className="after-score">{testimonial.score}</span>
                    <span className="improvement-badge">{testimonial.improvement}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="user-info">
                  <div className="user-details">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.country}</span>
                  </div>
                  <div className="final-score">
                    Band {testimonial.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievements-section">
          <h3>Platform Excellence</h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="achievement-card"
                ref={el => achievementsRef.current[index] = el}
              >
                <div className="achievement-icon" style={{ color: achievement.color }}>
                  {achievement.icon}
                </div>
                <div className="achievement-value" style={{ color: achievement.color }}>
                  {achievement.value}
                </div>
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>

     

        <div className="cta-section">
          <h3>Ready to Join Our Success Community?</h3>
          <p>Start your IELTS speaking improvement journey today</p>
          <button 
            className="users-cta-button"
            onClick={() => window.open('https://t.me/IELTSPEAK_bot', '_blank')}
          >
            Join 50K+ Users
          </button>
        </div>
      </div>
    </section>
  );
};

export default Users;