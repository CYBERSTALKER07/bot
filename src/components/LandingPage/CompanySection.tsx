import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '@mui/material';
import { useScrollTrigger, useScrollTriggerStagger } from '../../hooks/useScrollTrigger';
import { gsap } from 'gsap';
import { 
	Briefcase, 
	Rocket, 
	Zap, 
	TrendingUp, 
	Building2, 
	Globe, 
	Award, 
	Users 
} from 'lucide-react';

const hiringAnnouncements = [
	{
		name: 'Google',
		logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
		color: '#4285F4',
		announcement: '🔥 Hiring 500+ Software Engineers',
		positions: 'AI/ML, Frontend, Backend',
		icon: <Rocket className="h-5 w-5" />
	},
	{
		name: 'Microsoft',
		logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIGZpbGw9IiNmMjUwMjIiLz4KICA8cmVjdCB4PSIxMyIgd2lkdGg9IjExIiBoZWlnaHQ9IjExIiBmaWxsPSIjN2ZiYTAwIi8+CiAgPHJlY3QgeT0iMTMiIHdpZHRoPSIxMSIgaGVpZ2h0PSIxMSIgZmlsbD0iIzAwYTRlZiIvPgogIDxyZWN0IHg9IjEzIiB5PSIxMyIgd2lkdGg9IjExIiBoZWlnaHQ9IjExIiBmaWxsPSIjZmZiOTAwIi8+Cjwvc3ZnPg==',
		color: '#00A4EF',
		announcement: '⚡ 300+ Open Positions',
		positions: 'Cloud, Security, DevOps',
		icon: <Zap className="h-5 w-5" />
	},
	{
		name: 'Apple',
		logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
		color: '#000000',
		announcement: '🚀 iOS Team Expansion',
		positions: 'Mobile, UI/UX, Hardware',
		icon: <TrendingUp className="h-5 w-5" />
	},
	{
		name: 'Amazon',
		logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
		color: '#FF9900',
		announcement: '💼 AWS Division Growing',
		positions: 'SysAdmin, Solutions Architect',
		icon: <Building2 className="h-5 w-5" />
	},
	{
		name: 'Meta',
		logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
		color: '#1877F2',
		announcement: ' Metaverse Opportunities',
		positions: 'VR/AR, Backend, Research',
		icon: <Globe className="h-5 w-5" />
	},
	{
		name: 'Tesla',
		logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEuNUw4LjkgNC43NkM5LjYgNC4zNSAxMC40IDQuMDUgMTEuMzMgMy45MmMuNjctLjEzIDEuMzMtLjEzIDIgMGMuOTMuMTMgMS43My40MyAyLjQzLjg0bC0zLjEtMy4yNloiIGZpbGw9IiNDQzAwMDAiLz4KPHBhdGggZD0iTTEyIDIyLjVMMTUuMSAxOS4yNEMxNC40NSAxOS42NiAxMy42NSAxOS45NiAxMi42NyAyMC4wOGMtLjY3LjEzLTEuMzMuMTMtMiAwYy0uOTMtLjEzLTEuNzMtLjQzLTIuNDMtLjg0bDMuMSAzLjI2WiIgZmlsbD0iI0NDMDAwMCIvPgo8cGF0aCBkPSJNMTIgMjIuNUwxNS4xIDE5LjI0QzE0LjQ1IDE5LjY2IDEzLjY1IDE5Ljk2IDEyLjY3IDIwLjA4Yy0uNjcuMTMtMS4zMy4xMy0yIDBjLS45My0uMTMtMS43My0uNDMtMi40My04NGwzLjEgMy4yNloiIGZpbGw9IiNDQzAwMDAiLz4KPC9zdmc+',
		color: '#CC0000',
		announcement: '🔋 Energy Revolution',
		positions: 'Embedded, Automotive, Energy',
		icon: <Award className="h-5 w-5" />
	},
	{
		name: 'Netflix',
		logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMzk4IDBoLS43OTZBMSAxIDAgMCAwIDQgMXYyMmExIDEgMCAwIDAgLjYwMi45MmwxMS4yIDIuOGMuMzA4LjA3Ny42MTgtLjEyNi42MjItLjQ0NEwyMCAzLjIzNmMwLS4zLS4yNDgtLjU0LS41NDgtLjQ5OGwtOC4wNSAxLjEwNkE1LjM5OCA1LjM5OCAwIDAgMCA1LjM5OCAwWiIgZmlsbD0iI0UyMDYxNCIvPgo8L3N2Zz4K',
		color: '#E20614',
		announcement: '🎬 Content & Tech Roles',
		positions: 'Streaming, Data Science, ML',
		icon: <Users className="h-5 w-5" />
	},
	{
		name: 'Spotify',
		logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzFEQjk1NCIvPgogIDxwYXRoIGQ9Ik0xNy4zIDEwLjVjLTMuMS0xLjgtNy4xLTIuMi0xMS4yLTEuMi0uNC4xLS43LS4xLS44LS41LS4xLS40LjEtLjcuNS0uOCA0LjQtMSA4LjgtLjYgMTIuMyAxLjQuNC4yLjUuNi4zIDEtLjIuNC0uNy41LTEuMS4xWm0tLjEgMy4zYy0uMi4zLS42LjQtMSAuMi0yLjYtMS42LTYuNi0yLTkuNy0xLjEtLjMuMS0uNy0uMS0uOC0uNC0uMS0uMy4xLS43LjQtLjggMy41LTEgNy45LS41IDEwLjggMS4zLjMuMS40LjYuMy44Wm0tMS4xIDMuMmMtLjIuMi0uNS4zLS44LjItMi4yLTEuMy01LTEuNi03LjgtLjktLjMuMS0uNS0uMS0uNi0uNC0uMS0uMy4xLS41LjQtLjYgMy4yLS44IDYuMi0uNCA4LjcgMS0uMi4xLS4zLjUtLjkuN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
		color: '#1DB954',
		announcement: '🎵 Music Tech Innovation',
		positions: 'Audio Engineering, Backend',
		icon: <Briefcase className="h-5 w-5" />
	}
];

