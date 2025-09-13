import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  useMediaQuery
} from '@mui/material';
import {
  School,
  ArrowForward
} from '@mui/icons-material';

interface Props {
  onGetStarted?: () => void;
  onLogin?: () => void;
  onSkip?: () => void;
}

const GettingStartedPage = (props: Props) => {
  const { onGetStarted, onLogin, onSkip } = props;
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');
  
  const [currentPage, setCurrentPage] = useState(0);

  // Simple page content
  const pages = [
    {
      title: 'Best Career Platform to Land Your Dream Job',
      description: 'With AUT Handshake you will connect with top employers, build professional networks, and discover amazing career opportunities',
      color: '#E3FF70'
    },
    {
      title: 'Connect with Industry Leaders',
      description: 'Join thousands of AUT students and alumni to discover exclusive job opportunities and career guidance',
      color: '#FFE135'
    },
    {
      title: 'Discover Amazing Opportunities',
      description: 'Access exclusive internships and full-time positions from companies that specifically recruit AUT talent',
      color: '#FF6B6B'
    }
  ];

  // Sample profiles
  const profiles = [
    { name: 'Sarah Chen', image: '/student1.jpg' },
    { name: 'Alex Rodriguez', image: '/student2.jpg' },
    { name: 'Maya Patel', image: '/student3.jpg' }
  ];

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('/register');
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigate('/');
    }
  };

  // Mobile Version
  if (isMobile) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header */}
        <Box sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: pages[currentPage].color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <School sx={{ fontSize: 18, color: '#000' }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#000' }}>
              AUT Handshake
            </Typography>
          </Box>
          <Button onClick={handleSkip} sx={{ color: isDark ? '#fff' : '#000', textTransform: 'none' }}>
            Skip
          </Button>
        </Box>

        {/* Status Bar */}
      

        {/* Main Content Area */}
        <Box sx={{ 
          flex: 1,
          p: 3, 
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Floating Elements */}
          <Box sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 50,
            height: 30,
            background: '#FF69B4',
            borderRadius: 1,
            transform: 'rotate(15deg)'
          }} />
          
          <Box sx={{
            position: 'absolute',
            top: 40,
            right: 30,
            width: 40,
            height: 40,
            background: pages[currentPage].color,
            borderRadius: '50%'
          }} />
          
          <Box sx={{
            position: 'absolute',
            bottom: 200,
            left: 10,
            width: 25,
            height: 25,
            background: '#FFE135',
            borderRadius: '50%'
          }} />

          {/* Profile Avatars */}
          {profiles.map((profile, index) => (
            <Box key={index} sx={{
              position: 'absolute',
              top: 100 + index * 120,
              left: index % 2 === 0 ? 30 : '60%',
              textAlign: 'center'
            }}>
              <Avatar
                src={profile.image}
                sx={{
                  width: 60,
                  height: 60,
                  border: '2px solid #fff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  mb: 1
                }}
              />
              <Chip
                label="Follow"
                sx={{
                  background: pages[currentPage].color,
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            </Box>
          ))}

          {/* Page Indicators */}
          <Box sx={{
            position: 'absolute',
            bottom: 200,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1
          }}>
            {pages.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPage(index)}
                sx={{
                  width: index === currentPage ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: index === currentPage 
                    ? pages[currentPage].color 
                    : 'rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{
            position: 'absolute',
            bottom: 160,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3
          }}>
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              sx={{
                color: isDark ? '#fff' : '#000',
                textTransform: 'none',
                minWidth: 60,
                opacity: currentPage === 0 ? 0.3 : 1
              }}
            >
              Previous
            </Button>
            
            <Typography variant="body2" sx={{ 
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontSize: '0.9rem'
            }}>
              {currentPage + 1} of {pages.length}
            </Typography>
            
            <Button
              onClick={handleNext}
              disabled={currentPage === pages.length - 1}
              sx={{
                color: isDark ? '#fff' : '#000',
                textTransform: 'none',
                minWidth: 60,
                opacity: currentPage === pages.length - 1 ? 0.3 : 1
              }}
            >
              Next
            </Button>
          </Box>

          {/* Bottom Content */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              mb: 2, 
              fontSize: '1.8rem',
              lineHeight: 1.2,
              color: isDark ? '#fff' : '#000'
            }}>
              {pages[currentPage].title}
            </Typography>
            
            <Typography variant="body1" sx={{ 
              mb: 4,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontSize: '1rem',
              lineHeight: 1.4,
              px: 2
            }}>
              {pages[currentPage].description}
            </Typography>

            <Button
              onClick={currentPage === pages.length - 1 ? handleGetStarted : handleNext}
              fullWidth
              sx={{
                background: pages[currentPage].color,
                color: '#000',
                py: 2,
                borderRadius: 8,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                mb: 3,
                boxShadow: `0 4px 20px ${pages[currentPage].color}40`,
                '&:hover': {
                  background: pages[currentPage].color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${pages[currentPage].color}60`
                }
              }}
            >
              {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
            </Button>

            <Button
              onClick={handleLogin}
              sx={{
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              Already have an account? Login
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop Version
  return (
    <Box sx={{
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{
        position: 'absolute',
        top: 30,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            background: pages[currentPage].color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <School sx={{ fontSize: 24, color: '#000' }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#000' }}>
            AUT Handshake
          </Typography>
        </Box>
        <Button onClick={handleSkip} sx={{ 
          color: isDark ? '#fff' : '#000', 
          textTransform: 'none',
          fontSize: '1rem'
        }}>
          Skip Introduction
        </Button>
      </Box>

      {/* Main Content Container */}
      <Box sx={{
        maxWidth: 1200,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        px: 4
      }}>
        
        {/* Left Side - Content */}
        <Box sx={{ flex: 1, maxWidth: 500 }}>
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            sx={{ 
              mb: 3,
              fontSize: '3.5rem',
              lineHeight: 1.1,
              color: isDark ? '#fff' : '#000'
            }}
          >
            {pages[currentPage].title}
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 6,
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              lineHeight: 1.6,
              fontSize: '1.25rem'
            }}
          >
            {pages[currentPage].description}
          </Typography>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 3, mb: 6 }}>
            <Button
              onClick={currentPage === pages.length - 1 ? handleGetStarted : handleNext}
              endIcon={<ArrowForward />}
              sx={{
                background: pages[currentPage].color,
                color: '#000',
                px: 4,
                py: 2,
                borderRadius: 6,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  background: pages[currentPage].color,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
            </Button>

            <Button
              onClick={handleLogin}
              variant="outlined"
              sx={{
                borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                color: isDark ? '#fff' : '#000',
                px: 4,
                py: 2,
                borderRadius: 6,
                fontSize: '1.1rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: pages[currentPage].color,
                  background: `${pages[currentPage].color}10`
                }
              }}
            >
              Login
            </Button>
          </Box>

          {/* Page Indicators */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
            {pages.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPage(index)}
                sx={{
                  width: index === currentPage ? 40 : 12,
                  height: 12,
                  borderRadius: 6,
                  background: index === currentPage 
                    ? pages[currentPage].color 
                    : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            maxWidth: 400
          }}>
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              sx={{
                color: isDark ? '#fff' : '#000',
                textTransform: 'none',
                fontSize: '1rem',
                opacity: currentPage === 0 ? 0.3 : 1,
                '&:hover': {
                  background: `${pages[currentPage].color}20`
                }
              }}
            >
              ← Previous
            </Button>
            
            <Typography variant="body1" sx={{ 
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontSize: '1rem',
              fontWeight: 500
            }}>
              {currentPage + 1} of {pages.length}
            </Typography>
            
            <Button
              onClick={handleNext}
              disabled={currentPage === pages.length - 1}
              sx={{
                color: isDark ? '#fff' : '#000',
                textTransform: 'none',
                fontSize: '1rem',
                opacity: currentPage === pages.length - 1 ? 0.3 : 1,
                '&:hover': {
                  background: `${pages[currentPage].color}20`
                }
              }}
            >
              Next →
            </Button>
          </Box>
        </Box>

        {/* Right Side - Visual */}
        <Box sx={{ 
          flex: 1,
          height: '600px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* Large Background Elements */}
          <Box sx={{
            position: 'absolute',
            top: 50,
            left: 50,
            width: 180,
            height: 100,
            background: '#FF69B4',
            borderRadius: 3,
            transform: 'rotate(-15deg)',
            opacity: 0.6
          }} />

          <Box sx={{
            position: 'absolute',
            top: 100,
            right: 20,
            width: 120,
            height: 120,
            background: pages[currentPage].color,
            borderRadius: '50%',
            opacity: 0.4
          }} />

          <Box sx={{
            position: 'absolute',
            bottom: 80,
            left: 20,
            width: 80,
            height: 80,
            background: '#FFE135',
            borderRadius: '50%',
            opacity: 0.5
          }} />

          {/* Profile Cards */}
          {profiles.map((profile, index) => (
            <Box key={index} sx={{
              position: 'absolute',
              top: 100 + index * 150,
              left: index % 2 === 0 ? 100 : 300,
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              p: 2,
              textAlign: 'center',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              transform: `rotate(${(index - 1) * 8}deg)`,
              '&:hover': {
                transform: 'rotate(0deg) scale(1.05)',
                transition: 'all 0.3s ease'
              }
            }}>
              <Avatar
                src={profile.image}
                sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 1,
                  border: '2px solid #fff'
                }}
              />
              <Typography 
                variant="subtitle2" 
                fontWeight="bold"
                sx={{ mb: 1, color: isDark ? '#fff' : '#000' }}
              >
                {profile.name}
              </Typography>
              <Chip
                label="Follow"
                sx={{
                  background: pages[currentPage].color,
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  '&:hover': {
                    background: pages[currentPage].color,
                    transform: 'scale(1.1)'
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default GettingStartedPage;