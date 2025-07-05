import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Building2 } from 'lucide-react';

interface CTASectionProps {
  ctaRef: React.RefObject<HTMLDivElement>;
}

export default function CTASection({ ctaRef }: CTASectionProps) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced CTA section
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.cta-content', {
            duration: 1.5,
            y: 80,
            opacity: 0,
            scale: 0.9,
            ease: 'power3.out'
          });

          gsap.from('.cta-button', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: 'elastic.out(1, 0.3)',
            stagger: 0.2,
            delay: 0.5
          });
        }
      });
    });

    return () => ctx.revert();
  }, [ctaRef]);

  return (
    <section ref={ctaRef} className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-asu-maroon to-transparent"></div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="cta-content">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Ready to Launch Your
            <span className="block bg-gradient-to-r from-asu-maroon to-asu-maroon-dark bg-clip-text text-transparent">
              Dream Career?
            </span>
          </h2>
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of ASU students who have already found their dream jobs with top companies worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/register?role=student" className="cta-button group bg-gradient-to-r from-asu-maroon to-asu-maroon-dark text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 flex items-center justify-center relative overflow-hidden">
              <span className="relative z-10">Start as Student</span>
              <GraduationCap className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-asu-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link to="/register?role=employer" className="cta-button group border-3 border-asu-maroon text-asu-maroon px-10 py-5 rounded-full font-bold text-xl hover:bg-asu-maroon hover:text-white hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 flex items-center justify-center relative overflow-hidden">
              <span className="relative z-10">Post Jobs</span>
              <Building2 className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-asu-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            No credit card required • Setup in under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}