interface CompanySectionProps {
	companiesRef: React.RefObject<HTMLDivElement>;
}

export default function CompanySection({ companiesRef }: CompanySectionProps) {
	const { isDark } = useTheme();
	const headerRef = useRef<HTMLDivElement>(null);
	const firstRowRef = useRef<HTMLDivElement>(null);
	const secondRowRef = useRef<HTMLDivElement>(null);
	const decorativeRef = useRef<HTMLDivElement>(null);
	const gradientRef = useRef<HTMLDivElement>(null);

	// Header animation with dynamic scroll response
	useScrollTrigger(
		headerRef,
		(element, progress) => {
			gsap.set(element, {
				opacity: progress,
				y: (1 - progress) * 60,
				scale: 0.9 + progress * 0.1,
				rotation: (1 - progress) * 3,
				ease: 'none'
			});
		},
		{
			start: 'top 85%',
			end: 'top 10%',
			scrub: 1.5
		}
	);

	// Decorative element parallax animation
	useScrollTrigger(
		decorativeRef,
		(element, progress) => {
			gsap.set(element, {
				scaleX: 0.5 + progress * 0.5,
				opacity: progress * 0.8,
				skewX: (1 - progress) * 20,
				ease: 'none'
			});
		},
		{
			start: 'top 90%',
			end: 'top 20%',
			scrub: 2
		}
	);

	// First row cards with staggered scroll animations
	useScrollTriggerStagger(
		firstRowRef,
		'.hiring-card',
		(elements, progress) => {
			elements.forEach((element, index) => {
				const delay = index * 0.15;
				const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

				gsap.set(element, {
					opacity: elementProgress,
					scale: 0.6 + elementProgress * 0.4,
					y: (1 - elementProgress) * 80,
					rotation: (1 - elementProgress) * (index % 2 === 0 ? -15 : 15),
					ease: 'none'
				});

				// Advanced glow effect on high progress
				if (elementProgress > 0.7) {
					const glowIntensity = (elementProgress - 0.7) / 0.3;
					(element as HTMLElement).style.boxShadow = `0 0 ${glowIntensity * 40}px rgba(59, 130, 246, ${glowIntensity * 0.4})`;
				}

				// Logo rotation effect
				const logo = element.querySelector('img') as HTMLElement;
				if (logo) {
					gsap.set(logo, {
						rotation: elementProgress * 360,
						scale: 1 + elementProgress * 0.2,
						ease: 'none'
					});
				}

				// Badge bounce effect
				const badge = element.querySelector('.hiring-badge') as HTMLElement;
				if (badge && elementProgress > 0.5) {
					const badgeProgress = (elementProgress - 0.5) / 0.5;
					gsap.set(badge, {
						scale: 1 + Math.sin(badgeProgress * Math.PI * 3) * 0.1,
						rotation: Math.sin(badgeProgress * Math.PI * 2) * 5,
						ease: 'none'
					});
				}
			});
		},
		{
			start: 'top 70%',
			end: 'bottom 90%',
			scrub: 1.2
		}
	);

	// Second row cards with different animation pattern
	useScrollTriggerStagger(
		secondRowRef,
		'.hiring-card',
		(elements, progress) => {
			elements.forEach((element, index) => {
				const delay = index * 0.12;
				const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

				gsap.set(element, {
					opacity: elementProgress,
					scale: 0.7 + elementProgress * 0.3,
					x: (1 - elementProgress) * (index % 2 === 0 ? 100 : -100),
					rotation: (1 - elementProgress) * (index % 2 === 0 ? 10 : -10),
					ease: 'none'
				});

				// Text reveal effect - using blue color consistently
				const title = element.querySelector('h3') as HTMLElement;
				if (title) {
					gsap.set(title, {
						backgroundPosition: `${elementProgress * 100}% 0%`,
						backgroundSize: '200% 100%',
						backgroundImage: isDark
							? 'linear-gradient(90deg, transparent 0%, #2563eb 50%, transparent 100%)'
							: 'linear-gradient(90deg, transparent 0%, #2563eb 50%, transparent 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: elementProgress > 0.5 ? 'transparent' : 'inherit',
						ease: 'none'
					});
				}
			});
		},
		{
			start: 'top 75%',
			end: 'bottom 70%',
			scrub: 1.8
		}
	);

	// Background gradient animation
	useScrollTrigger(
		gradientRef,
		(element, progress) => {
			gsap.set(element, {
				background: isDark
					? `linear-gradient(${progress * 45}deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`
					: `linear-gradient(${progress * 45}deg, #f9fafb 0%, #ffffff 50%, #f3f4f6 100%)`,
				ease: 'none'
			});
		},
		{
			start: 'top 80%',
			end: 'bottom 60%',
			scrub: 3
		}
	);

	// Split companies into two rows
	const firstRowCompanies = hiringAnnouncements.slice(0, Math.ceil(hiringAnnouncements.length / 2));
	const secondRowCompanies = hiringAnnouncements.slice(Math.ceil(hiringAnnouncements.length / 2));

	// Auto-sliding animation for first row (left to right)
	useEffect(() => {
		if (firstRowRef.current) {
			const container = firstRowRef.current.querySelector('.carousel-container') as HTMLElement;
			if (container) {
				gsap.to(container, {
					x: '-50%',
					duration: 25,
					ease: 'none',
					repeat: -1,
					repeatDelay: 0
				});
			}
		}
	}, []);

	// Auto-sliding animation for second row (right to left)
	useEffect(() => {
		if (secondRowRef.current) {
			const container = secondRowRef.current.querySelector('.carousel-container') as HTMLElement;
			if (container) {
				gsap.fromTo(
					container,
					{ x: '-50%' },
					{
						x: '0%',
						duration: 25,
						ease: 'none',
						repeat: -1,
						repeatDelay: 0
					}
				);
			}
		}
	}, []);

	return (
		<section
			ref={companiesRef}
			className={`py-20 overflow-hidden relative transition-colors duration-300`}
		>
			{/* Animated Background */}
			<div
				ref={gradientRef}
				className="absolute inset-0 -z-10"
			/>

			{/* Decorative elements with scroll animations */}
			<div
				ref={decorativeRef}
				className={`absolute top-0 left-0 w-full h-2 transform -skew-x-12 ${
					isDark
						? 'bg-gradient-to-r from-transparent via-lime/30 to-transparent'
						: 'bg-gradient-to-r from-transparent via-asu-maroon/30 to-transparent'
				}`}
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
				<div ref={headerRef}>
					<Typography
						variant="h2"
						className={`text-4xl md:text-5xl font-bold mb-6 transform -rotate-1 transition-colors duration-300 ${
							isDark ? 'text-dark-text' : 'text-gray-900'
						}`}
						align="center"
					>
						Trusted by Amazing Companies
					</Typography>
					<Typography
						variant="subtitle1"
						className={`text-xl max-w-2xl mx-auto transform rotate-0.5 transition-colors duration-300 ${
							isDark ? 'text-dark-muted' : 'text-gray-600'
						}`}
						align="center"
						ml={1/2}
						mr={1/2}
					>
						Join thousands of students who've found their dream jobs with these incredible companies!
					</Typography>
				</div>
			</div>

			{/* First Row - Moving Left to Right with Scroll Animations */}
			<div ref={firstRowRef} className="relative overflow-hidden mb-8">
				<div className="carousel-container flex space-x-6 items-center">
					{[...firstRowCompanies, ...firstRowCompanies].map((company, index) => (
						<div key={`first-${index}`} className={`hiring-card group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border min-w-[320px] flex-shrink-0 bg-white hover:border-info-300 ${
							isDark
								? 'border-gray-200'
								: 'border-gray-200'
						}`}>
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0">
									<div className="relative">
										<img
											src={company.logo}
											alt={company.name}
											className="w-16 h-16 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
										/>
										<div className="absolute -top-2 -right-2 text-info-500 group-hover:scale-125 transition-transform duration-300">
											{company.icon}
										</div>
									</div>
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold mb-2 transition-colors duration-300 text-gray-900">
										{company.name}
									</h3>
									<p className="font-semibold text-sm mb-2 text-info-600">
										{company.announcement}
									</p>
									<p className="text-sm transition-colors duration-300 text-gray-600">
										{company.positions}
									</p>
									<div className="mt-3 flex items-center space-x-2">
										<span className="hiring-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800">
											HIRING NOW
										</span>
										<span className="text-xs text-gray-500">• Remote OK</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Second Row - Moving Right to Left with Scroll Animations */}
			<div ref={secondRowRef} className="relative overflow-hidden">
				<div className="carousel-container flex space-x-6 items-center">
					{[...secondRowCompanies, ...secondRowCompanies].map((company, index) => (
						<div key={`second-${index}`} className={`hiring-card group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border min-w-[320px] flex-shrink-0 bg-white hover:border-info-300 ${
							isDark
								? 'border-gray-200'
								: 'border-gray-200'
						}`}>
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0">
									<div className="relative">
										<img
											src={company.logo}
											alt={company.name}
											className="w-16 h-16 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
										/>
										<div className="absolute -top-2 -right-2 text-info-500 group-hover:scale-125 transition-transform duration-300">
											{company.icon}
										</div>
									</div>
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold mb-2 transition-colors duration-300 text-gray-900">
										{company.name}
									</h3>
									<p className="font-semibold text-sm mb-2 text-info-600">
										{company.announcement}
									</p>
									<p className="text-sm transition-colors duration-300 text-gray-600">
										{company.positions}
									</p>
									<div className="mt-3 flex items-center space-x-2">
										<span className="hiring-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800">
											HIRING NOW
										</span>
										<span className="text-xs text-gray-500">• Remote OK</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Animated Gradient overlays */}
			<div className={`absolute left-0 top-0 w-32 h-full z-10 pointer-events-none ${
				isDark
					? 'bg-gradient-to-r from-dark-surface to-transparent'
					: 'bg-gradient-to-r from-white to-transparent'
			}`}></div>
			<div className={`absolute right-0 top-0 w-32 h-full z-10 pointer-events-none ${
				isDark
					? 'bg-gradient-to-l from-dark-surface to-transparent'
					: 'bg-gradient-to-l from-white to-transparent'
			}`}></div>
		</section>
	);
}