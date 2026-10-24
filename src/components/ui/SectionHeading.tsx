"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  title: string;
  highlight?: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  light?: boolean;
  center?: boolean;
};

/** Section heading with a masked line-by-line reveal on scroll. */
export default function SectionHeading({ title, highlight, subtitle, eyebrow, action, light, center }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-sh]");
      gsap.from(items, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={clsx(
        "mb-8 flex flex-col gap-4 md:mb-10",
        center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={clsx("max-w-2xl", center && "mx-auto")}>
        {eyebrow && (
          <div className="overflow-hidden">
            <p
              data-sh
              className={clsx(
                "mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]",
                light ? "text-brand-300" : "text-brand-600",
              )}
            >
              <span className="h-px w-6 bg-current" />
              {eyebrow}
            </p>
          </div>
        )}
        <div className="overflow-hidden pb-1">
          <h2
            data-sh
            className={clsx(
              "text-3xl font-extrabold tracking-tight md:text-[2.6rem] md:leading-[1.1]",
              light ? "text-white" : "text-ink",
            )}
          >
            {title} {highlight && <span className={light ? "text-brand-300" : "text-gradient"}>{highlight}</span>}
          </h2>
        </div>
        {subtitle && (
          <div className="overflow-hidden">
            <p data-sh className={clsx("mt-3 text-sm md:text-base", light ? "text-white/60" : "text-muted")}>
              {subtitle}
            </p>
          </div>
        )}
      </div>
      {action && <div className="overflow-hidden"><div data-sh>{action}</div></div>}
    </div>
  );
}
