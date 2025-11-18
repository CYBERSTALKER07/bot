import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import AnimatedSearchButton from './AnimatedSearchButton';
import PageLayout from './ui/PageLayout';
import { Card } from './ui/Card';
import Button from './ui/Button';

export default function SearchDemoPage() {
  const { isDark } = useTheme();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [lastSearch, setLastSearch] = useState('');

  const handleSearch = (query: string) => {
    setLastSearch(query);
    // Simulate search results
    setSearchResults([
      `Software Engineer positions for "${query}"`,
      `Data Scientist roles matching "${query}"`,
      `Product Manager jobs related to "${query}"`,
      `UX Designer opportunities with "${query}"`,
      `Marketing positions featuring "${query}"`
    ]);
  };

  const demoVariants = [
    { title: 'Original Crimson Style', themeAware: false },
    { title: 'Theme-Aware Style', themeAware: true }
  ];

  return (
    <PageLayout 
      className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      maxWidth="4xl"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Animated Search Button Demo
        </h1>
        <p className={`text-lg ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Experience the smooth search animation inspired by modern UI design
        </p>
      </div>

      {/* Demo Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {demoVariants.map((variant, index) => (
          <Card key={index} className={`p-8 text-center ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {variant.title}
            </h3>
            
            <div className="flex justify-center mb-6">
              <AnimatedSearchButton 
                onSearch={handleSearch}
                themeAware={variant.themeAware}
              />
            </div>
            
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Click the circle and start typing to see the animation
            </p>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className={`p-8 mb-8 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          How to Use
        </h3>
        <div className={`space-y-3 text-sm ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-info-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <span>Click on the crimson circle to activate the search input</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-info-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <span>Watch the smooth expansion animation as the input field appears</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-info-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <span>Type your search query and press Enter to search</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-info-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
            <span>The search icon transforms into a close button (X) when focused</span>
          </div>
        </div>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className={`p-8 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Search Results for "{lastSearch}"
          </h3>
          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => setSearchResults([])}
            variant="outlined"
            className="mt-4"
          >
            Clear Results
          </Button>
        </Card>
      )}

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-20 left-10 w-4 h-4 rounded-full ${
          isDark ? 'bg-lime/20' : 'bg-red-500/20'
        } animate-pulse`} />
        <div className={`absolute top-1/3 right-20 w-6 h-6 rounded-full ${
          isDark ? 'bg-info-400/20' : 'bg-info-500/20'
        } animate-bounce`} />
        <div className={`absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full ${
          isDark ? 'bg-purple-400/20' : 'bg-purple-500/20'
        } animate-ping`} />
      </div>
    </PageLayout>
  );
}