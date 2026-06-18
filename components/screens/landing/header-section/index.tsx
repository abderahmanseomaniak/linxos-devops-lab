import type { NavigationSection } from "@/components/screens/landing/header-section/header";
import Header from "@/components/screens/landing/header-section/header";
import BrandSlider from "@/components/screens/landing/header-section/brand-slider";

export default function AgencyHeroSection() {
  const navigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "#",
      isActive: true,
    },
    {
      title: "Workflow",
      href: "#",
    },
    {
      title: "Operations",
      href: "#",
    },
    {
      title: "Team",
      href: "#",
    },
  ];

  return (
    <>
      <Header navigationData={navigationData} />
      <div className="relative">
        <main>
          <BrandSlider />
        </main>
      </div>
    </>
  );
}
