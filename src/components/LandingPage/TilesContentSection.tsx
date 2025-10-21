import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../ui/Typography';
import { Search as SearchIcon, FileText, Code2 } from 'lucide-react';

export default function TilesContentSection() {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
    setCurrentMonth(new Date());
  }, []);

  // Get calendar days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date();
  const isCurrentMonth = 
    currentMonth.getMonth() === today.getMonth() && 
    currentMonth.getFullYear() === today.getFullYear();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Globe animation styles
  const generateGlobeParticles = () => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
  };

  const [particles] = useState(generateGlobeParticles());

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark ? 'bg-dark-bg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <Typography variant="h3" className="font-bold mb-4">
            Powerful Features for Your Success
          </Typography>
          <Typography variant="body1" color="textSecondary" className="max-w-2xl mx-auto">
            Everything you need to manage your career journey in one place
          </Typography>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Top-Left: File Management (Vertical Rectangle - 2 rows) */}
          <div className={`md:col-span-1 lg:row-span-2 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-800/50' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
          }`}>
            <div className="h-full p-8 flex flex-col justify-between">
              <div>
                <Typography variant="h5" className="font-bold mb-2">
                  Save your files.
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-6">
                  We automatically save your files as you type.
                </Typography>
              </div>

              {/* Layered File Icons */}
              <div className="relative h-32 flex items-end justify-center">
                {/* Excel File */}
                <div className="absolute bottom-12 left-2 w-12 h-16 rounded-lg bg-green-500 shadow-lg transform -rotate-12 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">.xlsx</span>
                </div>

                {/* PDF File */}
                <div className="absolute bottom-6 left-8 w-12 h-16 rounded-lg bg-red-500 shadow-lg transform rotate-6 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">.pdf</span>
                </div>

                {/* SVG File */}
                <div className="absolute bottom-0 right-4 w-12 h-16 rounded-lg bg-yellow-500 shadow-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">.svg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Right: Search Bar (Large Horizontal Rectangle - 2 rows) */}
          <div className={`md:col-span-1 lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-800/50' 
              : 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200'
          }`}>
            <div className="h-full p-8 flex flex-col justify-between">
              <div>
                <Typography variant="h5" className="font-bold mb-2">
                  Full text search.
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-8">
                  Search through all your files in one place.
                </Typography>
              </div>

              {/* Search Bar */}
              <div className="space-y-4">
                <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-300 ${
                  isDark 
                    ? 'bg-dark-surface border border-dark-accent/30 focus-within:border-blue-500' 
                    : 'bg-white border border-gray-300 focus-within:border-blue-500'
                }`}>
                  <SearchIcon className={`mr-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <input
                    type="text"
                    placeholder="Search files..."
                    className={`flex-1 outline-none text-sm ${
                      isDark 
                        ? 'bg-dark-surface text-white placeholder-gray-500' 
                        : 'bg-white text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>

                {/* Dropdown Suggestions */}
                <div className={`space-y-2 rounded-xl p-3 ${
                  isDark ? 'bg-dark-surface/50' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-3 cursor-pointer hover:opacity-75 transition-opacity">
                    <Code2 className="w-4 h-4 text-purple-500" />
                    <Typography variant="body2">screenshot.png</Typography>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer hover:opacity-75 transition-opacity">
                    <FileText className="w-4 h-4 text-red-500" />
                    <Typography variant="body2">bitcoin.pdf</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Left: Multilingual Globe (Square) */}
          <div className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-800' 
              : 'bg-gradient-to-br from-gray-900 to-black border border-gray-800'
          }`}>
            <div className="h-full p-8 flex flex-col justify-between items-center min-h-[280px]">
              <div className="text-center mb-4">
                <Typography variant="h5" className="font-bold text-white">
                  Multilingual.
                </Typography>
              </div>

              {/* 3D-Style Globe with Glowing Effect */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 blur-2xl opacity-40 animate-pulse" />
                
                {/* Globe sphere */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl" 
                  style={{
                    boxShadow: '0 0 30px rgba(34, 211, 238, 0.8), inset -10px -10px 30px rgba(0, 0, 0, 0.5)'
                  }} />
                
                {/* Rotating particles/lights */}
                {particles.map((particle) => (
                  <div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      animation: `glow ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                      opacity: 0.8,
                    }}
                  />
                ))}

                {/* Center highlight */}
                <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full opacity-30 blur-sm" />
              </div>

              {/* Floating language indicators */}
              <div className="flex justify-center space-x-2 text-xs text-cyan-300 font-semibold mt-6">
                <span>EN</span>
                <span>•</span>
                <span>ES</span>
                <span>•</span>
                <span>FR</span>
              </div>
            </div>

            {/* CSS for glow animation */}
            <style>{`
              @keyframes glow {
                0%, 100% { transform: translate(0, 0); opacity: 0.8; }
                50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); opacity: 1; }
              }
            `}</style>
          </div>

          {/* Bottom-Right: Calendar (Square) */}
          <div className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-800/50' 
              : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'
          }`}>
            <div className="h-full p-6 flex flex-col justify-between min-h-[280px]">
              <div>
                <Typography variant="h6" className="font-bold mb-1">
                  Calendar.
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </Typography>
              </div>

              {/* Calendar Widget */}
              <div className="space-y-3">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center">
                      <Typography variant="caption" className="font-semibold">
                        {day}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        day === null
                          ? ''
                          : isCurrentMonth && day === today.getDate()
                          ? isDark
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-blue-500 text-white shadow-lg'
                          : isDark
                          ? 'bg-dark-surface/50 text-dark-text hover:bg-dark-surface/80'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Date Display */}
              <div className="text-center pt-2 border-t border-current border-opacity-10">
                <Typography variant="caption" color="textSecondary">
                  Today: {monthNames[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
