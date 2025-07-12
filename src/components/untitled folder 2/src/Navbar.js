import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial navbar animation
    gsap.fromTo('.navbar',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleStartClick = () => {
    // Redirect to Telegram bot
    window.open('https://t.me/IELTSPEAK_bot', '_blank');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <h2>IELTS Speak</h2>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
          <li><a href="#product" onClick={() => scrollToSection('product')}>Product</a></li>
          <li><a href="#how-it-works" onClick={() => scrollToSection('how-it-works')}>How it works</a></li>
          <li><a href="#assessment" onClick={() => scrollToSection('assessment')}>Assessment</a></li>
          <li><a href="#audience" onClick={() => scrollToSection('audience')}>Audience</a></li>
          <li><a href="#users" onClick={() => scrollToSection('users')}>Our Users</a></li>
          <li><a href="#pricing" onClick={() => scrollToSection('pricing')}>Price</a></li>
        </ul>
        <button className="start-btn ripple" onClick={handleStartClick}>
          Start
        </button>
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;