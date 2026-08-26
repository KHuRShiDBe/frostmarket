"use client";

import { useState, type ChangeEvent } from "react";
import { useLocale } from "@/context/LocaleContext";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
        <path
          d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-6.5 10-6.5c2.1 0 3.8.6 5.2 1.5M22 12s-1.2 2.2-3.4 3.9M9.9 9.9a2.8 2.8 0 0 0 3.9 3.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  className,
  autoComplete,
}: {
  id?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className: string;
  autoComplete?: string;
}) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t.auth.password.hide : t.auth.password.show}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}
