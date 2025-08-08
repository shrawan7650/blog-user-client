"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Search, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { openSearchModal } from "@/store/slices/uiSlice";
import { categoriesService } from "@/services/categoriesService";
import type { Category } from "@/types/blog";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="text-xl font-bold">TechBlog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>

            {/* Categories Dropdown */}
            {/* <div
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <div className="flex items-center space-x-1 transition-colors cursor-pointer hover:text-primary">
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {showCategories && (
                <div className="absolute left-0 z-50 w-56 py-2 mt-2 overflow-y-auto border rounded-lg shadow-lg max-h-96 bg-popover">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div> */}

            <Link
              href="/about"
              className="transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchClick}
              className="items-center hidden space-x-2 sm:flex"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">⌘K</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchClick}
              className="sm:hidden"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t md:hidden bg-background">
          <div className="container px-4 py-4 mx-auto space-y-4">
            <Link
              href="/"
              className="block py-2 transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Categories
              </div>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block py-2 pl-4 transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/about"
              className="block py-2 transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
