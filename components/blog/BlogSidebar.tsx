"use client";
import { AdSlot } from "@/components/ads/AdSlot";

import Link from "next/link";
import { useSelector } from "react-redux";
import { TableOfContents } from "./TableOfContents";

export function BlogSidebar({ post }) {
  const { items: categories, loading } = useSelector((state: any) => state.categories);

  return (
    <div className="space-y-8">
      {/* Table of Contents - Add this as the first item */}
      <TableOfContents post={post} />
      
      {/* Sticky Ad */}
      {/* <div>
        <AdSlot slot="blog-sidebar" format="horizontal" />
      </div> */}

    

      {/* Debug info - Remove this in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-gray-500">
          <summary>Post Data (Dev Only)</summary>
          <pre className="p-2 mt-2 overflow-auto bg-gray-100 rounded max-h-40">
            {JSON.stringify(post, null, 2)}
          </pre>
        </details>
      )} */}
    </div>
  );
}