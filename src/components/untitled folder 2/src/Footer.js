import React from 'react';
import { gsap } from 'gsap';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Footer.css';

const Footer = () => {
  const handleStartClick = () => {
    window.open('https://t.me/IELTSPEAK_bot', '_blank');
  };

  const handleSocialClick = (platform) => {
    // Add social media links here
    console.log(`Navigate to ${platform}`);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>IELTS Speak</h3>
            <p>Your AI-powered IELTS Speaking practice companion. Improve your speaking skills with professional feedback and detailed analysis.</p>
            <button className="footer-cta-btn ripple" onClick={handleStartClick}>
              Start Practice Now
            </button>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <ul>
                <li><a href="#product">Features</a></li>
                <li><a href="#how-it-works">How it Works</a></li>
                <li><a href="#assessment">Assessment</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Resources</h4>
              <ul>
                <li><a href="#users">User Reviews</a></li>
                <li><a href="#audience">Target Audience</a></li>
                <li><a href="#">IELTS Tips</a></li>
                <li><a href="#">Speaking Guide</a></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-social">
            <button onClick={() => handleSocialClick('telegram')} aria-label="Telegram">
              <TelegramIcon />
            </button>
            <button onClick={() => handleSocialClick('instagram')} aria-label="Instagram">
              <InstagramIcon />
            </button>
            <button onClick={() => handleSocialClick('youtube')} aria-label="YouTube">
              <YouTubeIcon />
            </button>
            <button onClick={() => handleSocialClick('linkedin')} aria-label="LinkedIn">
              <LinkedInIcon />
            </button>
          </div>
          
          <div className="footer-copyright">
            <p>&copy; 2025 IELTS Speak. All rights reserved.</p>
            <p>Powered by AI Technology for Better IELTS Preparation</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;