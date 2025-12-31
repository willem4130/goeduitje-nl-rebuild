"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Instagram, Facebook, Linkedin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Onze uitjes", href: "/onze-uitjes" },
  { name: "Ons verhaal", href: "/ons-verhaal" },
  { name: "Onze medewerkers", href: "/onze-medewerkers" },
  { name: "Onze impact", href: "/onze-impact" },
  { name: "Jullie ervaringen", href: "/jullie-ervaringen" },
];

interface TopNavigationProps {
  logoUrl?: string;
}

export function TopNavigation({
  logoUrl = "/images/logo/logo-nav.png",
}: TopNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll position for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={cn(
        "fixed top-0 z-50 w-full backdrop-blur-xl transition-all duration-300",
        isScrolled
          ? "bg-background/70 shadow-editorial"
          : "bg-background/95 shadow-editorial-sm"
      )}
    >
      <div className="container">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo - Brand Identity */}
          <Link
            href="/"
            className="pl-4 transition-opacity duration-300 hover:opacity-80 md:pl-8"
            aria-label="Goeduitje.nl - Home"
          >
            <Image
              src={logoUrl}
              alt="Goeduitje.nl - uitjes met een verhaal, om te janken zo goed"
              width={240}
              height={90}
              priority
              unoptimized={logoUrl.startsWith("http")}
              className="h-auto w-auto transition-all duration-300"
              style={{ maxHeight: isScrolled ? "48px" : "72px" }}
            />
          </Link>

          {/* Desktop Navigation - Sophisticated Hover States */}
          <div className="hidden items-center gap-8 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative text-sm font-medium tracking-wide transition-colors duration-300"
              >
                {item.name}
                {/* Animated underline on hover */}
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* Social Icons - Refined Spacing */}
            <div className="border-border flex items-center gap-3 border-l pl-6">
              <Link
                href="https://instagram.com/goeduitje"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com/goeduitje"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/company/goeduitje"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="/booking"
                className="text-primary hover:text-primary/80 transition-all duration-300 hover:-translate-y-[2px]"
                aria-label="Boek een workshop"
              >
                <Calendar className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <IconX className="size-5" />
            ) : (
              <IconMenu2 className="size-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Editorial Treatment */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="border-t md:hidden"
        >
          <div className="bg-background/95 backdrop-blur-xl">
            <div className="container space-y-1 py-6">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/50 block rounded-md px-4 py-3 text-base font-medium tracking-wide transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
