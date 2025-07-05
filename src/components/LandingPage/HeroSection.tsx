import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RocketLaunch,
  Business,
  ArrowForward,
  TrendingUp,
  EmojiEvents,
  KeyboardArrowDown
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Typography from '../ui/Typography';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSection({ heroRef }: HeroSectionProps) {
  const { isDark } = useTheme();

  return (
    <section ref={heroRef} className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-dark-bg via-dark-surface to-gray-900' 
        : 'bg-gradient-to-br from-asu-maroon via-asu-maroon-dark to-gray-900'
    }`}>
      {/* Material Design background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-16 left-8 w-32 h-32 rounded-full opacity-20 ${
          isDark ? 'bg-lime' : 'bg-asu-gold'
        }`}></div>
        <div className={`absolute top-32 right-16 w-40 h-40 rounded-full opacity-10 ${
          isDark ? 'bg-dark-accent' : 'bg-white'
        }`}></div>
        <div className={`absolute bottom-16 left-1/3 w-36 h-36 rounded-full opacity-15 ${
          isDark ? 'bg-lime' : 'bg-asu-gold'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${isDark ? 'text-dark-text' : 'text-white'}`}>
            <Typography 
              variant="h1" 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              color={isDark ? 'textPrimary' : 'inherit'}
            >
              Your Career
              <span className={`block bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-lime via-dark-accent to-lime' 
                  : 'bg-gradient-to-r from-asu-gold via-yellow-300 to-asu-gold'
              }`}>
                Starts Here ✨
              </span>
            </Typography>
            <Typography 
              variant="h5" 
              className={`text-xl md:text-2xl mb-8 leading-relaxed ${
                isDark ? 'text-dark-muted' : 'text-gray-200'
              }`}
            >
              Connect with amazing companies, find your dream internship, and launch your career at Auckland University of Technology's most comprehensive job platform! 🌟
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                component={Link}
                to="/register?role=student"
                variant="contained"
                color="primary"
                size="large"
                className="shadow-lg hover:shadow-xl transition-shadow duration-200"
                startIcon={<RocketLaunch />}
                endIcon={<ArrowForward />}
              >
                Find My Dream Job 🚀
              </Button>
              <Button
                component={Link}
                to="/register?role=employer"
                variant="outlined"
                color="primary"
                size="large"
                className="shadow-lg hover:shadow-xl transition-shadow duration-200"
                startIcon={<Business />}
                sx={isDark ? { 
                  borderColor: 'lime', 
                  color: 'lime',
                  '&:hover': { backgroundColor: 'rgba(50, 205, 50, 0.1)' }
                } : {
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Post Amazing Jobs 💼
              </Button>
            </div>
          </div>
          
          {/* Material Design hero mockup */}
          <div className="relative">
            <Card 
              className={`relative z-10 ${
                isDark 
                  ? 'bg-dark-surface/90 border-lime/20' 
                  : 'bg-white/90 border-white/20'
              }`}
              variant="elevated"
              elevation={4}
            >
              <div className={`relative w-full h-96 rounded-2xl overflow-hidden flex items-center justify-center ${
                isDark 
                  ? 'bg-gradient-to-br from-dark-surface to-dark-bg' 
                  : 'bg-gradient-to-br from-white to-gray-50'
              }`}>
                <div className="text-center p-8">
                  <div className="text-8xl mb-6">🎓</div>
                  <Card 
                    className={`${isDark ? 'bg-dark-surface' : 'bg-white'}`}
                    elevation={2}
                  >
                    <div className="p-6">
                      <Typography 
                        variant="h4" 
                        className={`font-bold mb-2 ${
                          isDark ? 'text-lime' : 'text-asu-maroon'
                        }`}
                      >
                        Your Success Story
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="textSecondary"
                        className="mb-4"
                      >
                        Starts Right Here! 🌟
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                      >
                        Join 15,000+ students
                      </Typography>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Material Design badges */}
              <div className={`absolute -top-4 -right-4 p-3 rounded-full shadow-lg ${
                isDark ? 'bg-lime' : 'bg-asu-maroon'
              }`}>
                <EmojiEvents className={`h-6 w-6 ${
                  isDark ? 'text-dark-surface' : 'text-white'
                }`} />
              </div>
              <div className={`absolute -bottom-4 -left-4 p-3 rounded-full shadow-lg ${
                isDark ? 'bg-dark-accent' : 'bg-asu-gold'
              }`}>
                <TrendingUp className={`h-6 w-6 ${
                  isDark ? 'text-dark-surface' : 'text-white'
                }`} />
              </div>
            </Card>

            {/* Material Design success metrics */}
            <Card 
              className={`absolute -bottom-6 -left-6 ${
                isDark ? 'bg-dark-surface' : 'bg-white'
              }`}
              variant="elevated"
              elevation={3}
            >
              <div className="p-4 text-center">
                <Typography 
                  variant="h4" 
                  className={`font-bold ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}
                >
                  95%
                </Typography>
                <Typography 
                  variant="caption" 
                  color="textSecondary"
                  className="font-medium"
                >
                  Happy Students 😊
                </Typography>
              </div>
            </Card>
            
            <Card 
              className={`absolute -top-6 -left-6 ${
                isDark ? 'bg-dark-surface' : 'bg-white'
              }`}
              variant="elevated"
              elevation={3}
            >
              <div className="p-4 text-center">
                <Typography 
                  variant="h4" 
                  className={`font-bold ${
                    isDark ? 'text-lime' : 'text-asu-maroon'
                  }`}
                >
                  2.5k+
                </Typography>
                <Typography 
                  variant="caption" 
                  color="textSecondary"
                  className="font-medium"
                >
                  Dream Jobs 💼
                </Typography>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Material Design scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${
        isDark ? 'text-dark-text' : 'text-white'
      }`}>
        <div className="flex flex-col items-center space-y-2">
          <Typography variant="body2" className="font-medium">
            Scroll for more ✨
          </Typography>
          <KeyboardArrowDown className="h-6 w-6" />
        </div>
      </div>
    </section>
  );
}