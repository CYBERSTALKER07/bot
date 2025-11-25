import React, { useState, useEffect } from 'react';
import {
    Users,
    GraduationCap,
    TrendingUp,
    Briefcase,
    Award,
    Search,
    Filter,
    Download,
    MoreHorizontal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import PageLayout from '../components/ui/PageLayout';
import { cn } from '../lib/cva';

interface StudentStat {
    id: string;
    name: string;
    major: string;
    gpa: number;
    status: 'looking' | 'interviewing' | 'hired' | 'placed';
    company?: string;
    graduation_year: number;
}

export default function UniversityDashboard() {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'placements'>('overview');

    // Mock data - replace with real data fetching
    const stats = {
        totalStudents: 1250,
        placedStudents: 850,
        placementRate: 68,
        avgSalary: 85000,
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Tesla']
    };

    const students: StudentStat[] = [
        { id: '1', name: 'Alex Johnson', major: 'Computer Science', gpa: 3.8, status: 'hired', company: 'Google', graduation_year: 2024 },
        { id: '2', name: 'Sarah Williams', major: 'Data Science', gpa: 3.9, status: 'interviewing', graduation_year: 2024 },
        { id: '3', name: 'Michael Brown', major: 'Electrical Engineering', gpa: 3.5, status: 'looking', graduation_year: 2025 },
        { id: '4', name: 'Emily Davis', major: 'UX Design', gpa: 3.7, status: 'hired', company: 'Airbnb', graduation_year: 2024 },
        { id: '5', name: 'David Wilson', major: 'Computer Science', gpa: 3.6, status: 'placed', company: 'Microsoft', graduation_year: 2023 },
    ];

    return (
        <PageLayout
            className={isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}
            maxWidth="7xl"
        >
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">University Dashboard</h1>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Track student placements and manage university profile
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button variant="outlined">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                        <Button>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Students
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stats.totalStudents}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Students</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +8%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stats.placedStudents}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Placed Students</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <Award className="h-6 w-6" />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +5%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stats.placementRate}%</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Placement Rate</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +15%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">${stats.avgSalary.toLocaleString()}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Starting Salary</p>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Student Placements</h2>
                        <div className="flex space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className={`pl-10 pr-4 py-2 rounded-lg border ${isDark
                                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-black placeholder-gray-400'
                                        }`}
                                />
                            </div>
                            <Button variant="outlined" size="small">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-left text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <th className="pb-4 font-medium">Student Name</th>
                                    <th className="pb-4 font-medium">Major</th>
                                    <th className="pb-4 font-medium">Grad Year</th>
                                    <th className="pb-4 font-medium">GPA</th>
                                    <th className="pb-4 font-medium">Status</th>
                                    <th className="pb-4 font-medium">Company</th>
                                    <th className="pb-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {students.map((student) => (
                                    <tr key={student.id} className="group">
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                    <span className="text-xs font-medium">{student.name.charAt(0)}</span>
                                                </div>
                                                <span className="font-medium">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm">{student.major}</td>
                                        <td className="py-4 text-sm">{student.graduation_year}</td>
                                        <td className="py-4 text-sm">{student.gpa}</td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'hired' || student.status === 'placed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : student.status === 'interviewing'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm">
                                            {student.company ? (
                                                <span className="font-medium">{student.company}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <Button variant="ghost" size="small">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </PageLayout>
    );
}
