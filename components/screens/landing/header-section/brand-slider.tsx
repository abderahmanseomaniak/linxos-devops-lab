"use client";
import Image from "next/image";
import { Marquee } from "@/components/screens/landing/header-section/animations/marquee";
import { Typography } from "@/components/ui/typography";
import { LazyMotion, domAnimation } from "motion/react"
import * as m from "framer-motion/m";

const lightImages = ["/assets/logos/linx-noir.png", "/assets/logos/logo-texte-noir.png", "/assets/logos/image.png", "/assets/logos/LOGO-cmo-v2.png"];
const darkImages = ["/assets/logos/logo-texte-blanc.png", "/assets/logos/linx-blanch.png", "/assets/logos/image.png"];

function BrandSlider() {
  return (
    <section>
      <div className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <LazyMotion features={domAnimation}>
          <m.div
            className="flex flex-col gap-3"
          >
            <div className="flex justify-center text-center py-3 md:py-4 relative">
              <div className="flex items-center justify-center gap-4">
                <div className="hidden md:block h-0.5 w-40 bg-linear-to-l from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
                <Typography
                  variant="small"
                  className="sm:px-2 px-10 text-center"
                >
                  Loved by 1000+ big and small brands around the worlds
                </Typography>
                <div className="hidden md:block h-0.5 w-40 bg-linear-to-r from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
              </div>
            </div>
            <div className="py-4">
              <Marquee pauseOnHover className="[--duration:20s] p-0">
                {lightImages.map((src, i) => (
                  <Image key={`light-${i}`} src={src} alt="" width={144} height={32} className="mr-6 lg:mr-20 dark:hidden" unoptimized />
                ))}
                {darkImages.map((src, i) => (
                  <Image key={`dark-${i}`} src={src} alt="" width={144} height={32} className="hidden dark:inline-block mr-6 lg:mr-20" unoptimized />
                ))}
              </Marquee>
            </div>
          </m.div>
          </LazyMotion>
        </div>
      </div>
    </section>
  );
}

export default BrandSlider;
