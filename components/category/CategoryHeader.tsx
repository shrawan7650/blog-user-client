import type { Category } from "@/types/blog";

interface CategoryHeaderProps {
  category: Category;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  console.log("CategoryHeader", category);

  return (
    <div className="py-10 text-center sm:py-14">
      {/* Title */}
      <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
      </h1>

      {/* Description */}
      {category.description && (
        <p className="max-w-2xl px-6 mx-auto text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg md:text-xl">
          {category.description}
        </p>
      )}
    </div>
  );
}
