import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SchoolIcon from '@mui/icons-material/School';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GroupsIcon from '@mui/icons-material/Groups';
import './Audience.css';

gsap.registerPlugin(ScrollTrigger);

const Audience = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  const characteristicsRef = useRef([]);
  const infographicRef = useRef(null);
  const skillBarsRef = useRef([]);

  useEffect(() => {
    const title = titleRef.current;
    const stats = statsRef.current;
    const characteristics = characteristicsRef.current;
    const infographic = infographicRef.current;
    const skillBars = skillBarsRef.current;

    // Title animation
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      animation: gsap.fromTo(title,
        { opacity: 0, scale: 0.8, rotationX: 45 },
        { opacity: 1, scale: 1, rotationX: 0, duration: 1, ease: "back.out(1.7)" }
      )
    });

    // Stats counter animation
    ScrollTrigger.create({
      trigger: stats,
      start: "top 75%",
      animation: gsap.fromTo(stats,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power3.out",
          onComplete: () => {
            // Animate the number counting
            gsap.to({}, {
              duration: 2,
              ease: "power2.out",
              onUpdate: function() {
                const progress = this.progress();
                const targetNumber = 256000;
                const currentNumber = Math.floor(targetNumber * progress);
                if (stats.querySelector('.stat-number')) {
                  stats.querySelector('.stat-number').textContent = currentNumber.toLocaleString() + 'K';
                }
              }
            });
          }
        }
      )
    });

    // Characteristics stagger animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      animation: gsap.fromTo(characteristics,
        { opacity: 0, x: -60, scale: 0.8 },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      )
    });

    // Infographic animation
    ScrollTrigger.create({
      trigger: infographic,
      start: "top 70%",
      animation: gsap.fromTo(infographic,
        { opacity: 0, x: 80, rotationY: 45 },
        { opacity: 1, x: 0, rotationY: 0, duration: 1.2, ease: "power3.out" }
      )
    });

    // Skill bars animation
    ScrollTrigger.create({
      trigger: infographic,
      start: "top 60%",
      animation: gsap.fromTo(skillBars,
        { width: 0 },
        { 
          width: (i, el) => el.getAttribute('data-width'),
          duration: 1.5,
          stagger: 0.3,
          ease: "power3.out"
        }
      )
    });

    // Floating animation for age circle
    gsap.to('.age-circle', {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="audience" className="audience" ref={sectionRef}>
      <div className="container">
        <div className="audience-content">
          <div className="audience-info">
            <div className="audience-stats" ref={statsRef}>
              <div className="stat-item material-card">
                <span className="stat-number">256K</span>
                <span className="stat-label">Students who wants to get IELTS</span>
              </div>
            </div>
            <h2 ref={titleRef}>Audience of Platform</h2>
            <p>Our community includes professionals from various industries who recognize the global importance of English proficiency. They're preparing to take their careers to new heights by showcasing their language skills on the international stage.</p>
            
            <div className="audience-characteristics">
              <div className="characteristic material-card" ref={el => characteristicsRef.current[0] = el}>
                <SchoolIcon className="icon" />
                <div className="characteristic-content">
                  <div className="category-badge category-internship">Knowledge</div>
                  <span>Knows English</span>
                </div>
              </div>
              <div className="characteristic material-card" ref={el => characteristicsRef.current[1] = el}>
                <GpsFixedIcon className="icon" />
                <div className="characteristic-content">
                  <div className="category-badge category-networking">Goal</div>
                  <span>Gets IELTS</span>
                </div>
              </div>
              <div className="characteristic material-card" ref={el => characteristicsRef.current[2] = el}>
                <GroupsIcon className="icon" />
                <div className="characteristic-content">
                  <div className="category-badge category-career-fair">Demographics</div>
                  <span>Age: 16 - 24</span>
                </div>
              </div>
            </div>
          </div>
          <div className="audience-visual" ref={infographicRef}>
            <div className="infographic material-card">
              <div className="age-group">
                <div className="age-circle">
                  <span>16-24</span>
                  <small>Primary Age Group</small>
                </div>
              </div>
              <div className="skill-indicators">
                <div className="skill-bar">
                  <span>English Proficiency</span>
                  <div className="bar">
                    <div 
                      className="fill" 
                      ref={el => skillBarsRef.current[0] = el}
                      data-width="85%"
                    ></div>
                  </div>
                </div>
                <div className="skill-bar">
                  <span>IELTS Preparation</span>
                  <div className="bar">
                    <div 
                      className="fill" 
                      ref={el => skillBarsRef.current[1] = el}
                      data-width="70%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;