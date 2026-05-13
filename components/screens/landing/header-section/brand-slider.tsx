"use client";
import Image from "next/image";
import { Marquee } from "@/components/screens/landing/header-section/animations/marquee";
import { Typography } from "@/components/ui/typography";
import { motion } from "motion/react";

export interface BrandList {
  image: string;
  name: string;
  lightimg: string;
}

function BrandSlider({ brandList }: { brandList: BrandList[] }) {
  return (
    <section>
      <div className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
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
            {brandList && brandList.length > 0 && (
              <div className="py-4">
                <Marquee pauseOnHover className="[--duration:20s] p-0">
                  {brandList.map((brand, index) => (
                    <div key={brand.name}>
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        width={144}
                        height={32}
                        className="mr-6 lg:mr-20 dark:hidden"
                        unoptimized
                      />
                      <Image
                        src={brand.lightimg}
                        alt={brand.name}
                        width={144}
                        height={32}
                        className="hidden dark:block mr-12 lg:mr-20"
                        unoptimized
                      />
                    </div>
                  ))}
                </Marquee>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BrandSlider;
