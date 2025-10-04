"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button"
import { HeroSectionOne } from "@/components/hero-section-one"
import { WobbleCardDemo } from "@/components/wobble-card-demo"
import CTAFooter from "@/components/cta-footer"

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
      className={`min-h-screen transition-all duration-300 ease-in-out ${
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
