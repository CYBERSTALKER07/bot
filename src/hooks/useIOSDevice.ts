import { useState, useEffect } from 'react';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface IOSDeviceInfo {
  isIOS: boolean;
  isIPhone: boolean;
  isIPad: boolean;
  hasNotch: boolean;
  hasDynamicIsland: boolean;
  deviceType: 'iPhone-SE' | 'iPhone-Standard' | 'iPhone-X' | 'iPhone-Pro' | 'iPhone-Pro-Max' | 'iPad' | 'unknown';
  safeAreaInsets: SafeAreaInsets;
}

export function useIOSDevice(): IOSDeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<IOSDeviceInfo>({
    isIOS: false,
    isIPhone: false,
    isIPad: false,
    hasNotch: false,
    hasDynamicIsland: false,
    deviceType: 'unknown',
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  useEffect(() => {
    const detectIOSDevice = () => {
      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (!isIOS) {
        return {
          isIOS: false,
          isIPhone: false,
          isIPad: false,
          hasNotch: false,
          hasDynamicIsland: false,
          deviceType: 'unknown' as const,
          safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
        };
      }

      const isIPhone = /iPhone/.test(userAgent);
      const isIPad = /iPad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // Get screen dimensions
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const pixelRatio = window.devicePixelRatio;

      // Detect device type and features
      let deviceType: IOSDeviceInfo['deviceType'] = 'unknown';
      let hasNotch = false;
      let hasDynamicIsland = false;

      if (isIPhone) {
        // iPhone 14 Pro Max (430x932, 3x)
        if (screenWidth === 430 && screenHeight === 932 && pixelRatio === 3) {
          deviceType = 'iPhone-Pro-Max';
          hasDynamicIsland = true;
        }
        // iPhone 14 Pro (393x852, 3x)
        else if (screenWidth === 393 && screenHeight === 852 && pixelRatio === 3) {
          deviceType = 'iPhone-Pro';
          hasDynamicIsland = true;
        }
        // iPhone 12/13/14 (390x844, 3x)
        else if (screenWidth === 390 && screenHeight === 844 && pixelRatio === 3) {
          deviceType = 'iPhone-Standard';
          hasNotch = true;
        }
        // iPhone X/XS/11 Pro (375x812, 3x)
        else if (screenWidth === 375 && screenHeight === 812 && pixelRatio === 3) {
          deviceType = 'iPhone-X';
          hasNotch = true;
        }
        // iPhone XR/11/12 mini/13 mini (414x896, 2x or 375x667, 2x)
        else if ((screenWidth === 414 && screenHeight === 896) || 
                 (screenWidth === 375 && screenHeight === 667)) {
          if (screenHeight === 667) {
            deviceType = 'iPhone-SE';
          } else {
            deviceType = 'iPhone-Standard';
            hasNotch = true;
          }
        }
        else {
          deviceType = 'iPhone-Standard';
        }
      } else if (isIPad) {
        deviceType = 'iPad';
      }

      // Get safe area insets from CSS environment variables
      const getEnvValue = (variable: string): number => {
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(`env(${variable})`)
          .replace('px', '');
        return parseFloat(value) || 0;
      };

      const safeAreaInsets = {
        top: getEnvValue('safe-area-inset-top'),
        bottom: getEnvValue('safe-area-inset-bottom'),
        left: getEnvValue('safe-area-inset-left'),
        right: getEnvValue('safe-area-inset-right')
      };

      return {
        isIOS,
        isIPhone,
        isIPad,
        hasNotch,
        hasDynamicIsland,
        deviceType,
        safeAreaInsets
      };
    };

    const updateDeviceInfo = () => {
      setDeviceInfo(detectIOSDevice());
    };

    // Initial detection
    updateDeviceInfo();

    // Listen for orientation changes
    window.addEventListener('orientationchange', updateDeviceInfo);
    window.addEventListener('resize', updateDeviceInfo);

    return () => {
      window.removeEventListener('orientationchange', updateDeviceInfo);
      window.removeEventListener('resize', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

// Hook to get dynamic safe area classes based on device
export function useIOSSafeAreaClasses() {
  const deviceInfo = useIOSDevice();

  const getTopSafeAreaClass = () => {
    if (!deviceInfo.isIOS) return '';
    
    switch (deviceInfo.deviceType) {
      case 'iPhone-Pro-Max':
        return 'ios-pro-max-adjust';
      case 'iPhone-Pro':
        return 'ios-pro-adjust';
      case 'iPhone-Standard':
        return 'ios-standard-adjust';
      case 'iPhone-X':
        return 'ios-x-adjust';
      case 'iPhone-SE':
        return 'ios-se-adjust';
      default:
        return 'ios-header-safe';
    }
  };

  const getBottomSafeAreaClass = () => {
    if (!deviceInfo.isIOS) return '';
    
    switch (deviceInfo.deviceType) {
      case 'iPhone-Pro-Max':
        return 'ios-pro-max-bottom';
      case 'iPhone-Pro':
        return 'ios-pro-bottom';
      case 'iPhone-Standard':
        return 'ios-standard-bottom';
      case 'iPhone-X':
        return 'ios-x-bottom';
      case 'iPhone-SE':
        return 'ios-se-bottom';
      default:
        return 'ios-home-indicator-safe';
    }
  };

  return {
    ...deviceInfo,
    topSafeAreaClass: getTopSafeAreaClass(),
    bottomSafeAreaClass: getBottomSafeAreaClass(),
    landscapeSafeAreaClass: 'ios-landscape-safe',
    touchTargetClass: 'ios-touch-target-large',
    navItemClass: 'ios-nav-item',
    roundedClass: 'ios-rounded-lg',
    backdropClass: 'ios-backdrop'
  };
}