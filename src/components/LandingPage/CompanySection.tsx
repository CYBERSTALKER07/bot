import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '@mui/material';
import { useScrollTrigger, useScrollTriggerStagger } from '../../hooks/useScrollTrigger';
import { gsap } from 'gsap';
import { Briefcase } from 'lucide-react';

const hiringAnnouncements = [
	{
		name: 'Google',
		color: '#4285F4',
		announcement: '🔥 Hiring 500+ Software Engineers',
		positions: 'AI/ML, Frontend, Backend',
		icon: <Briefcase className="h-5 w-5" />
	},
	{
		name: 'Microsoft',
		color: '#00A4EF',
		announcement: '⚡ 300+ Open Positions',
		positions: 'Cloud, Security, DevOps',
		icon: <Briefcase className="h-5 w-5" />
	},
	{
		name: 'Apple',
		color: '#000000',
		announcement: '🚀 iOS Team Expansion',
		positions: 'Mobile, UI/UX, Hardware',
		icon: <Briefcase className="h-5 w-5" />
	},
	{
		name: 'Amazon',
		color: '#FF9900',
		announcement: '💼 AWS Division Growing',
		positions: 'SysAdmin, Solutions Architect',
		icon: <Briefcase className="h-5 w-5" />
	},
	{
		name: 'Meta',
		color: '#1877F2',
		announcement: '🌟 Metaverse Opportunities',
		positions: 'VR/AR, Backend, Research',
		icon: <Briefcase className="h-5 w-5" />
	},
	{
		name: 'Tesla',
		color: '#CC0000',
		announcement: '🔋 Energy Revolution',
		positions: 'Embedded, Automotive, Energy',
		icon: <Briefcase className="h-5 w-5" />
	},
	{
		name: 'Netflix',
		color: '#E20614',
		announcement: '🎬 Content & Tech Roles',
		positions: 'Streaming, Data Science, ML',
		icon: <Briefcase className="h-5 w-5" />
	},
	{
		name: 'Spotify',
		color: '#1DB954',
		announcement: '🎵 Music Tech Innovation',
		positions: 'Audio Engineering, Backend',
		icon: <Briefcase className="h-5 w-5" />
	}
];

interface CompanySectionProps {
	companiesRef: React.RefObject<HTMLElement>;
}

