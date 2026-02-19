'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, name, monthlySalary } = useAuth();
  const pathname = usePathname();
  const hasCompletedFlow = isAuthenticated && monthlySalary > 0;

  // When logged in → link to dedicated pages. When visitor → # anchors on landing.
  const howItWorksHref = hasCompletedFlow ? '/how-it-works' : '/#how-it-works';
  const faqHref = hasCompletedFlow ? '/faq' : '/#faq';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-text-primary">Exit</span>
          <span className="gradient-text">Debt</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-5 text-sm">
          {hasCompletedFlow && (
            <Link
              href="/"
              className={`hover:text-purple transition-colors ${pathname === '/' ? 'text-purple font-semibold' : 'text-text-secondary'}`}
            >
              Dashboard
            </Link>
          )}
          <Link
            href={howItWorksHref}
            className={`hover:text-purple transition-colors ${pathname === '/how-it-works' ? 'text-purple font-semibold' : 'text-text-secondary'}`}
          >
            How It Works
          </Link>
          <Link
            href="/articles"
            className={`hover:text-purple transition-colors ${pathname.startsWith('/articles') ? 'text-purple font-semibold' : 'text-text-secondary'}`}
          >
            Articles
          </Link>
          <Link
            href={faqHref}
            className={`hover:text-purple transition-colors ${pathname === '/faq' ? 'text-purple font-semibold' : 'text-text-secondary'}`}
          >
            FAQ
          </Link>
          <Link
            href="/schedule"
            className={`hover:text-purple transition-colors ${pathname === '/schedule' ? 'text-purple font-semibold' : 'text-text-secondary'}`}
          >
            Schedule a Call
          </Link>
        </div>

        {/* Right: Auth-aware */}
        <div className="flex items-center gap-4">
          {hasCompletedFlow ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 text-sm font-medium text-text-primary bg-bg-soft px-3 py-1.5 rounded-full border border-border hover:border-purple/30 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-purple/10 text-purple flex items-center justify-center text-xs font-bold">
                {name?.charAt(0) || 'U'}
              </span>
              <span className="hidden sm:inline">{name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              href="/#hero-form"
              className="text-sm px-4 py-2 rounded-lg bg-purple text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
