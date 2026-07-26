export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark--compact" : "brand-mark"} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <path d="M24 3 42 13.5 35.5 17 24 10.5 12.5 17 6 13.5 24 3Z" />
        <path d="M6 19.5 12.5 16 24 22.5 31.5 18l6.5 3.7L24 30 6 19.5Z" />
        <path d="m6 27 6.5-3.5L24 30l11.5-6.5L42 27 24 37.5 6 27Z" />
        <path d="m6 34.5 6.5-3.5L24 37.5 35.5 31l6.5 3.5L24 45 6 34.5Z" />
      </svg>
    </span>
  );
}
