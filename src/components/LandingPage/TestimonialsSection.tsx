import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TestimonialsSectionProps {
  testimonialsRef: React.RefObject<HTMLDivElement>;
}

export default function TestimonialsSection({ testimonialsRef }: TestimonialsSectionProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Testimonials - animate individual elements
      ScrollTrigger.create({
        trigger: testimonialsRef.current,
        start: 'top 70%',
        onEnter: () => {
          // Animate testimonial avatars/emojis
          gsap.fromTo('.testimonial-avatar',
            { scale: 0, rotation: 360 },
            {
              duration: 1,
              scale: 1,
              rotation: 0,
              ease: 'back.out(1.7)',
              stagger: 0.2
            }
          );

          // Animate stars individually
          gsap.fromTo('.testimonial-stars', 
            { scale: 0, rotation: 180, opacity: 0 },
            {
              duration: 0.8,
              scale: 1,
              rotation: 0,
              opacity: 1,
              ease: 'elastic.out(1, 0.3)',
              stagger: 0.05,
              delay: 0.5
            }
          );

          // Animate quote text with typewriter effect
          gsap.fromTo('.testimonial-quote',
            { opacity: 0, width: 0 },
            {
              duration: 1.5,
              opacity: 1,
              width: '100%',
              ease: 'power2.out',
              stagger: 0.3,
              delay: 1
            }
          );

          // Animate author info
          gsap.fromTo('.testimonial-author',
            { opacity: 0, y: 20 },
            {
              duration: 0.8,
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              stagger: 0.2,
              delay: 1.8
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, [testimonialsRef]);

  return (
    <section ref={testimonialsRef} className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-dark-bg' 
        : 'bg-gray-900'
    }`}>
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-dark-surface to-dark-bg' 
          : 'bg-gradient-to-b from-gray-800 to-gray-900'
      }`}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`text-reveal text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-dark-text' : 'text-white'
          }`}>
            Success Stories
          </h2>
          <p className={`text-reveal text-xl max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-dark-muted' : 'text-gray-300'
          }`}>
            Hear from students who found their dream careers through our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              name: "Sarah Johnson",
              role: "Software Engineer at Google",
              image: "👩‍💻",
              quote: "ASU Handshake helped me land my dream job at Google. The AI matching was incredibly accurate and the direct connection with recruiters made all the difference!",
              rating: 5,
              gradient: isDark ? "from-lime to-dark-accent" : "from-blue-500 to-purple-600"
            },
            {
              name: "Michael Chen",
              role: "Data Analyst at Microsoft", 
              image: "👨‍💼",
              quote: "The career resources and direct employer connections were game-changers for my job search. I got my offer within 2 weeks of signing up!",
              rating: 5,
              gradient: isDark ? "from-lime to-dark-accent" : "from-green-500 to-teal-600"
            },
            {
              name: "Emma Rodriguez",
              role: "Marketing Manager at Adobe",
              image: "👩‍🎨", 
              quote: "I found my internship and full-time offer through this platform. The process was seamless and professional. Highly recommend to all ASU students!",
              rating: 5,
              gradient: isDark ? "from-lime to-dark-accent" : "from-pink-500 to-red-600"
            }
          ].map((testimonial, index) => (
            <div key={index} className={`testimonial-card group relative rounded-3xl p-10 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-2xl ${
              isDark ? 'bg-dark-surface' : 'bg-white'
            }`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="testimonial-avatar text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{testimonial.image}</div>
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="testimonial-stars h-6 w-6 text-yellow-400 fill-current mx-1" />
                  ))}
                </div>
                <p className={`testimonial-quote mb-8 italic text-lg leading-relaxed transition-colors duration-300 ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }}`}>"{testimonial.quote}"</p>
                <div className="testimonial-author border-t pt-6">
                  <h4 className={`font-bold text-xl transition-colors duration-300 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>{testimonial.name}</h4>
                  <p className={`font-semibold text-lg transition-colors duration-300 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}