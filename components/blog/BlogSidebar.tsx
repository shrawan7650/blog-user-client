"use client";

import { AdSlot } from "@/components/ads/AdSlot";
import Link from "next/link";
import { useSelector } from "react-redux";

export function BlogSidebar() {
  const { items: categories, loading } = useSelector((state: any) => state.categories);

  return (
<div className="space-y-8">
  {/* Sticky Ad */}
  <div>
    <AdSlot slot="blog-sidebar" format="vertical" />
  </div>

  {/* Categories List */}
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Categories</h2>
    <div
      className="overflow-y-auto border rounded-lg shadow-lg bg-popover max-h-60 sm:max-h-80 md:max-h-96 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {loading ? (
        <div className="p-2 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-md bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="block px-4 py-3 text-sm transition-colors sm:py-2 hover:bg-accent sm:text-base"
          >
            <div className="flex items-center space-x-2">
              {category.icon && <span className="text-lg">{category.icon}</span>}
              <span>{category.name}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  </div>
</div>

  );
}
