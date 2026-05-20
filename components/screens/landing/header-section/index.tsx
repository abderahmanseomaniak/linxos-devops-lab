import HeroSection from "@/components/screens/landing/header-section/hero";
import type { NavigationSection } from "@/components/screens/landing/header-section/header";
import Header from "@/components/screens/landing/header-section/header";
import BrandSlider, {
  BrandList,
} from "@/components/screens/landing/header-section/brand-slider";
import type { AvatarList } from "@/components/screens/landing/header-section/hero";

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

  const brandList: BrandList[] = [
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-1.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg",
      name: "Brand 1",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-2.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg",
      name: "Brand 2",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-3.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg",
      name: "Brand 3",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-4.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-4.svg",
      name: "Brand 4",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-5.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-5.svg",
      name: "Brand 5",
    },
  ];

  return (
    <>
      <Header navigationData={navigationData} />
      <div className="relative">
        <main>
          <BrandSlider brandList={brandList} />
        </main>
      </div>
    </>
  );
}
