"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { CompactContactForm } from "@/components/compact-contact-form";

const footerLinks = {
  workshops: {
    title: "Workshops",
    links: [
      { name: "Alle workshops", href: "/onze-uitjes" },
      { name: "Kookworkshops", href: "/onze-uitjes?category=koken" },
      { name: "Creatieve workshops", href: "/onze-uitjes?category=creatief" },
      {
        name: "Teambuildinguitjes",
        href: "/onze-uitjes?category=teambuilding",
      },
    ],
  },
  company: {
    title: "Over ons",
    links: [
      { name: "Ons verhaal", href: "/ons-verhaal" },
      { name: "Onze medewerkers", href: "/onze-medewerkers" },
      { name: "Onze impact", href: "/onze-impact" },
      { name: "Ervaringen", href: "/jullie-ervaringen" },
    ],
  },
  support: {
    title: "Klantenservice",
    links: [
      { name: "Contact", href: "/contact" },
      { name: "Veelgestelde vragen", href: "/faq" },
      { name: "Boekingsvoorwaarden", href: "/voorwaarden" },
      { name: "Privacy", href: "/privacy" },
    ],
  },
};

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/goeduitje",
    icon: Instagram,
    color: "hover:text-pink-600",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/goeduitje",
    icon: Facebook,
    color: "hover:text-blue-600",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/goeduitje",
    icon: Linkedin,
    color: "hover:text-blue-700",
  },
];

interface FooterProps {
  logoUrl?: string;
}

export function Footer({
  logoUrl = "/images/logo/logo-footer.png",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src={logoUrl}
                alt="Goeduitje.nl - uitjes met een verhaal, om te janken zo goed"
                width={240}
                height={80}
                unoptimized={logoUrl.startsWith("http")}
                className="h-auto w-auto"
                style={{ maxWidth: "240px" }}
              />
            </Link>
            <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
              Workshops en teambuildinguitjes met een verhaal. Van Amsterdam tot
              Limburg, van koken tot kunst. Om te janken zo goed!
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`text-muted-foreground transition-all duration-300 ${social.color}`}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Workshops */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                {footerLinks.workshops.title}
              </h3>
              <ul className="space-y-3">
                {footerLinks.workshops.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                {footerLinks.company.title}
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                {footerLinks.support.title}
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-1">
            <CompactContactForm />
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-muted mt-12 border-t pt-8">
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="mailto:info@goeduitje.nl"
              className="hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>info@goeduitje.nl</span>
            </a>
            <a
              href="tel:+31612345678"
              className="hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+31 6 1234 5678</span>
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Nederland</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-muted/50 border-t">
        <div className="container mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
            <p>&copy; {currentYear} Goeduitje.nl. Alle rechten voorbehouden.</p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/voorwaarden"
                className="hover:text-foreground transition-colors"
              >
                Algemene voorwaarden
              </Link>
              <Link
                href="/cookies"
                className="hover:text-foreground transition-colors"
              >
                Cookiebeleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
