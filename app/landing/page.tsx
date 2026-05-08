"use client";

import { useState, useEffect, useCallback } from "react";
import HeroSection from "@/components/screens/landing/header-section/hero";
import Header, { type NavigationSection } from "@/components/screens/landing/header-section/header";
import BrandSlider, { BrandList } from "@/components/screens/landing/header-section/brand-slider";
import CoreFeatures from "@/components/screens/landing/core-features";
import PerformanceMetrics from "@/components/screens/landing/performance-metrics";
import FooterMetrics from "@/components/screens/landing/footer-metrics";
import CallToActionSection from "@/components/screens/landing/call-to-action-section";
import FeatureHighlights from "@/components/screens/landing/feature-highlights";

export default function LeadingPage() {
  const [activeSection, setActiveSection] = useState("home");

  const handleScroll = useCallback(() => {
    const sections = ["home", "workflow", "operations", "features", "contact"];
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const avatarList = [
    { image: "https://images.shadcnspace.com/assets/profiles/user-1.jpg" },
    { image: "https://images.shadcnspace.com/assets/profiles/user-2.jpg" },
    { image: "https://images.shadcnspace.com/assets/profiles/user-3.jpg" },
    { image: "https://images.shadcnspace.com/assets/profiles/user-5.jpg" },
  ];

  const navigationData: NavigationSection[] = [
    { title: "Home", href: "#home", isActive: activeSection === "home" },
    { title: "Highlights", href: "#workflow", isActive: activeSection === "workflow" },
    { title: "Metrics", href: "#operations", isActive: activeSection === "operations" },
    { title: "Features", href: "#features", isActive: activeSection === "features" },
  ];

  const brandList: BrandList[] = [
    { image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-1.svg", lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg", name: "Brand 1" },
    { image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-2.svg", lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg", name: "Brand 2" },
    { image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-3.svg", lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg", name: "Brand 3" },
    { image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-4.svg", lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-4.svg", name: "Brand 4" },
    { image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-5.svg", lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-5.svg", name: "Brand 5" },
  ];

  return (
    <>
      <Header navigationData={navigationData} />
      <HeroSection avatarList={avatarList} />
      <BrandSlider brandList={brandList} />
      <FeatureHighlights />
      <PerformanceMetrics />
      <CoreFeatures />
      <CallToActionSection />
      <FooterMetrics />
    </>
  );
}