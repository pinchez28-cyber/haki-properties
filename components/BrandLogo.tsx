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
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B5D3B] text-lg font-black text-white shadow-sm">
        H
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
