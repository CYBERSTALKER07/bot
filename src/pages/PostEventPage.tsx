import { useNavigate } from 'react-router-dom';
import PostEventForm from '../components/PostEventForm';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';

export default function PostEventPage() {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const handleClose = () => {
        navigate(-1); // Go back to previous page
    };

    const handleSuccess = () => {
        navigate('/dashboard'); // Redirect to dashboard on success
    };

    return (
        <div className={cn(
            'min-h-screen w-full pt-20 pb-8',
            isDark ? 'bg-black' : 'bg-gray-50'
        )}>
            <PostEventForm
                onClose={handleClose}
                onSuccess={handleSuccess}
                fullPage={true}
            />
        </div>
    );
}
