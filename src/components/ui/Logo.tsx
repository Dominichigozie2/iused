import Link from "next/link";
import clsx from "clsx";

export default function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="iUsed home" className={clsx("group inline-flex items-center gap-2", className)}>
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 shadow-lg shadow-brand-600/30 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" aria-hidden>
          <rect x="6.5" y="2.5" width="11" height="19" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10.5 18.2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m9.6 10.4 1.7 1.7 3.2-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </span>
      <span className={clsx("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
        <span className="text-brand-500">i</span>Used
      </span>
    </Link>
  );
}
