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

interface DemoSectionProps {
  demoRef: React.RefObject<HTMLDivElement>;
}

export default function DemoSection({ demoRef }: DemoSectionProps) {
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
    <section ref={demoRef} className="relative py-24 bg-gradient-to-r from-asu-maroon via-asu-maroon-dark to-asu-maroon overflow-hidden">
      <div className="demo-bg absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-asu-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white mb-16">
          <h2 className="text-reveal text-5xl md:text-6xl font-bold mb-8">
            See ASU Handshake in Action
          </h2>
          <p className="text-reveal text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Experience our intuitive platform designed specifically for ASU students and employers
          </p>
        </div>

        {/* Demo Image/Screenshot */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
            {/* Browser Chrome */}
            <div className="flex items-center space-x-2 mb-4 p-4 bg-white/20 rounded-t-2xl">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 bg-white/20 rounded-full px-4 py-1 ml-4">
                <span className="text-white/70 text-sm">asu-handshake.com/dashboard</span>
              </div>
            </div>

            {/* Demo Dashboard Content */}
            <div className="bg-white rounded-2xl p-8 min-h-[500px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-8 w-8 text-asu-maroon" />
                  <span className="font-bold text-xl text-gray-900">ASU Handshake</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-asu-maroon rounded-full"></div>
                  <span className="text-gray-700 font-medium">Sarah Johnson</span>
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job Listings */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
                  <div className="space-y-4">
                    {/* Job Card 1 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Software Engineering Intern</h3>
                          <p className="text-asu-maroon font-medium">Google</p>
                          <p className="text-gray-600 text-sm">Mountain View, CA</p>
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
                        <span className="text-gray-600 text-sm">Posted 2 days ago</span>
                        <button className="bg-asu-maroon text-white px-4 py-2 rounded-lg text-sm font-medium">
                          Quick Apply
                        </button>
                      </div>
                    </div>

                    {/* Job Card 2 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Data Science Intern</h3>
                          <p className="text-asu-maroon font-medium">Microsoft</p>
                          <p className="text-gray-600 text-sm">Seattle, WA</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          95% Match
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Python</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">SQL</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Statistics</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Posted 1 week ago</span>
                        <button className="border border-asu-maroon text-asu-maroon px-4 py-2 rounded-lg text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Profile Completion */}
                  <div className="bg-gradient-to-br from-asu-maroon to-asu-maroon-dark rounded-xl p-6 text-white">
                    <h3 className="font-bold mb-3">Profile Strength</h3>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                      <div className="bg-asu-gold h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-sm text-gray-200 mb-4">85% Complete - Add portfolio to boost visibility</p>
                    <button className="bg-white text-asu-maroon px-4 py-2 rounded-lg text-sm font-medium w-full">
                      Complete Profile
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Your Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applications Sent</span>
                        <span className="font-bold text-asu-maroon">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profile Views</span>
                        <span className="font-bold text-asu-maroon">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Messages</span>
                        <span className="font-bold text-asu-maroon">3</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-asu-maroon rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Tech Career Fair</p>
                          <p className="text-xs text-gray-600">Tomorrow, 10 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-asu-gold rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Resume Workshop</p>
                          <p className="text-xs text-gray-600">Friday, 2 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements around demo */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-asu-gold/20 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute top-1/2 -left-12 w-12 h-12 bg-asu-maroon/20 rounded-full blur-lg animate-pulse"></div>
        </div>

        {/* Demo Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-asu-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-asu-maroon" />
            </div>
            <h3 className="font-bold text-white mb-2">Instant Matching</h3>
            <p className="text-gray-200 text-sm">AI algorithms match you with relevant opportunities in real-time</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-asu-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-asu-maroon" />
            </div>
            <h3 className="font-bold text-white mb-2">Direct Communication</h3>
            <p className="text-gray-200 text-sm">Message employers directly without intermediaries</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-asu-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-asu-maroon" />
            </div>
            <h3 className="font-bold text-white mb-2">Track Progress</h3>
            <p className="text-gray-200 text-sm">Monitor your applications and optimize your success rate</p>
          </div>
        </div>

        {/* CTA for Demo */}
        <div className="text-center mt-12">
          <Link to="/register?role=student" className="inline-flex items-center bg-asu-gold text-asu-maroon px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            Try It Free Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-gray-300 mt-4 text-sm">No credit card required • Setup in under 2 minutes</p>
        </div>
      </div>
    </section>
  );
}