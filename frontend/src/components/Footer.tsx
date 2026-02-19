import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand — takes more space */}
          <div className="md:col-span-5">
            <Link href="/" className="text-xl font-bold inline-block mb-4">
              <span className="text-text-primary">Exit</span>
              <span className="gradient-text">Debt</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Helping salaried Indians take control of their debt — with clarity, privacy, and zero judgment. Your journey to financial freedom starts with a free check.
            </p>
            <div className="flex items-center gap-4 mt-5 text-text-muted text-xs">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-purple" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                256-bit Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                DPDP Compliant
              </span>
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-text-primary text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li><a href="/#how-it-works" className="hover:text-purple transition-colors">How it works</a></li>
              <li><Link href="/schedule" className="hover:text-purple transition-colors">Schedule a Call</Link></li>
              <li><a href="/#faq" className="hover:text-purple transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-text-primary text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li><Link href="/privacy" className="hover:text-purple transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-text-primary text-sm mb-4">Connect</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple transition-colors">Twitter / X</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple transition-colors">LinkedIn</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Aaditri Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Made with care in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
