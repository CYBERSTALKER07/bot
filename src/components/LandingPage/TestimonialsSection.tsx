import React, { useRef, useEffect, useState } from 'react';
import { 
  Star,
  FormatQuote,
  School,
  Business,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  FiberManualRecord,
  Check,
  Reply,
  ThumbUp,
  Favorite,
  MoreVert,
  AttachFile,
  EmojiEmotions
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import Typography from '../ui/Typography';
import { gsap } from 'gsap';

interface TestimonialsSectionProps {
  testimonialsRef: React.RefObject<HTMLDivElement>;
}

export default function TestimonialsSection({ testimonialsRef }: TestimonialsSectionProps) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentConversation, setCurrentConversation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  const conversations = [
    {
      id: 1,
      title: "Student Success Story",
      subtitle: "Microsoft Internship",
      participants: ["Sarah Johnson", "Career Advisor"],
      messages: [
        {
          id: 1,
          sender: "Sarah Johnson",
          avatar: "👩‍💻",
          role: "CS Student • ASU",
          message: "Hi! I just wanted to share some amazing news - I got the Microsoft internship! 🎉",
          timestamp: "2:14 PM",
          isUser: false,
          type: "incoming",
          reactions: [{ emoji: "🎊", count: 5 }, { emoji: "👏", count: 3 }],
          status: "delivered"
        },
        {
          id: 2,
          sender: "Career Advisor",
          avatar: "👨‍🏫",
          role: "ASU Career Center",
          message: "That's fantastic, Sarah! Congratulations! 🎊 Tell us more about your experience.",
          timestamp: "2:15 PM",
          isUser: true,
          type: "outgoing",
          status: "read"
        },
        {
          id: 3,
          sender: "Sarah Johnson",
          avatar: "👩‍💻",
          role: "CS Student • ASU",
          message: "The platform made it so easy to connect with recruiters and showcase my projects. Found my dream internship within 2 weeks! Highly recommend to all Sun Devils! 🚀",
          timestamp: "2:16 PM",
          isUser: false,
          type: "incoming",
          reactions: [{ emoji: "🔥", count: 8 }, { emoji: "💪", count: 4 }],
          status: "delivered"
        },
        {
          id: 4,
          sender: "Sarah Johnson",
          avatar: "👩‍💻",
          role: "CS Student • ASU",
          message: "They even helped me negotiate my salary and provided interview prep resources. Game changer! 💰",
          timestamp: "2:17 PM",
          isUser: false,
          type: "incoming",
          status: "delivered"
        }
      ]
    },
    {
      id: 2,
      title: "Employer Partnership",
      subtitle: "Adobe Recruitment",
      participants: ["David Kim", "ASU Recruiter"],
      messages: [
        {
          id: 1,
          sender: "David Kim",
          avatar: "👨‍💼",
          role: "Senior HR Manager • Adobe",
          message: "Thank you for reaching out! I am going to sign up for a time to meet with you.",
          timestamp: "11:30 AM",
          isUser: false,
          type: "incoming",
          status: "delivered"
        },
        {
          id: 2,
          sender: "ASU Recruiter",
          avatar: "🔱",
          role: "ASU Handshake Team",
          message: "Perfect! Looking forward to discussing our partnership opportunities.",
          timestamp: "11:31 AM",
          isUser: true,
          type: "outgoing",
          status: "read"
        },
        {
          id: 3,
          sender: "David Kim",
          avatar: "👨‍💼",
          role: "Senior HR Manager • Adobe",
          message: "We've hired 15+ ASU students through this platform this year alone. The quality of candidates is outstanding, and the process is seamless. Perfect for finding top talent! 🎯",
          timestamp: "11:45 AM",
          isUser: false,
          type: "incoming",
          reactions: [{ emoji: "🙌", count: 12 }, { emoji: "⭐", count: 7 }],
          status: "delivered"
        },
        {
          id: 4,
          sender: "David Kim",
          avatar: "👨‍💼",
          role: "Senior HR Manager • Adobe",
          message: "Just approved 5 more positions exclusively for ASU students. Ready to post them!",
          timestamp: "11:46 AM",
          isUser: false,
          type: "incoming",
          status: "delivered"
        }
      ]
    },
    {
      id: 3,
      title: "Career Fair Success",
      subtitle: "Tesla Connection",
      participants: ["Emily Rodriguez", "Tesla Recruiter"],
      messages: [
        {
          id: 1,
          sender: "Tesla Recruiter",
          avatar: "🏢",
          role: "Engineering Recruiter • Tesla",
          message: "Hi Emily! We'll be on campus for the Engineering & Data Career Fair in Tempe, AZ on Friday, Jan 20. Stop by booth #15 to network and explore opportunities with us! ⚡",
          timestamp: "9:00 AM",
          isUser: false,
          type: "incoming",
          status: "delivered"
        },
        {
          id: 2,
          sender: "Emily Rodriguez",
          avatar: "👩‍🔬",
          role: "Engineering Student • ASU",
          message: "Amazing! I'll definitely be there. Really excited about Tesla's mission. 🚗",
          timestamp: "9:05 AM",
          isUser: true,
          type: "outgoing",
          status: "read"
        },
        {
          id: 3,
          sender: "Emily Rodriguez",
          avatar: "👩‍🔬",
          role: "Engineering Student • ASU",
          message: "Update: Just finished my Tesla internship! As a first-generation college student, I didn't know where to start. This platform guided me through everything and now I have a full-time offer! 💪",
          timestamp: "6 months later...",
          isUser: true,
          type: "outgoing",
          reactions: [{ emoji: "🚀", count: 15 }, { emoji: "🙌", count: 9 }],
          status: "read"
        },
        {
          id: 4,
          sender: "Tesla Recruiter",
          avatar: "🏢",
          role: "Engineering Recruiter • Tesla",
          message: "So proud of your journey, Emily! Welcome to the Tesla family! 🎉",
          timestamp: "Just now",
          isUser: false,
          type: "incoming",
          status: "delivered"
        }
      ]
    },
    {
      id: 4,
      title: "Networking Success",
      subtitle: "LinkedIn Connection",
      participants: ["Marcus Thompson", "Alumni Mentor"],
      messages: [
        {
          id: 1,
          sender: "Marcus Thompson",
          avatar: "👨‍💼",
          role: "Business Student • ASU",
          message: "Hi! I saw your profile and noticed we're both ASU alumni. Would love to connect and learn about your experience at Goldman Sachs.",
          timestamp: "3:22 PM",
          isUser: true,
          type: "outgoing",
          status: "read"
        },
        {
          id: 2,
          sender: "Alumni Mentor",
          avatar: "👔",
          role: "VP • Goldman Sachs • ASU '18",
          message: "Absolutely! Always happy to help fellow Sun Devils. Let's set up a call this week.",
          timestamp: "3:45 PM",
          isUser: false,
          type: "incoming",
          status: "delivered"
        },
        {
          id: 3,
          sender: "Marcus Thompson",
          avatar: "👨‍💼",
          role: "Business Student • ASU",
          message: "Just got the Goldman Sachs internship! Thank you so much for the mentorship and referral. This platform's alumni network is incredible! 🏆",
          timestamp: "2 weeks later",
          isUser: true,
          type: "outgoing",
          reactions: [{ emoji: "🔥", count: 20 }, { emoji: "💯", count: 12 }],
          status: "read"
        }
      ]
    }
  ];

  const nextConversation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const nextIndex = (currentConversation + 1) % conversations.length;
    
    // Show typing indicator before transition
    setShowTypingIndicator(true);
    setTimeout(() => setShowTypingIndicator(false), 1000);
    
    // Animate out current conversation
    gsap.to(containerRef.current?.children[currentConversation], {
      opacity: 0,
      x: -50,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        setCurrentConversation(nextIndex);
        
        // Animate in next conversation
        gsap.fromTo(containerRef.current?.children[nextIndex], 
          { opacity: 0, x: 50 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.5, 
            ease: "power2.out",
            onComplete: () => setIsAnimating(false)
          }
        );
      }
    });
  };

  useEffect(() => {
    // Initialize conversations
    if (containerRef.current) {
      gsap.set(containerRef.current.children, { opacity: 0, x: 50 });
      gsap.set(containerRef.current.children[0], { opacity: 1, x: 0 });
    }

    // Auto-advance conversations
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextConversation();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Animate messages when conversation changes
  useEffect(() => {
    const messages = containerRef.current?.children[currentConversation]?.querySelectorAll('.message-bubble');
    if (messages) {
      gsap.fromTo(messages, 
        { opacity: 0, y: 20, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [currentConversation]);

  return (
    <section ref={testimonialsRef} className={`py-24 transition-colors duration-300 ${
      isDark ? 'bg-dark-surface' : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <Typography variant="h6" className="text-white">💬</Typography>
            </div>
            <Typography variant="body1" className={`font-medium ${
              isDark ? 'text-lime' : 'text-asu-maroon'
            }`}>
              REAL CONVERSATIONS
            </Typography>
          </div>
          <Typography 
            variant="h2" 
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}
          >
            Success Stories from Sun Devils
          </Typography>
          <Typography 
            variant="h6" 
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}
          >
            See how ASU students and employers connect through authentic conversations that lead to life-changing opportunities
          </Typography>
        </div>

        {/* Enhanced Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { number: "95%", label: "Success Rate", icon: "📈" },
            { number: "48hr", label: "Avg Response Time", icon: "⚡" },
            { number: "2,500+", label: "Active Connections", icon: "🤝" },
            { number: "150+", label: "Partner Companies", icon: "🏢" }
          ].map((stat, index) => (
            <Card key={index} className={`text-center p-6 ${
              isDark ? 'bg-dark-bg/50' : 'bg-white/80'
            } backdrop-blur-sm`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <Typography variant="h3" className={`text-2xl font-bold ${
                isDark ? 'text-dark-text' : 'text-gray-900'
              }`}>
                {stat.number}
              </Typography>
              <Typography variant="body2" className={`${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                {stat.label}
              </Typography>
            </Card>
          ))}
        </div>

        {/* Enhanced Conversation Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Enhanced Progress Indicators */}
          <div className="flex justify-center mb-8 space-x-3">
            {conversations.map((conversation, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentConversation
                    ? (isDark ? 'bg-lime/20 border-2 border-lime' : 'bg-asu-maroon/20 border-2 border-asu-maroon')
                    : (isDark ? 'bg-dark-muted/20 border-2 border-transparent' : 'bg-gray-200 border-2 border-transparent')
                }`}
                onClick={() => !isAnimating && setCurrentConversation(index)}
              >
                <div className={`w-3 h-3 rounded-full ${
                  index === currentConversation
                    ? (isDark ? 'bg-lime' : 'bg-asu-maroon')
                    : (isDark ? 'bg-dark-muted' : 'bg-gray-400')
                }`} />
                <Typography variant="body2" className={`text-xs font-medium ${
                  index === currentConversation
                    ? (isDark ? 'text-lime' : 'text-asu-maroon')
                    : (isDark ? 'text-dark-muted' : 'text-gray-500')
                }`}>
                  {conversation.subtitle}
                </Typography>
              </div>
            ))}
          </div>

          {/* Enhanced Conversations */}
          <div ref={containerRef} className="relative min-h-[700px]">
            {conversations.map((conversation, conversationIndex) => (
              <div
                key={conversation.id}
                className={`absolute inset-0 ${
                  conversationIndex === currentConversation ? 'z-10' : 'z-0'
                }`}
              >
                {/* Enhanced Chat Header */}
                <div className={`flex items-center justify-between p-6 rounded-t-2xl ${
                  isDark ? 'bg-dark-bg border-b border-dark-muted/20' : 'bg-white border-b border-gray-200'
                } shadow-lg`}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-asu-maroon to-asu-gold flex items-center justify-center shadow-lg">
                        <Typography variant="body1" className="text-white font-bold text-lg">
                          🎓
                        </Typography>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <Typography variant="h6" className={`font-bold ${
                        isDark ? 'text-dark-text' : 'text-gray-900'
                      }`}>
                        {conversation.title}
                      </Typography>
                      <Typography variant="body2" className={`${
                        isDark ? 'text-dark-muted' : 'text-gray-500'
                      }`}>
                        {conversation.participants.join(" • ")}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <Typography variant="body2" className="text-green-600 font-medium">
                        Active
                      </Typography>
                    </div>
                    <button className={`p-2 rounded-full ${
                      isDark ? 'hover:bg-dark-muted/20' : 'hover:bg-gray-100'
                    }`}>
                      <MoreVert className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Messages */}
                <div className={`p-6 space-y-6 rounded-b-2xl min-h-[550px] ${
                  isDark ? 'bg-dark-bg/70' : 'bg-white/90'
                } backdrop-blur-sm`}>
                  {conversation.messages.map((message, messageIndex) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-bubble`}
                    >
                      <div className={`flex max-w-md lg:max-w-lg ${
                        message.isUser ? 'flex-row-reverse' : 'flex-row'
                      } items-start space-x-3`}>
                        {/* Enhanced Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg ${
                          message.isUser 
                            ? 'bg-gradient-to-br from-asu-maroon to-asu-gold text-white' 
                            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        }`}>
                          {message.avatar}
                        </div>

                        {/* Enhanced Message Content */}
                        <div className={`${message.isUser ? 'mr-3' : 'ml-3'} space-y-2`}>
                          <div className={`px-5 py-4 rounded-2xl shadow-lg ${
                            message.isUser
                              ? (isDark ? 'bg-lime text-dark-bg' : 'bg-asu-maroon text-white')
                              : (isDark ? 'bg-dark-bg border border-dark-muted/20 text-dark-text' : 'bg-white border border-gray-200 text-gray-900')
                          } ${
                            message.isUser ? 'rounded-br-lg' : 'rounded-bl-lg'
                          }`}>
                            <Typography variant="body1" className="leading-relaxed">
                              {message.message}
                            </Typography>
                          </div>
                          
                          {/* Message Reactions */}
                          {message.reactions && (
                            <div className="flex space-x-1 px-2">
                              {message.reactions.map((reaction, reactionIndex) => (
                                <div
                                  key={reactionIndex}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                                    isDark ? 'bg-dark-muted/20' : 'bg-gray-100'
                                  }`}
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className={`${
                                    isDark ? 'text-dark-muted' : 'text-gray-600'
                                  }`}>
                                    {reaction.count}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Enhanced Message Info */}
                          <div className={`flex items-center mt-2 space-x-2 ${
                            message.isUser ? 'justify-end' : 'justify-start'
                          }`}>
                            <Typography variant="body2" className={`text-xs font-medium ${
                              isDark ? 'text-dark-muted' : 'text-gray-500'
                            }`}>
                              {message.sender}
                            </Typography>
                            <Typography variant="body2" className={`text-xs ${
                              isDark ? 'text-dark-muted' : 'text-gray-400'
                            }`}>
                              {message.timestamp}
                            </Typography>
                            {message.isUser && (
                              <div className="flex items-center space-x-1">
                                <Check className="w-4 h-4 text-blue-500" />
                                {message.status === 'read' && (
                                  <Check className="w-4 h-4 text-blue-500 -ml-2" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {showTypingIndicator && (
                    <div className="flex justify-start message-bubble">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                          💭
                        </div>
                        <div className={`px-5 py-4 rounded-2xl rounded-bl-lg ${
                          isDark ? 'bg-dark-bg border border-dark-muted/20' : 'bg-white border border-gray-200'
                        }`}>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={nextConversation}
              disabled={isAnimating}
              className={`px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg ${
                isDark 
                  ? 'bg-lime text-dark-bg hover:bg-lime/90 hover:shadow-xl' 
                  : 'bg-asu-maroon text-white hover:bg-asu-maroon/90 hover:shadow-xl'
              } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {isAnimating ? 'Loading...' : 'Next Conversation →'}
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className={`p-8 max-w-2xl mx-auto ${
            isDark ? 'bg-dark-bg/50' : 'bg-white/80'
          } backdrop-blur-sm`}>
            <Typography variant="h5" className={`font-bold mb-4 ${
              isDark ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Ready to Start Your Success Story?
            </Typography>
            <Typography variant="body1" className={`mb-6 ${
              isDark ? 'text-dark-muted' : 'text-gray-600'
            }`}>
              Join thousands of Sun Devils who have found their dream opportunities through meaningful connections
            </Typography>
            <button className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
              isDark 
                ? 'bg-lime text-dark-bg hover:bg-lime/90' 
                : 'bg-asu-maroon text-white hover:bg-asu-maroon/90'
            } hover:scale-105 shadow-lg`}>
              Get Started Today 🚀
            </button>
          </Card>
        </div>
      </div>
    </section>
  );
}