"use client";

import { useState, type KeyboardEvent } from "react";

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

function StarShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.75l2.955 6.187 6.795.727-5.025 4.634 1.336 6.702L12 17.9l-6.061 3.1 1.336-6.702-5.025-4.634 6.795-.727L12 2.75z" />
    </svg>
  );
}

interface DisplayStarRatingProps {
  interactive?: false;
  value: number;
  size?: number;
  className?: string;
}

interface InteractiveStarRatingProps {
  interactive: true;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  className?: string;
  /** Label for the whole star group, e.g. "Rating". */
  ariaLabel: string;
  /** Per-star accessible label, e.g. (n) => `${n} stars`. */
  getStarAriaLabel: (value: number) => string;
}

type StarRatingProps = DisplayStarRatingProps | InteractiveStarRatingProps;

/** Read-only stars, supporting a fractional value (e.g. 4.6) via a clipped overlay. */
function DisplayStars({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(5, value));
  const percent = (clamped / 5) * 100;

  return (
    <span
      className={`relative inline-flex shrink-0 ${className ?? ""}`}
      style={{ width: size * 5 + 4 * 4, height: size }}
      aria-hidden
    >
      <span className="absolute inset-y-0 left-0 flex gap-1 text-slate-200">
        {STAR_VALUES.map((star) => (
          <StarShape key={star} size={size} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex gap-1 overflow-hidden text-amber-400"
        style={{ width: `${percent}%` }}
      >
        {STAR_VALUES.map((star) => (
          <StarShape key={star} size={size} />
        ))}
      </span>
    </span>
  );
}

/** Interactive 1-5 star picker: click/tap to select, hover preview on desktop, arrow-key + Enter/Space accessible. */
function InteractiveStars({
  value,
  onChange,
  size = 28,
  className,
  ariaLabel,
  getStarAriaLabel,
}: Omit<InteractiveStarRatingProps, "interactive">) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(1, (value || 1) - 1));
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={`inline-flex gap-0.5 ${className ?? ""}`}
    >
      {STAR_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={getStarAriaLabel(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          onFocus={() => setHoverValue(star)}
          onBlur={() => setHoverValue(null)}
          onClick={() => onChange(star)}
          className={`rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            star <= displayValue ? "text-amber-400" : "text-slate-200"
          }`}
        >
          <StarShape size={size} />
        </button>
      ))}
    </div>
  );
}

/**
 * Star rating display/picker. Read-only mode (default) supports fractional
 * values for averages (e.g. 4.6); interactive mode is a 1-5 star picker with
 * hover preview, click/tap selection, and keyboard support.
 */
export default function StarRating(props: StarRatingProps) {
  if (props.interactive) {
    const { value, onChange, size, className, ariaLabel, getStarAriaLabel } = props;
    return (
      <InteractiveStars
        value={value}
        onChange={onChange}
        size={size}
        className={className}
        ariaLabel={ariaLabel}
        getStarAriaLabel={getStarAriaLabel}
      />
    );
  }

  const { value, size, className } = props;
  return <DisplayStars value={value} size={size} className={className} />;
}
