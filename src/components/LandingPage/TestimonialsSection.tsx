import React, { useRef, useState } from 'react';
import { 
  Star,
  Verified,
  LocationOn,
  Business,
  ThumbUp,
  ChatBubbleOutline,
  ShareOutlined
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import Typography from '../ui/Typography';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTrigger, useScrollTriggerStagger } from '../../hooks/useScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsSectionProps {
  testimonialsRef: React.RefObject<HTMLDivElement>;
}

interface TestimonialCard {
  id: number;
  name: string;
  avatar: string;
  role: string;
  company: string;
  location: string;
  message: string;
  rating: number;
  likes: number;
  comments: number;
  verified: boolean;
  category: 'internship' | 'job' | 'networking' | 'mentorship' | 'career_fair';
  height: 'short' | 'medium' | 'tall';
}

export default function TestimonialsSection({ testimonialsRef }: TestimonialsSectionProps) {
  const { isDark } = useTheme();
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState(1);

  const testimonials: TestimonialCard[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      role: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      message: "AUT Handshake completely transformed my job search! I landed my dream internship at Google within 2 weeks. The platform's AI matching was spot-on, and the career resources were incredibly helpful. The interview prep sessions gave me the confidence I needed. 10/10 would recommend to every AUT student!",
      rating: 5,
      likes: 127,
      comments: 23,
      verified: true,
      category: 'internship',
      height: 'tall'
    },
    {
      id: 2,
      name: "Marcus Chen",
      avatar: "MC",
      role: "Business Analyst",
      company: "McKinsey & Company",
      location: "New York, NY",
      message: "The networking events through AUT Handshake opened doors I never knew existed. Connected with an alumnus who became my mentor and helped me secure my position at McKinsey. The platform's alumni network is unmatched!",
      rating: 5,
      likes: 89,
      comments: 15,
      verified: true,
      category: 'networking',
      height: 'medium'
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "ER",
      role: "Data Scientist",
      company: "Tesla",
      location: "Austin, TX",
      message: "From career fair to full-time offer in 3 months! The Tesla recruiters I met through AUT Handshake were amazing. They guided me through the entire process. Now I'm working on autonomous driving tech!",
      rating: 5,
      likes: 156,
      comments: 31,
      verified: true,
      category: 'career_fair',
      height: 'medium'
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "DK",
      role: "Marketing Manager",
      company: "Adobe",
      location: "San Francisco, CA",
      message: "The resume review feature was a game-changer! Got personalized feedback that helped me stand out. Landed 3 interviews in one week!",
      rating: 5,
      likes: 73,
      comments: 12,
      verified: true,
      category: 'job',
      height: 'short'
    },
    {
      id: 5,
      name: "Aisha Patel",
      avatar: "AP",
      role: "UX Designer",
      company: "Apple",
      location: "Cupertino, CA",
      message: "The mentorship program connected me with a senior designer at Apple. Their guidance was invaluable in preparing for my interviews. I'm now part of the iOS design team, working on features used by millions! The support system at AUT is incredible.",
      rating: 5,
      likes: 201,
      comments: 45,
      verified: true,
      category: 'mentorship',
      height: 'tall'
    },
    {
      id: 6,
      name: "Jordan Williams",
      avatar: "JW",
      role: "DevOps Engineer",
      company: "Microsoft",
      location: "Seattle, WA",
      message: "The technical interview prep workshops were phenomenal. Practiced with real engineers and got feedback that helped me ace my Microsoft interviews!",
      rating: 5,
      likes: 94,
      comments: 18,
      verified: true,
      category: 'internship',
      height: 'medium'
    },
    {
      id: 7,
      name: "Isabella Garcia",
      avatar: "IG",
      role: "Product Manager",
      company: "Meta",
      location: "Menlo Park, CA",
      message: "Connected with 5 different companies through the platform. The personalized job recommendations were incredibly accurate. Now I'm building products that impact billions of users!",
      rating: 5,
      likes: 118,
      comments: 27,
      verified: true,
      category: 'job',
      height: 'medium'
    },
    {
      id: 8,
      name: "Alex Thompson",
      avatar: "AT",
      role: "Full Stack Developer",
      company: "Airbnb",
      location: "San Francisco, CA",
      message: "The coding bootcamp partnerships were amazing! Upskilled and landed my first tech job at Airbnb. The career transition support was exactly what I needed.",
      rating: 5,
      likes: 87,
      comments: 14,
      verified: true,
      category: 'career_fair',
      height: 'medium'
    },
    {
      id: 9,
      name: "Priya Sharma",
      avatar: "PS",
      role: "Research Scientist",
      company: "Amazon",
      location: "Seattle, WA",
      message: "The research opportunities board helped me find my perfect match at Amazon Lab126. Working on cutting-edge AI research that will shape the future!",
      rating: 5,
      likes: 142,
      comments: 22,
      verified: true,
      category: 'internship',
      height: 'short'
    },
    {
      id: 10,
      name: "Ryan Martinez",
      avatar: "RM",
      role: "Creative Director",
      company: "Netflix",
      location: "Los Angeles, CA",
      message: "The creative portfolio reviews were incredibly helpful. Got feedback from industry professionals that helped me refine my work. Now I'm creating content for Netflix originals! The creative community on AUT Handshake is supportive and inspiring.",
      rating: 5,
      likes: 176,
      comments: 38,
      verified: true,
      category: 'networking',
      height: 'tall'
    },
    {
      id: 11,
      name: "Zoe Chang",
      avatar: "ZC",
      role: "Cybersecurity Analyst",
      company: "IBM",
      location: "Austin, TX",
      message: "The cybersecurity bootcamp through AUT Handshake was intensive but worth every minute. Landed my dream job at IBM Security!",
      rating: 5,
      likes: 91,
      comments: 16,
      verified: true,
      category: 'job',
      height: 'medium'
    },
    {
      id: 12,
      name: "Carlos Mendoza",
      avatar: "CM",
      role: "Solutions Architect",
      company: "Salesforce",
      location: "San Francisco, CA",
      message: "The cloud computing certification programs were excellent. Earned my AWS and Azure certs, then got recruited by Salesforce!",
      rating: 5,
      likes: 105,
      comments: 19,
      verified: true,
      category: 'career_fair',
      height: 'short'
    },
    {
      id: 13,
      name: "Maya Singh",
      avatar: "MS",
      role: "Financial Analyst",
      company: "Goldman Sachs",
      location: "New York, NY",
      message: "The finance career track program was exactly what I needed. Connected with Goldman Sachs recruiters and now I'm working on major deals! The mentorship from AUT alumni made all the difference.",
      rating: 5,
      likes: 134,
      comments: 29,
      verified: true,
      category: 'mentorship',
      height: 'tall'
    },
    {
      id: 14,
      name: "Tyler Brooks",
      avatar: "TB",
      role: "Machine Learning Engineer",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      message: "The AI/ML specialization program through AUT Handshake gave me the skills I needed to land my role at NVIDIA. Now I'm working on the next generation of AI chips!",
      rating: 5,
      likes: 168,
      comments: 33,
      verified: true,
      category: 'internship',
      height: 'medium'
    },
    {
      id: 15,
      name: "Sofia Petrov",
      avatar: "SP",
      role: "Aerospace Engineer",
      company: "SpaceX",
      location: "Hawthorne, CA",
      message: "From AUT to SpaceX! The aerospace career fair connected me with SpaceX engineers. Now I'm working on missions to Mars! The technical workshops were incredible.",
      rating: 5,
      likes: 256,
      comments: 52,
      verified: true,
      category: 'career_fair',
      height: 'tall'
    },
    {
      id: 16,
      name: "Kevin O'Connor",
      avatar: "KO",
      role: "Biotech Researcher",
      company: "Moderna",
      location: "Cambridge, MA",
      message: "The biotech industry connections through AUT Handshake were amazing. Joined Moderna's vaccine research team straight out of college!",
      rating: 5,
      likes: 189,
      comments: 41,
      verified: true,
      category: 'networking',
      height: 'medium'
    },
    {
      id: 17,
      name: "Jasmine Lee",
      avatar: "JL",
      role: "Game Designer",
      company: "Epic Games",
      location: "Cary, NC",
      message: "The gaming industry workshops were fantastic! Connected with Epic Games through a virtual career fair. Now I'm working on Fortnite!",
      rating: 5,
      likes: 147,
      comments: 28,
      verified: true,
      category: 'job',
      height: 'short'
    },
    {
      id: 18,
      name: "Ahmed Hassan",
      avatar: "AH",
      role: "Sustainability Engineer",
      company: "Tesla Energy",
      location: "Austin, TX",
      message: "The green technology track helped me find my passion in sustainable energy. Now I'm designing solar panel systems at Tesla Energy! The environmental focus at AUT prepared me perfectly.",
      rating: 5,
      likes: 123,
      comments: 25,
      verified: true,
      category: 'mentorship',
      height: 'tall'
    }
  ];

  // Dynamic header animation with real-time scroll response
  useScrollTrigger(headerRef, (element, progress) => {
    gsap.set(element, {
      opacity: progress,
      y: (1 - progress) * 60,
      scale: 0.9 + (progress * 0.1),
      rotationY: (1 - progress) * 8,
      ease: 'none'
    });
  }, { 
    start: 'top 10%', 
    end: 'bottom 30%',
    scrub: 1.5 
  });

  // Dynamic stats animation with real-time counter updates
  useScrollTriggerStagger(statsRef, '.stat-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.1;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      // Real-time animations that respond to scroll direction
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 100,
        scale: 0.8 + (elementProgress * 0.2),
        rotationX: (1 - elementProgress) * 20,
        ease: 'none'
      });

      // Real-time number counter for stats
      const numberElement = element.querySelector('.stat-number') as HTMLElement;
      if (numberElement && elementProgress > 0) {
        const targetValue = parseInt(numberElement.getAttribute('data-value') || '0');
        const currentValue = Math.floor(targetValue * elementProgress);
        
        if (targetValue >= 1000) {
          numberElement.textContent = (currentValue / 1000).toFixed(currentValue >= 1000 ? 1 : 0) + 'k+';
        } else if (targetValue >= 95) {
          numberElement.textContent = currentValue + '%';
        } else {
          numberElement.textContent = currentValue + '';
        }
        
        // Dynamic glow effect based on progress
        if (elementProgress > 0.7) {
          numberElement.style.filter = `drop-shadow(0 0 ${(elementProgress - 0.7) * 30}px ${
            isDark ? '#E3FF70' : '#8C1D40'
          })`;
        } else {
          numberElement.style.filter = 'none';
        }
      }
    });
  }, { 
    start: 'top 75%', 
    end: 'bottom 85%',
    scrub: 2 
  });

  // Dynamic testimonial cards animation with real-time scroll response
  useScrollTriggerStagger(gridRef, '.testimonial-card', (elements, progress) => {
    elements.forEach((element, index) => {
      const delay = index * 0.05;
      const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      
      // Real-time card animations
      gsap.set(element, {
        opacity: elementProgress,
        y: (1 - elementProgress) * 120,
        scale: 0.7 + (elementProgress * 0.3),
        rotation: (1 - elementProgress) * 10 * (index % 2 === 0 ? 1 : -1),
        ease: 'none'
      });

      // Dynamic card background and border effects
      const cardElement = element as HTMLElement;
      const borderOpacity = elementProgress * 0.5;
      const shadowIntensity = elementProgress * 25;
      
      cardElement.style.borderColor = `rgba(${isDark ? '227, 255, 112' : '140, 29, 64'}, ${borderOpacity})`;
      cardElement.style.boxShadow = `0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0,0,0,${elementProgress * 0.15})`;
      
      // Dynamic avatar scaling
      const avatar = element.querySelector('.testimonial-avatar');
      if (avatar && elementProgress > 0.3) {
        const avatarProgress = (elementProgress - 0.3) / 0.7;
        gsap.set(avatar, {
          scale: 0.8 + (avatarProgress * 0.4),
          rotation: avatarProgress * 15,
          ease: 'none'
        });
      }
    });
  }, { 
    start: 'top 75%', 
    end: 'bottom 100%',
    scrub: 1.5
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      internship: 'bg-info-100 text-info-800',
      job: 'bg-green-100 text-green-800',
      networking: 'bg-purple-100 text-purple-800',
      mentorship: 'bg-orange-100 text-orange-800',
      career_fair: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section ref={testimonialsRef} className={`py-24 transition-colors duration-300 overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-black via-black to-purple-900' 
        : 'bg-gradient-to-br from-black via-black to-purple-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
       
        {/* Enhanced Stats */}
       

        {/* Enhanced Pinterest-style Grid */}
       

        {/* Load More Button */}
       

        {/* Call to Action */}
     
        {/* Messaging Interface Section */}
        <div className="mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="header-badge inline-flex items-center space-x-2">
                 
                  <Typography variant="body1" className={`font-medium ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}>
                  </Typography>
                </div>
                
                <Typography 
                  variant="h2" 
                  className={`text-4xl md:text-5xl font-bold leading-tight ${
                    isDark ? 'text-lime' : 'text-lime'
                  }`}
                >
                  Connect Directly with Recruiters & Land Your Dream Job
                </Typography>

                <Typography 
                  variant="h6" 
                  className={`text-xl leading-relaxed ${
                    isDark ? 'text-dark-muted' : 'text-lime'
                  }`}
                >
                  See real conversations between students and employers. Join over 2,500 AUT students who have successfully connected with top companies through our platform.
                </Typography>

                {/* Key Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <Typography variant="body1" className={`font-medium ${isDark ? 'text-lime' : 'text-lime'}`}>
                      Direct messaging with recruiters
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <Typography variant="body1" className={`font-medium ${isDark ? 'text-lime' : 'text-lime'}`}>
                      Real-time event coordination
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <Typography variant="body1" className={`font-medium ${isDark ? 'text-lime' : 'text-lime'}`}>
                      Career fair scheduling
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <Typography variant="body1" className={`font-medium ${isDark ? 'text-lime' : 'text-lime'}`}>
                      Interview coordination
                    </Typography>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <button className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isDark 
                      ? 'bg-lime text-dark-bg hover:bg-lime/90' 
                      : 'bg-asu-maroon text-white hover:bg-asu-maroon/90'
                  }`}>
                    Start Connecting Today
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Testimonials Image */}
            <div className="relative">
              <div className="relative">
                <img 
                  src="/testimonials.png" 
                  alt="Student testimonials and success stories" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                {/* Optional overlay for better integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}