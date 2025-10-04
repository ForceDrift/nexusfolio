"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button"
import { HeroSectionOne } from "@/components/hero-section-one"
import { WobbleCardDemo } from "@/components/wobble-card-demo"
import dynamic from "next/dynamic";

// Dynamically import CTAFooter to avoid SSR issues with three-globe
const CTAFooter = dynamic(() => import("@/components/cta-footer"), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Get Started
            </h3>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Portfolio?
            </h2>
            <p className="text-slate-300 mb-6">
              Join thousands of investors who trust NexusFolio for their financial growth.
            </p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Start Your Journey
            </button>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Analytics</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <div className="h-48 w-full rounded-lg overflow-hidden bg-slate-800/50 relative -ml-48 mr-0">
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div className="text-white">Loading...</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-slate-400 mb-4 sm:mb-0">
              © NEXUSFOLIO 2024. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export function PageContent() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPoint = 300; // Start transition after 300px scroll
      
      setIsScrolled(scrollPosition > triggerPoint);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ease-in-out relative ${
        isScrolled ? 'bg-black' : 'bg-white'
      }`}
    >
      {/* Hero Section */}
      <HeroSectionOne />

      {/* Content sections to demonstrate scroll effect */}
      <WobbleCardDemo />

      <CTAFooter />
    </div>
  );
}
