"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, ShieldAlert, BookOpen, Info, Phone } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const NAV = [
  { href: "/#search", label: "Search", icon: Search },
  { href: "/#report", label: "Report a Scam", icon: ShieldAlert },
  { href: "/#guides", label: "Safety Guides", icon: BookOpen },
  { href: "/#about", label: "About", icon: Info },
  { href: "/#contact", label: "Contact", icon: Phone },
];

/** Site header — sticky, accessible, mobile-first. */
export function SiteHeader({ onNavigate }: { onNavigate?: (href: string) => void }) {
  const [open, setOpen] = useState(false);

  const handle = (href: string) => {
    setOpen(false);
    onNavigate?.(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo size={32} />

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handle(item.href)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild size="sm" variant="default" onClick={() => handle("/#report")}>
            <Link href="/#report">Report a Scam</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <Logo size={28} />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handle(item.href)}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/60 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto border-t border-border pt-4">
                <Button asChild className="w-full" onClick={() => handle("/#report")}>
                  <Link href="/#report">Report a Scam</Link>
                </Button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Check Before You Trust.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
