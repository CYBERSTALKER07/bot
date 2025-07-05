import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

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
    name: 'Tesla', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEuNUw4LjkgNC43NkM5LjYgNC4zNSAxMC40IDQuMDUgMTEuMzMgMy45MmMuNjctLjEzIDEuMzMtLjEzIDIgMGMuOTMuMTMgMS43My40MyAyLjQzLjg0bC0zLjEtMy4yNloiIGZpbGw9IiNDQzAwMDAiLz4KPHBhdGggZD0iTTEyIDIyLjVMMTUuMSAxOS4yNEMxNC40NSAxOS42NiAxMy42NSAxOS45NiAxMi42NyAyMC4wOGMtLjY3LjEzLTEuMzMuMTMtMiAwYy0uOTMtLjEzLTEuNzMtLjQzLTIuNDMtLjg0bDMuMSAzLjI2WiIgZmlsbD0iI0NDMDAwMCIvPgo8cGF0aCBkPSJNMTIgMjIuNUwxNS4xIDE5LjI0QzE0LjQ1IDE5LjY2IDEzLjY1IDE5Ljk2IDEyLjY3IDIwLjA4Yy0uNjcuMTMtMS4zMy4xMy0yIDBjLS45My0uMTMtMS43My0uNDMtMi40My04NGwzLjEgMy4yNloiIGZpbGw9IiNDQzAwMDAiLz4KPC9zdmc+',
    color: '#CC0000'
  },
  { 
    name: 'Adobe', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/adobe/adobe-original.svg',
    color: '#FF0000'
  },
  { 
    name: 'Netflix', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMzk4IDBoLS43OTZBMSAxIDAgMCAwIDQgMXYyMmExIDEgMCAwIDAgLjYwMi45MmwxMS4yIDIuOGMuMzA4LjA3Ny42MTgtLjEyNi42MjItLjQ0NEwyMCAzLjIzNmMwLS4zLS4yNDgtLjU0LS41NDgtLjQ5OGwtOC4wNSAxLjEwNkE1LjM5OCA1LjM5OCAwIDAgMCA1LjM5OCAwWiIgZmlsbD0iI0UyMDYxNCIvPgo8L3N2Zz4K',
    color: '#E20614'
  },
  { 
    name: 'Intel', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intel/intel-original.svg',
    color: '#0071C5'
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
    name: 'Airbnb', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0YzAgMC0xLjItLjctMi40LTJDNy4yIDIwIDQgMTYgNCAxMi44IDQgOC4yIDcuNiA0LjQgMTIgNC40czggMy44IDggOC40YzAgMy4yLTMuMiA3LjItNS42IDkuNkMxMy4yIDIzLjMgMTIgMjQgMTIgMjRaIiBmaWxsPSIjRkY1QTVGIi8+Cjwvc3ZnPg==',
    color: '#FF5A5F'
  }
];

