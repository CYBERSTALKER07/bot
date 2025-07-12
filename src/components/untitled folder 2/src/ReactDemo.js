import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import './ReactDemo.css';

gsap.registerPlugin(ScrollTrigger);

const ReactDemo = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const leftSideRef = useRef(null);
  const rightSideRef = useRef(null);

  const leftDemo = {
    src: '2025-07-12 18.09.02.jpg',
    alt: 'IELTS Speak Bot Instructions',
    title: 'Step-by-Step Instructions',
    description: 'Clear guidance through each part of the IELTS speaking test'
  };

  const rightDemo = {
    src: '2025-07-12 18.10.30.jpg',
    alt: 'IELTS Speak Bot Feedback',
    title: 'Detailed Feedback System',
    description: 'Comprehensive analysis and scoring for your speaking performance'
  };

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const leftSide = leftSideRef.current;
    const rightSide = rightSideRef.current;

    // Title animation
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      animation: gsap.fromTo(title,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      )
    });

    // Left and Right side animations
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      animation: gsap.fromTo([leftSide, rightSide],
        { opacity: 0, y: 80, x: -50 },
        { 
          opacity: 1, 
          y: 0, 
          x: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out"
        }
      )
    });

    // Floating animations
    if (leftSide) {
      gsap.to(leftSide, {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }

    if (rightSide) {
      gsap.to(rightSide, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 0.5
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="demo" className="react-demo" ref={sectionRef}>
      <div className="container">
        <h2 ref={titleRef}>Live Bot Demo</h2>
        <p className="demo-subtitle">Experience the real IELTS Speak Telegram bot interface</p>
        
        <div className="demo-split-layout">
          {/* Left Side */}
          <div className="demo-side demo-left" ref={leftSideRef}>
            <div className="demo-info-card">
              <h3>{leftDemo.title}</h3>
              <p>{leftDemo.description}</p>
              <div className="demo-badge">
                <GpsFixedIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                AI Powered
              </div>
            </div>
            <div className="demo-iphone-mockup">
              <div className="demo-iphone-frame">
                <div className="demo-iphone-screen">
                  <div className="demo-iphone-notch"></div>
                  <div className="demo-iphone-content">
                    <img 
                      src={`${process.env.PUBLIC_URL}/${leftDemo.src}`}
                      alt={leftDemo.alt}
                      className="demo-iphone-screenshot"
                    />
                  </div>
                  <div className="demo-iphone-home-indicator"></div>
                </div>
                <div className="demo-iphone-shadow"></div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="demo-side demo-right" ref={rightSideRef}>
            <div className="demo-iphone-mockup">
              <div className="demo-iphone-frame">
                <div className="demo-iphone-screen">
                  <div className="demo-iphone-notch"></div>
                  <div className="demo-iphone-content">
                    <img 
                      src={`${process.env.PUBLIC_URL}/${rightDemo.src}`}
                      alt={rightDemo.alt}
                      className="demo-iphone-screenshot"
                    />
                  </div>
                  <div className="demo-iphone-home-indicator"></div>
                </div>
                <div className="demo-iphone-shadow"></div>
              </div>
            </div>
            <div className="demo-info-card">
              <h3>{rightDemo.title}</h3>
              <p>{rightDemo.description}</p>
              <div className="demo-badge">
                <FlashOnIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                Real-time
              </div>
            </div>
          </div>
        </div>
        
        <div className="demo-cta">
          <h3>Ready to Try It Yourself?</h3>
          <p>Start practicing with our AI-powered IELTS speaking evaluator</p>
          <button 
            className="demo-button"
            onClick={() => window.open('https://t.me/IELTSPEAK_bot', '_blank')}
          >
            Launch Bot Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReactDemo;