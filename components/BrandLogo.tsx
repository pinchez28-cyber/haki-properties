import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  label?: string;
};

export default function BrandLogo({
  href = "/",
  label = "Haki Marketplace",
}: BrandLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span className="relative flex h-14 w-16 items-center justify-center rounded-2xl bg-[#0B5D3B] shadow-md ring-2 ring-[#D6A84F]/30">
        <svg
          viewBox="0 0 56 48"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d="M12 21 28 9l16 12"
            fill="none"
            stroke="#F8E7B0"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            d="M15 34c7-5 17-5 26 0"
            fill="none"
            stroke="#D6A84F"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M11 39c10-5 24-5 34 0"
            fill="none"
            stroke="#D6A84F"
            strokeLinecap="round"
            strokeWidth="2"
            opacity="0.75"
          />
        </svg>
        <span className="relative mt-1 rounded-md bg-[#0B5D3B]/80 px-1 text-base font-black tracking-tight text-white">
          HMP
        </span>
      </span>
      <span className="leading-tight">
        <span className="block text-xl font-black text-[#0B5D3B]">
          {label}
        </span>
        <span className="block text-xs font-semibold uppercase tracking-wide text-[#D6A84F]">
          Verified property deals
        </span>
      </span>
    </Link>
  );
}
