import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PageLayout from '../components/ui/PageLayout';
import Button from '../components/ui/Button';
import { cn } from '../lib/cva';

export default function CareerGoalsPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const goals = [
        {
            id: 1,
            title: 'Land a Senior Developer Role',
            progress: 65,
            deadline: 'Dec 2025',
            icon: Target,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            id: 2,
            title: 'Master System Design',
            progress: 40,
            deadline: 'Jun 2025',
            icon: BookOpen,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            id: 3,
            title: 'Contribute to Open Source',
            progress: 20,
            deadline: 'Ongoing',
            icon: TrendingUp,
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
                <h1 className="text-3xl font-bold mb-2">Career Goals</h1>
                <p className={cn('text-lg', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Set and track your professional milestones
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className={cn(
                            'p-6 rounded-2xl border transition-all hover:shadow-lg',
                            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                        )}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn('p-3 rounded-xl', goal.bg, goal.color)}>
                                <goal.icon className="w-6 h-6" />
                            </div>
                            <span className={cn('text-xs font-medium px-2 py-1 rounded-full', isDark ? 'bg-gray-800' : 'bg-gray-100')}>
                                {goal.deadline}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{goal.title}</h3>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-bold">{goal.progress}%</span>
                            </div>
                            <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-gray-800' : 'bg-gray-100')}>
                                <div
                                    className={cn('h-full rounded-full transition-all duration-500', goal.color.replace('text-', 'bg-'))}
                                    style={{ width: `${goal.progress}%` }}
                                />
                            </div>
                        </div>
                        <Button variant="outlined" className="w-full rounded-xl">
                            Update Progress
                        </Button>
                    </div>
                ))}

                <button className={cn(
                    'p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors',
                    isDark
                        ? 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}>
                    <div className={cn('p-3 rounded-full', isDark ? 'bg-gray-800' : 'bg-gray-100')}>
                        <Target className="w-6 h-6 text-gray-500" />
                    </div>
                    <span className="font-bold">Add New Goal</span>
                </button>
            </div>

            <div className={cn(
                'p-6 rounded-2xl border',
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-blue-50 border-blue-100'
            )}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 rounded-xl text-white">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Skills Audit</h3>
                        <p className={cn('text-sm mb-3', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            Assess your current skills and identify gaps to reach your career goals.
                        </p>
                        <Button onClick={() => navigate('/skills-audit')} size="small">
                            Start Audit
                        </Button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
