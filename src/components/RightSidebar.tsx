import React from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Bookmark,
    Users,
    MapPin,
    X,
} from 'lucide-react';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import WhoToFollowItem from './WhoToFollowItem';
import { RightSidebarSkeleton } from './ui/Skeleton';

interface SearchResult {
    id: string;
    type: 'user';
    title: string;
    subtitle?: string;
    description: string;
    avatar?: string;
    verified?: boolean;
}

interface RightSidebarProps {
    isDark: boolean;
    sidebarSearchInput: string;
    setSidebarSearchInput: (value: string) => void;
    showSearchDropdown: boolean;
    setShowSearchDropdown: (show: boolean) => void;
    searchDropdownRef: React.RefObject<HTMLDivElement>;
    searchInputRef: React.RefObject<HTMLInputElement>;
    userSearchResults: SearchResult[];
    searchLoading: boolean;
    companiesLoading: boolean;
    recommendedCompanies: any[];
    recommendedUsersLoading: boolean;
    recommendedUsers: any[];
    jobsLoading: boolean;
    jobs: any[];
    navigate: (path: string) => void;
    formatTime: (date: string) => string;
    handleAtSymbolClick: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
    isDark,
    sidebarSearchInput,
    setSidebarSearchInput,
    showSearchDropdown,
    setShowSearchDropdown,
    searchDropdownRef,
    searchInputRef,
    userSearchResults,
    searchLoading,
    companiesLoading,
    recommendedCompanies,
    recommendedUsersLoading,
    recommendedUsers,
    jobsLoading,
    jobs,
    navigate,
    formatTime,
    handleAtSymbolClick,
}) => {
    const isUsernameSearch = sidebarSearchInput.startsWith('@');

    return (
        <aside className={cn(
            'hidden xl:block w-[400px] pl-6 py-4 h-screen sticky top-0 overflow-y-auto scrollbar-hide',
            isDark ? 'bg-black border-l border-[#1C1F20]' : 'bg-white border-l border-gray-200'
        )}>
            <div className="space-y-6 pb-20">
                {/* Search Bar */}
                <div className="relative group z-50" ref={searchDropdownRef}>
                    <div className={cn(
                        'flex items-center px-4 py-3 rounded-3xl transition-all duration-200 border',
                        isDark
                            ? 'bg-gray-900/50 border-gray-900 focus-within:bg-black focus-within:ring-1 focus-within:ring-info-500'
                            : 'bg-gray-100 border-gray-300 focus-within:bg-white focus-within:ring-1 focus-within:ring-info-500'
                    )}>
                        <Search className={cn(
                            'w-5 h-5 mr-3 transition-colors',
                            isDark ? 'text-gray-500 group-focus-within:text-info-500' : 'text-gray-400 group-focus-within:text-info-500'
                        )} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search users, jobs, companies..."
                            className={cn(
                                'bg-transparent border-none outline-none w-full text-sm placeholder-gray-500',
                                isDark ? 'text-white' : 'text-black'
                            )}
                            value={sidebarSearchInput}
                            onChange={(e) => {
                                setSidebarSearchInput(e.target.value);
                                setShowSearchDropdown(true);
                            }}
                            onFocus={() => setShowSearchDropdown(true)}
                        />
                        {sidebarSearchInput && (
                            <button
                                onClick={() => {
                                    setSidebarSearchInput('');
                                    setShowSearchDropdown(false);
                                }}
                                className={cn(
                                    'p-1 rounded-full hover:bg-gray-700 transition-colors',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Search Dropdown */}
                    {showSearchDropdown && (sidebarSearchInput || userSearchResults.length > 0) && (
                        <div className={cn(
                            'absolute top-full left-0 right-0 mt-2 rounded-3xl shadow-xl border overflow-hidden z-50 max-h-[80vh] overflow-y-auto',
                            isDark ? 'bg-black border-[#1C1F20]' : 'bg-white border-gray-200'
                        )}>
                            {searchLoading ? (
                                <div className="p-4 text-center text-gray-500">Searching...</div>
                            ) : userSearchResults.length > 0 ? (
                                <div className="py-2">
                                    {userSearchResults.map((result) => (
                                        <Link
                                            key={result.id}
                                            to={`/profile/${result.id}`}
                                            className={cn(
                                                'flex items-center px-4 py-3 transition-colors',
                                                isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
                                            )}
                                            onClick={() => setShowSearchDropdown(false)}
                                        >
                                            {result.avatar ? (
                                                <img src={result.avatar} alt={result.title} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-white font-bold">
                                                    {result.title.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center">
                                                    <span className={cn('font-bold text-sm truncate', isDark ? 'text-white' : 'text-black')}>
                                                        {result.title}
                                                    </span>
                                                    {result.verified && (
                                                        <span className="ml-1 text-info-500">
                                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" /></g></svg>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={cn(
                                                    'text-xs truncate font-medium',
                                                    isUsernameSearch
                                                        ? isDark ? 'text-gray-400' : 'text-info-600'
                                                        : isDark ? 'text-gray-500' : 'text-gray-600'
                                                )}>
                                                    {result.subtitle}
                                                </p>
                                                {result.description && (
                                                    <p className={cn(
                                                        'text-xs line-clamp-1',
                                                        isDark ? 'text-gray-400' : 'text-gray-700'
                                                    )}>
                                                        {result.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : sidebarSearchInput ? (
                                <div className={cn(
                                    'p-4 text-center text-sm',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    No results for "{sidebarSearchInput}"
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                {/* Job Recommendations */}
                <div className={cn(
                    'rounded-3xl p-4 border',
                    isDark ? 'bg-black border-[#1C1F20]' : 'bg-white border-gray-200 shadow-lg'
                )}>
                    <h3 className="font-bold text-3xl font-serif mb-4 flex items-center">
                        <Bookmark className="h-5 w-5 mr-2" />
                        Jobs For You
                    </h3>
                    <div className="space-y-4">
                        {companiesLoading ? (
                            <div className="text-center py-4 text-gray-400">Loading companies...</div>
                        ) : recommendedCompanies && recommendedCompanies.length > 0 ? (
                            recommendedCompanies.map((company: any, index: number) => (
                                <div
                                    key={company.id || index}
                                    className={cn(
                                        'p-3 rounded-3xl cursor-pointer transition-colors flex items-start gap-3',
                                        isDark ? 'bg-gray-900/25 hover:bg-gray-900/50' : 'bg-gray-50 hover:bg-gray-100'
                                    )}
                                    onClick={() => navigate(`/company/${company.id}`)}
                                >
                                    {/* Company Avatar */}
                                    {company.logo_url ? (
                                        <img
                                            src={company.logo_url}
                                            alt={company.name}
                                            className="w-10 h-10 rounded-3xl object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className={cn(
                                            'w-10 h-10 rounded-3xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-white',
                                            'bg-gradient-to-br from-[#1C1F20] to-gray-600'
                                        )}>
                                            {company.name?.charAt(0) || '🏢'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn(
                                            'font-bold text-sm truncate',
                                            isDark ? 'text-white' : 'text-gray-900'
                                        )}>
                                            {company.name}
                                        </h4>
                                        <p className={cn(
                                            'text-xs truncate',
                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                        )}>
                                            {company.industry || 'Technology'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-400 text-sm">
                                No companies hiring at the moment
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <Button
                            variant="ghost"
                            className={cn(
                                'w-full',
                                isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'
                            )}
                            onClick={() => navigate('/explore')}
                        >
                            Show more
                        </Button>
                    </div>
                </div>

                {/* Who to Follow */}
                <div className={cn(
                    'rounded-3xl p-4 border',
                    isDark ? 'bg-black border-[#1C1F20]' : 'bg-white border-gray-200 shadow-lg'
                )}>
                    <h3 className="font-serif text-lg mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Who to follow
                    </h3>
                    <div className="space-y-4">
                        {recommendedUsersLoading ? (
                            <div className="text-center py-4 text-gray-400">Loading...</div>
                        ) : recommendedUsers.length > 0 ? (
                            recommendedUsers.slice(0, 3).map((recommendedUser) => (
                                <WhoToFollowItem
                                    key={recommendedUser.id}
                                    user={{
                                        id: recommendedUser.id,
                                        full_name: recommendedUser.full_name,
                                        username: recommendedUser.username,
                                        avatar_url: recommendedUser.avatar_url,
                                        verified: recommendedUser.verified,
                                        bio: recommendedUser.bio
                                    }}
                                    onNavigate={() => navigate(`/profile/${recommendedUser.id}`)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-400 text-sm">
                                No more users to recommend
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full mt-4 text-white hover:bg-white/10"
                        onClick={() => navigate('/explore')}
                    >
                        Show more
                    </Button>
                </div>

                {/* Footer Links */}
                <div className={cn('text-xs space-y-2 px-4', isDark ? 'text-gray-500' : 'text-gray-500')}>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <a href="/terms" className="hover:underline">Terms of Service</a>
                        <a href="/privacy" className="hover:underline">Privacy Policy</a>
                        <a href="/cookie" className="hover:underline">Cookie Policy</a>
                        <a href="/accessibility" className="hover:underline">Accessibility</a>
                        <a href="/ads" className="hover:underline">Ads info</a>
                        <a href="/more" className="hover:underline">More ...</a>
                    </div>
                    <p>© 2025 TalentLink Corp.</p>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
