import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/cva';
import { Loader2, Upload, Building2, MapPin, Globe, Calendar } from 'lucide-react';

interface CompanyFormData {
    name: string;
    description: string;
    industry: string;
    size: string;
    location: string;
    website: string;
    founded_year: number;
}

export default function CreateCompanyPage() {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Check if user already has a company
        const checkExistingCompany = async () => {
            const { data } = await supabase
                .from('companies')
                .select('id')
                .eq('owner_id', user.id)
                .single();

            if (data) {
                // Redirect to edit page if company exists (future implementation)
                // For now, maybe just show a message or redirect to company detail
                navigate(`/company-detail/${data.id}`);
            }
        };
        checkExistingCompany();
    }, [user, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'logo') {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
            } else {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
            }
        }
    };

    const uploadImage = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('company-assets') // Assuming this bucket exists
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('company-assets')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const onSubmit = async (data: CompanyFormData) => {
        if (!user) return;
        setLoading(true);
        try {
            let logoUrl = null;
            let coverUrl = null;

            if (logoFile) {
                // In a real app, you'd handle storage bucket creation/policies
                // For now, we'll assume a bucket named 'company-assets' or 'avatars' exists
                // Or we can skip image upload if bucket setup is complex for this demo
                // Let's try to upload if possible, or just use a placeholder if it fails
                try {
                    logoUrl = await uploadImage(logoFile, 'logos');
                } catch (e) {
                    console.error("Image upload failed", e);
                    // Fallback or alert user
                }
            }

            if (coverFile) {
                try {
                    coverUrl = await uploadImage(coverFile, 'covers');
                } catch (e) {
                    console.error("Cover upload failed", e);
                }
            }

            const { data: newCompany, error } = await supabase
                .from('companies')
                .insert({
                    name: data.name,
                    description: data.description,
                    industry: data.industry,
                    size: data.size,
                    location: data.location,
                    website: data.website,
                    founded_year: data.founded_year,
                    owner_id: user.id,
                    logo_url: logoUrl,
                    cover_image_url: coverUrl,
                    is_hiring: true // Default to true for now
                })
                .select()
                .single();

            if (error) throw error;

            navigate(`/company-detail/${newCompany.id}`);

        } catch (error) {
            console.error('Error creating company:', error);
            alert('Failed to create company. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn(
            'min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300',
            isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'
        )}>
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Create Your Company Page</h1>
                    <p className={cn('text-lg', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        Showcase your company culture, values, and open positions to attract top talent.
                    </p>
                </div>

                <div className={cn(
                    'rounded-2xl p-8 shadow-xl',
                    isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
                )}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Images Section */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Company Logo</label>
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        'w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed',
                                        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
                                    )}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <label className={cn(
                                        'cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                        isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                                    )}>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'logo')} />
                                        Upload Logo
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Cover Image</label>
                                <div className={cn(
                                    'w-full h-48 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed relative',
                                    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
                                )}>
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <Upload className="w-8 h-8 mb-2" />
                                            <span>Upload Cover Image</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => handleImageChange(e, 'cover')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Company Name</label>
                                <input
                                    {...register('name', { required: 'Company name is required' })}
                                    className={cn(
                                        'w-full px-4 py-3 rounded-lg outline-none transition-all',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-black placeholder-gray-400',
                                        'border focus:ring-2 focus:ring-blue-500/20',
                                        errors.name && 'border-red-500'
                                    )}
                                    placeholder="e.g. Acme Corp"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    {...register('description', { required: true })}
                                    rows={4}
                                    className={cn(
                                        'w-full px-4 py-3 rounded-lg outline-none transition-all',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-black placeholder-gray-400',
                                        'border focus:ring-2 focus:ring-blue-500/20'
                                    )}
                                    placeholder="Tell us about your company..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Industry</label>
                                <input
                                    {...register('industry', { required: true })}
                                    className={cn(
                                        'w-full px-4 py-3 rounded-lg outline-none transition-all',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-black placeholder-gray-400',
                                        'border focus:ring-2 focus:ring-blue-500/20'
                                    )}
                                    placeholder="e.g. Technology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Company Size</label>
                                <select
                                    {...register('size', { required: true })}
                                    className={cn(
                                        'w-full px-4 py-3 rounded-lg outline-none transition-all',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white'
                                            : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-black',
                                        'border focus:ring-2 focus:ring-blue-500/20'
                                    )}
                                >
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="501-1000">501-1000 employees</option>
                                    <option value="1000+">1000+ employees</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...register('location', { required: true })}
                                        className={cn(
                                            'w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all',
                                            isDark
                                                ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-black placeholder-gray-400',
                                            'border focus:ring-2 focus:ring-blue-500/20'
                                        )}
                                        placeholder="e.g. San Francisco, CA"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...register('website')}
                                        className={cn(
                                            'w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all',
                                            isDark
                                                ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-black placeholder-gray-400',
                                            'border focus:ring-2 focus:ring-blue-500/20'
                                        )}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Founded Year</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        {...register('founded_year', { required: true, min: 1800, max: new Date().getFullYear() })}
                                        className={cn(
                                            'w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all',
                                            isDark
                                                ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-black placeholder-gray-400',
                                            'border focus:ring-2 focus:ring-blue-500/20'
                                        )}
                                        placeholder="e.g. 2020"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                'w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]',
                                isDark
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-black text-white hover:bg-gray-800',
                                loading && 'opacity-70 cursor-not-allowed'
                            )}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Creating Company...
                                </span>
                            ) : (
                                'Create Company Page'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
