'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { articles } from '@/lib/articles';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Article not found</h1>
            <Link href="/articles" className="text-purple hover:underline">
              ← Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Simple markdown-like renderer
  const formatContent = (content: string) => {
    return content.split('\n\n').map((block, index) => {
      if (block.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-text-primary mt-8 mb-3">
            {block.replace('## ', '')}
          </h2>
        );
      }
      if (block.startsWith('- ')) {
        return (
          <ul key={index} className="list-disc pl-5 space-y-1.5 mb-4 text-text-secondary">
            {block.split('\n').map((line, i) => (
              <li key={i}>{line.replace('- ', '')}</li>
            ))}
          </ul>
        );
      }
      // Handle **bold** text
      const parts = block.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="text-text-secondary leading-relaxed mb-4">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={i} className="font-semibold text-text-primary">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/articles"
            className="inline-flex items-center text-sm text-text-secondary hover:text-purple mb-8 transition-colors"
          >
            ← Back to Articles
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-purple uppercase tracking-wider bg-purple/5 px-2 py-0.5 rounded">
                {article.category}
              </span>
              <span className="text-xs text-text-muted">{article.readTime}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              {article.title}
            </h1>
            <p className="text-text-secondary border-l-3 border-purple pl-4 italic">
              {article.excerpt}
            </p>
          </div>

          <hr className="border-border mb-8" />

          {/* Content */}
          <article>{formatContent(article.content)}</article>

          {/* CTA */}
          <div className="mt-16 glass-card p-8 text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Need help with your debt?
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
              Get a personalized debt restructuring plan and start your journey to being debt-free.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/"
                className="px-6 py-2.5 rounded-lg bg-purple text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Check My Options
              </Link>
              <Link
                href="/schedule"
                className="px-6 py-2.5 rounded-lg border border-border text-text-primary font-medium text-sm hover:bg-bg-soft transition-colors"
              >
                📞 Schedule a Call
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