// Add hiring announcements data
const hiringAnnouncements = [
  {
    name: 'Google',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    color: '#4285F4',
    announcement: '🔥 Hiring 500+ Software Engineers',
    positions: 'AI/ML, Frontend, Backend'
  },
  {
    name: 'Microsoft',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg',
    color: '#00A4EF',
    announcement: '⚡ 300+ Open Positions',
    positions: 'Cloud, Security, DevOps'
  },
  {
    name: 'Apple',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
    color: '#000000',
    announcement: '🚀 iOS Team Expansion',
    positions: 'Mobile, UI/UX, Hardware'
  },
  {
    name: 'Amazon',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    color: '#FF9900',
    announcement: '💼 AWS Division Growing',
    positions: 'SysAdmin, Solutions Architect'
  },
  {
    name: 'Meta',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
    color: '#1877F2',
    announcement: '🌟 Metaverse Opportunities',
    positions: 'VR/AR, Backend, Research'
  },
  {
    name: 'Tesla',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEuNUw4LjkgNC43NkM5LjYgNC4zNSAxMC40IDQuMDUgMTEuMzMgMy45MmMuNjctLjEzIDEuMzMtLjEzIDIgMGMuOTMuMTMgMS43My40MyAyLjQzLjg0bC0zLjEtMy4yNloiIGZpbGw9IiNDQzAwMDAiLz4KPHBhdGggZD0iTTEyIDIyLjVMMTUuMSAxOS4yNEMxNC40NSAxOS42NiAxMy42NSAxOS45NiAxMi42NyAyMC4wOGMtLjY3LjEzLTEuMzMuMTMtMiAwYy0uOTMtLjEzLTEuNzMtLjQzLTIuNDMtLjg0bDMuMSAzLjI2WiIgZmlsbD0iI0NDMDAwMCIvPgo8cGF0aCBkPSJNMTIgMjIuNUwxNS4xIDE5LjI0QzE0LjQ1IDE5LjY2IDEzLjY1IDE5Ljk2IDEyLjY3IDIwLjA4Yy0uNjcuMTMtMS4zMy4xMy0yIDBjLS45My0uMTMtMS43My0uNDMtMi40My04NGwzLjEgMy4yNloiIGZpbGw9IiNDQzAwMDAiLz4KPC9zdmc+',
    color: '#CC0000',
    announcement: '🔋 Energy Revolution',
    positions: 'Embedded, Automotive, Energy'
  },
  {
    name: 'Netflix',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMzk4IDBoLS43OTZBMSAxIDAgMCAwIDQgMXYyMmExIDEgMCAwIDAgLjYwMi45MmwxMS4yIDIuOGMuMzA4LjA3Ny42MTgtLjEyNi42MjItLjQ0NEwyMCAzLjIzNmMwLS4zLS4yNDgtLjU0LS41NDgtLjQ5OGwtOC4wNSAxLjEwNkE1LjM5OCA1LjM5OCAwIDAgMCA1LjM5OCAwWiIgZmlsbD0iI0UyMDYxNCIvPgo8L3N2Zz4K',
    color: '#E20614',
    announcement: '🎬 Content & Tech Roles',
    positions: 'Streaming, Data Science, ML'
  },
  {
    name: 'Spotify',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spotify/spotify-original.svg',
    color: '#1DB954',
    announcement: '🎵 Music Tech Innovation',
    positions: 'Audio Engineering, Backend'
  },
  {
    name: 'Uber',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCAxMkMyNCA1LjM3MjU4IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTggMCAwIDUuMzcyNTggMCAxMkMwIDE4LjYyNzQgNS4zNzI1OCAyNCAxMiAyNFoiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTEyIDIwQzE2LjQxODMgMjAgMjAgMTYuNDE4MyAyMCAxMkMyMCA3LjU4MTcyIDE2LjQxODMgNCAxMiA0QzcuNTgxNzIgNCA0IDcuNTgxNzIgNCAxMkM0IDE2LjQxODMgNy41ODE3MiAyMCAxMiAyMFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
    color: '#000000',
    announcement: '🚗 Autonomous Driving',
    positions: 'Robotics, Backend, Mobile'
  },
  {
    name: 'Airbnb',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0YzAgMC0xLjItLjctMi40LTJDNy4yIDIwIDQgMTYgNCAxMi44IDQgOC4yIDcuNiA0LjQgMTIgNC40czggMy44IDggOC40YzAgMy4yLTMuMiA3LjItNS42IDkuNkMxMy4yIDIzLjMgMTIgMjQgMTIgMjRaIiBmaWxsPSIjRkY1QTVGIi8+Cjwvc3ZnPg==',
    color: '#FF5A5F',
    announcement: '🏠 Travel Tech Expansion',
    positions: 'Frontend, Platform, Design'
  },
  {
    name: 'Stripe',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjQ3NiA5LjY1NGMwLS43OTItLjUyOC0xLjMyLTEuMzItMS4zMi0uNTI4IDAtMS4wNTYuMjY0LTEuMzIuNzkybC0xLjMyIDIuOTA0aC0yLjExMmwxLjg0OC00LjQ4OGMuNTI4LTEuMzIgMS41ODQtMi4xMTIgMi45MDQtMi4xMTJzMi4zNzYuNzkyIDIuMzc2IDIuMTEydjkuMzEyaC0xLjMydi05LjMxMnoiIGZpbGw9IiM2NzcyRTUiLz4KPC9zdmc+',
    color: '#6772E5',
    announcement: '💳 Fintech Revolution',
    positions: 'Backend, Security, Payments'
  }
];

