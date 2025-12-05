import { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import Button from './Button';
import { cn } from '../../lib/cva';

interface ReplyInputProps {
    authorName: string;
    userAvatarUrl?: string;
    userName?: string;
    isDark: boolean;
    isSubmitting: boolean;
    onSubmit: (content: string) => void;
    onCancel: () => void;
}

/**
 * Separate component for reply input to prevent focus loss
 * This component manages its own local state for the input value
 */
export default function ReplyInput({
    authorName,
    userAvatarUrl,
    userName,
    isDark,
    isSubmitting,
    onSubmit,
    onCancel,
}: ReplyInputProps) {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus on mount
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const handleSubmit = () => {
        if (content.trim()) {
            onSubmit(content);
            setContent('');
        }
    };

    return (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-black rounded-lg">
            <div className="flex space-x-3">
                <Avatar
                    src={userAvatarUrl}
                    alt={userName || 'You'}
                    size="sm"
                    className="shrink-0"
                />
                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        dir="ltr"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={cn(
                            'w-full p-2 border rounded-lg resize-none text-left',
                            isDark
                                ? 'bg-black border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                        )}
                        rows={2}
                        placeholder={`Reply to ${authorName}...`}
                    />
                    <div className="flex rounded-md space-x-2 mt-2">
                        <Button
                            className="rounded-md"
                            size="small"
                            onClick={handleSubmit}
                            disabled={!content.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Replying...' : 'Reply'}
                        </Button>
                        <Button
                            className="rounded-md"
                            size="small"
                            variant="ghost"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
