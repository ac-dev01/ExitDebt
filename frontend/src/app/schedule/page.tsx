'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PrimaryButton from '@/components/PrimaryButton';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const slots = [
    'Morning (10am – 12pm)',
    'Afternoon (2pm – 5pm)',
    'Evening (6pm – 8pm)',
  ];

  const handleBooking = () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmed(true);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4 flex justify-center">
        <div className="w-full max-w-md">
          {!confirmed ? (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                📞 Book a Free Consultation
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Speak to our debt restructuring expert to understand your savings plan.
              </p>

              <div className="space-y-3 mb-6">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      selectedSlot === slot
                        ? 'border-purple bg-purple/5 text-purple ring-1 ring-purple'
                        : 'border-border hover:border-purple/30 text-text-secondary'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      🕐 {slot}
                    </span>
                    {selectedSlot === slot && (
                      <span className="text-purple font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <PrimaryButton
                onClick={handleBooking}
                loading={isSubmitting}
                disabled={!selectedSlot}
                className="w-full"
              >
                Confirm Callback
              </PrimaryButton>

              <p className="text-center text-xs text-text-muted mt-4">
                No commitment required. 100% confidential.
              </p>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Callback Confirmed!</h2>
              <p className="text-sm text-text-secondary mb-2">
                We&apos;ll call you during:
              </p>
              <p className="text-base font-semibold text-purple mb-6">{selectedSlot}</p>
              <p className="text-sm text-text-secondary mb-6">
                Our expert will review your debt profile and discuss savings options. No fees, no pressure.
              </p>
              <PrimaryButton onClick={() => router.push('/')} className="w-full">
                ← Back to Dashboard
              </PrimaryButton>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
