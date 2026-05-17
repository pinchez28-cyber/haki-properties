"use client";

import { useEffect, useState } from "react";

const shareText =
  "Haki Marketplace - verified homes, land, and real estate deals across East Africa.";

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("https://www.hakimarketplace.com");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  async function shareNative() {
    if (navigator.share) {
      await navigator.share({
        title: "Haki Marketplace",
        text: shareText,
        url,
      });
      return;
    }

    setIsOpen((current) => !current);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-xl border border-[#0B5D3B]/30 px-4 py-2 font-semibold text-[#0B5D3B] hover:bg-white"
      >
        Share
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-3 w-64 rounded-2xl border bg-white p-3 text-sm shadow-xl">
          <button
            type="button"
            onClick={shareNative}
            className="block w-full rounded-xl px-3 py-2 text-left font-semibold hover:bg-[#FAF8F2]"
          >
            Share from phone
          </button>
          <a
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            className="block rounded-xl px-3 py-2 font-semibold hover:bg-[#FAF8F2]"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            className="block rounded-xl px-3 py-2 font-semibold hover:bg-[#FAF8F2]"
          >
            Facebook
          </a>
          <a
            href={`mailto:?subject=Haki Marketplace&body=${encodedText}%0A%0A${encodedUrl}`}
            className="block rounded-xl px-3 py-2 font-semibold hover:bg-[#FAF8F2]"
          >
            Email
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="block w-full rounded-xl px-3 py-2 text-left font-semibold hover:bg-[#FAF8F2]"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
