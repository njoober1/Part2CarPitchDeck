import React, { useState, useEffect } from 'react';
import type { NavLink } from '../types';

interface HeaderProps {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  currency: 'USD' | 'AED';
  setCurrency: (curr: 'USD' | 'AED') => void;
  onPrint: () => void;
  printTitle: string;
  downloadTitle: string;
  onPodcastClick: () => void;
  podcastTitle: string;
}

const navLinksEn: NavLink[] = [
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'Projections', href: '#projections' },
  { name: 'Market', href: '#market' },
  { name: 'Investment', href: '#investment' },
];

const navLinksAr: NavLink[] = [
  { name: 'نبذة عنا', href: '#about' },
  { name: 'الميزات', href: '#features' },
  { name: 'التوقعات', href: '#projections' },
  { name: 'السوق', href: '#market' },
  { name: 'الاستثمار', href: '#investment' },
];

const Header: React.FC<HeaderProps> = ({ language, setLanguage, currency, setCurrency, onPrint, printTitle, downloadTitle, onPodcastClick, podcastTitle }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const navLinks = language === 'ar' ? navLinksAr : navLinksEn;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (!targetId) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glassmorphism' : 'py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#hero" onClick={handleNavClick} className="text-2xl font-bold text-white">Part2Car<span className="text-[#517AE5]">.ae</span></a>

                <nav className="hidden lg:flex">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} onClick={handleNavClick} className="text-slate-300 hover:text-white transition-colors duration-200 font-medium px-5">
                            {link.name}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center space-x-2 lg:space-x-4">
                    {/* Currency Switcher */}
                    <div className="flex bg-slate-700/50 p-0.5 rounded-lg text-xs font-bold">
                        <button onClick={() => setCurrency('USD')} className={`px-2 py-1 rounded-md transition-colors ${currency === 'USD' ? 'bg-[#517AE5]' : 'hover:bg-slate-600/50'}`}>$</button>
                        <button onClick={() => setCurrency('AED')} className={`px-2 py-1 rounded-md transition-colors ${currency === 'AED' ? 'bg-[#517AE5]' : 'hover:bg-slate-600/50'}`}>AED</button>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex bg-slate-700/50 p-0.5 rounded-lg text-xs font-bold">
                        <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded-md transition-colors ${language === 'en' ? 'bg-[#517AE5]' : 'hover:bg-slate-600/50'}`}>EN</button>
                        <button onClick={() => setLanguage('ar')} className={`px-2 py-1 rounded-md transition-colors ${language === 'ar' ? 'bg-[#517AE5]' : 'hover:bg-slate-600/50'}`}>AR</button>
                    </div>

                    {/* Podcast Button */}
                    <button
                        onClick={onPodcastClick}
                        className="hidden lg:flex bg-slate-700/50 p-2 rounded-lg hover:bg-slate-600/50 transition-colors"
                        aria-label={podcastTitle}
                        title={podcastTitle}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>

                    {/* Download Button */}
                    <a
                        href="https://docs.google.com/presentation/d/1bdCuK81x2O-sSv9FO0sV3xdDP4u1JHYV/edit?usp=drive_link&ouid=101891640337986263798&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden lg:flex bg-slate-700/50 p-2 rounded-lg hover:bg-slate-600/50 transition-colors"
                        aria-label={downloadTitle}
                        title={downloadTitle}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </a>

                    {/* Print Button */}
                    <button
                        onClick={onPrint}
                        className="hidden lg:flex bg-slate-700/50 p-2 rounded-lg hover:bg-slate-600/50 transition-colors"
                        aria-label={printTitle}
                        title={printTitle}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                    </button>

                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none" aria-label="Toggle menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden mt-4 glassmorphism">
                    <nav className="flex flex-col items-center space-y-4 py-4">
                         {navLinks.map((link) => (
                            <a key={link.name} href={link.href} onClick={handleNavClick} className="text-slate-300 hover:text-white transition-colors duration-200 font-medium text-lg px-5">
                                {link.name}
                            </a>
                        ))}
                    </nav>
                    <div className="border-t border-slate-700/50 mx-6"></div>
                    <div className="py-4 flex flex-col items-center space-y-4">
                        {/* Podcast Button */}
                        <button
                            onClick={() => { onPodcastClick(); setIsMenuOpen(false); }}
                            className="flex items-center space-x-2 bg-slate-700/50 p-2 px-4 rounded-lg hover:bg-slate-600/50 transition-colors w-[90%] justify-center"
                            aria-label={podcastTitle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            <span>{podcastTitle}</span>
                        </button>
                        {/* Download Button */}
                         <a
                            href="https://docs.google.com/presentation/d/1bdCuK81x2O-sSv9FO0sV3xdDP4u1JHYV/edit?usp=drive_link&ouid=101891640337986263798&rtpof=true&sd=true"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-2 bg-slate-700/50 p-2 px-4 rounded-lg hover:bg-slate-600/50 transition-colors w-[90%] justify-center"
                            aria-label={downloadTitle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>{downloadTitle}</span>
                        </a>
                        {/* Print Button */}
                        <button
                            onClick={() => { onPrint(); setIsMenuOpen(false); }}
                            className="flex items-center space-x-2 bg-slate-700/50 p-2 px-4 rounded-lg hover:bg-slate-600/50 transition-colors w-[90%] justify-center"
                            aria-label={printTitle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>{printTitle}</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;