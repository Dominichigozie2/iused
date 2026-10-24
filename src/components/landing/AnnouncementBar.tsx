import { BadgeCheck, Truck, ShieldCheck, RotateCcw, Sparkles, BatteryFull } from "lucide-react";

const items = [
  { icon: BadgeCheck, text: "Every device passes a 72-point inspection" },
  { icon: Truck, text: "Free express delivery on orders over $300" },
  { icon: ShieldCheck, text: "12-month iUsed warranty included" },
  { icon: RotateCcw, text: "30-day no-questions returns" },
  { icon: BatteryFull, text: "Battery health 85%+ guaranteed" },
  { icon: Sparkles, text: "Use code HELLO20 for $20 off your first order" },
];

export default function AnnouncementBar() {
  const row = [...items, ...items];
  return (
    <div className="relative z-50 overflow-hidden bg-navy-950 py-2 text-[12px] font-medium text-white/80">
      <div className="pause-on-hover mask-fade-x flex">
        <div className="flex shrink-0 animate-marquee gap-10 pr-10">
          {[...row, ...row].map(({ icon: Icon, text }, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
              <Icon className="size-3.5 text-brand-300" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
