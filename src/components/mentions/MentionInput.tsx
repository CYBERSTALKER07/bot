import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useOptimizedQuery';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cva';
import { Loader, Verified } from 'lucide-react';

interface MentionInputProps {
    value: string;
    onChange: (value: string) => void;
    onMentionsChange?: (mentionedUserIds: string[]) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

interface User {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    verified?: boolean;
}

export default function MentionInput({
    value,
    onChange,
    onMentionsChange,
    placeholder = "What's on your mind?",
    className,
    minHeight = "100px"
}: MentionInputProps) {
    const { isDark } = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [query, setQuery] = useState<string | null>(null);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionStart, setMentionStart] = useState<number>(-1);
    const [mentionedUsers, setMentionedUsers] = useState<Map<string, string>>(new Map()); // username -> id

    // Use existing search hook
    const { data: searchResults, isLoading } = useSearch(query || '', { type: 'users' });
    const suggestions = (searchResults?.users as User[]) || [];

    useEffect(() => {
        if (onMentionsChange) {
            // Extract all usernames currently in the text
            const currentUsernames = new Set<string>();
            const regex = /@(\w+)/g;
            let match;
            while ((match = regex.exec(value)) !== null) {
                currentUsernames.add(match[1]);
            }

            // Filter mentionedUsers map to only include those still in text
            const currentIds: string[] = [];
            mentionedUsers.forEach((id, username) => {
                if (currentUsernames.has(username)) {
                    currentIds.push(id);
                }
            });

            onMentionsChange(currentIds);
        }
    }, [value, mentionedUsers, onMentionsChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const newCursorPos = e.target.selectionStart;
        onChange(newValue);
        setCursorPosition(newCursorPos);

        // Check for mention trigger
        const textBeforeCursor = newValue.slice(0, newCursorPos);
        const lastAtPos = textBeforeCursor.lastIndexOf('@');

        if (lastAtPos !== -1) {
            const textAfterAt = textBeforeCursor.slice(lastAtPos + 1);
            // Allow spaces in name search until a certain length or special char
            if (!textAfterAt.includes('\n') && textAfterAt.length >= 1 && textAfterAt.length < 20) {
                setMentionStart(lastAtPos);
                setQuery(textAfterAt);
                setShowSuggestions(true);
                setSelectedIndex(0);
                return;
            }
        }

        setShowSuggestions(false);
        setQuery(null);
    };

    const handleSelectUser = (user: User) => {
        if (mentionStart === -1) return;

        const beforeMention = value.slice(0, mentionStart);
        const afterMention = value.slice(cursorPosition);
        const mentionText = `@${user.username} `;

        const newValue = beforeMention + mentionText + afterMention;

        // Update mentioned users map
        setMentionedUsers(prev => {
            const newMap = new Map(prev);
            newMap.set(user.username, user.id);
            return newMap;
        });

        onChange(newValue);
        setShowSuggestions(false);
        setQuery(null);

        // Restore focus and cursor
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = mentionStart + mentionText.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % suggestions.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
                break;
            case 'Enter':
            case 'Tab':
                e.preventDefault();
                handleSelectUser(suggestions[selectedIndex]);
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    return (
        <div className="relative w-full">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                    "w-full p-4 rounded-xl resize-none focus:outline-hidden focus:ring-2 transition-all duration-200",
                    isDark
                        ? "bg-gray-900 text-white placeholder-gray-500 focus:ring-gray-700"
                        : "bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-gray-200",
                    className
                )}
                style={{ minHeight }}
            />

            {showSuggestions && query && (
                <div className={cn(
                    "absolute z-50 left-0 right-0 mt-2 rounded-xl shadow-lg overflow-hidden border",
                    isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"
                )}>
                    {isLoading ? (
                        <div className="p-4 flex justify-center">
                            <Loader className="w-5 h-5 animate-spin text-gray-500" />
                        </div>
                    ) : suggestions.length > 0 ? (
                        <ul className="max-h-60 overflow-y-auto">
                            {suggestions.map((user, index) => (
                                <li
                                    key={user.id}
                                    onClick={() => handleSelectUser(user)}
                                    className={cn(
                                        "px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors",
                                        index === selectedIndex
                                            ? (isDark ? "bg-gray-900" : "bg-gray-50")
                                            : "hover:bg-gray-50 dark:hover:bg-gray-900"
                                    )}
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                                            isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-700"
                                        )}>
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className={cn("font-medium truncate", isDark ? "text-white" : "text-gray-900")}>
                                                {user.full_name}
                                            </span>
                                            {user.verified && <Verified className="w-3 h-3 text-info-500" />}
                                        </div>
                                        <div className={cn("text-xs truncate", isDark ? "text-gray-500" : "text-gray-500")}>
                                            @{user.username}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-3 text-center text-sm text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
