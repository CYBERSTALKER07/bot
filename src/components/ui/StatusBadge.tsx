import React from 'react';
import {
  Clock,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Star,
  Calendar,
  LucideIcon
} from 'lucide-react';

type Status = 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected' | 'hired' | 'shortlisted' | 'active' | 'inactive' | 'expired' | 'looking' | 'interviewing';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
  customLabel?: string;
  pill?: boolean;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    emoji: '⏳',
    icon: Clock,
    colors: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    darkColors: 'bg-yellow-500 text-white'
  },
  reviewed: {
    label: 'Reviewed',
    emoji: '👀',
    icon: Eye,
    colors: 'bg-info-100 text-info-800 border-info-200',
    darkColors: 'bg-info-500 text-white'
  },
  interview: {
    label: 'Interview',
    emoji: '💬',
    icon: MessageSquare,
    colors: 'bg-purple-100 text-purple-800 border-purple-200',
    darkColors: 'bg-purple-500 text-white'
  },
  accepted: {
    label: 'Accepted',
    emoji: '✅',
    icon: CheckCircle,
    colors: 'bg-green-100 text-green-800 border-green-200',
    darkColors: 'bg-green-500 text-white'
  },
  rejected: {
    label: 'Rejected',
    emoji: '❌',
    icon: XCircle,
    colors: 'bg-red-100 text-red-800 border-red-200',
    darkColors: 'bg-red-500 text-white'
  },
  hired: {
    label: 'Hired',
    emoji: '🎉',
    icon: Star,
    colors: 'bg-green-100 text-green-800 border-green-200',
    darkColors: 'bg-green-500 text-white'
  },
  shortlisted: {
    label: 'Shortlisted',
    emoji: '⭐',
    icon: Star,
    colors: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    darkColors: 'bg-yellow-500 text-white'
  },
  active: {
    label: 'Active',
    emoji: '🟢',
    icon: CheckCircle,
    colors: 'bg-green-100 text-green-800 border-green-200',
    darkColors: 'bg-green-500 text-white'
  },
  inactive: {
    label: 'Inactive',
    emoji: '🔴',
    icon: XCircle,
    colors: 'bg-gray-100 text-gray-800 border-gray-200',
    darkColors: 'bg-gray-500 text-white'
  },
  expired: {
    label: 'Expired',
    emoji: '📅',
    icon: Calendar,
    colors: 'bg-red-100 text-red-800 border-red-200',
    darkColors: 'bg-red-500 text-white'
  },
  looking: {
    label: 'Looking',
    emoji: '🔍',
    icon: Eye,
    colors: 'bg-blue-100 text-blue-800 border-blue-200',
    darkColors: 'bg-blue-500 text-white'
  },
  interviewing: {
    label: 'Interviewing',
    emoji: '🗣️',
    icon: MessageSquare,
    colors: 'bg-purple-100 text-purple-800 border-purple-200',
    darkColors: 'bg-purple-500 text-white'
  }
};

export default function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className = '',
  animated = true,
  customLabel,
  pill = false
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const baseClasses = "inline-flex items-center font-medium border backdrop-blur-sm transition-all duration-200";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2"
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const shapeClasses = pill ? "rounded-full" : "rounded-lg";
  const animationClasses = animated ? "hover:scale-105 transform" : "";

  const badgeClasses = `
    ${baseClasses}
    ${config.colors}
    ${sizeClasses[size]}
    ${shapeClasses}
    ${animationClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeClasses}>
      {showIcon && (
        <Icon className={iconSizeClasses[size]} />
      )}
      <span>
        {customLabel || config.label} {config.emoji}
      </span>
    </span>
  );
}

// Additional status utilities
export const getStatusColor = (status: Status) => {
  return statusConfig[status]?.colors || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStatusIcon = (status: Status) => {
  return statusConfig[status]?.icon || AlertCircle;
};

export const getStatusEmoji = (status: Status) => {
  return statusConfig[status]?.emoji || '❓';
};