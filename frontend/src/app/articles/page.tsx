'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { articles } from '@/lib/articles';

export default function ArticlesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/10 text-purple text-xs font-bold uppercase tracking-wider mb-4">
              📖 Knowledge Base
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Articles &amp; Resources
            </h1>
            <p className="text-text-secondary max-w-xl">
              Expert advice and strategies to help you take control of your finances and live debt-free.
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col glass-card overflow-hidden hover:border-purple/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple uppercase tracking-wider bg-purple/5 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-text-muted">
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-text-primary mb-2 group-hover:text-purple transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-3 border-t border-border">
                    <span className="text-sm font-semibold text-text-secondary group-hover:text-purple transition-colors">
                      Read article →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
