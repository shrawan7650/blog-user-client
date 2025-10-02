"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const CategoriesNav = () => {
  const { items: categories, loading } = useSelector(
    (state: any) => state.categories
  );

  const pathname = usePathname();
  console.log("pathname", pathname);

  const hiddenRoutes = [
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/author/[uid]",
  ];

  if (hiddenRoutes.includes(pathname) || pathname.startsWith("/author/")) {
    return null;
  }

  return (
    <div className="container block p-1 bg-muted/50 dark:bg-slate-900 md:hidden">
      {/* block on mobile, hidden on md and above */}
      <nav className="relative border-b border-gray-200 dark:border-gray-700 bg-muted/50 dark:bg-slate-900">
        <div className="overflow-x-auto customized-scrollbar">
          {loading && categories.length === 0 ? (
            <ul className="flex gap-3 px-2 py-3 min-w-max">
              {Array.from({ length: 6 }).map((_, index) => (
                <li key={index} className="shrink-0">
                  <div className="animate-pulse px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium min-w-[120px] h-8 flex items-center justify-center" />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex gap-3 px-2 py-3 min-w-max">
              {categories.map((category: any) => (
                <li key={category.id} className="shrink-0">
                  <Link
                    href={`/category/${category.slug}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-full whitespace-nowrap hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
};

export default CategoriesNav;
