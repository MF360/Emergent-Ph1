import React, { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import {
  Menu,
  X,
  Home,
  Package,
  CircleDot,
  Workflow,
  DollarSign,
  Mail,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const navItems = [
  { id: "home", label: "HOME", icon: Home },
  { id: "solutions", label: "Solutions", icon: Package },
  { id: "features", label: "Features", icon: CircleDot },
  { id: "how-it-works", label: "How it Works", icon: Workflow },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "contact", label: "Contact Us", icon: Mail },
];

const Header: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const tickingRef = useRef(false);

  // compute rootMargin depending on viewport height.
  const computeRootMargin = () => {
    // pick top offset roughly equal to header height + some buffer
    const topBuffer = Math.round(window.innerHeight * 0.2); // 20% down the viewport
    const bottomBuffer = Math.round(window.innerHeight * 0.4); // bottom threshold
    return `-${topBuffer}px 0px -${bottomBuffer}px 0px`;
  };

  // find section elements by navItems ids
  const findSections = () => {
    const elements: HTMLElement[] = [];
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) elements.push(el);
    });
    sectionsRef.current = elements;
    return elements;
  };

  // fallback: determine nearest section to top (used if observer is unreliable)
  const findNearestSection = () => {
    const offset = 120; // how far from top to consider (accounts for sticky header)
    let nearestId = sectionsRef.current[0]?.id ?? "home";
    let smallest = Number.POSITIVE_INFINITY;
    sectionsRef.current.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - offset);
      if (distance < smallest) {
        smallest = distance;
        nearestId = el.id;
      }
    });
    return nearestId;
  };

  // initialize intersection observer
  const initObserver = () => {
    // disconnect existing observer
    observerRef.current?.disconnect();

    const elements = findSections();
    if (!elements.length) return false;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: computeRootMargin(),
      threshold: [0.15, 0.35, 0.6], // array of thresholds to be more responsive
    };

    observerRef.current = new IntersectionObserver((entries) => {
      // Filter for entries that are currently intersecting the viewport
      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting
      );

      if (intersectingEntries.length > 0) {
        // Among the intersecting entries, find the one with the largest intersection ratio
        const bestEntry = intersectingEntries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );
        setActivePage(bestEntry.target.id);
      } else {
        // Fallback to the nearest section if no entry is actively intersecting
        const nearest = findNearestSection();
        if (nearest) setActivePage(nearest);
      }
    }, options);

    elements.forEach((el) => observerRef.current?.observe(el));
    return true;
  };

  // Fallback scroll handler (throttled using requestAnimationFrame)
  const onScrollFallback = () => {
    if (!tickingRef.current) {
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const nearest = findNearestSection();
        if (nearest) setActivePage(nearest);
        tickingRef.current = false;
      });
    }
  };

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    // Try to initialize observer; if sections not mounted yet, retry a few times
    const tryInit = () => {
      attempts += 1;
      const ok = initObserver();
      if (!ok && attempts < maxAttempts) {
        setTimeout(tryInit, 150);
      } else if (!ok) {
        // final fallback: attach scroll listener only
        findSections();
        onScrollFallback();
      }
    };

    // initialize on mount and also on window load (helps if assets/SSR delay)
    tryInit();
    window.addEventListener("load", tryInit);

    // attach fallback scroll listener always (keeps it resilient)
    window.addEventListener("scroll", onScrollFallback, { passive: true });

    // on resize, recompute rootMargin and re-observe
    const onResize = () => {
      initObserver();
      onScrollFallback();
    };
    window.addEventListener("resize", onResize);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("load", tryInit);
      window.removeEventListener("scroll", onScrollFallback);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavClick = (pageId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage(pageId);
    setMobileMenuOpen(false);

    if (pageId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(pageId);
    if (el) {
      // use scroll margin offset if present; use smooth scroll
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((s) => !s);
  };

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

  return (
    <div className="sticky top-0 z-50 pt-8 px-4">
      <header className="w-full max-w-7xl mx-auto py-3 px-6 md:px-8 flex items-center justify-between">
        <div className="p-3">
          <Logo />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-3 rounded-2xl text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
          <div className="rounded-full px-1 py-1 backdrop-blur-md bg-background/80 border border-border shadow-lg">
            <ToggleGroup
              type="single"
              value={activePage}
              onValueChange={(value: string) => value && setActivePage(value)}
            >
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <ToggleGroupItem
                    key={item.id}
                    value={item.id}
                    className={cn(
                      "px-4 py-2 text-sm rounded-full transition-colors",
                      activePage === item.id
                        ? "text-accent-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={handleNavClick(item.id)}
                  >
                    <IconComponent size={16} className="inline-block mr-1.5" />
                    {item.label}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        </nav>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-background/95 backdrop-blur-md py-4 px-6 border border-border rounded-2xl shadow-lg z-50">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      activePage === item.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={handleNavClick(item.id)}
                  >
                    <IconComponent size={16} className="inline-block mr-2" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle for desktop */}
          {/* <div className="flex items-center gap-2 rounded-full px-3 py-2">
            <Moon
              size={18}
              className={`${
                theme === "dark" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary"
            />
            <Sun
              size={18}
              className={`${
                theme === "light" ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div> */}
          <div className="rounded-2xl">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Log in
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
