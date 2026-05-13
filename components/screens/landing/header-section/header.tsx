"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import { Typography } from "@/components/ui/typography";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export type NavigationSection = {
  title: string;
  href: string;
  isActive?: boolean;
};

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const CollaborateButton = ({ className }: { className?: string }) => (
  <Button
    className={cn(
      "relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden",
      className,
      "cursor-pointer",
    )}
  >
    <span className="relative z-10 transition-all duration-500">
      Start Workflow
    </span>

    <span className="absolute right-1 size-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
      <ArrowUpRight size={16} />
    </span>
  </Button>
);

const Header = ({ navigationData, className }: HeaderProps) => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  const handleScrollRef = useRef(handleScroll)
  handleScrollRef.current = handleScroll

  const handleResizeRef = useRef(handleResize)
  handleResizeRef.current = handleResize

  useEffect(() => {
    const onScroll = () => handleScrollRef.current()
    const onResize = () => handleResizeRef.current()

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={cn(
        "inset-x-0 z-50 px-4 flex items-center justify-center sticky top-0 h-20",
        className,
      )}
    >
      <div
        className={cn(
          "w-full max-w-6xl flex items-center justify-between gap-4 transition-all duration-500",
          sticky
            ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl rounded-full"
            : "bg-transparent border-transparent",
        )}
      >
        {/* LOGO (NO COMPONENT) */}
        <div>
          <Link href="/">
            <div className="relative h-10 w-[140px]">
              <Image
                src="/assets/logos/logo-texte-noir.png"
                alt="LinxOS"
                fill
                sizes="140px"
                priority
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <div>
          <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
            <NavigationMenuList className="flex gap-0">
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    href={navItem.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition",
                      navItem.isActive ? "bg-background text-foreground" : "",
                    )}
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA + MOBILE */}
        <div className="flex gap-4">
          <CollaborateButton className="hidden lg:flex" />

          {/* MOBILE MENU */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger>
                <span className="rounded-full border border-border p-2 block">
                  <Menu width={20} height={20} />
                </span>
              </SheetTrigger>

              <SheetContent
                showCloseButton={false}
                side="right"
                className="w-full sm:w-96 p-0"
              >
                {/* MOBILE HEADER */}
                <div className="flex items-center justify-between p-6">
                  <div className="relative h-8 w-[120px]">
                    <Image
                      src="/assets/logos/logo-texte-noir.svg"
                      alt="LinxOS"
                      fill
                      sizes="120px"
                      className="object-contain"
                    />
                  </div>

                  <SheetClose>
                    <span className="rounded-full border border-border p-2">
                      <X width={16} height={16} />
                    </span>
                  </SheetClose>
                </div>

                {/* MOBILE LINKS */}
                <div className="flex flex-col gap-10 px-6 pb-6">
                  <NavigationMenu orientation="vertical">
                    <NavigationMenuList className="flex flex-col gap-4">
                      {navigationData.map((item) => (
                        <NavigationMenuItem key={item.title}>
                          <NavigationMenuLink
                            href={item.href}
                            className={cn(
                              "text-2xl font-semibold transition",
                              item.isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {item.title}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>

                  <CollaborateButton />
                </div>

                {/* SOCIAL */}
                <div className="px-6 mt-auto pb-6 flex flex-col gap-4">
                  <div className="flex gap-3">
                    {[
                      "lucide:dribbble",
                      "lucide:instagram",
                      "lucide:twitter",
                      "lucide:linkedin",
                    ].map((icon) => (
                      <button
                        key={icon}
                        className="p-3 border rounded-full hover:bg-muted transition cursor-pointer"
                        aria-label={icon}
                      >
                        <Icon icon={icon} width={16} />
                      </button>
                    ))}
                  </div>

                  <Typography variant="small" className="text-muted-foreground">
                    © 2026 LinxOS
                  </Typography>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
