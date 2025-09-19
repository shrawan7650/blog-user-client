// CategoriesSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/store/slices/categoriesSlice";
// import type { RootState } from "@/store";
import type { Category } from "@/types/blog";
import { RootState } from "@/store/store";

export function CategoriesSection() {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    // This dispatch will only actually run if categories are not loaded,
    // thanks to the `condition` option in fetchCategories thunk
    dispatch(fetchCategories() as any); // Type assertion to bypass the type error
  }, [dispatch]);

  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("categories-scroll");
    if (container) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;

      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };
  if (loading && categories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Explore Categories</h2>
        </div>

        <div
          id="categories-scroll"
          className="flex pb-4 space-x-4 overflow-x-auto scrollbar-hide"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group flex-shrink-0 bg-card border rounded-lg p-1 min-w-[200px] h-12 animate-pulse"
            >
              <div className="flex items-center justify-center h-full">
                <div className="w-24 h-3 bg-gray-300 rounded dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Explore Categories</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => scroll("right")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        id="categories-scroll"
        className="flex pb-4 space-x-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category: Category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex-shrink-0 bg-card hover:bg-accent border rounded-lg p-1 min-w-[200px] transition-all duration-200 hover:shadow-md"
          >
            <div className="text-center">
              <h3 className="font-semibold transition-colors group-hover:text-primary">
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
