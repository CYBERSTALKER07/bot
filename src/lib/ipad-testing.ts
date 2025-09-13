// iPad Testing and Device Detection Utilities
export const deviceUtils = {
  // Detect if running on iPad
  isIPad: () => {
    return (
      navigator.userAgent.includes('iPad') ||
      (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1) ||
      (window.innerWidth >= 768 && window.innerWidth <= 1024 && 'ontouchstart' in window)
    );
  },

  // Detect touch capabilities
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Get device orientation
  getOrientation: () => {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  },

  // Simulate iPad viewport for testing
  simulateIPad: () => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=1024, initial-scale=1.0, user-scalable=no');
    }
    
    // Add iPad-specific CSS class
    document.documentElement.classList.add('ipad-simulation');
    
    // Log device info for debugging
    console.log('🔍 iPad Simulation Enabled:', {
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      touchPoints: navigator.maxTouchPoints,
      orientation: deviceUtils.getOrientation()
    });
  },

  // Test navigation behavior
  testNavigation: () => {
    const isMobile = window.innerWidth < 1024;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    console.log('📱 Navigation Test Results:', {
      isMobile,
      isTablet,
      showMobileNav: isMobile,
      showDesktopNav: !isMobile,
      breakpoint: window.innerWidth,
      touchEnabled: deviceUtils.isTouchDevice()
    });
  }
};

// iPad-specific CSS for testing
export const ipadTestingCSS = `
  .ipad-simulation {
    /* iPad-specific overrides for testing */
    --nav-breakpoint: 1024px;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    /* Tablet-specific styles */
    .desktop-nav {
      display: flex;
    }
    
    .mobile-nav {
      display: none;
    }
    
    /* Test indicator */
    body::before {
      content: "iPad/Tablet View";
      position: fixed;
      top: 10px;
      right: 10px;
      background: #007AFF;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9999;
      pointer-events: none;
    }
  }
`;

// Initialize iPad testing when in development
if (process.env.NODE_ENV === 'development') {
  // Add testing CSS to head
  const style = document.createElement('style');
  style.textContent = ipadTestingCSS;
  document.head.appendChild(style);
  
  // Make utilities available globally for console testing
  (window as any).deviceUtils = deviceUtils;
  
  // Auto-detect and log device info
  console.log('🚀 iPad Testing Utils Loaded:', {
    isIPad: deviceUtils.isIPad(),
    isTouchDevice: deviceUtils.isTouchDevice(),
    orientation: deviceUtils.getOrientation()
  });
}