import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const illustrationRef = useRef(null);
  const badgeRef = useRef(null);
  const iphone1Ref = useRef(null);
  const iphone2Ref = useRef(null);

  const handleStartClick = () => {
    // Redirect to Telegram bot
    window.open('https://t.me/IELTSPEAK_bot', '_blank');
  };

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const illustration = illustrationRef.current;
    const badge = badgeRef.current;
    const iphone1 = iphone1Ref.current;
    const iphone2 = iphone2Ref.current;

    // Initial hero animation
    const tl = gsap.timeline();
    
    tl.fromTo(title, 
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(subtitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo(cta,
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    )
    .fromTo([iphone1, iphone2],
      { opacity: 0, x: 50, rotationY: 45 },
      { opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power3.out", stagger: 0.2 },
      "-=0.8"
    )
    .fromTo(badge,
      { opacity: 0, scale: 0, rotation: -180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" },
      "-=0.3"
    );

    // Parallax effect on scroll
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      animation: gsap.to(hero, {
        y: -100,
        ease: "none"
      })
    });

    // Floating animation for images
    gsap.to(iphone1, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    gsap.to(iphone2, {
      y: -15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 0.5
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-container">
        <div className="hero-content">
          <h1 ref={titleRef}>IELTS Speak is your AI Powered IELTS Speaking Evaluator</h1>
          <p ref={subtitleRef}>An innovative AI-based language practice platform designed specifically to evaluate IELTS Speaking skills</p>
          <button 
            className="cta-button ripple" 
            ref={ctaRef}
            onClick={handleStartClick}
          >
            Let's get Started
          </button>
        </div>
        <div className="hero-images">
          <div className="ai-badge" ref={badgeRef}>AI technology</div>
          <div className="hero-visual-container">
            <div className="iphones-showcase">
              {/* iPhone 1 with first screenshot */}
              <div className="iphone-mockup iphone-1" ref={iphone1Ref}>
                <div className="iphone-frame">
                  <div className="iphone-screen">
                    <div className="iphone-notch"></div>
                    <div className="iphone-content">
                      <img 
                        src={`${process.env.PUBLIC_URL}/2025-07-12 18.06.23.jpg`}
                        alt="IELTS Speak Bot Interface"
                        className="iphone-screenshot"
                      />
                    </div>
                    <div className="iphone-home-indicator"></div>
                  </div>
                  <div className="iphone-shadow"></div>
                </div>
              </div>

              {/* iPhone 2 with second screenshot */}
              <div className="iphone-mockup iphone-2" ref={iphone2Ref}>
                <div className="iphone-frame">
                  <div className="iphone-screen">
                    <div className="iphone-notch"></div>
                    <div className="iphone-content">
                      <img 
                        src={`${process.env.PUBLIC_URL}/2025-07-12 18.08.55.jpg`}
                        alt="IELTS Speak Features"
                        className="iphone-screenshot"
                      />
                    </div>
                    <div className="iphone-home-indicator"></div>
                  </div>
                  <div className="iphone-shadow"></div>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;