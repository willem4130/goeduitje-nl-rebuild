"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Instagram, Facebook, Linkedin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Onze uitjes", href: "/onze-uitjes" },
  { name: "Ons verhaal", href: "/ons-verhaal" },
  { name: "Onze medewerkers", href: "/onze-medewerkers" },
  { name: "Onze impact", href: "/onze-impact" },
  { name: "Jullie ervaringen", href: "/jullie-ervaringen" },
];

export function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Goeduitje.nl
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {/* Social Icons */}
          <div className="border-border flex items-center gap-3 border-l pl-6">
            <Link
              href="https://instagram.com/goeduitje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://facebook.com/goeduitje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com/company/goeduitje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="/booking"
              className="text-primary hover:text-primary/80 transition-colors"
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-1 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground hover:bg-accent block rounded-md px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
