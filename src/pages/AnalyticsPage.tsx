import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Eye, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PageLayout from '../components/ui/PageLayout';
import { cn } from '../lib/cva';

export default function AnalyticsPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const stats = [
        {
            label: 'Profile Views',
            value: '1,234',
            change: '+12%',
            trend: 'up',
            icon: Eye,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Post Impressions',
            value: '45.2K',
            change: '+25%',
            trend: 'up',
            icon: BarChart3,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'New Followers',
            value: '89',
            change: '+5%',
            trend: 'up',
            icon: Users,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        }
    ];

    return (
        <PageLayout
            className={cn('min-h-screen', isDark ? 'bg-black text-white' : 'bg-white text-black')}
            maxWidth="4xl"
        >
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        )}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">Analytics</h1>
                        <p className={cn('text-lg', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            Insights into your profile performance
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={cn(
                            'p-6 rounded-2xl border transition-all hover:shadow-lg',
                            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                        )}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn('p-3 rounded-xl', stat.bg, stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                                <TrendingUp className="w-4 h-4" />
                                {stat.change}
                            </div>
                        </div>
                        <h3 className={cn('text-sm font-medium mb-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
                            {stat.label}
                        </h3>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className={cn(
                'p-8 rounded-2xl border text-center',
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
            )}>
                <BarChart3 className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-gray-700' : 'text-gray-300')} />
                <h3 className="text-xl font-bold mb-2">Detailed Analytics Coming Soon</h3>
                <p className={cn('max-w-md mx-auto', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    We're building advanced charts to help you understand your audience better. Stay tuned!
                </p>
            </div>
        </PageLayout>
    );
}
