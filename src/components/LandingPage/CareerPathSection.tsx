import React from 'react';
import { GraduationCap, User, Search, Target, Award, CheckCircle, Briefcase } from 'lucide-react';

export default function CareerPathSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-asu-maroon/5 to-asu-gold/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Career <span className="bg-gradient-to-r from-asu-maroon to-asu-maroon-dark bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow the path from ASU student to industry professional with our comprehensive career support system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Career Path Visualization */}
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-gray-200"></div>
                  ))}
                </div>
              </div>
              
              {/* Career Path Steps */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Step 4: Career Success */}
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-asu-gold to-yellow-300 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Award className="h-7 w-7 text-asu-maroon" />
                      </div>
                      <div className="text-asu-maroon">
                        <p className="font-bold text-lg">Dream Job</p>
                        <p className="text-sm opacity-80">Achieved!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Interview & Offer */}
                <div className="flex items-center justify-end">
                  <div className="bg-white rounded-xl p-3 shadow-lg max-w-xs border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Interview Success</p>
                        <p className="text-xs text-gray-600">Job Offer Received</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Application Submitted */}
                <div className="flex items-center justify-start">
                  <div className="bg-white rounded-xl p-3 shadow-lg max-w-xs border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Applied to Google</p>
                        <p className="text-xs text-gray-600">Software Engineer Intern</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1: Profile Created */}
                <div className="flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-asu-maroon rounded-full flex items-center justify-center">
                        <GraduationCap className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-asu-maroon">
                        <p className="font-bold text-lg">ASU Student</p>
                        <p className="text-sm opacity-80">Your journey starts here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFC627" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8C1D40" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 150 280 Q 100 220 150 180 Q 200 140 150 100 Q 100 60 150 20"
                    stroke="url(#pathGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Career Path Benefits */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
                <p className="text-gray-600 text-lg">Build a comprehensive profile that showcases your skills, experiences, and aspirations to attract top employers.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white border-2 border-asu-maroon rounded-xl flex items-center justify-center flex-shrink-0">
                <Search className="h-6 w-6 text-asu-maroon" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Perfect Matches</h3>
                <p className="text-gray-600 text-lg">Our AI-powered matching system connects you with opportunities that align with your skills and career goals.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-asu-maroon to-asu-maroon-dark rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply with Confidence</h3>
                <p className="text-gray-600 text-lg">Submit applications directly to employers and track your progress through our integrated dashboard.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white border-2 border-asu-maroon rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-asu-maroon" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Land Your Dream Job</h3>
                <p className="text-gray-600 text-lg">Join thousands of ASU students who have successfully launched their careers through our platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}