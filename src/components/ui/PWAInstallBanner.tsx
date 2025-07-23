import React, { useState, useEffect } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PWAInstallBannerProps {
  onClose?: () => void;
}

const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if running on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed as PWA
    const isInStandaloneMode = window.navigator.standalone || 
      window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show banner if not already installed and not dismissed
    if (isIOSDevice && !isInStandaloneMode) {
      const dismissed = localStorage.getItem('pwa-ios-banner-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 3000); // Show after 3 seconds
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // For Android/Desktop
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowBanner(false);
      }
    } else if (isIOS) {
      // iOS doesn't support programmatic installation
      // We'll show instructions instead
      return;
    }
  };

  const handleClose = () => {
    setShowBanner(false);
    if (isIOS) {
      localStorage.setItem('pwa-ios-banner-dismissed', 'true');
    }
    onClose?.();
  };

  if (!showBanner || isStandalone) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
      showBanner ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className={`mx-4 mb-4 rounded-2xl shadow-2xl ${
        isDark 
          ? 'bg-dark-surface border border-dark-border' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-lime' : 'bg-asu-maroon'
              }`}>
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <div>
                <h3 className={`font-bold text-lg ${
                  isDark ? 'text-dark-text' : 'text-gray-900'
                }`}>
                  Install AUT Handshake
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-dark-muted' : 'text-gray-600'
                }`}>
                  Add to home screen for quick access
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors ${
                isDark 
                  ? 'hover:bg-dark-border text-dark-muted' 
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isIOS ? (
            <div className="space-y-3">
              <p className={`text-sm ${
                isDark ? 'text-dark-muted' : 'text-gray-600'
              }`}>
                Install this app on your iPhone:
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Share className="h-4 w-4 text-blue-500" />
                <span className={isDark ? 'text-dark-text' : 'text-gray-700'}>
                  Tap the share button
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Plus className="h-4 w-4 text-blue-500" />
                <span className={isDark ? 'text-dark-text' : 'text-gray-700'}>
                  Then "Add to Home Screen"
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                isDark
                  ? 'bg-lime text-dark-surface hover:bg-lime/90'
                  : 'bg-asu-maroon text-white hover:bg-asu-maroon/90'
              }`}
            >
              <Download className="h-5 w-5 inline mr-2" />
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;