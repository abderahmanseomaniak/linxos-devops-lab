"use client";

import { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/screens/landing/header-section/hero";
import Header, { type NavigationSection } from "@/components/screens/landing/header-section/header";
import BrandSlider from "@/components/screens/landing/header-section/brand-slider";
import CoreFeatures from "@/components/screens/landing/core-features";
import PerformanceMetrics from "@/components/screens/landing/performance-metrics";
import FooterMetrics from "@/components/screens/landing/footer-metrics";
import CallToActionSection from "@/components/screens/landing/call-to-action-section";
import FeatureHighlights from "@/components/screens/landing/feature-highlights";

export default function LeadingPage() {
  const [activeSection, setActiveSection] = useState("home");

  const handleScroll = () => {
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
  };

  const handleScrollRef = useRef(handleScroll)

  useEffect(() => {
    handleScrollRef.current = handleScroll
  })

  useEffect(() => {
    const onScroll = () => handleScrollRef.current()
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigationData: NavigationSection[] = [
    { title: "Home", href: "#home", isActive: activeSection === "home" },
    { title: "Highlights", href: "#workflow", isActive: activeSection === "workflow" },
    { title: "Metrics", href: "#operations", isActive: activeSection === "operations" },
    { title: "Features", href: "#features", isActive: activeSection === "features" },
  ];

  return (
    <>
      <Header navigationData={navigationData} />
      <HeroSection />
      <BrandSlider />
      <FeatureHighlights />
      <PerformanceMetrics />
      <CoreFeatures />
      <CallToActionSection />
      <FooterMetrics />
    </>
  );
}