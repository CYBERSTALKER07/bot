import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  GraduationCap, 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  TrendingUp 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DemoSectionProps {
  demoRef: React.RefObject<HTMLDivElement>;
}

export default function DemoSection({ demoRef }: DemoSectionProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced demo section with parallax
      ScrollTrigger.create({
        trigger: demoRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
        onUpdate: (self) => {
          gsap.to('.demo-bg', {
            y: self.progress * 150,
            rotation: self.progress * 10,
            ease: 'none'
          });
        }
      });
    });

    return () => ctx.revert();
  }, [demoRef]);

  return (
    <section ref={demoRef} className={`relative py-24 overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-r from-dark-surface via-dark-bg to-dark-surface' 
        : 'bg-gradient-to-r from-asu-maroon via-asu-maroon-dark to-asu-maroon'
    }`}>
      <div className={`demo-bg absolute inset-0 ${
        isDark ? 'bg-dark-bg/20' : 'bg-black/20'
      }`}></div>
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl ${
          isDark ? 'bg-lime/10' : 'bg-asu-gold/10'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-dark-accent/5' : 'bg-white/5'
        }`}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 ${
          isDark ? 'text-dark-text' : 'text-white'
        }`}>
          <h2 className="text-reveal text-5xl md:text-6xl font-bold mb-8">
            See ASU Handshake in Action
          </h2>
          <p className={`text-reveal text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
            isDark ? 'text-dark-muted' : 'text-gray-200'
          }`}>
            Experience our intuitive platform designed specifically for ASU students and employers
          </p>
        </div>

        {/* Demo Image/Screenshot */}
        <div className="relative max-w-6xl mx-auto">
          <div className={`relative backdrop-blur-xl rounded-3xl p-4 border shadow-2xl transition-colors duration-300 ${
            isDark 
              ? 'bg-dark-surface/10 border-lime/20' 
              : 'bg-white/10 border-white/20'
          }`}>
            {/* Browser Chrome */}
            <div className={`flex items-center space-x-2 mb-4 p-4 rounded-t-2xl ${
              isDark ? 'bg-dark-surface/20' : 'bg-white/20'
            }`}>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className={`flex-1 rounded-full px-4 py-1 ml-4 ${
                isDark ? 'bg-dark-surface/20' : 'bg-white/20'
              }`}>
                <span className={`text-sm ${
                  isDark ? 'text-dark-muted/70' : 'text-white/70'
                }`}>asu-handshake.com/dashboard</span>
              </div>
            </div>

            {/* Demo Dashboard Content */}
            <div className={`rounded-2xl p-8 min-h-[500px] transition-colors duration-300 ${
              isDark ? 'bg-dark-surface' : 'bg-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <GraduationCap className={`h-8 w-8 ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`} />
                  <span className={`font-bold text-xl ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>ASU Handshake</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full ${
                    isDark ? 'bg-lime' : 'bg-asu-maroon'
                  }`}></div>
                  <span className={`font-medium ${
                    isDark ? 'text-dark-text' : 'text-gray-700'
                  }`}>Sarah Johnson</span>
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job Listings */}
                <div className="lg:col-span-2">
                  <h2 className={`text-2xl font-bold mb-6 ${
                    isDark ? 'text-dark-text' : 'text-gray-900'
                  }`}>Recommended for You</h2>
                  <div className="space-y-4">
                    {/* Job Card 1 */}
                    <div className={`rounded-xl p-6 border hover:shadow-lg transition-shadow ${
                      isDark 
                        ? 'bg-dark-bg border-lime/20 hover:border-lime/40' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className={`font-bold text-lg ${
                            isDark ? 'text-dark-text' : 'text-gray-900'
                          }`}>Software Engineering Intern</h3>
                          <p className={`font-medium ${
                            isDark ? 'text-lime' : 'text-asu-maroon'
                          }`}>Google</p>
                          <p className={`text-sm ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`}>Mountain View, CA</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          98% Match
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Python</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Machine Learning</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          isDark ? 'text-dark-muted' : 'text-gray-600'
                        }`}>Posted 2 days ago</span>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                          isDark ? 'bg-lime' : 'bg-asu-maroon'
                        }`}>
                          Quick Apply
                        </button>
                      </div>
                    </div>

                    {/* Job Card 2 */}
                    <div className={`rounded-xl p-6 border ${
                      isDark 
                        ? 'bg-dark-bg border-lime/20' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className={`font-bold text-lg ${
                            isDark ? 'text-dark-text' : 'text-gray-900'
                          }`}>Data Science Intern</h3>
                          <p className={`font-medium ${
                            isDark ? 'text-lime' : 'text-asu-maroon'
                          }`}>Microsoft</p>
                          <p className={`text-sm ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`}>Redmond, WA</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          92% Match
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          isDark ? 'text-dark-muted' : 'text-gray-600'
                        }`}>Posted 1 week ago</span>
                        <button className={`border px-4 py-2 rounded-lg text-sm font-medium ${
                          isDark 
                            ? 'border-lime text-lime hover:bg-lime hover:text-dark-surface' 
                            : 'border-asu-maroon text-asu-maroon'
                        }`}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Profile Completion */}
                  <div className={`rounded-xl p-6 text-white ${
                    isDark 
                      ? 'bg-gradient-to-br from-lime to-dark-accent' 
                      : 'bg-gradient-to-br from-asu-maroon to-asu-maroon-dark'
                  }`}>
                    <h3 className="font-bold mb-3">Profile Strength</h3>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                      <div className={`h-2 rounded-full ${
                        isDark ? 'bg-dark-surface' : 'bg-asu-gold'
                      }`} style={{ width: '85%' }}></div>
                    </div>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-dark-surface/90' : 'text-gray-200'
                    }`}>85% Complete - Add portfolio to boost visibility</p>
                    <button className={`text-sm font-medium w-full px-4 py-2 rounded-lg ${
                      isDark 
                        ? 'bg-dark-surface text-lime' 
                        : 'bg-white text-asu-maroon'
                    }`}>
                      Complete Profile
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className={`rounded-xl p-6 ${
                    isDark ? 'bg-dark-bg' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-bold mb-4 ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>Your Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>Applications Sent</span>
                        <span className={`font-bold ${
                          isDark ? 'text-lime' : 'text-asu-maroon'
                        }`}>12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>Profile Views</span>
                        <span className={`font-bold ${
                          isDark ? 'text-lime' : 'text-asu-maroon'
                        }`}>47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-dark-muted' : 'text-gray-600'}>Messages</span>
                        <span className={`font-bold ${
                          isDark ? 'text-lime' : 'text-asu-maroon'
                        }`}>3</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className={`rounded-xl p-6 ${
                    isDark ? 'bg-dark-bg' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-bold mb-4 ${
                      isDark ? 'text-dark-text' : 'text-gray-900'
                    }`}>Upcoming Events</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-lime' : 'bg-asu-maroon'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">Tech Career Fair</p>
                          <p className={`text-xs ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`}>Tomorrow, 10 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-dark-accent' : 'bg-asu-gold'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">Resume Workshop</p>
                          <p className={`text-xs ${
                            isDark ? 'text-dark-muted' : 'text-gray-600'
                          }`}>Friday, 2 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements around demo */}
          <div className={`absolute -top-8 -left-8 w-16 h-16 rounded-full blur-lg animate-pulse ${
            isDark ? 'bg-lime/20' : 'bg-asu-gold/20'
          }`}></div>
          <div className={`absolute -bottom-8 -right-8 w-20 h-20 rounded-full blur-lg animate-pulse ${
            isDark ? 'bg-dark-accent/10' : 'bg-white/10'
          }`}></div>
          <div className={`absolute top-1/2 -left-12 w-12 h-12 rounded-full blur-lg animate-pulse ${
            isDark ? 'bg-lime/20' : 'bg-asu-maroon/20'
          }`}></div>
        </div>

        {/* Demo Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className={`backdrop-blur-lg rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-dark-surface/10 border-lime/20' 
              : 'bg-white/10 border-white/20'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark ? 'bg-lime' : 'bg-asu-gold'
            }`}>
              <Zap className={`h-6 w-6 ${
                isDark ? 'text-dark-surface' : 'text-asu-maroon'
              }`} />
            </div>
            <h3 className={`font-bold mb-2 ${
              isDark ? 'text-dark-text' : 'text-white'
            }`}>Instant Matching</h3>
            <p className={`text-sm ${
              isDark ? 'text-dark-muted' : 'text-gray-200'
            }`}>AI algorithms match you with relevant opportunities in real-time</p>
          </div>
          <div className={`backdrop-blur-lg rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-dark-surface/10 border-lime/20' 
              : 'bg-white/10 border-white/20'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark ? 'bg-lime' : 'bg-asu-gold'
            }`}>
              <MessageSquare className={`h-6 w-6 ${
                isDark ? 'text-dark-surface' : 'text-asu-maroon'
              }`} />
            </div>
            <h3 className={`font-bold mb-2 ${
              isDark ? 'text-dark-text' : 'text-white'
            }`}>Direct Communication</h3>
            <p className={`text-sm ${
              isDark ? 'text-dark-muted' : 'text-gray-200'
            }`}>Message employers directly without intermediaries</p>
          </div>
          <div className={`backdrop-blur-lg rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-dark-surface/10 border-lime/20' 
              : 'bg-white/10 border-white/20'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark ? 'bg-lime' : 'bg-asu-gold'
            }`}>
              <TrendingUp className={`h-6 w-6 ${
                isDark ? 'text-dark-surface' : 'text-asu-maroon'
              }`} />
            </div>
            <h3 className={`font-bold mb-2 ${
              isDark ? 'text-dark-text' : 'text-white'
            }`}>Track Progress</h3>
            <p className={`text-sm ${
              isDark ? 'text-dark-muted' : 'text-gray-200'
            }`}>Monitor your applications and optimize your success rate</p>
          </div>
        </div>

        {/* CTA for Demo */}
        <div className="text-center mt-12">
          <Link to="/register?role=student" className={`inline-flex items-center px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
            isDark 
              ? 'bg-lime text-dark-surface hover:bg-dark-accent' 
              : 'bg-asu-gold text-asu-maroon hover:bg-yellow-300'
          }`}>
            Try It Free Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className={`mt-4 text-sm ${
            isDark ? 'text-dark-muted' : 'text-gray-300'
          }`}>No credit card required • Setup in under 2 minutes</p>
        </div>
      </div>
    </section>
  );
}