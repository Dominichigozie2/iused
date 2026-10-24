import { Star } from "lucide-react";

export default function Stars({ rating, reviews, size = 12 }: { rating: number; reviews?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-muted">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
          />
        ))}
      </div>
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews.toLocaleString()})</span>}
    </div>
  );
}
