"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/courses', label: 'Courses' },
        { href: '/about', label: 'About' },
        { href: '/testimonials', label: 'Testimonials' },
        { href: '/contact', label: 'Contact' },
    ];

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav
            style={{
                borderBottom: '1px solid #c9a84c22',
                background: 'rgba(10,15,30,0.85)',
                backdropFilter: 'blur(12px)',
            }}
            className="sticky top-0 z-50 px-4 md:px-8 py-3 md:py-4"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            border: '1.5px solid #c9a84c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src="/casa-del-sapere-logo.png"
                            alt="Casa Del Sapere logo"
                            style={{
                                width: 30,
                                height: 30,
                                objectFit: 'cover',
                                transform: 'scale(1.08)',
                            }}
                        />
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "'Cinzel', serif",
                                fontWeight: 700,
                                fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                                letterSpacing: '0.08em',
                            }}
                            className="gold-text"
                        >
                            CASA DEL SAPERE
                        </div>
                        <div
                            style={{
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: 300,
                                fontSize: '0.5rem',
                                letterSpacing: '0.2em',
                                color: '#c9a84c88',
                                textTransform: 'uppercase',
                            }}
                        >
                            Tutorial Center
                        </div>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="nav-link text-sm">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <Link href="/login" className="hidden sm:block nav-link text-sm">
                        Log In
                    </Link>
                    <Link href="/enroll">
                        <Button className="btn-gold px-3 md:px-6 py-2 rounded-none h-auto text-xs md:text-sm">Enroll Now</Button>
                    </Link>
                </div>

                <button
                    type="button"
                    aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="md:hidden flex h-11 w-11 items-center justify-center border border-[#c9a84c55]"
                >
                    <span className="sr-only">Toggle navigation</span>
                    <div className="relative h-4 w-5">
                        <span
                            className={`absolute left-0 top-0 h-[2px] w-full bg-[#c9a84c] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                        />
                        <span
                            className={`absolute left-0 top-[7px] h-[2px] w-full bg-[#c9a84c] transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                        />
                        <span
                            className={`absolute left-0 top-[14px] h-[2px] w-full bg-[#c9a84c] transition-transform duration-300 ${isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                        />
                    </div>
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 border-t border-[#c9a84c33] pt-4">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="nav-link text-sm" onClick={closeMobileMenu}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                        <Link href="/login" className="nav-link text-sm" onClick={closeMobileMenu}>
                            Log In
                        </Link>
                        <Link href="/enroll" onClick={closeMobileMenu}>
                            <Button className="btn-gold w-full px-6 py-3 rounded-none h-auto text-sm">Enroll Now</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
