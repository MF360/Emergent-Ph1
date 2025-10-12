import React, { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
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
import { cn } from "../lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";

const navItems = [
  { id: "home", label: "HOME", icon: Home },
  { id: "solutions", label: "Solutions", icon: Package },
  { id: "features", label: "Features", icon: CircleDot },
  { id: "how-it-works", label: "How it Works", icon: Workflow },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "contact", label: "Contact Us", icon: Mail },
];

const Header = () => {
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // --- NEW LOGIC FOR SCROLLSPY ---
  useEffect(() => {
    // Options for the observer: activate when section is 50% visible
    const options = {
      root: null, // observes intersections relative to the viewport
      rootMargin: "0px",
      threshold: 0.5,
    };

    // Callback function to execute when a section enters/leaves view
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActivePage(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, options);

    // Observe each section
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.current?.observe(element);
      }
    });

    // Cleanup function to disconnect the observer when the component unmounts
    return () => {
      observer.current?.disconnect();
    };
  }, []); // Empty dependency array means this runs only once on mount

  const handleNavClick = (pageId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    // We still set activePage here for immediate feedback on click
    setActivePage(pageId);

    if (pageId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(pageId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    setMobileMenuOpen(false);
  };

  // ... (the rest of the component JSX remains exactly the same)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