export default function CompanySection({ companiesRef }: CompanySectionProps) {
	const { isDark } = useTheme();
	const firstRowRef = useRef<HTMLDivElement>(null);
	const secondRowRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const gradientRef = useRef<HTMLDivElement>(null);

	// Company logo scroll effect with enhanced reveal animation
	useScrollTrigger(
		firstRowRef,
		(element, progress) => {
			const logos = element.querySelectorAll('.hiring-card');
			logos.forEach((logo, index) => {
				const delay = index * 0.05;
				const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

				gsap.set(logo, {
					opacity: elementProgress,
					scale: 0.7 + elementProgress * 0.3,
					x: (1 - elementProgress) * (index % 2 === 0 ? 100 : -100),
					rotation: (1 - elementProgress) * (index % 2 === 0 ? -15 : 15),
					ease: 'none'
				});

				// Advanced glow effect on high progress
				if (elementProgress > 0.7) {
					const glowIntensity = (elementProgress - 0.7) / 0.3;
					(logo as HTMLElement).style.boxShadow = `0 0 ${glowIntensity * 40}px rgba(59, 130, 246, ${glowIntensity * 0.4})`;
				}

				// Company name rotation effect
				const nameEl = logo.querySelector('h3') as HTMLElement;
				if (nameEl) {
					gsap.set(nameEl, {
						rotation: elementProgress * 10 - 5,
						scale: 1 + elementProgress * 0.1,
						ease: 'none'
					});
				}

				// Badge bounce effect
				const badge = logo.querySelector('.hiring-badge') as HTMLElement;
				if (badge) {
					gsap.set(badge, {
						y: Math.sin(elementProgress * Math.PI * 4) * 5,
						scale: 1 + Math.sin(elementProgress * Math.PI * 8) * 0.1,
						ease: 'none'
					});
				}
			});
		},
		{
			start: 'top 75%',
			end: 'bottom 70%',
			scrub: 1.5
		}
	);

	// Staggered text reveal effect for company names
	useScrollTrigger(
		secondRowRef,
		(element, progress) => {
			const cards = element.querySelectorAll('.hiring-card');
			cards.forEach((card, index) => {
				const delay = index * 0.08;
				const elementProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

				gsap.set(card, {
					opacity: elementProgress,
					scale: 0.7 + elementProgress * 0.3,
					x: (1 - elementProgress) * (index % 2 === 0 ? 100 : -100),
					rotation: (1 - elementProgress) * (index % 2 === 0 ? 10 : -10),
					ease: 'none'
				});

				// Text reveal effect - using blue color consistently
				const title = card.querySelector('h3') as HTMLElement;
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
				});
			}
		}
	}, []);

	// Auto-sliding animation for second row (right to left)
	useEffect(() => {
		if (secondRowRef.current) {
			const container = secondRowRef.current.querySelector('.carousel-container') as HTMLElement;
			if (container) {
				gsap.fromTo(container, {
					x: '-50%'
				}, {
					x: '0%',
					duration: 30,
					ease: 'none',
					repeat: -1,
				});
			}
		}
	}, []);

	return (
		<section
			ref={companiesRef}
			className={`relative py-32 overflow-hidden transition-colors duration-500 ${
				isDark ? 'bg-dark-surface' : 'bg-white'
			}`}
		>
			{/* Animated Background Gradient */}
			<div
				ref={gradientRef}
				className={`absolute left-0 top-0 w-full h-2 transform -skew-x-12 ${
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
						ml={35}
					>
						Join thousands of students who've found their dream jobs with these incredible companies!
					</Typography>
				</div>
			</div>

			{/* First Row - Moving Left to Right with Scroll Animations */}
			<div ref={firstRowRef} className="relative overflow-hidden mb-8">
				<div className="carousel-container flex space-x-6 items-center">
					{[...firstRowCompanies, ...firstRowCompanies].map((company, index) => (
						<div key={`first-${index}`} className={`hiring-card group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border min-w-[320px] flex-shrink-0 bg-white hover:border-blue-300 ${
							isDark
								? 'border-gray-200'
								: 'border-gray-200'
						}`}>
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0">
									<div className="relative">
										<div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
											style={{ backgroundColor: company.color }}>
											{company.name.charAt(0)}
										</div>
										<div className="absolute -top-2 -right-2 text-blue-500 group-hover:scale-125 transition-transform duration-300">
											{company.icon}
										</div>
									</div>
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold mb-2 transition-colors duration-300 text-gray-900">
										{company.name}
									</h3>
									<p className="font-semibold text-sm mb-2 text-blue-600">
										{company.announcement}
									</p>
									<p className="text-sm transition-colors duration-300 text-gray-600">
										{company.positions}
									</p>
									<div className="mt-3 flex items-center space-x-2">
										<span className="hiring-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
						<div key={`second-${index}`} className={`hiring-card group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border min-w-[320px] flex-shrink-0 bg-white hover:border-blue-300 ${
							isDark
								? 'border-gray-200'
								: 'border-gray-200'
						}`}>
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0">
									<div className="relative">
										<div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
											style={{ backgroundColor: company.color }}>
											{company.name.charAt(0)}
										</div>
										<div className="absolute -top-2 -right-2 text-blue-500 group-hover:scale-125 transition-transform duration-300">
											{company.icon}
										</div>
									</div>
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold mb-2 transition-colors duration-300 text-gray-900">
										{company.name}
									</h3>
									<p className="font-semibold text-sm mb-2 text-blue-600">
										{company.announcement}
									</p>
									<p className="text-sm transition-colors duration-300 text-gray-600">
										{company.positions}
									</p>
									<div className="mt-3 flex items-center space-x-2">
										<span className="hiring-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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