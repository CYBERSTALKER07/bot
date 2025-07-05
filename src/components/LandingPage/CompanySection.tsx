import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCAxMkMyNCA1LjM3MjU4IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTggMCAwIDUuMzcyNTggMCAxMkMwIDE4LjYyNzQgNS4zNzI1OCAyNCAxMiAyNFoiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTEyIDIwQzE2LjQxODMgMjAgMjAgMTYuNDE4MyAyMCAxMkMyMCA3LjU4MTcyIDE2LjQxODMgNCAxMiA0QzcuNTgxNzIgNCA0IDcuNTgxNzIgNCAxMkM0IDE2LjQxODMgNy41ODE3MiAyMCAxMiAyMFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
    color: '#000000'
  },
  { 
    name: 'Airbnb', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0YzAgMC0xLjItLjctMi40LTJDNy4yIDIwIDQgMTYgNCAxMi44IDQgOC4yIDcuNiA0LjQgMTIgNC40czggMy44IDggOC40YzAgMy4yLTMuMiA3LjItNS42IDkuNkMxMy4yIDIzLjMgMTIgMjQgMTIgMjRaIiBmaWxsPSIjRkY1QTVGIi8+Cjwvc3ZnPg==',
    color: '#FF5A5F'
  }
];

interface CompanySectionProps {
  companiesRef: React.RefObject<HTMLDivElement>;
}

export default function CompanySection({ companiesRef }: CompanySectionProps) {
  useEffect(() => {
    const ctx = gsap.context(() => {
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
    <section ref={companiesRef} className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-asu-maroon/30 to-transparent transform -skew-x-12"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-reveal text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform -rotate-1">
          Trusted by Amazing Companies 🏢
        </h2>
        <p className="text-reveal text-xl text-gray-600 max-w-2xl mx-auto transform rotate-0.5">
          Join thousands of students who've found their dream jobs with these incredible companies! 🌟
        </p>
      </div>
      <div className="relative">
        <div className="company-scroll flex space-x-16 items-center">
          {[...companyLogos, ...companyLogos].map((company, index) => (
            <div key={index} className={`company-logo flex-shrink-0 bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border-2 border-gray-100 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
              <div className="flex items-center space-x-4">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="w-12 h-12 object-contain filter hover:saturate-150 transition-all duration-300"
                  style={{ filter: `drop-shadow(0 4px 6px ${company.color}20)` }}
                />
                <span className="company-name font-bold text-xl text-gray-800">{company.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </section>
  );
}