interface CompanySectionProps {
  companiesRef: React.RefObject<HTMLDivElement>;
}

export default function CompanySection({ companiesRef }: CompanySectionProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced company logos animation
      gsap.to('.company-scroll', {
        x: '-50%',
        duration: 30,
        repeat: -1,
        ease: 'none'
      });

      // Add opposite direction animation for hiring announcements
      gsap.to('.hiring-scroll', {
        x: '50%',
        duration: 35,
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

      // Hiring announcement hover effects
      gsap.utils.toArray('.hiring-card').forEach((card: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          scale: 1.05,
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
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

          // Animate hiring announcements
          gsap.fromTo('.hiring-card',
            { scale: 0, y: 50, opacity: 0 },
            {
              duration: 1,
              scale: 1,
              y: 0,
              opacity: 1,
              ease: 'back.out(1.7)',
              stagger: 0.15,
              delay: 0.5
            }
          );
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

    });

    return () => ctx.revert();
  }, [companiesRef]);

  return (
    <section ref={companiesRef} className={`py-20 overflow-hidden relative transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-dark-surface to-dark-bg' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      <div className={`absolute top-0 left-0 w-full h-2 transform -skew-x-12 ${
        isDark 
          ? 'bg-gradient-to-r from-transparent via-lime/30 to-transparent' 
          : 'bg-gradient-to-r from-transparent via-asu-maroon/30 to-transparent'
      }`}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className={`text-reveal text-4xl md:text-5xl font-bold mb-6 transform -rotate-1 transition-colors duration-300 ${
          isDark ? 'text-dark-text' : 'text-gray-900'
        }`}>
          Trusted by Amazing Companies 🏢
        </h2>
        <p className={`text-reveal text-xl max-w-2xl mx-auto transform rotate-0.5 transition-colors duration-300 ${
          isDark ? 'text-dark-muted' : 'text-gray-600'
        }`}>
          Join thousands of students who've found their dream jobs with these incredible companies! 🌟
        </p>
      </div>

      {/* First Row - Existing company logos */}
    

      {/* Second Row - Hiring Announcements (opposite direction) */}
      <div className="relative mb-12">
        <div className="hiring-scroll flex space-x-12 items-center" style={{ transform: 'translateX(-50%)' }}>
          {[...hiringAnnouncements, ...hiringAnnouncements].map((company, index) => (
            <div key={index} className="hiring-card flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform border-2 border-gray-100 hover:border-blue-200 min-w-[320px]">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="w-16 h-16 object-contain filter drop-shadow-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-2">{company.announcement}</p>
                  <p className="text-gray-600 text-sm">{company.positions}</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      HIRING NOW
                    </span>
                    <span className="text-xs text-gray-500">• Remote OK</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Third Row - Additional hiring announcements (same direction as first) */}
      <div className="relative">
        <div className="company-scroll flex space-x-12 items-center">
          {[...hiringAnnouncements.slice(6), ...hiringAnnouncements.slice(6)].map((company, index) => (
            <div key={index} className="hiring-card flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform border-2 border-gray-100 hover:border-purple-200 min-w-[320px]">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="w-16 h-16 object-contain filter drop-shadow-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
                  <p className="text-purple-600 font-semibold text-sm mb-2">{company.announcement}</p>
                  <p className="text-gray-600 text-sm">{company.positions}</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      URGENT HIRING
                    </span>
                    <span className="text-xs text-gray-500">• Top Salary</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`absolute left-0 top-0 w-32 h-full z-10 ${
        isDark 
          ? 'bg-gradient-to-r from-dark-surface to-transparent' 
          : 'bg-gradient-to-r from-white to-transparent'
      }`}></div>
      <div className={`absolute right-0 top-0 w-32 h-full z-10 ${
        isDark 
          ? 'bg-gradient-to-l from-dark-surface to-transparent' 
          : 'bg-gradient-to-l from-white to-transparent'
      }`}></div>
    </section>
  );
}