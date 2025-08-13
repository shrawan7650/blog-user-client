"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Home,
  Info,
  Mail,
  Grid3X3,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSearchModal } from "@/store/slices/uiSlice";

import type { Category } from "@/types/blog";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const { items: categories } = useAppSelector((state) => state.categories);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();

  const handleSearchClick = () => {
    dispatch(openSearchModal());
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      dispatch(openSearchModal());
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCategoryToggle = () => {
    setShowCategories(!showCategories);
  };
  // Update time every second
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time for IST
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format day and date for IST
  const formatDayDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/40 shadow-sm">
        <div className="container px-4 mx-auto lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-br from-primary to-primary/80 group-hover:shadow-md">
                <span className="text-lg font-bold text-primary-foreground">
                  T
                </span>
              </div>
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                TechBlog
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="items-center hidden space-x-8 md:flex">
              <Link
                href="/"
                className="relative px-2 py-1 text-sm font-medium transition-all duration-200 rounded-md hover:text-primary hover:bg-primary/5"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="relative px-2 py-1 text-sm font-medium transition-all duration-200 rounded-md hover:text-primary hover:bg-primary/5"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="relative px-2 py-1 text-sm font-medium transition-all duration-200 rounded-md hover:text-primary hover:bg-primary/5"
              >
                Contact
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchClick}
                className="items-center hidden space-x-2 transition-colors sm:flex hover:bg-accent/50"
              >
                <Search className="w-4 h-4" />
                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  ⌘K
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchClick}
                className="sm:hidden hover:bg-accent/50"
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="transition-colors hover:bg-accent/50"
              >
                <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
              </Button>
              <span className="hidden ml-2 text-xs sm:block text-muted-foreground">
                {currentTime && (
                  <>
                    {formatDayDate(currentTime)} {formatTime(currentTime)}
                  </>
                )}
              </span>
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="transition-colors md:hidden hover:bg-accent/50"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl
        border-r border-border/40 shadow-xl md:hidden
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <Link
            href="/"
            className="flex items-center space-x-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <span className="text-lg font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="text-xl font-bold">TechBlog</span>
            {/* //show simple ui time and day */}
          </Link>

          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="hover:bg-accent/50"
          >
            <X className="w-5 h-5" />
          </Button> */}
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full pb-16 overflow-y-auto">
          <div className="p-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center p-3 space-x-3 transition-all duration-200 rounded-xl hover:bg-primary/5 hover:text-primary group"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Home</span>
              </Link>

              {/* Categories Section */}
              <div className="py-2">
                <button
                  onClick={handleCategoryToggle}
                  className="flex items-center justify-between w-full p-3 transition-all duration-200 rounded-xl hover:bg-accent/50 group"
                >
                  <div className="flex items-center space-x-3">
                    <Grid3X3 className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">Categories</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showCategories ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Categories Dropdown */}
                <div
                  className={`
                  overflow-hidden transition-all duration-300 ease-out
                  ${
                    showCategories
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
                >
                  <div className="mt-2 ml-8 space-y-1 overflow-y-auto max-h-64 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:text-primary group"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-lg transition-transform group-hover:scale-110">
                          {category.icon}
                        </span>
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className="flex items-center p-3 space-x-3 transition-all duration-200 rounded-xl hover:bg-primary/5 hover:text-primary group"
                onClick={() => setIsOpen(false)}
              >
                <Info className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">About</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center p-3 space-x-3 transition-all duration-200 rounded-xl hover:bg-primary/5 hover:text-primary group"
                onClick={() => setIsOpen(false)}
              >
                <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Contact</span>
              </Link>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto border-t border-border/40">
            <div className="flex items-center p-3 space-x-3 rounded-xl bg-muted/30">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Welcome!</p>
                <p className="text-xs text-muted-foreground">
                  Explore our blog
                </p>
              </div>
            </div>
          </div>
          <div className="text-center">
            {" "}
            {currentTime && (
              <span>
                {formatDayDate(currentTime)} {formatTime(currentTime)}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
