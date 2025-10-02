"use client";

import { useState, useEffect } from "react";

interface OfferBannerProps {
  offerActive?: boolean; // only show if true
  message?: string;
  link?: string;
  linkText?: string;
}

export default function OfferBanner({
  offerActive = false,
  message = "",
  link,
  linkText = "Learn More",
}: OfferBannerProps) {
  const [visible, setVisible] = useState(offerActive);

  // Optional: sync with prop if offerActive changes dynamically
  useEffect(() => {
    setVisible(offerActive);
  }, [offerActive]);

  if (!visible || !message) return null;

  return (
    <div className="sticky top-0 flex justify-between w-full px-4 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 item s-center z-60 sm:text-base dark:bg-yellow-800 dark:text-yellow-50">
      <div className="flex-1 text-center sm:text-left">
        {message}{" "}
        {link && (
          <a
            href={link}
            className="ml-1 font-semibold underline hover:text-yellow-700 dark:hover:text-yellow-200"
          >
            {linkText}
          </a>
        )}
      </div>

      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-lg font-bold hover:text-yellow-700 dark:hover:text-yellow-200"
        aria-label="Close Offer Banner"
      >
        &times;
      </button>
    </div>
  );
}
