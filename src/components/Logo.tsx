function SnowflakeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2v20M4.2 6l15.6 12M4.2 18L19.8 6" />
        <path d="M12 2l-2 2.4M12 2l2 2.4M12 22l-2-2.4M12 22l2-2.4" />
        <path d="M4.2 6l3 .4M4.2 6l.6-3" />
        <path d="M19.8 6l-3 .4M19.8 6l-.6-3" />
        <path d="M4.2 18l3-.4M4.2 18l.6 3" />
        <path d="M19.8 18l-3-.4M19.8 18l-.6 3" />
      </g>
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex select-none items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_6px_rgba(2,50,90,0.35)] sm:h-10 sm:w-10">
        <SnowflakeIcon />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
        Frost<span className="text-sky-600">Market</span>
      </span>
    </span>
  );
}
