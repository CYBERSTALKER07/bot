import React, { useState } from 'react';
import {
    CheckCircle,
    Star,
    Zap,
    Shield,
    TrendingUp,
    Users,
    FileText,
    Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import PageLayout from '../components/ui/PageLayout';

export default function PremiumUpgrade() {
    const { isDark } = useTheme();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const features = [
        {
            icon: FileText,
            title: 'AI Resume Fixer',
            description: 'Get instant AI-powered feedback to optimize your resume for ATS systems.'
        },
        {
            icon: Users,
            title: 'Who Viewed Your Profile',
            description: 'See exactly who is looking at your profile and when.'
        },
        {
            icon: TrendingUp,
            title: 'Application Boost',
            description: 'Get your application to the top of the recruiter\'s list.'
        },
        {
            icon: Search,
            title: 'Unlimited Search',
            description: 'Search for jobs and connections without any limits.'
        }
    ];

    return (
        <PageLayout
            className={isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}
            maxWidth="6xl"
        >
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
                <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Supercharge your job search with AI-powered tools and exclusive insights.
                </p>
            </div>

            {/* Pricing Toggle */}
            <div className="flex justify-center mb-12">
                <div className={`p-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex`}>
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                            ? 'bg-white text-black shadow-xs'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly'
                            ? 'bg-white text-black shadow-xs'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                    >
                        Yearly <span className="text-green-500 text-xs ml-1">-20%</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Free Plan */}
                <Card className="p-8 relative overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                    <h3 className="text-xl font-bold mb-2">Free</h3>
                    <div className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-gray-500">/mo</span></div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                            Basic Profile
                        </li>
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                            Job Search
                        </li>
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                            Limited Connections
                        </li>
                    </ul>
                    <Button variant="outlined" className="w-full">Current Plan</Button>
                </Card>

                {/* Premium Plan */}
                <Card className={`p-8 relative overflow-hidden border-2 ${isDark ? 'border-blue-500' : 'border-blue-600'} transform scale-105 shadow-xl`}>
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                    </div>
                    <h3 className="text-xl font-bold mb-2">Student Premium</h3>
                    <div className="text-3xl font-bold mb-6">
                        ${billingCycle === 'monthly' ? '10' : '8'}
                        <span className="text-sm font-normal text-gray-500">/mo</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-blue-500" />
                            AI Resume Fixer
                        </li>
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-blue-500" />
                            Who Viewed Your Profile
                        </li>
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-blue-500" />
                            Application Boost
                        </li>
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-blue-500" />
                            Unlimited Search
                        </li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Get Started
                    </Button>
                </Card>

                {/* University Plan */}
                <Card className="p-8 relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-2">University</h3>
                    <div className="text-3xl font-bold mb-6">Custom</div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-purple-500" />
                            Admin Dashboard
                        </li>
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-purple-500" />
                            Placement Analytics
                        </li>
                        <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-3 text-purple-500" />
                            Bulk Student Management
                        </li>
                    </ul>
                    <Button variant="outlined" className="w-full">Contact Sales</Button>
                </Card>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <Card key={index} className="p-6 flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">{feature.title}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.description}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </PageLayout>
    );
}
